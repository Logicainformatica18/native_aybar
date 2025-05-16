import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email: string, password: string) {
  const response = await axios.post('/login', { email, password });

  const { token, user } = response.data;

  // Guarda token en AsyncStorage
  await AsyncStorage.setItem('authToken', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));

  return user;
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

export async function getCurrentUser() {
  const token = await AsyncStorage.getItem('authToken');

  if (!token) throw new Error('No hay token');

  const response = await axios.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
