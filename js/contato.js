document.getElementById("nome").focus();

document.querySelector("form").addEventListener("submit", function (e) {
    if(!this.checkValidity()) {
        e.preventDefault();
        this.classList.add("was-validated");
    }
});

let emailSalvo = localStorage.getItem("email");

if(emailSalvo != null) {
    document.getElementById("email").value = emailSalvo;
}

VMasker(document.getElementById("telefone")).maskPattern("(99) 99999-9999");