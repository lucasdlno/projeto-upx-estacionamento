import React, { useState, useEffect } from 'react';
import Vaga from './Vaga';

const MEU_RA = "987654"; 

function DashboardPage() {
    const [vagas, setVagas] = useState([]);

    const buscarVagas = () => {
        fetch('http://localhost:3001/api/vagas')
            .then(res => res.json())
            .then(data => setVagas(data))
            .catch(error => console.error("Erro ao buscar vagas:", error));
    };

    useEffect(() => {
        buscarVagas();
    }, []);

    // ✅ --- FUNÇÃO DE CLIQUE ATUALIZADA ---
    const handleVagaClick = (vagaClicada) => {
        // Se a vaga está ocupada por mim, eu quero liberá-la
        if (vagaClicada.ocupada && vagaClicada.ocupadaPorRA === MEU_RA) {
            console.log(`Frontend: Tentando liberar a vaga ID: ${vagaClicada.id}`);
            fetch(`http://localhost:3001/api/vagas/${vagaClicada.id}/liberar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ raDoUsuario: MEU_RA }),
            })
            .then(res => res.json())
            .then(() => {
                console.log("Frontend: Vaga liberada, atualizando a lista...");
                buscarVagas();
            })
            .catch(error => console.error("Erro ao liberar vaga:", error));
        } 
        // Se a vaga está livre, eu quero ocupá-la
        else if (!vagaClicada.ocupada) {
            console.log(`Frontend: Tentando ocupar a vaga ID: ${vagaClicada.id}`);
            fetch(`http://localhost:3001/api/vagas/${vagaClicada.id}/ocupar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ raDoUsuario: MEU_RA }),
            })
            .then(res => {
                if (!res.ok) alert("Esta vaga não está mais disponível!");
                return res.json();
            })
            .then(() => {
                console.log("Frontend: Vaga ocupada, atualizando a lista...");
                buscarVagas();
            })
            .catch(error => console.error("Erro ao ocupar vaga:", error));
        }
        // Se a vaga for de outra pessoa, nada acontece (o componente Vaga.js já bloqueia o clique)
    };

    return (
        <div className="mapa-container">
            <h2>Mapa do Estacionamento</h2>
            <div className="mapa-grid">
                {vagas.map(vaga => (
                    <Vaga
                        key={vaga.id}
                        numero={vaga.numero_vaga}
                        estaOcupada={vaga.ocupada}
                        ocupadaPorMim={vaga.ocupadaPorRA === MEU_RA}
                        onClick={() => handleVagaClick(vaga)} // ✅ Agora passa o objeto 'vaga' inteiro
                    />
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;