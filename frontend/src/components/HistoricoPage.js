import React, { useState, useEffect } from 'react';

function HistoricoPage({ usuario }) {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        if (usuario) {
            fetch(`http://localhost:3001/api/vagas/historico/${usuario.ra}`)
                .then(res => res.json())
                .then(data => setHistorico(data));
        }
    }, [usuario]);

    return (
        <div>
            <h2>Seu Histórico de Estacionamento</h2>
            <ul>
                {historico.map(item => (
                    <li key={item.id}>
                        Vaga {item.numero_vaga} | 
                        Entrada: {new Date(item.data_chegada).toLocaleString('pt-BR')} | 
                        Saída: {new Date(item.data_saida).toLocaleString('pt-BR')}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default HistoricoPage;