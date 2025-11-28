// app/casos/[id]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    TRANSCRIBIENDO:
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    CLASIFICANDO:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    EXTRAYENDO_INFO:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    REQUIERE_INFO:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    GENERANDO_DOCUMENTO:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    EN_REVISION:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    COMPLETADO:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    BORRADOR: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    APROBADO:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };
  return colors[status] || colors.TRANSCRIBIENDO;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    TRANSCRIBIENDO: 'Transcribiendo',
    CLASIFICANDO: 'Clasificando',
    EXTRAYENDO_INFO: 'Extrayendo Info',
    REQUIERE_INFO: 'Requiere Info',
    GENERANDO_DOCUMENTO: 'Generando Documento',
    EN_REVISION: 'En Revisión',
    COMPLETADO: 'Completado',
    ERROR: 'Error',
    BORRADOR: 'Borrador',
    APROBADO: 'Aprobado'
  };
  return labels[status] || status;
};

const getTipoCasoNombre = (tipo: string) => {
  const nombres: Record<string, string> = {
    compraventa_inmueble: 'Compraventa de Inmueble',
    poder_notarial: 'Poder Notarial',
    testamento: 'Testamento Público Abierto',
    constitucion_sociedad: 'Constitución de Sociedad',
    acta_asamblea: 'Acta de Asamblea',
    contrato_arrendamiento: 'Contrato de Arrendamiento'
  };
  return nombres[tipo] || tipo;
};

export default async function CasoDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Obtener caso de la base de datos
  const caso = await prisma.caso.findUnique({
    where: { id },
    include: {
      documentos: {
        orderBy: { createdAt: 'desc' }
      },
      user: {
        select: { name: true, email: true }
      }
    }
  });

  if (!caso) {
    notFound();
  }

  const extractedData = (caso.extractedData as Record<string, any>) || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/casos"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
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
        Volver a Casos
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getTipoCasoNombre(caso.documentType || '')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Caso ID: {caso.id.slice(0, 8)}...
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
            caso.status
          )}`}
        >
          {getStatusLabel(caso.status)}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Fecha de Creación
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(caso.createdAt).toLocaleString('es-MX', {
              dateStyle: 'long',
              timeStyle: 'short'
            })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Documentos
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {caso.documentos.length} generado
            {caso.documentos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Modelo IA
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 capitalize">
            {caso.aiModel || 'No especificado'}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Extracted Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Datos Extraídos
            </h2>
          </div>
          <div className="p-6">
            {Object.keys(extractedData).length > 0 ? (
              <dl className="space-y-4">
                {Object.entries(extractedData).map(([seccion, campos]) => (
                  <div key={seccion}>
                    <dt className="text-sm font-semibold text-gray-900 dark:text-white mb-2 capitalize border-b border-gray-200 dark:border-gray-700 pb-1">
                      {seccion.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-sm text-gray-600 dark:text-gray-400">
                      {typeof campos === 'object' && campos !== null ? (
                        <ul className="ml-4 space-y-1">
                          {Object.entries(campos).map(
                            ([campo, valor]: [string, any]) => (
                              <li key={campo}>
                                <span className="font-medium capitalize">
                                  {campo.replace(/_/g, ' ')}:
                                </span>{' '}
                                {valor?.valor || String(valor) || 'N/A'}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        String(campos)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No hay datos extraídos.
              </p>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Documentos Generados
            </h2>
          </div>
          <div className="p-6">
            {caso.documentos.length > 0 ? (
              <div className="space-y-4">
                {caso.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {doc.tipo.replace(/_/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            {getStatusLabel(doc.status)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            v{doc.version}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(doc.createdAt).toLocaleDateString(
                              'es-MX'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.contenido && (
                        <a
                          href={doc.contenido}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          title="Ver documento"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No hay documentos generados.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/casos"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Volver a Lista
        </Link>
        <Link
          href="/casos/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crear Nuevo Caso
        </Link>
      </div>
    </div>
  );
}
