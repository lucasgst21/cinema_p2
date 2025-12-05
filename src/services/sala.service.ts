import { api } from './api';
import type { Sala } from '../models/sala.model';

export const getSalas = async () => (await api.get<Sala[]>('/salas')).data;
export const createSala = async (sala: Sala) => (await api.post('/salas', sala)).data;
export const deleteSala = async (id: string) => await api.delete(`/salas/${id}`);