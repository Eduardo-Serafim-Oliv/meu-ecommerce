let emailSalvo = localStorage.getItem("email");
let nomeSalvo = localStorage.getItem("nome");

document.getElementById('nomeUsuario').innerHTML = nome;
document.getElementById('emailUsuario').innerHTML = email;


function gerarModal() {

    const modal = new bootstrap.Modal(document.getElementById('cadastrarEndereco'));
    modal.show();

}

function alterarDados(nomeSalvo, emailSalvo) {

    fetch('https://ppw-1-tads.vercel.app/api/user', {
        method: 'PUT',
        body: JSON.stringify({
            nome: nomeSalvo,
            email: emailSalvo,
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then(respostaPut => {

            if (respostaPut.sucesso === false) {

                // console.log(respostaPut);

                let toast = document.getElementById('headerDoToast');

                toast.className = "toast-header text-bg-danger";

                toast.innerHTML = `<i  style="margin-right: 5px;" class="bi bi-exclamation-triangle" class="rounded me-2"></i>
                <strong id="tituloToast" class="me-auto">Credenciais inválidas</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`

                if (respostaPut.mensagem === "Nome e e-mail são obrigatórios.") {

                    document.getElementById('mensagemToastAlterar').innerHTML = `<b>Nome e E-mail são obrigatórios.</b>`

                } else if (respostaPut.mensagem === "E-mail inválido.") {

                    document.getElementById('mensagemToastAlterar').innerHTML = `<b>E-mail inválido.</b> <br>Por favor, insira um email válido - <br> Exemplo: usuario@example.com`

                    //JavaScript do Toast que faz com que ele fique visível 
                }

                const toastLiveExampleCadastro = document.getElementById('liveToast')

                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleCadastro)
                toastBootstrap.show()

            } else {

                let toast = document.getElementById('headerDoToast');

                toast.className = "toast-header text-bg-success";

                toast.innerHTML = `<i  style="margin-right: 5px;" class="bi bi-check-lg" class="rounded me-2"></i>
                <strong id="tituloToast" class="me-auto">Sucesso</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`

                document.getElementById('mensagemToastAlterar').innerHTML = `<b>Dados pessoais alterados com sucesso!</b>`

                const modal = bootstrap.Modal.getInstance(
                    document.getElementById('cadastrarEndereco')
                );
                modal.hide();

                localStorage.setItem('nome', nomeSalvo);
                localStorage.setItem('email', emailSalvo);

                const toastLiveExampleCadastro = document.getElementById('liveToast')

                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleCadastro)
                toastBootstrap.show()

                document.getElementById('nomeUsuario').innerHTML = nomeSalvo;
                document.getElementById('emailUsuario').innerHTML = emailSalvo;

            }
        });
}
