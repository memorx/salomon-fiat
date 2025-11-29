// scripts/test-chat-modificacion.ts
/**
 * Script para probar el chat de modificación de documentos
 *
 * Prerequisito: Debe existir un documento en la BD
 * Ejecutar con: npx tsx scripts/test-chat-modificacion.ts
 */

const API_BASE = 'http://localhost:3000/api';

// Cambiar este ID por uno real de tu BD
const DOCUMENTO_ID = process.argv[2] || 'DOCUMENTO_ID_AQUI';

interface ModificacionTest {
  instruccion: string;
  descripcion: string;
}

const pruebas: ModificacionTest[] = [
  {
    instruccion: 'Cambia el nombre del comprador a "Roberto Fernández Ruiz"',
    descripcion: 'Cambio de nombre simple'
  },
  {
    instruccion:
      'Actualiza el precio de venta a $2,000,000.00 (DOS MILLONES DE PESOS)',
    descripcion: 'Cambio de precio'
  },
  {
    instruccion:
      'Agrega la siguiente cláusula después de la cláusula SÉPTIMA: "OCTAVA.- PENALIZACIÓN. En caso de incumplimiento, la parte infractora pagará una penalización del 10% del valor total de la operación."',
    descripcion: 'Agregar cláusula nueva'
  },
  {
    instruccion: 'Corrige todos los errores ortográficos que encuentres',
    descripcion: 'Corrección ortográfica'
  }
];

async function testChatModificacion() {
  console.log('\n🤖 Iniciando pruebas del Chat de Modificación\n');
  console.log('='.repeat(60));
  console.log(`Documento ID: ${DOCUMENTO_ID}`);
  console.log('='.repeat(60));

  if (DOCUMENTO_ID === 'DOCUMENTO_ID_AQUI') {
    console.log('\n⚠️  NOTA: Debes proporcionar un ID de documento válido');
    console.log(
      '   Uso: npx tsx scripts/test-chat-modificacion.ts <documento_id>\n'
    );
    return;
  }

  // Primero verificar que el documento existe
  console.log('\n📋 Verificando documento...');

  try {
    const checkResponse = await fetch(`${API_BASE}/documentos/${DOCUMENTO_ID}`);

    if (!checkResponse.ok) {
      console.log(`❌ Documento no encontrado (HTTP ${checkResponse.status})`);
      console.log('   Asegúrate de que el ID sea correcto.\n');
      return;
    }

    const { documento } = await checkResponse.json();
    console.log(`✅ Documento encontrado: ${documento.tipo}`);
    console.log(`   Versión actual: ${documento.version}`);
    console.log(`   Status: ${documento.status}`);
    console.log(`   Longitud: ${documento.contenido.length} caracteres`);

    // Ejecutar pruebas de modificación
    for (let i = 0; i < pruebas.length; i++) {
      const prueba = pruebas[i];

      console.log(`\n${'─'.repeat(60)}`);
      console.log(
        `📝 Prueba ${i + 1}/${pruebas.length}: ${prueba.descripcion}`
      );
      console.log(
        `   Instrucción: "${prueba.instruccion.substring(0, 50)}..."`
      );

      const inicio = Date.now();

      try {
        const response = await fetch(
          `${API_BASE}/documentos/${DOCUMENTO_ID}/chat`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instruccion: prueba.instruccion,
              modelo: 'claude'
            })
          }
        );

        const resultado = await response.json();
        const tiempo = Date.now() - inicio;

        if (resultado.success) {
          console.log(`✅ Modificación exitosa (${tiempo}ms)`);
          console.log(`   Nueva versión: ${resultado.documento.version}`);
          console.log(
            `   Nueva longitud: ${resultado.documento.contenido.length} caracteres`
          );
        } else {
          console.log(`❌ Error: ${resultado.error}`);
        }
      } catch (error) {
        console.log(
          `❌ Error de conexión: ${
            error instanceof Error ? error.message : 'Desconocido'
          }`
        );
      }

      // Esperar un poco entre pruebas para no saturar la API
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Verificar estado final
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 Estado final del documento');
    console.log('='.repeat(60));

    const finalResponse = await fetch(`${API_BASE}/documentos/${DOCUMENTO_ID}`);
    const { documento: docFinal } = await finalResponse.json();

    console.log(`   Versión final: ${docFinal.version}`);
    console.log(`   Status: ${docFinal.status}`);
    console.log(`   Longitud: ${docFinal.contenido.length} caracteres`);

    console.log('\n🎉 Pruebas completadas\n');
  } catch (error) {
    console.error('\n💥 Error fatal:', error);
  }
}

testChatModificacion();
