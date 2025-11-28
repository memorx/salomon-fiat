// lib/templates/compraventa-inmueble.ts

/**
 * Plantilla de Escritura Pública de Compraventa de Inmueble
 * Basada en el modelo de Notaría 157 de Michoacán
 *
 * Variables disponibles: {{nombre_variable}}
 * Condicionales: {{#if variable}}...{{/if}}
 * Listas: {{#each lista}}...{{/each}}
 */

export const PLANTILLA_COMPRAVENTA_INMUEBLE = `
# ESCRITURA PÚBLICA NÚMERO {{numero_escritura}}
## {{inmueble_tipo | uppercase}}

---

En la ciudad de **{{notario_ciudad}}**, {{notario_estado}}, siendo las **{{fecha_hora}}** horas del día **{{fecha_dia}}** de **{{fecha_mes}}** de **{{fecha_ano}}**, ante mí, **{{notario_nombre}}**, Titular de la Notaría Pública número **{{notario_numero}}** de esta Demarcación Notarial, comparecen:

---

### COMPARECIENTES

**COMO PARTE VENDEDORA:**

{{#if sociedad_vendedora_nombre}}
La sociedad denominada **"{{sociedad_vendedora_nombre}}"**, representada en este acto por **{{representante_nombre}}**, en su carácter de {{representante_cargo}}.
{{else}}
**{{vendedor_nombre}}**, {{vendedor_nacionalidad}}, {{vendedor_estado_civil}}, {{vendedor_ocupacion}}, originario de {{vendedor_lugar_origen}}, nacido el {{vendedor_fecha_nacimiento}}, con domicilio en {{vendedor_domicilio}}.
{{/if}}

{{#if vendedor_conyuge_nombre}}
Asistido(a) en este acto por su cónyuge **{{vendedor_conyuge_nombre}}**, originario(a) de {{vendedor_conyuge_lugar_origen}}.
{{/if}}

**COMO PARTE COMPRADORA:**

{{#if sociedad_compradora_nombre}}
La sociedad denominada **"{{sociedad_compradora_nombre}}"**, representada en este acto por **{{representante_nombre}}**, en su carácter de {{representante_cargo}}.
{{else}}
**{{comprador_nombre}}**, {{comprador_nacionalidad}}, {{comprador_estado_civil}}, {{comprador_ocupacion}}, originario de {{comprador_lugar_origen}}, nacido el {{comprador_fecha_nacimiento}}, con domicilio en {{comprador_domicilio}}.
{{/if}}

{{#if comprador2_nombre}}
Y **{{comprador2_nombre}}**, quienes adquieren de manera **{{operacion_tipo_adquisicion}}**.
{{/if}}

---

### ANTECEDENTE REGISTRAL

El inmueble objeto de esta operación tiene como antecedente de propiedad la **Escritura Pública número {{antecedente_escritura_numero}}** de fecha **{{antecedente_escritura_fecha}}**, otorgada ante la fe del **{{antecedente_notario_nombre}}**, Titular de la Notaría número **{{antecedente_notario_numero}}**, inscrita en el Registro Público de la Propiedad {{#if registro_distrito}}del Distrito de {{registro_distrito}}{{/if}} bajo el número **{{registro_numero}}**, Tomo **{{registro_tomo}}**{{#if registro_libro}}, Libro {{registro_libro}}{{/if}}{{#if registro_seccion}}, Sección {{registro_seccion}}{{/if}}{{#if registro_volumen}}, Volumen {{registro_volumen}}{{/if}}{{#if registro_foja}}, Foja {{registro_foja}}{{/if}}.

{{#if antecedente_enajenante}}
Mediante dicho instrumento, **{{antecedente_enajenante}}** transmitió la propiedad del inmueble a **{{antecedente_adquirente}}**.
{{/if}}

---

### DECLARACIONES

**I.** Que el inmueble materia de esta operación se encuentra **LIBRE DE TODO GRAVAMEN**, según consta en el Certificado de Libertad de Gravamen expedido por el Registro Público de la Propiedad.

**II.** Que el inmueble **NO HA SIDO ENAJENADO** con anterioridad a persona distinta del comprador.

**III.** Que los **IMPUESTOS Y DERECHOS** derivados del inmueble se encuentran al corriente de pago.

**IV.** Que el inmueble tiene la **CLAVE CATASTRAL** número: **{{inmueble_clave_catastral}}**.

**V.** Que el **VALOR CATASTRAL** del inmueble es de **{{inmueble_valor_catastral}}**, según constancia expedida por la autoridad catastral competente.

{{#if avaluo_valor}}
**VI.** Que conforme al **AVALÚO FISCAL** número **{{avaluo_numero}}** de fecha **{{avaluo_fecha}}**, el valor del inmueble es de **{{avaluo_valor}}**.
{{/if}}

---

### CLÁUSULAS

**PRIMERA.- VENTA.** 
{{#if sociedad_vendedora_nombre}}
**"{{sociedad_vendedora_nombre}}"**, por conducto de su representante legal,
{{else}}
**{{vendedor_nombre}}**{{#if vendedor_conyuge_nombre}} con la asistencia de su cónyuge **{{vendedor_conyuge_nombre}}**{{/if}},
{{/if}}
vende y transmite la plena propiedad y posesión del inmueble que más adelante se describe, a favor de 
{{#if sociedad_compradora_nombre}}
**"{{sociedad_compradora_nombre}}"**
{{else}}
**{{comprador_nombre}}**{{#if comprador2_nombre}} y **{{comprador2_nombre}}**{{/if}}
{{/if}}.

**SEGUNDA.- PRECIO.**
El precio de la presente operación de compraventa es la cantidad de **{{operacion_precio}}** ({{operacion_precio_letra}}), que la parte vendedora declara haber recibido de la parte compradora a su entera satisfacción, sirviendo esta escritura como el recibo más eficaz que en derecho proceda.

**TERCERA.- UBICACIÓN.**
El inmueble objeto de esta compraventa se ubica en:

> **{{inmueble_calle}}{{#if inmueble_numero_casa}} número {{inmueble_numero_casa}}{{/if}}**
> {{#if inmueble_fraccionamiento}}Fraccionamiento "{{inmueble_fraccionamiento}}"{{/if}}
> {{#if inmueble_numero_lote}}Lote **{{inmueble_numero_lote}}**{{/if}}{{#if inmueble_numero_manzana}}, Manzana **{{inmueble_numero_manzana}}**{{/if}}
> Colonia {{inmueble_colonia}}, C.P. {{inmueble_cp}}
> {{inmueble_municipio}}, {{inmueble_estado}}

**CUARTA.- SUPERFICIE Y MEDIDAS.**
El inmueble tiene una superficie total de **{{inmueble_superficie}}** metros cuadrados{{#if inmueble_superficie_construccion}}, con **{{inmueble_superficie_construccion}}** metros cuadrados de construcción{{/if}}, con las siguientes medidas y colindancias:

| Orientación | Medida y Colindancia |
|-------------|---------------------|
| **AL NORTE:** | {{lindero_norte}} |
| **AL SUR:** | {{lindero_sur}} |
| **AL ORIENTE:** | {{lindero_oriente}} |
| **AL PONIENTE:** | {{lindero_poniente}} |

{{#if lindero_nororiente}}
| **AL NOR-ORIENTE:** | {{lindero_nororiente}} |
{{/if}}
{{#if lindero_surponiente}}
| **AL SUR-PONIENTE:** | {{lindero_surponiente}} |
{{/if}}

**QUINTA.- TRADICIÓN.**
La parte vendedora hace entrega de la posesión real, corporal y jurídica del inmueble a la parte compradora, transmitiéndole todos los derechos que le corresponden sobre el mismo.

**SEXTA.- EVICCIÓN Y SANEAMIENTO.**
La parte vendedora se obliga a responder de la evicción y saneamiento conforme a la ley.

**SÉPTIMA.- GASTOS.**
Los gastos, impuestos y derechos que origine esta escritura serán cubiertos conforme a la ley y según convengan las partes.

**OCTAVA.- JURISDICCIÓN.**
Para todo lo relativo a la interpretación y cumplimiento de este contrato, las partes se someten a la jurisdicción de los tribunales competentes de {{inmueble_municipio}}, {{inmueble_estado}}, renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.

---

### GENERALES

**De la parte vendedora {{vendedor_nombre}}:**
- **CURP:** {{vendedor_curp}}
- **RFC:** {{vendedor_rfc}}
- **Identificación:** {{vendedor_ine}}

{{#if vendedor_conyuge_nombre}}
**Del cónyuge {{vendedor_conyuge_nombre}}:**
- Originario de: {{vendedor_conyuge_lugar_origen}}
{{/if}}

**De la parte compradora {{comprador_nombre}}:**
- **CURP:** {{comprador_curp}}
- **RFC:** {{comprador_rfc}}
- **Identificación:** {{comprador_ine}}

{{#if comprador2_nombre}}
**Del segundo comprador {{comprador2_nombre}}:**
- **CURP:** {{comprador2_curp}}
- **RFC:** {{comprador2_rfc}}
- **Identificación:** {{comprador2_ine}}
{{/if}}

---

### CERTIFICACIÓN NOTARIAL

Yo, el Notario, **CERTIFICO Y DOY FE:**

**I.** De haber tenido a la vista los documentos que acreditan la personalidad, capacidad legal y legitimación de los comparecientes.

**II.** De que los comparecientes tienen capacidad legal para este acto, que su consentimiento es libre de vicios, y que se identificaron plenamente a mi satisfacción.

**III.** De haber leído íntegramente esta escritura a los comparecientes, explicándoles su valor y consecuencias legales.

**IV.** De que los comparecientes manifestaron su conformidad con el contenido de esta escritura y firmaron al calce y al margen de la misma.

**V.** De que esta escritura se otorga con todos los requisitos de ley.

---

### INSERCIONES

Se agregan a este protocolo como anexos:

1. Informe Catastral del inmueble
2. Constancia de No Adeudo de Predial
3. Avalúo Fiscal
4. Comprobante de pago del Impuesto de Traslación de Dominio
5. Comprobante de pago del ISR (si aplica)
6. Certificado de Libertad de Gravamen

---

**ASÍ LO OTORGARON Y FIRMARON**, quedando la presente escritura inscrita en mi protocolo, de lo cual **DOY FE.**

---

| | |
|---|---|
| **{{vendedor_nombre}}** | **{{comprador_nombre}}** |
| Parte Vendedora | Parte Compradora |
| | |
{{#if vendedor_conyuge_nombre}}
| **{{vendedor_conyuge_nombre}}** | {{#if comprador2_nombre}}**{{comprador2_nombre}}**{{/if}} |
| Cónyuge del Vendedor | {{#if comprador2_nombre}}Segundo Comprador{{/if}} |
{{/if}}

---

**{{notario_nombre}}**
**NOTARIO PÚBLICO NÚMERO {{notario_numero}}**
{{notario_ciudad}}, {{notario_estado}}

---

*Esta escritura consta de [NÚMERO] fojas útiles, incluyendo la presente.*
`;

