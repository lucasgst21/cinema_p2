import { z } from 'zod';

export const salaSchema = z.object({
    id: z.string().optional(),
    numero: z.number({ message: "Deve ser número" }).positive("Número inválido"),
    capacidade: z.number({ message: "Deve ser número" }).positive("Capacidade deve ser maior que 0")
});

export type Sala = z.infer<typeof salaSchema>;