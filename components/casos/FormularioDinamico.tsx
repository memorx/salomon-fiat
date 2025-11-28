// components/casos/FormularioDinamico.tsx
'use client';

import { CampoFormulario, DatosExtraidos } from '@/types';
import {
  NOMBRES_SECCIONES,
  agruparCamposPorSeccion
} from '@/lib/config/tipos-caso';

interface FormularioDinamicoProps {
  campos: CampoFormulario[];
  datosExtraidos?: DatosExtraidos;
  valores: Record<string, string>;
  onChange: (campoId: string, valor: string) => void;
  modoLectura?: boolean;
}

export default function FormularioDinamico({
  campos,
  datosExtraidos,
  valores,
  onChange,
  modoLectura = false
}: FormularioDinamicoProps) {
  const camposPorSeccion = agruparCamposPorSeccion(campos);

  // Obtener el estado de un campo (si tiene datos extraídos)
  const getEstadoCampo = (campoId: string) => {
    if (!datosExtraidos) return null;

    for (const seccion of Object.values(datosExtraidos)) {
      if (seccion[campoId]) {
        return seccion[campoId];
      }
    }
    return null;
  };

  // Determinar el estilo del input basado en el estado
  const getInputClassName = (campoId: string) => {
    const estado = getEstadoCampo(campoId);
    const baseClass =
      'w-full px-4 py-2 rounded-lg text-gray-900 dark:text-white transition-colors';

    if (modoLectura) {
      return `${baseClass} bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 cursor-not-allowed`;
    }

    if (estado) {
      if (estado.requiereRevision) {
        return `${baseClass} bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent`;
      }
      if (estado.confianza >= 0.8) {
        return `${baseClass} bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent`;
      }
      if (estado.confianza >= 0.5) {
        return `${baseClass} bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`;
      }
    }

    return `${baseClass} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
  };

  const renderCampo = (campo: CampoFormulario) => {
    const valor = valores[campo.id] || '';
    const estado = getEstadoCampo(campo.id);

    return (
      <div key={campo.id} className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {campo.nombre}
          {campo.requerido && <span className="text-red-500 ml-1">*</span>}
        </label>

        {campo.tipo === 'textarea' ? (
          <textarea
            value={valor}
            onChange={(e) => onChange(campo.id, e.target.value)}
            placeholder={campo.placeholder}
            disabled={modoLectura}
            rows={3}
            className={getInputClassName(campo.id)}
          />
        ) : campo.tipo === 'select' ? (
          <select
            value={valor}
            onChange={(e) => onChange(campo.id, e.target.value)}
            disabled={modoLectura}
            className={getInputClassName(campo.id)}
          >
            <option value="">Seleccionar...</option>
            {campo.opciones?.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={campo.tipo}
            value={valor}
            onChange={(e) => onChange(campo.id, e.target.value)}
            placeholder={campo.placeholder}
            disabled={modoLectura}
            className={getInputClassName(campo.id)}
          />
        )}

        {/* Indicador de confianza */}
        {estado && (
          <div className="mt-1 flex items-center gap-2">
            {estado.confianza >= 0.8 ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Alta confianza ({Math.round(estado.confianza * 100)}%)
              </span>
            ) : estado.confianza >= 0.5 ? (
              <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Verificar ({Math.round(estado.confianza * 100)}%)
              </span>
            ) : estado.requiereRevision ? (
              <span className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Requiere revisión
              </span>
            ) : null}

            {estado.fuente && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                • Extraído de: {estado.fuente}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {Object.entries(camposPorSeccion).map(([seccion, camposSeccion]) => (
        <div key={seccion}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {NOMBRES_SECCIONES[seccion] || seccion}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {camposSeccion.map((campo) => (
              <div
                key={campo.id}
                className={campo.tipo === 'textarea' ? 'md:col-span-2' : ''}
              >
                {renderCampo(campo)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
