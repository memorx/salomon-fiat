// app/api/documentos/[id]/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { modificarDocumentoConChat } from '@/lib/ai/generador';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/documentos/[id]/chat - Modificar documento con chat
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: documentoId } = await params;
    const body = await request.json();
    const { instruccion, modelo = 'claude' } = body;

    if (!instruccion || instruccion.trim() === '') {
      return NextResponse.json(
        { error: 'Se requiere una instrucción para modificar el documento' },
        { status: 400 }
      );
    }

    // Obtener documento actual
    const documento = await prisma.documento.findUnique({
      where: { id: documentoId },
      include: {
        caso: {
          select: { userId: true }
        }
      }
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // TODO: Verificar que el documento pertenece al usuario (cuando tengamos auth)
    // if (documento.caso.userId !== session.user.id) {
    //   return NextResponse.json(
    //     { error: 'No tienes permiso para modificar este documento' },
    //     { status: 403 }
    //   );
    // }

    console.log(
      `Modificando documento ${documentoId} con instrucción: ${instruccion.substring(
        0,
        50
      )}...`
    );

    // Modificar documento con IA
    const resultado = await modificarDocumentoConChat(
      documento.contenido,
      instruccion,
      modelo
    );

    if (!resultado.exito) {
      return NextResponse.json(
        { error: resultado.error || 'Error al modificar documento' },
        { status: 500 }
      );
    }

    // Actualizar documento en BD (incrementar versión)
    const documentoActualizado = await prisma.documento.update({
      where: { id: documentoId },
      data: {
        contenido: resultado.contenido!,
        version: documento.version + 1,
        status: 'EN_REVISION'
      }
    });

    console.log(
      `Documento actualizado a versión ${documentoActualizado.version}`
    );

    return NextResponse.json({
      success: true,
      documento: documentoActualizado,
      tiempoProcesamiento: resultado.tiempoProcesamiento
    });
  } catch (error) {
    console.error('Error en chat de documento:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// GET /api/documentos/[id]/chat - Obtener historial (futuro)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: documentoId } = await params;

    // Por ahora solo verificamos que el documento existe
    const documento = await prisma.documento.findUnique({
      where: { id: documentoId },
      select: { id: true, version: true }
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // TODO: Implementar historial de cambios cuando tengamos la tabla
    return NextResponse.json({
      success: true,
      historial: [],
      mensaje: 'Historial de cambios pendiente de implementar'
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return NextResponse.json(
      { error: 'Error al obtener historial' },
      { status: 500 }
    );
  }
}
