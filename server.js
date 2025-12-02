const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const produtoRoutes = require('./routes/produtoRoutes');

=======
const db = require('./db');
>>>>>>> origin/main
const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use('/produtos', produtoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API OOP JS rodando na porta ${PORT}`));
=======
app.get('/produtos', async (req,res)=>{
  const {rows}= await db.query('SELECT * FROM produtos ORDER BY id');
  res.json(rows);
});

app.post('/produtos', async (req,res)=>{
  const {nome, quantidade}= req.body;
  const {rows}= await db.query(
    'INSERT INTO produtos (nome, quantidade) VALUES ($1,$2) RETURNING *',
    [nome, quantidade]
  );
  res.json(rows[0]);
});

app.put('/produtos/:id', async (req,res)=>{
  const {id}= req.params;
  const {nome, quantidade}= req.body;
  const {rows}= await db.query(
    'UPDATE produtos SET nome=$1, quantidade=$2 WHERE id=$3 RETURNING *',
    [nome, quantidade, id]
  );
  res.json(rows[0]);
});

app.delete('/produtos/:id', async (req,res)=>{
  const {id}= req.params;
  const {rows}= await db.query(
    'DELETE FROM produtos WHERE id=$1 RETURNING *',[id]
  );
  res.json({deleted: rows[0]});
});

app.listen(3000,()=>console.log('API rodando na 3000'));
>>>>>>> origin/main
