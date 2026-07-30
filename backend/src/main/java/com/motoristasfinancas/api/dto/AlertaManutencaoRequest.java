package com.motoristasfinancas.api.dto;

import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoManutencao;

import jakarta.validation.constraints.NotNull;

public record AlertaManutencaoRequest(
    @NotNull(message = "Tipo é obrigatório")
    TipoManutencao tipo,

    @NotNull(message = "Data de alerta é obrigatória")
    LocalDate alertarAposData
) {}
