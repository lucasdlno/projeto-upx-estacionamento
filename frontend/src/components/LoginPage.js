import apiUrl from '../lib/api'; // ✅ CORRIGIDO
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLoginSuccess }) {
    const [ra, setRa] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // ✅ CORRIGIDO: usa a variável apiUrl
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ra, senha }),
            });

            if (!res.ok) {
                const data = await res.json(); // Pega a mensagem de erro do backend
                throw new Error(data.message || 'RA ou senha inválidos. Tente novamente.');
            }
            
            const data = await res.json();
            onLoginSuccess(data.usuario); // Entrega o usuário logado para o App.js

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Login do Aluno</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={ra} onChange={e => setRa(e.target.value)} placeholder="RA (Ex: 987654 ou admin)" required />
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha (Ex: 123 ou admin)" required />
                <button type="submit">Entrar</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <p>Não tem uma conta? <button className="link-button" onClick={() => navigate('/cadastro')}>Cadastre-se</button></p>
        </div>
    );
}
export default LoginPage;
// A linha 'fetch' extra foi removida daqui