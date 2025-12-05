import { z } from 'zod';
import type { Filme } from './filme.model';
import type { Sala } from './sala.model';

export const sessaoSchema = z.object({
    id: z.string().optional(),
    filmeId: z.string().min(1, "Selecione o Filme"),
    salaId: z.string().min(1, "Selecione a Sala"),
    horario: z.string().refine(val => new Date(val) >= new Date(), "Data retroativa inválida")
});

export type Sessao = z.infer<typeof sessaoSchema>;

export type SessaoExpandida = Sessao & {
    filme: Filme;
    sala: Sala;
    totalVendidos: number;
};