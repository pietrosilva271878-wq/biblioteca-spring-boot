async function api(url, opt = {}) {

    const opcoes = {
        ...opt
    };


    /*
     * Só coloca application/json
     * quando NÃO for FormData.
     */

    if (!(opt.body instanceof FormData)) {

        opcoes.headers = {

            "Content-Type":
                "application/json",

            ...(opt.headers || {})

        };

    }


    const resposta =
        await fetch(
            url,
            opcoes
        );


    if (!resposta.ok) {

        const mensagem =
            await resposta.text();


        throw new Error(
            mensagem ||
            "Erro na requisição"
        );
    }


    if (resposta.status === 204) {

        return null;
    }


    return resposta.json();
}


// ==========================
// QUERY STRING
// ==========================

function qs(nome) {

    return new URLSearchParams(
        location.search
    ).get(nome);
}


// ==========================
// CAPA DO LIVRO
// ==========================

function capa(livro) {

    if (livro.nomeArquivoCapa) {

        return (
            "/capas/" +
            encodeURIComponent(
                livro.nomeArquivoCapa
            )
        );
    }


    return (
        "https://placehold.co/400x600/ebe8ff/4c3bcf?text=" +
        encodeURIComponent(
            livro.titulo || "Livro"
        )
    );
}


// ==========================
// MENU
// ==========================

function nav() {

    return `

        <header>

            <div class="top">

                <a
                    class="brand"
                    href="/"
                >
                    BiblioSenai
                </a>


                <nav class="nav">

                    <a href="/catalogo.html">
                        Catálogo
                    </a>

                    <a href="/livros.html">
                        Livros
                    </a>

                    <a href="/alunos.html">
                        Alunos
                    </a>

                    <a href="/emprestimos.html">
                        Empréstimos
                    </a>

                </nav>


                <input
                    id="globalSearch"
                    class="search"
                    placeholder="Buscar livros..."
                >

            </div>

        </header>

    `;
}


// ==========================
// CARREGAR MENU
// ==========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.insertAdjacentHTML(
            "afterbegin",
            nav()
        );


        const pesquisa =
            document.querySelector(
                "#globalSearch"
            );


        if (pesquisa) {

            pesquisa.onkeydown =
                evento => {

                    if (evento.key === "Enter") {

                        location.href =
                            "/catalogo.html?q=" +
                            encodeURIComponent(
                                pesquisa.value
                            );
                    }

                };
        }

    }
);