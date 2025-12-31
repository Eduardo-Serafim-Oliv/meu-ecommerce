const container = document.getElementById("lista-enderecos");
const form = document.querySelector("form");
const toastFinalizar = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[0])
const toastCadastrado = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[1]);
const toastExcluido = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[2]);
const elementoModal = document.getElementById('cadastrarEndereco'); 
const modal = bootstrap.Modal.getOrCreateInstance(elementoModal);
const btnToggleModalCadastrarEndereco = document.getElementById("adicionar-endereco");

let enderecos = JSON.parse(localStorage.getItem("enderecos")) || [];
const redirect = new URLSearchParams(window.location.search).get("redirect");
const cep = new URLSearchParams(window.location.search).get("cep");
const modalCarrinho = bootstrap.Modal.getOrCreateInstance(elementoModal);

carregarEnderecos();

function adicionarCardEndereco(end) {
    const card = document.createElement("div");
    card.classList.add("card", "endereco", "mb-2");
    card.innerHTML = `
        <div class="card-body">
            <div class="card-title"><strong>Endereço #${enderecos.indexOf(end) + 1}</strong></div>
            <div class="card-text">Rua ${end.rua}, Nº ${end.numero}, ${end.cidade}/${end.estado}, CEP ${end.cep}</div>
            <button class="btn btn-outline-secondary position-absolute" style="top: 7px; right: 7px;"><i class="bi bi-trash-fill"></i></button>
        </div>
    `;

    container.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
        enderecos.splice(enderecos.indexOf(end), 1);
        card.remove();
        salvarEnderecos();
        toastExcluido.show();
        if(enderecos.length === 0) {
            carregarEnderecos();
        }
    });
}

function salvarEnderecos() {
    localStorage.setItem("enderecos", JSON.stringify(enderecos));
}

function carregarEnderecos() {
    if (enderecos.length === 0) {
        container.innerHTML = `<div class="fs-2 text-center mb-3">Não há endereços cadastrados.</div>`
    } else {
        container.innerHTML = ``;
        enderecos.forEach(e => adicionarCardEndereco(e));
    }
}

document.getElementById("btnCadastrar").addEventListener("click", () => {
    form.classList.add('was-validated');

    if (form.checkValidity()) {
        const endereco = {
            rua: document.getElementById("rua").value,
            numero: document.getElementById("numero").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,
            cep: document.getElementById("cep").value
        };

        enderecos.push(endereco);
        adicionarCardEndereco(endereco);
        salvarEnderecos();
        form.reset();
        form.classList.remove('was-validated');
        modal.hide();
        toastCadastrado.show();

        if(redirect === "carrinho") {
            location.href = `carrinho.html?endereco=${enderecos.length}`;
        }

        if(cep != null) {
            const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
            const pedidoSemEndereco = JSON.parse(sessionStorage.getItem("pedidoSemEndereco"));
            pedidoSemEndereco.endereco = endereco;
            pedidos.push(pedidoSemEndereco);
            localStorage.setItem("pedidos", JSON.stringify(pedidos));
            localStorage.setItem("carrinho", null);
            sessionStorage.setItem("pedidoSemEndereco", null);
            location.href = "sucesso-pedido.html";
        }
    }
});

const modal2 = document.getElementById("avisoEndereco");

if(redirect === "carrinho") {
    if(cep != null) {
        document.getElementById("cep").value = cep;
        toastFinalizar.show();
        new bootstrap.Modal(modal2).show();
        modal2.addEventListener("hidden.bs.modal", e => {
            btnToggleModalCadastrarEndereco.click();
        });
        elementoModal.addEventListener("hidden.bs.modal", e=> {
            toastFinalizar.show();
            document.getElementById("finalizarNotificacao").addEventListener("click", e => {
                btnToggleModalCadastrarEndereco.click();
            });
        });
        document.getElementById("btnCadastrar").textContent="Finalizar Compra";
    } else {
        btnToggleModalCadastrarEndereco.click();
    }
}