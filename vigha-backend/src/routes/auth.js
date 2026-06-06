const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// CADASTRO
router.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erro: 'Formato de email inválido' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });
  }

  try {
    const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    await db.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, hash]);

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token });
    } catch (err) {
    console.error('ERRO CADASTRO:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

module.exports = router;