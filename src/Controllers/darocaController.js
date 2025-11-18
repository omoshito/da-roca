const darocaModel = require("../models/daroca");

async function listar(req, res) {
  const produtos = await darocaModel.listarProdutos();
  res.json(produtos);
}

async function listarPorCategoria(req, res) {
  const id = parseInt(req.params.id, 10);

  try {
    const lista = await darocaModel.listarProdutosPorCategoria(id);
    res.json(lista);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível listar os produtos por categoria" });
  }
}

async function inserir(req, res) {
  try {
    const resultado = await darocaModel.cadastrarClientes(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res
      .status(400)
      .json({ error: " Não foi possivel inserir um novo cliente" });
  }
}
async function excluir(req, res) {
  try {
    const cpf = req.params.cpf;
    const { login, senha } = req.body;

    const linhas = await darocaModel.excluirCliente(cpf, { login, senha });
    if (linhas === 1) {
      res.json({ mensagem: "Cliente excluido com sucesso!" });
    } else {
      res.status(404).json({ mensagem: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ mensagem: "Não foi possível excluir o cliente" });
  }
}
async function atualizar(req, res) {
  try {
    const cpf = req.params.cpf;
    const linhas = await darocaModel.atualizarCliente({ ...req.body, cpf });

    if (linhas === 1) {
      res.json({ mensagem: "Cliente atualizado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ mensagem: "Não foi possível atualizar o cliente" });
  }
}

module.exports = { listar, listarPorCategoria, inserir, excluir, atualizar };
