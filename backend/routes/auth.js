const express = require('express');
const router = express.Router();

// --- DADOS FALSOS DE USUÁRIOS E CARROS ---
let usuarios = [
    { id: 1, nome: 'Lucas D. Lino', ra: '987654', senha: '123' },
    { id: 2, nome: 'Administrador', ra: 'admin', senha: 'admin', role: 'admin' } // Usuário Admin
];
let carros = [
    { id: 1, placa: 'ABC-1234', modelo: 'Fusca', usuario_id: 1 }
];
let nextUsuarioId = 3;
let nextCarroId = 2;
// --- FIM DOS DADOS FALSOS ---

// ROTA: Login
// POST /api/auth/login
router.post('/login', (req, res) => {
    const { ra, senha } = req.body;
    const usuario = usuarios.find(u => u.ra === ra && u.senha === senha);
    if (usuario) {
        console.log(`Login bem-sucedido para o RA: ${ra}`);
        // Retornamos os dados do usuário, exceto a senha
        const { senha, ...usuarioSemSenha } = usuario;
        res.json(usuarioSemSenha);
    } else {
        console.log(`Falha no login para o RA: ${ra}`);
        res.status(401).json({ message: 'RA ou senha inválidos.' });
    }
});

// ROTA: Cadastro
// POST /api/auth/registrar
router.post('/registrar', (req, res) => {
    const { nome, ra, senha, placa, modelo } = req.body;

    if (usuarios.some(u => u.ra === ra)) {
        return res.status(400).json({ message: 'Este RA já está cadastrado.' });
    }
    if (carros.some(c => c.placa === placa)) {
        return res.status(400).json({ message: 'Esta placa de carro já está cadastrada.' });
    }

    const novoUsuario = { id: nextUsuarioId++, nome, ra, senha };
    usuarios.push(novoUsuario);

    const novoCarro = { id: nextCarroId++, placa, modelo, usuario_id: novoUsuario.id };
    carros.push(novoCarro);

    console.log(`Novo usuário e carro cadastrados para o RA: ${ra}`);
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
});

module.exports = router;