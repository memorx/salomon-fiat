// app/api/documentos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/documentos/[id] - Obtener un documento
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: documentoId } = await params;

    const documento = await prisma.documento.findUnique({
      where: { id: documentoId },
      include: {
        caso: {
          select: {
            id: true,
            documentType: true,
            status: true,
            userId: true
          }
        },
        plantilla: {
          select: {
            id: true,
            nombre: true,
            tipo: true
          }
        }
      }
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ documento });
  } catch (error) {
    console.error('Error al obtener documento:', error);
    return NextResponse.json(
      { error: 'Error al obtener el documento' },
      { status: 500 }
    );
  }
}

// PATCH /api/documentos/[id] - Actualizar documento
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: documentoId } = await params;
    const body = await request.json();
    const { contenido, status } = body;

    // Verificar que el documento existe
    const documentoExistente = await prisma.documento.findUnique({
      where: { id: documentoId }
    });

    if (!documentoExistente) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar
    const datosActualizacion: any = {};

    if (contenido !== undefined) {
      datosActualizacion.contenido = contenido;
      datosActualizacion.version = documentoExistente.version + 1;
    }

    if (status !== undefined) {
      datosActualizacion.status = status;
    }

    const documentoActualizado = await prisma.documento.update({
      where: { id: documentoId },
      data: datosActualizacion
    });

    return NextResponse.json({ documento: documentoActualizado });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el documento' },
      { status: 500 }
    );
  }
}

// DELETE /api/documentos/[id] - Eliminar documento
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: documentoId } = await params;

    // Verificar que el documento existe
    const documento = await prisma.documento.findUnique({
      where: { id: documentoId }
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar documento
    await prisma.documento.delete({
      where: { id: documentoId }
    });

    return NextResponse.json({
      success: true,
      message: 'Documento eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el documento' },
      { status: 500 }
    );
  }
}
