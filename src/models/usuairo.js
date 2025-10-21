const bcrypt = require('bcrypt')
const {mssql} = require("../config/db")

async function buscar (clientes){
    try{
        const {login, senha} = clientes
        const request = new mssql.Request()

        request.input('loginUser', mssql.VarChar(80), login)
        request.input('senhaUser', mssql.VarChar(80), senha)
        const query = `SELECT * FROM darocaClientes WHERE nome = @loginUser AND senha = @senhaUser `

        await request.query(query)
        return buscar.recordset[0]
    }
    catch(error){
        return{error: "Não foi possível logar no site"}
    }
}

async function cadastrarClientes(cliente){
    const {cpf, nome, telefone, dataN, endereco, login, senha} = cliente
    const senhaHash = await bcrypt.hash(senha, 12)
    try{
        const request = new mssql.Request()
        
        request.input('cpfCliente', mssql.VarChar(11), cpf)
        request.input('dataNCliente', mssql.)
        request.input('nomeCliente', mssql.VarChar(100), nome)
        request.input('telefoneCliente', mssql.VarChar(9), telefone)
        request.input('enderecoCliente', mssql.VarChar(50), endereco)
        request.input('loginCliente', mssql.VarChar(80), login)
        request.input('senhaCliente', mssql.VarChar(255), senhaHash)

        const query = `INSERT INTO daroca.clientes (cpf, nome, telefone, email, senha, endereco) VALUES (@cpfCliente, @nomeClientem 
                       @telefoneCliente, @enderecoCliente, @loginCliente, @senhaCliente)`

        await request.query(query)

        return{mensagem:"Cliente inserido com sucesso"}

    }
    catch(error){
        return {mensagem : "Não foi possível cadastrar o cliente", erro : error}
    }
}

module.exports = {buscar, cadastrarClientes}