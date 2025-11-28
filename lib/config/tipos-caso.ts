// lib/config/tipos-caso.ts

import { TipoCaso, TipoDocumento, CampoFormulario } from '@/types';

// ============================================================================
// TIPOS DE DOCUMENTOS QUE SE PUEDEN SUBIR
// ============================================================================

export const TIPOS_DOCUMENTO: TipoDocumento[] = [
  {
    id: 'ine_frente',
    nombre: 'INE (Frente)',
    descripcion: 'Credencial para votar - lado frontal',
    requerido: true
  },
  {
    id: 'ine_reverso',
    nombre: 'INE (Reverso)',
    descripcion: 'Credencial para votar - lado posterior',
    requerido: true
  },
  {
    id: 'curp',
    nombre: 'CURP',
    descripcion: 'Clave Única de Registro de Población',
    requerido: true
  },
  {
    id: 'comprobante_domicilio',
    nombre: 'Comprobante de Domicilio',
    descripcion: 'Recibo de luz, agua, teléfono (no mayor a 3 meses)',
    requerido: false
  },
  {
    id: 'acta_nacimiento',
    nombre: 'Acta de Nacimiento',
    descripcion: 'Acta de nacimiento certificada',
    requerido: false
  },
  {
    id: 'acta_matrimonio',
    nombre: 'Acta de Matrimonio',
    descripcion: 'Acta de matrimonio (si aplica)',
    requerido: false
  },
  {
    id: 'escritura_propiedad',
    nombre: 'Escritura de Propiedad',
    descripcion: 'Escritura pública del inmueble',
    requerido: true
  },
  {
    id: 'predial',
    nombre: 'Recibo Predial',
    descripcion: 'Último recibo de pago del predial',
    requerido: true
  },
  {
    id: 'constancia_no_adeudo',
    nombre: 'Constancia de No Adeudo',
    descripcion: 'Constancia de que el inmueble no tiene adeudos',
    requerido: false
  },
  {
    id: 'avaluo',
    nombre: 'Avalúo',
    descripcion: 'Avalúo comercial o fiscal del inmueble',
    requerido: false
  },
  {
    id: 'rfc',
    nombre: 'Constancia de RFC',
    descripcion: 'Constancia de situación fiscal',
    requerido: false
  },
  {
    id: 'certificado_libertad_gravamen',
    nombre: 'Certificado de Libertad de Gravamen',
    descripcion: 'Certificado del Registro Público de la Propiedad',
    requerido: false
  },
  {
    id: 'permiso_sre',
    nombre: 'Permiso SRE',
    descripcion:
      'Permiso de la Secretaría de Relaciones Exteriores (si aplica)',
    requerido: false
  },
  {
    id: 'poder_notarial',
    nombre: 'Poder Notarial',
    descripcion: 'Poder notarial del representante legal (si aplica)',
    requerido: false
  },
  {
    id: 'acta_constitutiva',
    nombre: 'Acta Constitutiva',
    descripcion: 'Acta constitutiva de la sociedad (si aplica)',
    requerido: false
  },
  {
    id: 'otro',
    nombre: 'Otro Documento',
    descripcion: 'Documento adicional',
    requerido: false
  }
];

// ============================================================================
// CAMPOS PARA COMPRAVENTA DE INMUEBLE
// Basados en los modelos de escritura pública proporcionados
// ============================================================================

// --- SECCIÓN: DATOS DEL NOTARIO ---
const CAMPOS_NOTARIO: CampoFormulario[] = [
  {
    id: 'notario_nombre',
    nombre: 'Nombre del Notario',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Lic. Nombre Completo del Notario'
  },
  {
    id: 'notario_numero',
    nombre: 'Número de Notaría',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Ej: 157'
  },
  {
    id: 'notario_estado',
    nombre: 'Estado de la Notaría',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Ej: Michoacán'
  },
  {
    id: 'notario_ciudad',
    nombre: 'Ciudad de la Notaría',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Ej: Quiroga'
  }
];

