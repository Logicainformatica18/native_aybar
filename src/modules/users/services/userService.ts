import api from '../../../config/axios';
import { User } from '../types';

export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data.users.data; // si usas paginación
}

export async function createUser(data: Partial<User>): Promise<User> {
  const response = await api.post('/users', data);
  return response.data.user;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const response = await api.put(`/users/${id}`, data);
  return response.data.user;
}
