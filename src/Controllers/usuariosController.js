const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario");

require("dotenv").config();
const SECRET = process.env.SECRET;

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.buscar({ email, senha });

    if (!usuario || usuario.erro)
      return res.status(401).json({ msg: "Credenciais inválidas" });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function inserir(req, res) {
  console.log("📩 Rota /clientes foi chamada!");
  console.log("Dados recebidos:", req.body);
  try {
    const resultado = await Usuario.cadastrarClientes(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { login, inserir };