// --- SECCIÓN: FECHA DE OTORGAMIENTO ---
const CAMPOS_FECHA: CampoFormulario[] = [
  {
    id: 'fecha_dia',
    nombre: 'Día del Otorgamiento',
    tipo: 'text',
    requerido: true,
    seccion: 'fecha_otorgamiento',
    placeholder: 'Ej: veintiocho'
  },
  {
    id: 'fecha_mes',
    nombre: 'Mes del Otorgamiento',
    tipo: 'text',
    requerido: true,
    seccion: 'fecha_otorgamiento',
    placeholder: 'Ej: enero'
  },
  {
    id: 'fecha_ano',
    nombre: 'Año del Otorgamiento',
    tipo: 'text',
    requerido: true,
    seccion: 'fecha_otorgamiento',
    placeholder: 'Ej: dos mil veinticuatro'
  },
  {
    id: 'fecha_hora',
    nombre: 'Hora del Otorgamiento',
    tipo: 'text',
    requerido: false,
    seccion: 'fecha_otorgamiento',
    placeholder: 'Ej: 11:00 once horas'
  }
];

// --- SECCIÓN: DATOS DEL VENDEDOR ---
const CAMPOS_VENDEDOR: CampoFormulario[] = [
  {
    id: 'vendedor_nombre',
    nombre: 'Nombre Completo del Vendedor',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Nombre(s) y Apellidos'
  },
  {
    id: 'vendedor_nacionalidad',
    nombre: 'Nacionalidad',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Mexicano(a) por nacimiento'
  },
  {
    id: 'vendedor_estado_civil',
    nombre: 'Estado Civil',
    tipo: 'select',
    requerido: true,
    seccion: 'vendedor',
    opciones: [
      'Soltero(a)',
      'Casado(a)',
      'Divorciado(a)',
      'Viudo(a)',
      'Unión Libre'
    ]
  },
  {
    id: 'vendedor_ocupacion',
    nombre: 'Ocupación',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Ej: Comerciante, Empleado, etc.'
  },
  {
    id: 'vendedor_lugar_origen',
    nombre: 'Lugar de Origen',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Ciudad y Estado de nacimiento'
  },
  {
    id: 'vendedor_fecha_nacimiento',
    nombre: 'Fecha de Nacimiento',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Ej: 30 de abril de 1961'
  },
  {
    id: 'vendedor_edad',
    nombre: 'Edad',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'Ej: 62 años'
  },
  {
    id: 'vendedor_domicilio',
    nombre: 'Domicilio',
    tipo: 'textarea',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Calle, número, colonia, código postal, ciudad, estado'
  },
  {
    id: 'vendedor_colonia',
    nombre: 'Colonia',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'Nombre de la colonia'
  },
  {
    id: 'vendedor_cp',
    nombre: 'Código Postal',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'Ej: 58420'
  },
  {
    id: 'vendedor_curp',
    nombre: 'CURP',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'XXXX000000XXXXXX00'
  },
  {
    id: 'vendedor_rfc',
    nombre: 'RFC',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'XXXX000000XXX'
  },
  {
    id: 'vendedor_ine',
    nombre: 'Número de INE/Credencial para Votar',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Número IDMEX'
  },
  // Datos del cónyuge (si aplica)
  {
    id: 'vendedor_conyuge_nombre',
    nombre: 'Nombre del Cónyuge (si aplica)',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'Nombre completo del esposo(a)'
  },
  {
    id: 'vendedor_conyuge_lugar_origen',
    nombre: 'Lugar de Origen del Cónyuge',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'Ciudad y Estado de nacimiento'
  }
];

