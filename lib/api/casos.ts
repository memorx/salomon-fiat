// lib/api/casos.ts
// Cliente API para interactuar con las rutas de casos

export interface CrearCasoParams {
  tipoCaso: string;
  aiModel?: 'claude' | 'gpt4' | 'gemini';
}

export interface SubirDocumentosParams {
  casoId: string;
  archivos: File[];
  tipos: string[];
}

export interface ProcesarCasoParams {
  casoId: string;
  modelo?: 'claude' | 'gpt4' | 'gemini';
}

export interface GenerarDocumentoParams {
  casoId: string;
  plantillaId?: string;
  datosAdicionales?: Record<string, any>;
}

export interface ActualizarCasoParams {
  casoId: string;
  datos: {
    status?: string;
    extractedData?: Record<string, any>;
    documentType?: string;
  };
}

// Tipo para errores de API
export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Error en la solicitud',
      response.status,
      data
    );
  }

  return data as T;
}

// ============================================
// CASOS
// ============================================

// Listar todos los casos
export async function listarCasos() {
  const response = await fetch('/api/casos');
  return handleResponse<{ casos: any[] }>(response);
}

// Obtener un caso específico
export async function obtenerCaso(casoId: string) {
  const response = await fetch(`/api/casos/${casoId}`);
  return handleResponse<{ caso: any }>(response);
}

// Crear un nuevo caso
export async function crearCaso(params: CrearCasoParams) {
  const response = await fetch('/api/casos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return handleResponse<{ caso: any }>(response);
}

// Actualizar un caso
export async function actualizarCaso(params: ActualizarCasoParams) {
  const response = await fetch(`/api/casos/${params.casoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.datos)
  });
  return handleResponse<{ caso: any }>(response);
}

// Eliminar un caso
export async function eliminarCaso(casoId: string) {
  const response = await fetch(`/api/casos/${casoId}`, {
    method: 'DELETE'
  });
  return handleResponse<{ message: string }>(response);
}

// ============================================
// DOCUMENTOS
// ============================================

// Listar documentos de un caso
export async function listarDocumentos(casoId: string) {
  const response = await fetch(`/api/casos/${casoId}/documentos`);
  return handleResponse<{ documentos: any[] }>(response);
}

// Subir documentos a un caso
export async function subirDocumentos(params: SubirDocumentosParams) {
  const formData = new FormData();

  // Agregar cada archivo
  params.archivos.forEach((archivo) => {
    formData.append('archivos', archivo);
  });

  // Agregar tipos como JSON
  formData.append('tipos', JSON.stringify(params.tipos));

  const response = await fetch(`/api/casos/${params.casoId}/documentos`, {
    method: 'POST',
    body: formData
  });

  return handleResponse<{ documentos: any[]; caso: any }>(response);
}

// ============================================
// PROCESAMIENTO IA
// ============================================

// Procesar documentos con OCR e IA
export async function procesarCaso(params: ProcesarCasoParams) {
  const response = await fetch(`/api/casos/${params.casoId}/procesar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelo: params.modelo || 'claude' })
  });

  return handleResponse<{
    caso: any;
    datosExtraidos: Record<string, any>;
    camposFaltantes: string[];
    sugerencias: string[];
    tiempoProcesamiento: number;
  }>(response);
}

// Generar documento legal
export async function generarDocumento(params: GenerarDocumentoParams) {
  const response = await fetch(`/api/casos/${params.casoId}/generar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plantillaId: params.plantillaId,
      datosAdicionales: params.datosAdicionales
    })
  });

  return handleResponse<{
    documento: any;
    tiempoProcesamiento: number;
  }>(response);
}
