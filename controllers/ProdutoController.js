const ProdutoService = require('../services/ProdutoService');

class ProdutoController {
  async listar(req, res) {
    try {
      const produtos = await ProdutoService.listar();
      res.json(produtos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao listar produtos');
    }
  }

  async criar(req, res) {
    try {
      const { nome, quantidade } = req.body;
      const produto = await ProdutoService.criar(nome, quantidade);
      res.status(201).json(produto);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao criar produto');
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, quantidade } = req.body;
      const produto = await ProdutoService.atualizar(id, nome, quantidade);
      res.json(produto);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar produto');
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const produto = await ProdutoService.deletar(id);
      res.json({ deleted: !!produto });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao deletar produto');
    }
  }
}

module.exports = new ProdutoController();
