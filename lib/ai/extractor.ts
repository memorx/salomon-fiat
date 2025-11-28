// lib/ai/extractor.ts

import { getClaudeClient, analyzeImageWithClaude } from './providers/claude';
import {
  getOpenAIClient,
  analyzeImageBase64WithGPT4
} from './providers/openai';
import { analyzeImageWithGemini } from './providers/gemini';
import { getTipoCasoById } from '@/lib/config/tipos-caso';

// ============================================================================
// TIPOS
// ============================================================================

interface DocumentoParaProcesar {
  id: string;
  tipo: string; // ine_frente, ine_reverso, curp, escritura_propiedad, etc.
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
// MAPEO DE CAMPOS POR TIPO DE DOCUMENTO
// Qué campos se pueden extraer de cada tipo de documento
// ============================================================================

const CAMPOS_POR_DOCUMENTO: Record<string, string[]> = {
  ine_frente: [
    'nombre', // Se usa para vendedor o comprador según contexto
    'domicilio',
    'fecha_nacimiento',
    'curp',
    'clave_elector'
  ],
  ine_reverso: [
    'numero_ine', // IDMEX
    'seccion_electoral'
  ],
  curp: [
    'curp',
    'nombre_completo',
    'fecha_nacimiento',
    'sexo',
    'nacionalidad',
    'entidad_nacimiento'
  ],
  escritura_propiedad: [
    'antecedente_escritura_numero',
    'antecedente_escritura_fecha',
    'antecedente_notario_nombre',
    'antecedente_notario_numero',
    'registro_numero',
    'registro_tomo',
    'registro_libro',
    'registro_seccion',
    'registro_volumen',
    'registro_foja',
    'inmueble_calle',
    'inmueble_numero_lote',
    'inmueble_numero_manzana',
    'inmueble_fraccionamiento',
    'inmueble_colonia',
    'inmueble_municipio',
    'inmueble_estado',
    'inmueble_superficie',
    'lindero_norte',
    'lindero_sur',
    'lindero_oriente',
    'lindero_poniente',
    'antecedente_adquirente',
    'antecedente_enajenante'
  ],
  predial: [
    'inmueble_cuenta_predial',
    'inmueble_clave_catastral',
    'inmueble_valor_catastral',
    'inmueble_domicilio'
  ],
  avaluo: [
    'avaluo_numero',
    'avaluo_fecha',
    'avaluo_valor',
    'avaluo_perito',
    'inmueble_superficie',
    'inmueble_superficie_construccion'
  ],
  comprobante_domicilio: [
    'domicilio_calle',
    'domicilio_colonia',
    'domicilio_cp',
    'domicilio_municipio',
    'domicilio_estado'
  ],
  rfc: ['rfc', 'nombre_completo', 'domicilio_fiscal'],
  certificado_libertad_gravamen: [
    'gravamenes',
    'registro_numero',
    'folio_real'
  ],
  acta_constitutiva: [
    'sociedad_nombre',
    'constitucion_escritura_numero',
    'constitucion_escritura_fecha',
    'constitucion_notario_nombre',
    'constitucion_notario_numero',
    'representante_nombre',
    'representante_cargo'
  ]
};

// ============================================================================
// PROMPTS POR TIPO DE DOCUMENTO
// ============================================================================

function getPromptPorDocumento(tipoDocumento: string): string {
  const prompts: Record<string, string> = {
    ine_frente: `Analiza esta imagen de una credencial INE/IFE (frente) mexicana y extrae:
1. Nombre completo (exactamente como aparece)
2. Domicilio completo
3. Fecha de nacimiento
4. CURP (si es visible)
5. Clave de elector

Responde en JSON con el formato:
{
  "nombre": "valor o null",
  "domicilio": "valor o null",
  "fecha_nacimiento": "DD/MM/AAAA o null",
  "curp": "valor o null",
  "clave_elector": "valor o null",
  "confianza": 0.0-1.0
}`,

    ine_reverso: `Analiza esta imagen del reverso de una credencial INE/IFE mexicana y extrae:
1. Número IDMEX (código de barras/número de identificación)
2. Sección electoral

Responde en JSON:
{
  "numero_ine": "valor o null",
  "seccion_electoral": "valor o null",
  "confianza": 0.0-1.0
}`,

    curp: `Analiza este documento de CURP y extrae:
1. CURP completa (18 caracteres)
2. Nombre completo
3. Fecha de nacimiento
4. Sexo
5. Nacionalidad
6. Entidad de nacimiento

Responde en JSON:
{
  "curp": "valor",
  "nombre_completo": "valor",
  "fecha_nacimiento": "DD/MM/AAAA",
  "sexo": "HOMBRE/MUJER",
  "nacionalidad": "valor",
  "entidad_nacimiento": "valor",
  "confianza": 0.0-1.0
}`,

    escritura_propiedad: `Analiza esta escritura pública de propiedad y extrae los siguientes datos:

DATOS DE LA ESCRITURA:
- Número de escritura
- Fecha de la escritura
- Nombre del notario
- Número de notaría

DATOS DEL REGISTRO PÚBLICO:
- Número de registro/inscripción
- Tomo
- Libro
- Sección
- Volumen
- Foja
- Partida

DATOS DEL INMUEBLE:
- Ubicación/calle
- Número de lote
- Número de manzana
- Nombre del fraccionamiento
- Colonia
- Municipio
- Estado
- Superficie en metros cuadrados

LINDEROS:
- Al Norte (medida y colindancia)
- Al Sur (medida y colindancia)
- Al Oriente (medida y colindancia)
- Al Poniente (medida y colindancia)

PARTES:
- Nombre del adquirente (quien compró)
- Nombre del enajenante (quien vendió)

Responde en JSON con todos los campos que puedas identificar.`,

    predial: `Analiza este recibo de predial y extrae:
1. Número de cuenta predial
2. Clave catastral
3. Valor catastral
4. Dirección del inmueble

Responde en JSON:
{
  "inmueble_cuenta_predial": "valor",
  "inmueble_clave_catastral": "valor",
  "inmueble_valor_catastral": "valor",
  "inmueble_domicilio": "valor",
  "confianza": 0.0-1.0
}`,

    avaluo: `Analiza este documento de avalúo y extrae:
1. Número de avalúo
2. Fecha del avalúo
3. Valor del avalúo
4. Nombre del perito valuador
5. Superficie del terreno
6. Superficie de construcción

Responde en JSON con los campos encontrados.`
  };

  return (
    prompts[tipoDocumento] ||
    `Analiza este documento y extrae toda la información relevante. Responde en formato JSON.`
  );
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE EXTRACCIÓN
// ============================================================================

export async function extraerDatosConIA(
  params: ExtraerDatosParams
): Promise<ResultadoExtraccion> {
  const inicio = Date.now();

  try {
    const { tipoCaso, documentos, modelo } = params;

    if (documentos.length === 0) {
      return {
        exito: false,
        error: 'No hay documentos para procesar',
        tiempoProcesamiento: Date.now() - inicio
      };
    }

    // Procesar cada documento
    const resultados: Record<string, Record<string, DatoExtraido>> = {};

    for (const doc of documentos) {
      try {
        const prompt = getPromptPorDocumento(doc.tipo);
        let respuestaTexto: string;

        // Llamar al modelo de IA correspondiente
        switch (modelo) {
          case 'claude':
            respuestaTexto = await analyzeImageWithClaude(
              doc.base64,
              doc.mimeType as
                | 'image/jpeg'
                | 'image/png'
                | 'image/webp'
                | 'image/gif',
              prompt
            );
            break;
          case 'gpt4':
            respuestaTexto = await analyzeImageBase64WithGPT4(
              doc.base64,
              doc.mimeType,
              prompt
            );
            break;
          case 'gemini':
            respuestaTexto = await analyzeImageWithGemini(
              doc.base64,
              doc.mimeType,
              prompt
            );
            break;
          default:
            respuestaTexto = await analyzeImageWithClaude(
              doc.base64,
              doc.mimeType as
                | 'image/jpeg'
                | 'image/png'
                | 'image/webp'
                | 'image/gif',
              prompt
            );
        }

        // Parsear respuesta JSON
        const datosDoc = parsearRespuestaIA(respuestaTexto, doc.tipo);

        // Agregar a resultados
        if (!resultados[doc.tipo]) {
          resultados[doc.tipo] = {};
        }

        for (const [campo, valor] of Object.entries(datosDoc)) {
          resultados[doc.tipo][campo] = {
            valor: valor as string,
            confianza: datosDoc.confianza || 0.7,
            fuente: getNombreDocumento(doc.tipo),
            requiereRevision: (datosDoc.confianza || 0.7) < 0.8
          };
        }
      } catch (docError) {
        console.error(`Error procesando documento ${doc.tipo}:`, docError);
        // Continuar con el siguiente documento
      }
    }

    // Consolidar datos extraídos
    const datosConsolidados = consolidarDatos(resultados, tipoCaso);

    // Identificar campos faltantes
    const tipoCasoConfig = getTipoCasoById(tipoCaso);
    const camposRequeridos =
      tipoCasoConfig?.camposRequeridos
        .filter((c) => c.requerido)
        .map((c) => c.id) || [];

    const camposFaltantes = camposRequeridos.filter(
      (campo) => !datosConsolidados.general?.[campo]?.valor
    );

    return {
      exito: true,
      datosExtraidos: datosConsolidados,
      camposFaltantes,
      sugerencias: generarSugerencias(camposFaltantes),
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

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function parsearRespuestaIA(
  respuesta: string,
  tipoDocumento: string
): Record<string, any> {
  try {
    // Buscar JSON en la respuesta
    const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No se encontró JSON en la respuesta');
      return { confianza: 0.3 };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error('Error parseando respuesta:', error);
    return { confianza: 0.3 };
  }
}

function getNombreDocumento(tipo: string): string {
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
    acta_constitutiva: 'Acta Constitutiva'
  };
  return nombres[tipo] || tipo;
}

function consolidarDatos(
  resultadosPorDocumento: Record<string, Record<string, DatoExtraido>>,
  tipoCaso: string
): Record<string, Record<string, DatoExtraido>> {
  const consolidado: Record<string, Record<string, DatoExtraido>> = {
    general: {}
  };

  // Mapeo de campos extraídos a campos del formulario
  const mapeo: Record<string, string> = {
    // INE -> Vendedor (por defecto, se puede reasignar)
    nombre: 'vendedor_nombre',
    domicilio: 'vendedor_domicilio',
    fecha_nacimiento: 'vendedor_fecha_nacimiento',
    curp: 'vendedor_curp',
    numero_ine: 'vendedor_ine',

    // CURP
    nombre_completo: 'vendedor_nombre',
    nacionalidad: 'vendedor_nacionalidad',

    // Escritura
    antecedente_escritura_numero: 'antecedente_escritura_numero',
    antecedente_escritura_fecha: 'antecedente_escritura_fecha',
    antecedente_notario_nombre: 'antecedente_notario_nombre',
    antecedente_notario_numero: 'antecedente_notario_numero',
    registro_numero: 'registro_numero',
    registro_tomo: 'registro_tomo',
    registro_libro: 'registro_libro',
    registro_seccion: 'registro_seccion',
    registro_volumen: 'registro_volumen',
    registro_foja: 'registro_foja',

    // Inmueble
    inmueble_calle: 'inmueble_calle',
    inmueble_numero_lote: 'inmueble_numero_lote',
    inmueble_numero_manzana: 'inmueble_numero_manzana',
    inmueble_fraccionamiento: 'inmueble_fraccionamiento',
    inmueble_colonia: 'inmueble_colonia',
    inmueble_municipio: 'inmueble_municipio',
    inmueble_estado: 'inmueble_estado',
    inmueble_superficie: 'inmueble_superficie',
    inmueble_cuenta_predial: 'inmueble_cuenta_predial',
    inmueble_clave_catastral: 'inmueble_clave_catastral',
    inmueble_valor_catastral: 'inmueble_valor_catastral',

    // Linderos
    lindero_norte: 'lindero_norte',
    lindero_sur: 'lindero_sur',
    lindero_oriente: 'lindero_oriente',
    lindero_poniente: 'lindero_poniente',

    // Avalúo
    avaluo_numero: 'avaluo_numero',
    avaluo_fecha: 'avaluo_fecha',
    avaluo_valor: 'avaluo_valor',
    avaluo_perito: 'avaluo_perito',

    // RFC
    rfc: 'vendedor_rfc'
  };

  // Consolidar todos los datos
  for (const [tipoDoc, datos] of Object.entries(resultadosPorDocumento)) {
    for (const [campo, valor] of Object.entries(datos)) {
      if (campo === 'confianza') continue;

      const campoDestino = mapeo[campo] || campo;

      // Si ya existe el campo, mantener el de mayor confianza
      if (consolidado.general[campoDestino]) {
        if (valor.confianza > consolidado.general[campoDestino].confianza) {
          consolidado.general[campoDestino] = valor;
        }
      } else {
        consolidado.general[campoDestino] = valor;
      }
    }
  }

  return consolidado;
}

function generarSugerencias(camposFaltantes: string[]): string[] {
  const sugerencias: string[] = [];

  if (camposFaltantes.some((c) => c.includes('vendedor'))) {
    sugerencias.push(
      'Sube el INE del vendedor para extraer sus datos personales'
    );
  }
  if (camposFaltantes.some((c) => c.includes('comprador'))) {
    sugerencias.push(
      'Sube el INE del comprador para extraer sus datos personales'
    );
  }
  if (
    camposFaltantes.some(
      (c) => c.includes('antecedente') || c.includes('registro')
    )
  ) {
    sugerencias.push(
      'Sube la escritura de propiedad para extraer los antecedentes registrales'
    );
  }
  if (
    camposFaltantes.some((c) => c.includes('inmueble') || c.includes('lindero'))
  ) {
    sugerencias.push(
      'Sube la escritura anterior o el avalúo para los datos del inmueble'
    );
  }
  if (camposFaltantes.some((c) => c.includes('precio'))) {
    sugerencias.push('El precio de venta debe ser ingresado manualmente');
  }

  return sugerencias;
}
