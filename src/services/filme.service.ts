import { api } from './api';
import type { Filme } from '../models/filme.model.ts';

export const getFilmes = async () => {
    const response = await api.get<Filme[]>('/filmes');
    return response.data;
};

export const createFilme = async (filme: Filme) => {
    const response = await api.post('/filmes', filme);
    return response.data;
};

export const deleteFilme = async (id: string) => {
    await api.delete(`/filmes/${id}`);
};