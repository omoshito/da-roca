const express = require("express");
const router = express.Router();
const UsuarioController = require("../Controllers/usuariosController");

router.post("/login", UsuarioController.login);
router.post("/clientes", UsuarioController.inserir);

module.exports = router;

