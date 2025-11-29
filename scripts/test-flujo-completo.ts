// scripts/test-flujo-completo.ts
/**
 * Script para probar el flujo completo de Salomon AI
 *
 * Ejecutar con: npx ts-node scripts/test-flujo-completo.ts
 * O: npx tsx scripts/test-flujo-completo.ts
 */

const API_BASE = 'http://localhost:3000/api';

interface TestResult {
  paso: string;
  exito: boolean;
  mensaje: string;
  datos?: any;
  tiempo?: number;
}

const resultados: TestResult[] = [];

async function registrarResultado(
  paso: string,
  fn: () => Promise<any>
): Promise<any> {
  const inicio = Date.now();
  try {
    const resultado = await fn();
    resultados.push({
      paso,
      exito: true,
      mensaje: '✅ Completado',
      datos: resultado,
      tiempo: Date.now() - inicio
    });
    return resultado;
  } catch (error) {
    resultados.push({
      paso,
      exito: false,
      mensaje: `❌ Error: ${
        error instanceof Error ? error.message : 'Desconocido'
      }`,
      tiempo: Date.now() - inicio
    });
    throw error;
  }
}

async function testFlujoCompleto() {
  console.log('\n🚀 Iniciando prueba del flujo completo de Salomon AI\n');
  console.log('='.repeat(60));

  let casoId: string | null = null;
  let documentoId: string | null = null;

  try {
    // ================================================================
    // PASO 1: Crear un nuevo caso
    // ================================================================
    console.log('\n📋 PASO 1: Crear caso...');

    const caso = await registrarResultado('Crear caso', async () => {
      const response = await fetch(`${API_BASE}/casos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoCaso: 'compraventa_inmueble',
          aiModel: 'claude'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return response.json();
    });

    casoId = caso.caso.id;
    console.log(`   Caso creado: ${casoId}`);

    // ================================================================
    // PASO 2: Simular extracción de datos
    // ================================================================
    console.log('\n📄 PASO 2: Extraer datos (simulado)...');

    const datosExtraidos = await registrarResultado(
      'Extraer datos',
      async () => {
        // Datos de prueba simulados
        const datosPrueba = {
          vendedor_nombre: 'Juan Carlos Pérez García',
          vendedor_nacionalidad: 'Mexicana',
          vendedor_estado_civil: 'Casado(a)',
          vendedor_ocupacion: 'Comerciante',
          vendedor_lugar_origen: 'Morelia, Michoacán',
          vendedor_curp: 'PEGJ800515HMNRRC09',
          vendedor_rfc: 'PEGJ800515XXX',
          vendedor_ine: 'PRGRJN80051516H100',
          vendedor_domicilio: 'Av. Madero #123, Centro',
          comprador_nombre: 'María Elena López Hernández',
          comprador_nacionalidad: 'Mexicana',
          comprador_estado_civil: 'Soltera',
          comprador_ocupacion: 'Profesionista',
          comprador_lugar_origen: 'Pátzcuaro, Michoacán',
          comprador_curp: 'LOHM850215MMNPRL05',
          comprador_rfc: 'LOHM850215XXX',
          comprador_ine: 'LPHRME85021516M200',
          comprador_domicilio: 'Calle Juárez #456, Centro',
          inmueble_tipo: 'Casa habitación',
          inmueble_calle: 'Av. Revolución',
          inmueble_numero_casa: '789',
          inmueble_colonia: 'Centro',
          inmueble_municipio: 'Quiroga',
          inmueble_estado: 'Michoacán',
          inmueble_cp: '61600',
          inmueble_superficie: '200.00',
          operacion_precio: '1500000',
          operacion_precio_letra: 'UN MILLÓN QUINIENTOS MIL PESOS',
          operacion_forma_pago: 'Transferencia bancaria'
        };

        return { datosExtraidos: datosPrueba };
      }
    );

    console.log(
      `   Datos extraídos: ${
        Object.keys(datosExtraidos.datosExtraidos).length
      } campos`
    );

    // ================================================================
    // PASO 3: Generar documento
    // ================================================================
    console.log('\n📝 PASO 3: Generar documento con IA...');

    const docGenerado = await registrarResultado(
      'Generar documento',
      async () => {
        const response = await fetch(`${API_BASE}/generar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipoCaso: 'compraventa_inmueble',
            datos: {
              ...datosExtraidos.datosExtraidos,
              notario_nombre: 'Lic. Roberto Gómez Sánchez',
              notario_numero: '157',
              notario_ciudad: 'Quiroga',
              notario_estado: 'Michoacán',
              fecha_dia: '28',
              fecha_mes: 'noviembre',
              fecha_ano: '2025',
              fecha_hora: '12:00',
              lindero_norte: '10.00 metros con propiedad de Terceros',
              lindero_sur: '10.00 metros con Calle Revolución',
              lindero_oriente: '20.00 metros con Lote 15',
              lindero_poniente: '20.00 metros con Lote 17',
              antecedente_escritura_numero: '5432',
              antecedente_escritura_fecha: '15 de marzo de 2010',
              antecedente_notario_nombre: 'Lic. Pedro López Martínez',
              antecedente_notario_numero: '25',
              registro_numero: '12345',
              registro_distrito: 'Pátzcuaro',
              registro_fecha: '20 de abril de 2010',
              inmueble_cuenta_predial: '001-234-567',
              inmueble_clave_catastral: '16-001-001-001-001'
            },
            modelo: 'claude'
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response.json();
      }
    );

    console.log(
      `   Documento generado: ${docGenerado.contenido?.length || 0} caracteres`
    );
    console.log(
      `   Tiempo de procesamiento: ${docGenerado.tiempoProcesamiento}ms`
    );

    // ================================================================
    // PASO 4: Guardar documento en BD (simulado)
    // ================================================================
    console.log('\n💾 PASO 4: Guardar documento...');

    // Nota: Esto normalmente lo haría el endpoint /api/casos/[id]/generar
    // Aquí simulamos que tenemos un documento guardado
    documentoId = 'doc-test-' + Date.now();
    console.log(`   Documento ID (simulado): ${documentoId}`);

    // ================================================================
    // RESUMEN
    // ================================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(60));

    let exitosos = 0;
    let fallidos = 0;
    let tiempoTotal = 0;

    resultados.forEach((r) => {
      const status = r.exito ? '✅' : '❌';
      const tiempo = r.tiempo ? ` (${r.tiempo}ms)` : '';
      console.log(`${status} ${r.paso}${tiempo}`);

      if (r.exito) exitosos++;
      else fallidos++;
      if (r.tiempo) tiempoTotal += r.tiempo;
    });

    console.log('\n' + '-'.repeat(60));
    console.log(`Total: ${exitosos} exitosos, ${fallidos} fallidos`);
    console.log(`Tiempo total: ${tiempoTotal}ms`);

    if (fallidos === 0) {
      console.log('\n🎉 ¡Todas las pruebas pasaron correctamente!\n');
    } else {
      console.log(
        '\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.\n'
      );
    }
  } catch (error) {
    console.error('\n💥 Error fatal durante las pruebas:', error);
  }
}

// Ejecutar pruebas
testFlujoCompleto();
