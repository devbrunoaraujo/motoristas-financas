package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DiaResumo(
    LocalDate data,
    BigDecimal ganhoBruto,
    BigDecimal gastoCombustivel,
    BigDecimal lucroLiquido,
    BigDecimal percentualGanho,
    BigDecimal percentualCombustivel
) {}
