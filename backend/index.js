const express = require('express');
const cors = require('cors');
const app = express();

// Configurações do servidor
app.use(cors());
app.use(express.json());

// --- CORREÇÃO AQUI ---
// O arquivo vagas.js exporta um objeto { router, db }
// O arquivo auth.js exporta o router diretamente
const { router: vagasRoutes } = require('./routes/vagas'); // Importação correta para vagas.js
const authRoutes = require('./routes/auth');             // Importação correta para auth.js

// Usa as rotas com seus prefixos
app.use('/api/vagas', vagasRoutes);
app.use('/api/auth', authRoutes);
// --- FIM DA CORREÇÃO ---

// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend (MOCK) rodando em http://localhost:${PORT}`);
  console.log("Este servidor está usando dados 'de mentira' e não se conecta a um banco de dados.");
});