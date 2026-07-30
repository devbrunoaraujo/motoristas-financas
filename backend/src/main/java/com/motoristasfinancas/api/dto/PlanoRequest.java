package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlanoRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    String nome,

    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    BigDecimal valorMensal,

    @Min(value = -1, message = "Limite deve ser -1 (ilimitado) ou maior que 0")
    int limiteVeiculos,

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    String descricaoFuncionalidades
) {}
