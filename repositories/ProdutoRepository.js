const db = require('../db');
const Produto = require('../models/Produto');

class ProdutoRepository {
  async findAll() {
    const res = await db.query('SELECT * FROM produtos ORDER BY id');
    return res.rows.map(r => new Produto(r.id, r.nome, r.quantidade));
  }

  async create(nome, quantidade) {
    const res = await db.query(
      'INSERT INTO produtos (nome, quantidade) VALUES ($1, $2) RETURNING *',
      [nome, quantidade]
    );
    const r = res.rows[0];
    return new Produto(r.id, r.nome, r.quantidade);
  }

  async update(id, nome, quantidade) {
    const res = await db.query(
      'UPDATE produtos SET nome=$1, quantidade=$2 WHERE id=$3 RETURNING *',
      [nome, quantidade, id]
    );
    const r = res.rows[0];
    return new Produto(r.id, r.nome, r.quantidade);
  }

  async delete(id) {
    const res = await db.query(
      'DELETE FROM produtos WHERE id=$1 RETURNING *',
      [id]
    );
    const r = res.rows[0];
    return r ? new Produto(r.id, r.nome, r.quantidade) : null;
  }
}

module.exports = new ProdutoRepository();