/**
 * Función para procesar la plantilla con los datos del caso
 */
export function procesarPlantilla(
  plantilla: string,
  datos: Record<string, string>
): string {
  let resultado = plantilla;

  // Procesar condicionales {{#if variable}}...{{/if}}
  const condicionalRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  resultado = resultado.replace(
    condicionalRegex,
    (match, variable, contenido) => {
      const valor = datos[variable];
      if (valor && valor.trim() !== '') {
        // Procesar el contenido interno recursivamente
        return procesarPlantilla(contenido, datos);
      }
      return '';
    }
  );

  // Procesar variables simples {{variable}}
  const variableRegex = /\{\{(\w+)(?:\s*\|\s*(\w+))?\}\}/g;
  resultado = resultado.replace(
    variableRegex,
    (match, variable, modificador) => {
      const valor = datos[variable] || '';

      if (modificador === 'uppercase') {
        return valor.toUpperCase();
      }
      if (modificador === 'lowercase') {
        return valor.toLowerCase();
      }

      return valor;
    }
  );

  // Limpiar líneas vacías excesivas
  resultado = resultado.replace(/\n{3,}/g, '\n\n');

  return resultado;
}

/**
 * Validar que todos los campos requeridos están presentes
 */
export function validarDatosPlantilla(datos: Record<string, string>): {
  valido: boolean;
  faltantes: string[];
} {
  const camposRequeridos = [
    'notario_nombre',
    'notario_numero',
    'notario_ciudad',
    'notario_estado',
    'fecha_dia',
    'fecha_mes',
    'fecha_ano',
    'vendedor_nombre',
    'comprador_nombre',
    'inmueble_calle',
    'inmueble_colonia',
    'inmueble_municipio',
    'inmueble_estado',
    'inmueble_superficie',
    'lindero_norte',
    'lindero_sur',
    'lindero_oriente',
    'lindero_poniente',
    'antecedente_escritura_numero',
    'antecedente_escritura_fecha',
    'antecedente_notario_nombre',
    'antecedente_notario_numero',
    'registro_numero',
    'registro_tomo',
    'operacion_precio',
    'operacion_precio_letra'
  ];

  const faltantes = camposRequeridos.filter(
    (campo) => !datos[campo] || datos[campo].trim() === ''
  );

  return {
    valido: faltantes.length === 0,
    faltantes
  };
}

