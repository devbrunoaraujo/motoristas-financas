package com.motoristasfinancas.api.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfiguracaoRequest(
    @NotBlank(message = "Valor é obrigatório")
    String valor
) {}
