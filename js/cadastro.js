async function cadastrarClientes(){
    const nome =  document.getElementById('register-name').value
    const email =  document.getElementById('register-email').value
    //const dataNasc =  document.getElementById('idade').value
    //const endereco =  document.getElementById('register-phone').value
    const senha =  document.getElementById('register-password').value
    const Csenha =  document.getElementById('confirm-password').value

    const cadastro = {
        nome: nome,
        email: email,
        //dataNasc: dataNasc,
        //endereco: endereco,
        senha: senha
    }

    if (senha !== Csenha){
        alert("As senhas não coincidem")
    }
   try{
    const response = await fetch('http://localhost:8090/daroca/clientes',{
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

    } 
    catch (error) {
        console.error(error)
        alert("Não foi possível realizar o cadastro.")
    }
}