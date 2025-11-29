// app/api/casos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth';

// GET /api/casos - Listar todos los casos del usuario
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const casos = await prisma.caso.findMany({
      where: { userId: session.user.id },
      include: {
        documentos: {
          select: {
            id: true,
            tipo: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ casos });
  } catch (error) {
    console.error('Error al obtener casos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los casos' },
      { status: 500 }
    );
  }
}

// POST /api/casos - Crear un nuevo caso
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { tipoCaso, aiModel = 'claude' } = body;

    // Validar tipo de caso
    if (!tipoCaso) {
      return NextResponse.json(
        { error: 'El tipo de caso es requerido' },
        { status: 400 }
      );
    }

    // Crear el caso en la base de datos
    const caso = await prisma.caso.create({
      data: {
        userId: session.user.id,
        documentType: tipoCaso,
        aiModel,
        status: 'TRANSCRIBIENDO',
        extractedData: {}
      }
    });

    return NextResponse.json({ caso }, { status: 201 });
  } catch (error) {
    console.error('Error al crear caso:', error);
    return NextResponse.json(
      { error: 'Error al crear el caso' },
      { status: 500 }
    );
  }
}
