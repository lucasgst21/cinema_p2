import type { SessaoExpandida } from '../../../models/sessao.model';
import { Button } from '../../../components/Button';

interface Props {
    dados: SessaoExpandida[];
    onVendaClick: (s: SessaoExpandida) => void;
}

export const SessaoTable = ({ dados, onVendaClick }: Props) => (
    <table className="table table-hover align-middle">
        <thead>
            <tr>
                <th>Filme</th>
                <th>Sala</th>
                <th>Data/Hora</th>
                <th>Lugares</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {dados.map(sessao => {
                const capacidade = sessao.sala?.capacidade || 0;
                const vendidos = sessao.totalVendidos || 0;
                const isEsgotado = vendidos >= capacidade;
                const corBadge = isEsgotado ? 'bg-danger' : 'bg-success';

                return (
                    <tr key={sessao.id}>
                        <td className="fw-bold">{sessao.filme?.titulo}</td>
                        <td>Sala {sessao.sala?.numero}</td>
                        <td>{new Date(sessao.horario).toLocaleString()}</td>

                        <td>
                            <span className={`badge ${corBadge}`}>
                                {vendidos} / {capacidade}
                            </span>
                        </td>

                        <td>
                            {isEsgotado ? (
                                <button className="btn btn-danger btn-sm" disabled style={{ cursor: 'not-allowed' }}>
                                    <i className="bi bi-x-circle me-1"></i> Esgotado
                                </button>
                            ) : (
                                <Button
                                    variant="warning"
                                    className="btn-sm"
                                    onClick={() => onVendaClick(sessao)}
                                >
                                    <i className="bi bi-ticket-perforated me-1"></i> Vender
                                </Button>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
);