import type { Sala } from '../../../models/sala.model';
import { Button } from '../../../components/Button';

interface Props { dados: Sala[]; onDelete: (id: string) => void; }

export const SalaTable = ({ dados, onDelete }: Props) => (
    <table className="table table-bordered">
        <thead><tr><th>Número</th><th>Capacidade</th><th>Ações</th></tr></thead>
        <tbody>
            {dados.map(sala => (
                <tr key={sala.id}>
                    <td>Sala {sala.numero}</td>
                    <td>{sala.capacidade} pessoas</td>
                    <td><Button variant="danger" onClick={() => sala.id && onDelete(sala.id)}>Excluir</Button></td>
                </tr>
            ))}
        </tbody>
    </table>
);