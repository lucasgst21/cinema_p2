import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Sala } from '../../../models/sala.model';
import { salaSchema } from '../../../models/sala.model';
import { createSala } from '../../../services/sala.service';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export const SalaForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Sala>({
        resolver: zodResolver(salaSchema)
    });

    const onSubmit = async (data: Sala) => {
        await createSala(data);
        alert('Sala cadastrada!');
        reset();
        onSuccess();
    };

    return (
        <div className="card p-3 mb-4">
            <h4>Nova Sala</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input label="Número da Sala" type="number" {...register('numero', { valueAsNumber: true })} error={errors.numero?.message} />
                <Input label="Capacidade" type="number" {...register('capacidade', { valueAsNumber: true })} error={errors.capacidade?.message} />
                <Button type="submit" variant="success">Salvar Sala</Button>
            </form>
        </div>
    );
};