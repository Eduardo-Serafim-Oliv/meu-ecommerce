const tema = localStorage.getItem("tema") || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

document.documentElement.setAttribute("data-bs-theme", tema);
localStorage.setItem("tema", tema);