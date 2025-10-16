require('dotenv').config()
const mssql = require('mssql')
const connectionString = process.env.CONNECTION_STRING

async function conectaBD(){
    try{
        await mssql.connect(connectionString)
        console.log("Banco de dados inserido com sucesso")
    }
    catch(error){
        console.error("Erro ao conectar no banco de dados", error);
    }
}

module.exports = {mssql, conectaBD}