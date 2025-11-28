// app/api/casos/[id]/generar/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generarDocumentoConIA } from '@/lib/ai/generador';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/casos/[id]/generar - Generar documento legal
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: casoId } = await params;
    const body = await request.json();
    const { plantillaId, datosAdicionales } = body;

    // Obtener el caso con datos extraídos
    const caso = await prisma.caso.findUnique({
      where: { id: casoId }
    });

    if (!caso) {
      return NextResponse.json(
        { error: 'Caso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que hay datos extraídos
    if (
      !caso.extractedData ||
      Object.keys(caso.extractedData as object).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            'El caso no tiene datos extraídos. Procesa los documentos primero.'
        },
        { status: 400 }
      );
    }

    // Obtener plantilla si se especificó
    let plantilla = null;
    if (plantillaId) {
      plantilla = await prisma.plantilla.findUnique({
        where: { id: plantillaId }
      });

      if (!plantilla) {
        return NextResponse.json(
          { error: 'Plantilla no encontrada' },
          { status: 404 }
        );
      }
    }

    // Actualizar estado del caso
    await prisma.caso.update({
      where: { id: casoId },
      data: { status: 'GENERANDO_DOCUMENTO' }
    });

    // Combinar datos extraídos con datos adicionales
    const datosCompletos = {
      ...(caso.extractedData as object),
      ...datosAdicionales
    };

    // Generar documento con IA
    const resultado = await generarDocumentoConIA({
      tipoCaso: caso.documentType || 'general',
      datos: datosCompletos,
      plantilla: plantilla?.contenido,
      modelo: caso.aiModel || 'claude'
    });

    if (!resultado.exito) {
      await prisma.caso.update({
        where: { id: casoId },
        data: { status: 'ERROR' }
      });

      return NextResponse.json(
        { error: resultado.error || 'Error al generar documento' },
        { status: 500 }
      );
    }

    // Crear documento generado en la BD
    const documento = await prisma.documento.create({
      data: {
        casoId,
        tipo: caso.documentType || 'general',
        plantillaId: plantillaId || null,
        contenido: resultado.contenido || '',
        status: 'BORRADOR',
        version: 1
      }
    });

    // Actualizar estado del caso
    await prisma.caso.update({
      where: { id: casoId },
      data: { status: 'EN_REVISION' }
    });

    return NextResponse.json({
      documento,
      tiempoProcesamiento: resultado.tiempoProcesamiento
    });
  } catch (error) {
    console.error('Error al generar documento:', error);

    try {
      const { id: casoId } = await params;
      await prisma.caso.update({
        where: { id: casoId },
        data: { status: 'ERROR' }
      });
    } catch {}

    return NextResponse.json(
      { error: 'Error al generar el documento' },
      { status: 500 }
    );
  }
}
