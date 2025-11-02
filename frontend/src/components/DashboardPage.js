import apiUrl from '../lib/api'; // ✅ CAMINHO CORRIGIDO
import React, { useState, useEffect } from 'react';
import Vaga from './Vaga';
import { useAuth } from '../App';

function DashboardPage() {
    const [vagas, setVagas] = useState([]);
    const { usuarioLogado } = useAuth();
    const MEU_RA = usuarioLogado ? usuarioLogado.ra : null;

    const buscarVagas = () => {
        // ✅ CORRIGIDO: usa a variável apiUrl
        fetch(`${apiUrl}/api/vagas`)
            .then(res => res.json())
            .then(data => setVagas(data))
            .catch(error => console.error("Erro ao buscar vagas:", error));
    };

    useEffect(() => {
        buscarVagas();
        const interval = setInterval(buscarVagas, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleVagaClick = (vagaClicada) => {
        if (!MEU_RA) return;

        let url = '';
        let acao = '';

        if (vagaClicada.ocupada && vagaClicada.ocupadaPorRA === MEU_RA) {
            // ✅ CORRIGIDO: usa a variável apiUrl
            url = `${apiUrl}/api/vagas/${vagaClicada.id}/liberar`;
            acao = 'Liberando';
        } else if (!vagaClicada.ocupada) {
            // ✅ CORRIGIDO: usa a variável apiUrl
            url = `${apiUrl}/api/vagas/${vagaClicada.id}/ocupar`;
            acao = 'Ocupando';
        } else {
            return;
        }

        console.log(`Frontend: ${acao} vaga ID: ${vagaClicada.id}`);
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ raDoUsuario: MEU_RA }),
        })
        .then(res => {
            if (!res.ok) alert("Ação não permitida ou vaga indisponível.");
            return res.json();
        })
        .then(() => {
            console.log(`Frontend: Ação ${acao} concluída, atualizando lista...`);
            buscarVagas();
        })
        .catch(error => console.error(`Erro ao ${acao} vaga:`, error));
    };

    return (
        <div className="mapa-container">
            <h2>Mapa do Estacionamento (Usuário: {MEU_RA})</h2>
            <div className="mapa-grid">
                {vagas.map(vaga => (
                    <Vaga
                        key={vaga.id}
                        numero={vaga.numero_vaga}
                        estaOcupada={vaga.ocupada}
                        ocupadaPorMim={vaga.ocupadaPorRA === MEU_RA}
                        onClick={() => handleVagaClick(vaga)}
                    />
                ))}
            </div>
        </div>
    );
}
export default DashboardPage;
// A linha 'fetch' extra no final foi removida.