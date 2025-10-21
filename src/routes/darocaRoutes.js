const express = require("express")
const router = express.Router()
const darocaController = require("../Controllers/darocaController")

// Rota para listar produtos
router.get("/produtos", darocaController.listar)

// Rota para atualizar cliente
router.put("/clientes/:id", darocaController.atualizar)

// Rota para excluir cliente
router.delete("/clientes/:cpf", darocaController.excluir)

module.exports =  router 
