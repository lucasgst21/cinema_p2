import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Sessao } from '../../../models/sessao.model';
import { sessaoSchema } from '../../../models/sessao.model';
import { createSessao } from '../../../services/sessao.service';
import { getFilmes } from '../../../services/filme.service';
import { getSalas } from '../../../services/sala.service';
import type { Filme } from '../../../models/filme.model';
import type { Sala } from '../../../models/sala.model';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export const SessaoForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<Sessao>({
        resolver: zodResolver(sessaoSchema)
    });

    useEffect(() => {
        getFilmes().then(setFilmes);
        getSalas().then(setSalas);
    }, []);

    const onSubmit = async (data: Sessao) => {
        await createSessao(data);
        alert('Sessão Agendada!');
        reset();
        onSuccess();
    };

    return (
        <div className="card p-3 mb-4">
            <h4>Agendar Sessão</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="form-label">Filme</label>
                    <select className="form-select" {...register('filmeId')}>
                        <option value="">Selecione...</option>
                        {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
                    </select>
                    {errors.filmeId && <span className="text-danger small">{errors.filmeId.message}</span>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Sala</label>
                    <select className="form-select" {...register('salaId')}>
                        <option value="">Selecione...</option>
                        {salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero}</option>)}
                    </select>
                    {errors.salaId && <span className="text-danger small">{errors.salaId.message}</span>}
                </div>

                <Input label="Horário" type="datetime-local" {...register('horario')} error={errors.horario?.message} />
                <Button type="submit">Agendar</Button>
            </form>
        </div>
    );
};