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
    const carrinhoSalvo = localStorage.getItem("carrinho_daroca");
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  }

  // Salva o carrinho no localStorage
  salvarCarrinho() {
    localStorage.setItem("carrinho_daroca", JSON.stringify(this.items));
  }

  // Adiciona produto ao carrinho
  adicionarProduto(produto) {
    const itemExistente = this.items.find((item) => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.items.push({
        ...produto,
        quantidade: 1,
      });
    }

    this.salvarCarrinho();
    this.renderizarCarrinho();
    this.atualizarResumo();
    this.atualizarContadorHeader();
    this.mostrarNotificacao("Produto adicionado ao carrinho!");
  }

  // Remove produto do carrinho
  removerProduto(produtoId) {
    this.items = this.items.filter((item) => item.id !== produtoId);
    this.salvarCarrinho();
    this.renderizarCarrinho();
    this.atualizarResumo();
    this.atualizarContadorHeader();
    this.mostrarNotificacao("Produto removido do carrinho", "error");
  }

  // Atualiza quantidade do produto
  atualizarQuantidade(produtoId, novaQuantidade) {
    const item = this.items.find((item) => item.id === produtoId);

    if (item) {
      if (novaQuantidade <= 0) {
        this.removerProduto(produtoId);
      } else {
        item.quantidade = novaQuantidade;
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
        this.atualizarContadorHeader();
      }
    }
  }

  // Limpa todo o carrinho
  limparCarrinho() {
    if (this.items.length === 0) return;

    if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
      this.items = [];
      this.salvarCarrinho();
      this.renderizarCarrinho();
      this.atualizarResumo();
      this.atualizarContadorHeader();
      this.mostrarNotificacao("Carrinho limpo com sucesso", "error");
    }
  }

  // Renderiza os itens do carrinho
  renderizarCarrinho() {
    const container = document.getElementById("cart-items");
    const emptyMessage = document.getElementById("empty-cart-message");

    if (this.items.length === 0) {
      container.innerHTML = "";
      emptyMessage.style.display = "block";
      return;
    }

    emptyMessage.style.display = "none";

    container.innerHTML = this.items
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img 
          src="${item.imagem || "../Imagens/produto-placeholder.png"}" 
          alt="${item.nome}" 
          class="cart-item-image"
        />
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.nome}</h3>
          <p class="cart-item-description">${
            item.descricao || "Produto fresco e natural"
          }</p>
          <p class="cart-item-price">${this.formatarPreco(item.valor)} / kg</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button 
              class="quantity-btn" 
              onclick="carrinho.atualizarQuantidade(${item.id}, ${
          item.quantidade - 1
        })"
              ${item.quantidade <= 1 ? "disabled" : ""}
            >
              <i class='bx bx-minus'></i>
            </button>
            <span class="quantity-value">${item.quantidade} kg</span>
            <button 
              class="quantity-btn" 
              onclick="carrinho.atualizarQuantidade(${item.id}, ${
          item.quantidade + 1
        })"
            >
              <i class='bx bx-plus'></i>
            </button>
          </div>
          <button 
            class="remove-item-btn" 
            onclick="carrinho.removerProduto(${item.id})"
          >
            <i class='bx bx-trash'></i> Remover
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
    const frete = this.calcularFrete(subtotal);
    const total = subtotal + frete;

    document.getElementById("subtotal").textContent =
      this.formatarPreco(subtotal);
    document.getElementById("shipping").textContent =
      frete === 0 ? "Grátis" : this.formatarPreco(frete);
    document.getElementById("total").textContent = this.formatarPreco(total);

    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.disabled = this.items.length === 0;
  }

  // Calcula o subtotal
  calcularSubtotal() {
    return this.items.reduce((total, item) => {
      const preco = this.extrairValorNumerico(item.valor);
      return total + preco * item.quantidade;
    }, 0);
  }

  // Calcula o frete
  calcularFrete(subtotal) {
    // Frete grátis acima de R$ 100
    if (subtotal >= 100) return 0;
    // Frete fixo de R$ 15
    if (this.items.length > 0) return 15;
    return 0;
  }

  // Extrai valor numérico de strings como "R$ 5,00"
  extrairValorNumerico(valorString) {
    if (typeof valorString === "number") return valorString;

    // Remove "R$", espaços e substitui vírgula por ponto
    const valorLimpo = valorString
      .replace(/R\$/g, "")
      .replace(/\s/g, "")
      .replace(",", ".");

    return parseFloat(valorLimpo) || 0;
  }

  // Formata preço para exibição
  formatarPreco(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
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
      alert("Seu carrinho está vazio!");
      return;
    }

    const total =
      this.calcularSubtotal() + this.calcularFrete(this.calcularSubtotal());

    // Aqui você pode integrar com um sistema de pagamento real
    const confirmar = confirm(
      `Finalizar compra no valor de ${this.formatarPreco(total)}?\n\n` +
        `Total de itens: ${this.items.reduce(
          (sum, item) => sum + item.quantidade,
          0
        )} kg\n` +
        `(Esta é uma demonstração - nenhum pagamento será processado)`
    );

    if (confirmar) {
      this.mostrarNotificacao(
        "Pedido realizado com sucesso! Obrigado pela compra!",
        "success"
      );
      setTimeout(() => {
        this.items = [];
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
        this.atualizarContadorHeader();
      }, 1500);
    }
  }

  // Mostra notificação temporária
  mostrarNotificacao(mensagem, tipo = "success") {
    // Remove notificações existentes
    const existente = document.querySelector(".notification");
    if (existente) existente.remove();

    const notification = document.createElement("div");
    notification.className = `notification notification-${tipo}`;
    notification.innerHTML = `
      <i class='bx ${
        tipo === "success" ? "bx-check-circle" : "bx-error-circle"
      }'></i>
      <span>${mensagem}</span>
    `;

    // Estilos inline para a notificação
    Object.assign(notification.style, {
      position: "fixed",
      top: "100px",
      right: "20px",
      backgroundColor: tipo === "success" ? "#28a745" : "#dc3545",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      zIndex: "10000",
      animation: "slideIn 0.3s ease-out",
      fontSize: "1rem",
      fontWeight: "500",
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Método público para obter total de itens
  getTotalItens() {
    return this.items.reduce((total, item) => total + item.quantidade, 0);
  }
}

// Adiciona animações CSS dinamicamente
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .notification i {
    font-size: 1.3rem;
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
