const ProdutoRepository = require('../repositories/ProdutoRepository');

class ProdutoService {
  async listar() { return ProdutoRepository.findAll(); }
  async criar(nome, quantidade) { return ProdutoRepository.create(nome, quantidade); }
  async atualizar(id, nome, quantidade) { return ProdutoRepository.update(id, nome, quantidade); }
  async deletar(id) { return ProdutoRepository.delete(id); }
}

module.exports = new ProdutoService();
