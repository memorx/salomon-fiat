// lib/ai/extractor.ts

import { getClaudeClient } from './providers/claude';
import { getOpenAIClient } from './providers/openai';
import { getGeminiClient } from './providers/gemini';
import { getTipoCasoById } from '@/lib/config/tipos-caso';

// ============================================================================
// TIPOS
// ============================================================================

interface DocumentoParaProcesar {
  id: string;
  tipo: string;
  base64: string;
  mimeType: string;
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

// ============================================================================
// PROMPTS POR TIPO DE DOCUMENTO
// ============================================================================

const PROMPTS_DOCUMENTO: Record<string, string> = {
  ine_frente: `Analiza esta imagen del frente de una credencial INE/IFE mexicana.
Extrae los siguientes datos en formato JSON:
{
  "nombre_completo": "nombre tal como aparece",
  "domicilio": "dirección completa",
  "fecha_nacimiento": "DD/MM/AAAA",
  "curp": "18 caracteres alfanuméricos",
  "clave_elector": "clave de elector",
  "seccion": "número de sección",
  "vigencia": "año de vigencia"
}
Solo responde con el JSON, sin texto adicional.`,

  ine_reverso: `Analiza esta imagen del reverso de una credencial INE/IFE mexicana.
Extrae los siguientes datos en formato JSON:
{
  "numero_ine": "número IDMEX que aparece",
  "ocr": "código OCR si es visible",
  "cic": "código CIC si es visible"
}
Solo responde con el JSON, sin texto adicional.`,

  curp: `Analiza esta imagen de un documento CURP.
Extrae los siguientes datos en formato JSON:
{
  "curp": "18 caracteres",
  "nombre_completo": "nombre completo",
  "fecha_nacimiento": "DD/MM/AAAA",
  "sexo": "H o M",
  "nacionalidad": "nacionalidad",
  "entidad_nacimiento": "estado de nacimiento"
}
Solo responde con el JSON, sin texto adicional.`,

  escritura_propiedad: `Analiza esta imagen de una escritura pública de propiedad.
Extrae los siguientes datos en formato JSON:
{
  "numero_escritura": "número de la escritura",
  "fecha_escritura": "fecha de la escritura",
  "notario_nombre": "nombre del notario",
  "notario_numero": "número de notaría",
  "vendedor_nombre": "nombre del vendedor/enajenante",
  "comprador_nombre": "nombre del comprador/adquirente",
  "inmueble_ubicacion": "ubicación del inmueble",
  "inmueble_superficie": "superficie en m2",
  "inmueble_colonia": "colonia",
  "inmueble_municipio": "municipio",
  "inmueble_estado": "estado",
  "lindero_norte": "colindancia norte",
  "lindero_sur": "colindancia sur",
  "lindero_oriente": "colindancia oriente",
  "lindero_poniente": "colindancia poniente",
  "registro_numero": "número de inscripción en registro",
  "registro_fecha": "fecha de inscripción",
  "registro_distrito": "distrito registral"
}
Solo responde con el JSON, sin texto adicional.`,

  predial: `Analiza esta imagen de un recibo predial.
Extrae los siguientes datos en formato JSON:
{
  "cuenta_predial": "número de cuenta predial",
  "clave_catastral": "clave catastral",
  "valor_catastral": "valor catastral",
  "propietario": "nombre del propietario",
  "domicilio_inmueble": "dirección del inmueble",
  "superficie_terreno": "superficie de terreno",
  "superficie_construccion": "superficie de construcción"
}
Solo responde con el JSON, sin texto adicional.`,

  avaluo: `Analiza esta imagen de un avalúo comercial.
Extrae los siguientes datos en formato JSON:
{
  "numero_avaluo": "número de avalúo",
  "fecha_avaluo": "fecha del avalúo",
  "valor_avaluo": "valor comercial",
  "perito_nombre": "nombre del perito valuador",
  "inmueble_ubicacion": "ubicación del inmueble",
  "superficie_terreno": "superficie de terreno m2",
  "superficie_construccion": "superficie de construcción m2"
}
Solo responde con el JSON, sin texto adicional.`,

  comprobante_domicilio: `Analiza esta imagen de un comprobante de domicilio.
Extrae los siguientes datos en formato JSON:
{
  "titular": "nombre del titular",
  "calle": "nombre de la calle",
  "numero": "número exterior",
  "colonia": "colonia",
  "cp": "código postal",
  "municipio": "municipio o delegación",
  "estado": "estado"
}
Solo responde con el JSON, sin texto adicional.`,

  certificado_libertad_gravamen: `Analiza esta imagen de un certificado de libertad de gravamen.
Extrae los siguientes datos en formato JSON:
{
  "folio_real": "número de folio real",
  "propietario": "nombre del propietario actual",
  "gravamenes": "descripción de gravámenes o 'LIBRE DE GRAVÁMENES'",
  "fecha_expedicion": "fecha de expedición",
  "registro_numero": "número de inscripción",
  "inmueble_ubicacion": "ubicación del inmueble"
}
Solo responde con el JSON, sin texto adicional.`,

  rfc: `Analiza esta imagen de una constancia de RFC.
Extrae los siguientes datos en formato JSON:
{
  "rfc": "RFC completo",
  "nombre_completo": "nombre o razón social",
  "domicilio_fiscal": "domicilio fiscal",
  "regimen_fiscal": "régimen fiscal"
}
Solo responde con el JSON, sin texto adicional.`,

  acta_constitutiva: `Analiza esta imagen de un acta constitutiva.
Extrae los siguientes datos en formato JSON:
{
  "denominacion_social": "nombre de la sociedad",
  "tipo_sociedad": "tipo de sociedad (SA, SAPI, etc)",
  "fecha_constitucion": "fecha de constitución",
  "notario_nombre": "nombre del notario",
  "notario_numero": "número de notaría",
  "representante_legal": "nombre del representante legal",
  "objeto_social": "objeto social resumido",
  "capital_social": "capital social"
}
Solo responde con el JSON, sin texto adicional.`,

  otro: `Analiza esta imagen de un documento legal.
Identifica qué tipo de documento es y extrae toda la información relevante que puedas encontrar.
Responde en formato JSON con los datos que identifiques.
Solo responde con el JSON, sin texto adicional.`
};

// ============================================================================
// MAPEO DE CAMPOS EXTRAÍDOS A CAMPOS DEL FORMULARIO
// ============================================================================

const MAPEO_CAMPOS: Record<string, Record<string, string>> = {
  ine_frente: {
    nombre_completo: 'vendedor_nombre',
    domicilio: 'vendedor_domicilio',
    fecha_nacimiento: 'vendedor_fecha_nacimiento',
    curp: 'vendedor_curp',
    clave_elector: 'vendedor_ine'
  },
  curp: {
    curp: 'vendedor_curp',
    nombre_completo: 'vendedor_nombre',
    fecha_nacimiento: 'vendedor_fecha_nacimiento',
    entidad_nacimiento: 'vendedor_lugar_origen'
  },
  escritura_propiedad: {
    numero_escritura: 'antecedente_escritura_numero',
    fecha_escritura: 'antecedente_escritura_fecha',
    notario_nombre: 'antecedente_notario_nombre',
    notario_numero: 'antecedente_notario_numero',
    inmueble_ubicacion: 'inmueble_calle',
    inmueble_superficie: 'inmueble_superficie',
    inmueble_colonia: 'inmueble_colonia',
    inmueble_municipio: 'inmueble_municipio',
    inmueble_estado: 'inmueble_estado',
    lindero_norte: 'lindero_norte',
    lindero_sur: 'lindero_sur',
    lindero_oriente: 'lindero_oriente',
    lindero_poniente: 'lindero_poniente',
    registro_numero: 'registro_numero',
    registro_fecha: 'registro_fecha',
    registro_distrito: 'registro_distrito'
  },
  predial: {
    cuenta_predial: 'inmueble_cuenta_predial',
    clave_catastral: 'inmueble_clave_catastral',
    valor_catastral: 'inmueble_valor_catastral',
    domicilio_inmueble: 'inmueble_calle',
    superficie_terreno: 'inmueble_superficie',
    superficie_construccion: 'inmueble_superficie_construccion'
  },
  avaluo: {
    numero_avaluo: 'avaluo_numero',
    fecha_avaluo: 'avaluo_fecha',
    valor_avaluo: 'avaluo_valor',
    perito_nombre: 'avaluo_perito'
  },
  comprobante_domicilio: {
    calle: 'vendedor_domicilio',
    colonia: 'vendedor_colonia',
    cp: 'vendedor_cp'
  },
  rfc: {
    rfc: 'vendedor_rfc',
    nombre_completo: 'vendedor_nombre'
  }
};

// ============================================================================
// FUNCIÓN PRINCIPAL DE EXTRACCIÓN
// ============================================================================

export async function extraerDatosConIA(
  params: ExtraerDatosParams
): Promise<ResultadoExtraccion> {
  const inicio = Date.now();

  try {
    const { tipoCaso, documentos, modelo } = params;

    console.log(`Iniciando extracción para ${documentos.length} documentos`);

    // Obtener configuración del tipo de caso
    const tipoCasoConfig = getTipoCasoById(tipoCaso);
    const camposRequeridos =
      tipoCasoConfig?.camposRequeridos
        .filter((c) => c.requerido)
        .map((c) => c.id) || [];

    // Procesar cada documento
    const datosConsolidados: Record<string, Record<string, DatoExtraido>> = {};

    for (const doc of documentos) {
      console.log(`Procesando documento tipo: ${doc.tipo}`);

      try {
        const prompt = PROMPTS_DOCUMENTO[doc.tipo] || PROMPTS_DOCUMENTO.otro;

        // Llamar a la IA con visión
        const respuesta = await procesarDocumentoConVision(
          doc.base64,
          doc.mimeType,
          prompt,
          modelo
        );

        // Parsear respuesta JSON
        const datosDoc = parsearRespuestaJSON(respuesta);

        if (datosDoc) {
          // Mapear campos extraídos a campos del formulario
          const mapeo = MAPEO_CAMPOS[doc.tipo] || {};
          const seccion = doc.tipo;

          if (!datosConsolidados[seccion]) {
            datosConsolidados[seccion] = {};
          }

          for (const [campoOriginal, valor] of Object.entries(datosDoc)) {
            const campoDestino = mapeo[campoOriginal] || campoOriginal;

            // Solo guardar si tiene valor
            if (valor && String(valor).trim()) {
              datosConsolidados[seccion][campoDestino] = {
                valor: String(valor),
                confianza: 0.85,
                fuente: getNombreTipoDocumento(doc.tipo),
                requiereRevision: false
              };
            }
          }
        }
      } catch (docError) {
        console.error(`Error procesando documento ${doc.tipo}:`, docError);
      }
    }

    // Consolidar datos de múltiples documentos en una sola estructura
    const datosFinales: Record<string, Record<string, DatoExtraido>> = {
      extraidos: {}
    };

    for (const [_seccion, campos] of Object.entries(datosConsolidados)) {
      for (const [campo, datos] of Object.entries(campos)) {
        // Si el campo ya existe, mantener el de mayor confianza
        if (
          !datosFinales.extraidos[campo] ||
          datos.confianza > datosFinales.extraidos[campo].confianza
        ) {
          datosFinales.extraidos[campo] = datos;
        }
      }
    }

    // Identificar campos faltantes
    const camposExtraidos = Object.keys(datosFinales.extraidos);
    const camposFaltantes = camposRequeridos.filter(
      (c) => !camposExtraidos.includes(c)
    );

    // Generar sugerencias
    const sugerencias = generarSugerencias(
      camposFaltantes,
      documentos.map((d) => d.tipo)
    );

    return {
      exito: true,
      datosExtraidos: datosFinales,
      camposFaltantes,
      sugerencias,
      tiempoProcesamiento: Date.now() - inicio
    };
  } catch (error) {
    console.error('Error en extracción:', error);
    return {
      exito: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      tiempoProcesamiento: Date.now() - inicio
    };
  }
}

// ============================================================================
// PROCESAMIENTO CON VISIÓN AI
// ============================================================================

async function procesarDocumentoConVision(
  base64: string,
  mimeType: string,
  prompt: string,
  modelo: 'claude' | 'gpt4' | 'gemini'
): Promise<string> {
  switch (modelo) {
    case 'claude':
      return procesarConClaude(base64, mimeType, prompt);
    case 'gpt4':
      return procesarConGPT4(base64, mimeType, prompt);
    case 'gemini':
      return procesarConGemini(base64, mimeType, prompt);
    default:
      return procesarConClaude(base64, mimeType, prompt);
  }
}

async function procesarConClaude(
  base64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const client = getClaudeClient();

  const mediaType = mimeType as
    | 'image/jpeg'
    | 'image/png'
    | 'image/webp'
    | 'image/gif';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ]
  });

  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}

