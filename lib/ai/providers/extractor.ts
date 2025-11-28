// lib/ai/extractor.ts

import { getClaudeClient } from './providers/claude';
import { getOpenAIClient } from './providers/openai';
import { getGeminiClient } from './providers/gemini';
import { TIPOS_CASO, getTipoCasoById } from '@/lib/config/tipos-caso';

interface DocumentoParaProcesar {
  id: string;
  tipo: string;
  url: string;
}

interface ExtraerDatosParams {
  casoId: string;
  tipoCaso: string;
  documentos: DocumentoParaProcesar[];
  modelo: 'claude' | 'gpt4' | 'gemini';
}

interface DatoExtraido {
  valor: string | null;
  confianza: number;
  fuente?: string;
  requiereRevision: boolean;
}

interface ResultadoExtraccion {
  exito: boolean;
  datosExtraidos?: Record<string, Record<string, DatoExtraido>>;
  camposFaltantes?: string[];
  sugerencias?: string[];
  tiempoProcesamiento: number;
  error?: string;
}

// Prompt base para extracción de datos
function generarPromptExtraccion(tipoCaso: string, campos: string[]): string {
  const tipoCasoInfo = getTipoCasoById(tipoCaso);
  const nombreTipo = tipoCasoInfo?.nombre || tipoCaso;

  return `Eres un asistente especializado en análisis de documentos legales para notarías mexicanas.

Tu tarea es extraer información de los documentos proporcionados para un trámite de tipo: "${nombreTipo}".

CAMPOS A EXTRAER:
${campos.map((campo) => `- ${campo}`).join('\n')}

INSTRUCCIONES:
1. Analiza cuidadosamente cada documento proporcionado.
2. Extrae los valores para cada campo solicitado.
3. Si un campo no se puede determinar con certeza, indica que requiere revisión.
4. Asigna un nivel de confianza (0.0 a 1.0) a cada extracción.
5. Indica de qué documento se extrajo cada dato.

RESPONDE EN EL SIGUIENTE FORMATO JSON:
{
  "datos": {
    "nombre_campo": {
      "valor": "valor extraído o null si no se encontró",
      "confianza": 0.95,
      "fuente": "INE" | "CURP" | "Escritura" | etc,
      "requiereRevision": false
    }
  },
  "camposFaltantes": ["campo1", "campo2"],
  "sugerencias": ["Sugerencia 1", "Sugerencia 2"]
}

IMPORTANTE:
- Para nombres, usa el formato "NOMBRE(S) APELLIDO_PATERNO APELLIDO_MATERNO"
- Para CURP, verifica que tenga 18 caracteres alfanuméricos
- Para fechas, usa formato ISO (YYYY-MM-DD)
- Para montos, usa números sin formato (sin comas ni símbolos)
- Si detectas inconsistencias entre documentos, márcalo como requiereRevision=true`;
}

// Función principal de extracción
export async function extraerDatosConIA(
  params: ExtraerDatosParams
): Promise<ResultadoExtraccion> {
  const inicio = Date.now();

  try {
    const { tipoCaso, documentos, modelo } = params;

    // Obtener campos requeridos para este tipo de caso
    const tipoCasoConfig = getTipoCasoById(tipoCaso);
    const campos = tipoCasoConfig?.camposRequeridos.map((c) => c.nombre) || [];

    if (campos.length === 0) {
      return {
        exito: false,
        error: 'Tipo de caso no tiene campos configurados',
        tiempoProcesamiento: Date.now() - inicio
      };
    }

    // Generar prompt
    const prompt = generarPromptExtraccion(tipoCaso, campos);

    // Preparar descripción de documentos para el prompt
    const documentosDescripcion = documentos
      .map((doc) => `- ${doc.tipo}: ${doc.url}`)
      .join('\n');

    const mensajeCompleto = `${prompt}\n\nDOCUMENTOS A ANALIZAR:\n${documentosDescripcion}\n\nExtrae la información de estos documentos.`;

    // Llamar al modelo de IA correspondiente
    let respuesta: string;

    switch (modelo) {
      case 'claude':
        respuesta = await llamarClaude(mensajeCompleto, documentos);
        break;
      case 'gpt4':
        respuesta = await llamarGPT4(mensajeCompleto, documentos);
        break;
      case 'gemini':
        respuesta = await llamarGemini(mensajeCompleto, documentos);
        break;
      default:
        respuesta = await llamarClaude(mensajeCompleto, documentos);
    }

    // Parsear respuesta JSON
    const resultado = parsearRespuestaIA(respuesta);

    return {
      exito: true,
      datosExtraidos: resultado.datos,
      camposFaltantes: resultado.camposFaltantes,
      sugerencias: resultado.sugerencias,
      tiempoProcesamiento: Date.now() - inicio
    };
  } catch (error) {
    console.error('Error en extracción de datos:', error);
    return {
      exito: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      tiempoProcesamiento: Date.now() - inicio
    };
  }
}

// Llamar a Claude
async function llamarClaude(
  prompt: string,
  documentos: DocumentoParaProcesar[]
): Promise<string> {
  const client = getClaudeClient();

  // TODO: Implementar visión para analizar imágenes de documentos
  // Por ahora, solo procesamos el texto del prompt

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
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

// Llamar a GPT-4
async function llamarGPT4(
  prompt: string,
  documentos: DocumentoParaProcesar[]
): Promise<string> {
  const client = getOpenAIClient();

  // TODO: Implementar visión para analizar imágenes de documentos

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}

// Llamar a Gemini
async function llamarGemini(
  prompt: string,
  documentos: DocumentoParaProcesar[]
): Promise<string> {
  const client = getGeminiClient();

  // TODO: Implementar visión para analizar imágenes de documentos

  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// Parsear respuesta de la IA
function parsearRespuestaIA(respuesta: string): {
  datos: Record<string, Record<string, DatoExtraido>>;
  camposFaltantes: string[];
  sugerencias: string[];
} {
  try {
    // Intentar extraer JSON de la respuesta
    const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró JSON en la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Organizar datos por sección
    const datosOrganizados: Record<string, Record<string, DatoExtraido>> = {
      general: {}
    };

    if (parsed.datos) {
      for (const [campo, valor] of Object.entries(parsed.datos)) {
        datosOrganizados.general[campo] = valor as DatoExtraido;
      }
    }

    return {
      datos: datosOrganizados,
      camposFaltantes: parsed.camposFaltantes || [],
      sugerencias: parsed.sugerencias || []
    };
  } catch (error) {
    console.error('Error al parsear respuesta de IA:', error);
    return {
      datos: {},
      camposFaltantes: [],
      sugerencias: [
        'Error al procesar la respuesta de la IA. Por favor, revise los datos manualmente.'
      ]
    };
  }
}
