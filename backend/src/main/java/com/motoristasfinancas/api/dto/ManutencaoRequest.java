package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoManutencao;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public record ManutencaoRequest(
    @NotNull(message = "Tipo é obrigatório")
    TipoManutencao tipo,

    String descricao,

    @NotNull(message = "KM referência é obrigatório")
    @DecimalMin(value = "0", message = "KM deve ser positivo")
    BigDecimal kmReferencia,

    @NotNull(message = "Data é obrigatória")
    @PastOrPresent(message = "Data não pode ser futura")
    LocalDate data,

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    BigDecimal valor,

    BigDecimal proximoKm,

    LocalDate proximaData
) {}
