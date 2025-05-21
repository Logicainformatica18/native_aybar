export interface User {
  id: number;
  dni?: string;
  firstname?: string;
  lastname?: string;
  names: string;
  email: string;
  password?: string;
  sex?: 'M' | 'F' | '';
  datebirth?: string;        
  cellphone?: string;
  photo?: string;          
  role?: string;            
  created_at?: string;        
  updated_at?: string;      
}