async function procesarConGPT4(
  base64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64}`
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}

async function procesarConGemini(
  base64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const imagePart = {
    inlineData: {
      data: base64,
      mimeType
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
}

// ============================================================================
// HELPERS
// ============================================================================

function parsearRespuestaJSON(respuesta: string): Record<string, any> | null {
  try {
    // Limpiar la respuesta de markdown code blocks
    let jsonStr = respuesta
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Intentar encontrar JSON en la respuesta
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return null;
  } catch (error) {
    console.error('Error parseando JSON:', error);
    return null;
  }
}

function getNombreTipoDocumento(tipo: string): string {
  const nombres: Record<string, string> = {
    ine_frente: 'INE (Frente)',
    ine_reverso: 'INE (Reverso)',
    curp: 'CURP',
    escritura_propiedad: 'Escritura de Propiedad',
    predial: 'Recibo Predial',
    avaluo: 'Avalúo',
    comprobante_domicilio: 'Comprobante de Domicilio',
    rfc: 'Constancia RFC',
    certificado_libertad_gravamen: 'Certificado de Libertad de Gravamen',
    acta_constitutiva: 'Acta Constitutiva',
    otro: 'Documento'
  };
  return nombres[tipo] || tipo;
}

function generarSugerencias(
  camposFaltantes: string[],
  tiposDocumentos: string[]
): string[] {
  const sugerencias: string[] = [];

  // Sugerencias basadas en campos faltantes
  const necesitaINE = camposFaltantes.some(
    (c) =>
      c.includes('nombre') ||
      c.includes('curp') ||
      c.includes('ine') ||
      c.includes('domicilio')
  );

  const necesitaEscritura = camposFaltantes.some(
    (c) =>
      c.includes('antecedente') ||
      c.includes('registro') ||
      c.includes('lindero')
  );

  const necesitaPredial = camposFaltantes.some(
    (c) =>
      c.includes('cuenta_predial') ||
      c.includes('clave_catastral') ||
      c.includes('valor_catastral')
  );

  if (necesitaINE && !tiposDocumentos.includes('ine_frente')) {
    sugerencias.push(
      'Sube el INE del vendedor y comprador para extraer datos personales'
    );
  }

  if (necesitaEscritura && !tiposDocumentos.includes('escritura_propiedad')) {
    sugerencias.push(
      'Sube la escritura anterior para extraer antecedentes de propiedad'
    );
  }

  if (necesitaPredial && !tiposDocumentos.includes('predial')) {
    sugerencias.push('Sube el recibo predial para extraer datos catastrales');
  }

  if (camposFaltantes.length > 10) {
    sugerencias.push(
      'Revisa que los documentos estén bien escaneados y legibles'
    );
  }

  return sugerencias;
}
