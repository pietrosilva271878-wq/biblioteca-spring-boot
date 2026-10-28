package br.com.senai.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.senai.teste.model.Livro;

@Repository
public interface LivroRepository
        extends JpaRepository<Livro, Integer> {

}