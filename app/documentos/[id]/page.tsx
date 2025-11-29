// app/documentos/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DocumentoPreview from '@/components/documentos/DocumentoPreview';
import ChatModificacion from '@/components/documentos/ChatModificacion';

interface Documento {
  id: string;
  tipo: string;
  contenido: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  caso: {
    id: string;
    documentType: string;
    status: string;
  };
}

export default function DocumentoPage() {
  const params = useParams();
  const router = useRouter();
  const documentoId = params.id as string;

  const [documento, setDocumento] = useState<Documento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vistaActiva, setVistaActiva] = useState<'documento' | 'chat'>(
    'documento'
  );

  // Cargar documento
  useEffect(() => {
    const cargarDocumento = async () => {
      try {
        setCargando(true);
        const response = await fetch(`/api/documentos/${documentoId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar documento');
        }

        setDocumento(data.documento);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setCargando(false);
      }
    };

    if (documentoId) {
      cargarDocumento();
    }
  }, [documentoId]);

  // Handler para cuando el documento se actualiza via chat
  const handleDocumentoActualizado = (
    nuevoContenido: string,
    nuevaVersion: number
  ) => {
    if (documento) {
      setDocumento({
        ...documento,
        contenido: nuevoContenido,
        version: nuevaVersion,
        status: 'EN_REVISION'
      });
    }
  };

  // Cambiar status del documento
  const handleCambiarStatus = async (nuevoStatus: string) => {
    try {
      const response = await fetch(`/api/documentos/${documentoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nuevoStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar status');
      }

      setDocumento(data.documento);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  // Imprimir documento
  const handleImprimir = () => {
    window.print();
  };

  // Estado de carga
  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">
              Cargando documento...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            Error al cargar documento
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link
            href="/casos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Volver a Casos
          </Link>
        </div>
      </div>
    );
  }

  if (!documento) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/casos/${documento.caso.id}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al Caso
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {documento.tipo.replace(/_/g, ' ')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Versión {documento.version} • Creado{' '}
              {new Date(documento.createdAt).toLocaleDateString('es-MX')}
            </p>
          </div>

          {/* Acciones de status */}
          <div className="flex items-center gap-2">
            {documento.status === 'BORRADOR' && (
              <button
                onClick={() => handleCambiarStatus('EN_REVISION')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
              >
                Enviar a Revisión
              </button>
            )}
            {documento.status === 'EN_REVISION' && (
              <button
                onClick={() => handleCambiarStatus('APROBADO')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Aprobar Documento
              </button>
            )}
            {documento.status === 'APROBADO' && (
              <button
                onClick={() => handleCambiarStatus('IMPRESO')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Marcar como Impreso
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toggle móvil */}
      <div className="lg:hidden mb-4">
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setVistaActiva('documento')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              vistaActiva === 'documento'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Documento
          </button>
          <button
            onClick={() => setVistaActiva('chat')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              vistaActiva === 'chat'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Modificar con IA
          </button>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Preview del documento */}
        <div className={`${vistaActiva === 'chat' ? 'hidden lg:block' : ''}`}>
          <DocumentoPreview
            contenido={documento.contenido}
            version={documento.version}
            status={documento.status}
            onImprimir={handleImprimir}
          />
        </div>

        {/* Chat de modificaciones */}
        <div
          className={`${vistaActiva === 'documento' ? 'hidden lg:block' : ''}`}
        >
          <ChatModificacion
            documentoId={documento.id}
            onDocumentoActualizado={handleDocumentoActualizado}
            disabled={
              documento.status === 'APROBADO' || documento.status === 'IMPRESO'
            }
          />
        </div>
      </div>
    </div>
  );
}
