const container = document.getElementById("lista-enderecos");
const form = document.querySelector("form");
const btnAdicionarEndereco = document.getElementById("adicionar-endereco");
const modal2 = document.getElementById("avisoEndereco");
const cepInput = document.getElementById("cep");

let enderecos = JSON.parse(localStorage.getItem("enderecos")) || [];

const redirect = new URLSearchParams(window.location.search).get("redirect");
const cep = new URLSearchParams(window.location.search).get("cep");

const elementoModal = document.getElementById('cadastrarEndereco');
const modalCarrinho = bootstrap.Modal.getOrCreateInstance(elementoModal);
const toastFinalizar = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[0])
const toastCadastrado = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[1]);
const toastExcluido = bootstrap.Toast.getOrCreateInstance(document.getElementsByClassName("toast")[2]);

carregarEnderecos();

function adicionarCardEndereco(end) {
    const card = document.createElement("div");
    card.classList.add("card", "endereco", "mb-2");
    card.innerHTML = `
        <div class="card-body">
            <div class="card-title"><strong>Endereço #${enderecos.indexOf(end) + 1}</strong></div>
            <div class="card-text">${end.logradouro}, Nº ${end.numero}, ${end.bairro}, ${end.cidade}/${end.estado}, CEP ${end.cep}</div>
            <button class="btn btn-outline-secondary position-absolute" style="top: 7px; right: 7px;"><i class="bi bi-trash-fill"></i></button>
        </div>
    `;

    container.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
        enderecos.splice(enderecos.indexOf(end), 1);
        card.remove();
        salvarEnderecos();
        toastExcluido.show();
        if (enderecos.length === 0) {
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
            cep: cepInput.value,
            estado: document.getElementById("estado").value,
            cidade: document.getElementById("cidade").value,
            bairro: document.getElementById("bairro").value,
            logradouro: document.getElementById("logradouro").value,
            numero: document.getElementById("numero").value,
            complemento: document.getElementById("complemento").value
        };

        enderecos.push(endereco);
        adicionarCardEndereco(endereco);
        salvarEnderecos();
        form.reset();
        form.classList.remove('was-validated');
        modalCarrinho.hide();
        toastCadastrado.show();

        if (redirect === "carrinho") {
            location.href = `carrinho.html?endereco=${enderecos.length}`;
        }

        if (cep != null) {
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

if (redirect === "carrinho") {
    if (cep != null) {
        cepInput.value = cep;
        buscarCep(cep);
        toastFinalizar.show();
        new bootstrap.Modal(modal2).show();
        modal2.addEventListener("hidden.bs.modal", e => {
            btnAdicionarEndereco.click();
        });
        elementoModal.addEventListener("hidden.bs.modal", e => {
            toastFinalizar.show();
            document.getElementById("finalizarNotificacao").addEventListener("click", e => {
                btnAdicionarEndereco.click();
            });
        });
        document.getElementById("btnCadastrar").textContent = "Finalizar Compra";
    } else {
        btnAdicionarEndereco.click();
    }
}

VMasker(cepInput).maskPattern("99999-999");

elementoModal.addEventListener("shown.bs.modal", () => {
    if(achouCep) {
        focusInputVazio();
    } else {
        cepInput.focus();
    }
});

function focusInputVazio() {
    const nodeList = form.querySelectorAll("input");
    const nodeArray = [...nodeList];

    const inputsVazios = nodeArray.filter(i => i.value == "");

    if(inputsVazios.length != 0) {
        inputsVazios[0].focus();
    }
}

cepInput.addEventListener("keyup", () => {
    if (cepInput.value.length === 9) {
        buscarCep(cepInput.value);
    }
})

let achouCep = false;

function buscarCep(cep) {
    fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro === "true") {
                achouCep = false;
                return;
            }
            document.getElementById("estado").value = data.uf;
            document.getElementById("cidade").value = data.localidade;
            document.getElementById("bairro").value = data.bairro;
            document.getElementById("logradouro").value = data.logradouro;
            document.getElementById("complemento").value = data.complemento;

            achouCep = true;
            focusInputVazio();
        });
}