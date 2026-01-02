document.querySelector("form").addEventListener("submit", function (e) {
    if(!this.checkValidity()) {
        e.preventDefault();
        this.classList.add("was-validated");
    }
});

VMasker(document.getElementById("telefone")).maskPattern("(99) 99999-9999");