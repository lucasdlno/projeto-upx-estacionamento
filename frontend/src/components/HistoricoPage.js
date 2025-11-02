import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

function HistoricoPage() {
    const [historico, setHistorico] = useState([]);
    const { usuarioLogado } = useAuth();

    useEffect(() => {
        if (usuarioLogado) {
            fetch(`http://localhost:3001/api/vagas/historico/${usuarioLogado.ra}`)
                .then(res => res.json())
                .then(data => setHistorico(data.reverse())); // .reverse() para mostrar os mais novos primeiro
        }
    }, [usuarioLogado]);

    return (
        <div className="mapa-container">
            <h2>Seu Histórico de Estacionamento</h2>
            <ul className="historico-lista">
                {historico.length === 0 && <p>Nenhum histórico encontrado.</p>}
                {historico.map(item => (
                    <li key={item.id}>
                        <strong>Vaga {item.numero_vaga}</strong> <br />
                        <strong>Entrada:</strong> {new Date(item.data_chegada).toLocaleString('pt-BR')} <br />
                        <strong>Saída:</strong> {new Date(item.data_saida).toLocaleString('pt-BR')}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default HistoricoPage;