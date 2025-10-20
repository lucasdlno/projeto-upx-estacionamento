import React, { useState } from 'react';

function CadastroPage({ onNavigateToLogin }) {
    // Estados para todos os campos do formulário
    const [nome, setNome] = useState('');
    // ... outros estados para ra, senha, placa, modelo ...
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para chamar a API POST /api/auth/registrar
        // ...
        // Se sucesso, mostrar mensagem e o botão de ir para o login
    };

    return (
        <div>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                {/* Inputs para nome, ra, senha, placa, modelo */}
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <p>Já tem uma conta? <button onClick={onNavigateToLogin}>Faça Login</button></p>
        </div>
    );
}
export default CadastroPage;