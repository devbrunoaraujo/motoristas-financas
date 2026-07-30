package com.motoristasfinancas.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlataformaRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    String nome,

    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    String descricao
) {}
