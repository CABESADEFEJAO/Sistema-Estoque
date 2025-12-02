const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

router.get('/', (req, res) => ProdutoController.listar(req, res));
router.post('/', (req, res) => ProdutoController.criar(req, res));
router.put('/:id', (req, res) => ProdutoController.atualizar(req, res));
router.delete('/:id', (req, res) => ProdutoController.deletar(req, res));

module.exports = router;
