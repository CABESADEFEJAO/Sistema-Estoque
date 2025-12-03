const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// =============== LOGIN (usando nome e senha) ===============
app.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const { rows } = await db.query(
      'SELECT * FROM usuarios WHERE nome = $1 AND senha = $2',
      [nome, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      ok: true,
      usuario: { id: rows[0].id, nome: rows[0].nome }
    });
  } catch (err) {
    console.error('Erro na rota /login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// =============== CADASTRO DE USUÁRIO ===============
app.post('/usuarios', async (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
  }

  try {
    // opcional: checar se já existe usuário com esse nome
    const existing = await db.query(
      'SELECT id FROM usuarios WHERE nome = $1',
      [nome]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Nome de usuário já existe' });
    }

    const { rows } = await db.query(
      'INSERT INTO usuarios (nome, senha) VALUES ($1, $2) RETURNING id, nome',
      [nome, senha]
    );

    res.status(201).json({
      ok: true,
      usuario: rows[0]
    });
  } catch (err) {
    console.error('Erro na rota /usuarios:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// ===================== ROTAS DE PRODUTOS =====================
app.get('/produtos', async (req,res)=>{
  try {
    const {rows}= await db.query('SELECT * FROM produtos ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

app.post('/produtos', async (req,res)=>{
  const {nome, quantidade}= req.body;
  try {
    const {rows}= await db.query(
      'INSERT INTO produtos (nome, quantidade) VALUES ($1,$2) RETURNING *',
      [nome, quantidade]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.put('/produtos/:id', async (req,res)=>{
  const {id}= req.params;
  const {nome, quantidade}= req.body;
  try {
    const {rows}= await db.query(
      'UPDATE produtos SET nome=$1, quantidade=$2 WHERE id=$3 RETURNING *',
      [nome, quantidade, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/produtos/:id', async (req,res)=>{
  const {id}= req.params;
  try {
    const {rows}= await db.query(
      'DELETE FROM produtos WHERE id=$1 RETURNING *',[id]
    );
    res.json({deleted: rows[0]});
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

app.listen(3000,()=>console.log('API rodando na 3000'));
