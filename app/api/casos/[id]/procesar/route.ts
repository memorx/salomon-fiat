// app/api/casos/[id]/procesar/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { extraerDatosConIA } from '@/lib/ai/extractor';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/casos/[id]/procesar - Procesar documentos con OCR e IA
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: casoId } = await params;
    const body = await request.json();
    const { modelo = 'claude' } = body;

    // Obtener el caso con sus documentos
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      include: {
        documentos: true
      }
    });

    if (!caso) {
      return NextResponse.json(
        { error: 'Caso no encontrado' },
        { status: 404 }
      );
    }

    if (caso.documentos.length === 0) {
      return NextResponse.json(
        { error: 'El caso no tiene documentos para procesar' },
        { status: 400 }
      );
    }

    // Actualizar estado a "procesando"
    await prisma.caso.update({
      where: { id: casoId },
      data: { status: 'EXTRAYENDO_INFO' }
    });

    // Procesar documentos con IA
    const resultado = await extraerDatosConIA({
      casoId,
      tipoCaso: caso.documentType || 'general',
      documentos: caso.documentos.map((doc) => ({
        id: doc.id,
        tipo: doc.tipo,
        url: doc.contenido
      })),
      modelo
    });

    if (!resultado.exito) {
      // Si hay error, actualizar estado
      await prisma.caso.update({
        where: { id: casoId },
        data: { status: 'ERROR' }
      });

      return NextResponse.json(
        { error: resultado.error || 'Error al procesar documentos' },
        { status: 500 }
      );
    }

    // Determinar nuevo estado basado en campos faltantes
    const nuevoStatus =
      resultado.camposFaltantes && resultado.camposFaltantes.length > 0
        ? 'REQUIERE_INFO'
        : 'EN_REVISION';

    // Actualizar caso con datos extraídos
    const casoActualizado = await prisma.caso.update({
      where: { id: casoId },
      data: {
        status: nuevoStatus,
        extractedData: resultado.datosExtraidos || {},
        aiModel: modelo
      },
      include: {
        documentos: true
      }
    });

    return NextResponse.json({
      caso: casoActualizado,
      datosExtraidos: resultado.datosExtraidos,
      camposFaltantes: resultado.camposFaltantes,
      sugerencias: resultado.sugerencias,
      tiempoProcesamiento: resultado.tiempoProcesamiento
    });
  } catch (error) {
    console.error('Error al procesar caso:', error);

    // Intentar actualizar estado a error
    try {
      const { id: casoId } = await params;
      await prisma.caso.update({
        where: { id: casoId },
        data: { status: 'ERROR' }
      });
    } catch {}

    return NextResponse.json(
      { error: 'Error al procesar los documentos' },
      { status: 500 }
    );
  }
}
