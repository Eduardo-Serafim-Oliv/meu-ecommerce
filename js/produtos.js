const toast = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[0]);
const container = document.getElementById("products");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let products = [];

async function fetchProdutos() {
    try {
        const response = await fetch("https://ppw-1-tads.vercel.app/api/products");
        if (!response.ok) {
            throw new Error(`erro http - ${response.status}`);
        }
        const data = await response.json();
        products = data.products;
    } catch (error) {
        console.error("Não foi possível consultar os produtos: ", error.message);
    } finally {
        carregarProdutos("");
    }
}

fetchProdutos();

document.getElementById("buscarProduto").addEventListener("keyup", function () {
    carregarProdutos(this.value.trim());
});

function carregarProdutos(busca) {
    busca = busca.toLowerCase();
    produtosFiltrados = products.filter(p => p.name.toLowerCase().match(busca));

    if (produtosFiltrados.length == 0) {
        container.innerHTML = `<div class="display-3 w-100">Nenhum produto encontrado.</div>`;
        return;
    }
    container.innerHTML = "";
    produtosFiltrados.forEach(p => adicionarCardProduto(p));
}

function adicionarCardProduto(p) {
    const col = document.createElement("div");

    let iconeFavorito = "bi-heart";

    if (favoritos.includes(p.id)) {
        iconeFavorito = "bi-heart-fill";
    };

    let htmlBotaoAddCarrinho = `<i class="bi bi-cart-plus me-2"></i>Adicionar`;

    if (carrinho.map(e => e.id).includes(p.id)) {
        htmlBotaoAddCarrinho = `<i class="bi bi-cart-check me-2"></i>No carrinho`;
        
        let produtoNoCarrinho = carrinho.find(e => e.id == p.id);
        if(produtoNoCarrinho.qtd > 1) {
            htmlBotaoAddCarrinho = htmlBotaoAddCarrinho + ` (x${produtoNoCarrinho.qtd})`;
        }
    }

    col.innerHTML = `
    <div class="card h-100 shadow-sm">
        <input type="hidden" name="id" value="${p.id}">
        
        <div style="height: 200px; overflow: hidden;">
            <img src="${p.image}" data-id="${p.id}" class="card-img-top w-100 h-100" style="object-fit: cover" alt="${p.name}">
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


    col.querySelectorAll("button")[0].addEventListener("click", function () {
        const id = parseInt(col.querySelector("input").value);

        adicionarAoCarrinho(id);
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

function adicionarAoCarrinho(id) {
    carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    result = carrinho.find(p => p.id === id);

    if (result) {
        result.qtd++;
    } else {
        carrinho.push({ id: id, qtd: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    const inputs = container.querySelectorAll('input[name="id"]');
    const nodeArray = [...inputs];
    let btnAddCarrinho = nodeArray.filter(e => e.value == id)[0].parentElement.querySelector(".btn-success");

    let msgBotao = `<i class="bi bi-cart-check me-2"></i>`;
    let produtoNoCarrinho = carrinho.find(e => e.id == id);
    btnAddCarrinho.innerHTML = produtoNoCarrinho.qtd > 1 ? msgBotao + `No carrinho (x${produtoNoCarrinho.qtd})` : msgBotao + "No carrinho"; 

    toast.show();

    document.getElementById("badge").textContent = carrinho.length;
    document.getElementById("badge").style.visibility = "visible";
}

let elementoArrastado = null

container.addEventListener("dragstart", (e) => {
    elementoArrastado = e.target.nodeName === "IMG" ? e.target : null;
});

document.querySelector("header").addEventListener("dragover", (e) => {
    e.preventDefault();
});

document.querySelector("header").addEventListener("drop", (e) => {
    e.preventDefault();
    if (elementoArrastado != null) {
        adicionarAoCarrinho(parseInt(elementoArrastado.getAttribute("data-id")));
    }
});