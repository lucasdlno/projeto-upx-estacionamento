import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CadastroPage from './components/CadastroPage';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import HistoricoPage from './components/HistoricoPage';
import './style.css';

// 1. Criar um "Contexto" para saber quem está logado
const AuthContext = createContext(null);

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
    if (usuario.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    navigate('/');
  };

  return (
    // 2. Disponibilizar os dados de login para toda a aplicação
    <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      <div className="App">
        <header>
          <h1>UPX Estacionamento Inteligente</h1>
          {usuarioLogado && (
            <nav>
              {usuarioLogado.role === 'user' && <Link to="/dashboard">Mapa</Link>}
              {usuarioLogado.role === 'user' && <Link to="/historico">Histórico</Link>}
              {usuarioLogado.role === 'admin' && <Link to="/admin">Dashboard Admin</Link>}
              <button onClick={handleLogout}>Sair</button>
            </nav>
          )}
        </header>
        <main>
          {/* 3. Definir as rotas do site */}
          <Routes>
            <Route path="/" element={<LoginPage onLoginSuccess={handleLogin} />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            
            {/* Rotas Protegidas */}
            {usuarioLogado && (
              <>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/historico" element={<HistoricoPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

// 4. Um "hook" customizado para que qualquer componente possa pegar os dados do usuário
export const useAuth = () => useContext(AuthContext);

export default App;