'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NuevoCasoPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // TODO: Implementar grabación real
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    // TODO: Implementar detención de grabación
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setHasRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Crear Nuevo Caso
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Graba la conversación con tu cliente para generar los documentos necesarios
        </p>
      </div>

      {/* Recording Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
        {/* Visual Indicator */}
        <div className="flex flex-col items-center mb-8">
          <div className={`relative w-48 h-48 rounded-full flex items-center justify-center mb-6 ${
            isRecording 
              ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' 
              : hasRecording
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {isRecording ? (
              <svg className="w-24 h-24 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            ) : hasRecording ? (
              <svg className="w-24 h-24 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-24 h-24 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
              {formatTime(recordingTime)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRecording 
                ? 'Grabando...' 
                : hasRecording 
                ? 'Grabación completada' 
                : 'Listo para grabar'
              }
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !hasRecording && (
            <button
              onClick={handleStartRecording}
              className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 text-lg font-medium"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8"/>
              </svg>
              Iniciar Grabación
            </button>
          )}

          {isRecording && (
            <button
              onClick={handleStopRecording}
              className="px-8 py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-full hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-lg font-medium"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
              Detener
            </button>
          )}

          {hasRecording && (
            <>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Volver a grabar
              </button>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Procesar Audio
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Consejos para una mejor grabación
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Habla de forma clara y a un ritmo moderado</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Menciona nombres completos, números de identificación y datos exactos</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Especifica el tipo de documento que necesitas</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Graba en un ambiente tranquilo sin ruido de fondo</span>
          </li>
        </ul>
      </div>

      {/* Alternative: Upload Audio */}
      <div className="mt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">o</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <button className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Subir archivo de audio
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              MP3, WAV o M4A (máx. 50MB)
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
