const express = require('express');
const router = express.Router();

// --- DADOS FALSOS (MOCK DB) ---
// ✅ MODIFICAÇÃO: Agrupamos os dados em um objeto 'db' para exportar
let db = {
    vagas: [
        { id: 1, numero_vaga: 'A1', predio: 'Bloco A', ocupada: false, ocupadaPorRA: null, data_chegada: null },
        { id: 2, numero_vaga: 'A2', predio: 'Bloco A', ocupada: true,  ocupadaPorRA: '112233', data_chegada: '2025-10-15T20:10:00Z' },
        { id: 3, numero_vaga: 'A3', predio: 'Bloco A', ocupada: false, ocupadaPorRA: null, data_chegada: null },
        { id: 4, numero_vaga: 'B1', predio: 'Bloco B', ocupada: false, ocupadaPorRA: null, data_chegada: null },
        // ... (pode adicionar mais vagas se quiser)
    ],
    historico: [
        { id: 101, numero_vaga: "A3", ra: '987654', data_chegada: '2025-10-24T08:00:00Z', data_saida: '2025-10-24T12:00:00Z' },
        { id: 102, numero_vaga: "B1", ra: '987654', data_chegada: '2025-10-23T08:10:00Z', data_saida: '2025-10-23T11:50:00Z' }
    ]
};
// --- FIM DOS DADOS FALSOS ---

// ROTA: Pegar o status de todas as vagas
router.get('/', (req, res) => {
    res.json(db.vagas);
});

// ROTA: Pegar histórico de um usuário
router.get('/historico/:ra', (req, res) => {
    const { ra } = req.params;
    const historicoDoUsuario = db.historico.filter(h => h.ra === ra);
    // ... (lógica para adicionar detalhes da vaga)
    res.json(historicoDoUsuario);
});

// ROTA: Ocupar uma vaga
router.post('/:id/ocupar', (req, res) => {
    const vagaId = parseInt(req.params.id);
    const { raDoUsuario } = req.body;
    const vaga = db.vagas.find(v => v.id === vagaId);

    if (vaga && !vaga.ocupada) {
        vaga.ocupada = true;
        vaga.ocupadaPorRA = raDoUsuario;
        vaga.data_chegada = new Date().toISOString();
        res.status(200).json(vaga);
    } else {
        res.status(400).json({ message: "Vaga não disponível." });
    }
});

// ROTA: Liberar uma vaga
router.post('/:id/liberar', (req, res) => {
    const vagaId = parseInt(req.params.id);
    const { raDoUsuario } = req.body;
    const vaga = db.vagas.find(v => v.id === vagaId);

    if (vaga && vaga.ocupadaPorRA === raDoUsuario) {
        db.historico.push({
            id: Math.random(),
            numero_vaga: vaga.numero_vaga,
            ra: raDoUsuario,
            data_chegada: vaga.data_chegada,
            data_saida: new Date().toISOString()
        });
        vaga.ocupada = false;
        vaga.ocupadaPorRA = null;
        vaga.data_chegada = null;
        res.status(200).json(vaga);
    } else {
        res.status(400).json({ message: "Você não pode liberar esta vaga." });
    }
});

// ✅ MODIFICAÇÃO: Exportamos o router E o banco de mentira
module.exports = { router, db };