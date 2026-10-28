document.addEventListener("DOMContentLoaded", function () {
    carregarDashboard();
});

async function carregarDashboard() {

    try {

        // ==========================================
        // BUSCAR DADOS
        // ==========================================

        const respostaLivros = await fetch("/livros");
        const respostaAlunos = await fetch("/alunos");
        const respostaEmprestimos = await fetch("/emprestimos");

        if (!respostaLivros.ok) {
            throw new Error("Erro ao buscar livros");
        }

        if (!respostaAlunos.ok) {
            throw new Error("Erro ao buscar alunos");
        }

        if (!respostaEmprestimos.ok) {
            throw new Error("Erro ao buscar empréstimos");
        }


        // ==========================================
        // TRANSFORMAR RESPOSTAS EM JSON
        // ==========================================

        const livros = await respostaLivros.json();

        const alunos = await respostaAlunos.json();

        const emprestimos =
            await respostaEmprestimos.json();


        console.log("Livros:", livros);
        console.log("Alunos:", alunos);
        console.log("Empréstimos:", emprestimos);


        // ==========================================
        // TOTAL DE LIVROS
        // ==========================================

        document.getElementById("nLivros").textContent =
            livros.length;


        // ==========================================
        // TOTAL DE ALUNOS
        // ==========================================

        document.getElementById("nAlunos").textContent =
            alunos.length;


        // ==========================================
        // LIVROS EMPRESTADOS
        // ==========================================

        const emprestados = emprestimos.filter(function (emprestimo) {

            return emprestimo.dataDevolucao === null;

        });


        document.getElementById("nEmp").textContent =
            emprestados.length;


        // ==========================================
        // EMPRÉSTIMOS ATRASADOS
        // ==========================================

        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);


        const atrasados = emprestimos.filter(function (emprestimo) {

            // Livro já foi devolvido
            if (emprestimo.dataDevolucao !== null) {
                return false;
            }

            // Não possui previsão de devolução
            if (emprestimo.dataPrevistaDevolucao === null) {
                return false;
            }


            const dataPrevista =
                new Date(
                    emprestimo.dataPrevistaDevolucao +
                    "T00:00:00"
                );


            return dataPrevista < hoje;

        });


        document.getElementById("nAtr").textContent =
            atrasados.length;


        // ==========================================
        // LIVROS RECENTES
        // ==========================================

        carregarLivrosRecentes(livros);


    } catch (erro) {

        console.error(
            "ERRO NO DASHBOARD:",
            erro
        );

    }

}


// ==========================================
// LIVROS RECENTES
// ==========================================

function carregarLivrosRecentes(livros) {

    const grid =
        document.getElementById("grid");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    const recentes = [...livros]
        .sort(function (a, b) {

            return b.id - a.id;

        })
        .slice(0, 6);


    recentes.forEach(function (livro) {

        const card =
            document.createElement("div");


        card.className = "book-card";


        let imagem;


        if (livro.nomeArquivoCapa) {

            imagem =
                "/capas/" +
                encodeURIComponent(
                    livro.nomeArquivoCapa
                );

        } else {

            imagem =
                "https://placehold.co/300x450?text=" +
                encodeURIComponent(
                    livro.titulo
                );

        }


        card.innerHTML = `

            <a href="/livro.html?id=${livro.id}">

                <img
                    src="${imagem}"
                    alt="${livro.titulo}"
                    class="book-cover"
                >

                <h3>
                    ${livro.titulo}
                </h3>

                <p>
                    ${livro.autor}
                </p>

                <span>
                    ${livro.categoria || "Sem categoria"}
                </span>

            </a>

        `;


        grid.appendChild(card);

    });
    function carregarLivrosRecentes(livros) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    grid.innerHTML = "";


    const recentes =
        [...livros]
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);


    recentes.forEach(livro => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


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


        card.innerHTML = `

            <a href="/livro.html?id=${livro.id}">

                <img
                    class="book-cover"
                    src="${imagem}"
                    alt="${livro.titulo}"
                >

                <h3>
                    ${livro.titulo}
                </h3>

                <p>
                    ${livro.autor}
                </p>

                <span>
                    ${livro.categoria || "Sem categoria"}
                </span>

            </a>

        `;


        grid.appendChild(card);

    });
    function carregarLivrosRecentes(livros) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    grid.innerHTML = "";


    const recentes =
        [...livros]
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);


    recentes.forEach(livro => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


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


        card.innerHTML = `

            <a href="/livro.html?id=${livro.id}">

                <img
                    class="book-cover"
                    src="${imagem}"
                    alt="${livro.titulo}"
                >

                <h3>
                    ${livro.titulo}
                </h3>

                <p>
                    ${livro.autor}
                </p>

                <span>
                    ${livro.categoria || "Sem categoria"}
                </span>

            </a>

        `;


        grid.appendChild(card);

    });

    function carregarLivrosRecentes(livros) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    grid.innerHTML = "";


    const recentes =
        [...livros]
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);


    recentes.forEach(livro => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


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


        card.innerHTML = `

            <a href="/livro.html?id=${livro.id}">

                <img
                    class="book-cover"
                    src="${imagem}"
                    alt="${livro.titulo}"
                >

                <h3>
                    ${livro.titulo}
                </h3>

                <p>
                    ${livro.autor}
                </p>

                <span>
                    ${livro.categoria || "Sem categoria"}
                </span>

            </a>

        `;


        grid.appendChild(card);

    });
    function carregarLivrosRecentes(livros) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    grid.innerHTML = "";


    const recentes =
        [...livros]
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);


    recentes.forEach(livro => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


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


        card.innerHTML = `

            <a href="/livro.html?id=${livro.id}">

                <img
                    class="book-cover"
                    src="${imagem}"
                    alt="${livro.titulo}"
                >

                <h3>
                    ${livro.titulo}
                </h3>

                <p>
                    ${livro.autor}
                </p>

                <span>
                    ${livro.categoria || "Sem categoria"}
                </span>

            </a>

        `;


        grid.appendChild(card);

    });


}
}

}



function carregarLivrosRecentes(livros) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    grid.innerHTML = "";


    const recentes =
        [...livros]
            .sort((a, b) => b.id - a.id)
            .slice(0, 6);


    recentes.forEach(livro => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


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


        card.innerHTML = `

            <a href="/livro.html?id=${livro.id}">

                <img
                    class="book-cover"
                    src="${imagem}"
                    alt="${livro.titulo}"
                >

                <h3>
                    ${livro.titulo}
                </h3>

                <p>
                    ${livro.autor}
                </p>

                <span>
                    ${livro.categoria || "Sem categoria"}
                </span>

            </a>

        `;


        grid.appendChild(card);

    });

}
    }
}