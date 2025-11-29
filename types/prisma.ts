// types/prisma.ts
// Tipos manuales basados en el schema de Prisma
// Estos se usan mientras el cliente de Prisma no puede generarse

export type Role = 'ABOGADO' | 'ADMIN';

export type CasoStatus =
  | 'TRANSCRIBIENDO'
  | 'CLASIFICANDO'
  | 'EXTRAYENDO_INFO'
  | 'REQUIERE_INFO'
  | 'GENERANDO_DOCUMENTO'
  | 'EN_REVISION'
  | 'COMPLETADO'
  | 'ERROR';

export type DocumentoStatus =
  | 'BORRADOR'
  | 'EN_REVISION'
  | 'APROBADO'
  | 'IMPRESO';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Caso {
  id: string;
  userId: string;
  audioKey: string | null;
  transcription: string | null;
  documentType: string | null;
  aiModel: string | null;
  status: CasoStatus;
  extractedData: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Documento {
  id: string;
  casoId: string;
  tipo: string;
  plantillaId: string | null;
  contenido: string;
  status: DocumentoStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plantilla {
  id: string;
  nombre: string;
  tipo: string;
  contenido: string;
  campos: Record<string, unknown>;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}
