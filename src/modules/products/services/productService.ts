import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product';

async function getAuthHeaders(contentType = 'application/json') {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': contentType,
    Accept: 'application/json',
  };
}

interface PaginatedResponse {
  data: Product[];
  current_page: number;
  last_page: number;
}

export async function fetchPaginatedProducts(page = 1): Promise<PaginatedResponse> {
  const headers = await getAuthHeaders();
  const response = await axios.get(`/products/fetch?page=${page}`, { headers });
  return response.data; // Asegúrate que la API devuelva { data, current_page, last_page }
}

export async function createProduct(formData: FormData): Promise<Product> {
  const headers = await getAuthHeaders('multipart/form-data');
  const response = await axios.post('/products', formData, { headers });
  return response.data.product;
}

export async function updateProduct(id: number, formData: FormData): Promise<Product> {
  const headers = await getAuthHeaders('multipart/form-data');
  formData.append('_method', 'PUT');
  const response = await axios.post(`/products/${id}`, formData, { headers });
  return response.data.product;
}

export async function deleteProduct(id: number) {
  const headers = await getAuthHeaders();
  await axios.delete(`/products/${id}`, { headers });
}
