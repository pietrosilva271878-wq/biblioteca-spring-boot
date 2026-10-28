package br.com.senai.teste.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.senai.teste.model.Emprestimo;
import br.com.senai.teste.service.EmprestimoService;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    // CADASTRAR EMPRÉSTIMO
    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody Emprestimo emprestimo) {

        try {

            // Verifica se aluno e livro foram enviados
            if (emprestimo.getAluno() == null ||
                emprestimo.getLivro() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Aluno e livro são obrigatórios");
            }

            Integer alunoId =
                    emprestimo.getAluno().getId();

            Integer livroId =
                    emprestimo.getLivro().getId();

            Emprestimo novo =
                    emprestimoService.cadastrar(
                            alunoId,
                            livroId
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(novo);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<List<Emprestimo>> listar() {

        return ResponseEntity.ok(
                emprestimoService.listar()
        );
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Emprestimo> buscarPorId(
            @PathVariable Integer id) {

        Optional<Emprestimo> emprestimo =
                emprestimoService.buscarPorId(id);

        if (emprestimo.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                emprestimo.get()
        );
    }

    // LISTAR EMPRÉSTIMOS DE UM ALUNO
    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<Emprestimo>> listarPorAluno(
            @PathVariable Integer alunoId) {

        return ResponseEntity.ok(
                emprestimoService.listarPorAluno(alunoId)
        );
    }

    // LISTAR EMPRÉSTIMOS PENDENTES
    @GetMapping("/pendentes")
    public ResponseEntity<List<Emprestimo>> listarPendentes() {

        return ResponseEntity.ok(
                emprestimoService.listarPendentes()
        );
    }

    // LISTAR EMPRÉSTIMOS ATRASADOS
    @GetMapping("/atrasados")
    public ResponseEntity<List<Emprestimo>> listarAtrasados() {

        return ResponseEntity.ok(
                emprestimoService.listarAtrasados()
        );
    }

    // LISTAR ATRASADOS POR ALUNO
    @GetMapping("/atrasados/aluno/{alunoId}")
    public ResponseEntity<List<Emprestimo>> listarAtrasadosPorAluno(
            @PathVariable Integer alunoId) {

        return ResponseEntity.ok(
                emprestimoService
                        .listarAtrasadosPorAluno(alunoId)
        );
    }

    // REGISTRAR DEVOLUÇÃO
    @PatchMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(
            @PathVariable Integer id) {

        try {

            Optional<Emprestimo> emprestimo =
                    emprestimoService
                            .registrarDevolucao(id);

            if (emprestimo.isEmpty()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            return ResponseEntity.ok(
                    emprestimo.get()
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // EXCLUIR EMPRÉSTIMO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Integer id) {

        boolean deletado =
                emprestimoService.deletar(id);

        if (!deletado) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity
                .noContent()
                .build();
    }
}