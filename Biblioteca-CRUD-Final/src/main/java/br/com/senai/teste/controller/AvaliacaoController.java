package br.com.senai.teste.controller;
import java.util.*; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import br.com.senai.teste.model.Avaliacao; import br.com.senai.teste.service.AvaliacaoService;
@RestController @RequestMapping("/livros/{livroId}/avaliacoes") public class AvaliacaoController { private final AvaliacaoService service; public AvaliacaoController(AvaliacaoService s){service=s;}
 @GetMapping public List<Avaliacao> listar(@PathVariable Integer livroId){return service.listar(livroId);} 
 @PostMapping public ResponseEntity<?> criar(@PathVariable Integer livroId,@RequestBody Map<String,Object> body){try{Integer alunoId=Integer.valueOf(body.get("alunoId").toString());Integer nota=Integer.valueOf(body.get("nota").toString());String comentario=Objects.toString(body.get("comentario"),"");return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(livroId,alunoId,nota,comentario));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());}}
 @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Integer id){return service.excluir(id)?ResponseEntity.noContent().build():ResponseEntity.notFound().build();}
}
