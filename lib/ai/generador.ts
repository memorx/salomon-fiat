// lib/ai/generador.ts

import { getClaudeClient } from './providers/claude';
import { getOpenAIClient } from './providers/openai';
import { getGeminiClient } from './providers/gemini';
import { getTipoCasoById, NOMBRES_SECCIONES } from '@/lib/config/tipos-caso';

interface GenerarDocumentoParams {
  tipoCaso: string;
  datos: Record<string, any>;
  plantilla?: string;
  modelo: 'claude' | 'gpt4' | 'gemini';
}

interface ResultadoGeneracion {
  exito: boolean;
  contenido?: string;
  tiempoProcesamiento: number;
  error?: string;
}

// Prompt para generación de documentos legales
function generarPromptDocumento(
  tipoCaso: string,
  datos: Record<string, any>,
  plantilla?: string
): string {
  const tipoCasoInfo = getTipoCasoById(tipoCaso);
  const nombreTipo = tipoCasoInfo?.nombre || tipoCaso;

  const datosFormateados = formatearDatosParaPrompt(datos);

  const promptBase = `Eres un experto redactor de documentos legales notariales en México.

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

  if (plantilla) {
    return `${promptBase}

PLANTILLA BASE A UTILIZAR:
${plantilla}

Adapta la plantilla con los datos proporcionados, manteniendo la estructura general.`;
  }

  return promptBase;
}

// Formatear datos para incluir en el prompt
function formatearDatosParaPrompt(datos: Record<string, any>): string {
  const lineas: string[] = [];

  for (const [seccion, campos] of Object.entries(datos)) {
    const nombreSeccion = NOMBRES_SECCIONES[seccion] || seccion;
    lineas.push(`\n### ${nombreSeccion}`);

    if (typeof campos === 'object' && campos !== null) {
      for (const [campo, valor] of Object.entries(campos)) {
        if (valor && typeof valor === 'object' && 'valor' in valor) {
          // Es un DatoExtraido
          lineas.push(`- ${campo}: ${valor.valor || '[No disponible]'}`);
        } else {
          lineas.push(`- ${campo}: ${valor || '[No disponible]'}`);
        }
      }
    } else {
      lineas.push(`- ${seccion}: ${campos || '[No disponible]'}`);
    }
  }

  return lineas.join('\n');
}

// Función principal de generación
export async function generarDocumentoConIA(
  params: GenerarDocumentoParams
): Promise<ResultadoGeneracion> {
  const inicio = Date.now();

  try {
    const { tipoCaso, datos, plantilla, modelo } = params;

    // Generar prompt
    const prompt = generarPromptDocumento(tipoCaso, datos, plantilla);

    // Llamar al modelo de IA correspondiente
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

    // Validar que se generó contenido
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

// Generar con Claude
async function generarConClaude(prompt: string): Promise<string> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}

// Generar con GPT-4
async function generarConGPT4(prompt: string): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}

// Generar con Gemini
async function generarConGemini(prompt: string): Promise<string> {
  const client = getGeminiClient();

  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// Función para modificar documento existente con chat
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
