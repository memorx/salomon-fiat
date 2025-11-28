// lib/templates/index.ts

export {
  PLANTILLA_COMPRAVENTA_INMUEBLE,
  procesarPlantilla,
  validarDatosPlantilla,
  numeroATexto,
  formatearPrecioLegal
} from './compraventa-inmueble';

// Mapa de plantillas por tipo de caso
export const PLANTILLAS: Record<string, string> = {
  compraventa_inmueble: 'PLANTILLA_COMPRAVENTA_INMUEBLE'
};

// Obtener plantilla por tipo de caso
export async function obtenerPlantilla(
  tipoCaso: string
): Promise<string | null> {
  switch (tipoCaso) {
    case 'compraventa_inmueble':
      const { PLANTILLA_COMPRAVENTA_INMUEBLE } = await import(
        './compraventa-inmueble'
      );
      return PLANTILLA_COMPRAVENTA_INMUEBLE;
    default:
      return null;
  }
}
