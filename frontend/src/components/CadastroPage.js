import apiUrl from '@/lib/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CadastroPage() {
    const [nome, setNome] = useState('');
    const [ra, setRa] = useState('');
    const [senha, setSenha] = useState('');
    const [placa, setPlaca] = useState('');
    const [modelo, setModelo] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:3001/api/auth/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, ra, senha, placa, modelo }),
            });
            
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Erro ao cadastrar.');
            }
            
            setSuccess('Cadastro realizado com sucesso! Você já pode fazer o login.');
            
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Cadastro</h2>
            {success ? (
                <p style={{ color: 'green' }}>{success}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome Completo" required />
                    <input type="text" value={ra} onChange={e => setRa(e.target.value)} placeholder="RA" required />
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
                    <input type="text" value={placa} onChange={e => setPlaca(e.target.value)} placeholder="Placa do Carro (Ex: ABC-1234)" required />
                    <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Modelo do Carro (Ex: Gol)" required />
                    <button type="submit">Cadastrar</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}
            <p>Já tem uma conta? <button className="link-button" onClick={() => navigate('/')}>Faça Login</button></p>
        </div>
    );
}
export default CadastroPage;
fetch(`${apiUrl}/api/vagas`)