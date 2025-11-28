// lib/config/tipos-caso.ts

import { TipoCaso, TipoDocumento, CampoFormulario } from '@/types';

// Tipos de documentos que se pueden subir
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
    id: 'otro',
    nombre: 'Otro Documento',
    descripcion: 'Documento adicional',
    requerido: false
  }
];

// Campos comunes que se usan en varios tipos de caso
const CAMPOS_PERSONA: CampoFormulario[] = [
  {
    id: 'nombre_completo',
    nombre: 'Nombre Completo',
    tipo: 'text',
    requerido: true,
    seccion: 'datos_personales',
    placeholder: 'Nombre(s) y Apellidos'
  },
  {
    id: 'curp',
    nombre: 'CURP',
    tipo: 'text',
    requerido: true,
    seccion: 'datos_personales',
    placeholder: 'XXXX000000XXXXXX00',
    validacion: { patron: '^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9A-Z]{2}$' }
  },
  {
    id: 'rfc',
    nombre: 'RFC',
    tipo: 'text',
    requerido: false,
    seccion: 'datos_personales',
    placeholder: 'XXXX000000XXX'
  },
  {
    id: 'fecha_nacimiento',
    nombre: 'Fecha de Nacimiento',
    tipo: 'date',
    requerido: true,
    seccion: 'datos_personales'
  },
  {
    id: 'lugar_nacimiento',
    nombre: 'Lugar de Nacimiento',
    tipo: 'text',
    requerido: true,
    seccion: 'datos_personales',
    placeholder: 'Ciudad, Estado'
  },
  {
    id: 'nacionalidad',
    nombre: 'Nacionalidad',
    tipo: 'text',
    requerido: true,
    seccion: 'datos_personales',
    placeholder: 'Mexicana'
  },
  {
    id: 'estado_civil',
    nombre: 'Estado Civil',
    tipo: 'select',
    requerido: true,
    seccion: 'datos_personales',
    opciones: [
      'Soltero(a)',
      'Casado(a)',
      'Divorciado(a)',
      'Viudo(a)',
      'Unión Libre'
    ]
  },
  {
    id: 'ocupacion',
    nombre: 'Ocupación',
    tipo: 'text',
    requerido: true,
    seccion: 'datos_personales',
    placeholder: 'Profesión u oficio'
  },
  {
    id: 'domicilio',
    nombre: 'Domicilio',
    tipo: 'textarea',
    requerido: true,
    seccion: 'datos_personales',
    placeholder: 'Calle, número, colonia, código postal, ciudad, estado'
  },
  {
    id: 'telefono',
    nombre: 'Teléfono',
    tipo: 'text',
    requerido: false,
    seccion: 'datos_personales',
    placeholder: '55 1234 5678'
  },
  {
    id: 'email',
    nombre: 'Correo Electrónico',
    tipo: 'text',
    requerido: false,
    seccion: 'datos_personales',
    placeholder: 'correo@ejemplo.com'
  }
];

const CAMPOS_INMUEBLE: CampoFormulario[] = [
  {
    id: 'ubicacion_inmueble',
    nombre: 'Ubicación del Inmueble',
    tipo: 'textarea',
    requerido: true,
    seccion: 'datos_inmueble',
    placeholder: 'Dirección completa del inmueble'
  },
  {
    id: 'folio_real',
    nombre: 'Folio Real',
    tipo: 'text',
    requerido: true,
    seccion: 'datos_inmueble',
    placeholder: 'Número de folio real'
  },
  {
    id: 'superficie_terreno',
    nombre: 'Superficie del Terreno (m²)',
    tipo: 'number',
    requerido: true,
    seccion: 'datos_inmueble'
  },
  {
    id: 'superficie_construccion',
    nombre: 'Superficie de Construcción (m²)',
    tipo: 'number',
    requerido: false,
    seccion: 'datos_inmueble'
  },
  {
    id: 'medidas_colindancias',
    nombre: 'Medidas y Colindancias',
    tipo: 'textarea',
    requerido: true,
    seccion: 'datos_inmueble',
    placeholder: 'Al norte X metros con...'
  },
  {
    id: 'antecedentes_propiedad',
    nombre: 'Antecedentes de Propiedad',
    tipo: 'textarea',
    requerido: false,
    seccion: 'datos_inmueble',
    placeholder: 'Escritura anterior, número, fecha, notario'
  },
  {
    id: 'valor_catastral',
    nombre: 'Valor Catastral',
    tipo: 'number',
    requerido: false,
    seccion: 'datos_inmueble'
  }
];