// --- SECCIÓN: DATOS DEL COMPRADOR ---
const CAMPOS_COMPRADOR: CampoFormulario[] = [
  {
    id: 'comprador_nombre',
    nombre: 'Nombre Completo del Comprador',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Nombre(s) y Apellidos'
  },
  {
    id: 'comprador_nacionalidad',
    nombre: 'Nacionalidad',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Mexicano(a) por nacimiento'
  },
  {
    id: 'comprador_estado_civil',
    nombre: 'Estado Civil',
    tipo: 'select',
    requerido: true,
    seccion: 'comprador',
    opciones: [
      'Soltero(a)',
      'Casado(a)',
      'Divorciado(a)',
      'Viudo(a)',
      'Unión Libre'
    ]
  },
  {
    id: 'comprador_ocupacion',
    nombre: 'Ocupación',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Ej: Comerciante, Empleado, etc.'
  },
  {
    id: 'comprador_lugar_origen',
    nombre: 'Lugar de Origen',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Ciudad y Estado de nacimiento'
  },
  {
    id: 'comprador_fecha_nacimiento',
    nombre: 'Fecha de Nacimiento',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Ej: 8 de marzo de 1992'
  },
  {
    id: 'comprador_edad',
    nombre: 'Edad',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Ej: 32 años'
  },
  {
    id: 'comprador_domicilio',
    nombre: 'Domicilio',
    tipo: 'textarea',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Calle, número, colonia, código postal, ciudad, estado'
  },
  {
    id: 'comprador_colonia',
    nombre: 'Colonia',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Nombre de la colonia'
  },
  {
    id: 'comprador_cp',
    nombre: 'Código Postal',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Ej: 58420'
  },
  {
    id: 'comprador_curp',
    nombre: 'CURP',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'XXXX000000XXXXXX00'
  },
  {
    id: 'comprador_rfc',
    nombre: 'RFC',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'XXXX000000XXX'
  },
  {
    id: 'comprador_ine',
    nombre: 'Número de INE/Credencial para Votar',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Número IDMEX'
  },
  // Segundo comprador (si aplica - proindiviso)
  {
    id: 'comprador2_nombre',
    nombre: 'Nombre del Segundo Comprador (si aplica)',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Para compras proindiviso/mancomunadas'
  },
  {
    id: 'comprador2_curp',
    nombre: 'CURP del Segundo Comprador',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'XXXX000000XXXXXX00'
  },
  {
    id: 'comprador2_rfc',
    nombre: 'RFC del Segundo Comprador',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'XXXX000000XXX'
  },
  {
    id: 'comprador2_ine',
    nombre: 'INE del Segundo Comprador',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Número IDMEX'
  }
];

// --- SECCIÓN: REPRESENTANTE LEGAL (si aplica persona moral) ---
const CAMPOS_REPRESENTANTE: CampoFormulario[] = [
  {
    id: 'representante_nombre',
    nombre: 'Nombre del Representante Legal',
    tipo: 'text',
    requerido: false,
    seccion: 'representante_legal',
    placeholder: 'Nombre completo del apoderado'
  },
  {
    id: 'representante_cargo',
    nombre: 'Cargo del Representante',
    tipo: 'text',
    requerido: false,
    seccion: 'representante_legal',
    placeholder: 'Ej: Gerente General, Apoderado Legal'
  },
  {
    id: 'representante_lugar_origen',
    nombre: 'Lugar de Origen',
    tipo: 'text',
    requerido: false,
    seccion: 'representante_legal',
    placeholder: 'Ciudad y Estado de nacimiento'
  },
  {
    id: 'representante_edad',
    nombre: 'Edad',
    tipo: 'text',
    requerido: false,
    seccion: 'representante_legal',
    placeholder: 'Ej: 45 años'
  },
  {
    id: 'representante_ocupacion',
    nombre: 'Ocupación',
    tipo: 'text',
    requerido: false,
    seccion: 'representante_legal',
    placeholder: 'Actividad profesional'
  },
  {
    id: 'representante_estado_civil',
    nombre: 'Estado Civil',
    tipo: 'select',
    requerido: false,
    seccion: 'representante_legal',
    opciones: [
      'Soltero(a)',
      'Casado(a)',
      'Divorciado(a)',
      'Viudo(a)',
      'Unión Libre'
    ]
  }
];

// --- SECCIÓN: DATOS DE LA SOCIEDAD (si aplica) ---
const CAMPOS_SOCIEDAD: CampoFormulario[] = [
  {
    id: 'sociedad_vendedora_nombre',
    nombre: 'Razón Social de la Sociedad Vendedora',
    tipo: 'text',
    requerido: false,
    seccion: 'sociedad',
    placeholder: 'Nombre legal de la empresa vendedora'
  },
  {
    id: 'sociedad_compradora_nombre',
    nombre: 'Razón Social de la Sociedad Compradora',
    tipo: 'text',
    requerido: false,
    seccion: 'sociedad',
    placeholder: 'Nombre legal de la empresa compradora'
  },
  {
    id: 'sociedad_constituida_nombre',
    nombre: 'Nombre de la Sociedad Constituida',
    tipo: 'text',
    requerido: false,
    seccion: 'sociedad',
    placeholder: 'Para casos de aportación a sociedad'
  },
  {
    id: 'sociedad_beneficiaria_nombre',
    nombre: 'Nombre de la Sociedad Beneficiaria',
    tipo: 'text',
    requerido: false,
    seccion: 'sociedad',
    placeholder: 'Sociedad autorizada por SRE'
  },
  {
    id: 'sociedad_integradora_nombre',
    nombre: 'Nombre de la Sociedad Integradora',
    tipo: 'text',
    requerido: false,
    seccion: 'sociedad',
    placeholder: 'Para integración de predios'
  }
];

