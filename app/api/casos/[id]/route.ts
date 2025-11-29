// app/api/casos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/casos/[id] - Obtener un caso específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: casoId } = await params;

    const caso = await prisma.caso.findFirst({
      where: {
        id: casoId,
        userId: session.user.id
      },
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

    return NextResponse.json({ caso });
  } catch (error) {
    console.error('Error al obtener caso:', error);
    return NextResponse.json(
      { error: 'Error al obtener el caso' },
      { status: 500 }
    );
  }
}

// PATCH /api/casos/[id] - Actualizar un caso
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: casoId } = await params;

    // Verificar que el caso pertenece al usuario
    const casoExistente = await prisma.caso.findFirst({
      where: {
        id: casoId,
        userId: session.user.id
      }
    });

    if (!casoExistente) {
      return NextResponse.json(
        { error: 'Caso no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Actualizar el caso
    const caso = await prisma.caso.update({
      where: { id: casoId },
      data: body
    });

    return NextResponse.json({ caso });
  } catch (error) {
    console.error('Error al actualizar caso:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el caso' },
      { status: 500 }
    );
  }
}

// DELETE /api/casos/[id] - Eliminar un caso
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: casoId } = await params;

    // Verificar que el caso pertenece al usuario
    const casoExistente = await prisma.caso.findFirst({
      where: {
        id: casoId,
        userId: session.user.id
      }
    });

    if (!casoExistente) {
      return NextResponse.json(
        { error: 'Caso no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el caso (los documentos se eliminan en cascada por la relación en Prisma)
    await prisma.caso.delete({
      where: { id: casoId }
    });

    return NextResponse.json({ message: 'Caso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar caso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el caso' },
      { status: 500 }
    );
  }
}
