package br.com.senai.teste.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

import br.com.senai.teste.model.Livro;
import br.com.senai.teste.service.LivroService;


@RestController
@RequestMapping("/livros")
public class LivroController {

    private final LivroService livroService;


    public LivroController(
            LivroService livroService) {

        this.livroService =
                livroService;
    }


    // ==========================
    // CADASTRAR
    // ==========================

    @PostMapping
    public ResponseEntity<Livro> cadastrar(
            @RequestBody Livro livro) {

        Livro novoLivro =
                livroService.cadastrar(livro);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoLivro);
    }


    // ==========================
    // LISTAR
    // ==========================

    @GetMapping
    public ResponseEntity<List<Livro>> listar() {

        return ResponseEntity.ok(
                livroService.listar()
        );
    }


    // ==========================
    // BUSCAR POR ID
    // ==========================

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(
            @PathVariable Integer id) {


        Optional<Livro> livro =
                livroService.buscarPorId(id);


        if (livro.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        return ResponseEntity.ok(
                livro.get()
        );
    }


    // ==========================
    // ATUALIZAR
    // ==========================

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(
            @PathVariable Integer id,
            @RequestBody Livro livro) {


        Optional<Livro> atualizado =
                livroService.atualizar(
                        id,
                        livro
                );


        if (atualizado.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        return ResponseEntity.ok(
                atualizado.get()
        );
    }


    // ==========================
    // EXCLUIR
    // ==========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Integer id) {


        boolean deletado =
                livroService.deletar(id);


        if (!deletado) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        return ResponseEntity
                .noContent()
                .build();
    }


    // ==========================
    // UPLOAD DA CAPA
    // ==========================

    @PostMapping("/{id}/capa")
    public ResponseEntity<Livro> enviarCapa(
            @PathVariable Integer id,
            @RequestParam("arquivo")
            MultipartFile arquivo) {


        Livro atualizado =
                livroService.salvarCapa(
                        id,
                        arquivo
                );


        return ResponseEntity.ok(
                atualizado
        );
    }
}
