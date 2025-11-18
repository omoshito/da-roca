const form = document.getElementById('login');

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-password').value;

    if (email === "" || senha === "") {
        mostrarMensagem("Preencha os dois campos!", "red");
        return;
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email, 
            senha: senha
        })
    };

    try {
        const result = await fetch("http://localhost:8090/login", options);
        const usuario = await result.json(); 

        if (usuario.token) {
            // Salvar token e dados do usuário
            localStorage.setItem("token", usuario.token);
            localStorage.setItem("userData", JSON.stringify({
                email: email,
                nome: usuario.nome || email.split('@')[0],
                ...usuario
            }));
            
            mostrarMensagem("Login realizado com sucesso! Redirecionando...", "green");
            
            // Redirecionar após um breve delay
            setTimeout(() => {
                window.location.href = "../HTML/Inicio.html";
            }, 1500);
        } else {
            mostrarMensagem("Email e/ou senha incorretos!", "red");
        }
    } catch (error) {
        console.error("Erro ao conectar", error);
        mostrarMensagem("Erro no servidor. Tente novamente.", "red");
    }
});

function mostrarMensagem(texto, cor) {
    const mens = document.getElementById("mens");
    mens.innerText = texto;
    mens.style.color = cor;
}

