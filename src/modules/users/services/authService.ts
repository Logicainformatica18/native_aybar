import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
 import { User } from '../types';
// Helper para agregar token a headers
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };
}

export async function getUsers(): Promise<User[]> {
  const headers = await getAuthHeaders();
  const response = await axios.get('/users', { headers });
  return response.data.users.data; // si estás usando paginación
}

export async function createUser(formData: FormData) {
  const headers = await getAuthHeaders();
  const response = await axios.post('/users', formData, { headers });
  return response.data.user;
}

export async function updateUser(id: number, formData: FormData): Promise<User> {
  const token = await AsyncStorage.getItem('authToken');
  const response = await axios.post(`/users/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user;
}


export async function deleteUser(id: number) {
  const headers = await getAuthHeaders();
  await axios.delete(`/users/${id}`, { headers });
}
export async function logout() {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) return;

  await axios.post('/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
}
