const express = require('express');
const router = express.Router();

// --- BANCO DE DADOS FALSO (MOCK DB) ---
// Vamos simular as tabelas "usuarios" e "carros"
let usuarios = [
    { id: 1, nome: 'Lucas D. Lino', ra: '987654', senha: '123', role: 'user' },
    { id: 2, nome: 'Administrador', ra: 'admin', senha: 'admin', role: 'admin' }
];
let carros = [
    { id: 1, placa: 'ABC-1234', modelo: 'Gol', usuario_id: 1 }
];
let proximoUsuarioId = 3;
let proximoCarroId = 2;
// --- FIM DO BANCO FALSO ---

// ROTA: Login (Feature 2)
// POST /api/auth/login
router.post('/login', (req, res) => {
    const { ra, senha } = req.body;
    console.log(`Backend: Recebida tentativa de login para RA: ${ra}`);
    
    const usuario = usuarios.find(u => u.ra === ra && u.senha === senha);
    
    if (usuario) {
        console.log(`Backend: Login bem-sucedido para ${usuario.nome}`);
        // Retorna o usuário (sem a senha) como confirmação de login
        const { senha: _, ...usuarioLogado } = usuario;
        res.json({ message: "Login bem-sucedido!", usuario: usuarioLogado });
    } else {
        console.log(`Backend: Falha no login, RA ou senha inválidos.`);
        res.status(401).json({ message: 'RA ou senha inválidos.' });
    }
});

// ROTA: Cadastro (Feature 2)
// POST /api/auth/registrar
router.post('/registrar', (req, res) => {
    const { nome, ra, senha, placa, modelo } = req.body;
    
    if (usuarios.some(u => u.ra === ra)) {
        return res.status(400).json({ message: 'Este RA já está cadastrado.' });
    }
    if (carros.some(c => c.placa === placa)) {
        return res.status(400).json({ message: 'Esta placa de carro já está cadastrada.' });
    }

    const novoUsuario = { id: proximoUsuarioId++, nome, ra, senha, role: 'user' };
    usuarios.push(novoUsuario);

    const novoCarro = { id: proximoCarroId++, placa, modelo, usuario_id: novoUsuario.id };
    carros.push(novoCarro);

    console.log(`Backend: Novo usuário e carro cadastrados para o RA: ${ra}`);
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json({ message: "Cadastro realizado com sucesso!", usuario: usuarioSemSenha });
});

// ROTA para pegar dados de um carro (para o admin)
router.get('/carro/:ra', (req, res) => {
    const { ra } = req.params;
    const usuario = usuarios.find(u => u.ra === ra);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

    const carro = carros.find(c => c.usuario_id === usuario.id);
    if (!carro) return res.status(404).json({ message: "Carro não encontrado" });

    res.json({
        nome: usuario.nome,
        ra: usuario.ra,
        placa: carro.placa,
        modelo: carro.modelo
    });
});

module.exports = router;