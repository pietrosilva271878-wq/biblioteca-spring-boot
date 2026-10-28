let dados = [];

let edit = null;


// ==========================
// ELEMENTOS
// ==========================

const form =
    document.getElementById("form");

const filtro =
    document.getElementById("filtro");

const lista =
    document.getElementById("lista");

const titulo =
    document.getElementById("titulo");

const autor =
    document.getElementById("autor");

const ano =
    document.getElementById("ano");

const categoria =
    document.getElementById("categoria");

const descricao =
    document.getElementById("descricao");

const arquivoCapa =
    document.getElementById(
        "arquivoCapa"
    );

const previewCapa =
    document.getElementById(
        "previewCapa"
    );

const ft =
    document.getElementById("ft");

const cancelar =
    document.getElementById(
        "cancelar"
    );


// ==========================
// CARREGAR
// ==========================

async function load() {

    try {

        dados =
            await api("/livros");


        render();

    } catch (erro) {

        console.error(
            "Erro ao carregar livros:",
            erro
        );
    }
}


// ==========================
// RENDERIZAR
// ==========================

function render() {

    const q =
        filtro.value
            .toLowerCase()
            .trim();


    lista.innerHTML =
        dados

            .filter(livro => {

                const texto =
                    `${livro.titulo}
                     ${livro.autor}
                     ${livro.categoria || ""}`;


                return texto
                    .toLowerCase()
                    .includes(q);

            })

            .map(livro => {


                const imagem =
                    capa(livro);


                return `

                    <div class="admin-row">


                        <div
                            style="
                                display:flex;
                                align-items:center;
                                gap:15px;
                            "
                        >


                            <img
                                src="${imagem}"
                                alt="${livro.titulo}"

                                style="
                                    width:60px;
                                    height:85px;
                                    object-fit:cover;
                                    border-radius:6px;
                                "

                                onerror="
                                    this.onerror=null;
                                    this.src='https://placehold.co/400x600?text=Livro';
                                "
                            >


                            <div>

                                <b>
                                    ${livro.titulo}
                                </b>

                                <br>

                                <span class="muted">

                                    ${livro.autor}

                                    •

                                    ${
                                        livro.categoria ||
                                        "Sem categoria"
                                    }

                                </span>

                            </div>


                        </div>


                        <div>

                            <button
                                onclick="editar(${livro.id})"
                            >
                                Editar
                            </button>


                            <button
                                class="danger"
                                onclick="excluir(${livro.id})"
                            >
                                Excluir
                            </button>

                        </div>


                    </div>

                `;

            })

            .join("");
}


// ==========================
// FILTRO
// ==========================

filtro.addEventListener(
    "input",
    render
);


// ==========================
// PREVIEW
// ==========================

arquivoCapa.addEventListener(
    "change",
    () => {


        const arquivo =
            arquivoCapa.files[0];


        if (!arquivo) {

            previewCapa.innerHTML = "";

            return;
        }


        const url =
            URL.createObjectURL(
                arquivo
            );


        previewCapa.innerHTML = `

            <img
                src="${url}"

                style="
                    width:120px;
                    height:170px;
                    object-fit:cover;
                    border-radius:8px;
                "
            >

        `;

    }
);


// ==========================
// SALVAR LIVRO
// ==========================

form.addEventListener(
    "submit",
    async evento => {


        evento.preventDefault();


        try {


            const body = {

                titulo:
                    titulo.value,

                autor:
                    autor.value,

                anoPublicacao:
                    ano.value
                        ? Number(ano.value)
                        : null,

                categoria:
                    categoria.value,

                descricao:
                    descricao.value

            };


            const livroSalvo =
                await api(

                    edit
                        ? "/livros/" + edit
                        : "/livros",

                    {

                        method:
                            edit
                                ? "PUT"
                                : "POST",

                        body:
                            JSON.stringify(body)

                    }
                );


            // ==========================
            // CAPA
            // ==========================

            const arquivo =
                arquivoCapa.files[0];


            if (arquivo) {

                await enviarCapa(
                    livroSalvo.id,
                    arquivo
                );
            }


            alert(
                edit
                    ? "Livro atualizado!"
                    : "Livro cadastrado!"
            );


            reset();


            await load();


        } catch (erro) {


            console.error(
                erro
            );


            alert(
                "Erro ao salvar o livro."
            );

        }

    }
);


// ==========================
// ENVIAR CAPA
// ==========================

async function enviarCapa(
        livroId,
        arquivo) {


    const dadosCapa =
        new FormData();


    dadosCapa.append(
        "arquivo",
        arquivo
    );


    const resposta =
        await fetch(

            `/livros/${livroId}/capa`,

            {

                method: "POST",

                body: dadosCapa

            }
        );


    if (!resposta.ok) {

        const mensagem =
            await resposta.text();


        throw new Error(
            mensagem ||
            "Erro ao enviar capa"
        );
    }


    return resposta.json();
}


// ==========================
// EDITAR
// ==========================

function editar(id) {


    const livro =
        dados.find(
            livro =>
                livro.id === id
        );


    if (!livro) {

        return;
    }


    edit = id;


    titulo.value =
        livro.titulo || "";


    autor.value =
        livro.autor || "";


    ano.value =
        livro.anoPublicacao || "";


    categoria.value =
        livro.categoria || "";


    descricao.value =
        livro.descricao || "";


    arquivoCapa.value = "";


    // CAPA ATUAL

    if (livro.nomeArquivoCapa) {


        previewCapa.innerHTML = `

            <p>
                Capa atual:
            </p>

            <img
                src="${capa(livro)}"

                style="
                    width:120px;
                    height:170px;
                    object-fit:cover;
                    border-radius:8px;
                "
            >

        `;


    } else {


        previewCapa.innerHTML = `

            <p class="muted">
                Este livro ainda não possui capa.
            </p>

        `;

    }


    ft.textContent =
        "Editar livro";


    cancelar.style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================
// EXCLUIR
// ==========================

async function excluir(id) {


    if (!confirm("Excluir livro?")) {

        return;
    }


    try {


        await api(

            "/livros/" + id,

            {
                method: "DELETE"
            }

        );


        await load();


    } catch (erro) {


        console.error(erro);


        alert(
            "Não foi possível excluir. " +
            "O livro pode estar ligado a empréstimos."
        );

    }
}


// ==========================
// RESET
// ==========================

function reset() {


    edit = null;


    form.reset();


    previewCapa.innerHTML = "";


    ft.textContent =
        "Cadastrar livro";


    cancelar.style.display =
        "none";
}


// ==========================
// CANCELAR
// ==========================

cancelar.addEventListener(
    "click",
    reset
);


// ==========================
// INICIAR
// ==========================

load();