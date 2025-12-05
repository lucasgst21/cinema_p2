import { useEffect, useState } from 'react';
import { SessaoForm } from './SessaoForm';
import { SessaoTable } from './SessaoTable';
import { getSessoesExpandidas, venderIngresso, getIngressosPorSessao } from '../../services/sessao.service';
import { getLanches } from '../../services/lanche.service';
import type { SessaoExpandida } from '../../models/sessao.model';
import type { Lanche } from '../../models/lanche.model';

export const SessaoPage = () => {
    const [sessoes, setSessoes] = useState<SessaoExpandida[]>([]);
    const [lanches, setLanches] = useState<Lanche[]>([]);
    const [sessaoVenda, setSessaoVenda] = useState<SessaoExpandida | null>(null);
    const [assentosOcupados, setAssentosOcupados] = useState<number[]>([]);
    const [assentosSelecionados, setAssentosSelecionados] = useState<number[]>([]);
    const [tiposPorAssento, setTiposPorAssento] = useState<{ [key: number]: 'INTEIRA' | 'MEIA' }>({});
    const [carrinhoLanches, setCarrinhoLanches] = useState<{ [key: string]: number }>({});

    const load = async () => {
        const raw = await getSessoesExpandidas();
        const normalized = (raw || []).map((d: any) => ({
            filme: {
                titulo: d.filme?.titulo || '',
                sinopse: d.filme?.sinopse || '',
                duracao: d.filme?.duracao || 0,
                classificacao: d.filme?.classificacao || '',
                genero: d.filme?.genero || '',
                dataInicio: d.filme?.dataInicio || '',
                dataFim: d.filme?.dataFim || '',
                id: d.filme?.id
            },
            sala: {
                numero: d.sala?.numero || 0,
                capacidade: d.sala?.capacidade || 0,
                id: d.sala?.id
            },
            totalVendidos: Number(d.totalVendidos) || 0,
            ...(d.filmeId ? { filmeId: d.filmeId } : {}),
            ...(d.salaId ? { salaId: d.salaId } : {}),
            ...(d.horario ? { horario: d.horario } : {}),
            ...(d.id ? { id: d.id } : {})
        })) as SessaoExpandida[];

        setSessoes(normalized);
        setLanches(await getLanches());
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        if (sessaoVenda) {
            carregarOcupados(sessaoVenda.id);
            setAssentosSelecionados([]);
            setTiposPorAssento({});
            setCarrinhoLanches({});
        }
    }, [sessaoVenda]);

    const carregarOcupados = async (sessaoId?: string) => {
        if (!sessaoId) return;
        const ingressos = await getIngressosPorSessao(sessaoId);
        const ocupados = (ingressos || []).map((ing: any) => ing.assento);
        setAssentosOcupados(ocupados);
    };

    const toggleAssento = (numero: number) => {
        if (assentosSelecionados.includes(numero)) {
            setAssentosSelecionados(prev => prev.filter(n => n !== numero));
            setTiposPorAssento(prev => {
                const novo = { ...prev };
                delete novo[numero];
                return novo;
            });
        } else {
            setAssentosSelecionados(prev => [...prev, numero]);
            setTiposPorAssento(prev => ({ ...prev, [numero]: 'INTEIRA' }));
        }
    };

    const trocarTipoAssento = (numero: number, tipo: 'INTEIRA' | 'MEIA') => {
        setTiposPorAssento(prev => ({ ...prev, [numero]: tipo }));
    };

    const atualizarLanche = (id: string, delta: number) => {
        setCarrinhoLanches(prev => {
            const qtdAtual = prev[id] || 0;
            const novaQtd = Math.max(0, qtdAtual + delta);
            return { ...prev, [id]: novaQtd };
        });
    };

    const handleVenda = async () => {
        if (!sessaoVenda || !sessaoVenda.id) return;
        if (assentosSelecionados.length === 0) {
            alert("Selecione pelo menos uma poltrona!");
            return;
        }

        try {
            const lanchesComprados = lanches
                .filter(l => (carrinhoLanches[l.id!] || 0) > 0)
                .map(l => ({
                    nome: l.nome,
                    qtd: carrinhoLanches[l.id!],
                    total: (carrinhoLanches[l.id!] * l.valorUnitario)
                }));

            const promessas = assentosSelecionados.map((assento, index) => {
                const tipo = tiposPorAssento[assento] || 'INTEIRA';
                const valorIngresso = tipo === 'INTEIRA' ? 30 : 15;

                const itensLancheParaEsteIngresso = index === 0 ? lanchesComprados : [];
                const valorLanches = itensLancheParaEsteIngresso.reduce((acc, curr) => acc + curr.total, 0);

                return venderIngresso({
                    sessaoId: sessaoVenda.id!,
                    tipo: tipo,
                    valor: valorIngresso + valorLanches,
                    assento: assento,
                    itensLanche: itensLancheParaEsteIngresso
                } as any);
            });

            await Promise.all(promessas);
            alert(`Venda realizada com Sucesso!`);
            setSessaoVenda(null);
            load();

        } catch (error) {
            console.error(error);
            alert("Erro ao realizar venda.");
        }
    };

    const totalLanches = lanches.reduce((acc, lanche) => {
        return acc + ((carrinhoLanches[lanche.id!] || 0) * lanche.valorUnitario);
    }, 0);

    const totalIngressos = assentosSelecionados.reduce((acc, assento) => {
        const tipo = tiposPorAssento[assento];
        return acc + (tipo === 'INTEIRA' ? 30 : 15);
    }, 0);

    const valorTotalGeral = totalIngressos + totalLanches;

    const renderizarMapaAssentos = () => {
        if (!sessaoVenda?.sala) return null;
        const capacidade = sessaoVenda.sala.capacidade || 0;
        const assentos = [];

        for (let i = 1; i <= capacidade; i++) {
            const isOcupado = assentosOcupados.includes(i);
            const isSelecionado = assentosSelecionados.includes(i);

            let corBtn = "btn-outline-success";
            if (isOcupado) corBtn = "btn-danger disabled";
            if (isSelecionado) corBtn = "btn-primary";

            assentos.push(
                <button
                    key={i}
                    className={`btn ${corBtn} m-1`}
                    style={{ width: '40px', height: '40px', fontSize: '12px', fontWeight: 'bold' }}
                    onClick={() => !isOcupado && toggleAssento(i)}
                    disabled={isOcupado}
                >
                    {i}
                </button>
            );
        }
        return <div className="d-flex flex-wrap justify-content-center bg-light p-2 rounded">{assentos}</div>;
    };

    return (
        <div className="container mt-4">
            <h3>Gestão de Sessões</h3>
            <div className="row">
                <div className="col-md-4"><SessaoForm onSuccess={load} /></div>
                <div className="col-md-8"><SessaoTable dados={sessoes} onVendaClick={setSessaoVenda} /></div>
            </div>

            {sessaoVenda && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">
                                    🍿 {sessaoVenda.filme?.titulo} - Sala {sessaoVenda.sala?.numero}
                                </h5>
                                <button className="btn-close btn-close-white" onClick={() => setSessaoVenda(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-5 border-end">
                                        <h6 className="text-center">1. Selecione os Assentos</h6>
                                        <div className="w-100 text-center mb-2 bg-secondary text-white rounded">TELA</div>
                                        {renderizarMapaAssentos()}
                                    </div>

                                    <div className="col-md-3 border-end">
                                        <h6 className="text-center">2. Tipo de Ingresso</h6>
                                        <div className="list-group overflow-auto" style={{ maxHeight: '300px' }}>
                                            {assentosSelecionados.length === 0 && <p className="text-center small text-muted mt-3">Nenhuma poltrona selecionada.</p>}

                                            {assentosSelecionados.sort((a, b) => a - b).map(assento => (
                                                <div key={assento} className="list-group-item p-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <strong>Poltrona {assento}</strong>
                                                        <span className="badge bg-secondary">
                                                            R$ {tiposPorAssento[assento] === 'INTEIRA' ? '30,00' : '15,00'}
                                                        </span>
                                                    </div>
                                                    <div className="btn-group w-100" role="group">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name={`tipo-${assento}`}
                                                            id={`inteira-${assento}`}
                                                            checked={tiposPorAssento[assento] === 'INTEIRA'}
                                                            onChange={() => trocarTipoAssento(assento, 'INTEIRA')}
                                                        />
                                                        <label className="btn btn-outline-primary btn-sm" htmlFor={`inteira-${assento}`}>Inteira</label>

                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name={`tipo-${assento}`}
                                                            id={`meia-${assento}`}
                                                            checked={tiposPorAssento[assento] === 'MEIA'}
                                                            onChange={() => trocarTipoAssento(assento, 'MEIA')}
                                                        />
                                                        <label className="btn btn-outline-primary btn-sm" htmlFor={`meia-${assento}`}>Meia</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <h6 className="text-center">3. Lanches (Opcional)</h6>
                                        <div className="list-group overflow-auto" style={{ maxHeight: '300px' }}>
                                            {lanches.map(lanche => (
                                                <div key={lanche.id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                                                    <div style={{ lineHeight: '1.2' }}>
                                                        <strong>{lanche.nome}</strong>
                                                        <br /><small className="text-muted">R$ {lanche.valorUnitario.toFixed(2)}</small>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <button className="btn btn-sm btn-outline-danger py-0" onClick={() => atualizarLanche(lanche.id!, -1)}>-</button>
                                                        <span className="fw-bold">{carrinhoLanches[lanche.id!] || 0}</span>
                                                        <button className="btn btn-sm btn-outline-success py-0" onClick={() => atualizarLanche(lanche.id!, 1)}>+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer justify-content-center bg-light">
                                <div className="text-end me-4">
                                    <div className="small text-muted">Ingressos: R$ {totalIngressos.toFixed(2)}</div>
                                    <div className="small text-muted">Lanches: R$ {totalLanches.toFixed(2)}</div>
                                    <h4 className="fw-bold text-success">Total: R$ {valorTotalGeral.toFixed(2)}</h4>
                                </div>
                                <button
                                    className="btn btn-success btn-lg px-5"
                                    disabled={assentosSelecionados.length === 0}
                                    onClick={handleVenda}
                                >
                                    <i className="bi bi-cart-check me-2"></i>
                                    Finalizar Compra
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};