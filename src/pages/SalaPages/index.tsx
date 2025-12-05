import { useEffect, useState } from 'react';
import { SalaForm } from './SalaForm';
import { SalaTable } from './SalaTable';
import { getSalas, deleteSala } from '../../services/sala.service';
import type { Sala } from '../../models/sala.model';

export const SalaPage = () => {
    const [salas, setSalas] = useState<Sala[]>([]);
    const load = async () => setSalas(await getSalas());

    useEffect(() => { load(); }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4"><SalaForm onSuccess={load} /></div>
                <div className="col-md-8">
                    <h3>Salas Cadastradas</h3>
                    <SalaTable dados={salas} onDelete={async (id) => { await deleteSala(id); load(); }} />
                </div>
            </div>
        </div>
    );
};