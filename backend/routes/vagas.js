const express = require('express');
const router = express.Router();

// --- DADOS FALSOS ---
let vagas = [
    { id: 1, numero_vaga: 'A1', ocupada: false, ocupadaPorRA: null, data_chegada: null },
    { id: 2, numero_vaga: 'A2', ocupada: true,  ocupadaPorRA: '112233', data_chegada: '2025-10-15T20:10:00Z' },
    { id: 3, numero_vaga: 'A3', ocupada: false, ocupadaPorRA: null, data_chegada: null },
    { id: 4, numero_vaga: 'A4', ocupada: false, ocupadaPorRA: null, data_chegada: null }
];
let historico = [
    { id: 101, vaga_id: 3, ra: '987654', data_chegada: '2025-10-14T10:00:00Z', data_saida: '2025-10-14T18:00:00Z' },
    { id: 102, vaga_id: 5, ra: '987654', data_chegada: '2025-10-13T09:00:00Z', data_saida: '2025-10-13T17:00:00Z' }
];
// --- FIM DOS DADOS FALSOS ---

// ROTA: Pegar o status de todas as vagas (pública)
router.get('/', (req, res) => {
    res.json(vagas);
});

// ✅ ROTA: Pegar histórico de um usuário
// GET /api/vagas/historico/:ra
router.get('/historico/:ra', (req, res) => {
    const { ra } = req.params;
    const historicoDoUsuario = historico.filter(h => h.ra === ra);
    // Em um sistema real, faríamos um JOIN para pegar o número da vaga
    const historicoComDetalhes = historicoDoUsuario.map(h => {
        const vaga = vagas.find(v => v.id === h.vaga_id);
        return { ...h, numero_vaga: vaga ? vaga.numero_vaga : 'N/A' };
    });
    res.json(historicoComDetalhes);
});

// ROTA: Ocupar uma vaga
router.post('/:id/ocupar', (req, res) => {
    const vagaId = parseInt(req.params.id);
    const { raDoUsuario } = req.body;
    const vagaParaOcupar = vagas.find(v => v.id === vagaId);

    if (vagaParaOcupar && !vagaParaOcupar.ocupada) {
        vagaParaOcupar.ocupada = true;
        vagaParaOcupar.ocupadaPorRA = raDoUsuario;
        vagaParaOcupar.data_chegada = new Date().toISOString();
        res.status(200).json(vagaParaOcupar);
    } else {
        res.status(400).json({ message: "Vaga não disponível ou inexistente." });
    }
});

// ROTA: Liberar uma vaga
router.post('/:id/liberar', (req, res) => {
    const vagaId = parseInt(req.params.id);
    const { raDoUsuario } = req.body;
    const vagaParaLiberar = vagas.find(v => v.id === vagaId);

    if (vagaParaLiberar && vagaParaLiberar.ocupadaPorRA === raDoUsuario) {
        // Adiciona ao histórico
        historico.push({
            id: Math.random(),
            vaga_id: vagaId,
            ra: raDoUsuario,
            data_chegada: vagaParaLiberar.data_chegada,
            data_saida: new Date().toISOString()
        });
        // Libera a vaga
        vagaParaLiberar.ocupada = false;
        vagaParaLiberar.ocupadaPorRA = null;
        vagaParaLiberar.data_chegada = null;
        res.status(200).json(vagaParaLiberar);
    } else {
        res.status(400).json({ message: "Você não pode liberar esta vaga." });
    }
});

module.exports = router;