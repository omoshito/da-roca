class CarrinhoCompras {
  constructor() {
    this.items = this.carregarCarrinho();
    this.init();
  }

  // Inicializa o carrinho
  init() {
    this.renderizarCarrinho();
    this.atualizarResumo();
    this.configurarEventos();
    this.atualizarContadorHeader();
  }

  // Carrega o carrinho do localStorage
  carregarCarrinho() {
    try {
      const carrinhoSalvo = localStorage.getItem("carrinho_daroca");
      return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      return [];
    }
  }

  // Salva o carrinho no localStorage
  salvarCarrinho() {
    try {
      localStorage.setItem("carrinho_daroca", JSON.stringify(this.items));
      this.dispatchCarrinhoEvent();
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }

  // Dispara evento customizado quando carrinho muda
  dispatchCarrinhoEvent() {
    const event = new CustomEvent("carrinhoAtualizado", {
      detail: { items: this.items, total: this.getTotalItens() },
    });
    window.dispatchEvent(event);
  }

  // Adiciona produto ao carrinho
  adicionarProduto(produto) {
    if (!produto || !produto.id) {
      console.error("Produto inválido");
      return;
    }

    const itemExistente = this.items.find((item) => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade++;
      this.mostrarNotificacao(`Quantidade de ${produto.nome} aumentada!`);
    } else {
      this.items.push({
        ...produto,
        quantidade: 1,
      });
      this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }

    this.salvarCarrinho();
    this.atualizarInterface();
  }

  // Remove produto do carrinho completamente
  removerProduto(produtoId) {
    const item = this.items.find((item) => item.id === produtoId);
    if (!item) return;

    const confirmacao = confirm(`Remover ${item.nome} do carrinho?`);

    if (confirmacao) {
      this.items = this.items.filter((item) => item.id !== produtoId);
      this.salvarCarrinho();
      this.atualizarInterface();
      this.mostrarNotificacao(`${item.nome} removido do carrinho`, "error");
    }
  }

  // Aumenta quantidade do produto
  aumentarQuantidade(produtoId) {
    const item = this.items.find((item) => item.id === produtoId);
    if (item) {
      item.quantidade++;
      this.salvarCarrinho();
      this.atualizarInterface();
    }
  }

  // Diminui quantidade do produto
  diminuirQuantidade(produtoId) {
    const item = this.items.find((item) => item.id === produtoId);
    if (item) {
      if (item.quantidade > 1) {
        item.quantidade--;
        this.salvarCarrinho();
        this.atualizarInterface();
      } else {
        this.removerProduto(produtoId);
      }
    }
  }

  // Atualiza quantidade específica do produto
  atualizarQuantidade(produtoId, novaQuantidade) {
    if (novaQuantidade <= 0) {
      this.removerProduto(produtoId);
      return;
    }

    const item = this.items.find((item) => item.id === produtoId);
    if (item) {
      item.quantidade = Math.max(1, parseInt(novaQuantidade) || 1);
      this.salvarCarrinho();
      this.atualizarInterface();
    }
  }

  // Atualiza toda a interface
  atualizarInterface() {
    this.renderizarCarrinho();
    this.atualizarResumo();
    this.atualizarContadorHeader();
  }

  // Limpa todo o carrinho
  limparCarrinho() {
    if (this.items.length === 0) {
      this.mostrarNotificacao("O carrinho já está vazio", "warning");
      return;
    }

    const totalItens = this.getTotalItens();
    const confirmacao = confirm(
      `Tem certeza que deseja remover todos os ${totalItens} itens do carrinho?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmacao) {
      this.items = [];
      this.salvarCarrinho();
      this.atualizarInterface();
      this.mostrarNotificacao("Carrinho limpo com sucesso", "error");
    }
  }

  // Renderiza os itens do carrinho
  renderizarCarrinho() {
    const container = document.getElementById("cart-items");
    const emptyMessage = document.getElementById("empty-cart-message");

    if (!container) {
      console.error("Container do carrinho não encontrado");
      return;
    }

    if (this.items.length === 0) {
      container.innerHTML = "";
      if (emptyMessage) emptyMessage.style.display = "block";
      return;
    }

    if (emptyMessage) emptyMessage.style.display = "none";

    container.innerHTML = this.items
      .map(
        (item, index) => `
      <div class="cart-item" data-id="${
        item.id
      }" style="animation: fadeInUp 0.3s ease-out ${index * 0.1}s both">
        <div class="cart-item-image-wrapper">
          <img 
            src="${
              item.imagem ||
              "https://via.placeholder.com/100x100/f0f0f0/666?text=Produto"
            }" 
            alt="${item.nome}" 
            class="cart-item-image"
            onerror="this.src='https://via.placeholder.com/100x100/f0f0f0/666?text=Erro'"
          />
        </div>
        
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.nome}</h3>
          <p class="cart-item-description">${
            item.descricao || "Produto fresco e natural"
          }</p>
          <div class="cart-item-price-info">
            <span class="unit-price">${this.formatarPreco(
              this.extrairValorNumerico(item.valor)
            )}</span>
            <span class="total-price">${this.formatarPreco(
              this.extrairValorNumerico(item.valor) * item.quantidade
            )}</span>
          </div>
        </div>
        
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button 
              class="quantity-btn quantity-decrease" 
              onclick="carrinho.diminuirQuantidade(${item.id})"
              aria-label="Diminuir quantidade"
              ${
                item.quantidade <= 1 ? 'title="Clique para remover o item"' : ""
              }
            >
              <i class='bx bx-minus'></i>
            </button>
            
            <div class="quantity-input-wrapper">
              <input 
                type="number" 
                class="quantity-input" 
                value="${item.quantidade}" 
                min="1" 
                max="99"
                onchange="carrinho.atualizarQuantidade(${item.id}, this.value)"
                onblur="carrinho.atualizarQuantidade(${item.id}, this.value)"
                aria-label="Quantidade do produto"
              />
              <span class="quantity-unit">kg</span>
            </div>
            
            <button 
              class="quantity-btn quantity-increase" 
              onclick="carrinho.aumentarQuantidade(${item.id})"
              aria-label="Aumentar quantidade"
            >
              <i class='bx bx-plus'></i>
            </button>
          </div>
          
          <button 
            class="remove-item-btn" 
            onclick="carrinho.removerProduto(${item.id})"
            aria-label="Remover ${item.nome} do carrinho"
          >
            <i class='bx bx-trash'></i>
            <span>Remover</span>
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Atualiza o resumo do pedido
  atualizarResumo() {
    const subtotal = this.calcularSubtotal();
    const desconto = this.calcularDesconto(subtotal);
    const subtotalComDesconto = subtotal - desconto;
    const frete = this.calcularFrete(subtotalComDesconto);
    const total = subtotalComDesconto + frete;

    // Atualizar elementos do DOM
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (subtotalElement) {
      subtotalElement.textContent = this.formatarPreco(subtotal);
    }

    if (shippingElement) {
      if (frete === 0) {
        shippingElement.innerHTML = '<span class="free-shipping">Grátis</span>';
      } else {
        shippingElement.textContent = this.formatarPreco(frete);
      }
    }

    if (totalElement) {
      totalElement.textContent = this.formatarPreco(total);
    }

    // Adicionar linha de desconto se houver
    this.exibirDesconto(desconto);

    // Atualizar botão de checkout
    if (checkoutBtn) {
      checkoutBtn.disabled = this.items.length === 0;
      checkoutBtn.innerHTML =
        this.items.length === 0
          ? '<i class="bx bx-cart"></i> Carrinho Vazio'
          : `<i class="bx bx-check-circle"></i> Finalizar Compra (${this.formatarPreco(
              total
            )})`;
    }

    // Mostrar informações de frete grátis
    this.exibirInfoFreteGratis(subtotalComDesconto);
  }

  // Exibe informações sobre desconto
  exibirDesconto(desconto) {
    let descontoRow = document.querySelector(".summary-row.discount");

    if (desconto > 0) {
      if (!descontoRow) {
        descontoRow = document.createElement("div");
        descontoRow.className = "summary-row discount";

        const subtotalRow = document.querySelector(
          ".summary-details .summary-row"
        );
        subtotalRow.parentNode.insertBefore(
          descontoRow,
          subtotalRow.nextSibling
        );
      }

      descontoRow.innerHTML = `
        <span>Desconto (5%):</span>
        <span class="discount-value">-${this.formatarPreco(desconto)}</span>
      `;
    } else if (descontoRow) {
      descontoRow.remove();
    }
  }

  // Exibe informações sobre frete grátis
  exibirInfoFreteGratis(subtotal) {
    const FRETE_GRATIS_VALOR = 50;
    let infoElement = document.querySelector(".frete-info");

    if (subtotal > 0 && subtotal < FRETE_GRATIS_VALOR) {
      const faltam = FRETE_GRATIS_VALOR - subtotal;

      if (!infoElement) {
        infoElement = document.createElement("div");
        infoElement.className = "frete-info";
        const summaryDetails = document.querySelector(".summary-details");
        summaryDetails.parentNode.insertBefore(
          infoElement,
          summaryDetails.nextSibling
        );
      }

      infoElement.innerHTML = `
        <div class="frete-gratis-info">
          <i class="bx bx-truck"></i>
          <span>Faltam ${this.formatarPreco(
            faltam
          )} para <strong>frete grátis!</strong></span>
        </div>
      `;
    } else if (infoElement) {
      infoElement.remove();
    }
  }

  // Calcula o subtotal
  calcularSubtotal() {
    return this.items.reduce((total, item) => {
      const preco = this.extrairValorNumerico(item.valor);
      const quantidade = parseInt(item.quantidade) || 0;
      return total + preco * quantidade;
    }, 0);
  }

  // Calcula o frete
  calcularFrete(subtotal) {
    const FRETE_GRATIS_VALOR = 50; // Frete grátis acima de R$ 50
    const FRETE_FIXO = 10; // Frete fixo de R$ 10

    if (this.items.length === 0) return 0;
    if (subtotal >= FRETE_GRATIS_VALOR) return 0;

    return FRETE_FIXO;
  }

  // Calcula desconto (se houver)
  calcularDesconto(subtotal) {
    const DESCONTO_VALOR_MINIMO = 100; // Desconto acima de R$ 100
    const PERCENTUAL_DESCONTO = 0.05; // 5% de desconto

    if (subtotal >= DESCONTO_VALOR_MINIMO) {
      return subtotal * PERCENTUAL_DESCONTO;
    }

    return 0;
  }

  // Extrai valor numérico de strings como "R$ 5,00" ou números
  extrairValorNumerico(valor) {
    if (typeof valor === "number") return valor;
    if (!valor) return 0;

    // Se é string, limpa e converte
    const valorLimpo = valor
      .toString()
      .replace(/[R$\s]/g, "")
      .replace(",", ".");

    const numeroConvertido = parseFloat(valorLimpo);
    return isNaN(numeroConvertido) ? 0 : numeroConvertido;
  }

  // Formata preço para exibição
  formatarPreco(valor) {
    const numero =
      typeof valor === "number" ? valor : this.extrairValorNumerico(valor);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  }

  // Atualiza contador no header
  atualizarContadorHeader() {
    const contador = document.getElementById("header-cart-count");
    if (contador) {
      const totalItens = this.items.reduce(
        (total, item) => total + item.quantidade,
        0
      );
      contador.textContent = totalItens;
    }
  }

  // Configura event listeners
  configurarEventos() {
    // Botão limpar carrinho
    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.limparCarrinho());
    }

    // Botão finalizar compra
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => this.finalizarCompra());
    }
  }

  // Finaliza a compra
  finalizarCompra() {
    if (this.items.length === 0) {
      this.mostrarNotificacao("Seu carrinho está vazio!", "warning");
      return;
    }

    const subtotal = this.calcularSubtotal();
    const desconto = this.calcularDesconto(subtotal);
    const subtotalComDesconto = subtotal - desconto;
    const frete = this.calcularFrete(subtotalComDesconto);
    const total = subtotalComDesconto + frete;
    const totalItens = this.getTotalItens();

    // Criar modal de confirmação mais elaborado
    let resumoPedido = `RESUMO DO PEDIDO\n\n`;
    resumoPedido += `Itens (${totalItens} kg):\n`;

    this.items.forEach((item) => {
      const precoItem = this.extrairValorNumerico(item.valor);
      resumoPedido += `• ${item.nome} - ${
        item.quantidade
      }kg - ${this.formatarPreco(precoItem * item.quantidade)}\n`;
    });

    resumoPedido += `\nSubtotal: ${this.formatarPreco(subtotal)}`;
    if (desconto > 0) {
      resumoPedido += `\nDesconto: -${this.formatarPreco(desconto)}`;
    }
    resumoPedido += `\nFrete: ${
      frete === 0 ? "Grátis" : this.formatarPreco(frete)
    }`;
    resumoPedido += `\nTOTAL: ${this.formatarPreco(total)}`;
    resumoPedido += `\n\n⚠️ Esta é uma demonstração - nenhum pagamento será processado.`;

    const confirmar = confirm(resumoPedido + "\n\nDeseja finalizar a compra?");

    if (confirmar) {
      // Simular processamento
      this.mostrarNotificacao("Processando pedido...", "info");

      setTimeout(() => {
        this.mostrarNotificacao(
          `🎉 Pedido realizado com sucesso! Total: ${this.formatarPreco(
            total
          )}`,
          "success"
        );

        // Limpar carrinho após sucesso
        setTimeout(() => {
          this.items = [];
          this.salvarCarrinho();
          this.atualizarInterface();
        }, 2000);
      }, 1500);
    }
  }

  // Mostra notificação temporária melhorada
  mostrarNotificacao(mensagem, tipo = "success") {
    // Remove notificações existentes
    const existente = document.querySelector(".cart-notification");
    if (existente) existente.remove();

    const notification = document.createElement("div");
    notification.className = `cart-notification notification-${tipo}`;

    const icone =
      tipo === "success"
        ? "bx-check-circle"
        : tipo === "error"
        ? "bx-error-circle"
        : tipo === "warning"
        ? "bx-error"
        : "bx-info-circle";

    const cor =
      tipo === "success"
        ? "#28a745"
        : tipo === "error"
        ? "#dc3545"
        : tipo === "warning"
        ? "#ffc107"
        : "#17a2b8";

    notification.innerHTML = `
      <div class="notification-content">
        <i class='bx ${icone}'></i>
        <span>${mensagem}</span>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class='bx bx-x'></i>
      </button>
    `;

    // Estilos inline para a notificação
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: cor,
      color: "white",
      padding: "16px 20px",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      zIndex: "10000",
      animation: "slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      fontSize: "0.95rem",
      fontWeight: "500",
      minWidth: "300px",
      maxWidth: "400px",
      backdropFilter: "blur(10px)",
    });

    document.body.appendChild(notification);

    // Auto remove após 4 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation =
          "slideOutRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 400);
      }
    }, 4000);
  }

  // Método público para obter total de itens
  getTotalItens() {
    return this.items.reduce((total, item) => total + item.quantidade, 0);
  }
}

