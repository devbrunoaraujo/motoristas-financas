package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MetaResponse(
    Long id,
    BigDecimal metaMensal,
    LocalDate vigenteDesde
) {}
