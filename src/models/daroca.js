const {mssql} = require("../config/db")

async function listarProdutos(){
    const dados = await mssql.query("SELECT * FROM daroca.produtos")
    return dados.recordset
}


async function excluirCliente(CPF, cliente){
    const {cpf ,login, senha} = cliente
    try{
        const request = new mssql.Request()
        
        request.input('cpfCliente', VarChar(11), cpf)
        request.input('loginCliente', mssql.VarChar(80), login)
        request.input('senhaCliente', mssql.VarChar(20), senha)

        const verifica = await request.query(`SELECT * FROM daroca.Clientes WHERE cpf = @cpfCliente AND login = @loginCliente AND senha = @senhaCliente`)

        if(verifica.recordset.length === 0){
            return{mensagem: "Valores sem correspondência, Tente novamente"}
        }
        const query = `DELETE FROM daroca.Clientes WHERE CPF = @Cpf`

        await request.query(query)

        return {mensagem: "Cliente excluído com sucesso"}
    }
    catch(error){
        return {mensagem : "Não foi possível excluir o cliente"}
    }   
}

async function atualizarCliente(cliente){
    const {cpf, nome, telefone, login, senha, endereco} = cliente
    try{        
        const request = new mssql.Request()
        
        request.input('cpfCliente', mssql.VarChar(11), cpf)
        request.input('nomeCliente', mssql.VarChar(100), nome)
        request.input('telefoneCliente', mssql.VarChar(9), telefone)
        request.input('enderecoCliente', mssql.VarChar(50), endereco)
        request.input('loginCliente', mssql.VarChar(80), login)
        request.input('senhaCliente', mssql.VarChar(20), senha)

        const query = `UPDATE daroca.Clientes SET nome = @nomeCliente, telefone = @telefoneCliente, 
        login = @loginCliente, senha = @senhaCliente, endereco = @enderecoCliente WHERE cpf = @cpfCliente `

        await request.query(query)

           return {mensagem : "Atualização concluída"}
    }
    catch(error){
        return {mensagem : "Não foi possivel atualizar os dados do cliente"}
    } 
}

module.exports = {listarProdutos , excluirCliente, atualizarCliente}