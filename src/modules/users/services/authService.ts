import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'src/types/user';

// Helper para agregar token a headers
async function getAuthHeaders(contentType = 'application/json') {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': contentType,
    Accept: 'application/json',
  };
}
export async function login(email: string, password: string) {
  const response = await axios.post('/login', { email, password });
  return response.data;
}

export async function getUsers(): Promise<User[]> {
  const headers = await getAuthHeaders();
  const response = await axios.get('/users', { headers });

  // Prevención por si no viene paginado
  return response.data.users?.data ?? response.data.users ?? [];
}

export async function createUser(formData: FormData): Promise<User> {
  const headers = await getAuthHeaders('multipart/form-data');
  const response = await axios.post('/users', formData, { headers });
  return response.data.user;
}

export async function updateUser(id: number, formData: FormData): Promise<User> {
  const headers = await getAuthHeaders('multipart/form-data');

  // Simula PUT porque FormData no puede usarse con axios.put
  formData.append('_method', 'PUT');

  const response = await axios.post(`/users/${id}`, formData, { headers });
  return response.data.user;
}

export async function deleteUser(id: number) {
  const headers = await getAuthHeaders();
  await axios.delete(`/users/${id}`, { headers });
}

export async function logout() {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) return;

  try {
    await axios.post('/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.warn('⚠️ Error cerrando sesión:', err);
  }

  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
}
 
export async function fetchPaginatedUsers(page = 1) {
  const headers = await getAuthHeaders();
  const response = await axios.get(`/users/fetch?page=${page}`, { headers });
  return response.data.users; // debe contener: data, current_page, last_page
}
