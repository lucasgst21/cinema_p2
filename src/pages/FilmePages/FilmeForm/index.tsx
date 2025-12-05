import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Filme } from '../../../models/filme.model';
import { filmeSchema } from '../../../models/filme.model';
import { createFilme } from '../../../services/filme.service';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

interface Props {
    onSuccess: () => void;
}

export const FilmeForm = ({ onSuccess }: Props) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Filme>({
        resolver: zodResolver(filmeSchema)
    });

    const onSubmit = async (data: Filme) => {
        try {
            await createFilme(data);
            alert('Filme salvo!');
            reset();
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card p-3 mb-4">
            <h4>Novo Filme</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input label="Título" {...register('titulo')} error={errors.titulo?.message} />
                <Input label="Sinopse" isTextarea {...register('sinopse')} error={errors.sinopse?.message} />

                <div className="row">
                    <div className="col-6">
                        <Input label="Duração" type="number" {...register('duracao', { valueAsNumber: true })} error={errors.duracao?.message} />
                    </div>
                    <div className="col-6">
                        <div className="mb-3">
                            <label className="form-label">Classificação</label>
                            <select className="form-select" {...register('classificacao')}>
                                <option value="">Selecione...</option>
                                <option value="18">18 anos</option>
                                <option value="L">Livre</option>
                            </select>
                            {errors.classificacao && <span className="text-danger small">{errors.classificacao.message}</span>}
                        </div>
                    </div>
                </div>

                <Input label="Gênero" {...register('genero')} error={errors.genero?.message} />

                <div className="row">
                    <div className="col-6"><Input label="Inicio" type="date" {...register('dataInicio')} /></div>
                    <div className="col-6"><Input label="Fim" type="date" {...register('dataFim')} /></div>
                </div>

                <Button type="submit">Cadastrar</Button>
            </form>
        </div>
    );
};