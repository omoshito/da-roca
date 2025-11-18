let products = [];

// Função para atualizar o estado visual dos botões de filtro
function atualizarBotaoAtivo(categoriaId) {
  // Remove classe 'active' de todos os botões
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });

  // Adiciona classe 'active' ao botão correspondente
  const targetButton = document.getElementById(categoriaId.toString());

  if (targetButton) {
    targetButton.classList.add("active");
    targetButton.setAttribute("aria-pressed", "true");
  }
}

function clicouGanhou(id) {
  // Atualizar estado visual dos botões
  atualizarBotaoAtivo(id);

  if (id === 0) {
    renderProducts(products);
    return;
  }

  fetch(`http://localhost:8090/daroca/categorias/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      renderProducts(data);
    })
    .catch((err) => {
      console.error("Erro ao buscar categoria", err);
      document.getElementById("product-list").innerHTML =
        '<p class="error-message">Não foi possível carregar os produtos desta categoria.</p>';
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("search-product");

  window.renderProducts = function (filteredProducts) {
    productList.innerHTML = "";
    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card");
      productCard.dataset.categoria = product.categoria_id;

      productCard.innerHTML = `
    ${
      product.categoria
        ? `<div class="category-badge">${product.categoria}</div>`
        : ""
    }
    <img src="${product.imagem}" alt="${
        product.nome
      }" class="card-img" loading="lazy">

    <div class="card-info">
        <h3 class="card-title">${product.nome}</h3>
        <p class="card-desc">${
          product.descricao || "Produto fresco e natural, direto do produtor."
        }</p>
    </div>

    <div class="card-footer">
        <div class="product-price">R$ ${product.valor}</div>
        <button class="buy-btn" data-product='${JSON.stringify(
          product
        )}' aria-label="Adicionar ${product.nome} ao carrinho">
            <i class='bx bx-cart-add'></i> 
            <span>Adicionar</span>
        </button>
    </div>
`;

      productList.appendChild(productCard);
    });

    document.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productData = JSON.parse(e.currentTarget.dataset.product);
        adicionarAoCarrinho(productData);
      });
    });
  };

  function adicionarAoCarrinho(product) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho_daroca") || "[]");

    const itemExistente = carrinho.find((item) => item.id === product.id);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      carrinho.push({
        ...product,
        quantidade: 1,
      });
    }

    localStorage.setItem("carrinho_daroca", JSON.stringify(carrinho));

    atualizarContadorCarrinho();

    mostrarNotificacao(`${product.nome} adicionado ao carrinho!`);
  }

  function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(
      localStorage.getItem("carrinho_daroca") || "[]"
    );
    const totalItens = carrinho.reduce(
      (total, item) => total + item.quantidade,
      0
    );

    const contador = document.querySelector(".cart-count");
    if (contador) {
      contador.textContent = totalItens;
    }
  }

  function mostrarNotificacao(mensagem) {
    const existente = document.querySelector(".notification");
    if (existente) existente.remove();

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
            <div class="notification-icon">
                <i class='bx bx-check-circle'></i>
            </div>
            <div class="notification-content">
                <span class="notification-title">Sucesso!</span>
                <span class="notification-message">${mensagem}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class='bx bx-x'></i>
            </button>
        `;

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #28a745, #20c997)",
      color: "white",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(40, 167, 69, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      zIndex: "10000",
      animation: "slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      fontSize: "0.95rem",
      fontWeight: "500",
      minWidth: "320px",
      maxWidth: "400px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    });

    // Estilos para os elementos filhos
    const icon = notification.querySelector(".notification-icon");
    Object.assign(icon.style, {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "50%",
      padding: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    const content = notification.querySelector(".notification-content");
    Object.assign(content.style, {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      flex: "1",
    });

    const title = notification.querySelector(".notification-title");
    Object.assign(title.style, {
      fontWeight: "600",
      fontSize: "1rem",
    });

    const message = notification.querySelector(".notification-message");
    Object.assign(message.style, {
      fontSize: "0.9rem",
      opacity: "0.9",
    });

    const closeBtn = notification.querySelector(".notification-close");
    Object.assign(closeBtn.style, {
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    });

    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });

    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation =
        "slideOutRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }

  // Garantir que o botão "Todos" esteja ativo por padrão
  function inicializarFiltros() {
    atualizarBotaoAtivo(0); // Ativar o botão "Todos" por padrão
  }

  // Inicializar filtros quando a página carregar
  inicializarFiltros();

  window.adicionarAoCarrinho = adicionarAoCarrinho;
  window.atualizarContadorCarrinho = atualizarContadorCarrinho;
  window.mostrarNotificacao = mostrarNotificacao;

  fetch("http://localhost:8090/daroca/produtos")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      products = data;
      window.renderProducts(products);
      atualizarContadorCarrinho();
    })
    .catch((erro) => {
      console.error("Erro ao carregar produtos:", erro);
      document.getElementById("product-list").innerHTML =
        '<p class="error-message">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
    });

  searchInput.addEventListener("input", () => {
    const busca = searchInput.value.toLowerCase();

    const filteredProducts = products.filter((product) => {
      const nome = (product.nome || "").toLowerCase();
      const descricao = (product.descricao || "").toLowerCase();

      return nome.includes(busca) || descricao.includes(busca);
    });
    window.renderProducts(filteredProducts);
  });
});
