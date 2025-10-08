require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { conectaBD } = require("./config/db")
const darocaRoutes = require("./routes/darocaRoutes")

const app = express()
const porta = process.env.PORTA || 8090

app.use(cors({origin:"*"}))
app.use(express.json())

app.use("/daroca", darocaRoutes)

app.get("/", (req, res) => {
    res.json({mensagem : "Servidor em execução"})
})

 conectaBD()

 app.listen(porta, () => console.log(`Servidor em execução ${porta} 🚀`))
