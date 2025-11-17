const express = require('express');
const router = express.Router();

// A função recebe o 'prisma' que passamos no index.js
module.exports = (prisma) => {

  // ROTA: Login
  router.post('/login', async (req, res) => {
    const { ra, senha } = req.body;
    console.log(`Backend: Recebida tentativa de login para RA: ${ra}`);

    try {
      const usuario = await prisma.user.findUnique({
        where: { ra: ra },
      });

      if (usuario && usuario.senha === senha) { // Em um projeto real, compare hash!
        console.log(`Backend: Login bem-sucedido para ${usuario.nome}`);
        const { senha: _, ...usuarioLogado } = usuario;
        res.json({ message: "Login bem-sucedido!", usuario: usuarioLogado });
      } else {
        console.log(`Backend: Falha no login, RA ou senha inválidos.`);
        res.status(401).json({ message: 'RA ou senha inválidos.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  });

  // ROTA: Cadastro
  router.post('/registrar', async (req, res) => {
    const { nome, ra, senha, placa, modelo } = req.body;

    try {
      const novoUsuario = await prisma.user.create({
        data: {
          nome,
          ra,
          senha, // Em um projeto real, crie um hash!
          placa,
          modelo,
          role: 'user',
        },
      });
      
      console.log(`Backend: Novo usuário e carro cadastrados para o RA: ${ra}`);
      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      res.status(201).json({ message: "Cadastro realizado com sucesso!", usuario: usuarioSemSenha });

    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target.includes('ra')) {
        return res.status(400).json({ message: 'Este RA já está cadastrado.' });
      }
      if (error.code === 'P2002' && error.meta?.target.includes('placa')) {
        return res.status(400).json({ message: 'Esta placa de carro já está cadastrada.' });
      }
      console.error("Erro no cadastro:", error);
      res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  });

  // ROTA: Pegar dados de um carro (para o admin)
  router.get('/carro/:ra', async (req, res) => {
    const { ra } = req.params;
    try {
      const usuario = await prisma.user.findUnique({
        where: { ra: ra },
        select: { nome: true, ra: true, placa: true, modelo: true } // Pega só o que precisa
      });

      if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
      
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  });

  return router;
};