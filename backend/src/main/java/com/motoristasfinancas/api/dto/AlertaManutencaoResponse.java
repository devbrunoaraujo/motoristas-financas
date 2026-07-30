package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoManutencao;

public record AlertaManutencaoResponse(
    Long id,
    Long veiculoId,
    String veiculoApelido,
    TipoManutencao tipo,
    boolean ativo,
    BigDecimal alertarAposKm,
    LocalDate alertarAposData
) {}
