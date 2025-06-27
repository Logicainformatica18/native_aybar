export interface SupportFormData {
  id?: number; // Solo si estás editando
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  reservation_time: string;
  attended_at: string;
  derived: string;
  cellphone: string;
  Manzana: string;
  Lote: string;
  client_id: number | null;
  dni: string;
  email: string;
  address: string;
  project_id?: number | null;
  area_id?: number | null;
  id_motivos_cita?: number | null;
  id_tipo_cita?: number | null;
  id_dia_espera?: number | null;
  internal_state_id?: number | null;
  external_state_id?: number | null;
  type_id?: number | null;

  client?: {
    dni: string;
    email: string;
    direccion: string;
  };
}
