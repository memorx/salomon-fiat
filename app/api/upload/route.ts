// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/storage/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const casoId = formData.get('casoId') as string;
    const tipoDocumento = formData.get('tipoDocumento') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];
    if (!tiposPermitidos.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Use JPG, PNG, WebP o PDF.' },
        { status: 400 }
      );
    }

    // Validar tamaño (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo de 10MB' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${
      casoId || 'temp'
    }/${tipoDocumento}_${timestamp}.${extension}`;

    // Convertir a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('documentos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Error subiendo a Supabase:', error);
      return NextResponse.json(
        { error: 'Error al subir el archivo: ' + error.message },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('documentos')
      .getPublicUrl(fileName);

    // También obtener el archivo como base64 para procesamiento AI
    const base64 = buffer.toString('base64');

    return NextResponse.json({
      success: true,
      archivo: {
        path: data.path,
        url: urlData.publicUrl,
        nombre: file.name,
        tipo: file.type,
        tamaño: file.size,
        base64: base64
      }
    });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para subir múltiples archivos
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const casoId = formData.get('casoId') as string;
    const tiposDocumento = formData.get('tiposDocumento') as string; // JSON array

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    const tipos = tiposDocumento ? JSON.parse(tiposDocumento) : [];
    const resultados = [];
    const errores = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tipoDoc = tipos[i] || 'otro';

      try {
        // Validaciones
        const tiposPermitidos = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf'
        ];
        if (!tiposPermitidos.includes(file.type)) {
          errores.push({ archivo: file.name, error: 'Tipo no permitido' });
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          errores.push({ archivo: file.name, error: 'Excede 10MB' });
          continue;
        }

        // Generar nombre y subir
        const timestamp = Date.now();
        const extension = file.name.split('.').pop() || 'jpg';
        const fileName = `${
          casoId || 'temp'
        }/${tipoDoc}_${timestamp}_${i}.${extension}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
          .from('documentos')
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false
          });

        if (error) {
          errores.push({ archivo: file.name, error: error.message });
          continue;
        }

        const { data: urlData } = supabaseAdmin.storage
          .from('documentos')
          .getPublicUrl(fileName);

        resultados.push({
          path: data.path,
          url: urlData.publicUrl,
          nombre: file.name,
          tipo: file.type,
          tipoDocumento: tipoDoc,
          tamaño: file.size,
          base64: buffer.toString('base64')
        });
      } catch (fileError) {
        errores.push({
          archivo: file.name,
          error:
            fileError instanceof Error ? fileError.message : 'Error desconocido'
        });
      }
    }

    return NextResponse.json({
      success: true,
      archivos: resultados,
      errores: errores.length > 0 ? errores : undefined,
      total: files.length,
      subidos: resultados.length
    });
  } catch (error) {
    console.error('Error en upload múltiple:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
