import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transfer } from '@/types/transfer';

async function getAuthHeaders(contentType = 'application/json') {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': contentType,
    Accept: 'application/json',
  };
}

export async function fetchPaginatedTransfers(page = 1) {
  const headers = await getAuthHeaders();
  const response = await axios.get(`/transfers/fetch?page=${page}`, { headers });
  return response.data.transfers;
}

export async function createTransfer(formData: FormData): Promise<Transfer> {
  const headers = await getAuthHeaders('multipart/form-data');
  const response = await axios.post('/transfers', formData, { headers });
  return response.data.transfer;
}

export async function updateTransfer(id: number, formData: FormData): Promise<Transfer> {
  const headers = await getAuthHeaders('multipart/form-data');
  formData.append('_method', 'PUT');
  const response = await axios.post(`/transfers/${id}`, formData, { headers });
  return response.data.transfer;
}

export async function deleteTransfer(id: number) {
  const headers = await getAuthHeaders();
  await axios.delete(`/transfers/${id}`, { headers });
}
