// app/api/generar/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generarDocumentoConIA } from '@/lib/ai/generador';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tipoCaso,
      datos,
      plantillaId,
      modelo = 'claude'
    }: {
      tipoCaso: string;
      datos: Record<string, string>;
      plantillaId?: string;
      modelo?: 'claude' | 'gpt4' | 'gemini';
    } = body;

    // Validaciones
    if (!tipoCaso) {
      return NextResponse.json(
        { error: 'El tipo de caso es requerido' },
        { status: 400 }
      );
    }

    if (!datos || Object.keys(datos).length === 0) {
      return NextResponse.json(
        { error: 'Se requieren datos para generar el documento' },
        { status: 400 }
      );
    }

    console.log(`Generando documento para caso tipo: ${tipoCaso}`);
    console.log(`Modelo: ${modelo}`);
    console.log(`Campos proporcionados: ${Object.keys(datos).length}`);

    // Generar documento
    const resultado = await generarDocumentoConIA({
      tipoCaso,
      datos,
      plantillaId,
      modelo,
      usarPlantillaBase: true
    });

    if (!resultado.exito) {
      return NextResponse.json(
        {
          error: resultado.error || 'Error al generar documento',
          tiempoProcesamiento: resultado.tiempoProcesamiento
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      contenido: resultado.contenido,
      tiempoProcesamiento: resultado.tiempoProcesamiento,
      camposFaltantes: resultado.camposFaltantes
    });
  } catch (error) {
    console.error('Error en generación:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
