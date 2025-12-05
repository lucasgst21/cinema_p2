import { z } from 'zod';

export const filmeSchema = z.object({
    titulo: z.string().min(1, "O título é obrigatório."),
    sinopse: z.string().min(10, "A sinopse deve ter pelo menos 10 caracteres."),
    duracao: z.number({ error: "Informe um número." }).positive("A duração deve ser maior que 0."),
    classificacao: z.string().min(1, "Selecione a classificação."),
    genero: z.string().min(1, "Selecione o gênero."),
    dataInicio: z.string().min(1, "Data inicial obrigatória"),
    dataFim: z.string().min(1, "Data final obrigatória"),
});

export type Filme = z.infer<typeof filmeSchema> & { id: string };

export const salaSchema = z.object({
    numero: z.number({ error: "Deve ser um número." }).positive("Número deve ser positivo."),
    capacidade: z.number({ error: "Deve ser um número." }).positive("Capacidade deve ser positiva.")
});

export type Sala = z.infer<typeof salaSchema> & { id: string };

export const sessaoSchema = z.object({
    filmeId: z.string().min(1, "Selecione um filme."),
    salaId: z.string().min(1, "Selecione uma sala."),
    horario: z.string().refine((val) => new Date(val) >= new Date(), {
        message: "A data da sessão não pode ser no passado."
    })
});

export type Sessao = z.infer<typeof sessaoSchema> & { id: string };

export type SessaoExpandida = Sessao & {
    filme: Filme;
    sala: Sala;
};