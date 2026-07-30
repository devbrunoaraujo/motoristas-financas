package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record MetaRequest(
    @NotNull(message = "Meta diária é obrigatória")
    @DecimalMin(value = "0.01", message = "Meta diária deve ser maior que zero")
    BigDecimal metaDiaria,

    @NotNull(message = "Meta semanal é obrigatória")
    @DecimalMin(value = "0.01", message = "Meta semanal deve ser maior que zero")
    BigDecimal metaSemanal,

    @NotNull(message = "Meta mensal é obrigatória")
    @DecimalMin(value = "0.01", message = "Meta mensal deve ser maior que zero")
    BigDecimal metaMensal
) {}
