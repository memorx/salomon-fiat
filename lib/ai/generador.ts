// lib/ai/generador.ts

import { getClaudeClient } from './providers/claude';
import { getOpenAIClient } from './providers/openai';
import { getGeminiClient } from './providers/gemini';
import { getTipoCasoById, NOMBRES_SECCIONES } from '@/lib/config/tipos-caso';

// ============================================================================
// TIPOS
// ============================================================================

interface GenerarDocumentoParams {
  tipoCaso: string;
  datos: Record<string, any>;
  plantillaId?: string;
  plantilla?: string; // Contenido de la plantilla
  modelo: 'claude' | 'gpt4' | 'gemini';
  usarPlantillaBase?: boolean;
}

interface ResultadoGeneracion {
  exito: boolean;
  contenido?: string;
  tiempoProcesamiento: number;
  error?: string;
  camposFaltantes?: string[];
}

// ============================================================================
// PLANTILLA BASE - COMPRAVENTA INMUEBLE (Michoacán)
// ============================================================================

const PLANTILLA_COMPRAVENTA = `# ESCRITURA PÚBLICA NÚMERO {{numero_escritura}}

## COMPRAVENTA DE {{inmueble_tipo | uppercase}}

En la ciudad de {{notario_ciudad}}, {{notario_estado}}, siendo las {{fecha_hora}} horas del día {{fecha_dia}} de {{fecha_mes}} del año {{fecha_ano}}, ante mí, **{{notario_nombre}}**, Notario Público Número **{{notario_numero}}** del Estado de {{notario_estado}}, con residencia en esta ciudad, comparecen:

---

## COMPARECIENTES

### PARTE VENDEDORA:

**{{vendedor_nombre}}**, de nacionalidad {{vendedor_nacionalidad}}, {{vendedor_estado_civil}}, {{vendedor_ocupacion}}, originario de {{vendedor_lugar_origen}}, con domicilio en {{vendedor_domicilio}}{{#if vendedor_colonia}}, Colonia {{vendedor_colonia}}{{/if}}{{#if vendedor_cp}}, C.P. {{vendedor_cp}}{{/if}}, quien se identifica con credencial para votar expedida por el Instituto Nacional Electoral, con clave de elector {{vendedor_ine}}, con CURP {{vendedor_curp}} y RFC {{vendedor_rfc}}.

{{#if vendedor_conyuge_nombre}}
Comparece junto con su cónyuge **{{vendedor_conyuge_nombre}}**, originario de {{vendedor_conyuge_lugar_origen}}.
{{/if}}

### PARTE COMPRADORA:

**{{comprador_nombre}}**, de nacionalidad {{comprador_nacionalidad}}, {{comprador_estado_civil}}, {{comprador_ocupacion}}, originario de {{comprador_lugar_origen}}, con domicilio en {{comprador_domicilio}}{{#if comprador_colonia}}, Colonia {{comprador_colonia}}{{/if}}{{#if comprador_cp}}, C.P. {{comprador_cp}}{{/if}}, quien se identifica con credencial para votar expedida por el Instituto Nacional Electoral, con clave de elector {{comprador_ine}}, con CURP {{comprador_curp}} y RFC {{comprador_rfc}}.

{{#if comprador2_nombre}}
Comparece también **{{comprador2_nombre}}**, con CURP {{comprador2_curp}}, para adquirir en partes iguales proindiviso.
{{/if}}

---

## ANTECEDENTE REGISTRAL

El inmueble objeto de esta escritura se encuentra inscrito en el Registro Público de la Propiedad del Distrito de **{{registro_distrito}}**, bajo el número de inscripción **{{registro_numero}}**{{#if registro_tomo}}, Tomo {{registro_tomo}}{{/if}}{{#if registro_libro}}, Libro {{registro_libro}}{{/if}}{{#if registro_seccion}}, Sección {{registro_seccion}}{{/if}}, de fecha {{registro_fecha}}, derivado de la Escritura Pública número **{{antecedente_escritura_numero}}**, de fecha {{antecedente_escritura_fecha}}, pasada ante la fe del **{{antecedente_notario_nombre}}**, Notario Público número **{{antecedente_notario_numero}}** del Estado de {{notario_estado}}.

---

## DECLARACIONES

**I.** Declara la parte vendedora que es legítima propietaria del inmueble objeto de este contrato, el cual se encuentra libre de todo gravamen, limitación de dominio, adeudo fiscal, afectación agraria, o cualquier otro derecho de terceros que pudiera afectar la propiedad.

**II.** Declara la parte vendedora que es su voluntad enajenar el inmueble descrito en favor de la parte compradora.

**III.** Declara la parte compradora que es su voluntad adquirir el inmueble en los términos y condiciones establecidos en este instrumento.

**IV.** Declaran ambas partes que el inmueble se encuentra al corriente en el pago del Impuesto Predial, según consta en el recibo de pago con cuenta predial número **{{inmueble_cuenta_predial}}**.

**V.** Declaran las partes que el inmueble tiene asignada la clave catastral número **{{inmueble_clave_catastral}}**{{#if inmueble_valor_catastral}}, con valor catastral de \${{inmueble_valor_catastral}} ({{inmueble_valor_catastral_letra}} PESOS 00/100 M.N.){{/if}}.

{{#if avaluo_numero}}
**VI.** El avalúo del inmueble fue practicado por el perito valuador **{{avaluo_perito}}**, con número de avalúo {{avaluo_numero}}, de fecha {{avaluo_fecha}}, arrojando un valor comercial de \${{avaluo_valor}} ({{avaluo_valor_letra}} PESOS 00/100 M.N.).
{{/if}}

---

## CLÁUSULAS

**PRIMERA.- OBJETO DEL CONTRATO.** La parte vendedora vende, cede y transfiere en pleno dominio a la parte compradora, y ésta adquiere, el inmueble descrito en este instrumento.

**SEGUNDA.- PRECIO.** El precio pactado por la compraventa es la cantidad de **\${{operacion_precio}}** (**{{operacion_precio_letra}} PESOS 00/100 MONEDA NACIONAL**), que la parte compradora paga a la parte vendedora en este acto mediante {{operacion_forma_pago}}, por lo que la parte vendedora otorga el más amplio recibo que en derecho proceda.

**TERCERA.- UBICACIÓN DEL INMUEBLE.** El inmueble objeto de este contrato se encuentra ubicado en:

**{{inmueble_calle}} Número {{inmueble_numero_casa}}**{{#if inmueble_fraccionamiento}}, Fraccionamiento {{inmueble_fraccionamiento}}{{/if}}, Colonia **{{inmueble_colonia}}**{{#if inmueble_colonia_anterior}} (antes {{inmueble_colonia_anterior}}){{/if}}, C.P. {{inmueble_cp}}, en el Municipio de **{{inmueble_municipio}}**, Distrito de **{{inmueble_distrito}}**, Estado de **{{inmueble_estado}}**.

**CUARTA.- SUPERFICIE Y MEDIDAS.** El inmueble tiene una superficie de terreno de **{{inmueble_superficie}} metros cuadrados**{{#if inmueble_superficie_construccion}}, con una superficie de construcción de **{{inmueble_superficie_construccion}} metros cuadrados**{{/if}}, y cuenta con las siguientes medidas y colindancias:

- **AL NORTE:** {{lindero_norte}}
- **AL SUR:** {{lindero_sur}}
- **AL ORIENTE:** {{lindero_oriente}}
- **AL PONIENTE:** {{lindero_poniente}}
{{#if lindero_nororiente}}
- **AL NORORIENTE:** {{lindero_nororiente}}
{{/if}}
{{#if lindero_surponiente}}
- **AL SURPONIENTE:** {{lindero_surponiente}}
{{/if}}

**QUINTA.- TRADICIÓN.** La parte vendedora hace entrega real y material de la posesión del inmueble a la parte compradora en este mismo acto, quien la recibe a su entera satisfacción.

**SEXTA.- SANEAMIENTO PARA EL CASO DE EVICCIÓN.** La parte vendedora se obliga al saneamiento para el caso de evicción, en los términos del Código Civil vigente en el Estado.

**SÉPTIMA.- GASTOS Y DERECHOS.** Los gastos, derechos e impuestos que genere la presente escritura serán por cuenta de la parte compradora.

**OCTAVA.- JURISDICCIÓN.** Para todo lo relacionado con la interpretación y cumplimiento de este contrato, las partes se someten a la jurisdicción de los tribunales competentes del Distrito Judicial de {{inmueble_distrito}}, {{inmueble_estado}}, renunciando al fuero que por razón de su domicilio presente o futuro pudiera corresponderles.

---

## GENERALES

Para constancia, los comparecientes manifiestan sus datos generales de identificación:

**VENDEDOR:**
- Nombre: {{vendedor_nombre}}
- CURP: {{vendedor_curp}}
- RFC: {{vendedor_rfc}}
- INE: {{vendedor_ine}}

**COMPRADOR:**
- Nombre: {{comprador_nombre}}
- CURP: {{comprador_curp}}
- RFC: {{comprador_rfc}}
- INE: {{comprador_ine}}

---

## CERTIFICACIÓN NOTARIAL

YO, EL NOTARIO, **CERTIFICO:**

**PRIMERO.-** Que tengo a la vista los documentos que acreditan la legítima propiedad del inmueble, así como la personalidad de los comparecientes.

**SEGUNDO.-** Que me cercioré de la identidad de los comparecientes mediante la exhibición de sus credenciales para votar vigentes.

**TERCERO.-** Que a mi juicio, los comparecientes tienen capacidad legal para celebrar este acto jurídico.

**CUARTO.-** Que leí en voz alta este instrumento a los comparecientes, explicándoles el valor y consecuencias legales de su contenido, y manifestando su conformidad, lo ratifican y firman al margen y al calce.

**QUINTO.-** Que esta escritura se asienta en el Volumen del Protocolo a mi cargo, correspondiente al presente año.

---

**DOY FE.**

---

{{notario_nombre}}
NOTARIO PÚBLICO NÚMERO {{notario_numero}}
{{notario_ciudad}}, {{notario_estado}}

---

_____________________________
**{{vendedor_nombre}}**
PARTE VENDEDORA

_____________________________
**{{comprador_nombre}}**
PARTE COMPRADORA
`;

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

