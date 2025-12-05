import { api } from './api';
import type { Lanche } from '../models/lanche.model.ts';

export const getLanches = async () => (await api.get<Lanche[]>('/lanches')).data;
export const createLanche = async (lanche: Lanche) => (await api.post('/lanches', lanche)).data;
export const deleteLanche = async (id: string) => await api.delete(`/lanches/${id}`);