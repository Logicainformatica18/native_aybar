import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/types/article';

async function getAuthHeaders(contentType = 'application/json') {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': contentType,
    Accept: 'application/json',
  };
}

interface PaginatedArticleResponse {
  data: Article[];
  current_page: number;
  last_page: number;
}

// ✅ Corrección: usa la ruta existente en backend: /articles/fetch
export async function fetchArticlesByTransfer(transferId: number, page = 1): Promise<PaginatedArticleResponse> {
  const headers = await getAuthHeaders();
  const response = await axios.get(`/articles/fetch?transfer_id=${transferId}&page=${page}`, { headers });
  return response.data;
}

export async function createArticle(formData: FormData): Promise<Article> {
  const headers = await getAuthHeaders('multipart/form-data');
  const response = await axios.post('/articles', formData, { headers });
  return response.data.article;
}

export async function updateArticle(id: number, formData: FormData): Promise<Article> {
  const headers = await getAuthHeaders('multipart/form-data');
  formData.append('_method', 'PUT');
  const response = await axios.post(`/articles/${id}`, formData, { headers });
  return response.data.article;
}

export async function deleteArticle(id: number) {
  const headers = await getAuthHeaders();
  await axios.delete(`/articles/${id}`, { headers });
}
