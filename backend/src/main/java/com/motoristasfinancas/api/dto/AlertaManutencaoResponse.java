package com.motoristasfinancas.api.dto;

import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoManutencao;

public record AlertaManutencaoResponse(
    Long id,
    Long veiculoId,
    String veiculoApelido,
    TipoManutencao tipo,
    boolean ativo,
    LocalDate alertarAposData
) {}
