// app/casos/page.tsx
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

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
    ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
    ERROR: 'Error'
  };
  return labels[status] || status;
};

const getTipoNombre = (tipo: string | null) => {
  const nombres: Record<string, string> = {
    compraventa_inmueble: 'Compraventa de Inmueble',
    poder_notarial: 'Poder Notarial',
    testamento: 'Testamento',
    constitucion_sociedad: 'Constitución de Sociedad',
    acta_asamblea: 'Acta de Asamblea',
    contrato_arrendamiento: 'Contrato de Arrendamiento'
  };
  return nombres[tipo || ''] || tipo || 'Sin tipo';
};

export default async function CasosPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Obtener casos del usuario
  const casos = await prisma.caso.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      documentos: {
        select: { id: true, tipo: true, status: true }
      }
    }
  });

  // Calcular estadísticas
  const totalCasos = casos.length;
  const casosActivos = casos.filter(
    (c) => !['COMPLETADO', 'ERROR'].includes(c.status)
  ).length;
  const casosCompletados = casos.filter(
    (c) => c.status === 'COMPLETADO'
  ).length;
  const casosEnRevision = casos.filter((c) =>
    ['EN_REVISION', 'REQUIERE_INFO'].includes(c.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Casos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos tus casos notariales
          </p>
        </div>
        <Link
          href="/casos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Caso
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalCasos}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Activos
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {casosActivos}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Completados
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {casosCompletados}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            En Revisión
          </p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {casosEnRevision}
          </p>
        </div>
      </div>

      {/* Cases Table or Empty State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {casos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tienes casos todavía
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Comienza creando tu primer caso. Podrás subir documentos, extraer
              información con IA y generar documentos legales automáticamente.
            </p>
            <Link
              href="/casos/nuevo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Primer Caso
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo de Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Documentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modelo IA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {casos.map((caso) => (
                  <tr
                    key={caso.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getTipoNombre(caso.documentType)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          caso.status
                        )}`}
                      >
                        {getStatusLabel(caso.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <svg
                          className="w-4 h-4"
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
                        {caso.documentos.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {caso.aiModel || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(caso.createdAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/casos/${caso.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
