package br.com.senai.teste.model;
import java.time.LocalDateTime; import jakarta.persistence.*;
@Entity @Table(name="avaliacoes") public class Avaliacao {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Integer id;
 @ManyToOne(optional=false) @JoinColumn(name="livro_id") private Livro livro;
 @ManyToOne(optional=false) @JoinColumn(name="aluno_id") private Aluno aluno;
 private Integer nota; @Column(length=800) private String comentario; private LocalDateTime dataAvaliacao;
 public Integer getId(){return id;} public Livro getLivro(){return livro;} public void setLivro(Livro v){livro=v;}
 public Aluno getAluno(){return aluno;} public void setAluno(Aluno v){aluno=v;} public Integer getNota(){return nota;} public void setNota(Integer v){nota=v;}
 public String getComentario(){return comentario;} public void setComentario(String v){comentario=v;} public LocalDateTime getDataAvaliacao(){return dataAvaliacao;} public void setDataAvaliacao(LocalDateTime v){dataAvaliacao=v;}
}
