package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoCombustivel;

public record PrecoCombustivelResponse(
    Long id,
    TipoCombustivel tipoCombustivel,
    BigDecimal preco,
    LocalDate vigenteDesde
) {}
