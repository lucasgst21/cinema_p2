import { useEffect, useState } from 'react';
import { FilmeForm } from './FilmeForm';
import { FilmeTable } from './FilmeTable';
import { getFilmes, deleteFilme } from '../../services/filme.service';
import type { Filme } from '../../models/filme.model';

export const FilmePage = () => {
    const [filmes, setFilmes] = useState<Filme[]>([]);

    const carregarDados = async () => {
        const dados = await getFilmes();
        setFilmes(dados);
    };

    const handleExcluir = async (id: string) => {
        if (confirm("Tem certeza?")) {
            await deleteFilme(id);
            carregarDados();
        }
    };

    useEffect(() => { carregarDados(); }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-5">
                    <FilmeForm onSuccess={carregarDados} />
                </div>
                <div className="col-md-7">
                    <h3>Lista de Filmes</h3>
                    <FilmeTable dados={filmes} onDelete={handleExcluir} />
                </div>
            </div>
        </div>
    );
};