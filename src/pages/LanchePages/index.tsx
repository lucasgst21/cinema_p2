import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Lanche } from '../../models/lanche.model';
import { lancheSchema } from '../../models/lanche.model';
import { getLanches, createLanche, deleteLanche } from '../../services/lanche.service';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const LanchePage = () => {
    const [lanches, setLanches] = useState<Lanche[]>([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Lanche>({
        resolver: zodResolver(lancheSchema)
    });

    const load = async () => setLanches(await getLanches());
    useEffect(() => { load(); }, []);

    const onSubmit = async (data: Lanche) => {
        await createLanche(data);
        alert("Lanche cadastrado!");
        reset();
        load();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Excluir lanche?")) {
            await deleteLanche(id);
            load();
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Novo Combo/Lanche</h4>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input label="Nome" {...register('nome')} error={errors.nome?.message} />
                            <Input label="Descrição" {...register('descricao')} error={errors.descricao?.message} />
                            <Input label="Preço (R$)" type="number" step="0.01" {...register('valorUnitario', { valueAsNumber: true })} error={errors.valorUnitario?.message} />
                            <Button type="submit">Cadastrar</Button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <h3>Cardápio CineWeb</h3>
                    <table className="table table-striped">
                        <thead><tr><th>Nome</th><th>Descrição</th><th>Preço</th><th>Ações</th></tr></thead>
                        <tbody>
                            {lanches.map(l => (
                                <tr key={l.id}>
                                    <td>{l.nome}</td>
                                    <td>{l.descricao}</td>
                                    <td>R$ {l.valorUnitario.toFixed(2)}</td>
                                    <td>
                                        <Button variant="danger" className="btn-sm" onClick={() => l.id && handleDelete(l.id)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};