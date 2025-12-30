const botao = document.getElementById("tema");

carregarTema();

botao.addEventListener("click", () => {
    const temaAtual = document.documentElement.getAttribute("data-bs-theme");

    localStorage.setItem("tema", temaAtual == "light" ? "dark" : "light");
    carregarTema();
});

function carregarTema() {
    const tema = localStorage.getItem("tema");

    if (tema == "light") {
        botao.innerHTML = `<i class="bi bi-moon-stars-fill"></i>`;
    } else {
        botao.innerHTML = `<i class="bi bi-brightness-high-fill"></i>`;
    }

    document.documentElement.setAttribute("data-bs-theme", tema);
}