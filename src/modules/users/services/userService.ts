// import api from '../../../config/axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { User } from '../types';

// // Helper para obtener headers con token
// async function getAuthHeaders() {
//   const token = await AsyncStorage.getItem('authToken');
//   return {
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'multipart/form-data',
//   };
// }

// export async function getUsers(): Promise<User[]> {
//   const headers = await getAuthHeaders();
//   const response = await api.get('/users', { headers });
//   return response.data.users.data; // si estás usando paginación
// }

// export async function createUser(formData: FormData): Promise<User> {
//   const headers = await getAuthHeaders();
//   const response = await api.post('/users', formData, { headers });
//   return response.data.user;
// }

// export async function updateUser(id: number, formData: FormData): Promise<User> {
//   const token = await AsyncStorage.getItem('authToken');
//   const response = await api.post(`/users/${id}?_method=PUT`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data.user;
// }
