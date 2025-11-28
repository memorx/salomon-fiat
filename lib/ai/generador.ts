// lib/ai/generador.ts

import { getClaudeClient } from './providers/claude';
import { getOpenAIClient } from './providers/openai';
import { getGeminiClient } from './providers/gemini';
import { getTipoCasoById, NOMBRES_SECCIONES } from '@/lib/config/tipos-caso';
import {
  obtenerPlantilla,
  procesarPlantilla,
  validarDatosPlantilla,
  formatearPrecioLegal
} from '@/lib/templates';

// ============================================================================
// TIPOS
// ============================================================================

interface GenerarDocumentoParams {
  tipoCaso: string;
  datos: Record<string, any>;
  plantillaPersonalizada?: string;
  modelo: 'claude' | 'gpt4' | 'gemini';
  usarPlantillaBase?: boolean;
}

interface ResultadoGeneracion {
  exito: boolean;
  contenido?: string;
  contenidoMarkdown?: string;
  tiempoProcesamiento: number;
  error?: string;
  advertencias?: string[];
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE GENERACIÓN
// ============================================================================

export async function generarDocumentoConIA(
  params: GenerarDocumentoParams
): Promise<ResultadoGeneracion> {
  const inicio = Date.now();

  try {
    const {
      tipoCaso,
      datos,
      plantillaPersonalizada,
      modelo,
      usarPlantillaBase = true
    } = params;

    // Aplanar datos si vienen anidados
    const datosAplanados = aplanarDatos(datos);

    // Si hay plantilla base, usarla primero
    if (usarPlantillaBase) {
      const plantilla =
        plantillaPersonalizada || (await obtenerPlantilla(tipoCaso));

      if (plantilla) {
        // Validar datos
        const validacion = validarDatosPlantilla(datosAplanados);

        if (!validacion.valido) {
          // Si faltan datos críticos, intentar generar con IA
          console.log(
            'Faltan campos, usando IA para completar:',
            validacion.faltantes
          );
        }

        // Procesar precio si existe
        if (
          datosAplanados.operacion_precio &&
          !datosAplanados.operacion_precio_letra
        ) {
          const precioNumero = parseFloat(
            datosAplanados.operacion_precio.replace(/[^0-9.]/g, '')
          );
          if (!isNaN(precioNumero)) {
            datosAplanados.operacion_precio_letra =
              formatearPrecioLegal(precioNumero);
          }
        }

        // Procesar plantilla con los datos
        const contenidoBase = procesarPlantilla(plantilla, datosAplanados);

        // Mejorar con IA si hay secciones incompletas
        const contenidoFinal = await mejorarConIA(
          contenidoBase,
          datosAplanados,
          tipoCaso,
          modelo
        );

        return {
          exito: true,
          contenido: contenidoFinal,
          contenidoMarkdown: contenidoFinal,
          tiempoProcesamiento: Date.now() - inicio,
          advertencias: validacion.valido
            ? []
            : [`Campos faltantes: ${validacion.faltantes.join(', ')}`]
        };
      }
    }

    // Si no hay plantilla, generar completamente con IA
    const prompt = generarPromptDocumento(tipoCaso, datosAplanados);

    let contenido: string;
    switch (modelo) {
      case 'claude':
        contenido = await generarConClaude(prompt);
        break;
      case 'gpt4':
        contenido = await generarConGPT4(prompt);
        break;
      case 'gemini':
        contenido = await generarConGemini(prompt);
        break;
      default:
        contenido = await generarConClaude(prompt);
    }

    if (!contenido || contenido.trim().length < 100) {
      return {
        exito: false,
        error: 'El documento generado está vacío o es muy corto',
        tiempoProcesamiento: Date.now() - inicio
      };
    }

    return {
      exito: true,
      contenido,
      contenidoMarkdown: contenido,
      tiempoProcesamiento: Date.now() - inicio
    };
  } catch (error) {
    console.error('Error en generación de documento:', error);
    return {
      exito: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      tiempoProcesamiento: Date.now() - inicio
    };
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function aplanarDatos(datos: Record<string, any>): Record<string, string> {
  const resultado: Record<string, string> = {};

  for (const [clave, valor] of Object.entries(datos)) {
    if (typeof valor === 'object' && valor !== null) {
      if ('valor' in valor) {
        // Es un DatoExtraido
        resultado[clave] = valor.valor || '';
      } else {
        // Es un objeto anidado
        const subDatos = aplanarDatos(valor);
        for (const [subClave, subValor] of Object.entries(subDatos)) {
          resultado[subClave] = subValor;
        }
      }
    } else {
      resultado[clave] = String(valor || '');
    }
  }

  return resultado;
}

async function mejorarConIA(
  contenidoBase: string,
  datos: Record<string, string>,
  tipoCaso: string,
  modelo: 'claude' | 'gpt4' | 'gemini'
): Promise<string> {
  // Verificar si hay secciones incompletas (marcadas con {{variable}})
  const variablesSinProcesar = contenidoBase.match(/\{\{[^}]+\}\}/g);

  if (!variablesSinProcesar || variablesSinProcesar.length === 0) {
    return contenidoBase;
  }

  // Construir prompt para completar
  const prompt = `Eres un experto en documentos legales notariales mexicanos.

Se te proporciona un documento parcialmente completado. Tu tarea es:
1. Completar las secciones que tienen marcadores {{variable}} con texto apropiado
2. Si no hay suficiente información para completar un campo, usar "[PENDIENTE: descripción]"
3. Mantener el formato y estructura del documento
4. Asegurar que el lenguaje sea formal y jurídico

DOCUMENTO A COMPLETAR:
${contenidoBase}

DATOS DISPONIBLES:
${JSON.stringify(datos, null, 2)}

Devuelve el documento completo con todas las variables procesadas.`;

  let contenidoMejorado: string;

  switch (modelo) {
    case 'claude':
      contenidoMejorado = await generarConClaude(prompt);
      break;
    case 'gpt4':
      contenidoMejorado = await generarConGPT4(prompt);
      break;
    case 'gemini':
      contenidoMejorado = await generarConGemini(prompt);
      break;
    default:
      contenidoMejorado = await generarConClaude(prompt);
  }

  return contenidoMejorado || contenidoBase;
}

function generarPromptDocumento(
  tipoCaso: string,
  datos: Record<string, string>
): string {
  const tipoCasoInfo = getTipoCasoById(tipoCaso);
  const nombreTipo = tipoCasoInfo?.nombre || tipoCaso;

  const datosFormateados = formatearDatosParaPrompt(datos);

  return `Eres un experto redactor de documentos legales notariales en México.

Tu tarea es generar un documento legal de tipo: "${nombreTipo}"

DATOS PROPORCIONADOS:
${datosFormateados}

INSTRUCCIONES:
1. Genera un documento legal completo y profesional.
2. Usa lenguaje jurídico formal apropiado para documentos notariales mexicanos.
3. Incluye todas las cláusulas estándar para este tipo de documento.
4. Asegúrate de que el documento cumpla con los requisitos legales mexicanos.
5. Usa los datos proporcionados en los lugares apropiados.
6. Si faltan datos críticos, indica [PENDIENTE: descripción] donde corresponda.

FORMATO DE SALIDA:
- Genera el documento en formato Markdown.
- Usa encabezados para las secciones principales.
- Incluye espacios para firmas al final.
- El documento debe estar listo para impresión.`;
}

function formatearDatosParaPrompt(datos: Record<string, string>): string {
  const lineas: string[] = [];

  // Agrupar por prefijo
  const grupos: Record<string, Record<string, string>> = {};

  for (const [clave, valor] of Object.entries(datos)) {
    if (!valor) continue;

    const partes = clave.split('_');
    const grupo = partes[0];

    if (!grupos[grupo]) {
      grupos[grupo] = {};
    }
    grupos[grupo][clave] = valor;
  }

  for (const [grupo, campos] of Object.entries(grupos)) {
    const nombreGrupo = NOMBRES_SECCIONES[grupo] || grupo;
    lineas.push(`\n### ${nombreGrupo}`);

    for (const [campo, valor] of Object.entries(campos)) {
      const nombreCampo = campo
        .replace(/_/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
      lineas.push(`- ${nombreCampo}: ${valor}`);
    }
  }

  return lineas.join('\n');
}

// ============================================================================
// LLAMADAS A MODELOS DE IA
// ============================================================================

async function generarConClaude(prompt: string): Promise<string> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}

async function generarConGPT4(prompt: string): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0]?.message?.content || '';
}

