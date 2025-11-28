// components/casos/FormularioDinamico.tsx
'use client';

import { useState, useMemo } from 'react';
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
  const camposPorSeccion = useMemo(
    () => agruparCamposPorSeccion(campos),
    [campos]
  );

  // Estado para secciones expandidas/colapsadas
  const [seccionesExpandidas, setSeccionesExpandidas] = useState<
    Record<string, boolean>
  >(() => {
    // Por defecto, expandir las primeras 3 secciones
    const inicial: Record<string, boolean> = {};
    Object.keys(camposPorSeccion).forEach((seccion, index) => {
      inicial[seccion] = index < 3;
    });
    return inicial;
  });

  // Toggle sección
  const toggleSeccion = (seccion: string) => {
    setSeccionesExpandidas((prev) => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  // Expandir/colapsar todas
  const expandirTodas = () => {
    const todas: Record<string, boolean> = {};
    Object.keys(camposPorSeccion).forEach((seccion) => {
      todas[seccion] = true;
    });
    setSeccionesExpandidas(todas);
  };

  const colapsarTodas = () => {
    const todas: Record<string, boolean> = {};
    Object.keys(camposPorSeccion).forEach((seccion) => {
      todas[seccion] = false;
    });
    setSeccionesExpandidas(todas);
  };

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

  // Calcular progreso de una sección
  const calcularProgresoSeccion = (camposSeccion: CampoFormulario[]) => {
    const requeridos = camposSeccion.filter((c) => c.requerido);
    if (requeridos.length === 0) return 100;

    const completados = requeridos.filter(
      (c) => valores[c.id] && valores[c.id].trim() !== ''
    );
    return Math.round((completados.length / requeridos.length) * 100);
  };

  // Contar campos completados en una sección
  const contarCamposSeccion = (camposSeccion: CampoFormulario[]) => {
    const completados = camposSeccion.filter(
      (c) => valores[c.id] && valores[c.id].trim() !== ''
    );
    return { completados: completados.length, total: camposSeccion.length };
  };

  // Determinar el estilo del input basado en el estado
  const getInputClassName = (campoId: string, campo: CampoFormulario) => {
    const estado = getEstadoCampo(campoId);
    const baseClass =
      'w-full px-3 py-2 rounded-lg text-gray-900 dark:text-white transition-colors text-sm';

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

    // Resaltar campos requeridos vacíos
    if (
      campo.requerido &&
      (!valores[campoId] || valores[campoId].trim() === '')
    ) {
      return `${baseClass} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
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
            rows={2}
            className={getInputClassName(campo.id, campo)}
          />
        ) : campo.tipo === 'select' ? (
          <select
            value={valor}
            onChange={(e) => onChange(campo.id, e.target.value)}
            disabled={modoLectura}
            className={getInputClassName(campo.id, campo)}
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
            className={getInputClassName(campo.id, campo)}
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
                Extraído ({Math.round(estado.confianza * 100)}%)
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
                • De: {estado.fuente}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Calcular progreso total
  const progresoTotal = useMemo(() => {
    const todosRequeridos = campos.filter((c) => c.requerido);
    if (todosRequeridos.length === 0) return 100;
    const completados = todosRequeridos.filter(
      (c) => valores[c.id] && valores[c.id].trim() !== ''
    );
    return Math.round((completados.length / todosRequeridos.length) * 100);
  }, [campos, valores]);

  return (
    <div className="space-y-4">
      {/* Barra de progreso general */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progreso General
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {progresoTotal}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progresoTotal}%` }}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={expandirTodas}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Expandir todas
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            type="button"
            onClick={colapsarTodas}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Colapsar todas
          </button>
        </div>
      </div>

      {/* Secciones colapsables */}
      {Object.entries(camposPorSeccion).map(([seccion, camposSeccion]) => {
        const progreso = calcularProgresoSeccion(camposSeccion);
        const { completados, total } = contarCamposSeccion(camposSeccion);
        const expandida = seccionesExpandidas[seccion];

        return (
          <div
            key={seccion}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header de sección (clickeable) */}
            <button
              type="button"
              onClick={() => toggleSeccion(seccion)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandida ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {NOMBRES_SECCIONES[seccion] || seccion}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({completados}/{total})
                </span>
              </div>

              {/* Mini barra de progreso */}
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      progreso === 100
                        ? 'bg-green-500'
                        : progreso > 50
                        ? 'bg-blue-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                {progreso === 100 && (
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Contenido de sección */}
            {expandida && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  {camposSeccion.map((campo) => (
                    <div
                      key={campo.id}
                      className={
                        campo.tipo === 'textarea' ? 'md:col-span-2' : ''
                      }
                    >
                      {renderCampo(campo)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
