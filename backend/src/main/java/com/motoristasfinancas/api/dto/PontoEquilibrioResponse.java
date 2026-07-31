package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

public record PontoEquilibrioResponse(
    BigDecimal custosFixosMensal,
    BigDecimal custoVariavelMedioDia,
    BigDecimal ganhoMedioDia,
    BigDecimal pontoEquilibrioDia,
    BigDecimal pontoEquilibrioMes,
    BigDecimal margemAtual,
    boolean acimaDoPontoEquilibrio
) {}
