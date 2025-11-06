document.addEventListener('DOMContentLoaded', () => {
    let products = [];

    const productList = document.getElementById('product-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-product');

    function renderProducts(filteredProducts) {
        productList.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.category = product.category;
            productCard.innerHTML = `
                <img src="${product.imagem}" alt="${product.nome}">
                <div class="product-info">
                    <h3>${product.nome}</h3>
                    <p>${product.descricao}</p>
                    <div class="product-price">${product.valor} / kg</div>
                    <div class="product-actions">
                        <button class="buy-btn">Comprar</button>
                        <button class="details-btn">Ver Detalhes</button>
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    fetch('http://localhost:8090/daroca/produtos')
    .then(res => res.json())
    .then(data => {
        products = data
        renderProducts(products)
    })
    .catch(erro => 
        console.log("Não foi possível regatar os dados", erro)
    )

    // Filtra produtos ao clicar nos botões de categoria
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterCategory = btn.dataset.filter;
            const filteredProducts = products.filter(product => {
                if (filterCategory === 'all') {
                    return true;
                }
                return product.category === filterCategory;
            });
            renderProducts(filteredProducts);
        });
    });

    // Filtra produtos ao digitar na barra de pesquisa
    searchInput.addEventListener('input', () => {
        const busca = searchInput.value.toLowerCase();
        console.log("Digitando:", searchInput.value);

        const filteredProducts = products.filter(product => {
        const nome = (product.nome ?? "").toLowerCase(); 
        
        const resultado = nome.includes(busca);
        
    return resultado
});
        renderProducts(filteredProducts);
    });
});