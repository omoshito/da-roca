const express = require("express");
const router = express.Router();
const darocaController = require("../Controllers/darocaController");

// Rota para listar produtos
router.get("/produtos", darocaController.listar);

//Rota para listar os produtos por categoria
router.get("/categorias/:id", darocaController.listarPorCategoria)

// Rota para atualizar cliente
router.put("/clientes/:cpf", darocaController.atualizar);

// Rota para excluir cliente
router.delete("/clientes/:cpf", darocaController.excluir);

module.exports = router;
