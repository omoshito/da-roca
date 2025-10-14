// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    // Array que armazenará todos os produtos disponíveis no catálogo
    let products = [];
    // Array do carrinho, carregado do localStorage ou inicializado vazio
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Seleciona elementos do DOM para manipulação
    const productList = document.getElementById('product-list'); // Container dos produtos
    const filterBtns = document.querySelectorAll('.filter-btn'); // Botões de filtro de categoria
    const searchInput = document.getElementById('search-product'); // Campo de busca
    const cartModal = document.getElementById('cart-modal'); // Modal do carrinho
    const cartItemsContainer = document.getElementById('cart-items'); // Lista de itens no carrinho
    const cartTotal = document.getElementById('cart-total'); // Total do carrinho
    const cartCount = document.getElementById('cart-count'); // Contador de itens no botão do carrinho

    // Fallback local (mock) — usado apenas se a API não retornar produtos
    /*const mockProducts = [
        { id: 1, nome: "Alface Manteiga", descricao: "Alface fresca e crocante, ideal para saladas", valor: "R$ 3,50", preco: 3.50, imagem: "../Imagens/Alface Manteiga.webp", categoria: "vegetais" },
        { id: 2, nome: "Banana Nanica", descricao: "Bananas doces e nutritivas, perfeitas para vitaminas", valor: "R$ 4,80", preco: 4.80, imagem: "../Imagens/Banana Nanica.jpg", categoria: "frutas" },
        { id: 3, nome: "Cenoura", descricao: "Cenouras frescas, ricas em vitamina A", valor: "R$ 2,90", preco: 2.90, imagem: "../Imagens/cenoura.avif", categoria: "vegetais" },
        { id: 4, nome: "Feijão Preto", descricao: "Feijão preto de alta qualidade, rico em proteínas", valor: "R$ 7,20", preco: 7.20, imagem: "../Imagens/Feijão Preto.webp", categoria: "graos" },
        { id: 5, nome: "Mix de Berries", descricao: "Mistura de mirtilo e framboesa, antioxidantes naturais", valor: "R$ 12,50", preco: 12.50, imagem: "../Imagens/Mirtilo e Framboesa.avif", categoria: "frutas" },
        { id: 6, nome: "Morango Orgânico", descricao: "Morangos orgânicos, doces e suculentos", valor: "R$ 8,90", preco: 8.90, imagem: "../Imagens/Morango Orgânico.webp", categoria: "frutas" },
        { id: 7, nome: "Queijo Minas", descricao: "Queijo minas fresco, sabor tradicional", valor: "R$ 15,80", preco: 15.80, imagem: "../Imagens/Queijo Minas.jpg", categoria: "laticinios" },
        { id: 8, nome: "Tomate Orgânico", descricao: "Tomates orgânicos, perfeitos para saladas e molhos", valor: "R$ 5,60", preco: 5.60, imagem: "../Imagens/Tomate Orgânico.jpg", categoria: "vegetais" }
    ];*/

    // Inicialização assíncrona: busca produtos na API real com fallback para mocks
    (async function init() {
        try {
           const resposta = await fetch('http://localhost:8090/daroca/produtos')
           if (!resposta.ok) throw new Error ("Erro HTTP: ")
           products = await resposta.json()
           console.log(resposta.json())

        } catch (e) {
            console.error('Erro carregando produtos da API, usando mocks.', e);
        } finally {
            if (!Array.isArray(products) || products.length === 0) {
                products = mockProducts;
            }
            if (productList) renderProducts(products);
            updateCartDisplay();
        }
    })();

    /**
     * Renderiza os produtos filtrados na grade de produtos
     * @param {Array} filteredProducts - Array de produtos a serem exibidos
     */
    function renderProducts(filteredProducts) {
        if (!productList) return;
        productList.innerHTML = '';

        // Se não houver produtos, exibe mensagem de "nenhum produto encontrado"
        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
            return;
        }

        // Cria um card para cada produto e adiciona à grade
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.category = product.categoria;
            productCard.innerHTML = `
                <img src="${product.imagem}" alt="${product.nome}" loading="lazy">
                <div class="product-info">
                    <h3>${product.nome}</h3>
                    <p>${product.descricao || ''}</p>
                    <div class="product-price">${product.valor || `R$ ${Number(product.preco||0).toFixed(2).replace('.', ',')}`} / kg</div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class='bx bx-cart-add'></i> Adicionar
                        </button>
                        <button class="details-btn" data-id="${product.id}">
                            <i class='bx bx-info-circle'></i> Detalhes
                        </button>
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    // Event listener para botões de filtro de categoria (Todos, Frutas, Vegetais, etc.)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e adiciona ao botão clicado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Obtém a categoria selecionada e o termo de busca atual
            const filterCategory = btn.dataset.filter;
            const searchTerm = (searchInput?.value || '').toLowerCase();

            // Filtra e renderiza os produtos
            filterAndSearchProducts(filterCategory, searchTerm);
        });
    });

    // Event listener para o campo de busca (filtra produtos enquanto o usuário digita)
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            // Obtém a categoria ativa no momento
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

            filterAndSearchProducts(activeFilter, searchTerm);
        });
    }

    /**
     * Função combinada que filtra produtos por categoria E termo de busca
     * @param {string} category - Categoria selecionada ('all', 'frutas', 'vegetais', etc.)
     * @param {string} searchTerm - Termo de busca digitado pelo usuário
     */
    function filterAndSearchProducts(category, searchTerm) {
        const filteredProducts = products.filter(product => {
            // Verifica se o produto corresponde à categoria selecionada
            const matchesCategory = category === 'all' || product.categoria === category;
            // Verifica se o produto corresponde ao termo de busca (nome ou descrição)
            const matchesSearch = searchTerm === '' ||
                (product.nome || '').toLowerCase().includes(searchTerm) ||
                (product.descricao || '').toLowerCase().includes(searchTerm);

            // Retorna true apenas se ambas as condições forem satisfeitas
            return matchesCategory && matchesSearch;
        });

        renderProducts(filteredProducts);
    }

    /**
     * Adiciona um produto ao carrinho ou incrementa sua quantidade se já existir
     * @param {number} productId - ID do produto a ser adicionado
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return; // Se o produto não existir, sai da função

        // Verifica se o produto já está no carrinho
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            // Se já existe, incrementa a quantidade
            existingItem.quantidade += 1;
        } else {
            // Se não existe, adiciona o produto ao carrinho com quantidade 1
            cart.push({
                id: product.id,
                nome: product.nome,
                preco: Number(product.preco || 0),
                valor: product.valor || `R$ ${Number(product.preco||0).toFixed(2).replace('.', ',')}`,
                imagem: product.imagem,
                quantidade: 1
            });
        }

        // Salva o carrinho no localStorage e atualiza o display
        saveCart();
        updateCartDisplay();
        showCartNotification('Produto adicionado ao carrinho!');
    }

    /**
     * Remove um produto completamente do carrinho
     * @param {number} productId - ID do produto a ser removido
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartDisplay();
        renderCartItems();
    }

    /**
     * Atualiza a quantidade de um produto no carrinho
     * @param {number} productId - ID do produto
     * @param {number} newQuantity - Nova quantidade (se <= 0, remove o produto)
     */
    function updateCartQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                // Se a quantidade for 0 ou negativa, remove o produto
                removeFromCart(productId);
            } else {
                // Caso contrário, atualiza a quantidade
                item.quantidade = newQuantity;
                saveCart();
                updateCartDisplay();
                renderCartItems();
            }
        }
    }

    /**
     * Salva o carrinho no localStorage para persistência entre sessões
     */
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    /**
     * Atualiza o contador de itens no botão do carrinho
     */
    function updateCartDisplay() {
        // Soma total de todos os itens (considerando quantidades)
        const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
        if (!cartCount) return;

        cartCount.textContent = totalItems;

        // Mostra ou esconde o contador conforme há itens ou não
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }

    /**
     * Calcula o valor total do carrinho
     * @returns {number} Valor total em reais
     */
    function calculateCartTotal() {
        return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    /**
     * Renderiza os itens do carrinho no modal
     */
    function renderCartItems() {
        if (!cartItemsContainer || !cartTotal) return;

        // Se o carrinho estiver vazio, exibe mensagem
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            cartTotal.textContent = 'R$ 0,00';
            return;
        }

        // Gera HTML para cada item do carrinho com botões de controle
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="cart-item-price">${item.valor}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantidade - 1})">-</button>
                    <span class="quantity">${item.quantidade}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantidade + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `).join('');

        // Calcula e exibe o total do carrinho formatado
        const total = calculateCartTotal();
        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    /**
     * Redireciona para a página de detalhes do produto
     * @param {number} productId - ID do produto
     */
    function goToProductDetails(productId) {
        window.location.href = `Produto_detalhes.html?id=${productId}`;
    }

    /**
     * Exibe uma notificação toast temporária na tela
     * @param {string} message - Mensagem a ser exibida
     */
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Mostra a notificação com animação após 100ms
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove a notificação após 2 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Event listener delegado para cliques nos botões dos produtos
    if (productList) {
        productList.addEventListener('click', (e) => {
            // Verifica se o clique foi no botão de adicionar ao carrinho
            if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
                const productId = parseInt(btn.dataset.id);
                addToCart(productId);
            }

            // Verifica se o clique foi no botão de detalhes
            if (e.target.classList.contains('details-btn') || e.target.closest('.details-btn')) {
                const btn = e.target.classList.contains('details-btn') ? e.target : e.target.closest('.details-btn');
                const productId = parseInt(btn.dataset.id);
                goToProductDetails(productId);
            }
        });
    }

    // Event listener para abrir o modal do carrinho
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            renderCartItems();
        });
    }

    // Event listener para fechar o modal do carrinho
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    // Event listener para botão de finalizar compra (checkout)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            // Placeholder para futura integração com sistema de pagamento
            alert('Funcionalidade de checkout em desenvolvimento!');
            // Aqui você implementaria a integração com sistema de pagamento
        });
    }

    // Fecha o modal ao clicar fora dele (no fundo escuro)
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Torna as funções globais para permitir chamadas inline nos botões HTML
    window.updateCartQuantity = updateCartQuantity;
    window.removeFromCart = removeFromCart;
});
