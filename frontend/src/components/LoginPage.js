import React, { useState } from 'react';

function LoginPage({ onLoginSuccess, onNavigateToCadastro }) {
    const [ra, setRa] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ra, senha }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Credenciais inválidas');
            return res.json();
        })
        .then(usuario => {
            onLoginSuccess(usuario);
        })
        .catch(err => setError(err.message));
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={ra} onChange={e => setRa(e.target.value)} placeholder="RA" required />
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
                <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Não tem uma conta? <button onClick={onNavigateToCadastro}>Cadastre-se</button></p>
        </div>
    );
}
export default LoginPage;