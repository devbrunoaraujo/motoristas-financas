package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

public record PlanoResponse(
    Long id,
    String nome,
    BigDecimal valorMensal,
    int limiteVeiculos,
    String descricaoFuncionalidades,
    boolean ativo
) {}
