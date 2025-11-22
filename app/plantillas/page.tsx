import Link from 'next/link';

// Mock data para plantillas
const plantillas = [
  {
    id: '1',
    nombre: 'Poder Notarial General',
    tipo: 'PODER_NOTARIAL',
    activa: true,
    campos: ['poderdante', 'apoderado', 'facultades'],
    documentosGenerados: 23,
    ultimaActualizacion: '2024-11-15',
  },
  {
    id: '2',
    nombre: 'Contrato de Compraventa Inmueble',
    tipo: 'COMPRAVENTA_INMUEBLE',
    activa: true,
    campos: ['vendedor', 'comprador', 'inmueble', 'precio'],
    documentosGenerados: 18,
    ultimaActualizacion: '2024-11-10',
  },
  {
    id: '3',
    nombre: 'Testamento Público Abierto',
    tipo: 'TESTAMENTO',
    activa: true,
    campos: ['testador', 'beneficiarios', 'bienes'],
    documentosGenerados: 12,
    ultimaActualizacion: '2024-11-08',
  },
  {
    id: '4',
    nombre: 'Escritura de Constitución',
    tipo: 'CONSTITUCION_SOCIEDAD',
    activa: true,
    campos: ['socios', 'capital', 'objeto_social'],
    documentosGenerados: 7,
    ultimaActualizacion: '2024-11-05',
  },
  {
    id: '5',
    nombre: 'Contrato de Arrendamiento',
    tipo: 'ARRENDAMIENTO',
    activa: false,
    campos: ['arrendador', 'arrendatario', 'inmueble', 'renta'],
    documentosGenerados: 15,
    ultimaActualizacion: '2024-10-20',
  },
  {
    id: '6',
    nombre: 'Acta de Asamblea',
    tipo: 'ACTA_ASAMBLEA',
    activa: true,
    campos: ['sociedad', 'asistentes', 'acuerdos'],
    documentosGenerados: 9,
    ultimaActualizacion: '2024-11-01',
  },
];

export default function PlantillasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Plantillas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las plantillas de documentos legales
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Plantilla
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Plantillas
            </h3>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {plantillas.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Activas
            </h3>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {plantillas.filter(p => p.activa).length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Documentos Generados
            </h3>
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {plantillas.reduce((sum, p) => sum + p.documentosGenerados, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar plantillas..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Todos los estados</option>
          <option value="activa">Activas</option>
          <option value="inactiva">Inactivas</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Ordenar por</option>
          <option value="nombre">Nombre</option>
          <option value="uso">Más usadas</option>
          <option value="fecha">Última actualización</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plantillas.map((plantilla) => (
          <div
            key={plantilla.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                plantilla.activa 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {plantilla.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {plantilla.nombre}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {plantilla.tipo.replace(/_/g, ' ').toLowerCase()}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {plantilla.documentosGenerados} docs
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {plantilla.campos.length} campos
              </div>
            </div>

            {/* Fields Preview */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Campos:</p>
              <div className="flex flex-wrap gap-1">
                {plantilla.campos.slice(0, 3).map((campo) => (
                  <span
                    key={campo}
                    className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {campo}
                  </span>
                ))}
                {plantilla.campos.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    +{plantilla.campos.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Last Update */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Actualizada: {new Date(plantilla.ultimaActualizacion).toLocaleDateString('es-MX')}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Ver
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Editar
              </button>
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (shown when no templates match filters) */}
      {plantillas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay plantillas
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crea tu primera plantilla para comenzar a generar documentos
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Primera Plantilla
          </button>
        </div>
      )}
    </div>
  );
}
