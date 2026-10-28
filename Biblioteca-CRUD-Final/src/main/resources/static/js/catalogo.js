let todos = [];
let emps = [];
let avs = {};

async function load() {

    try {

        [todos, emps] = await Promise.all([
            api("/livros"),
            api("/emprestimos")
        ]);


        await Promise.all(

            todos.map(async livro => {

                try {

                    avs[livro.id] =
                        await api(
                            `/livros/${livro.id}/avaliacoes`
                        );

                } catch (erro) {

                    avs[livro.id] = [];

                }

            })

        );


        render();


    } catch (erro) {

        console.error(
            "Erro ao carregar catálogo:",
            erro
        );

    }

}


function render() {

    const busca =
        document.querySelector("#busca");


    const grid =
        document.querySelector("#grid");


    let q = (

        busca.value ||

        new URLSearchParams(
            location.search
        ).get("q") ||

        ""

    )
        .toLowerCase()
        .trim();


    busca.value = q;


    const data =
        todos.filter(livro => {

            const texto = `
                ${livro.titulo}
                ${livro.autor}
                ${livro.categoria || ""}
            `;

            return texto
                .toLowerCase()
                .includes(q);

        });


    grid.innerHTML =
        data.map(livro => {


            // ==========================
            // AVALIAÇÕES
            // ==========================

            const avaliacoes =
                avs[livro.id] || [];


            const media =
                avaliacoes.length

                    ? (
                        avaliacoes.reduce(
                            (soma, avaliacao) =>
                                soma + Number(avaliacao.nota),
                            0
                        )
                        /
                        avaliacoes.length

                    ).toFixed(1)

                    : "Novo";


            // ==========================
            // EMPRÉSTIMO
            // ==========================

            const emprestado =
                emps.some(

                    emprestimo =>

                        emprestimo.livro?.id === livro.id

                        &&

                        !emprestimo.dataDevolucao

                );


            // ==========================
            // CAPA
            // ==========================

            let imagem;


            if (livro.nomeArquivoCapa) {

                imagem =
                    "/capas/" +
                    encodeURIComponent(
                        livro.nomeArquivoCapa
                    );

            } else {

                imagem =
                    "https://placehold.co/400x600/ebe8ff/4c3bcf?text=" +
                    encodeURIComponent(
                        livro.titulo
                    );

            }


            // ==========================
            // CARD
            // ==========================

            return `

                <article
                    class="book"
                    onclick="
                        location.href='/livro.html?id=${livro.id}'
                    "
                >

                    <img
                        class="cover"
                        src="${imagem}"
                        alt="Capa de ${livro.titulo}"
                        onerror="
                            this.onerror=null;
                            this.src='https://placehold.co/400x600/ebe8ff/4c3bcf?text=Livro';
                        "
                    >


                    <h3>
                        ${livro.titulo}
                    </h3>


                    <p>
                        ${livro.autor}
                    </p>


                    <div class="stars">
                        ★ ${media}
                    </div>


                    <span
                        class="status ${
                            emprestado
                                ? "out"
                                : ""
                        }"
                    >

                        ${
                            emprestado
                                ? "Emprestado"
                                : "Disponível"
                        }

                    </span>

                </article>

            `;

        }).join("")

        ||

        "<p>Nenhum livro encontrado.</p>";

}


// ==========================================
// PESQUISA
// ==========================================

document
    .querySelector("#busca")
    .addEventListener(
        "input",
        render
    );


// ==========================================
// INICIAR
// ==========================================

load();