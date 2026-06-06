const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const auth = require('../middlewares/auth');

// LISTAR (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, criado_em FROM usuarios');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// EDITAR (protegido)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { email, senha } = req.body;

  if (!email && !senha) {
    return res.status(400).json({ erro: 'Informe email ou senha para atualizar' });
  }

  try {
    if (email) {
      const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
      if (existente.length > 0) {
        return res.status(409).json({ erro: 'Email já está em uso' });
      }
      await db.query('UPDATE usuarios SET email = ? WHERE id = ?', [email, id]);
    }

    if (senha) {
      if (senha.length < 6) {
        return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });
      }
      const hash = await bcrypt.hash(senha, 10);
      await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hash, id]);
    }

    return res.json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

// EXCLUIR (protegido)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao excluir usuário' });
  }
});

module.exports = router;