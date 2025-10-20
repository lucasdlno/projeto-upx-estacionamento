const express = require('express');
const cors = require('cors');
const app = express();

// Configurações do servidor
app.use(cors());
app.use(express.json());

// Importa as rotas
const vagasRoutes = require('./routes/vagas');
const authRoutes = require('./routes/auth'); // Rota nova

// Usa as rotas com seus prefixos
app.use('/api/vagas', vagasRoutes);
app.use('/api/auth', authRoutes); // Rota nova

// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend (mock) rodando em http://localhost:${PORT}`);
});