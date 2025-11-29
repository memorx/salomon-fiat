// app/dashboard/page.tsx
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import type { Caso, Documento } from '@/types/prisma';

// Tipo para caso con documentos incluidos
type CasoConDocumentos = Caso & {
  documentos: Pick<Documento, 'id' | 'tipo' | 'status'>[];
};

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

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Obtener estadísticas reales
  const [
    totalCasos,
    casosActivos,
    casosCompletados,
    casosEnRevision,
    casosRecientes,
    totalPlantillas
  ] = await Promise.all([
    prisma.caso.count({ where: { userId } }),
    prisma.caso.count({
      where: {
        userId,
        status: { notIn: ['COMPLETADO', 'ERROR'] }
      }
    }),
    prisma.caso.count({ where: { userId, status: 'COMPLETADO' } }),
    prisma.caso.count({
      where: {
        userId,
        status: { in: ['EN_REVISION', 'REQUIERE_INFO'] }
      }
    }),
    prisma.caso.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        documentos: {
          select: { id: true }
        }
      }
    }),
    prisma.plantilla.count({ where: { activa: true } })
  ]);

  const stats = [
    {
      label: 'Casos Activos',
      value: casosActivos.toString(),
      change: `${totalCasos} total`,
      color: 'blue'
    },
    {
      label: 'En Revisión',
      value: casosEnRevision.toString(),
      change: 'pendientes',
      color: 'yellow'
    },
    {
      label: 'Completados',
      value: casosCompletados.toString(),
      change: 'finalizados',
      color: 'green'
    },
    {
      label: 'Plantillas',
      value: totalPlantillas.toString(),
      change: 'activas',
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido, {session.user.name} 👋
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </h3>
              <div
                className={`w-2 h-2 rounded-full ${
                  stat.color === 'blue'
                    ? 'bg-blue-500'
                    : stat.color === 'yellow'
                    ? 'bg-yellow-500'
                    : stat.color === 'green'
                    ? 'bg-green-500'
                    : 'bg-purple-500'
                }`}
              ></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Acciones Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/casos/nuevo"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Nuevo Caso
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Crear trámite
              </p>
            </div>
          </Link>

          <Link
            href="/casos"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
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
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Ver Casos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lista completa
              </p>
            </div>
          </Link>

          <Link
            href="/plantillas"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Plantillas
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestionar
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Casos Recientes
          </h2>
          <Link
            href="/casos"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {casosRecientes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay casos aún
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Crea tu primer caso para comenzar
              </p>
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
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {casosRecientes.map((caso: CasoConDocumentos) => (
                    <tr
                      key={caso.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getTipoNombre(caso.documentType)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {caso.documentos.length} doc
                        {caso.documentos.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(caso.createdAt).toLocaleDateString('es-MX')}
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
    </div>
  );
}
