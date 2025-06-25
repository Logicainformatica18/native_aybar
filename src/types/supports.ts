export interface Support {
  id: number;
  client_id: number;
  created_by: number;
  cellphone: string | null;
  state: string | null;
  status_global: string;
  created_at: string;
  updated_at: string;

  // Relaciones
  client?: {
    id_cliente: number;
    Razon_Social: string;
    dni: string;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
  };

  creator?: {
    id: number;
    firstname: string;
    lastname: string;
    names: string;
  };

  // Nuevo campo: lista de detalles
  details: SupportDetail[];
}

export interface SupportDetail {
  id: number;
  support_id: number;
  subject: string;
  description: string | null;
  priority: string;
  type: string;
  status: 'Pendiente' | 'Atendido' | 'Cerrado';
  attachment: string | null;
  reservation_time: string | null;
  attended_at: string | null;
  derived: string | null;
  Manzana: string | null;
  Lote: string | null;

  project_id: number | null;
  area_id: number | null;
  id_motivos_cita: number | null;
  id_tipo_cita: number | null;
  id_dia_espera: number | null;
  internal_state_id: number | null;
  external_state_id: number | null;
  type_id: number | null;

  created_at: string;
  updated_at: string;

  // Relaciones opcionales
  project?: {
    id_proyecto: number;
    descripcion: string;
  };

  area?: {
    id_area: number;
    descripcion: string;
  };

  motivoCita?: {
    id_motivos_cita: number;
    nombre_motivo: string;
  };

  tipoCita?: {
    id_tipo_cita: number;
    tipo: string;
  };

  diaEspera?: {
    id_dias_espera: number;
    dias: number;
  };

  internalState?: {
    id: number;
    description: string;
  };

  externalState?: {
    id: number;
    description: string;
  };

  supportType?: {
    id: number;
    description: string;
  };

  type_?: {
    id: number;
    description: string;
  };
}