// --- SECCIÓN: DATOS DEL INMUEBLE ---
const CAMPOS_INMUEBLE: CampoFormulario[] = [
  {
    id: 'inmueble_tipo',
    nombre: 'Tipo de Inmueble',
    tipo: 'select',
    requerido: true,
    seccion: 'inmueble',
    opciones: [
      'Lote de Terreno',
      'Casa Habitación',
      'Departamento',
      'Local Comercial',
      'Edificio',
      'Fracción de Terreno',
      'Otro'
    ]
  },
  {
    id: 'inmueble_numero_lote',
    nombre: 'Número de Lote',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: 10'
  },
  {
    id: 'inmueble_numero_manzana',
    nombre: 'Número de Manzana',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: H'
  },
  {
    id: 'inmueble_numero_casa',
    nombre: 'Número de Casa/Edificio',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Número exterior'
  },
  {
    id: 'inmueble_calle',
    nombre: 'Calle',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Nombre de la calle'
  },
  {
    id: 'inmueble_fraccionamiento',
    nombre: 'Nombre del Fraccionamiento',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: Hacienda de Quiroga'
  },
  {
    id: 'inmueble_colonia',
    nombre: 'Colonia',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Nombre de la colonia'
  },
  {
    id: 'inmueble_colonia_anterior',
    nombre: 'Colonia Anterior (si cambió de nombre)',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Denominación histórica'
  },
  {
    id: 'inmueble_municipio',
    nombre: 'Municipio/Alcaldía',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Ej: Quiroga'
  },
  {
    id: 'inmueble_distrito',
    nombre: 'Distrito Judicial',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: Morelia'
  },
  {
    id: 'inmueble_estado',
    nombre: 'Estado',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Ej: Michoacán'
  },
  {
    id: 'inmueble_cp',
    nombre: 'Código Postal',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: 58420'
  },
  {
    id: 'inmueble_superficie',
    nombre: 'Superficie Total (m²)',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Ej: 96.00 (noventa y seis metros cuadrados)'
  },
  {
    id: 'inmueble_superficie_construccion',
    nombre: 'Superficie de Construcción (m²)',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Si aplica'
  },
  {
    id: 'inmueble_calle_colindante',
    nombre: 'Calle Colindante/Más Cercana',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Vía pública más cercana'
  },
  {
    id: 'inmueble_cuenta_predial',
    nombre: 'Número de Cuenta Predial',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Número del recibo predial'
  },
  {
    id: 'inmueble_clave_catastral',
    nombre: 'Clave Catastral',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: 01-1005-1-006448'
  },
  {
    id: 'inmueble_valor_catastral',
    nombre: 'Valor Catastral',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Ej: $5,394.00'
  }
];

// --- SECCIÓN: LINDEROS Y MEDIDAS ---
const CAMPOS_LINDEROS: CampoFormulario[] = [
  {
    id: 'lindero_norte',
    nombre: 'Lindero Norte',
    tipo: 'text',
    requerido: true,
    seccion: 'linderos',
    placeholder: 'Ej: 6.00 metros con lote 12'
  },
  {
    id: 'lindero_sur',
    nombre: 'Lindero Sur',
    tipo: 'text',
    requerido: true,
    seccion: 'linderos',
    placeholder: 'Ej: 6.00 metros con calle Hacienda de los Reyes'
  },
  {
    id: 'lindero_oriente',
    nombre: 'Lindero Oriente',
    tipo: 'text',
    requerido: true,
    seccion: 'linderos',
    placeholder: 'Ej: 16.00 metros con lote 9'
  },
  {
    id: 'lindero_poniente',
    nombre: 'Lindero Poniente',
    tipo: 'text',
    requerido: true,
    seccion: 'linderos',
    placeholder: 'Ej: 16.00 metros con lote 11'
  },
  // Linderos adicionales para casos especiales
  {
    id: 'lindero_nororiente',
    nombre: 'Lindero Nor-Oriente',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Si el predio tiene forma irregular'
  },
  {
    id: 'lindero_surponiente',
    nombre: 'Lindero Sur-Poniente',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Si el predio tiene forma irregular'
  },
  {
    id: 'lindero_oriente_sur',
    nombre: 'Lindero Oriente-Sur',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Si el predio tiene forma irregular'
  },
  // Linderos de fracción (para ventas parciales)
  {
    id: 'lindero_fraccion_norte',
    nombre: 'Lindero Norte (Fracción)',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Para venta parcial del terreno'
  },
  {
    id: 'lindero_fraccion_sur',
    nombre: 'Lindero Sur (Fracción)',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Para venta parcial del terreno'
  },
  {
    id: 'lindero_fraccion_oriente',
    nombre: 'Lindero Oriente (Fracción)',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Para venta parcial del terreno'
  },
  {
    id: 'lindero_fraccion_poniente',
    nombre: 'Lindero Poniente (Fracción)',
    tipo: 'text',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Para venta parcial del terreno'
  }
];

