import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import CadastroPage from './components/CadastroPage';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import HistoricoPage from './components/HistoricoPage';
import './style.css';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null); // Guarda os dados do usuário logado
  const [telaAtual, setTelaAtual] = useState('login'); // Controla qual tela mostrar: 'login', 'cadastro', 'dashboard', 'historico', 'admin'

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
    if (usuario.role === 'admin') {
      setTelaAtual('admin');
    } else {
      setTelaAtual('dashboard');
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    setTelaAtual('login');
  };

  // Função para renderizar a tela correta
  const renderTela = () => {
    switch (telaAtual) {
      case 'cadastro':
        return <CadastroPage onNavigateToLogin={() => setTelaAtual('login')} />;
      case 'dashboard':
        return <DashboardPage usuario={usuarioLogado} />;
      case 'admin':
        return <AdminPage />;
      case 'historico':
        return <HistoricoPage usuario={usuarioLogado} />;
      default:
        return <LoginPage onLoginSuccess={handleLogin} onNavigateToCadastro={() => setTelaAtual('cadastro')} />;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>UPX Estacionamento Inteligente</h1>
        {usuarioLogado && (
          <nav>
            {usuarioLogado.role !== 'admin' && <button onClick={() => setTelaAtual('dashboard')}>Mapa</button>}
            {usuarioLogado.role !== 'admin' && <button onClick={() => setTelaAtual('historico')}>Histórico</button>}
            {usuarioLogado.role === 'admin' && <button onClick={() => setTelaAtual('admin')}>Dashboard Admin</button>}
            <button onClick={handleLogout}>Sair</button>
          </nav>
        )}
      </header>
      <main>
        {renderTela()}
      </main>
    </div>
  );
}

export default App;