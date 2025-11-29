// components/documentos/DocumentoPreview.tsx
'use client';

import { useState } from 'react';

interface DocumentoPreviewProps {
  contenido: string;
  version: number;
  status: string;
  onExportarPDF?: () => void;
  onImprimir?: () => void;
}

export default function DocumentoPreview({
  contenido,
  version,
  status,
  onExportarPDF,
  onImprimir
}: DocumentoPreviewProps) {
  const [modoVista, setModoVista] = useState<'preview' | 'codigo'>('preview');

  // Convertir Markdown básico a HTML
  const renderizarMarkdown = (md: string): string => {
    let html = md
      // Escapar HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-white">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white text-center">$1</h1>'
      )
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Horizontal rules
      .replace(
        /^---$/gim,
        '<hr class="my-6 border-gray-300 dark:border-gray-600" />'
      )
      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-r">$1</blockquote>'
      )
      // Unordered lists
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
      // Tables (básico)
      .replace(
        /\|([^|]+)\|/g,
        '<td class="border border-gray-300 dark:border-gray-600 px-3 py-2">$1</td>'
      )
      // Line breaks
      .replace(
        /\n\n/g,
        '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">'
      )
      .replace(/\n/g, '<br />');

    // Wrap lists
    html = html.replace(
      /(<li.*<\/li>)+/g,
      '<ul class="list-disc mb-4">$&</ul>'
    );

    // Wrap in paragraph
    html = `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${html}</p>`;

    return html;
  };

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      BORRADOR: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      EN_REVISION:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      APROBADO:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      IMPRESO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    return colors[s] || colors.BORRADOR;
  };

  const getStatusLabel = (s: string) => {
    const labels: Record<string, string> = {
      BORRADOR: 'Borrador',
      EN_REVISION: 'En Revisión',
      APROBADO: 'Aprobado',
      IMPRESO: 'Impreso'
    };
    return labels[s] || s;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header con controles */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
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
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Vista del Documento
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Versión {version}
              </span>
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                  status
                )}`}
              >
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle vista */}
          <div className="flex bg-gray-200 dark:bg-gray-600 rounded-lg p-0.5">
            <button
              onClick={() => setModoVista('preview')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                modoVista === 'preview'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Vista Previa
            </button>
            <button
              onClick={() => setModoVista('codigo')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                modoVista === 'codigo'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Código
            </button>
          </div>

          {/* Botones de acción */}
          {onImprimir && (
            <button
              onClick={onImprimir}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Imprimir"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>
          )}
          {onExportarPDF && (
            <button
              onClick={onExportarPDF}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Exportar PDF"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contenido del documento */}
      <div className="max-h-[600px] overflow-y-auto">
        {modoVista === 'preview' ? (
          <div
            className="p-8 prose prose-sm max-w-none dark:prose-invert"
            style={{ fontFamily: '"Times New Roman", serif' }}
            dangerouslySetInnerHTML={{ __html: renderizarMarkdown(contenido) }}
          />
        ) : (
          <div className="p-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
              {contenido}
            </pre>
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {contenido.split(/\s+/).length} palabras • {contenido.length}{' '}
            caracteres
          </span>
          <span>
            Última actualización: {new Date().toLocaleString('es-MX')}
          </span>
        </div>
      </div>
    </div>
  );
}
