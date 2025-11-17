
document.addEventListener("DOMContentLoaded", () => {
  let products = [];

  const productList = document.getElementById("product-list");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("search-product");

  function renderProducts(filteredProducts) {
    productList.innerHTML = "";
    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.dataset.categoria = product.categoria;
      productCard.innerHTML = `
                <img src="${product.imagem}" alt="${product.nome}">
                <div class="product-info">
                    <h3>${product.nome}</h3>
                    <p>${product.descricao}</p>
                    <div class="product-price">${product.valor} / kg</div>
                    <div class="product-actions">
                        <button class="buy-btn" data-product='${JSON.stringify(
        product
      )}'>
                            <i class='bx bx-cart-add'></i> Comprar
                        </button>
                        <button class="details-btn">Ver Detalhes</button>
                    </div>
                </div>
            `;
      productList.appendChild(productCard);
    });

    // Adiciona event listeners aos botões de compra
    document.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productData = JSON.parse(e.currentTarget.dataset.product);
        adicionarAoCarrinho(productData);
      });
    });
  }

  // Função para adicionar produto ao carrinho
  function adicionarAoCarrinho(product) {
    // Carrega carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem("carrinho_daroca") || "[]");

    // Verifica se o produto já existe no carrinho
    const itemExistente = carrinho.find((item) => item.id === product.id);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      carrinho.push({
        ...product,
        quantidade: 1,
      });
    }

    // Salva no localStorage
    localStorage.setItem("carrinho_daroca", JSON.stringify(carrinho));

    // Atualiza contador do carrinho
    atualizarContadorCarrinho();

    // Mostra notificação
    mostrarNotificacao(`${product.nome} adicionado ao carrinho!`);
  }

  // Atualiza contador do carrinho no header
  function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(
      localStorage.getItem("carrinho_daroca") || "[]"
    );
    const totalItens = carrinho.reduce(
      (total, item) => total + item.quantidade,
      0
    );

    // Atualiza o contador (se existir na página)
    const contador = document.querySelector(".cart-count");
    if (contador) {
      contador.textContent = totalItens;
    }
  }

  // Mostra notificação de produto adicionado
  function mostrarNotificacao(mensagem) {
    // Remove notificações existentes
    const existente = document.querySelector(".notification");
    if (existente) existente.remove();

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
            <i class='bx bx-check-circle'></i>
            <span>${mensagem}</span>
        `;



    // Estilos inline
    Object.assign(notification.style, {
      position: "fixed",
      top: "100px",
      right: "20px",
      backgroundColor: "#28a745",
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


  window.renderProducts = renderProducts;
  window.adicionarAoCarrinho = adicionarAoCarrinho;
  window.atualizarContadorCarrinho = atualizarContadorCarrinho;
  window.mostrarNotificacao = mostrarNotificacao;


  fetch("http://localhost:8090/daroca/produtos")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProducts(products);
      console.log(products);

      // Atualiza contador do carrinho ao carregar a página
      atualizarContadorCarrinho();
    })
    .catch((erro) => console.log("Não foi possível regatar os dados", erro));

  // Filtra produtos ao clicar nos botões de categoria


  // Filtra produtos ao digitar na barra de pesquisa
  searchInput.addEventListener("input", () => {
    const busca = searchInput.value.toLowerCase();
    console.log("Digitando:", searchInput.value);

    const filteredProducts = products.filter((product) => {
      const nome = (product.nome ?? "").toLowerCase();

      const resultado = nome.includes(busca);

      return resultado;
    });
    renderProducts(filteredProducts);
  });

  function clicouGanhou(id) {
    fetch(`http://localhost:8090/daroca/categorias/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Produtos filtrados:", data);
        renderProducts(data); 
      })
      .catch(err => console.log("Erro ao buscar categoria", err));
  }
  window.clicouGanhou = clicouGanhou;

});

