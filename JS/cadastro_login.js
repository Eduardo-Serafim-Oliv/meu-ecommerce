
function realizarLogin(email, senha) {

    fetch('https://ppw-1-tads.vercel.app/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            senha: senha
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then(respostaPost => {

            if (respostaPost.success === false) {

                console.log(respostaPost);

                if (respostaPost.message === "Credenciais inválidas") {

                    document.getElementById('mensagemToastLogin').innerHTML = `<b> Usuário ou senha inválidos. <b>`;

                } else {

                    document.getElementById('mensagemToastLogin').innerHTML = `<b> ${respostaPost.message}. <b>`;

                }

                const toastLiveExample = document.getElementById('liveToast')

                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
                toastBootstrap.show()

            } else {

                    localStorage.setItem('nome', respostaPost.user.name);
                    localStorage.setItem('email', respostaPost.user.email);

                    window.location.replace("index.html");
                


            }
        });
}

function realizarCadastro(nome, email, senha, confirmacaoSenha) {

    fetch('https://ppw-1-tads.vercel.app/api/register', {
        method: 'POST',
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha,
            confirmacaoSenha: confirmacaoSenha
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then(respostaPost => {

            console.log(respostaPost);

            if (respostaPost.sucesso === false) {

                console.log(respostaPost);

                if (respostaPost.erro === "Todos os campos são obrigatórios.") {

                    document.getElementById('toast-body-cadastro').innerHTML = `<b>Todos os campos são obrigatórios.</b> <br>Por favor, preencher todos.`

                } else if (respostaPost.erro === "E-mail inválido.") {

                    document.getElementById('toast-body-cadastro').innerHTML = `<b>E-mail inválido.</b> <br>Por favor, insira um email válido - <br> Exemplo: usuario@example.com`

                } else if (respostaPost.erro === "As senhas não são idênticas.") {

                    document.getElementById('toast-body-cadastro').innerHTML = `<b>As senhas não são idênticas.</b> <br>Por favor, verificar.`

                }

                //JavaScript do Toast que faz com que ele fique visível 

                const toastLiveExampleCadastro = document.getElementById('liveToastCadastro')

                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleCadastro)
                toastBootstrap.show()

            } else {

                //JavaScript do Modal que faz com que ele fique visível

                const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
                modal.show();

                const modalEl = document.getElementById('staticBackdrop');

                modalEl.addEventListener('hidden.bs.modal', () => {

                    localStorage.setItem('nome', nome);
                    localStorage.setItem('email', email);
                    localStorage.setItem('senha', senha);
                    localStorage.setItem('confirmacaoSenha', confirmacaoSenha);

                    window.location.replace("login.html");
                });


            }
        });
}

// function guardarDados_e_FecharPagina(nome, email, senha, confirmacaoSenha) {

//     localStorage.setItem('nome', nome);
//     localStorage.setItem('email', email);
//     localStorage.setItem('senha', senha);
//     localStorage.setItem('confirmacaoSenha', confirmacaoSenha);

//     window.location.replace("login.html");
// };