// Adiciona animações CSS dinamicamente
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .cart-notification {
    font-family: 'Poppins', sans-serif;
  }

  .cart-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cart-notification .notification-content i {
    font-size: 1.2rem;
  }

  .cart-notification .notification-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .cart-notification .notification-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .cart-item-image-wrapper {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;
    background: #f8f9fa;
  }

  .cart-item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .cart-item:hover .cart-item-image {
    transform: scale(1.05);
  }

  .quantity-input-wrapper {
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 4px 8px;
    min-width: 80px;
  }

  .quantity-input {
    border: none;
    outline: none;
    text-align: center;
    width: 40px;
    font-weight: 600;
    color: #495057;
  }

  .quantity-unit {
    font-size: 0.8rem;
    color: #6c757d;
    margin-left: 4px;
  }

  .cart-item-price-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .unit-price {
    font-size: 0.9rem;
    color: #6c757d;
  }

  .total-price {
    font-size: 1.1rem;
    font-weight: 600;
    color: #28a745;
  }

  .free-shipping {
    color: #28a745;
    font-weight: 600;
  }

  .discount-value {
    color: #28a745;
    font-weight: 600;
  }

  .frete-gratis-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
    border: 1px solid #d4edda;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #155724;
    margin: 12px 0;
  }

  .frete-gratis-info i {
    color: #28a745;
    font-size: 1.2rem;
  }

  .quantity-btn {
    transition: all 0.2s ease;
  }

  .quantity-btn:hover {
    transform: scale(1.1);
  }

  .remove-item-btn {
    transition: all 0.3s ease;
  }

  .remove-item-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
`;
document.head.appendChild(style);

// Inicializa o carrinho quando a página carregar
let carrinho;

document.addEventListener("DOMContentLoaded", () => {
  carrinho = new CarrinhoCompras();
});

// Exporta para uso global
window.carrinho = carrinho;
