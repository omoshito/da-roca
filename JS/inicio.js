/*Quando o usário logar vai aparecer uma mensagem de usuario conectado, e também 
um botão caso o usuário queira sair */

const usuario = localStorage.getItem("usuario");
const navUser = document.getElementById("usuario-logado");

if (usuario) {
    navUser.innerHTML = `
  <span>Usuário conectado</span>
  <a id="logout-btn" class="logout-link">Sair</a>
`;

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        location.reload();
    });


} else {
    navUser.innerHTML = `<a href="login-cadastro.html">Entrar / Cadastrar</a>`;
}
