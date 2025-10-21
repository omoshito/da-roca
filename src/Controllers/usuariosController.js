const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuairo");


require("dotenv").config();
const SECRET = process.env.SECRET

async function login(req, res) {
    try {
        const { login, senha } = req.body;
        const usuario = await Usuario.buscar(login);

        if (!usuario) return res.status(401).json({ msg: "Credenciais inválidas" });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({msg: "Credenciais inválidas"});


        const token = jwt.sign({id: usuario.id, login: usuario.login, 
            role: usuario.role}, SECRET, {expiresIn: "1h"});
            res.json({token});
    }   catch (err){
        res.status(500).json({erro: err.message});
    }
}

async function inserir(req, res) {
    try{
        const resultado = await Usuario.inserir(req.body);
        res.status(201).json(resultado);
    } catch (err) {
        res.status(500).json({erro: err.message});
    }
}

    module.exports = {login, inserir};