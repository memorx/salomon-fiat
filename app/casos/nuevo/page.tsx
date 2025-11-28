// app/casos/nuevo/page.tsx
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// Tipos de casos disponibles (esto vendrá de la BD después)
const TIPOS_CASO = [
  {
    id: 'compraventa_inmueble',
    nombre: 'Compraventa de Inmueble',
    descripcion: 'Escritura de compra-venta de bienes raíces'
  },
  {
    id: 'poder_notarial',
    nombre: 'Poder Notarial',
    descripcion: 'Poder general o especial para representación legal'
  },
  {
    id: 'testamento',
    nombre: 'Testamento',
    descripcion: 'Testamento público abierto'
  },
  {
    id: 'constitucion_sociedad',
    nombre: 'Constitución de Sociedad',
    descripcion: 'Escritura de constitución de empresa'
  },
  {
    id: 'acta_asamblea',
    nombre: 'Acta de Asamblea',
    descripcion: 'Acta de asamblea de accionistas'
  },
  {
    id: 'contrato_arrendamiento',
    nombre: 'Contrato de Arrendamiento',
    descripcion: 'Contrato de renta de inmueble'
  }
];

// Tipos de documentos que se pueden subir
const TIPOS_DOCUMENTO = [
  {
    id: 'ine',
    nombre: 'INE/IFE',
    descripcion: 'Identificación oficial',
    requerido: true
  },
  {
    id: 'curp',
    nombre: 'CURP',
    descripcion: 'Clave Única de Registro de Población',
    requerido: true
  },
  {
    id: 'comprobante_domicilio',
    nombre: 'Comprobante de Domicilio',
    descripcion: 'No mayor a 3 meses',
    requerido: false
  },
  {
    id: 'escritura_previa',
    nombre: 'Escritura Previa',
    descripcion: 'Escritura del inmueble (si aplica)',
    requerido: false
  },
  {
    id: 'predial',
    nombre: 'Predial',
    descripcion: 'Recibo de pago predial',
    requerido: false
  },
  {
    id: 'otro',
    nombre: 'Otro Documento',
    descripcion: 'Documento adicional',
    requerido: false
  }
];

interface ArchivoSubido {
  id: string;
  tipo: string;
  nombre: string;
  archivo: File;
  preview?: string;
}

type Paso = 'tipo' | 'documentos' | 'revision';

