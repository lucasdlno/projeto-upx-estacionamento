import React, { useState, useEffect } from 'react';
import Vaga from './Vaga';

function AdminPage() {
    const [vagas, setVagas] = useState([]);
    // Estado para mostrar detalhes da vaga clicada
    const [vagaSelecionada, setVagaSelecionada] = useState(null);

    // A API do admin pode ser a mesma, mas com mais detalhes
    useEffect(() => {
        fetch('http://localhost:3001/api/vagas') // Em um sistema real, seria uma rota protegida /api/admin/vagas
            .then(res => res.json())
            .then(data => setVagas(data));
    }, []);

    const handleVagaClick = (vaga) => {
        if (vaga.ocupada) {
            // Em um sistema real, buscaríamos os dados do usuário e do carro pelo RA
            const detalhes = {
                ...vaga,
                nomeUsuario: `Nome do Aluno (RA: ${vaga.ocupadaPorRA})`,
                placaCarro: `Placa (ABC-1234)`,
            };
            setVagaSelecionada(detalhes);
        } else {
            setVagaSelecionada(null);
        }
    };

    return (
        <div>
            <h2>Dashboard do Administrador</h2>
            <div className="mapa-grid">
                {vagas.map(vaga => (
                    <Vaga
                        key={vaga.id}
                        numero={vaga.numero_vaga}
                        estaOcupada={vaga.ocupada}
                        ocupadaPorMim={false} // Admin não "ocupa" vagas
                        onClick={() => handleVagaClick(vaga)}
                    />
                ))}
            </div>
            {vagaSelecionada && (
                <div className="detalhes-vaga">
                    <h3>Detalhes da Vaga {vagaSelecionada.numero_vaga}</h3>
                    <p>Status: Ocupada</p>
                    <p>Ocupada por: {vagaSelecionada.nomeUsuario}</p>
                    <p>Placa do Carro: {vagaSelecionada.placaCarro}</p>
                    <p>Horário de Chegada: {new Date(vagaSelecionada.data_chegada).toLocaleTimeString('pt-BR')}</p>
                    <button onClick={() => setVagaSelecionada(null)}>Fechar</button>
                </div>
            )}
        </div>
    );
}
export default AdminPage;