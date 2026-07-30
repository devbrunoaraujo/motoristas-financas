package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DepreciacaoResponse(
    Long veiculoId,
    String veiculoApelido,
    BigDecimal valorCompra,
    BigDecimal valorRevendaEstimado,
    LocalDate dataAquisicao,
    BigDecimal depreciacaoTotal,
    BigDecimal depreciacaoDiaria,
    BigDecimal valorAtualEstimado,
    long diasDesdeAquisicao
) {}