// --- SECCIÓN: ANTECEDENTES REGISTRALES ---
const CAMPOS_ANTECEDENTES: CampoFormulario[] = [
  {
    id: 'antecedente_escritura_numero',
    nombre: 'Número de Escritura Antecedente',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: 885'
  },
  {
    id: 'antecedente_escritura_fecha',
    nombre: 'Fecha de Escritura Antecedente',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: 20 de diciembre de 2004'
  },
  {
    id: 'antecedente_notario_nombre',
    nombre: 'Nombre del Notario Antecedente',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes_registrales',
    placeholder: 'Nombre del notario que autorizó la escritura previa'
  },
  {
    id: 'antecedente_notario_numero',
    nombre: 'Número de Notaría Antecedente',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes_registrales',
    placeholder: 'Número de la notaría previa'
  },
  {
    id: 'antecedente_adquirente',
    nombre: 'Nombre del Adquirente Original',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Quien adquirió el inmueble previamente'
  },
  {
    id: 'antecedente_enajenante',
    nombre: 'Nombre del Enajenante Original',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Quien vendió el inmueble previamente'
  },
  // Datos de inscripción en el Registro Público
  {
    id: 'registro_numero',
    nombre: 'Número de Registro',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: 50'
  },
  {
    id: 'registro_tomo',
    nombre: 'Tomo',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: 6407'
  },
  {
    id: 'registro_libro',
    nombre: 'Libro',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: PROPIEDAD'
  },
  {
    id: 'registro_seccion',
    nombre: 'Sección',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: Primera "A"'
  },
  {
    id: 'registro_volumen',
    nombre: 'Volumen',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Volumen del archivo registral'
  },
  {
    id: 'registro_foja',
    nombre: 'Foja',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Número de foja'
  },
  {
    id: 'registro_partida',
    nombre: 'Partida',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Número de partida'
  },
  {
    id: 'registro_distrito',
    nombre: 'Distrito del Registro',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ej: Morelia'
  },
  {
    id: 'registro_ciudad',
    nombre: 'Ciudad del Registro',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Ciudad donde se registró'
  },
  {
    id: 'registro_fecha',
    nombre: 'Fecha de Registro',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes_registrales',
    placeholder: 'Fecha de inscripción'
  }
];

// --- SECCIÓN: DATOS DE CONSTITUCIÓN DE SOCIEDAD (si aplica) ---
const CAMPOS_CONSTITUCION: CampoFormulario[] = [
  {
    id: 'constitucion_escritura_numero',
    nombre: 'Número de Escritura Constitutiva',
    tipo: 'text',
    requerido: false,
    seccion: 'constitucion_sociedad',
    placeholder: 'Número de la escritura de constitución'
  },
  {
    id: 'constitucion_escritura_fecha',
    nombre: 'Fecha de Escritura Constitutiva',
    tipo: 'text',
    requerido: false,
    seccion: 'constitucion_sociedad',
    placeholder: 'Fecha de constitución de la sociedad'
  },
  {
    id: 'constitucion_notario_nombre',
    nombre: 'Notario de la Constitución',
    tipo: 'text',
    requerido: false,
    seccion: 'constitucion_sociedad',
    placeholder: 'Nombre del notario que constituyó la sociedad'
  },
  {
    id: 'constitucion_notario_numero',
    nombre: 'Número de Notaría de Constitución',
    tipo: 'text',
    requerido: false,
    seccion: 'constitucion_sociedad',
    placeholder: 'Número de la notaría'
  },
  {
    id: 'constitucion_aportante',
    nombre: 'Nombre del Aportante',
    tipo: 'text',
    requerido: false,
    seccion: 'constitucion_sociedad',
    placeholder: 'Quien aportó el inmueble a la sociedad'
  }
];

