const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); // <-- IMPORTAR
const app = express();

const prisma = new PrismaClient(); // <-- CRIAR INSTÂNCIA
app.use(cors());
app.use(express.json());

// Passa a instância do prisma para as rotas
app.use('/api/vagas', require('./routes/vagas')(prisma));
app.use('/api/auth', require('./routes/auth')(prisma));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log("Backend em modo passive-listener (aguardando updates da IA)...");
});