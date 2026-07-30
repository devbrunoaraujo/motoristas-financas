package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

import com.motoristasfinancas.api.model.enums.TipoManutencao;

import jakarta.validation.constraints.NotNull;

public record AlertaManutencaoRequest(
    @NotNull(message = "Tipo é obrigatório")
    TipoManutencao tipo,

    BigDecimal alertarAposKm,
    java.time.LocalDate alertarAposData
) {}
