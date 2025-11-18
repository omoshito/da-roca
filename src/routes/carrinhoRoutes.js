const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/auth");

// Bloqueio da páginado carrinho se o usuário não estiver logado
router.get("/", verificarToken, (req, res) => {
  res.sendFile("carrinho.html", { root: "./public" });
});

module.exports = router;

//Libera a página do carrinho se o usuário estiver logado
router.post("/adicionar", verificarToken, (req, res) => {
  res.json({ mensagem: "Item adicionado" });
});
