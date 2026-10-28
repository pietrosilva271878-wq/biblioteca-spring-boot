package br.com.senai.teste.dto;

import java.time.LocalDate;

import org.springframework.cglib.core.Local;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public class RenovacaoRequest {
    @NotNull(message = "O ID do empréstimo é obrigatório")
    private Integer emprestimoId;
    @Future (message = "A nova data de devolução é obrigatória")
    private String novaDataDevolucao;

    public RenovacaoRequest() {
    }

    public LocalDate getNovaDataDevolucao() {
        return LocalDate.parse(novaDataDevolucao);
    }
    public void setNovaDataDevolucao(LocalDate novaDataDevolucao) {
        this.novaDataDevolucao = novaDataDevolucao.toString();
    }

}






