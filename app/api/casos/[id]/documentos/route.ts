// app/api/casos/[id]/documentos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { supabaseAdmin } from '@/lib/storage/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/casos/[id]/documentos - Listar documentos de un caso
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: casoId } = await params;

    const documentos = await prisma.documento.findMany({
      where: { casoId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ documentos });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los documentos' },
      { status: 500 }
    );
  }
}

// POST /api/casos/[id]/documentos - Subir documentos
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: casoId } = await params;
    console.log('📁 Iniciando subida de documentos para caso:', casoId);

    // Verificar que el caso existe
    const caso = await prisma.caso.findUnique({
      where: { id: casoId }
    });

    if (!caso) {
      return NextResponse.json(
        { error: 'Caso no encontrado' },
        { status: 404 }
      );
    }

    // Obtener FormData
    const formData = await request.formData();
    const archivos = formData.getAll('archivos') as File[];
    const tiposJson = formData.get('tipos') as string;

    console.log('📦 Archivos recibidos:', archivos.length);
    console.log('📦 Tipos JSON:', tiposJson);

    const tipos = JSON.parse(tiposJson || '[]');

    if (archivos.length === 0) {
      console.log('❌ No se recibieron archivos');
      return NextResponse.json(
        { error: 'No se recibieron archivos' },
        { status: 400 }
      );
    }

    const documentosCreados = [];
    const errores = [];

    // Procesar cada archivo
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      const tipo = tipos[i] || 'otro';

      console.log(
        `📄 Procesando archivo ${i + 1}:`,
        archivo.name,
        'Tamaño:',
        archivo.size,
        'Tipo:',
        archivo.type
      );

      // Generar nombre único
      const extension = archivo.name.split('.').pop();
      const nombreArchivo = `${casoId}/${Date.now()}-${i}.${extension}`;

      console.log('📝 Nombre en storage:', nombreArchivo);

      // Convertir a buffer
      const arrayBuffer = await archivo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('💾 Buffer creado, tamaño:', buffer.length);

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
          .from('documentos')
          .upload(nombreArchivo, buffer, {
            contentType: archivo.type,
            upsert: false
          });

      if (uploadError) {
        console.error('❌ Error al subir archivo a Supabase:', uploadError);
        errores.push({ archivo: archivo.name, error: uploadError.message });
        continue;
      }

      console.log('✅ Archivo subido exitosamente:', uploadData);

      // Obtener URL pública
      const { data: urlData } = supabaseAdmin.storage
        .from('documentos')
        .getPublicUrl(nombreArchivo);

      console.log('🔗 URL pública:', urlData.publicUrl);

      // Crear registro en BD
      const documento = await prisma.documento.create({
        data: {
          casoId,
          tipo,
          contenido: urlData.publicUrl,
          status: 'BORRADOR',
          version: 1
        }
      });

      console.log('💾 Documento creado en BD:', documento.id);

      documentosCreados.push(documento);
    }

    if (documentosCreados.length === 0) {
      console.error('❌ No se pudo subir ningún archivo. Errores:', errores);
      return NextResponse.json(
        { error: 'No se pudo subir ningún archivo', detalles: errores },
        { status: 500 }
      );
    }

    // Actualizar estado del caso
    const casoActualizado = await prisma.caso.update({
      where: { id: casoId },
      data: { status: 'CLASIFICANDO' }
    });

    console.log(
      '✅ Proceso completado. Documentos creados:',
      documentosCreados.length
    );

    return NextResponse.json(
      {
        documentos: documentosCreados,
        caso: casoActualizado
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('💥 Error general al subir documentos:', error);
    return NextResponse.json(
      { error: 'Error al subir los documentos', detalle: String(error) },
      { status: 500 }
    );
  }
}