// --- SECCIÓN: PERMISOS (SRE, Fraccionamiento, etc.) ---
const CAMPOS_PERMISOS: CampoFormulario[] = [
  {
    id: 'permiso_sre_numero',
    nombre: 'Número de Permiso SRE',
    tipo: 'text',
    requerido: false,
    seccion: 'permisos',
    placeholder: 'Número de autorización de la SRE'
  },
  {
    id: 'permiso_sre_expediente',
    nombre: 'Expediente SRE',
    tipo: 'text',
    requerido: false,
    seccion: 'permisos',
    placeholder: 'Número de expediente de la solicitud'
  },
  {
    id: 'permiso_sre_fecha',
    nombre: 'Fecha de Emisión del Permiso SRE',
    tipo: 'text',
    requerido: false,
    seccion: 'permisos',
    placeholder: 'Fecha de expedición'
  },
  {
    id: 'fraccionamiento_gaceta_numero',
    nombre: 'Número de Publicación en Gaceta',
    tipo: 'text',
    requerido: false,
    seccion: 'permisos',
    placeholder: 'Número de la gaceta oficial'
  },
  {
    id: 'fraccionamiento_gaceta_tomo',
    nombre: 'Tomo de Gaceta',
    tipo: 'text',
    requerido: false,
    seccion: 'permisos',
    placeholder: 'Tomo de la publicación'
  },
  {
    id: 'fraccionamiento_gaceta_fecha',
    nombre: 'Fecha de Publicación en Gaceta',
    tipo: 'text',
    requerido: false,
    seccion: 'permisos',
    placeholder: 'Fecha de emisión del permiso'
  }
];

// --- SECCIÓN: DATOS DE LA OPERACIÓN ---
const CAMPOS_OPERACION: CampoFormulario[] = [
  {
    id: 'operacion_precio',
    nombre: 'Precio de Venta',
    tipo: 'text',
    requerido: true,
    seccion: 'operacion',
    placeholder: 'Ej: $100,000.00 (CIEN MIL PESOS 00/100 M.N.)'
  },
  {
    id: 'operacion_precio_letra',
    nombre: 'Precio en Letra',
    tipo: 'text',
    requerido: true,
    seccion: 'operacion',
    placeholder: 'CIEN MIL PESOS 00/100 MONEDA NACIONAL'
  },
  {
    id: 'operacion_forma_pago',
    nombre: 'Forma de Pago',
    tipo: 'select',
    requerido: true,
    seccion: 'operacion',
    opciones: [
      'Efectivo',
      'Transferencia Bancaria',
      'Cheque',
      'Crédito Hipotecario',
      'Mixto'
    ]
  },
  {
    id: 'operacion_fianza_monto',
    nombre: 'Monto de Fianza/Garantía (si aplica)',
    tipo: 'text',
    requerido: false,
    seccion: 'operacion',
    placeholder: 'Cantidad entregada como garantía'
  },
  {
    id: 'operacion_tipo_adquisicion',
    nombre: 'Tipo de Adquisición',
    tipo: 'select',
    requerido: false,
    seccion: 'operacion',
    opciones: ['Individual', 'Mancomunada', 'Proindiviso', 'Por partes iguales']
  }
];

// --- SECCIÓN: AVALÚO FISCAL ---
const CAMPOS_AVALUO: CampoFormulario[] = [
  {
    id: 'avaluo_numero',
    nombre: 'Número de Avalúo',
    tipo: 'text',
    requerido: false,
    seccion: 'avaluo',
    placeholder: 'Ej: 2022-245-277'
  },
  {
    id: 'avaluo_fecha',
    nombre: 'Fecha del Avalúo',
    tipo: 'text',
    requerido: false,
    seccion: 'avaluo',
    placeholder: 'Fecha de realización'
  },
  {
    id: 'avaluo_valor',
    nombre: 'Valor del Avalúo',
    tipo: 'text',
    requerido: false,
    seccion: 'avaluo',
    placeholder: 'Ej: $6,816.00'
  },
  {
    id: 'avaluo_perito',
    nombre: 'Nombre del Perito Valuador',
    tipo: 'text',
    requerido: false,
    seccion: 'avaluo',
    placeholder: 'Nombre del valuador autorizado'
  }
];

