export interface Sale {
  id: number;
  id_cliente: number;
  project_id: number;
  mz_lote: string;
  project: {
    id_proyecto: number;
    descripcion: string;
  };
}

export interface Client {
  id: number;
  dni: string;
  names: string;
  cellphone: string;
  email: string;
  address: string;
  sales: Sale[];
}

export interface SupportDetail {
  id?: number;
  support_id?: number;
  subject: string;
  description?: string;
  priority: string;
  type: string;
  status: string;
  reservation_time?: string;
  attended_at?: string;
  derived?: string;
  Manzana?: string;
  comment?: string;
  attachment?: string;

  // Nuevos campos añadidos
  ticket?: string; // TK-00001
  ticketTr?: string; // TR-00001 (opcional, como string si lo necesitas)
  channel?: string; // Canal de atención (whatsapp, call_center, etc.)
  last_comment?: {
    internal_state?: {
      description: string;
    };
  };

  // Relaciones
  project_id?: number | null;
  area_id?: number | null;
  id_motivos_cita?: number | null;
  id_tipo_cita?: number | null;
  id_dia_espera?: number | null;
  internal_state_id?: number | null;
  external_state_id?: number | null;
  type_id?: number | null;

  project?: { descripcion: string };
  area?: { descripcion: string };
  motivoCita?: { nombre_motivo: string };
  tipoCita?: { tipo: string };
  diaEspera?: { dias: string };
 internal_state?: { description: string };
external_state?: { description: string };
  supportType?: { description: string };
}

export interface Support {
  id: number;
  client_id: number;
  created_by?: number;
  cellphone: string;
  state?: string;
  status_global?: string;
  created_at?: string;
  updated_at?: string;

  client?: Client;
  creator?: { id: number; firstname: string; lastname: string; names: string; email?: string };
  details?: SupportDetail[];
}

export interface SupportFormData {
  id?: number;

  // Datos generales
  client_id: number | null;
  cellphone: string;
  status_global?: string;
  dni: string;
  email: string;
  address: string;

  // Datos del detalle
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  reservation_time?: string;
  attended_at?: string;
  derived?: string;
  Manzana?: string;
  comment?: string;
  channel?: string; // Canal (agregado)

  project_id?: number | null;
  area_id?: number | null;
  id_motivos_cita?: number | null;
  id_tipo_cita?: number | null;
  id_dia_espera?: number | null;
  internal_state_id?: number | null;
  external_state_id?: number | null;
  type_id?: number | null;
}
