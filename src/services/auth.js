const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

function autenticar(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.status(401).json({ msg: "Token não fornecido" });

    const header = authHeader.split("");
    const token = header[1];
    console.log("token: ", token)

    if (!token) return res.status(401).json({ msg: "Token não fornecido" });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Token inválido ou expirado" });
        req.user = user;
        next();
    });
}

module.exports = {autenticar};