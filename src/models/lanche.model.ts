import { z } from 'zod';

export const lancheSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().min(5, "Descrição curta obrigatória"),
    valorUnitario: z.number({ message: "Deve ser número" }).positive("Valor deve ser positivo"),
    qtUnidade: z.number().int().positive("Qtd deve ser positiva").optional()
});

export type Lanche = z.infer<typeof lancheSchema>;