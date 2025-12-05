import { api } from './api';
import type { Sessao } from '../models/sessao.model';

type Filme = { id: number | string; titulo?: string;[key: string]: unknown };
type Sala = { id: number | string; numero?: number; capacidade?: number;[key: string]: unknown };

export const getSessoesExpandidas = async () => {
    try {
        const [sessoesRes, filmesRes, salasRes, ingressosRes] = await Promise.all([
            api.get('/sessoes'),
            api.get('/filmes'),
            api.get('/salas'),
            api.get('/ingressos')
        ]);

        const sessoes = sessoesRes.data as Sessao[];
        const filmes: Filme[] = filmesRes.data;
        const salas: Sala[] = salasRes.data;
        const ingressos = ingressosRes.data;

        return sessoes.map((sessao: Sessao) => {
            const filme = filmes.find((f) => f.id == sessao.filmeId);
            const sala = salas.find((s) => s.id == sessao.salaId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const vendidos = ingressos.filter((ing: any) => ing.sessaoId == sessao.id).length;

            return {
                ...sessao,
                filme: filme || { titulo: 'Filme Desconhecido' },
                sala: sala || { numero: 0, capacidade: 0 },
                totalVendidos: vendidos
            };
        });
    } catch (error) {
        console.error("Erro ao buscar dados", error);
        return [];
    }
};

export const createSessao = async (sessao: Sessao) =>
    (await api.post('/sessoes', sessao)).data;

export const getIngressosPorSessao = async (sessaoId: string) => {
    const response = await api.get(`/ingressos?sessaoId=${sessaoId}`);
    return response.data;
};

export const venderIngresso = async (dados: { sessaoId: string; tipo: string; valor: number; assento: number }) =>
    (await api.post('/ingressos', dados)).data;