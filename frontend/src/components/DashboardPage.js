import apiUrl from '@/lib/api';
import React, { useState, useEffect } from 'react';
import Vaga from './Vaga';
import { useAuth } from '../App'; // Importa o hook de autenticação

function DashboardPage() {
    const [vagas, setVagas] = useState([]);
    const { usuarioLogado } = useAuth(); // Pega o usuário que está logado
    const MEU_RA = usuarioLogado ? usuarioLogado.ra : null;

    const buscarVagas = () => {
        fetch('http://localhost:3001/api/vagas')
            .then(res => res.json())
            .then(data => setVagas(data))
            .catch(error => console.error("Erro ao buscar vagas:", error));
    };

    useEffect(() => {
        buscarVagas();
        // Opcional: Atualiza o mapa a cada 10 segundos
        const interval = setInterval(buscarVagas, 10000);
        return () => clearInterval(interval); // Limpa o intervalo ao sair
    }, []);

    const handleVagaClick = (vagaClicada) => {
        if (!MEU_RA) return; // Não faz nada se não estiver logado

        let url = '';
        let acao = '';

        if (vagaClicada.ocupada && vagaClicada.ocupadaPorRA === MEU_RA) {
            url = `http://localhost:3001/api/vagas/${vagaClicada.id}/liberar`;
            acao = 'Liberando';
        } else if (!vagaClicada.ocupada) {
            url = `http://localhost:3001/api/vagas/${vagaClicada.id}/ocupar`;
            acao = 'Ocupando';
        } else {
            return; // Vaga de outro usuário, não faz nada
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
fetch(`${apiUrl}/api/vagas`)