const container = document.getElementById("products");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

fetch("https://ppw-1-tads.vercel.app/api/products")
    .then(res => res.json())
    .then(data => {
        container.innerHTML = "";
        data.products.forEach(p => adicionarCardProduto(p));
    });

function adicionarCardProduto(p) {
    const col = document.createElement("div");

    let iconeFavorito = "bi-heart";

    if(favoritos.includes(p.id)) {
        iconeFavorito = "bi-heart-fill";
    };

    let htmlBotaoAddCarrinho = `<i class="bi bi-cart-plus me-2"></i>Adicionar`;

    if(carrinho.map(e => e.id).includes(p.id)) {
        htmlBotaoAddCarrinho = `<i class="bi bi-cart-check me-2"></i>No carrinho`;
    }

    col.innerHTML = `
    <div class="card h-100 shadow-sm">
        <input type="hidden" name="id" value="${p.id}">
        
        <div style="height: 200px; overflow: hidden;">
            <img src="${p.image}" class="card-img-top w-100 h-100" style="object-fit: cover" alt="${p.name}">
        </div>

        <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">${p.name}</h5>
            <p class="card-text text-secondary flex-grow-1 small">${p.description}</p>
            
            <div class="mt-2">
                <span class="fs-5 fw-bold text-dark">
                    R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>

        <div class="card-footer border-top-0 pb-3 d-flex justify-content-between align-items-center">
            <button class="btn btn-success w-75 fw-bold">
                ${htmlBotaoAddCarrinho}
            </button>
            <button class="btn btn-outline-danger border-0">
                <i class="bi ${iconeFavorito} fs-5"></i>
            </button>
        </div>
    </div>`;

    const toast = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[0]);

    col.querySelectorAll("button")[0].addEventListener("click", function () {
        const id = parseInt(col.querySelector("input").value);

        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        result = carrinho.find(p => p.id === id);

        if (result) {
            result.qtd++;
        } else {
            carrinho.push({ id: parseInt(id), qtd: 1 });
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        this.innerHTML = `<i class="bi bi-cart-check me-2"></i>No carrinho`;

        toast.show();
    });

    col.querySelectorAll("button")[1].addEventListener("click", function () {
        const i = this.childNodes[1];
        if (i.classList.contains("bi-heart")) {
            i.classList.remove("bi-heart");
            i.classList.add("bi-heart-fill");
            favoritos.push(p.id);
        } else if (i.classList.contains("bi-heart-fill")) {
            i.classList.remove("bi-heart-fill");
            i.classList.add("bi-heart");
            favoritos = favoritos.filter(id => id != p.id);
        }

        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    })

    container.appendChild(col);
}
