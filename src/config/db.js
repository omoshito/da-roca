require('dotenv').config()
const mssql = require('mssql')
const connectionString = process.env.CONNECTION_STRING

let pool = null

async function conectaBD(){
    try{
        pool = await mssql.connect(connectionString)
        console.log("Banco de dados inserido com sucesso")
        return pool
    }
    catch(error){
        console.error("Erro ao conectar no banco de dados", error);
        throw error
    }
}

function getPool() {
    if (!pool) {
        throw new Error("Banco de dados não está conectado")
    }
    return pool
}

module.exports = {mssql, conectaBD, getPool}