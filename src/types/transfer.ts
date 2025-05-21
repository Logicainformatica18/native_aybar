export interface Transfer {
  id: number;
  description?: string;
  details?: string;
  sender_firstname?: string;
  sender_lastname?: string;
  sender_email?: string;
  receiver_firstname?: string;
  receiver_lastname?: string;
  receiver_email?: string;
  file_1?: string;
  confirmation_token?: string;
  confirmed_at?: string;
  received_at?: string;
  created_at?: string;
  updated_at?: string;
}
