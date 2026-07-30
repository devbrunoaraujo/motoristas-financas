package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

public record MetaProgresso(
    BigDecimal metaDiaria,
    BigDecimal realizadoDiaria,
    BigDecimal percentualDiaria,
    BigDecimal metaSemanal,
    BigDecimal realizadoSemanal,
    BigDecimal percentualSemanal,
    BigDecimal metaMensal,
    BigDecimal realizadoMensal,
    BigDecimal percentualMensal
) {}
