// hooks/useCaso.ts
'use client';

import { useState, useCallback } from 'react';
import {
  crearCaso,
  subirDocumentos,
  procesarCaso,
  generarDocumento,
  actualizarCaso,
  ApiError
} from '@/lib/api/casos';

// Tipos
export type Paso = 'tipo' | 'documentos' | 'revision';
export type ModeloIA = 'claude' | 'gpt4' | 'gemini';

export interface ArchivoLocal {
  id: string;
  tipo: string;
  nombre: string;
  archivo: File;
  preview?: string;
}

export interface EstadoCaso {
  // Navegación
  pasoActual: Paso;

  // Datos del caso
  casoId: string | null;
  tipoCaso: string | null;
  modeloIA: ModeloIA;

  // Archivos locales (antes de subir)
  archivosLocales: ArchivoLocal[];

  // Datos del servidor
  caso: any | null;
  documentosSubidos: any[];
  datosExtraidos: Record<string, any> | null;
  camposFaltantes: string[];
  sugerencias: string[];
  documentoGenerado: any | null;

  // Estados de carga
  cargando: boolean;
  subiendo: boolean;
  procesando: boolean;
  generando: boolean;

  // Errores
  error: string | null;

  // Métricas
  tiempoProcesamiento: number | null;
}

const estadoInicial: EstadoCaso = {
  pasoActual: 'tipo',
  casoId: null,
  tipoCaso: null,
  modeloIA: 'claude',
  archivosLocales: [],
  caso: null,
  documentosSubidos: [],
  datosExtraidos: null,
  camposFaltantes: [],
  sugerencias: [],
  documentoGenerado: null,
  cargando: false,
  subiendo: false,
  procesando: false,
  generando: false,
  error: null,
  tiempoProcesamiento: null
};