export async function generarDocumentoConIA(
  params: GenerarDocumentoParams
): Promise<ResultadoGeneracion> {
  const inicio = Date.now();

  try {
    const {
      tipoCaso,
      datos,
      modelo,
      usarPlantillaBase = true,
      plantilla: plantillaProporcionada
    } = params;

    console.log(`Generando documento para: ${tipoCaso}`);
    console.log(`Datos recibidos: ${Object.keys(datos).length} campos`);

    // Obtener plantilla según tipo de caso o usar la proporcionada
    let plantilla = plantillaProporcionada || '';
    if (
      !plantilla &&
      usarPlantillaBase &&
      tipoCaso === 'compraventa_inmueble'
    ) {
      plantilla = PLANTILLA_COMPRAVENTA;
    }

    // Si hay plantilla, procesarla
    if (plantilla) {
      const contenidoProcesado = procesarPlantilla(plantilla, datos);

      // Verificar si quedaron variables sin procesar
      const variablesFaltantes =
        contenidoProcesado.match(/\{\{[\w_|]+\}\}/g) || [];

      if (variablesFaltantes.length > 5) {
        // Demasiados campos faltantes, usar IA para completar
        const contenidoMejorado = await mejorarConIA(
          contenidoProcesado,
          tipoCaso,
          modelo
        );

        return {
          exito: true,
          contenido: contenidoMejorado,
          tiempoProcesamiento: Date.now() - inicio,
          camposFaltantes: variablesFaltantes.map((v) =>
            v.replace(/\{\{|\}\}/g, '')
          )
        };
      }

      return {
        exito: true,
        contenido: contenidoProcesado,
        tiempoProcesamiento: Date.now() - inicio
      };
    }

    // Sin plantilla, generar con IA desde cero
    const prompt = generarPromptDocumento(tipoCaso, datos);
    const contenido = await generarConModelo(prompt, modelo);

    return {
      exito: true,
      contenido,
      tiempoProcesamiento: Date.now() - inicio
    };
  } catch (error) {
    console.error('Error en generación:', error);
    return {
      exito: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      tiempoProcesamiento: Date.now() - inicio
    };
  }
}

