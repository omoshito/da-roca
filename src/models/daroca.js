const { getPool } = require("../config/db")

async function listarProdutos() {
    const pool = getPool()
    const dados = await pool.query("SELECT * FROM daroca.produtos")
    return dados.recordset
}

async function listarClientes() {
    const pool = getPool()
    const dados = await pool.query("SELECT * FROM daroca.clientes")
    return dados.recordset
}

async function cadastrarClientes(cliente) {
    const { cpf, nome, telefone, email, senha } = cliente
    try {
        if (!cpf || !nome || !telefone || !email || !senha) {
            return { mensagem: "Dados não foram inseridos corretamente" }
        }
        if (cpf.toString().length !== 11) {
            return { mensagem: "CPF invalido" }
        }
        if (telefone.toString().length < 9) {
            return { mensagem: "Número de telefone invalido" }
        }
        
        // Preparando a query com prepared statement para evitar SQL injection
        const pool = getPool()
        const request = pool.request()
        request.input('cpf', cpf)
        request.input('nome', nome)
        request.input('telefone', telefone)
        request.input('email', email)
        request.input('senha', senha)
        
        const insira = await request.query(`INSERT INTO daroca.Clientes (CPF, Nome, Telefone, Email, Senha) VALUES (@cpf, @nome, @telefone, @email, @senha)`)
        return {
            sucesso: true,
            mensagem: "Cliente cadastrado com sucesso",
            dados: insira.recordset,
        }
    }
    catch (error) {
        return { mensagem: "Não foi possível cadastrar o cliente", erro: error.message }
    }
}

async function excluirCliente(id) {
    try {
        const pool = getPool()
        const request = pool.request()
        request.input('cpf', id)
        
        const deletar = await request.query(`DELETE FROM daroca.Clientes WHERE CPF = @cpf`)
        return {
            sucesso: true,
            mensagem: "Cliente excluido com sucesso",
            linhasAfetadas: deletar.rowsAffected[0]
        }
    }
    catch (error) {
        return { mensagem: "Não foi possível excluir o cliente", erro: error.message }
    }
}

async function atualizarCliente(id, cliente) {
    const { nome, telefone, email, senha } = cliente
    try {
        if (!nome || !telefone || !email || !senha) {
            return { mensagem: "Dados não foram inseridos corretamente" }
        }
        if (telefone.toString().length < 9) {
            return { mensagem: "Número de telefone invalido" }
        }
        
        const pool = getPool()
        const request = pool.request()
        request.input('cpf', id)
        request.input('nome', nome)
        request.input('telefone', telefone)
        request.input('email', email)
        request.input('senha', senha)
        
        const atualizar = await request.query(`UPDATE daroca.Clientes SET Nome = @nome, Telefone = @telefone, Email = @email, Senha = @senha WHERE CPF = @cpf`)
        return {
            sucesso: true,
            mensagem: "Dados atualizados com sucesso",
            linhasAfetadas: atualizar.rowsAffected[0]
        }
    }
    catch (error) {
        return { mensagem: "Não foi possivel atualizar os dados do cliente", erro: error.message }
    }
}

module.exports = { listarProdutos, cadastrarClientes, excluirCliente, atualizarCliente }
