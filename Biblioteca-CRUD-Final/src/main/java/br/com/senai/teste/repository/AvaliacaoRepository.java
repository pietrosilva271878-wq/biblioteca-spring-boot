package br.com.senai.teste.repository;
import java.util.List; import org.springframework.data.jpa.repository.JpaRepository; import br.com.senai.teste.model.Avaliacao;
public interface AvaliacaoRepository extends JpaRepository<Avaliacao,Integer>{ List<Avaliacao> findByLivroIdOrderByDataAvaliacaoDesc(Integer livroId); }
