document.addEventListener("DOMContentLoaded", function () {
  const loginToggle = document.getElementById("login-toggle");
  const registerToggle = document.getElementById("register-toggle");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginEmail = document.getElementById("login-email");
  const registerName = document.getElementById("register-name");

  // Alternar entre Login e Cadastro
  loginToggle.addEventListener("click", function () {
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    loginForm.setAttribute("aria-hidden", "false");
    registerForm.setAttribute("aria-hidden", "true");
    loginEmail.focus();
  });

  registerToggle.addEventListener("click", function () {
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    registerForm.setAttribute("aria-hidden", "false");
    loginForm.setAttribute("aria-hidden", "true");
    registerName.focus();
  });
document.getElementById("register").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome =  document.getElementById('register-name').value
    const email =  document.getElementById('register-email').value
    const telefone =  document.getElementById('register-phone').value
    const cidade =  document.getElementById('register-city').value
    const cpf =  document.getElementById('register-cpf').value
    const endereco =  document.getElementById('register-address').value
    const uf =  document.getElementById('register-state').value 
    const numero =  document.getElementById('register-number').value
    const senha =  document.getElementById('register-password').value
    const Csenha =  document.getElementById('confirm-password').value

    const cadastro = {
        nome : nome,
        email: email,
        cpf:cpf,
        endereco: endereco,
        telefone: telefone,
        cidade: cidade,
        uf: uf,
        numero: numero,
        senha: senha
    }

    if (senha !== Csenha){
        alert("As senhas não coincidem")
        return
    }
   try{
    console.log(cadastro)
    const response = await fetch('http://localhost:8090/clientes',{
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(cadastro)
    })
   if (!response.ok) {
        throw new Error("Erro ao cadastrar cliente")
        }

        const data = await  response.json()
        
        console.log("Cliente cadastrado com sucesso:", data)
        alert("Cadastro realizado com sucesso!")

    } 
    catch (error) {
        console.error(error)
        alert("Não foi possível realizar o cadastro.")
    }
  });
});