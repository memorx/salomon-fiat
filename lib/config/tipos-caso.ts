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
    requerido: false
  },
  {
    id: 'predial',
    nombre: 'Recibo Predial',
    descripcion: 'Último recibo de pago del predial',
    requerido: false
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
    descripcion: 'Avalúo comercial del inmueble',
    requerido: false
  },
  {
    id: 'rfc',
    nombre: 'Constancia de RFC',
    descripcion: 'Constancia de situación fiscal',
    requerido: false
  },
  {
    id: 'poder_previo',
    nombre: 'Poder Previo',
    descripcion: 'Poder notarial previo (si existe)',
    requerido: false
  },
  {
    id: 'certificado_libertad_gravamen',
    nombre: 'Certificado de Libertad de Gravamen',
    descripcion: 'Certificado del Registro Público',
    requerido: false
  },
  {
    id: 'acta_constitutiva',
    nombre: 'Acta Constitutiva',
    descripcion: 'Para personas morales',
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
// CAMPOS POR SECCIÓN - COMPRAVENTA INMUEBLE (135 campos)
// ============================================================================

const CAMPOS_NOTARIO: CampoFormulario[] = [
  {
    id: 'notario_nombre',
    nombre: 'Nombre del Notario',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Lic. Juan Pérez García'
  },
  {
    id: 'notario_numero',
    nombre: 'Número de Notaría',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: '157'
  },
  {
    id: 'notario_estado',
    nombre: 'Estado',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Michoacán'
  },
  {
    id: 'notario_ciudad',
    nombre: 'Ciudad/Municipio',
    tipo: 'text',
    requerido: true,
    seccion: 'notario',
    placeholder: 'Quiroga'
  }
];

const CAMPOS_FECHA: CampoFormulario[] = [
  {
    id: 'fecha_dia',
    nombre: 'Día',
    tipo: 'number',
    requerido: true,
    seccion: 'fecha',
    placeholder: '28'
  },
  {
    id: 'fecha_mes',
    nombre: 'Mes',
    tipo: 'text',
    requerido: true,
    seccion: 'fecha',
    placeholder: 'enero'
  },
  {
    id: 'fecha_ano',
    nombre: 'Año',
    tipo: 'number',
    requerido: true,
    seccion: 'fecha',
    placeholder: '2025'
  },
  {
    id: 'fecha_hora',
    nombre: 'Hora',
    tipo: 'text',
    requerido: false,
    seccion: 'fecha',
    placeholder: '12:00'
  }
];

const CAMPOS_VENDEDOR: CampoFormulario[] = [
  {
    id: 'vendedor_nombre',
    nombre: 'Nombre Completo',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Juan Pérez García'
  },
  {
    id: 'vendedor_nacionalidad',
    nombre: 'Nacionalidad',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Mexicana'
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
    placeholder: 'Comerciante'
  },
  {
    id: 'vendedor_lugar_origen',
    nombre: 'Lugar de Origen',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Morelia, Michoacán'
  },
  {
    id: 'vendedor_fecha_nacimiento',
    nombre: 'Fecha de Nacimiento',
    tipo: 'date',
    requerido: true,
    seccion: 'vendedor'
  },
  {
    id: 'vendedor_edad',
    nombre: 'Edad',
    tipo: 'number',
    requerido: false,
    seccion: 'vendedor',
    placeholder: '45'
  },
  {
    id: 'vendedor_curp',
    nombre: 'CURP',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'PEGJ800101HMNRRC09'
  },
  {
    id: 'vendedor_rfc',
    nombre: 'RFC',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'PEGJ800101XXX'
  },
  {
    id: 'vendedor_ine',
    nombre: 'Clave de Elector INE',
    tipo: 'text',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'ABCDEF12345678'
  },
  {
    id: 'vendedor_domicilio',
    nombre: 'Domicilio',
    tipo: 'textarea',
    requerido: true,
    seccion: 'vendedor',
    placeholder: 'Calle, número, colonia'
  },
  {
    id: 'vendedor_colonia',
    nombre: 'Colonia',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor'
  },
  {
    id: 'vendedor_cp',
    nombre: 'Código Postal',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: '58000'
  },
  {
    id: 'vendedor_conyuge_nombre',
    nombre: 'Nombre del Cónyuge',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor',
    placeholder: 'Si aplica'
  },
  {
    id: 'vendedor_conyuge_lugar_origen',
    nombre: 'Lugar de Origen del Cónyuge',
    tipo: 'text',
    requerido: false,
    seccion: 'vendedor'
  }
];

const CAMPOS_COMPRADOR: CampoFormulario[] = [
  {
    id: 'comprador_nombre',
    nombre: 'Nombre Completo',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'María López Hernández'
  },
  {
    id: 'comprador_nacionalidad',
    nombre: 'Nacionalidad',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Mexicana'
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
    placeholder: 'Empleada'
  },
  {
    id: 'comprador_lugar_origen',
    nombre: 'Lugar de Origen',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Pátzcuaro, Michoacán'
  },
  {
    id: 'comprador_fecha_nacimiento',
    nombre: 'Fecha de Nacimiento',
    tipo: 'date',
    requerido: true,
    seccion: 'comprador'
  },
  {
    id: 'comprador_edad',
    nombre: 'Edad',
    tipo: 'number',
    requerido: false,
    seccion: 'comprador',
    placeholder: '38'
  },
  {
    id: 'comprador_curp',
    nombre: 'CURP',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'LOHM850215MMNPRC05'
  },
  {
    id: 'comprador_rfc',
    nombre: 'RFC',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'LOHM850215XXX'
  },
  {
    id: 'comprador_ine',
    nombre: 'Clave de Elector INE',
    tipo: 'text',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'XYZABC98765432'
  },
  {
    id: 'comprador_domicilio',
    nombre: 'Domicilio',
    tipo: 'textarea',
    requerido: true,
    seccion: 'comprador',
    placeholder: 'Calle, número, colonia'
  },
  {
    id: 'comprador_colonia',
    nombre: 'Colonia',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador'
  },
  {
    id: 'comprador_cp',
    nombre: 'Código Postal',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: '61600'
  },
  {
    id: 'comprador_conyuge_nombre',
    nombre: 'Nombre del Cónyuge',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Si aplica'
  },
  {
    id: 'comprador_conyuge_lugar_origen',
    nombre: 'Lugar de Origen del Cónyuge',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador'
  },
  {
    id: 'comprador2_nombre',
    nombre: 'Segundo Comprador (Nombre)',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador',
    placeholder: 'Si aplica proindiviso'
  },
  {
    id: 'comprador2_curp',
    nombre: 'Segundo Comprador (CURP)',
    tipo: 'text',
    requerido: false,
    seccion: 'comprador'
  }
];

const CAMPOS_REPRESENTANTE: CampoFormulario[] = [
  {
    id: 'representante_nombre',
    nombre: 'Nombre del Representante',
    tipo: 'text',
    requerido: false,
    seccion: 'representante',
    placeholder: 'Si aplica persona moral'
  },
  {
    id: 'representante_cargo',
    nombre: 'Cargo',
    tipo: 'text',
    requerido: false,
    seccion: 'representante',
    placeholder: 'Apoderado Legal'
  },
  {
    id: 'representante_lugar_origen',
    nombre: 'Lugar de Origen',
    tipo: 'text',
    requerido: false,
    seccion: 'representante'
  },
  {
    id: 'representante_edad',
    nombre: 'Edad',
    tipo: 'number',
    requerido: false,
    seccion: 'representante'
  },
  {
    id: 'representante_ocupacion',
    nombre: 'Ocupación',
    tipo: 'text',
    requerido: false,
    seccion: 'representante'
  },
  {
    id: 'representante_estado_civil',
    nombre: 'Estado Civil',
    tipo: 'select',
    requerido: false,
    seccion: 'representante',
    opciones: ['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)']
  }
];

const CAMPOS_INMUEBLE: CampoFormulario[] = [
  {
    id: 'inmueble_tipo',
    nombre: 'Tipo de Inmueble',
    tipo: 'select',
    requerido: true,
    seccion: 'inmueble',
    opciones: [
      'Casa habitación',
      'Terreno',
      'Departamento',
      'Local comercial',
      'Bodega',
      'Otro'
    ]
  },
  {
    id: 'inmueble_numero_lote',
    nombre: 'Número de Lote',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: '15'
  },
  {
    id: 'inmueble_numero_manzana',
    nombre: 'Número de Manzana',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: '3'
  },
  {
    id: 'inmueble_numero_casa',
    nombre: 'Número Exterior',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: '123'
  },
  {
    id: 'inmueble_calle',
    nombre: 'Calle',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Av. Juárez'
  },
  {
    id: 'inmueble_fraccionamiento',
    nombre: 'Fraccionamiento',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Si aplica'
  },
  {
    id: 'inmueble_colonia',
    nombre: 'Colonia',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Centro'
  },
  {
    id: 'inmueble_colonia_anterior',
    nombre: 'Colonia Anterior',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Si cambió nombre'
  },
  {
    id: 'inmueble_municipio',
    nombre: 'Municipio',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Morelia'
  },
  {
    id: 'inmueble_distrito',
    nombre: 'Distrito Judicial',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: 'Morelia'
  },
  {
    id: 'inmueble_estado',
    nombre: 'Estado',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: 'Michoacán'
  },
  {
    id: 'inmueble_cp',
    nombre: 'Código Postal',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: '58000'
  },
  {
    id: 'inmueble_superficie',
    nombre: 'Superficie Terreno (m²)',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: '200.00'
  },
  {
    id: 'inmueble_superficie_construccion',
    nombre: 'Superficie Construcción (m²)',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble',
    placeholder: '150.00'
  },
  {
    id: 'inmueble_cuenta_predial',
    nombre: 'Cuenta Predial',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: '001-234-567'
  },
  {
    id: 'inmueble_clave_catastral',
    nombre: 'Clave Catastral',
    tipo: 'text',
    requerido: true,
    seccion: 'inmueble',
    placeholder: '16-001-001-001-001'
  },
  {
    id: 'inmueble_valor_catastral',
    nombre: 'Valor Catastral',
    tipo: 'number',
    requerido: false,
    seccion: 'inmueble',
    placeholder: '500000'
  },
  {
    id: 'inmueble_calle_colindante',
    nombre: 'Calle Colindante',
    tipo: 'text',
    requerido: false,
    seccion: 'inmueble'
  }
];

const CAMPOS_LINDEROS: CampoFormulario[] = [
  {
    id: 'lindero_norte',
    nombre: 'Al Norte',
    tipo: 'textarea',
    requerido: true,
    seccion: 'linderos',
    placeholder: '10.00 metros con propiedad de...'
  },
  {
    id: 'lindero_sur',
    nombre: 'Al Sur',
    tipo: 'textarea',
    requerido: true,
    seccion: 'linderos',
    placeholder: '10.00 metros con calle...'
  },
  {
    id: 'lindero_oriente',
    nombre: 'Al Oriente',
    tipo: 'textarea',
    requerido: true,
    seccion: 'linderos',
    placeholder: '20.00 metros con lote...'
  },
  {
    id: 'lindero_poniente',
    nombre: 'Al Poniente',
    tipo: 'textarea',
    requerido: true,
    seccion: 'linderos',
    placeholder: '20.00 metros con propiedad de...'
  },
  {
    id: 'lindero_nororiente',
    nombre: 'Al Nororiente',
    tipo: 'textarea',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Si aplica terreno irregular'
  },
  {
    id: 'lindero_surponiente',
    nombre: 'Al Surponiente',
    tipo: 'textarea',
    requerido: false,
    seccion: 'linderos',
    placeholder: 'Si aplica terreno irregular'
  }
];

const CAMPOS_ANTECEDENTES: CampoFormulario[] = [
  {
    id: 'antecedente_escritura_numero',
    nombre: 'Número de Escritura Anterior',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes',
    placeholder: '5432'
  },
  {
    id: 'antecedente_escritura_fecha',
    nombre: 'Fecha de Escritura',
    tipo: 'date',
    requerido: true,
    seccion: 'antecedentes'
  },
  {
    id: 'antecedente_notario_nombre',
    nombre: 'Notario que la otorgó',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes',
    placeholder: 'Lic. Pedro López'
  },
  {
    id: 'antecedente_notario_numero',
    nombre: 'Número de Notaría',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes',
    placeholder: '25'
  },
  {
    id: 'antecedente_adquirente',
    nombre: 'Adquirente Original',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes'
  },
  {
    id: 'antecedente_enajenante',
    nombre: 'Enajenante Original',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes'
  },
  {
    id: 'registro_numero',
    nombre: 'Número de Inscripción',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes',
    placeholder: '12345'
  },
  {
    id: 'registro_tomo',
    nombre: 'Tomo',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes'
  },
  {
    id: 'registro_libro',
    nombre: 'Libro',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes'
  },
  {
    id: 'registro_seccion',
    nombre: 'Sección',
    tipo: 'text',
    requerido: false,
    seccion: 'antecedentes',
    placeholder: 'Primera'
  },
  {
    id: 'registro_distrito',
    nombre: 'Distrito de Registro',
    tipo: 'text',
    requerido: true,
    seccion: 'antecedentes',
    placeholder: 'Morelia'
  },
  {
    id: 'registro_fecha',
    nombre: 'Fecha de Inscripción',
    tipo: 'date',
    requerido: true,
    seccion: 'antecedentes'
  }
];

const CAMPOS_OPERACION: CampoFormulario[] = [
  {
    id: 'operacion_precio',
    nombre: 'Precio de Venta (número)',
    tipo: 'number',
    requerido: true,
    seccion: 'operacion',
    placeholder: '1500000'
  },
  {
    id: 'operacion_precio_letra',
    nombre: 'Precio en Letra',
    tipo: 'text',
    requerido: true,
    seccion: 'operacion',
    placeholder: 'UN MILLÓN QUINIENTOS MIL PESOS'
  },
  {
    id: 'operacion_forma_pago',
    nombre: 'Forma de Pago',
    tipo: 'select',
    requerido: true,
    seccion: 'operacion',
    opciones: [
      'Efectivo',
      'Transferencia bancaria',
      'Cheque certificado',
      'Crédito hipotecario',
      'Mixto'
    ]
  },
  {
    id: 'operacion_fianza_monto',
    nombre: 'Monto de Fianza/Anticipo',
    tipo: 'number',
    requerido: false,
    seccion: 'operacion'
  },
  {
    id: 'operacion_tipo_adquisicion',
    nombre: 'Tipo de Adquisición',
    tipo: 'select',
    requerido: false,
    seccion: 'operacion',
    opciones: ['Compraventa', 'Donación', 'Herencia', 'Adjudicación']
  }
];

const CAMPOS_AVALUO: CampoFormulario[] = [
  {
    id: 'avaluo_numero',
    nombre: 'Número de Avalúo',
    tipo: 'text',
    requerido: false,
    seccion: 'avaluo',
    placeholder: 'AV-2025-001'
  },
  {
    id: 'avaluo_fecha',
    nombre: 'Fecha del Avalúo',
    tipo: 'date',
    requerido: false,
    seccion: 'avaluo'
  },
  {
    id: 'avaluo_valor',
    nombre: 'Valor del Avalúo',
    tipo: 'number',
    requerido: false,
    seccion: 'avaluo',
    placeholder: '1600000'
  },
  {
    id: 'avaluo_perito',
    nombre: 'Nombre del Perito Valuador',
    tipo: 'text',
    requerido: false,
    seccion: 'avaluo'
  }
];

// ============================================================================
// NOMBRES DE SECCIONES
// ============================================================================

export const NOMBRES_SECCIONES: Record<string, string> = {
  notario: 'Datos del Notario',
  fecha: 'Fecha de la Escritura',
  vendedor: 'Datos del Vendedor',
  comprador: 'Datos del Comprador',
  representante: 'Representante Legal',
  inmueble: 'Datos del Inmueble',
  linderos: 'Linderos y Medidas',
  antecedentes: 'Antecedentes de Propiedad',
  operacion: 'Datos de la Operación',
  avaluo: 'Avalúo',
  permisos: 'Permisos y Autorizaciones',
  sociedad: 'Datos de Sociedad',
  constitucion: 'Datos de Constitución',
  poderdante: 'Datos del Poderdante',
  apoderado: 'Datos del Apoderado',
  poder: 'Datos del Poder',
  testador: 'Datos del Testador',
  disposiciones: 'Disposiciones Testamentarias',
  arrendador: 'Datos del Arrendador',
  arrendatario: 'Datos del Arrendatario',
  inmueble_arrendado: 'Inmueble Arrendado',
  condiciones: 'Condiciones del Arrendamiento',
  asamblea: 'Datos de la Asamblea'
};

// ============================================================================
// TIPOS DE CASOS
// ============================================================================

export const TIPOS_CASO: TipoCaso[] = [
  {
    id: 'compraventa_inmueble',
    nombre: 'Compraventa de Inmueble',
    descripcion: 'Escritura pública de compra-venta de bienes raíces',
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
      ...CAMPOS_INMUEBLE,
      ...CAMPOS_LINDEROS,
      ...CAMPOS_ANTECEDENTES,
      ...CAMPOS_OPERACION,
      ...CAMPOS_AVALUO
    ]
  },
  {
    id: 'poder_notarial',
    nombre: 'Poder Notarial',
    descripcion: 'Poder general o especial para representación legal',
    documentosSugeridos: [
      'ine_frente',
      'ine_reverso',
      'curp',
      'comprobante_domicilio'
    ],
    camposRequeridos: [
      ...CAMPOS_NOTARIO,
      ...CAMPOS_FECHA,
      ...CAMPOS_VENDEDOR.map((c) => ({
        ...c,
        id: c.id.replace('vendedor_', 'poderdante_'),
        seccion: 'poderdante'
      })),
      ...CAMPOS_COMPRADOR.slice(0, 13).map((c) => ({
        ...c,
        id: c.id.replace('comprador_', 'apoderado_'),
        seccion: 'apoderado'
      })),
      {
        id: 'tipo_poder',
        nombre: 'Tipo de Poder',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'poder',
        opciones: [
          'General para Pleitos y Cobranzas',
          'General para Actos de Administración',
          'General para Actos de Dominio',
          'Especial'
        ]
      },
      {
        id: 'facultades',
        nombre: 'Facultades Específicas',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'poder',
        placeholder: 'Describir las facultades que se otorgan'
      },
      {
        id: 'vigencia',
        nombre: 'Vigencia',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'poder',
        opciones: [
          'Indefinida',
          '1 año',
          '2 años',
          '5 años',
          'Hasta revocación'
        ]
      }
    ]
  },
  {
    id: 'testamento',
    nombre: 'Testamento Público Abierto',
    descripcion: 'Testamento público abierto ante notario',
    documentosSugeridos: [
      'ine_frente',
      'ine_reverso',
      'curp',
      'acta_nacimiento',
      'comprobante_domicilio'
    ],
    camposRequeridos: [
      ...CAMPOS_NOTARIO,
      ...CAMPOS_FECHA,
      ...CAMPOS_VENDEDOR.map((c) => ({
        ...c,
        id: c.id.replace('vendedor_', 'testador_'),
        seccion: 'testador'
      })),
      {
        id: 'herederos',
        nombre: 'Herederos',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'disposiciones',
        placeholder: 'Nombre completo y parentesco de cada heredero'
      },
      {
        id: 'bienes',
        nombre: 'Bienes a Heredar',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'disposiciones',
        placeholder: 'Descripción de los bienes y su distribución'
      },
      {
        id: 'albacea',
        nombre: 'Albacea',
        tipo: 'text' as const,
        requerido: true,
        seccion: 'disposiciones',
        placeholder: 'Nombre del albacea designado'
      },
      {
        id: 'albacea_suplente',
        nombre: 'Albacea Suplente',
        tipo: 'text' as const,
        requerido: false,
        seccion: 'disposiciones'
      }
    ]
  },
  {
    id: 'constitucion_sociedad',
    nombre: 'Constitución de Sociedad',
    descripcion: 'Escritura de constitución de empresa',
    documentosSugeridos: [
      'ine_frente',
      'ine_reverso',
      'curp',
      'comprobante_domicilio',
      'rfc'
    ],
    camposRequeridos: [
      ...CAMPOS_NOTARIO,
      ...CAMPOS_FECHA,
      {
        id: 'denominacion_social',
        nombre: 'Denominación Social',
        tipo: 'text' as const,
        requerido: true,
        seccion: 'sociedad',
        placeholder: 'Nombre de la empresa'
      },
      {
        id: 'tipo_sociedad',
        nombre: 'Tipo de Sociedad',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'sociedad',
        opciones: [
          'S.A. de C.V.',
          'S. de R.L. de C.V.',
          'S.A.S.',
          'S.C.',
          'A.C.'
        ]
      },
      {
        id: 'objeto_social',
        nombre: 'Objeto Social',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'sociedad',
        placeholder: 'Actividades de la empresa'
      },
      {
        id: 'capital_social',
        nombre: 'Capital Social',
        tipo: 'number' as const,
        requerido: true,
        seccion: 'sociedad'
      },
      {
        id: 'domicilio_social',
        nombre: 'Domicilio Social',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'sociedad'
      },
      {
        id: 'duracion',
        nombre: 'Duración',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'sociedad',
        opciones: ['99 años', 'Indefinida', 'Otra']
      }
    ]
  },
  {
    id: 'acta_asamblea',
    nombre: 'Acta de Asamblea',
    descripcion: 'Protocolización de acta de asamblea de accionistas',
    documentosSugeridos: ['ine_frente', 'ine_reverso', 'poder_previo'],
    camposRequeridos: [
      ...CAMPOS_NOTARIO,
      ...CAMPOS_FECHA,
      {
        id: 'denominacion_sociedad',
        nombre: 'Denominación de la Sociedad',
        tipo: 'text' as const,
        requerido: true,
        seccion: 'sociedad'
      },
      {
        id: 'tipo_asamblea',
        nombre: 'Tipo de Asamblea',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'asamblea',
        opciones: ['Ordinaria', 'Extraordinaria', 'Mixta']
      },
      {
        id: 'fecha_asamblea',
        nombre: 'Fecha de la Asamblea',
        tipo: 'date' as const,
        requerido: true,
        seccion: 'asamblea'
      },
      {
        id: 'orden_del_dia',
        nombre: 'Orden del Día',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'asamblea'
      },
      {
        id: 'acuerdos',
        nombre: 'Acuerdos Tomados',
        tipo: 'textarea' as const,
        requerido: true,
        seccion: 'asamblea'
      }
    ]
  },
  {
    id: 'contrato_arrendamiento',
    nombre: 'Contrato de Arrendamiento',
    descripcion: 'Contrato de renta de inmueble',
    documentosSugeridos: [
      'ine_frente',
      'ine_reverso',
      'curp',
      'comprobante_domicilio',
      'escritura_propiedad'
    ],
    camposRequeridos: [
      ...CAMPOS_NOTARIO,
      ...CAMPOS_FECHA,
      ...CAMPOS_VENDEDOR.map((c) => ({
        ...c,
        id: c.id.replace('vendedor_', 'arrendador_'),
        seccion: 'arrendador'
      })),
      ...CAMPOS_COMPRADOR.slice(0, 13).map((c) => ({
        ...c,
        id: c.id.replace('comprador_', 'arrendatario_'),
        seccion: 'arrendatario'
      })),
      ...CAMPOS_INMUEBLE.map((c) => ({ ...c, seccion: 'inmueble_arrendado' })),
      {
        id: 'renta_mensual',
        nombre: 'Renta Mensual',
        tipo: 'number' as const,
        requerido: true,
        seccion: 'condiciones'
      },
      {
        id: 'deposito',
        nombre: 'Depósito en Garantía',
        tipo: 'number' as const,
        requerido: true,
        seccion: 'condiciones'
      },
      {
        id: 'vigencia_contrato',
        nombre: 'Vigencia del Contrato',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'condiciones',
        opciones: ['1 año', '2 años', '3 años', 'Indefinido']
      },
      {
        id: 'fecha_inicio',
        nombre: 'Fecha de Inicio',
        tipo: 'date' as const,
        requerido: true,
        seccion: 'condiciones'
      },
      {
        id: 'uso_inmueble',
        nombre: 'Uso del Inmueble',
        tipo: 'select' as const,
        requerido: true,
        seccion: 'condiciones',
        opciones: [
          'Habitacional',
          'Comercial',
          'Oficinas',
          'Industrial',
          'Mixto'
        ]
      }
    ]
  }
];

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

export function getTipoCasoById(id: string): TipoCaso | undefined {
  return TIPOS_CASO.find((tipo) => tipo.id === id);
}

export function getTipoDocumentoById(id: string): TipoDocumento | undefined {
  return TIPOS_DOCUMENTO.find((tipo) => tipo.id === id);
}

export function getDocumentosSugeridos(tipoCasoId: string): TipoDocumento[] {
  const tipoCaso = getTipoCasoById(tipoCasoId);
  if (!tipoCaso) return [];
  return tipoCaso.documentosSugeridos
    .map((id) => getTipoDocumentoById(id))
    .filter((doc): doc is TipoDocumento => doc !== undefined);
}

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

export function getCamposFaltantes(
  campos: CampoFormulario[],
  valores: Record<string, string>
): string[] {
  return campos.filter((c) => c.requerido && !valores[c.id]).map((c) => c.id);
}

export function calcularCompletitud(
  campos: CampoFormulario[],
  valores: Record<string, string>
): number {
  const camposRequeridos = campos.filter((c) => c.requerido);
  if (camposRequeridos.length === 0) return 100;
  const completados = camposRequeridos.filter((c) =>
    valores[c.id]?.trim()
  ).length;
  return Math.round((completados / camposRequeridos.length) * 100);
}
