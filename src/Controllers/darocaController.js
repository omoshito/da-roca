const darocaModel = require("../models/daroca")

async function listar(req, res){
    const produtos = await darocaModel.listarProdutos()
    res.json(produtos)
}

async function inserir(req, res){
    try{
        const resultado = await darocaModel.cadastrarClientes(req.body)
        res.status(201).json(resultado)
    }
    catch(error){
        res.status(400).json({error : " Não foi possivel inserir um novo cliente"})
    }
}
async function excluir(req, res){
    try{
        const id = req.params.id
        const resultado = await darocaModel.excluirCliente(id)
        if(resultado.linhasAfetadas === 1){
            res.json({mensagem : "Cliente excluido com sucesso!"})
        }else{
            res.status(404).json({mensagem : "Cliente não encontrado"})
        }
    }
    catch(error){
        res.status(400).json({mensagem : "Não foi possível excluir o cliente"})
    }
}
async function atualizar(req, res){
    try{
        const id = req.params.id
        const resultado = await darocaModel.atualizarCliente(id, req.body)

        if(resultado.linhasAfetadas === 1){
            res.json({mensagem : "Cliente atualizado com sucesso"})
        } else {
            res.status(404).json({mensagem : "Cliente não encontrado"})
        }
   }
   catch (error) {
        res.status(400).json({mensagem : "Não foi possível atualizar o cliente"})
   }
}

module.exports = {listar, inserir, excluir, atualizar}