const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
const container = document.getElementById("container");

if (pedidos.length === 0) {
    container.innerHTML = `<div class="fs-4 text-center w-100">Você ainda não fez nenhum pedido.</div>`;
} else {
    pedidos.forEach(p => adicionarPedido(p));
}

function adicionarPedido(p) {
    const div = document.createElement("div");
    const id = pedidos.indexOf(p) + 1;

    let somaPrecos = 0;
    somaPrecos = p.produtos.reduce((somaPrecos, produto) => somaPrecos + (produto.price * produto.qtd), 0);

    div.innerHTML = `
        <hr>
        <p class="card-text"><u><b>Pedido #${id}</b></u><br><b>Pedido realizado em:</b> ${new Date(p.data).toLocaleDateString("pt-BR")}
            <br><b>Prazo de entrega:</b> ${p.frete.prazo}
            <br><b>Total:</b> R$ ${(somaPrecos + p.frete.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <p><a href="pedido.html?id=${id}" class="btn btn-success">Visualizar Pedido</a></p>
    `;

    container.append(div);
}
