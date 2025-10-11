async function cadastrarCliente() {

    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const telefone = document.getElementById('telefone').value
    const data = document.getElementById('data').value
    const senha = document.getElementById('senha').value
    const cep = document.getElementById('cep').value
    const confsenha = document.getElementById('confirmar-senha').value

    const clienteData = {
        nome: nome,
        email: email,
        telefone: telefone,
        data: data,
        senha: senha,
        cep: cep
    };

        try {
            const response = await fetch('http://localhost:8090/daroca/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao cadastrar cliente');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            throw error;
        }
    }