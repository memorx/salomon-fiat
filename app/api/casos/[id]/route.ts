// app/api/casos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/casos - Listar todos los casos del usuario
export async function GET(request: NextRequest) {
  try {
    // TODO: Obtener userId de la sesión con NextAuth
    const userId = 'user-temp-id'; // Temporal hasta implementar auth

    const casos = await prisma.caso.findMany({
      where: { userId },
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
    const body = await request.json();
    const { tipoCaso, aiModel = 'claude' } = body;

    // Validar tipo de caso
    if (!tipoCaso) {
      return NextResponse.json(
        { error: 'El tipo de caso es requerido' },
        { status: 400 }
      );
    }

    // TODO: Obtener userId de la sesión con NextAuth
    const userId = 'user-temp-id'; // Temporal hasta implementar auth

    // Crear el caso en la base de datos
    const caso = await prisma.caso.create({
      data: {
        userId,
        documentType: tipoCaso,
        aiModel,
        status: 'TRANSCRIBIENDO', // Estado inicial (cambiaremos el nombre después)
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
