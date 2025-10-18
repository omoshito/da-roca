const {mssql} = require("../config/db")

async function listarProdutos(){
    const dados = await mssql.query("SELECT * FROM daroca.produtos")
    return dados.recordset
}

async function cadastrarClientes(cliente){
    const {cpf, nome, telefone, login, senha} = cliente
    try{
        const request = new mssql.Request()
        
        request.input('cpfCliente', mssql.Int, cpf)
        request.input('nomeCliente', mssql.VarChar(100), nome)
        request.input('telefoneCliente', mssql.VarChar(9), telefone)
        request.input('loginCliente', )

    }
    catch(error){
        return {mensagem : "Não foi possível cadastrar o cliente", erro : error}
    }
}

async function excluirCliente(id, cliente){
    const {login, senha} = cliente
    try{
        if(!login || !senha){
            return {mensagem : "Campo vazio"}
        }
        const deletar = await mssql.query(`DELETE FROM daroca.Clientes WHERE ID = ${id}`)
        return{
            sucesso : true,
            mensagem : "Cliente excluido com sucesso",
            dados : deletar.recordset
        }
    }
    catch(error){
        return {mensagem : "Não foi possível excluir o cliente"}
    }   
}

async function atualizarCliente(id, cliente){
    const {cpf, nome, telefone, login, senha} = cliente
    try{
        if (!cpf|| !nome|| !telefone|| !login|| !senha){
            return {mensagem:"Dados não foram inseridos corretamente"}
        }
        if (cpf.length !== 11){
            return {mensagem : "CPF invalido"}
        }
        if (telefone.length !== 9){
            return {mensagem : "Número de telefone invalido"}
        }
        for(let i = 0; i < nome.length; i++){
            const nomeVerifica = nome[i].charCodeAt(0)
            if (nomeVerifica < 65 || nomeVerifica > 122 || nomeVerifica !== 32){
                return {Mensegem : "Nome invalido"}
            }
        }
        const atualizar = await mssql.query(`UPDATE daroca.Clientes SET ${cpf}, '${nome}', ${telefone}, ${login}, ${senha} WHERE ID = ${id}`)
        return {
            sucesso : true,
            mensagem : "Dados atualizados com sucesso",
            dados : atualizar.recordset
        }
    }
    catch(error){
        return {mensagem : "Não foi possivel atualizar os dados do cliente"}
    }
}

module.exports = {listarProdutos , cadastrarClientes, excluirCliente, atualizarCliente}