const container = document.getElementById("container");
const containerProdutos = document.getElementById("container-produtos");
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
const id = parseInt(new URLSearchParams(window.location.search).get("id"));
const subTotalTexto = document.getElementById("subtotal");

if (id > pedidos.length || id <= 0 || Number.isNaN(id)) {
    container.innerHTML = `<div class="display-3">Pedido não encontrado</div>`;
} else {
    document.getElementById("title").textContent = "Pedido #" + id;
    let pedido = pedidos[id - 1];
    let subTotal = 0;
    subTotal = pedido.produtos.reduce((subTotal, produto) => subTotal + (produto.price * produto.qtd), 0);

    subTotalTexto.textContent = `Subtotal: R$ ${subTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    subTotalTexto.classList.add("fw-light");

    pedido.produtos.forEach(p => adicionarProduto(p));

    function adicionarProduto(p) {
        const div = document.createElement("div");
        div.classList.add("card-body");
        div.innerHTML = `
            <hr>
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${p.image}" class="img-fluid rounded-start" style="width: 280px; height: 180px;
                        alt="${p.name}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <p class="card-text d-flex justify-content-start">${p.name}
                        <p><b>Quantidade:</b> ${p.qtd}</p><b>Valor Unitário: </b>R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>
        `;

        containerProdutos.append(div);
    }

    document.getElementById("entrega").innerHTML = `
        <div class="fs-3 mt-5 mb-1">Endereço de entrega:</div>
        ${pedido.endereco.logradouro}, Número ${pedido.endereco.numero}, ${pedido.endereco.complemento != "" ? pedido.endereco.complemento : ""}, ${pedido.endereco.bairro} <br>${pedido.endereco.cidade}/${pedido.endereco.estado} ${pedido.endereco.cep}<br>
        
        <div class="fs-3 mt-2 mb-0">Frete:</div>
        ${pedido.frete.servico}<br>
        R$ ${pedido.frete.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    `;

    document.getElementById("total").textContent = `Total: R$ ${(pedido.frete.valor + subTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
