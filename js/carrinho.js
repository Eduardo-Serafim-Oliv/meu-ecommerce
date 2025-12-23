const container = document.getElementById("produtos");
const confirmacao = document.getElementById("confirmacao");

container.innerHTML = "";

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

if (carrinho.length > 0) {
    carregarProdutos();
} else {
    container.innerHTML = `<div class="display-5">O seu carrinho está vazio.<div>`;
}

async function carregarProdutos() {
    fetch("https://ppw-1-tads.vercel.app/api/products")
        .then(res => res.json())
        .then(data => {
            const idsDosProdutos = carrinho.map(p => p.id);
            const produtosNoCarrinho = data.products.filter(p => idsDosProdutos.includes(p.id));

            produtosNoCarrinho.forEach(p => {
                p.qtd = carrinho.find(item => item.id === p.id).qtd;
                gerarCardProduto(p);
            });

            carrinho = produtosNoCarrinho;
            atualizarResumoPedido();
        });
}

function gerarCardProduto(p) {
    const card = document.createElement("div");
    card.classList.add("card", "text-center", "mb-3", "mt-3");
    card.style = "max-width: 670px";
    card.innerHTML = `
        <div class="row g-0">
            <div class="col-md-5">
                <img src="${p.image}" class="img-fluid rounded-start" alt="${p.name}" style="width: 280px; height: 200px; object-fit: cover;">
            </div>
            <div class="col-md-7">
                <div class="card-body h-100 align-content-center">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text fs-5">R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    
                    <button type="button" data-action="incrementar" class="btn btn-success"><span class="fs-5 fw-bold">+</span></button>
                    <span class="ms-2 me-2" data-field="quantidade" >${p.qtd}</span>
                    <button type="button" data-action="decrementar" class="btn btn-success"><span class="fs-5 fw-bold">-</span></button>
                    </p>
                </div>
            </div>
        </div>
    `;

    const incrementar = card.querySelector('[data-action="incrementar"]');
    const decrementar = card.querySelector('[data-action="decrementar"]');
    const quantidade = card.querySelector('[data-field="quantidade"]');

    incrementar.addEventListener("click", () => {
        p.qtd++;
        quantidade.textContent = p.qtd;
        salvarCarrinho();
        atualizarResumoPedido();
    });

    decrementar.addEventListener("click", () => {
        if (parseInt(quantidade.textContent) === 1) {
            confirmacao.querySelector("p").textContent = `Você realmente deseja remover "${p.name}" do seu carrinho?`;
            new bootstrap.Modal(confirmacao).show();

            const botaoRemoverAntigo = confirmacao.querySelector('[data-action="remover"]');
            const botaoRemoverNovo = botaoRemoverAntigo.cloneNode(true);
            botaoRemoverAntigo.parentNode.replaceChild(botaoRemoverNovo, botaoRemoverAntigo);

            botaoRemoverNovo.addEventListener("click", () => {
                carrinho = carrinho.filter(e => e.id != p.id);
                card.remove();
                salvarCarrinho();
                atualizarResumoPedido();
                if (carrinho.length === 0) {
                    container.innerHTML = `<div class="display-5">O seu carrinho está vazio.<div>`;
                }
            });
            return;
        }

        p.qtd--;
        quantidade.textContent = p.qtd;
        salvarCarrinho();
        atualizarResumoPedido();
    });

    container.appendChild(card);
}

function salvarCarrinho() {
    const carrinhoSemDetalhes = carrinho.map(e => { return { id: e.id, qtd: e.qtd } });
    localStorage.setItem("carrinho", JSON.stringify(carrinhoSemDetalhes));
}

function atualizarResumoPedido() {
    const resumoPedido = document.getElementById("resumo-pedido");
    resumoPedido.style.display = carrinho.length > 0 ? "block" : "none";

    const somaPrecos = carrinho.reduce((somaPrecos, item) => somaPrecos + (item.price * item.qtd), 0);

    const total = document.getElementById("total");
    const parcelar = document.getElementById("parcelar");

    total.innerHTML = `Total (${carrinho.length} ${carrinho.length === 1 ? "produto" : "produtos"}):<br>R$ ${somaPrecos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    parcelar.innerHTML = `Em até 10x s/juros<br>10x de ${(somaPrecos / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
