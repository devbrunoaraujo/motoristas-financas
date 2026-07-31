package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

public record AnalisePlataforma(
    String plataforma,
    BigDecimal ganhoTotal,
    BigDecimal percentualDoTotal,
    BigDecimal ganhoMedioPorDia,
    long diasTrabalhados
) {}