// ============================================================================
// TIPOS DE CASOS DISPONIBLES
// ============================================================================

export const TIPOS_CASO: TipoCaso[] = [
  {
    id: 'compraventa_inmueble',
    nombre: 'Compraventa de Inmueble',
    descripcion:
      'Escritura pública de compra-venta de bienes raíces (terrenos, casas, departamentos, locales)',
    documentosSugeridos: [
      'ine_frente',
      'ine_reverso',
      'curp',
      'comprobante_domicilio',
      'escritura_propiedad',
      'predial',
      'constancia_no_adeudo',
      'avaluo',
      'certificado_libertad_gravamen'
    ],
    camposRequeridos: [
      ...CAMPOS_NOTARIO,
      ...CAMPOS_FECHA,
      ...CAMPOS_VENDEDOR,
      ...CAMPOS_COMPRADOR,
      ...CAMPOS_REPRESENTANTE,
      ...CAMPOS_SOCIEDAD,
      ...CAMPOS_INMUEBLE,
      ...CAMPOS_LINDEROS,
      ...CAMPOS_ANTECEDENTES,
      ...CAMPOS_CONSTITUCION,
      ...CAMPOS_PERMISOS,
      ...CAMPOS_OPERACION,
      ...CAMPOS_AVALUO
    ]
  }
];

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

// Obtener un tipo de caso por ID
export function getTipoCasoById(id: string): TipoCaso | undefined {
  return TIPOS_CASO.find((tipo) => tipo.id === id);
}

// Obtener un tipo de documento por ID
export function getTipoDocumentoById(id: string): TipoDocumento | undefined {
  return TIPOS_DOCUMENTO.find((tipo) => tipo.id === id);
}

// Obtener documentos sugeridos de un tipo de caso
export function getDocumentosSugeridos(tipoCasoId: string): TipoDocumento[] {
  const tipoCaso = getTipoCasoById(tipoCasoId);
  if (!tipoCaso) return [];

  return tipoCaso.documentosSugeridos
    .map((id) => getTipoDocumentoById(id))
    .filter((doc): doc is TipoDocumento => doc !== undefined);
}

// Agrupar campos por sección
export function agruparCamposPorSeccion(
  campos: CampoFormulario[]
): Record<string, CampoFormulario[]> {
  return campos.reduce((acc, campo) => {
    if (!acc[campo.seccion]) {
      acc[campo.seccion] = [];
    }
    acc[campo.seccion].push(campo);
    return acc;
  }, {} as Record<string, CampoFormulario[]>);
}

// Nombres legibles para las secciones
export const NOMBRES_SECCIONES: Record<string, string> = {
  notario: 'Datos del Notario',
  fecha_otorgamiento: 'Fecha de Otorgamiento',
  vendedor: 'Datos del Vendedor (Parte Enajenante)',
  comprador: 'Datos del Comprador (Parte Adquirente)',
  representante_legal: 'Representante Legal',
  sociedad: 'Datos de la Sociedad',
  inmueble: 'Datos del Inmueble',
  linderos: 'Linderos y Medidas',
  antecedentes_registrales: 'Antecedentes Registrales',
  constitucion_sociedad: 'Datos de Constitución de Sociedad',
  permisos: 'Permisos y Autorizaciones',
  operacion: 'Datos de la Operación',
  avaluo: 'Avalúo Fiscal'
};

// Obtener campos requeridos faltantes
export function getCamposFaltantes(
  tipoCasoId: string,
  datosActuales: Record<string, string>
): CampoFormulario[] {
  const tipoCaso = getTipoCasoById(tipoCasoId);
  if (!tipoCaso) return [];

  return tipoCaso.camposRequeridos.filter(
    (campo) => campo.requerido && !datosActuales[campo.id]
  );
}

// Calcular porcentaje de completitud
export function calcularCompletitud(
  tipoCasoId: string,
  datosActuales: Record<string, string>
): number {
  const tipoCaso = getTipoCasoById(tipoCasoId);
  if (!tipoCaso) return 0;

  const camposRequeridos = tipoCaso.camposRequeridos.filter((c) => c.requerido);
  const camposCompletados = camposRequeridos.filter(
    (campo) => datosActuales[campo.id] && datosActuales[campo.id].trim() !== ''
  );

  return Math.round((camposCompletados.length / camposRequeridos.length) * 100);
}
