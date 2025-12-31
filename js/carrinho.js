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

let somaPrecos = 0;

function atualizarResumoPedido() {
    const resumoPedido = document.getElementById("resumo-pedido");
    resumoPedido.style.display = carrinho.length > 0 ? "block" : "none";

    somaPrecos = carrinho.reduce((somaPrecos, item) => somaPrecos + (item.price * item.qtd), 0);

    const subtotal = document.getElementById("subtotal");

    subtotal.innerHTML = `Subtotal (${carrinho.length} ${carrinho.length === 1 ? "produto" : "produtos"}):<br>R$ ${somaPrecos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2  })}`;
    atualizarTotal();
}

const formCep = document.querySelector(".needs-validation");
let opcoesFrete = [];

document.getElementById("calcularFrete").addEventListener("click", async () => {
    botaoFinalizarPedido.style.display = "none";
    const cep = document.getElementById("cep");
    if (cep.value.match(/[0-9]{5}-[0-9]{3}/g)) {
        cep.classList.add("is-valid");
        cep.classList.remove("is-invalid");

        try {
            const response = await fetch("https://ppw-1-tads.vercel.app/api/frete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: `{"cep":"${cep.value}"}`
            });

            if (response.status === 400) {
                cep.classList.remove("is-valid");
                cep.classList.add("is-invalid");
            } else if (!response.ok) {
                throw new Error(`erro http - ${response.status}`);
            }

            const data = await response.json();

            divFrete.innerHTML = "";

            opcoesFrete = data.fretes;

            for (let i = 0; i < opcoesFrete.length; i++) {
                addRadioFrete(opcoesFrete[i], i);
            }
        } catch (error) {
            console.error("Falha ao calcular frete: " + error.message);
        }
    } else {
        cep.classList.remove("is-valid");
        cep.classList.add("is-invalid");
        fretes.innerHTML = "";
        document.getElementById("total").textContent = "";
        precoFreteSelecionado = 0;
    }
});

const divFrete = document.getElementById("fretes");
const botaoFinalizarPedido = document.getElementById("finalizarPedido");
let precoFreteSelecionado = 0;

let freteSelecionado = [];

function addRadioFrete(f, id) {

    const frete = document.createElement("div");
    frete.classList.add("form-check");
    frete.innerHTML = `
        <input class="form-check-input" type="radio" name="frete" id="frete${id}">
        <label class="form-check-label" for="frete${id}">
            ${f.servico} <br> <p class="fw-light">R$ ${f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${f.prazo})</p>
        </label>
    `;

    frete.querySelector("input").addEventListener("click", function () {
        botaoFinalizarPedido.style.display = "block";
        precoFreteSelecionado = opcoesFrete[id].valor;
        freteSelecionado = opcoesFrete[id];
        atualizarTotal();
    });

    divFrete.appendChild(frete);
}

function atualizarTotal() {
    if (precoFreteSelecionado != 0) {
        document.getElementById("total").textContent = `Total: R$ ${(precoFreteSelecionado + somaPrecos)
            .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

botaoFinalizarPedido.addEventListener("click", (e) => {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.push({
        produtos: carrinho,
        frete: freteSelecionado
    });

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("carrinho", null);
    
    location.href = "sucesso-pedido.html";
});