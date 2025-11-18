
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
    if(!senha||!email||!cpf||!endereco||!telefone||!cidade||!uf||!numero ){
        alert("Preencha os campos corretamente")
        return
    }
    if(cpf.length < 11 || cpf.length > 11)
    {
      alert("CPF invalido")
      return
    }
    if(telefone.length < 11 || telefone.length > 11)
    {
      alert("Número inválido")
      return
    }
    if(uf.length > 2 || uf.length < 2)
    {
      alert("UF invalida")
      return
    }

    if (senha !== Csenha)
      {
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

        const data = await response.json()
        
        console.log("Cliente cadastrado com sucesso:", data)
        alert("Cadastro realizado com sucesso!")
        
        // Fazer login automático após cadastro
        await fazerLoginAutomatico(email, senha)

    } 
    catch (error) {
        console.error(error)
        alert("Não foi possível realizar o cadastro.")
    }
  });

  // Função para fazer login automático após cadastro
  async function fazerLoginAutomatico(email, senha) {
    try {
        const response = await fetch("http://localhost:8090/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });
        
        const usuario = await response.json();
        
        if (usuario.token) {
            // Salvar token e dados do usuário
            localStorage.setItem("token", usuario.token);
            localStorage.setItem("userData", JSON.stringify({
                email: email,
                nome: usuario.nome || nome, // usar nome do cadastro
                ...usuario
            }));
            
            alert("Login automático realizado! Redirecionando...");
            
            // Redirecionar após um breve delay
            setTimeout(() => {
                window.location.href = "../HTML/Inicio.html";
            }, 1500);
        }
    } catch (error) {
        console.error("Erro no login automático:", error);
        // Se falhar o login automático, apenas mostra mensagem de sucesso no cadastro
        alert("Cadastro realizado! Faça login para continuar.");
    }
  }
})