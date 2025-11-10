const bcrypt = require("bcrypt");
const { mssql } = require("../config/db");

async function buscar(clientes) {
  try {
    const { email, senha } = clientes;
    const request = new mssql.Request();

    request.input("loginUser", mssql.VarChar(80), login);

    const query = `SELECT * FROM darocaClientes WHERE email = @loginUser`;
    const resultado = await request.query(query);

    const usuario = resultado.recordset[0];
    if (!usuario) return { erro: "Usuário não encontrado" };

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return { erro: "Senha incorreta" };

    return usuario;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return { erro: "Não foi possível logar no site" };
  }
}

async function cadastrarClientes(cliente) {
  const { cpf, nome, telefone, endereco, uf, cidade, numero, email, senha } = cliente;
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const request = new mssql.Request();

    request.input("cpfCliente", mssql.VarChar(14), cpf);
    request.input("nomeCliente", mssql.VarChar(100), nome);
    request.input("telefoneCliente", mssql.VarChar(15), telefone);
    request.input("enderecoCliente", mssql.VarChar(100), endereco);
    request.input("ufc", mssql.VarChar(2), uf);
    request.input("cidadeC", mssql.VarChar(50), cidade);
    request.input("numeroC", mssql.VarChar(10), numero);
    request.input("emailCliente", mssql.VarChar(80), email);
    request.input("senhaCliente", mssql.VarChar(255), senhaHash);

    const query = `
      INSERT INTO daroca.Clientes
      (cpf, nome, telefone, endereco, uf, cidade, numero, email, senha)
      VALUES 
      (@cpfCliente, @nomeCliente, @telefoneCliente, @enderecoCliente, @ufc, @cidadeC, @numeroC, @emailCliente, @senhaCliente)
    `;

    await request.query(query);
    return { mensagem: "Cliente inserido com sucesso" };
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return { mensagem: "Não foi possível cadastrar o cliente", erro: error.message };
  }
}

module.exports = { buscar, cadastrarClientes };
