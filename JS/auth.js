// API de autenticação e gerenciamento de clientes
class AuthAPI {
    static API_URL = 'http://localhost:8090/daroca';

    // Login do cliente
    static async login(email, senha) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Credenciais inválidas');
            }

            // Salva sessão (ajuste conforme payload retornado pelo backend)
            this.salvarSessao(data);
            return data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    }

    // Cadastrar novo cliente
    static async cadastrarCliente(clienteData) {
        try {
            const response = await fetch(`${this.API_URL}/clientes`, {
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

    // Atualizar cliente
    static async atualizarCliente(cpf, clienteData) {
        try {
            const response = await fetch(`${this.API_URL}/clientes/${cpf}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao atualizar cliente');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    }

    // Excluir cliente
    static async excluirCliente(cpf) {
        try {
            const response = await fetch(`${this.API_URL}/clientes/${cpf}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao excluir cliente');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            throw error;
        }
    }

    // Salvar sessão do usuário
    static salvarSessao(usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }

    // Obter usuário da sessão
    static obterSessao() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }

    // Limpar sessão
    static limparSessao() {
        localStorage.removeItem('usuario');
    }

    // Verificar se está logado
    static estaLogado() {
        return this.obterSessao() !== null;
    }

    // Logout conveniente
    static logout() {
        this.limparSessao();
    }
}

// Export para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthAPI;
}
