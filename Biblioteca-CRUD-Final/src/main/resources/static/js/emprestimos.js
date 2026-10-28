let emprestimos = [];
let alunos = [];
let livros = [];

async function carregarPagina() {
    try {
        [
            alunos,
            livros,
            emprestimos
        ] = await Promise.all([
            api('/alunos'),
            api('/livros'),
            api('/emprestimos')
        ]);

        carregarSelectAlunos();
        carregarSelectLivros();
        renderizarEmprestimos();

    } catch (erro) {
        console.error(erro);

        alert(
            'Erro ao carregar empréstimos.'
        );
    }
}

function carregarSelectAlunos() {
    aluno.innerHTML = `
        <option value="">
            Selecione um aluno...
        </option>

        ${alunos.map(aluno => `
            <option value="${aluno.id}">
                ${aluno.nome}
            </option>
        `).join('')}
    `;
}

function carregarSelectLivros() {
    const livrosEmprestados =
        emprestimos
            .filter(
                emprestimo =>
                    !emprestimo.dataDevolucao
            )
            .map(
                emprestimo =>
                    emprestimo.livro?.id
            );

    livro.innerHTML = `
        <option value="">
            Selecione um livro...
        </option>

        ${livros.map(item => {

            const emprestado =
                livrosEmprestados.includes(
                    item.id
                );

            return `
                <option
                    value="${item.id}"
                    ${emprestado ? 'disabled' : ''}
                >
                    ${item.titulo}
                    —
                    ${
                        emprestado
                            ? 'Emprestado'
                            : 'Disponível'
                    }
                </option>
            `;

        }).join('')}
    `;
}

function renderizarEmprestimos() {
    if (!emprestimos.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhum empréstimo cadastrado.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        emprestimos.map(emprestimo => {

            const status =
                descobrirStatus(
                    emprestimo
                );

            return `
                <tr>

                    <td>
                        ${emprestimo.id}
                    </td>

                    <td>
                        ${
                            emprestimo.aluno?.nome
                            || '-'
                        }
                    </td>

                    <td>
                        ${
                            emprestimo.livro?.titulo
                            || '-'
                        }
                    </td>

                    <td>
                        ${formatarData(
                            emprestimo.dataEmprestimo
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            emprestimo
                                .dataPrevistaDevolucao
                        )}
                    </td>

                    <td>
                        <span
                            class="badge ${status.classe}"
                        >
                            ${status.texto}
                        </span>
                    </td>

                    <td>

                        ${
                            !emprestimo.dataDevolucao
                            ? `
                                <button
                                    onclick="
                                        devolverLivro(
                                            ${emprestimo.id}
                                        )
                                    "
                                >
                                    Devolver
                                </button>
                            `
                            : ''
                        }

                        <button
                            class="danger"
                            onclick="
                                excluirEmprestimo(
                                    ${emprestimo.id}
                                )
                            "
                        >
                            Excluir
                        </button>

                    </td>

                </tr>
            `;
        }).join('');
}

function descobrirStatus(
    emprestimo
) {
    if (emprestimo.dataDevolucao) {
        return {
            texto:
                'Devolvido',

            classe:
                'done'
        };
    }

    if (
        emprestimo.dataPrevistaDevolucao
    ) {
        const hoje =
            new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const prevista =
            new Date(
                emprestimo
                    .dataPrevistaDevolucao +
                'T00:00:00'
            );

        if (prevista < hoje) {
            return {
                texto:
                    'Atrasado',

                classe:
                    'late'
            };
        }
    }

    return {
        texto:
            'Ativo',

        classe:
            'active'
    };
}

function formatarData(data) {
    if (!data) {
        return '-';
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

form.onsubmit = async event => {
    event.preventDefault();

    if (
        !aluno.value ||
        !livro.value
    ) {
        alert(
            'Selecione um aluno e um livro.'
        );

        return;
    }

    const emprestimo = {
        aluno: {
            id: Number(
                aluno.value
            )
        },

        livro: {
            id: Number(
                livro.value
            )
        }
    };

    try {
        await api(
            '/emprestimos',
            {
                method:
                    'POST',

                body:
                    JSON.stringify(
                        emprestimo
                    )
            }
        );

        alert(
            'Empréstimo realizado com sucesso!'
        );

        form.reset();

        await carregarPagina();

    } catch (erro) {
        console.error(erro);

        alert(
            erro.message ||
            'Não foi possível realizar o empréstimo.'
        );
    }
};

async function devolverLivro(id) {
    const confirmar =
        confirm(
            'Registrar a devolução deste livro?'
        );

    if (!confirmar) {
        return;
    }

    try {
        await api(
            `/emprestimos/${id}/devolver`,
            {
                method:
                    'PATCH'
            }
        );

        alert(
            'Livro devolvido com sucesso!'
        );

        await carregarPagina();

    } catch (erro) {
        console.error(erro);

        alert(
            erro.message ||
            'Erro ao registrar devolução.'
        );
    }
}

async function excluirEmprestimo(id) {
    const confirmar =
        confirm(
            'Deseja excluir este empréstimo?'
        );

    if (!confirmar) {
        return;
    }

    try {
        await api(
            `/emprestimos/${id}`,
            {
                method:
                    'DELETE'
            }
        );

        await carregarPagina();

    } catch (erro) {
        console.error(erro);

        alert(
            'Não foi possível excluir o empréstimo.'
        );
    }
}

carregarPagina();