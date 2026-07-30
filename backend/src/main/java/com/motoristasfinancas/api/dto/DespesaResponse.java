package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.CategoriaDespesa;

public record DespesaResponse(
    Long id,
    CategoriaDespesa categoria,
    String descricao,
    BigDecimal valor,
    LocalDate data
) {}