export function useCaso() {
  const [estado, setEstado] = useState<EstadoCaso>(estadoInicial);

  // Helper para actualizar estado parcialmente
  const actualizar = useCallback((cambios: Partial<EstadoCaso>) => {
    setEstado((prev) => ({ ...prev, ...cambios }));
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    actualizar({ error: null });
  }, [actualizar]);

  // ============================================
  // PASO 1: Selección de tipo de caso
  // ============================================

  const seleccionarTipoCaso = useCallback(
    (tipoCaso: string) => {
      actualizar({ tipoCaso, error: null });
    },
    [actualizar]
  );

  const seleccionarModeloIA = useCallback(
    (modelo: ModeloIA) => {
      actualizar({ modeloIA: modelo });
    },
    [actualizar]
  );

  // Ir al paso de documentos (crea el caso en BD)
  const irADocumentos = useCallback(async () => {
    if (!estado.tipoCaso) {
      actualizar({ error: 'Selecciona un tipo de caso primero' });
      return false;
    }

    actualizar({ cargando: true, error: null });

    try {
      const { caso } = await crearCaso({
        tipoCaso: estado.tipoCaso,
        aiModel: estado.modeloIA
      });

      actualizar({
        casoId: caso.id,
        caso,
        pasoActual: 'documentos',
        cargando: false
      });

      return true;
    } catch (err) {
      const mensaje =
        err instanceof ApiError ? err.message : 'Error al crear el caso';
      actualizar({ error: mensaje, cargando: false });
      return false;
    }
  }, [estado.tipoCaso, estado.modeloIA, actualizar]);

  // ============================================
  // PASO 2: Carga de documentos
  // ============================================

  // Agregar archivos localmente
  const agregarArchivos = useCallback(
    (files: FileList | File[]) => {
      const nuevosArchivos: ArchivoLocal[] = [];
      const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
      ];
      const maxTamano = 10 * 1024 * 1024; // 10MB

      Array.from(files).forEach((file) => {
        // Validaciones
        if (!tiposPermitidos.includes(file.type)) {
          actualizar({ error: `Tipo no permitido: ${file.name}` });
          return;
        }

        if (file.size > maxTamano) {
          actualizar({ error: `Archivo muy grande (máx 10MB): ${file.name}` });
          return;
        }

        const nuevoArchivo: ArchivoLocal = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tipo: 'otro',
          nombre: file.name,
          archivo: file,
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined
        };

        nuevosArchivos.push(nuevoArchivo);
      });

      if (nuevosArchivos.length > 0) {
        actualizar({
          archivosLocales: [...estado.archivosLocales, ...nuevosArchivos],
          error: null
        });
      }
    },
    [estado.archivosLocales, actualizar]
  );

  // Cambiar tipo de un archivo
  const cambiarTipoArchivo = useCallback(
    (archivoId: string, nuevoTipo: string) => {
      actualizar({
        archivosLocales: estado.archivosLocales.map((a) =>
          a.id === archivoId ? { ...a, tipo: nuevoTipo } : a
        )
      });
    },
    [estado.archivosLocales, actualizar]
  );

  // Eliminar archivo local
  const eliminarArchivo = useCallback(
    (archivoId: string) => {
      const archivo = estado.archivosLocales.find((a) => a.id === archivoId);
      if (archivo?.preview) {
        URL.revokeObjectURL(archivo.preview);
      }

      actualizar({
        archivosLocales: estado.archivosLocales.filter(
          (a) => a.id !== archivoId
        )
      });
    },
    [estado.archivosLocales, actualizar]
  );

  // Subir documentos y procesar con IA
  const procesarDocumentos = useCallback(async () => {
    if (!estado.casoId) {
      actualizar({ error: 'No hay caso creado' });
      return false;
    }

    if (estado.archivosLocales.length === 0) {
      actualizar({ error: 'Agrega al menos un documento' });
      return false;
    }

    actualizar({ subiendo: true, error: null });

    try {
      // 1. Subir documentos a Supabase
      const { documentos, caso } = await subirDocumentos({
        casoId: estado.casoId,
        archivos: estado.archivosLocales.map((a) => a.archivo),
        tipos: estado.archivosLocales.map((a) => a.tipo)
      });

      actualizar({
        documentosSubidos: documentos,
        caso,
        subiendo: false,
        procesando: true
      });

      // 2. Procesar con IA
      const resultado = await procesarCaso({
        casoId: estado.casoId,
        modelo: estado.modeloIA
      });

      actualizar({
        caso: resultado.caso,
        datosExtraidos: resultado.datosExtraidos,
        camposFaltantes: resultado.camposFaltantes,
        sugerencias: resultado.sugerencias,
        tiempoProcesamiento: resultado.tiempoProcesamiento,
        procesando: false,
        pasoActual: 'revision'
      });

      return true;
    } catch (err) {
      const mensaje =
        err instanceof ApiError ? err.message : 'Error al procesar documentos';
      actualizar({
        error: mensaje,
        subiendo: false,
        procesando: false
      });
      return false;
    }
  }, [estado.casoId, estado.archivosLocales, estado.modeloIA, actualizar]);

  // ============================================
  // PASO 3: Revisión y generación
  // ============================================

  // Actualizar datos extraídos manualmente
  const actualizarDatoExtraido = useCallback(
    (seccion: string, campo: string, valor: string) => {
      if (!estado.datosExtraidos) return;

      const nuevosDatos = {
        ...estado.datosExtraidos,
        [seccion]: {
          ...estado.datosExtraidos[seccion],
          [campo]: {
            ...estado.datosExtraidos[seccion]?.[campo],
            valor,
            requiereRevision: false
          }
        }
      };

      actualizar({ datosExtraidos: nuevosDatos });
    },
    [estado.datosExtraidos, actualizar]
  );

  // Generar documento con IA
  const generarDocumentoLegal = useCallback(
    async (plantillaId?: string) => {
      if (!estado.casoId) {
        actualizar({ error: 'No hay caso creado' });
        return false;
      }

      actualizar({ generando: true, error: null });

      try {
        // Preparar datos adicionales (los editados manualmente)
        const datosAdicionales = estado.datosExtraidos || {};

        const resultado = await generarDocumento({
          casoId: estado.casoId,
          plantillaId,
          datosAdicionales
        });

        actualizar({
          documentoGenerado: resultado.documento,
          tiempoProcesamiento: resultado.tiempoProcesamiento,
          generando: false
        });

        return true;
      } catch (err) {
        const mensaje =
          err instanceof ApiError
            ? err.message
            : 'Error al generar el documento';
        actualizar({ error: mensaje, generando: false });
        return false;
      }
    },
    [estado.casoId, estado.datosExtraidos, actualizar]
  );

  // ============================================
  // NAVEGACIÓN
  // ============================================

  const irAlPaso = useCallback(
    (paso: Paso) => {
      actualizar({ pasoActual: paso, error: null });
    },
    [actualizar]
  );

  const reiniciar = useCallback(() => {
    // Limpiar previews
    estado.archivosLocales.forEach((a) => {
      if (a.preview) URL.revokeObjectURL(a.preview);
    });

    setEstado(estadoInicial);
  }, [estado.archivosLocales]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Estado
    ...estado,

    // Acciones Paso 1
    seleccionarTipoCaso,
    seleccionarModeloIA,
    irADocumentos,

    // Acciones Paso 2
    agregarArchivos,
    cambiarTipoArchivo,
    eliminarArchivo,
    procesarDocumentos,

    // Acciones Paso 3
    actualizarDatoExtraido,
    generarDocumentoLegal,

    // Navegación
    irAlPaso,
    reiniciar,
    limpiarError
  };
}
