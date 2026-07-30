package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoManutencao;

public record ManutencaoResponse(
    Long id,
    Long veiculoId,
    String veiculoApelido,
    TipoManutencao tipo,
    String descricao,
    BigDecimal kmReferencia,
    LocalDate data,
    BigDecimal valor,
    BigDecimal proximoKm,
    LocalDate proximaData
) {}
