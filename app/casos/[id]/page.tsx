import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data para un caso específico
const getCasoById = (id: string) => {
  const casos: Record<string, any> = {
    '1': {
      id: '1',
      tipo: 'Poder Notarial',
      cliente: 'Juan Pérez García',
      status: 'EN_REVISION',
      fecha: '2024-11-20T10:30:00',
      audioKey: 'audio-123.mp3',
      transcription: 'Buenos días, mi nombre es Juan Pérez García. Necesito otorgar un poder notarial a mi hermana María Pérez García para que pueda representarme en la venta de mi propiedad ubicada en Avenida Juárez número 123, Colonia Centro, Ciudad de México. Mi hermana tiene la siguiente identificación: INE con número 1234567890. La propiedad tiene el folio real número FR-456789. Necesito que este poder sea amplio y suficiente para todos los actos relacionados con la venta.',
      extractedData: {
        poderdante: {
          nombre: 'Juan Pérez García',
          identificacion: 'No especificado',
        },
        apoderado: {
          nombre: 'María Pérez García',
          identificacion: 'INE 1234567890',
        },
        propiedad: {
          direccion: 'Avenida Juárez 123, Colonia Centro, Ciudad de México',
          folioReal: 'FR-456789',
        },
        tipoPoder: 'Amplio y suficiente para actos de venta',
      },
      documentos: [
        {
          id: 'd1',
          tipo: 'Poder Notarial',
          status: 'BORRADOR',
          version: 1,
          fecha: '2024-11-20T11:00:00',
        },
        {
          id: 'd2',
          tipo: 'Carta Poder',
          status: 'EN_REVISION',
          version: 2,
          fecha: '2024-11-20T11:30:00',
        },
      ],
    },
    '2': {
      id: '2',
      tipo: 'Contrato de Compraventa',
      cliente: 'María López Hernández',
      status: 'GENERANDO_DOCUMENTO',
      fecha: '2024-11-19T14:15:00',
      audioKey: 'audio-124.mp3',
      transcription: 'Buenas tardes, mi nombre es María López Hernández. Quiero realizar un contrato de compraventa de un vehículo...',
      extractedData: {
        vendedor: 'María López Hernández',
        comprador: 'Carlos Ruiz Gómez',
        bien: 'Vehículo Honda Civic 2020',
        precio: '$280,000 MXN',
      },
      documentos: [
        {
          id: 'd3',
          tipo: 'Contrato de Compraventa',
          status: 'BORRADOR',
          version: 1,
          fecha: '2024-11-19T15:00:00',
        },
      ],
    },
  };
  return casos[id] || null;
};

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
    BORRADOR: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    APROBADO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
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
    APROBADO: 'Aprobado',
  };
  return labels[status] || status;
};

export default async function CasoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caso = getCasoById(id);

  if (!caso) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/casos"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Casos
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {caso.tipo}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cliente: {caso.cliente}
          </p>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(caso.status)}`}>
          {getStatusLabel(caso.status)}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Fecha de Creación</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(caso.fecha).toLocaleString('es-MX', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Documentos</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {caso.documentos.length} generado{caso.documentos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Audio</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {caso.audioKey}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transcription */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transcripción
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {caso.transcription}
            </p>
          </div>
        </div>

        {/* Extracted Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Datos Extraídos
            </h2>
          </div>
          <div className="p-6">
            <dl className="space-y-4">
              {Object.entries(caso.extractedData).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-semibold text-gray-900 dark:text-white mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-400">
                    {typeof value === 'object' ? (
                      <ul className="ml-4 space-y-1">
                        {Object.entries(value).map(([subKey, subValue]) => (
                          <li key={subKey}>
                            <span className="font-medium capitalize">
                              {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>{' '}
                            {String(subValue)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      String(value)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Documentos Generados
          </h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generar Documento
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {caso.documentos.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {doc.tipo}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {getStatusLabel(doc.status)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        v{doc.version}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(doc.fecha).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-4">
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Editar
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Eliminar Caso
        </button>
      </div>
    </div>
  );
}
