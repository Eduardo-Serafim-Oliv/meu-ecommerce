let email = localStorage.getItem("email");
let nome = localStorage.getItem("nome");


console.log("Email: " + email);
console.log("Nome: " +nome);

if (!email) {

    let itens = `<li><a class="dropdown-item" href="novo_usuario.html">Cadastrar</a></li>
    <li><a class="dropdown-item" href="login.html">Entrar</a></li>
    
    <select class="form-select" id="tema">
        <option value="auto">&#9681; Automático</option>
        <option value="light">&#9788; Claro</option>
        <option value="dark">&#9790; Escuro</option>
    </select>`

    document.getElementById('lista-dropdown-menu').innerHTML = itens;


} else {

    document.getElementById('localDoNome').innerHTML = 
    
    `<img src="img/user.png" alt="Ícone de usuário">
     Olá, ${nome}`;

    document.getElementById('lista-dropdown-menu').innerHTML = 
    
    `<li><a class="dropdown-item" href="meus_dados.html">Meus Dados</a></li>
    <li><a class="dropdown-item" href="meus_pedidos.html">Meus Pedidos</a></li> 
    <li>
        <hr class="dropdown-divider">
    </li>
    <li><a onclick="sair()" class="dropdown-item">Sair</a></li>
    <select class="form-select" id="tema">
        <option value="auto">&#9681; Automático</option>
        <option value="light">&#9788; Claro</option>
        <option value="dark">&#9790; Escuro</option>
    </select>`;

}


function sair(){

    localStorage.clear();
    window.location.replace("index.html")
}