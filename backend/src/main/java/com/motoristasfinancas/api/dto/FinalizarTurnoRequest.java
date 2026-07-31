package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record FinalizarTurnoRequest(
    @NotNull(message = "KM final é obrigatório")
    @DecimalMin(value = "0", message = "KM deve ser positivo")
    BigDecimal kmFim
) {}
