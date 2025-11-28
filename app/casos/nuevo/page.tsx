// app/casos/nuevo/page.tsx
'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCaso } from '@/hooks/useCaso';
import { TIPOS_CASO, TIPOS_DOCUMENTO } from '@/lib/config/tipos-caso';

export default function NuevoCasoPage() {
  const router = useRouter();
  const caso = useCaso();

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      caso.agregarArchivos(e.dataTransfer.files);
    },
    [caso]
  );

  // Manejar generación y redirección
  const handleGenerarDocumento = async () => {
    const exito = await caso.generarDocumentoLegal();
    if (exito && caso.casoId) {
      router.push(`/casos/${caso.casoId}`);
    }
  };

  // Obtener info del tipo de caso seleccionado
  const tipoCasoInfo = TIPOS_CASO.find((t) => t.id === caso.tipoCaso);

  // Renderizar indicador de progreso
  const renderProgreso = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[
          { id: 'tipo', label: 'Tipo de Caso', numero: 1 },
          { id: 'documentos', label: 'Documentos', numero: 2 },
          { id: 'revision', label: 'Revisión', numero: 3 }
        ].map((paso, index) => {
          const esActual = caso.pasoActual === paso.id;
          const esCompletado =
            (paso.id === 'tipo' &&
              (caso.pasoActual === 'documentos' ||
                caso.pasoActual === 'revision')) ||
            (paso.id === 'documentos' && caso.pasoActual === 'revision');

          return (
            <div key={paso.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    esActual
                      ? 'bg-blue-600 text-white'
                      : esCompletado
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {esCompletado ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    paso.numero
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white hidden sm:block">
                  {paso.label}
                </span>
              </div>
              {index < 2 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full bg-green-600 transition-all ${
                      esCompletado ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Renderizar mensaje de error
  const renderError = () =>
    caso.error && (
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-800 dark:text-red-300 flex-1">{caso.error}</p>
        <button
          onClick={caso.limpiarError}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Crear Nuevo Caso
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Selecciona el tipo de trámite y sube los documentos necesarios
        </p>
      </div>

      {/* Progress Steps */}
      {renderProgreso()}

      {/* Error Message */}
      {renderError()}

      {/* ============================================ */}
      {/* PASO 1: Selección de Tipo de Caso */}
      {/* ============================================ */}
      {caso.pasoActual === 'tipo' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ¿Qué tipo de trámite necesitas?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TIPOS_CASO.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => caso.seleccionarTipoCaso(tipo.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    caso.tipoCaso === tipo.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        caso.tipoCaso === tipo.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {caso.tipoCaso === tipo.id && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {tipo.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {tipo.descripcion}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de modelo IA */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Modelo de IA
            </h2>
            <div className="flex gap-4">
              {[
                { id: 'claude', nombre: 'Claude', color: 'purple' },
                { id: 'gpt4', nombre: 'GPT-4', color: 'green' },
                { id: 'gemini', nombre: 'Gemini', color: 'blue' }
              ].map((modelo) => (
                <button
                  key={modelo.id}
                  onClick={() =>
                    caso.seleccionarModeloIA(
                      modelo.id as 'claude' | 'gpt4' | 'gemini'
                    )
                  }
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    caso.modeloIA === modelo.id
                      ? `border-${modelo.color}-600 bg-${modelo.color}-50 dark:bg-${modelo.color}-900/20 text-${modelo.color}-700 dark:text-${modelo.color}-300`
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  {modelo.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Botón continuar */}
          <div className="flex justify-end">
            <button
              onClick={caso.irADocumentos}
              disabled={!caso.tipoCaso || caso.cargando}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {caso.cargando ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creando caso...
                </>
              ) : (
                <>
                  Continuar
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* PASO 2: Carga de Documentos */}
      {/* ============================================ */}
      {caso.pasoActual === 'documentos' && (
        <div className="space-y-6">
          {/* Info del tipo seleccionado */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                  {tipoCasoInfo?.nombre}
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Caso ID: {caso.casoId?.slice(0, 8)}...
                </p>
              </div>
              <button
                onClick={() => caso.irAlPaso('tipo')}
                className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Zona de carga */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sube los documentos del cliente
            </h2>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) =>
                  e.target.files && caso.agregarArchivos(e.target.files)
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Arrastra documentos aquí
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    o haz clic para seleccionar
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  JPG, PNG, WebP o PDF (máx. 10MB por archivo)
                </p>
              </div>
            </div>

            {/* Lista de documentos sugeridos */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Documentos sugeridos para este trámite:
              </h3>
              <div className="flex flex-wrap gap-2">
                {TIPOS_DOCUMENTO.filter((t) => t.requerido).map((tipo) => (
                  <span
                    key={tipo.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm rounded-full"
                  >
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {tipo.nombre}
                  </span>
                ))}
                {TIPOS_DOCUMENTO.filter((t) => !t.requerido)
                  .slice(0, 4)
                  .map((tipo) => (
                    <span
                      key={tipo.id}
                      className="inline-flex px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                    >
                      {tipo.nombre}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Archivos subidos */}
          {caso.archivosLocales.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentos cargados ({caso.archivosLocales.length})
              </h2>
              <div className="space-y-3">
                {caso.archivosLocales.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    {/* Preview */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {archivo.preview ? (
                        <img
                          src={archivo.preview}
                          alt={archivo.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {archivo.nombre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(archivo.archivo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Tipo de documento */}
                    <select
                      value={archivo.tipo}
                      onChange={(e) =>
                        caso.cambiarTipoArchivo(archivo.id, e.target.value)
                      }
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {TIPOS_DOCUMENTO.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>

                    {/* Eliminar */}
                    <button
                      onClick={() => caso.eliminarArchivo(archivo.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between">
            <button
              onClick={() => caso.irAlPaso('tipo')}
              disabled={caso.subiendo || caso.procesando}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Anterior
            </button>
            <button
              onClick={caso.procesarDocumentos}
              disabled={
                caso.archivosLocales.length === 0 ||
                caso.subiendo ||
                caso.procesando
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {caso.subiendo ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Subiendo archivos...
                </>
              ) : caso.procesando ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando con {caso.modeloIA}...
                </>
              ) : (
                <>
                  Procesar con IA
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Consejos para mejores resultados
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Asegúrate de que los documentos estén bien escaneados y legibles
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                El INE debe mostrar ambas caras si es posible
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Clasifica correctamente cada documento para mejor extracción
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* PASO 3: Revisión de datos extraídos */}
      {/* ============================================ */}
      {caso.pasoActual === 'revision' && (
        <div className="space-y-6">
          {/* Éxito */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-300">
                  Documentos procesados exitosamente
                </h3>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Tiempo: {((caso.tiempoProcesamiento || 0) / 1000).toFixed(2)}s
                  con {caso.modeloIA}
                </p>
              </div>
            </div>
          </div>

          {/* Campos faltantes */}
          {caso.camposFaltantes.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                Campos que requieren atención:
              </h3>
              <ul className="list-disc list-inside text-sm text-orange-800 dark:text-orange-400">
                {caso.camposFaltantes.map((campo, i) => (
                  <li key={i}>{campo}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sugerencias */}
          {caso.sugerencias.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Sugerencias:
              </h3>
              <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-400">
                {caso.sugerencias.map((sugerencia, i) => (
                  <li key={i}>{sugerencia}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Datos extraídos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Información Extraída
            </h2>

            {caso.datosExtraidos ? (
              <div className="space-y-8">
                {Object.entries(caso.datosExtraidos).map(
                  ([seccion, campos]) => (
                    <div key={seccion}>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 capitalize">
                        {seccion.replace(/_/g, ' ')}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(campos as Record<string, any>).map(
                          ([campo, dato]) => {
                            const confianza = dato?.confianza || 0;
                            const requiereRevision =
                              dato?.requiereRevision || false;

                            let borderColor =
                              'border-gray-300 dark:border-gray-600';
                            let bgColor = 'bg-white dark:bg-gray-800';

                            if (requiereRevision) {
                              borderColor =
                                'border-orange-300 dark:border-orange-600';
                              bgColor = 'bg-orange-50 dark:bg-orange-900/20';
                            } else if (confianza >= 0.8) {
                              borderColor =
                                'border-green-300 dark:border-green-600';
                              bgColor = 'bg-green-50 dark:bg-green-900/20';
                            } else if (confianza >= 0.5) {
                              borderColor =
                                'border-yellow-300 dark:border-yellow-600';
                              bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
                            }

                            return (
                              <div key={campo}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                                  {campo.replace(/_/g, ' ')}
                                </label>
                                <input
                                  type="text"
                                  value={dato?.valor || ''}
                                  onChange={(e) =>
                                    caso.actualizarDatoExtraido(
                                      seccion,
                                      campo,
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-white ${borderColor} ${bgColor}`}
                                />
                                {dato && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Confianza: {Math.round(confianza * 100)}%
                                    {dato.fuente && ` • Fuente: ${dato.fuente}`}
                                  </p>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No hay datos extraídos aún.
              </p>
            )}
          </div>

          {/* Documentos de referencia */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Documentos de Referencia
            </h3>
            <div className="flex flex-wrap gap-3">
              {caso.archivosLocales.map((archivo) => (
                <div
                  key={archivo.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {TIPOS_DOCUMENTO.find((t) => t.id === archivo.tipo)
                      ?.nombre || archivo.tipo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between">
            <button
              onClick={() => caso.irAlPaso('documentos')}
              disabled={caso.generando}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Anterior
            </button>
            <button
              onClick={handleGenerarDocumento}
              disabled={caso.generando}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {caso.generando ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generando documento...
                </>
              ) : (
                <>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Generar Documento
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
