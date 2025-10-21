const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

function autenticar(req, res, next){
    const authHeader = req.headers
}