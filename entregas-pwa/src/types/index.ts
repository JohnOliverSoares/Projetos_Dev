export type UserRole = 'admin' | 'vendedor' | 'entregador';

export type DeliveryStatus = 'AGENDADO' | 'FINALIZADO' | 'CANCELADO';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
}

export interface Delivery {
  id: string;
  date: string;
  time: string;
  location: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  status: DeliveryStatus;
  assigned_to: string;
  created_by: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
  assigned_profile?: {
    id: string;
    name: string;
  } | null;
}
