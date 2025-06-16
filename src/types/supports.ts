export interface Support {
  id: number;
  subject: string;
  description: string | null;
  priority: string;
  type: string;
  attachment: string | null;
  area_id: number | null;
  created_by: number;
  client_id: number;
  status: 'Pendiente' | 'Atendido' | 'Cerrado';
  reservation_time: string | null;
  attended_at: string | null;
  derived: string | null;
  cellphone: string | null;
  id_motivos_cita: number | null;
  id_tipo_cita: number | null;
  id_dia_espera: number | null;
  internal_state_id: number | null;
  external_state_id: number | null;
  type_id: number | null;
  created_at: string;
  updated_at: string;
  project_id: number;
  Manzana: string | null;
  Lote: string | null;

  // Relaciones
  area?: {
    id_area: number;
    descripcion: string;
  };

  creator?: {
    id: number;
    firstname: string;
    lastname: string;
    names: string;
  };

  client?: {
    id_cliente: number;
    Razon_Social: string;
    email: string | null; 
    telefono: string | null;
    direccion: string | null;
    dni: string | null;
  };

  motivo_cita?: {
    id_motivos_cita: number;
    nombre_motivo: string;
  };

  tipo_cita?: {
    id_tipo_cita: number;
    tipo: string;
  };

  dia_espera?: {
    id_dias_espera: number;
    dias: number;
  } | null;

  internal_state?: {
    id: number;
    description: string;
  };

  external_state?: {
    id: number;
    description: string;
  };

  support_type?: {
    id: number;
    description: string;
  };

  project?: {
    id_proyecto: number;
    descripcion: string;
  };
}