// Tipos de casos disponibles
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
      'avaluo'
    ],
    camposRequeridos: [
      // Vendedor
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `vendedor_${c.id}`,
        seccion: 'vendedor'
      })),
      // Comprador
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `comprador_${c.id}`,
        seccion: 'comprador'
      })),
      // Inmueble
      ...CAMPOS_INMUEBLE,
      // Datos de la operación
      {
        id: 'precio_venta',
        nombre: 'Precio de Venta',
        tipo: 'number',
        requerido: true,
        seccion: 'operacion',
        placeholder: 'Cantidad en pesos'
      },
      {
        id: 'forma_pago',
        nombre: 'Forma de Pago',
        tipo: 'select',
        requerido: true,
        seccion: 'operacion',
        opciones: [
          'Efectivo',
          'Transferencia',
          'Cheque',
          'Crédito Hipotecario',
          'Mixto'
        ]
      }
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
      // Poderdante
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `poderdante_${c.id}`,
        seccion: 'poderdante'
      })),
      // Apoderado
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `apoderado_${c.id}`,
        seccion: 'apoderado'
      })),
      // Datos del poder
      {
        id: 'tipo_poder',
        nombre: 'Tipo de Poder',
        tipo: 'select',
        requerido: true,
        seccion: 'poder',
        opciones: [
          'General para Pleitos y Cobranzas',
          'General para Actos de Administración',
          'General para Actos de Dominio',
          'Especial (especificar)'
        ]
      },
      {
        id: 'facultades',
        nombre: 'Facultades Específicas',
        tipo: 'textarea',
        requerido: true,
        seccion: 'poder',
        placeholder: 'Describir las facultades que se otorgan'
      },
      {
        id: 'vigencia',
        nombre: 'Vigencia',
        tipo: 'select',
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
      // Testador
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `testador_${c.id}`,
        seccion: 'testador'
      })),
      // Herederos
      {
        id: 'herederos',
        nombre: 'Herederos',
        tipo: 'textarea',
        requerido: true,
        seccion: 'disposiciones',
        placeholder: 'Nombre completo y parentesco de cada heredero'
      },
      {
        id: 'bienes',
        nombre: 'Bienes a Heredar',
        tipo: 'textarea',
        requerido: true,
        seccion: 'disposiciones',
        placeholder: 'Descripción de los bienes y su distribución'
      },
      {
        id: 'albacea',
        nombre: 'Albacea',
        tipo: 'text',
        requerido: true,
        seccion: 'disposiciones',
        placeholder: 'Nombre del albacea designado'
      },
      {
        id: 'albacea_suplente',
        nombre: 'Albacea Suplente',
        tipo: 'text',
        requerido: false,
        seccion: 'disposiciones',
        placeholder: 'Nombre del albacea suplente'
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
      // Datos de la sociedad
      {
        id: 'denominacion_social',
        nombre: 'Denominación Social',
        tipo: 'text',
        requerido: true,
        seccion: 'sociedad',
        placeholder: 'Nombre de la empresa'
      },
      {
        id: 'tipo_sociedad',
        nombre: 'Tipo de Sociedad',
        tipo: 'select',
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
        tipo: 'textarea',
        requerido: true,
        seccion: 'sociedad',
        placeholder: 'Actividades de la empresa'
      },
      {
        id: 'capital_social',
        nombre: 'Capital Social',
        tipo: 'number',
        requerido: true,
        seccion: 'sociedad'
      },
      {
        id: 'domicilio_social',
        nombre: 'Domicilio Social',
        tipo: 'textarea',
        requerido: true,
        seccion: 'sociedad',
        placeholder: 'Dirección de la empresa'
      },
      {
        id: 'duracion',
        nombre: 'Duración',
        tipo: 'select',
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
      {
        id: 'denominacion_sociedad',
        nombre: 'Denominación de la Sociedad',
        tipo: 'text',
        requerido: true,
        seccion: 'sociedad'
      },
      {
        id: 'tipo_asamblea',
        nombre: 'Tipo de Asamblea',
        tipo: 'select',
        requerido: true,
        seccion: 'asamblea',
        opciones: ['Ordinaria', 'Extraordinaria', 'Mixta']
      },
      {
        id: 'fecha_asamblea',
        nombre: 'Fecha de la Asamblea',
        tipo: 'date',
        requerido: true,
        seccion: 'asamblea'
      },
      {
        id: 'orden_del_dia',
        nombre: 'Orden del Día',
        tipo: 'textarea',
        requerido: true,
        seccion: 'asamblea',
        placeholder: 'Puntos a tratar en la asamblea'
      },
      {
        id: 'acuerdos',
        nombre: 'Acuerdos Tomados',
        tipo: 'textarea',
        requerido: true,
        seccion: 'asamblea',
        placeholder: 'Resoluciones de la asamblea'
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
      // Arrendador
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `arrendador_${c.id}`,
        seccion: 'arrendador'
      })),
      // Arrendatario
      ...CAMPOS_PERSONA.map((c) => ({
        ...c,
        id: `arrendatario_${c.id}`,
        seccion: 'arrendatario'
      })),
      // Inmueble
      ...CAMPOS_INMUEBLE.map((c) => ({
        ...c,
        seccion: 'inmueble_arrendado'
      })),
      // Condiciones
      {
        id: 'renta_mensual',
        nombre: 'Renta Mensual',
        tipo: 'number',
        requerido: true,
        seccion: 'condiciones'
      },
      {
        id: 'deposito',
        nombre: 'Depósito en Garantía',
        tipo: 'number',
        requerido: true,
        seccion: 'condiciones'
      },
      {
        id: 'vigencia_contrato',
        nombre: 'Vigencia del Contrato',
        tipo: 'select',
        requerido: true,
        seccion: 'condiciones',
        opciones: ['1 año', '2 años', '3 años', 'Indefinido']
      },
      {
        id: 'fecha_inicio',
        nombre: 'Fecha de Inicio',
        tipo: 'date',
        requerido: true,
        seccion: 'condiciones'
      },
      {
        id: 'uso_inmueble',
        nombre: 'Uso del Inmueble',
        tipo: 'select',
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

// Helper para obtener un tipo de caso por ID
export function getTipoCasoById(id: string): TipoCaso | undefined {
  return TIPOS_CASO.find((tipo) => tipo.id === id);
}

// Helper para obtener un tipo de documento por ID
export function getTipoDocumentoById(id: string): TipoDocumento | undefined {
  return TIPOS_DOCUMENTO.find((tipo) => tipo.id === id);
}

// Helper para obtener documentos sugeridos de un tipo de caso
export function getDocumentosSugeridos(tipoCasoId: string): TipoDocumento[] {
  const tipoCaso = getTipoCasoById(tipoCasoId);
  if (!tipoCaso) return [];

  return tipoCaso.documentosSugeridos
    .map((id) => getTipoDocumentoById(id))
    .filter((doc): doc is TipoDocumento => doc !== undefined);
}

// Helper para agrupar campos por sección
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
  datos_personales: 'Datos Personales',
  vendedor: 'Datos del Vendedor',
  comprador: 'Datos del Comprador',
  poderdante: 'Datos del Poderdante',
  apoderado: 'Datos del Apoderado',
  testador: 'Datos del Testador',
  arrendador: 'Datos del Arrendador',
  arrendatario: 'Datos del Arrendatario',
  datos_inmueble: 'Datos del Inmueble',
  inmueble_arrendado: 'Datos del Inmueble Arrendado',
  operacion: 'Datos de la Operación',
  poder: 'Datos del Poder',
  disposiciones: 'Disposiciones Testamentarias',
  sociedad: 'Datos de la Sociedad',
  asamblea: 'Datos de la Asamblea',
  condiciones: 'Condiciones del Arrendamiento'
};