async function generarConGemini(prompt: string): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// ============================================================================
// MODIFICAR DOCUMENTO EXISTENTE (CHAT)
// ============================================================================

export async function modificarDocumentoConChat(
  documentoActual: string,
  instruccion: string,
  modelo: 'claude' | 'gpt4' | 'gemini' = 'claude'
): Promise<ResultadoGeneracion> {
  const inicio = Date.now();

  try {
    const prompt = `Eres un asistente legal especializado en documentos notariales mexicanos.

DOCUMENTO ACTUAL:
${documentoActual}

INSTRUCCIÓN DEL USUARIO:
${instruccion}

TAREA:
Modifica el documento según la instrucción del usuario. 
Mantén el formato y estructura general.
Devuelve el documento completo con las modificaciones aplicadas.
Si la instrucción no es clara o podría afectar la validez legal, indica las preocupaciones.`;

    let contenido: string;

    switch (modelo) {
      case 'claude':
        contenido = await generarConClaude(prompt);
        break;
      case 'gpt4':
        contenido = await generarConGPT4(prompt);
        break;
      case 'gemini':
        contenido = await generarConGemini(prompt);
        break;
      default:
        contenido = await generarConClaude(prompt);
    }

    return {
      exito: true,
      contenido,
      tiempoProcesamiento: Date.now() - inicio
    };
  } catch (error) {
    console.error('Error al modificar documento:', error);
    return {
      exito: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      tiempoProcesamiento: Date.now() - inicio
    };
  }
}
