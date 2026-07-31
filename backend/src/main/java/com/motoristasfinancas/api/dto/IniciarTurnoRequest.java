package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record IniciarTurnoRequest(
    @NotNull(message = "Veículo é obrigatório")
    Long veiculoId,

    @NotNull(message = "KM inicial é obrigatório")
    @DecimalMin(value = "0", message = "KM deve ser positivo")
    BigDecimal kmInicio
) {}
