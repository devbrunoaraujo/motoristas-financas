package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustoFixoRequest(
    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 2, max = 100, message = "Descrição deve ter entre 2 e 100 caracteres")
    String descricao,

    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    BigDecimal valorMensal
) {}
