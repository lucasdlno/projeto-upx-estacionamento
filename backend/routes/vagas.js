const express = require('express');
const router = express.Router();

module.exports = (prisma) => {
  
  // ROTA: Pegar o status de todas as vagas
  router.get('/', async (req, res) => {
    try {
      // 1. Pega todas as vagas
      const vagas = await prisma.vaga.findMany({
        orderBy: { numero_vaga: 'asc' },
      });

      // 2. Pega todas as ocupações ativas
      const ocupacoes = await prisma.ocupacao.findMany({
        include: { user: { select: { ra: true } } },
      });

      // 3. Combina os dados (lógica do "Mock" agora com dados reais)
      const vagasComStatus = vagas.map(vaga => {
        const ocupacao = ocupacoes.find(o => o.vagaId === vaga.id);
        
        if (ocupacao) {
          return {
            id: vaga.id,
            numero_vaga: vaga.numero_vaga,
            predio: vaga.predio,
            ocupada: true,
            ocupadaPorRA: ocupacao.user.ra,
            data_chegada: ocupacao.data_chegada,
          };
        } else {
          return {
            ...vaga,
            ocupada: false,
            ocupadaPorRA: null,
            data_chegada: null,
          };
        }
      });

      res.json(vagasComStatus);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
      res.status(500).json({ message: "Erro ao buscar vagas." });
    }
  });

  // ROTA: Pegar histórico de um usuário
  router.get('/historico/:ra', async (req, res) => {
    const { ra } = req.params;
    try {
      const historicoDoUsuario = await prisma.historico.findMany({
        where: { userRA: ra },
        orderBy: { data_saida: 'desc' },
      });
      res.json(historicoDoUsuario);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar histórico." });
    }
  });

  // ROTA: Ocupar uma vaga
  router.post('/:id/ocupar', async (req, res) => {
    const vagaId = parseInt(req.params.id);
    const { raDoUsuario } = req.body;

    try {
      // 1. REGRA: Verifica se o usuário JÁ tem uma vaga
      const usuarioJaTemVaga = await prisma.ocupacao.findUnique({
        where: { userRA: raDoUsuario },
      });
      
      if (usuarioJaTemVaga) {
        const vagaOcupada = await prisma.vaga.findUnique({ where: { id: usuarioJaTemVaga.vagaId }});
        return res.status(400).json({ 
          message: `Você já está ocupando a vaga ${vagaOcupada.numero_vaga}. Libere-a antes de pegar outra.` 
        });
      }

      // 2. Tenta ocupar a vaga
      const novaOcupacao = await prisma.ocupacao.create({
        data: {
          vagaId: vagaId,
          userRA: raDoUsuario,
          data_chegada: new Date()
        },
        include: { vaga: true } // Puxa os dados da vaga
      });

      res.status(200).json({ 
        message: "Vaga ocupada com sucesso!",
        numero_vaga: novaOcupacao.vaga.numero_vaga 
      });

    } catch (error) {
      if (error.code === 'P2002') { // Erro de violação de @unique
        return res.status(400).json({ message: "Vaga já está ocupada." });
      }
      console.error("Erro ao ocupar vaga:", error);
      res.status(500).json({ message: "Erro ao ocupar vaga." });
    }
  });

  // ROTA: Liberar uma vaga
  router.post('/:id/liberar', async (req, res) => {
    const vagaId = parseInt(req.params.id);
    const { raDoUsuario } = req.body;

    try {
      // 1. Encontra a ocupação da vaga
      const ocupacao = await prisma.ocupacao.findUnique({
        where: { vagaId: vagaId },
        include: { vaga: true }
      });

      // 2. Verifica se a vaga está ocupada e se é o usuário certo
      if (!ocupacao) {
        return res.status(400).json({ message: "Esta vaga já está livre." });
      }
      if (ocupacao.userRA !== raDoUsuario) {
        return res.status(403).json({ message: "Você não pode liberar uma vaga que não é sua." });
      }

      // 3. Move para o histórico
      await prisma.historico.create({
        data: {
          numero_vaga: ocupacao.vaga.numero_vaga,
          data_chegada: ocupacao.data_chegada,
          data_saida: new Date(),
          userRA: ocupacao.userRA,
        }
      });

      // 4. Remove a ocupação (libera a vaga)
      await prisma.ocupacao.delete({
        where: { vagaId: vagaId },
      });

      res.status(200).json({ message: "Vaga liberada com sucesso." });

    } catch (error) {
      console.error("Erro ao liberar vaga:", error);
      res.status(500).json({ message: "Erro ao liberar vaga." });
    }
  });

  // ROTA: ADMIN - RESETAR TUDO
  router.post('/admin/reset', async (req, res) => {
    try {
      // 1. Move todas ocupações para o histórico
      const ocupacoesAtuais = await prisma.ocupacao.findMany({ include: { vaga: true } });
      for (const o of ocupacoesAtuais) {
        await prisma.historico.create({
          data: {
            numero_vaga: o.vaga.numero_vaga,
            data_chegada: o.data_chegada,
            data_saida: new Date(),
            userRA: o.userRA,
          }
        });
      }

      // 2. Deleta TODAS as ocupações (limpa o estacionamento)
      await prisma.ocupacao.deleteMany({});
      
      console.log("ADMIN: Sistema resetado com sucesso.");
      res.json({ message: "Todas as vagas foram liberadas." });

    } catch (error) {
      console.error("Erro ao resetar:", error);
      res.status(500).json({ message: "Erro ao resetar sistema." });
    }
  });

  // ROTA: Atualização da IA
  router.post('/atualizar-status-ia', async (req, res) => {
    const { vagaNumero, status } = req.body;
    
    try {
      // 1. Encontra a Vaga pelo número
      const vaga = await prisma.vaga.findUnique({
        where: { numero_vaga: vagaNumero },
      });
      if (!vaga) return res.status(404).json({ message: "Vaga não encontrada" });

      if (status === 'ocupada') {
        // Tenta criar uma ocupação para a IA
        await prisma.ocupacao.create({
          data: {
            vagaId: vaga.id,
            userRA: "IA-DETECTOU", // RA especial
            data_chegada: new Date()
          }
        });
      } else if (status === 'livre') {
        // Tenta remover uma ocupação da IA
        await prisma.ocupacao.deleteMany({
          where: { 
            vagaId: vaga.id,
            userRA: "IA-DETECTOU"
          }
        });
      }
      res.json({ message: "Status da IA recebido." });

    } catch (error) {
      if (error.code === 'P2002') { // Vaga já ocupada por um usuário
        return res.json({ message: "IA viu vaga, mas já está ocupada por usuário." });
      }
      console.error("Erro na rota da IA:", error);
      res.status(500).json({ message: "Erro na rota da IA" });
    }
  });

  return router;
};