package br.com.senai.teste.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import br.com.senai.teste.model.Aluno;
import br.com.senai.teste.model.Emprestimo;
import br.com.senai.teste.model.Livro;
import br.com.senai.teste.repository.AlunoRepository;
import br.com.senai.teste.repository.EmprestimoRepository;
import br.com.senai.teste.repository.LivroRepository;

@Service
public class EmprestimoService {
    private final EmprestimoRepository emprestimoRepository;
    private final AlunoRepository alunoRepository;
    private final LivroRepository livroRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, AlunoRepository alunoRepository, LivroRepository livroRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.alunoRepository = alunoRepository;
        this.livroRepository = livroRepository;
    }

    public Emprestimo cadastrar(Integer alunoId, Integer livroId) {
        Aluno aluno = alunoRepository.findById(alunoId).orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Livro livro = livroRepository.findById(livroId).orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        if (emprestimoRepository.existsByLivroIdAndDataDevolucaoIsNull(livroId)) {
            throw new RuntimeException("Este livro já está emprestado");
        }
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setAluno(aluno);
        emprestimo.setLivro(livro);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataPrevistaDevolucao(LocalDate.now().plusDays(7));
        return emprestimoRepository.save(emprestimo);
    }

    public List<Emprestimo> listar() { return emprestimoRepository.findAll(); }
    public Optional<Emprestimo> buscarPorId(Integer id) { return emprestimoRepository.findById(id); }
    public List<Emprestimo> listarPorAluno(Integer alunoId) { return emprestimoRepository.findByAlunoId(alunoId); }
    public List<Emprestimo> listarPendentes() { return emprestimoRepository.findByDataDevolucaoIsNull(); }
    public List<Emprestimo> listarAtrasados() { return emprestimoRepository.findByDataPrevistaDevolucaoBeforeAndDataDevolucaoIsNull(LocalDate.now()); }
    public List<Emprestimo> listarAtrasadosPorAluno(Integer alunoId) { return emprestimoRepository.findByAlunoIdAndDataPrevistaDevolucaoBeforeAndDataDevolucaoIsNull(alunoId, LocalDate.now()); }

    public Optional<Emprestimo> registrarDevolucao(Integer id) {
        Optional<Emprestimo> opt = emprestimoRepository.findById(id);
        if (opt.isEmpty()) return Optional.empty();
        Emprestimo emprestimo = opt.get();
        if (emprestimo.getDataDevolucao() != null) throw new RuntimeException("Este livro já foi devolvido");
        emprestimo.setDataDevolucao(LocalDate.now());
        return Optional.of(emprestimoRepository.save(emprestimo));
    }

    public boolean deletar(Integer id) {
        if (!emprestimoRepository.existsById(id)) return false;
        emprestimoRepository.deleteById(id);
        return true;
    }
}
