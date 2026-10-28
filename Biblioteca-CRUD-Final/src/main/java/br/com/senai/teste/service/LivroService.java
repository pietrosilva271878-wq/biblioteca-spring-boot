package br.com.senai.teste.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import br.com.senai.teste.model.Livro;
import br.com.senai.teste.repository.LivroRepository;

@Service
public class LivroService {

    private final LivroRepository livroRepository;


    public LivroService(
            LivroRepository livroRepository) {

        this.livroRepository =
                livroRepository;
    }


    // ==========================
    // CADASTRAR
    // ==========================

    public Livro cadastrar(
            Livro livro) {

        return livroRepository.save(livro);
    }


    // ==========================
    // LISTAR
    // ==========================

    public List<Livro> listar() {

        return livroRepository.findAll();
    }


    // ==========================
    // BUSCAR POR ID
    // ==========================

    public Optional<Livro> buscarPorId(
            Integer id) {

        return livroRepository.findById(id);
    }


    // ==========================
    // ATUALIZAR
    // ==========================

    public Optional<Livro> atualizar(
            Integer id,
            Livro dadosLivro) {

        Optional<Livro> encontrado =
                livroRepository.findById(id);


        if (encontrado.isEmpty()) {

            return Optional.empty();
        }


        Livro livro =
                encontrado.get();


        livro.setTitulo(
                dadosLivro.getTitulo()
        );

        livro.setAutor(
                dadosLivro.getAutor()
        );

        livro.setAnoPublicacao(
                dadosLivro.getAnoPublicacao()
        );

        livro.setCategoria(
                dadosLivro.getCategoria()
        );

        livro.setDescricao(
                dadosLivro.getDescricao()
        );


        /*
         * IMPORTANTE:
         *
         * Não alteramos nomeArquivoCapa aqui.
         *
         * A capa é atualizada pelo método
         * salvarCapa().
         */


        Livro salvo =
                livroRepository.save(livro);


        return Optional.of(salvo);
    }


    // ==========================
    // DELETAR
    // ==========================

    public boolean deletar(
            Integer id) {

        if (!livroRepository.existsById(id)) {

            return false;
        }


        livroRepository.deleteById(id);

        return true;
    }


    // ==========================
    // SALVAR CAPA
    // ==========================

    public Livro salvarCapa(
            Integer id,
            MultipartFile arquivo) {


        Livro livro =
                livroRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Livro não encontrado"
                                        )
                        );


        if (arquivo == null ||
                arquivo.isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione uma imagem"
            );
        }


        // ==========================
        // NOME ORIGINAL
        // ==========================

        String nomeOriginal =
                arquivo.getOriginalFilename();


        if (nomeOriginal == null ||
                nomeOriginal.isBlank()) {

            nomeOriginal = "capa.jpg";
        }


        // Remove caracteres problemáticos

        nomeOriginal =
                nomeOriginal.replaceAll(
                        "[^a-zA-Z0-9._-]",
                        "_"
                );


        // ==========================
        // NOME ÚNICO
        // ==========================

        String nomeArquivo =
                System.currentTimeMillis()
                        + "-"
                        + nomeOriginal;


        // ==========================
        // PASTA
        // ==========================

        File pasta =
                new File("uploads/capas");


        if (!pasta.exists()) {

            pasta.mkdirs();
        }


        File destino =
                new File(
                        pasta,
                        nomeArquivo
                ).getAbsoluteFile();


        // ==========================
        // SALVAR IMAGEM
        // ==========================

        try {

            arquivo.transferTo(destino);

        } catch (IOException erro) {

            erro.printStackTrace();


            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao salvar a capa"
            );
        }


        // ==========================
        // SALVAR NOME NO BANCO
        // ==========================

        livro.setNomeArquivoCapa(
                nomeArquivo
        );


        return livroRepository.save(livro);
    }
}