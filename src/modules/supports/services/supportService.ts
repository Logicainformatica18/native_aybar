import axios from '@/config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Support } from '@/types/supports';

async function getAuthHeaders(contentType = 'application/json') {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': contentType,
    Accept: 'application/json',
  };
}

// === Soportes ===

export async function fetchPaginatedSupports(page = 1) {
  const headers = await getAuthHeaders();
  const response = await axios.get(`/supports/fetch?page=${page}`, { headers });
  return response.data.supports;
}

export async function createSupport(formData: FormData): Promise<Support> {
  const headers = await getAuthHeaders('multipart/form-data');
  const response = await axios.post('/supports', formData, { headers });
  return response.data.support;
}

export async function updateSupport(id: number, formData: FormData): Promise<Support> {
  const headers = await getAuthHeaders('multipart/form-data');
  formData.append('_method', 'PUT');
  const response = await axios.post(`/supports/${id}`, formData, { headers });
  return response.data.support;
}

export async function deleteSupport(id: number) {
  const headers = await getAuthHeaders();
  await axios.delete(`/supports/${id}`, { headers });
}

// === Combos ===

interface Option {
  id: number;
  name: string;
}

export async function fetchAreas(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/areas', { headers });
  return res.data.map((a: any) => ({ id: a.id_area, name: a.descripcion }));
}

export async function fetchClients(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/clients', { headers });
  return res.data.map((c: any) => ({ id: c.id_cliente, name: c.Razon_Social }));
}

export async function fetchProjects(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/projects', { headers });
  return res.data.map((p: any) => ({ id: p.id_proyecto, name: p.descripcion }));
}

export async function fetchMotivosCita(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/motivos-cita', { headers });
  return res.data.map((m: any) => ({ id: m.id_motivos_cita, name: m.descripcion }));
}

export async function fetchTiposCita(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/tipos-cita', { headers });
  return res.data.map((t: any) => ({ id: t.id_tipo_cita, name: t.descripcion }));
}

export async function fetchDiasEspera(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/dias-espera', { headers });
  return res.data.map((d: any) => ({ id: d.id_dias_espera, name: d.descripcion }));
}

export async function fetchInternalStates(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/internal-states', { headers });
  return res.data.map((s: any) => ({ id: s.id, name: s.description }));
}

export async function fetchExternalStates(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/external-states', { headers });
  return res.data.map((s: any) => ({ id: s.id, name: s.description }));
}

export async function fetchTypes(): Promise<Option[]> {
  const headers = await getAuthHeaders();
  const res = await axios.get('/types', { headers });
  return res.data.map((t: any) => ({ id: t.id, name: t.name }));
}
