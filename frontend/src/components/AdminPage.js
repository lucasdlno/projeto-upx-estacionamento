import apiUrl from '@/lib/api';
import React, { useState, useEffect } from 'react';
import Vaga from './Vaga';

function AdminPage() {
    const [vagas, setVagas] = useState([]);
    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const [detalhesUsuario, setDetalhesUsuario] = useState(null);

    const buscarVagas = () => {
        fetch('http://localhost:3001/api/vagas')
            .then(res => res.json())
            .then(data => setVagas(data));
    };

    useEffect(() => {
        buscarVagas();
        const interval = setInterval(buscarVagas, 5000); // Admin vê em tempo real
        return () => clearInterval(interval);
    }, []);

    const handleVagaClick = (vaga) => {
        if (vaga.ocupada) {
            setVagaSelecionada(vaga);
            // Busca os detalhes do usuário e carro
            fetch(`http://localhost:3001/api/auth/carro/${vaga.ocupadaPorRA}`)
                .then(res => res.json())
                .then(data => setDetalhesUsuario(data))
                .catch(err => setDetalhesUsuario({nome: "Erro ao buscar dados"}));
        } else {
            setVagaSelecionada(null);
            setDetalhesUsuario(null);
        }
    };

    return (
        <div className="mapa-container">
            <h2>Dashboard do Administrador</h2>
            <div className="mapa-grid">
                {vagas.map(vaga => (
                    <Vaga
                        key={vaga.id}
                        numero={vaga.numero_vaga}
                        estaOcupada={vaga.ocupada}
                        ocupadaPorMim={false} // Admin nunca "ocupa"
                        onClick={() => handleVagaClick(vaga)}
                    />
                ))}
            </div>
            
            {vagaSelecionada && (
                <div className="detalhes-vaga">
                    <h3>Detalhes da Vaga {vagaSelecionada.numero_vaga}</h3>
                    <p><strong>Status:</strong> Ocupada</p>
                    {detalhesUsuario ? (
                        <>
                            <p><strong>Ocupada por:</strong> {detalhesUsuario.nome}</p>
                            <p><strong>RA:</strong> {detalhesUsuario.ra}</p>
                            <p><strong>Veículo:</strong> {detalhesUsuario.modelo} (Placa: {detalhesUsuario.placa})</p>
                            <p><strong>Horário de Chegada:</strong> {new Date(vagaSelecionada.data_chegada).toLocaleString('pt-BR')}</p>
                        </>
                    ) : (
                        <p>Carregando detalhes do usuário...</p>
                    )}
                    <button onClick={() => setVagaSelecionada(null)}>Fechar</button>
                </div>
            )}
        </div>
    );
}
export default AdminPage;
fetch(`${apiUrl}/api/vagas`)