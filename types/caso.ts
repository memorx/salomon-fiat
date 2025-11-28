// types/caso.ts

// Estados posibles de un caso
export type CasoStatus =
  | 'PENDIENTE' // Recién creado, sin procesar
  | 'PROCESANDO_OCR' // Extrayendo datos de documentos
  | 'EXTRAYENDO_INFO' // IA analizando información
  | 'REQUIERE_INFO' // Faltan datos, necesita input del usuario
  | 'GENERANDO_DOCUMENTO' // Creando el documento final
  | 'EN_REVISION' // Documento generado, pendiente de revisión
  | 'COMPLETADO' // Caso finalizado
  | 'ERROR'; // Ocurrió un error

// Estados de un documento generado
export type DocumentoStatus =
  | 'BORRADOR'
  | 'EN_REVISION'
  | 'APROBADO'
  | 'IMPRESO';

// Tipos de casos/trámites disponibles
export interface TipoCaso {
  id: string;
  nombre: string;
  descripcion: string;
  camposRequeridos: CampoFormulario[];
  documentosSugeridos: string[];
}

// Tipos de documentos que se pueden subir
export interface TipoDocumento {
  id: string;
  nombre: string;
  descripcion: string;
  requerido: boolean;
}

// Campo de formulario dinámico
export interface CampoFormulario {
  id: string;
  nombre: string;
  tipo: 'text' | 'number' | 'date' | 'select' | 'textarea';
  requerido: boolean;
  seccion: string;
  placeholder?: string;
  opciones?: string[]; // Para tipo 'select'
  validacion?: {
    min?: number;
    max?: number;
    patron?: string;
  };
}

// Archivo subido por el usuario
export interface ArchivoSubido {
  id: string;
  tipo: string; // ID del TipoDocumento
  nombre: string; // Nombre del archivo
  archivo: File; // El archivo en sí
  preview?: string; // URL de preview (para imágenes)
  procesado: boolean; // Ya pasó por OCR
  datosExtraidos?: Record<string, string>; // Datos extraídos por OCR
}

// Datos extraídos de los documentos
export interface DatosExtraidos {
  [seccion: string]: {
    [campo: string]: {
      valor: string | null;
      confianza: number; // 0-1, qué tan segura está la IA
      fuente?: string; // De qué documento se extrajo
      requiereRevision: boolean;
    };
  };
}

// Un caso completo
export interface Caso {
  id: string;
  tipoCasoId: string;
  tipoCaso: TipoCaso;
  userId: string;
  status: CasoStatus;

  // Documentos subidos
  documentosSubidos: ArchivoSubido[];

  // Datos extraídos por OCR/IA
  datosExtraidos: DatosExtraidos;

  // Documentos generados
  documentosGenerados: DocumentoGenerado[];

  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Documento generado
export interface DocumentoGenerado {
  id: string;
  casoId: string;
  plantillaId: string;
  tipo: string;
  contenido: string; // HTML o Markdown del documento
  contenidoPDF?: string; // URL del PDF generado
  status: DocumentoStatus;
  version: number;

  // Historial de cambios (para el chat de modificaciones)
  historialCambios: CambioDocumento[];

  createdAt: Date;
  updatedAt: Date;
}

// Cambio realizado a un documento (vía chat)
export interface CambioDocumento {
  id: string;
  timestamp: Date;
  tipoAccion: 'creacion' | 'modificacion_ia' | 'modificacion_manual';
  descripcion: string;
  promptUsuario?: string; // Si fue vía chat
  cambiosAplicados: string;
}

// Plantilla de documento
export interface Plantilla {
  id: string;
  nombre: string;
  tipo: string; // compraventa, poder, testamento, etc.
  contenido: string; // Template con variables {{variable}}
  campos: CampoFormulario[];
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Respuesta del procesamiento de IA
export interface RespuestaIA {
  exito: boolean;
  modelo: 'claude' | 'gpt4' | 'gemini';
  datosExtraidos?: DatosExtraidos;
  documentoGenerado?: string;
  camposFaltantes?: string[];
  sugerencias?: string[];
  tiempoProcesamiento: number; // ms
  error?: string;
}

// Para el chat de modificaciones
export interface MensajeChat {
  id: string;
  rol: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
  documentoModificado?: boolean;
  cambiosRealizados?: string;
}
