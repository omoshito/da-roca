async function cadastrarClientes(){
    const nome =  document.getElementById('nome').value
    const email =  document.getElementById('email').value
    const dataNasc =  document.getElementById('idade').value
    const endereco =  document.getElementById('endereco').value
    const senha =  document.getElementById('senha').value
    const Csenha =  document.getElementById('confirmar-senha').value

    const cadastro = {
        nome: nome,
        email: email,
        dataNasc: dataNasc,
        endereco: endereco,
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