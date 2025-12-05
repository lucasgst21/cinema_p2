import type { Filme } from '../../../models/filme.model';
import { Button } from '../../../components/Button';

interface Props {
    dados: Filme[];
    onDelete: (id: string) => void;
}

export const FilmeTable = ({ dados, onDelete }: Props) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Gênero</th>
                    <th>Duração</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((filme) => (
                    <tr key={filme.id}>
                        <td>{filme.titulo}</td>
                        <td>{filme.genero}</td>
                        <td>{filme.duracao} min</td>
                        <td>
                            <Button variant="danger" onClick={() => filme.id && onDelete(filme.id)}>
                                Excluir
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};