const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

function autenticar(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ msg: "Token não fornecido" });

  const header = authHeader.split(" ");
  const token = header[1];
  console.log("token: ", token);

  if (!token) return res.status(401).json({ msg: "Token não fornecido" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "Token inválido ou expirado" });
    req.user = user;
    next();
  });
}

module.exports = { autenticar };


function verificaLogin() {
  const token = localStorage.getItem("token");

  const botaoLogin = document.getElementById("btn-login");
  const botaoLogout = document.getElementById("btn-logout");

  if (token) {
    //Quado o usário estiver logado
    if (botaoLogin) botaoLogin.style.display = "none";
    if (botaoLogout) botaoLogout.style.display = "block";
  } 
  else {
    //O usuário não logado
    if (botaoLogin) botaoLogin.style.display = "block";
    if (botaoLogout) botaoLogout.style.display = "none";
  }

}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", verificarLoginGlobal);