// components/casos/ZonaCargaArchivos.tsx
'use client';

import { useCallback, useState } from 'react';
import { TipoDocumento } from '@/types';

interface ArchivoSubido {
  id: string;
  tipo: string;
  nombre: string;
  archivo: File;
  preview?: string;
}

interface ZonaCargaArchivosProps {
  archivos: ArchivoSubido[];
  onArchivosChange: (archivos: ArchivoSubido[]) => void;
  tiposDocumento: TipoDocumento[];
  documentosSugeridos?: string[];
  maxArchivos?: number;
  maxTamano?: number; // en MB
}

export default function ZonaCargaArchivos({
  archivos,
  onArchivosChange,
  tiposDocumento,
  documentosSugeridos = [],
  maxArchivos = 20,
  maxTamano = 10
}: ZonaCargaArchivosProps) {
  const [arrastrando, setArrastrando] = useState(false);

  // Manejar archivos subidos
  const handleArchivos = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const nuevosArchivos: ArchivoSubido[] = [];
      const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
      ];

      Array.from(files).forEach((file) => {
        // Validar límite de archivos
        if (archivos.length + nuevosArchivos.length >= maxArchivos) {
          alert(`Máximo ${maxArchivos} archivos permitidos`);
          return;
        }

        // Validar tipo de archivo
        if (!tiposPermitidos.includes(file.type)) {
          alert(`Tipo de archivo no permitido: ${file.name}`);
          return;
        }

        // Validar tamaño
        if (file.size > maxTamano * 1024 * 1024) {
          alert(`Archivo muy grande (máx ${maxTamano}MB): ${file.name}`);
          return;
        }

        const nuevoArchivo: ArchivoSubido = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tipo: 'otro',
          nombre: file.name,
          archivo: file
        };

        // Crear preview para imágenes
        if (file.type.startsWith('image/')) {
          nuevoArchivo.preview = URL.createObjectURL(file);
        }

        nuevosArchivos.push(nuevoArchivo);
      });

      onArchivosChange([...archivos, ...nuevosArchivos]);
    },
    [archivos, onArchivosChange, maxArchivos, maxTamano]
  );

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
  const handleCambiarTipo = (archivoId: string, nuevoTipo: string) => {
    onArchivosChange(
      archivos.map((archivo) =>
        archivo.id === archivoId ? { ...archivo, tipo: nuevoTipo } : archivo
      )
    );
  };

  // Eliminar archivo
  const handleEliminar = (archivoId: string) => {
    const archivo = archivos.find((a) => a.id === archivoId);
    if (archivo?.preview) {
      URL.revokeObjectURL(archivo.preview);
    }
    onArchivosChange(archivos.filter((a) => a.id !== archivoId));
  };

  // Separar documentos sugeridos
  const docsSugeridosRequeridos = tiposDocumento.filter(
    (t) => documentosSugeridos.includes(t.id) && t.requerido
  );
  const docsSugeridosOpcionales = tiposDocumento.filter(
    (t) => documentosSugeridos.includes(t.id) && !t.requerido
  );

  return (
    <div className="space-y-6">
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
            JPG, PNG, WebP o PDF (máx. {maxTamano}MB por archivo)
          </p>
        </div>
      </div>

      {/* Lista de documentos sugeridos */}
      {documentosSugeridos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Documentos sugeridos para este trámite:
          </h3>
          <div className="flex flex-wrap gap-2">
            {docsSugeridosRequeridos.map((tipo) => (
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
            {docsSugeridosOpcionales.map((tipo) => (
              <span
                key={tipo.id}
                className="inline-flex px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full"
              >
                {tipo.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Archivos subidos */}
      {archivos.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Documentos cargados ({archivos.length})
          </h3>
          <div className="space-y-3">
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
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
                    handleCambiarTipo(archivo.id, e.target.value)
                  }
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {tiposDocumento.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>

                {/* Eliminar */}
                <button
                  onClick={() => handleEliminar(archivo.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Eliminar archivo"
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
    </div>
  );
}
