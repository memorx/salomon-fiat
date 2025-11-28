// app/api/extraer/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { extraerDatosConIA } from '@/lib/ai/extractor';

interface DocumentoRequest {
  id: string;
  tipo: string;
  base64: string;
  mimeType: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      casoId,
      tipoCaso,
      documentos,
      modelo = 'claude'
    }: {
      casoId: string;
      tipoCaso: string;
      documentos: DocumentoRequest[];
      modelo?: 'claude' | 'gpt4' | 'gemini';
    } = body;

    // Validaciones
    if (!tipoCaso) {
      return NextResponse.json(
        { error: 'El tipo de caso es requerido' },
        { status: 400 }
      );
    }

    if (!documentos || documentos.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un documento para procesar' },
        { status: 400 }
      );
    }

    // Validar que los documentos tengan la estructura correcta
    for (const doc of documentos) {
      if (!doc.base64 || !doc.tipo || !doc.mimeType) {
        return NextResponse.json(
          { error: `Documento inválido: falta base64, tipo o mimeType` },
          { status: 400 }
        );
      }
    }

    console.log(
      `Procesando ${documentos.length} documentos para caso tipo: ${tipoCaso}`
    );
    console.log(`Modelo: ${modelo}`);
    console.log(
      `Tipos de documentos:`,
      documentos.map((d) => d.tipo)
    );

    // Llamar al extractor de datos
    const resultado = await extraerDatosConIA({
      casoId: casoId || 'temp-' + Date.now(),
      tipoCaso,
      documentos,
      modelo
    });

    if (!resultado.exito) {
      return NextResponse.json(
        {
          error: resultado.error || 'Error al procesar documentos',
          tiempoProcesamiento: resultado.tiempoProcesamiento
        },
        { status: 500 }
      );
    }

    // Transformar datos extraídos a formato plano para el formulario
    const datosPlanos: Record<string, string> = {};

    if (resultado.datosExtraidos) {
      for (const [seccion, campos] of Object.entries(
        resultado.datosExtraidos
      )) {
        for (const [campo, datos] of Object.entries(campos)) {
          if (datos.valor) {
            datosPlanos[campo] = datos.valor;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      datosExtraidos: resultado.datosExtraidos,
      datosPlanos,
      camposFaltantes: resultado.camposFaltantes,
      sugerencias: resultado.sugerencias,
      tiempoProcesamiento: resultado.tiempoProcesamiento,
      documentosProcesados: documentos.length
    });
  } catch (error) {
    console.error('Error en extracción:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
