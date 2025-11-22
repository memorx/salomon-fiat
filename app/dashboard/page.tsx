import Link from 'next/link';

// Mock data
const stats = [
  { label: 'Casos Activos', value: '12', change: '+3 esta semana', color: 'blue' },
  { label: 'En Revisión', value: '5', change: '2 pendientes', color: 'yellow' },
  { label: 'Completados', value: '47', change: '+8 este mes', color: 'green' },
  { label: 'Plantillas', value: '15', change: '3 activas', color: 'purple' },
];

const recentCases = [
  {
    id: '1',
    tipo: 'Poder Notarial',
    cliente: 'Juan Pérez García',
    status: 'EN_REVISION',
    fecha: '2024-11-20',
  },
  {
    id: '2',
    tipo: 'Contrato de Compraventa',
    cliente: 'María López Hernández',
    status: 'GENERANDO_DOCUMENTO',
    fecha: '2024-11-19',
  },
  {
    id: '3',
    tipo: 'Testamento',
    cliente: 'Carlos Rodríguez Sánchez',
    status: 'COMPLETADO',
    fecha: '2024-11-18',
  },
  {
    id: '4',
    tipo: 'Acta de Nacimiento',
    cliente: 'Ana Martínez Torres',
    status: 'EXTRAYENDO_INFO',
    fecha: '2024-11-17',
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    TRANSCRIBIENDO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    CLASIFICANDO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    EXTRAYENDO_INFO: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    REQUIERE_INFO: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    GENERANDO_DOCUMENTO: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    EN_REVISION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    COMPLETADO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
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
  };
  return labels[status] || status;
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Resumen de tu actividad notarial
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
              <div className={`w-2 h-2 rounded-full bg-${stat.color}-500`}></div>
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
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Nuevo Caso</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grabar audio</p>
            </div>
          </Link>

          <Link
            href="/casos"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ver Casos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lista completa</p>
            </div>
          </Link>

          <Link
            href="/plantillas"
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Plantillas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gestionar</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo de Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
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
                {recentCases.map((caso) => (
                  <tr key={caso.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {caso.tipo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {caso.cliente}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caso.status)}`}>
                        {getStatusLabel(caso.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(caso.fecha).toLocaleDateString('es-MX')}
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
        </div>
      </div>
    </div>
  );
}
