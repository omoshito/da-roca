// Função para validar CPF usando o algoritmo padrão
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
        return false;
    }
    
    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf.charAt(10)) !== digitoVerificador2) {
        return false;
    }
    
    return true;
}

// Função para aplicar máscara de CPF
function aplicarMascaraCPF(valor) {
    // Remove caracteres não numéricos
    valor = valor.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return valor;
}

// Adiciona event listener para máscara de CPF quando o documento carregar
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = aplicarMascaraCPF(e.target.value);
        });
    }
});

async function cadastrarCliente() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const cep = document.getElementById('cep').value.trim();
    const logradouro = document.getElementById('logradouro').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const complemento = document.getElementById('complemento').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value.trim();
    const senha = document.getElementById('senha').value;
    const confsenha = document.getElementById('confirmar-senha').value;

    // Valida campos obrigatórios mínimos (já tem required no HTML, mas reforça)
    const camposObrigatorios = [
        { nome: 'Nome', valor: nome },
        { nome: 'E-mail', valor: email },
        { nome: 'CPF', valor: cpf },
        { nome: 'Data de nascimento', valor: idade },
        { nome: 'Logradouro', valor: logradouro },
        { nome: 'Número', valor: numero },
        { nome: 'Bairro', valor: bairro },
        { nome: 'Cidade', valor: cidade },
        { nome: 'Estado', valor: estado },
        { nome: 'Senha', valor: senha },
        { nome: 'Confirmar senha', valor: confsenha },
    ];

    const faltando = camposObrigatorios.find(c => !c.valor);
    if (faltando) {
        alert(`Por favor, preencha o campo: ${faltando.nome}`);
        return;
    }

    // Senhas
    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    if (senha !== confsenha) {
        alert('As senhas não coincidem.');
        return;
    }

    // Validação de CPF
    if (!validarCPF(cpf)) {
        alert('CPF inválido. Por favor, verifique o número digitado.');
        return;
    }

    // Remove formatação do CPF para enviar apenas números
    const cpfLimpo = cpf.replace(/[^\d]/g, '');

    const clienteData = {
        cpf: cpfLimpo,
        nome: nome,
        email: email,
        telefone: telefone,
        data: idade,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        senha: senha
    };

    try {
        const botao = document.querySelector('.btn-primary');
        if (botao) {
            botao.textContent = 'Enviando...';
            botao.disabled = true;
        }

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

        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        window.location.href = 'Login.html';
        return data;
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert(`Erro ao cadastrar: ${error.message}`);
        throw error;
    } finally {
        const botao = document.querySelector('.btn-primary');
        if (botao) {
            botao.textContent = 'Criar conta';
            botao.disabled = false;
        }
    }
}
