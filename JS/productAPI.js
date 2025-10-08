// API Real para produtos conectada ao backend
class ProductAPI {
    static API_URL = 'http://localhost:8090/daroca';

    static async getProducts() {
        try {
            const response = await fetch(`${this.API_URL}/produtos`);
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            const produtos = await response.json();
            
            // Formata os produtos para manter compatibilidade com o frontend
            return produtos.map(produto => ({
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao || '',
                valor: produto.valor ? `R$ ${parseFloat(produto.valor).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
                preco: produto.valor ? parseFloat(produto.valor) : 0,
                imagem: produto.imagem || '../Imagens/default.png',
                categoria: produto.categoria || 'outros',
                estoque: produto.estoque || 0
            }));
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            // Retorna array vazio em caso de erro
            return [];
        }
    }

    static async searchProducts(query) {
        const products = await this.getProducts();
        return products.filter(product =>
            product.nome.toLowerCase().includes(query.toLowerCase()) ||
            product.descricao.toLowerCase().includes(query.toLowerCase())
        );
    }

    static async getProductsByCategory(category) {
        const products = await this.getProducts();
        if (category === 'all') return products;
        return products.filter(product => product.categoria === category);
    }
}

// Export para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductAPI;
}