let tema = localStorage.getItem("tema");

if(tema === null) {
    tema = "auto";
    localStorage.setItem("tema", tema);
}

if (tema === "auto") {
    tema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.documentElement.setAttribute("data-bs-theme", tema);

document.addEventListener("DOMContentLoaded", (event) => {
    const select = document.getElementById("tema");

    carregarTema();

    select.addEventListener("change", () => {

        localStorage.setItem("tema", select.value);
        carregarTema();
    });

    function carregarTema() {
        let tema = localStorage.getItem("tema");
        select.value = tema;

        if (tema === "auto") {
            tema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        document.documentElement.setAttribute("data-bs-theme", tema);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { carregarTema(); });
});