package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DashboardResponse(
    BigDecimal ganhoBrutoDia,
    BigDecimal ganhoBrutoSemana,
    BigDecimal ganhoBrutoMes,
    BigDecimal gastoCombustivelDia,
    BigDecimal gastoCombustivelSemana,
    BigDecimal gastoCombustivelMes,
    BigDecimal despesasMes,
    BigDecimal lucroLiquidoDia,
    BigDecimal lucroLiquidoSemana,
    BigDecimal lucroLiquidoMes,
    BigDecimal kmTotalRodado,
    BigDecimal ganhoMedioPorKm,
    LocalDate inicioSemana,
    LocalDate inicioMes
) {}
