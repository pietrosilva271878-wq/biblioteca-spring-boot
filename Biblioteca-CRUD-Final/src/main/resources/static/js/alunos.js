let alunos = [];
let editando = null;

async function carregarAlunos() {
    try {
        alunos = await api('/alunos');
        renderizarAlunos();
    } catch (erro) {
        console.error(erro);
        alert('Erro ao carregar alunos.');
    }
}

function renderizarAlunos() {
    const termo = filtro.value.toLowerCase();

    const filtrados = alunos.filter(aluno => {
        return `${aluno.nome} ${aluno.email}`
            .toLowerCase()
            .includes(termo);
    });

    lista.innerHTML = filtrados.map(aluno => `
        <div class="admin-row">

            <div>
                <b>${aluno.nome}</b>

                <br>

                <span class="muted">
                    ${aluno.email}
                </span>
            </div>

            <div>
                <button
                    onclick="editarAluno(${aluno.id})"
                >
                    Editar
                </button>

                <button
                    class="danger"
                    onclick="excluirAluno(${aluno.id})"
                >
                    Excluir
                </button>
            </div>

        </div>
    `).join('');
}

filtro.oninput = renderizarAlunos;

form.onsubmit = async event => {
    event.preventDefault();

    const aluno = {
        nome: nome.value,
        email: email.value
    };

    try {
        await api(
            editando
                ? `/alunos/${editando}`
                : '/alunos',
            {
                method: editando
                    ? 'PUT'
                    : 'POST',

                body: JSON.stringify(aluno)
            }
        );

        limparFormulario();

        await carregarAlunos();

    } catch (erro) {
        console.error(erro);

        alert(
            'Não foi possível salvar o aluno.'
        );
    }
};

function editarAluno(id) {
    const aluno = alunos.find(
        aluno => aluno.id === id
    );

    if (!aluno) {
        return;
    }

    editando = id;

    nome.value = aluno.nome;
    email.value = aluno.email;

    ft.textContent = 'Editar aluno';

    cancelar.style.display =
        'inline-block';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

async function excluirAluno(id) {
    const confirmar = confirm(
        'Deseja excluir este aluno?'
    );

    if (!confirmar) {
        return;
    }

    try {
        await api(
            `/alunos/${id}`,
            {
                method: 'DELETE'
            }
        );

        await carregarAlunos();

    } catch (erro) {
        console.error(erro);

        alert(
            'Não foi possível excluir o aluno. ' +
            'Ele pode possuir empréstimos ou avaliações.'
        );
    }
}

function limparFormulario() {
    editando = null;

    form.reset();

    ft.textContent =
        'Cadastrar aluno';

    cancelar.style.display =
        'none';
}

cancelar.onclick =
    limparFormulario;

carregarAlunos();