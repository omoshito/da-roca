// produto-detalhes.js

// Fallback (mock) caso a API não responda
const fallbackProducts = [
    { id: 1, nome: "Alface Manteiga", descricao: "Alface fresca e orgânica, ideal para saladas e sanduíches", preco: 3.50, imagem: "../Imagens/Alface Manteiga.webp", categoria: "vegetais" },
    { id: 2, nome: "Banana Nanica", descricao: "Bananas doces e nutritivas, fonte de potássio", preco: 4.20, imagem: "../Imagens/Banana Nanica.jpg", categoria: "frutas" },
    { id: 3, nome: "Cenoura Orgânica", descricao: "Cenouras orgânicas, crocantes e doces", preco: 2.80, imagem: "../Imagens/cenoura.avif", categoria: "vegetais" },
    { id: 4, nome: "Feijão Preto", descricao: "Feijão preto de alta qualidade, rico em proteínas", preco: 7.50, imagem: "../Imagens/Feijão Preto.webp", categoria: "graos" },
    { id: 5, nome: "Mix de Berries", descricao: "Mistura de mirtilo e framboesa, antioxidantes naturais", preco: 12.50, imagem: "../Imagens/Mirtilo e Framboesa.avif", categoria: "frutas" },
    { id: 6, nome: "Morango Orgânico", descricao: "Morangos orgânicos, doces e suculentos", preco: 8.90, imagem: "../Imagens/Morango Orgânico.webp", categoria: "frutas" },
    { id: 7, nome: "Queijo Minas", descricao: "Queijo minas fresco, sabor tradicional", preco: 15.80, imagem: "../Imagens/Queijo Minas.jpg", categoria: "laticinios" },
    { id: 8, nome: "Tomate Orgânico", descricao: "Tomates orgânicos, perfeitos para saladas e molhos", preco: 5.60, imagem: "../Imagens/Tomate Orgânico.jpg", categoria: "vegetais" }
];

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartManager = {
    addItem: function (product) {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantidade += 1;
        } else {
            cart.push({
                id: product.id,
                nome: product.nome,
                preco: Number(product.preco || 0),
                imagem: product.imagem,
                quantidade: 1
            });
        }

        this.saveCart();
    },

    removeItem: function (productId) {
        cart = cart.filter(item => item.id !== productId);
        this.saveCart();
    },

    updateQuantity: function (productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantidade = newQuantity;
                this.saveCart();
            }
        }
    },

    getItems: function () {
        return cart;
    },

    getTotalItems: function () {
        return cart.reduce((sum, item) => sum + item.quantidade, 0);
    },

    getTotal: function () {
        return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    },

    saveCart: function () {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

class ProductDetails {
    constructor() {
        this.currentProduct = null;
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.loadProductFromUrl();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    async loadProducts() {
        try {
            if (typeof ProductAPI !== 'undefined') {
                this.products = await ProductAPI.getProducts();
            }
        } catch (e) {
            console.error('Erro ao carregar produtos da API, usando fallback.', e);
        } finally {
            if (!Array.isArray(this.products) || this.products.length === 0) {
                this.products = fallbackProducts;
            }
        }
    }

    loadProductFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            this.showError('Produto não encontrado');
            return;
        }

        this.currentProduct = this.products.find(p => p.id === parseInt(productId));

        if (!this.currentProduct) {
            this.showError('Produto não encontrado');
            return;
        }

        this.renderProduct();
        this.loadRelatedProducts();
    }

    renderProduct() {
        const container = document.getElementById('product-detail');

        container.innerHTML = `
            <div class="product-content">
                <div class="product-image-section">
                    <img src="${this.currentProduct.imagem}" alt="${this.currentProduct.nome}" class="product-main-image">
                    <div class="product-badge">${this.currentProduct.categoria}</div>
                </div>
                
                <div class="product-info-section">
                    <div class="product-category">${this.currentProduct.categoria}</div>
                    <h1>${this.currentProduct.nome}</h1>
                    <div class="product-price">R$ ${Number(this.currentProduct.preco || 0).toFixed(2).replace('.', ',')}</div>
                    
                    <div class="product-description">
                        <p>${this.currentProduct.descricao || ''}</p>
                    </div>
                    
                    <div class="product-features">
                        <h3>Características</h3>
                        <ul class="features-list">
                            <li><i class='bx bx-check-circle'></i> Produto 100% orgânico</li>
                            <li><i class='bx bx-check-circle'></i> Colhido diretamente da roça</li>
                            <li><i class='bx bx-check-circle'></i> Entrega em até 24 horas</li>
                            <li><i class='bx bx-check-circle'></i> Sem agrotóxicos</li>
                            <li><i class='bx bx-check-circle'></i> Cultivado com sustentabilidade</li>
                        </ul>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-primary" onclick="productDetails.addToCart(${this.currentProduct.id})">
                            <i class='bx bx-cart-add'></i>
                            Adicionar ao Carrinho
                        </button>
                        <a href="Catalogo.html" class="btn-secondary">
                            <i class='bx bx-arrow-back'></i>
                            Voltar
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    loadRelatedProducts() {
        const relatedProducts = this.products
            .filter(p => p.categoria === this.currentProduct.categoria && p.id !== this.currentProduct.id)
            .slice(0, 3);

        const container = document.getElementById('related-products');

        if (relatedProducts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">Nenhum produto relacionado encontrado.</p>';
            return;
        }

        container.innerHTML = relatedProducts.map(product => `
            <div class="related-product-card" onclick="productDetails.goToProduct(${product.id})">
                <img src="${product.imagem}" alt="${product.nome}">
                <div class="related-card-info">
                    <h3>${product.nome}</h3>
                    <p>${product.descricao || ''}</p>
                    <div class="related-card-price">R$ ${Number(product.preco || 0).toFixed(2).replace('.', ',')}</div>
                </div>
            </div>
        `).join('');
    }

    goToProduct(productId) {
        window.location.href = `Produto_detalhes.html?id=${productId}`;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        cartManager.addItem(product);
        this.updateCartDisplay();
        this.showNotification(`${product.nome} adicionado ao carrinho!`);
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = cartManager.getTotalItems();

        if (!cartCount) return;

        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }

    showNotification(message) {
        const notification = document.getElementById('cart-notification');
        if (!notification) return;
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    showError(message) {
        const container = document.getElementById('product-detail');
        container.innerHTML = `
            <div class="loading">
                <i class='bx bx-error-circle'></i>
                <p>${message}</p>
                <a href="Catalogo.html" class="btn-secondary" style="margin-top: 1rem;">
                    <i class='bx bx-arrow-back'></i>
                    Voltar ao Catálogo
                </a>
            </div>
        `;
    }

    setupEventListeners() {
        // Cart modal
        const cartBtn = document.getElementById('cart-btn');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.querySelector('.close-cart');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.openCartModal();
            });
        }

        if (closeCart && cartModal) {
            closeCart.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });

            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Funcionalidade de checkout em desenvolvimento!');
            });
        }
    }

    openCartModal() {
        const modal = document.getElementById('cart-modal');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        const items = cartManager.getItems();

        if (!cartItems || !cartTotal || !modal) return;

        if (items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class='bx bx-cart'></i>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = items.map(item => `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="cart-item-info">
                        <h4>${item.nome}</h4>
                        <p class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="productDetails.updateQuantity(${item.id}, ${item.quantidade - 1})">-</button>
                        <span class="quantity">${item.quantidade}</span>
                        <button class="quantity-btn" onclick="productDetails.updateQuantity(${item.id}, ${item.quantidade + 1})">+</button>
                        <button class="remove-item" onclick="productDetails.removeFromCart(${item.id})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        cartTotal.textContent = cartManager.getTotal().toFixed(2).replace('.', ',');
        modal.style.display = 'flex';
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            cartManager.removeItem(productId);
        } else {
            cartManager.updateQuantity(productId, newQuantity);
        }
        this.updateCartDisplay();
        this.openCartModal(); // Refresh modal
    }

    removeFromCart(productId) {
        cartManager.removeItem(productId);
        this.updateCartDisplay();
        this.openCartModal(); // Refresh modal
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productDetails = new ProductDetails();
});