export default function NuevoCasoPage() {
  const [pasoActual, setPasoActual] = useState<Paso>('tipo');
  const [tipoCasoSeleccionado, setTipoCasoSeleccionado] = useState<
    string | null
  >(null);
  const [archivosSubidos, setArchivosSubidos] = useState<ArchivoSubido[]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [procesando, setProcesando] = useState(false);

  // Manejar selección de tipo de caso
  const handleSeleccionarTipo = (tipoId: string) => {
    setTipoCasoSeleccionado(tipoId);
  };

  // Manejar archivos subidos
  const handleArchivos = useCallback((files: FileList | null) => {
    if (!files) return;

    const nuevosArchivos: ArchivoSubido[] = [];

    Array.from(files).forEach((file) => {
      // Validar tipo de archivo
      const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
      ];
      if (!tiposPermitidos.includes(file.type)) {
        alert(`Tipo de archivo no permitido: ${file.name}`);
        return;
      }

      // Validar tamaño (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Archivo muy grande (máx 10MB): ${file.name}`);
        return;
      }

      const nuevoArchivo: ArchivoSubido = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tipo: 'otro', // Por defecto, el usuario puede cambiar
        nombre: file.name,
        archivo: file
      };

      // Crear preview para imágenes
      if (file.type.startsWith('image/')) {
        nuevoArchivo.preview = URL.createObjectURL(file);
      }

      nuevosArchivos.push(nuevoArchivo);
    });

    setArchivosSubidos((prev) => [...prev, ...nuevosArchivos]);
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setArrastrando(false);
      handleArchivos(e.dataTransfer.files);
    },
    [handleArchivos]
  );

  // Cambiar tipo de documento
  const handleCambiarTipoDocumento = (archivoId: string, nuevoTipo: string) => {
    setArchivosSubidos((prev) =>
      prev.map((archivo) =>
        archivo.id === archivoId ? { ...archivo, tipo: nuevoTipo } : archivo
      )
    );
  };

  // Eliminar archivo
  const handleEliminarArchivo = (archivoId: string) => {
    setArchivosSubidos((prev) => {
      const archivo = prev.find((a) => a.id === archivoId);
      if (archivo?.preview) {
        URL.revokeObjectURL(archivo.preview);
      }
      return prev.filter((a) => a.id !== archivoId);
    });
  };

  // Navegar entre pasos
  const irAlPaso = (paso: Paso) => {
    setPasoActual(paso);
  };

  // Procesar documentos con OCR
  const handleProcesarDocumentos = async () => {
    setProcesando(true);

    // TODO: Implementar llamada al API de OCR
    // Por ahora simulamos un delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcesando(false);
    irAlPaso('revision');
  };

  // Obtener info del tipo de caso seleccionado
  const tipoCasoInfo = TIPOS_CASO.find((t) => t.id === tipoCasoSeleccionado);

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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { id: 'tipo', label: 'Tipo de Caso', numero: 1 },
            { id: 'documentos', label: 'Documentos', numero: 2 },
            { id: 'revision', label: 'Revisión', numero: 3 }
          ].map((paso, index) => (
            <div key={paso.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    pasoActual === paso.id
                      ? 'bg-blue-600 text-white'
                      : (paso.id === 'tipo' &&
                          (pasoActual === 'documentos' ||
                            pasoActual === 'revision')) ||
                        (paso.id === 'documentos' && pasoActual === 'revision')
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {(paso.id === 'tipo' &&
                    (pasoActual === 'documentos' ||
                      pasoActual === 'revision')) ||
                  (paso.id === 'documentos' && pasoActual === 'revision') ? (
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
                      (paso.id === 'tipo' &&
                        (pasoActual === 'documentos' ||
                          pasoActual === 'revision')) ||
                      (paso.id === 'documentos' && pasoActual === 'revision')
                        ? 'w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paso 1: Selección de Tipo de Caso */}
      {pasoActual === 'tipo' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ¿Qué tipo de trámite necesitas?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TIPOS_CASO.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => handleSeleccionarTipo(tipo.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    tipoCasoSeleccionado === tipo.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        tipoCasoSeleccionado === tipo.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {tipoCasoSeleccionado === tipo.id && (
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

          {/* Botón continuar */}
          <div className="flex justify-end">
            <button
              onClick={() => irAlPaso('documentos')}
              disabled={!tipoCasoSeleccionado}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
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
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Carga de Documentos */}
      {pasoActual === 'documentos' && (
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
                  {tipoCasoInfo?.descripcion}
                </p>
              </div>
              <button
                onClick={() => irAlPaso('tipo')}
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
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                arrastrando
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => handleArchivos(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    arrastrando
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <svg
                    className={`w-8 h-8 ${
                      arrastrando
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400'
                    }`}
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
                    {arrastrando
                      ? 'Suelta los archivos aquí'
                      : 'Arrastra documentos aquí'}
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
                {TIPOS_DOCUMENTO.filter((t) => !t.requerido).map((tipo) => (
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
          {archivosSubidos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentos cargados ({archivosSubidos.length})
              </h2>
              <div className="space-y-3">
                {archivosSubidos.map((archivo) => (
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
                        handleCambiarTipoDocumento(archivo.id, e.target.value)
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
                      onClick={() => handleEliminarArchivo(archivo.id)}
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
              onClick={() => irAlPaso('tipo')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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
              onClick={handleProcesarDocumentos}
              disabled={archivosSubidos.length === 0 || procesando}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {procesando ? (
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
                  Procesando...
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
        </div>
      )}

      {/* Paso 3: Revisión de datos extraídos */}
      {pasoActual === 'revision' && (
        <div className="space-y-6">
          {/* Info del tipo seleccionado */}
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
                  Revisa la información extraída y completa los datos faltantes
                </p>
              </div>
            </div>
          </div>

          {/* Datos extraídos (mock por ahora) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Información Extraída
            </h2>

            {/* TODO: Aquí irá el formulario dinámico basado en el tipo de caso */}
            <div className="space-y-6">
              {/* Sección: Datos del vendedor/poderdante/etc */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Datos de la Parte 1
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      defaultValue="Juan Pérez García"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CURP
                    </label>
                    <input
                      type="text"
                      defaultValue="PEGJ850101HDFRRC09"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RFC
                    </label>
                    <input
                      type="text"
                      placeholder="Falta información"
                      className="w-full px-4 py-2 border border-orange-300 dark:border-orange-600 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-gray-900 dark:text-white placeholder-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Domicilio
                    </label>
                    <input
                      type="text"
                      defaultValue="Av. Juárez 123, Col. Centro, CDMX"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Datos del inmueble/objeto */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Datos del Inmueble
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ubicación del Inmueble
                    </label>
                    <input
                      type="text"
                      defaultValue="Calle Reforma 456, Col. Polanco, CDMX"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Folio Real
                    </label>
                    <input
                      type="text"
                      defaultValue="FR-123456789"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Superficie (m²)
                    </label>
                    <input
                      type="text"
                      defaultValue="250"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documentos cargados */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Documentos de Referencia
            </h3>
            <div className="flex flex-wrap gap-3">
              {archivosSubidos.map((archivo) => (
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
                    {TIPOS_DOCUMENTO.find((t) => t.id === archivo.tipo)?.nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between">
            <button
              onClick={() => irAlPaso('documentos')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
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
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      {pasoActual === 'documentos' && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
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
              <span>
                Asegúrate de que los documentos estén bien escaneados y legibles
              </span>
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
              <span>El INE debe mostrar ambas caras si es posible</span>
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
              <span>
                Clasifica correctamente cada documento para mejor extracción
              </span>
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
              <span>
                La IA extraerá datos automáticamente, pero siempre revisa la
                información
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
