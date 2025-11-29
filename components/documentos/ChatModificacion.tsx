// components/documentos/ChatModificacion.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface Mensaje {
  id: string;
  rol: 'usuario' | 'asistente' | 'sistema';
  contenido: string;
  timestamp: Date;
  exito?: boolean;
}

interface ChatModificacionProps {
  documentoId: string;
  onDocumentoActualizado: (nuevoContenido: string, version: number) => void;
  disabled?: boolean;
}

export default function ChatModificacion({
  documentoId,
  onDocumentoActualizado,
  disabled = false
}: ChatModificacionProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      rol: 'sistema',
      contenido:
        '¡Hola! Puedo ayudarte a modificar este documento. Describe los cambios que necesitas y los aplicaré automáticamente.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!inputValue.trim() || enviando || disabled) return;

    const mensajeUsuario: Mensaje = {
      id: `user-${Date.now()}`,
      rol: 'usuario',
      contenido: inputValue.trim(),
      timestamp: new Date()
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setInputValue('');
    setEnviando(true);

    try {
      const response = await fetch(`/api/documentos/${documentoId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccion: mensajeUsuario.contenido,
          modelo: 'claude'
        })
      });

      const data = await response.json();

      if (data.success) {
        const mensajeExito: Mensaje = {
          id: `asistente-${Date.now()}`,
          rol: 'asistente',
          contenido: `✅ Cambios aplicados correctamente. El documento ahora está en la versión ${data.documento.version}.`,
          timestamp: new Date(),
          exito: true
        };
        setMensajes((prev) => [...prev, mensajeExito]);

        // Notificar al componente padre
        onDocumentoActualizado(
          data.documento.contenido,
          data.documento.version
        );
      } else {
        const mensajeError: Mensaje = {
          id: `asistente-${Date.now()}`,
          rol: 'asistente',
          contenido: `❌ ${
            data.error ||
            'No pude aplicar los cambios. Por favor, intenta de nuevo con una instrucción más específica.'
          }`,
          timestamp: new Date(),
          exito: false
        };
        setMensajes((prev) => [...prev, mensajeError]);
      }
    } catch (error) {
      const mensajeError: Mensaje = {
        id: `asistente-${Date.now()}`,
        rol: 'asistente',
        contenido:
          '❌ Error de conexión. Por favor, verifica tu conexión e intenta de nuevo.',
        timestamp: new Date(),
        exito: false
      };
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const sugerencias = [
    'Cambia el nombre del comprador a "Juan Pérez García"',
    'Corrige la dirección del inmueble',
    'Agrega una cláusula de penalización',
    'Cambia la fecha de la escritura al 15 de enero de 2025',
    'Actualiza el precio a $2,500,000.00'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Modificar con IA
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Describe los cambios que necesitas
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${
              mensaje.rol === 'usuario' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                mensaje.rol === 'usuario'
                  ? 'bg-blue-600 text-white'
                  : mensaje.rol === 'sistema'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : mensaje.exito
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{mensaje.contenido}</p>
              <p
                className={`text-xs mt-1 ${
                  mensaje.rol === 'usuario'
                    ? 'text-blue-200'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {mensaje.timestamp.toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Indicador de escribiendo */}
        {enviando && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias rápidas */}
      {mensajes.length <= 2 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Sugerencias:
          </p>
          <div className="flex flex-wrap gap-1">
            {sugerencias.slice(0, 3).map((sugerencia, index) => (
              <button
                key={index}
                onClick={() => setInputValue(sugerencia)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors truncate max-w-[200px]"
              >
                {sugerencia}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe los cambios que necesitas..."
            disabled={disabled || enviando}
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={enviarMensaje}
            disabled={!inputValue.trim() || enviando || disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px] h-[44px]"
          >
            {enviando ? (
              <svg
                className="w-5 h-5 animate-spin"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Presiona Enter para enviar o Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
