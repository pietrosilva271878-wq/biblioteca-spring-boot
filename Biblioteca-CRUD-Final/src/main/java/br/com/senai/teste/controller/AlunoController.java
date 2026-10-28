package br.com.senai.teste.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import br.com.senai.teste.model.Aluno;
import br.com.senai.teste.service.AlunoService;

@RestController
@RequestMapping("/alunos")
public class AlunoController {
    
    private final AlunoService alunoService;

    public AlunoController(AlunoService AlunoService) {
       this.alunoService = AlunoService;
    }

    @PostMapping
    public ResponseEntity<Aluno> cadastrar(
             @RequestBody Aluno aluno) {
        
        Aluno alunoCadastrado = alunoService.cadastrar(aluno);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(alunoCadastrado);
        
        
        }
    
    @GetMapping
    public ResponseEntity<List<Aluno>> listar() {
        List<Aluno> alunos = alunoService.listar();

        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Integer id){
        Optional<Aluno> alunoOptional = alunoService.buscarPorId(id);
        
        if (alunoOptional.isPresent()){
            return ResponseEntity.ok(alunoOptional.get());

        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aluno> atualizar(
        @PathVariable Integer id,
        @RequestBody Aluno novosDados){
            Optional<Aluno> alunoOptional = alunoService.atualizar(id, novosDados);

            if (alunoOptional.isPresent()){
                return ResponseEntity.ok(alunoOptional.get());
            }
            return ResponseEntity.notFound().build();
        }
    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id ){
        boolean deletado = alunoService.deletar(id);

        if (deletado){
            return ResponseEntity.noContent().build();

        }   
        return ResponseEntity.notFound().build();
    }
    
}