// ============================================================================
// PROCESAMIENTO DE PLANTILLA
// ============================================================================

function procesarPlantilla(
  plantilla: string,
  datos: Record<string, any>
): string {
  let resultado = plantilla;

  // Procesar condicionales {{#if variable}}...{{/if}}
  const condicionalRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  resultado = resultado.replace(
    condicionalRegex,
    (match, variable, contenido) => {
      const valor = datos[variable];
      if (valor && String(valor).trim()) {
        // Procesar el contenido interno también
        return procesarPlantilla(contenido, datos);
      }
      return '';
    }
  );

  // Procesar variables con modificadores {{variable | modifier}}
  const variableModRegex = /\{\{(\w+)\s*\|\s*(\w+)\}\}/g;
  resultado = resultado.replace(
    variableModRegex,
    (match, variable, modifier) => {
      const valor = datos[variable];
      if (!valor) return match; // Dejar la variable si no hay valor

      switch (modifier.toLowerCase()) {
        case 'uppercase':
          return String(valor).toUpperCase();
        case 'lowercase':
          return String(valor).toLowerCase();
        case 'capitalize':
          return (
            String(valor).charAt(0).toUpperCase() +
            String(valor).slice(1).toLowerCase()
          );
        default:
          return String(valor);
      }
    }
  );

  // Procesar variables simples {{variable}}
  const variableRegex = /\{\{(\w+)\}\}/g;
  resultado = resultado.replace(variableRegex, (match, variable) => {
    const valor = datos[variable];
    if (valor !== undefined && valor !== null && String(valor).trim()) {
      return String(valor);
    }
    return match; // Dejar la variable si no hay valor
  });

  // Limpiar líneas vacías excesivas
  resultado = resultado.replace(/\n{3,}/g, '\n\n');

  return resultado;
}

