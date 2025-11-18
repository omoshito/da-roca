let products = [];

function clicouGanhou(id) {
    console.log("Categoria clicada:", id);

    if (id === 0) {
        renderProducts(products);
        return;
    }

    fetch(`http://localhost:8090/daroca/categorias/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                renderProducts(data);
            } else {
                console.error("API retornou um formato de dados inválido (não é um array).", data);
                renderProducts([]);
            }
        })
        .catch(err => {
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
            productCard.dataset.categoria = product.categoria;
            productCard.innerHTML = `
    <img src="${product.imagem}" alt="${product.nome}" class="card-img">

    <div class="card-info">
        <h3 class="card-title">${product.nome}</h3>
        <p class="card-desc">${product.descricao}</p>
    </div>

    <div class="card-footer">
        <div class="product-price">${product.valor} / kg</div>
        <button class="buy-btn" data-product='${JSON.stringify(product)}'>
            <i class='bx bx-cart-add'></i> Comprar
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
    }

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
            <i class='bx bx-check-circle'></i>
            <span>${mensagem}</span>
        `;

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


    window.adicionarAoCarrinho = adicionarAoCarrinho;
    window.atualizarContadorCarrinho = atualizarContadorCarrinho;
    window.mostrarNotificacao = mostrarNotificacao;


    fetch("http://localhost:8090/daroca/produtos")
        .then((res) => res.json())
        .then((data) => {
            products = data;
            window.renderProducts(products);
            console.log(products);

            atualizarContadorCarrinho();
        })
        .catch((erro) => console.log("Não foi possível regatar os dados", erro));

    searchInput.addEventListener("input", () => {
        const busca = searchInput.value.toLowerCase();
        console.log("Digitando:", searchInput.value);

        const filteredProducts = products.filter((product) => {
            const nome = (product.nome ?? "").toLowerCase();

            const resultado = nome.includes(busca);

            return resultado;
        });
        window.renderProducts(filteredProducts);
    });
});
