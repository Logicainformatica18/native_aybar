export interface Client {
  id: number;
  dni: string;
  cellphone: string;
  email: string;
  address: string;
  Razon_Social?: string;
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
  Lote?: string;
  attachment?: string;

  project_id?: number | null;
  area_id?: number | null;
  id_motivos_cita?: number | null;
  id_tipo_cita?: number | null;
  id_dia_espera?: number | null;
  internal_state_id?: number | null;
  external_state_id?: number | null;
  type_id?: number | null;

  // Relaciones (opcional, si las necesitas para mostrar)
  project?: { descripcion: string };
  area?: { descripcion: string };
  motivoCita?: { nombre_motivo: string };
  tipoCita?: { tipo: string };
  diaEspera?: { dias: string };
  internalState?: { description: string };
  externalState?: { description: string };
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

  // Relaciones
  client?: Client;
  creator?: { id: number; firstname: string; lastname: string; names: string; email?: string };

  details?: SupportDetail[];
}

export interface SupportFormData {
  id?: number;

  // Datos generales (de supports)
  client_id: number | null;
  cellphone: string;
  status_global?: string;
  dni: string;
  email: string;
  address: string;

  // Datos del detalle (support_details)
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  reservation_time?: string;
  attended_at?: string;
  derived?: string;
  Manzana?: string;
  Lote?: string;

  project_id?: number | null;
  area_id?: number | null;
  id_motivos_cita?: number | null;
  id_tipo_cita?: number | null;
  id_dia_espera?: number | null;
  internal_state_id?: number | null;
  external_state_id?: number | null;
  type_id?: number | null;
}