// ============================================================================
// GENERACIÓN CON IA
// ============================================================================

function generarPromptDocumento(
  tipoCaso: string,
  datos: Record<string, any>
): string {
  const tipoCasoInfo = getTipoCasoById(tipoCaso);
  const nombreTipo = tipoCasoInfo?.nombre || tipoCaso;

  const datosFormateados = Object.entries(datos)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  return `Eres un experto redactor de documentos legales notariales en México, específicamente del Estado de Michoacán.

Tu tarea es generar un documento legal de tipo: "${nombreTipo}"

DATOS PROPORCIONADOS:
${datosFormateados}

INSTRUCCIONES:
1. Genera un documento legal completo y profesional en formato Markdown.
2. Usa lenguaje jurídico formal apropiado para documentos notariales mexicanos.
3. Incluye todas las cláusulas estándar para este tipo de documento.
4. Asegúrate de que el documento cumpla con los requisitos legales mexicanos.
5. Usa los datos proporcionados en los lugares apropiados.
6. Si faltan datos críticos, indica [PENDIENTE: descripción] donde corresponda.
7. Incluye espacios para firmas al final.

El documento debe estar listo para impresión.`;
}

async function generarConModelo(
  prompt: string,
  modelo: 'claude' | 'gpt4' | 'gemini'
): Promise<string> {
  switch (modelo) {
    case 'claude':
      const claude = getClaudeClient();
      const respClaude = await claude.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }]
      });
      const textClaude = respClaude.content.find((c) => c.type === 'text');
      return textClaude?.text || '';

    case 'gpt4':
      const openai = getOpenAIClient();
      const respGPT = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }]
      });
      return respGPT.choices[0]?.message?.content || '';

    case 'gemini':
      const gemini = getGeminiClient();
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    default:
      throw new Error(`Modelo no soportado: ${modelo}`);
  }
}

async function mejorarConIA(
  documento: string,
  tipoCaso: string,
  modelo: 'claude' | 'gpt4' | 'gemini'
): Promise<string> {
  const prompt = `Eres un experto en documentos legales notariales de México.

El siguiente documento tiene algunos campos marcados con {{variable}} que no pudieron ser completados automáticamente.

DOCUMENTO:
${documento}

INSTRUCCIONES:
1. Reemplaza las variables {{variable}} con texto apropiado que indique que la información está pendiente, como "[PENDIENTE: nombre del campo]".
2. NO inventes datos. Solo indica que están pendientes.
3. Mantén el formato y estructura del documento.
4. Devuelve el documento completo corregido.`;

  return generarConModelo(prompt, modelo);
}

// ============================================================================
// MODIFICACIÓN CON CHAT
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

    const contenido = await generarConModelo(prompt, modelo);

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

// ============================================================================
// HELPERS DE FORMATO
// ============================================================================

export function numeroATexto(numero: number): string {
  const unidades = [
    '',
    'UN',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE'
  ];
  const especiales = [
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISÉIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE'
  ];
  const decenas = [
    '',
    '',
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA'
  ];
  const centenas = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS'
  ];

  if (numero === 0) return 'CERO';
  if (numero === 100) return 'CIEN';
  if (numero === 1000) return 'MIL';
  if (numero === 1000000) return 'UN MILLÓN';

  let resultado = '';

  // Millones
  if (numero >= 1000000) {
    const millones = Math.floor(numero / 1000000);
    if (millones === 1) {
      resultado += 'UN MILLÓN ';
    } else {
      resultado += numeroATexto(millones) + ' MILLONES ';
    }
    numero %= 1000000;
  }

  // Miles
  if (numero >= 1000) {
    const miles = Math.floor(numero / 1000);
    if (miles === 1) {
      resultado += 'MIL ';
    } else {
      resultado += numeroATexto(miles) + ' MIL ';
    }
    numero %= 1000;
  }

  // Centenas
  if (numero >= 100) {
    resultado += centenas[Math.floor(numero / 100)] + ' ';
    numero %= 100;
  }

  // Decenas y unidades
  if (numero >= 20) {
    resultado += decenas[Math.floor(numero / 10)];
    if (numero % 10 !== 0) {
      resultado += ' Y ' + unidades[numero % 10];
    }
  } else if (numero >= 10) {
    resultado += especiales[numero - 10];
  } else if (numero > 0) {
    resultado += unidades[numero];
  }

  return resultado.trim();
}

export function formatearPrecioLegal(monto: number): string {
  const texto = numeroATexto(monto);
  return `${texto} PESOS 00/100 MONEDA NACIONAL`;
}
