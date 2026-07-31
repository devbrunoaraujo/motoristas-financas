package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

public record CustoFixoResponse(
    Long id,
    String descricao,
    BigDecimal valorMensal,
    boolean ativo
) {}
