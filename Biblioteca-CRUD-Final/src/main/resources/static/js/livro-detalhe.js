const livroId =
    qs('id');

let livroAtual = null;

async function carregarLivro() {
    if (!livroId) {
        document.querySelector(
            '#conteudo'
        ).innerHTML =
            '<p>Livro não encontrado.</p>';

        return;
    }

    try {
        const [
            livro,
            avaliacoes,
            emprestimos,
            alunos
        ] = await Promise.all([
            api(`/livros/${livroId}`),

            api(
                `/livros/${livroId}/avaliacoes`
            ),

            api('/emprestimos'),

            api('/alunos')
        ]);

        livroAtual = livro;

        mostrarLivro(
            livro,
            avaliacoes,
            emprestimos
        );

        carregarAlunosAvaliacao(
            alunos
        );

        mostrarAvaliacoes(
            avaliacoes
        );

    } catch (erro) {
        console.error(erro);

        document.querySelector(
            '#conteudo'
        ).innerHTML =
            '<p>Erro ao carregar o livro.</p>';
    }
}

function mostrarLivro(
    livro,
    avaliacoes,
    emprestimos
) {
    const emprestado =
        emprestimos.some(
            emprestimo =>
                emprestimo.livro?.id ===
                    livro.id &&
                !emprestimo.dataDevolucao
        );

    const media =
        calcularMedia(
            avaliacoes
        );

    document.querySelector(
        '#conteudo'
    ).innerHTML = `

        <div class="book-detail">

            <div>

                <img
                    class="detail-cover"
                    src="${capa(livro)}"
                    alt="Capa de ${livro.titulo}"
                    onerror="
                        this.src='https://placehold.co/400x600?text=Livro'
                    "
                >

            </div>

            <div>

                <h1>
                    ${livro.titulo}
                </h1>

                <h3>
                    ${livro.autor}
                </h3>

                <p class="stars">
                    ★ ${media}
                </p>

                <p>
                    <strong>Categoria:</strong>

                    ${
                        livro.categoria ||
                        'Não informada'
                    }
                </p>

                <p>
                    <strong>Ano:</strong>

                    ${
                        livro.anoPublicacao ||
                        'Não informado'
                    }
                </p>

                <p>
                    <strong>Status:</strong>

                    <span
                        class="status ${
                            emprestado
                                ? 'out'
                                : ''
                        }"
                    >
                        ${
                            emprestado
                                ? 'Emprestado'
                                : 'Disponível'
                        }
                    </span>
                </p>

                <p>
                    ${
                        livro.descricao ||
                        'Este livro ainda não possui descrição.'
                    }
                </p>

            </div>

        </div>
    `;
}

function calcularMedia(
    avaliacoes
) {
    if (!avaliacoes.length) {
        return 'Sem avaliações';
    }

    const total =
        avaliacoes.reduce(
            (
                soma,
                avaliacao
            ) =>
                soma +
                avaliacao.nota,
            0
        );

    return (
        total /
        avaliacoes.length
    ).toFixed(1);
}

function carregarAlunosAvaliacao(
    alunos
) {
    const select =
        document.querySelector(
            '#alunoAvaliacao'
        );

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">
            Selecione o aluno...
        </option>

        ${alunos.map(aluno => `
            <option value="${aluno.id}">
                ${aluno.nome}
            </option>
        `).join('')}
    `;
}

function mostrarAvaliacoes(
    avaliacoes
) {
    const container =
        document.querySelector(
            '#listaAvaliacoes'
        );

    if (!container) {
        return;
    }

    if (!avaliacoes.length) {
        container.innerHTML = `
            <p class="muted">
                Este livro ainda não possui avaliações.
            </p>
        `;

        return;
    }

    container.innerHTML =
        avaliacoes.map(avaliacao => `

            <div class="review">

                <div class="stars">
                    ${criarEstrelas(
                        avaliacao.nota
                    )}
                </div>

                <strong>
                    ${
                        avaliacao.aluno?.nome ||
                        'Aluno'
                    }
                </strong>

                <p>
                    ${
                        avaliacao.comentario ||
                        'Sem comentário.'
                    }
                </p>

                <small>
                    ${
                        formatarDataAvaliacao(
                            avaliacao.data
                        )
                    }
                </small>

            </div>

        `).join('');
}

function criarEstrelas(nota) {
    let estrelas = '';

    for (
        let i = 1;
        i <= 5;
        i++
    ) {
        estrelas +=
            i <= nota
                ? '★'
                : '☆';
    }

    return estrelas;
}

function formatarDataAvaliacao(
    data
) {
    if (!data) {
        return '';
    }

    const partes =
        data.split('-');

    return (
        partes[2] +
        '/' +
        partes[1] +
        '/' +
        partes[0]
    );
}

const formAvaliacao =
    document.querySelector(
        '#formAvaliacao'
    );

if (formAvaliacao) {
    formAvaliacao.onsubmit =
        async event => {

            event.preventDefault();

            const alunoId =
                document.querySelector(
                    '#alunoAvaliacao'
                ).value;

            const nota =
                document.querySelector(
                    '#nota'
                ).value;

            const comentario =
                document.querySelector(
                    '#comentario'
                ).value;

            if (
                !alunoId ||
                !nota
            ) {
                alert(
                    'Selecione o aluno e a nota.'
                );

                return;
            }

            const avaliacao = {
                aluno: {
                    id:
                        Number(
                            alunoId
                        )
                },

                nota:
                    Number(
                        nota
                    ),

                comentario:
                    comentario
            };

            try {
                await api(
                    `/livros/${livroId}/avaliacoes`,
                    {
                        method:
                            'POST',

                        body:
                            JSON.stringify(
                                avaliacao
                            )
                    }
                );

                alert(
                    'Avaliação enviada!'
                );

                formAvaliacao.reset();

                await carregarLivro();

            } catch (erro) {
                console.error(erro);

                alert(
                    erro.message ||
                    'Não foi possível enviar a avaliação.'
                );
            }
        };
}

carregarLivro();