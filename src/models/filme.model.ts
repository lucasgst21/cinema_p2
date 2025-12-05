import { z } from 'zod';

export const filmeSchema = z.object({
    id: z.string().optional(),
    titulo: z.string().min(1, "Título é obrigatório"),
    sinopse: z.string().min(10, "Mínimo 10 caracteres"),
    duracao: z.number({ message: "Numérico" }).positive("Maior que 0"),
    classificacao: z.string().min(1, "Selecione a classificação"),
    genero: z.string().min(1, "Gênero obrigatório"),
    dataInicio: z.string(),
    dataFim: z.string()
});

export type Filme = z.infer<typeof filmeSchema>;