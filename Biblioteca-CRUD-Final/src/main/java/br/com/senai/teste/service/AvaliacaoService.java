package br.com.senai.teste.service;
import java.time.LocalDateTime; import java.util.List; import org.springframework.stereotype.Service; import br.com.senai.teste.model.*; import br.com.senai.teste.repository.*;
@Service public class AvaliacaoService { private final AvaliacaoRepository repo; private final LivroRepository livros; private final AlunoRepository alunos;
 public AvaliacaoService(AvaliacaoRepository r,LivroRepository l,AlunoRepository a){repo=r;livros=l;alunos=a;}
 public List<Avaliacao> listar(Integer livroId){return repo.findByLivroIdOrderByDataAvaliacaoDesc(livroId);}
 public Avaliacao criar(Integer livroId,Integer alunoId,Integer nota,String comentario){ if(nota==null||nota<1||nota>5) throw new RuntimeException("A nota deve ser de 1 a 5"); Livro l=livros.findById(livroId).orElseThrow(()->new RuntimeException("Livro não encontrado")); Aluno a=alunos.findById(alunoId).orElseThrow(()->new RuntimeException("Aluno não encontrado")); Avaliacao av=new Avaliacao(); av.setLivro(l);av.setAluno(a);av.setNota(nota);av.setComentario(comentario);av.setDataAvaliacao(LocalDateTime.now());return repo.save(av); }
 public boolean excluir(Integer id){if(!repo.existsById(id))return false;repo.deleteById(id);return true;}
}
