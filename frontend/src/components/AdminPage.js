import apiUrl from '../lib/api'; // ✅ CAMINHO CORRIGIDO
import React, { useState, useEffect } from 'react';
import Vaga from './Vaga';

function AdminPage() {
    const [vagas, setVagas] = useState([]);
    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const [detalhesUsuario, setDetalhesUsuario] = useState(null);
    const [loadingDetalhes, setLoadingDetalhes] = useState(false);

    const buscarVagas = () => {
        // ✅ CORRIGIDO: usa a variável apiUrl
        fetch(`${apiUrl}/api/vagas`)
            .then(res => res.json())
            .then(data => setVagas(data));
    };

    useEffect(() => {
        buscarVagas();
        const interval = setInterval(buscarVagas, 5000); 
        return () => clearInterval(interval);
    }, []);

    const handleVagaClick = (vaga) => {
        if (vaga.ocupada) {
            setVagaSelecionada(vaga);
            setLoadingDetalhes(true);
            setDetalhesUsuario(null);
            
            // ✅ CORRIGIDO: usa a variável apiUrl
            fetch(`${apiUrl}/api/auth/carro/${vaga.ocupadaPorRA}`)
                .then(res => {
                    if (!res.ok) throw new Error("RA não é de um usuário cadastrado.");
                    return res.json()
                })
                .then(data => {
                    setDetalhesUsuario(data);
                    setLoadingDetalhes(false);
                })
                .catch(err => {
                    setDetalhesUsuario({ nome: "Detectado pela IA", ra: vaga.ocupadaPorRA });
                    setLoadingDetalhes(false);
                });
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
                        ocupadaPorMim={false}
                        onClick={() => handleVagaClick(vaga)}
                    />
                ))}
            </div>
            
            {vagaSelecionada && (
                <div className="detalhes-vaga">
                    <h3>Detalhes da Vaga {vagaSelecionada.numero_vaga}</h3>
                    <p><strong>Status:</strong> Ocupada</p>
                    {loadingDetalhes ? (
                        <p>Carregando detalhes do usuário...</p>
                    ) : detalhesUsuario ? (
                        <>
                            <p><strong>Ocupada por:</strong> {detalhesUsuario.nome}</p>
                            <p><strong>RA:</strong> {detalhesUsuario.ra}</p>
                            <p><strong>Veículo:</strong> {detalhesUsuario.modelo || 'N/A'}</p>
                            <p><strong>Placa:</strong> {detalhesUsuario.placa || 'N/A'}</p>
                            <p><strong>Chegada:</strong> {new Date(vagaSelecionada.data_chegada).toLocaleString('pt-BR')}</p>
                        </>
                    ) : null}
                    <button onClick={() => setVagaSelecionada(null)}>Fechar</button>
                </div>
            )}
        </div>
    );
}
export default AdminPage;
// A linha 'fetch' extra no final foi removida.