/**
 * Convertir número a texto en español
 */
export function numeroATexto(numero: number): string {
  const unidades = [
    '',
    'un',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve'
  ];
  const decenas = [
    '',
    'diez',
    'veinte',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa'
  ];
  const especiales = [
    'diez',
    'once',
    'doce',
    'trece',
    'catorce',
    'quince',
    'dieciséis',
    'diecisiete',
    'dieciocho',
    'diecinueve'
  ];
  const centenas = [
    '',
    'ciento',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos'
  ];

  if (numero === 0) return 'cero';
  if (numero === 100) return 'cien';

  let resultado = '';

  // Millones
  if (numero >= 1000000) {
    const millones = Math.floor(numero / 1000000);
    if (millones === 1) {
      resultado += 'un millón ';
    } else {
      resultado += numeroATexto(millones) + ' millones ';
    }
    numero %= 1000000;
  }

  // Miles
  if (numero >= 1000) {
    const miles = Math.floor(numero / 1000);
    if (miles === 1) {
      resultado += 'mil ';
    } else {
      resultado += numeroATexto(miles) + ' mil ';
    }
    numero %= 1000;
  }

  // Centenas
  if (numero >= 100) {
    resultado += centenas[Math.floor(numero / 100)] + ' ';
    numero %= 100;
  }

  // Decenas y unidades
  if (numero >= 10 && numero < 20) {
    resultado += especiales[numero - 10];
  } else if (numero >= 20) {
    resultado += decenas[Math.floor(numero / 10)];
    if (numero % 10 !== 0) {
      resultado += ' y ' + unidades[numero % 10];
    }
  } else if (numero > 0) {
    resultado += unidades[numero];
  }

  return resultado.trim();
}

/**
 * Formatear precio en texto legal
 */
export function formatearPrecioLegal(monto: number): string {
  const entero = Math.floor(monto);
  const centavos = Math.round((monto - entero) * 100);

  const textoEntero = numeroATexto(entero).toUpperCase();
  const textoCentavos = centavos.toString().padStart(2, '0');

  return `${textoEntero} PESOS ${textoCentavos}/100 MONEDA NACIONAL`;
}
