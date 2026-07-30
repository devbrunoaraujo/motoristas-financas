package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record MetaRequest(
    @NotNull(message = "Meta mensal é obrigatória")
    @DecimalMin(value = "0.01", message = "Meta mensal deve ser maior que zero")
    BigDecimal metaMensal
) {}
