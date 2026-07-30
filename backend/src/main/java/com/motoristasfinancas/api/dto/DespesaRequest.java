package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.CategoriaDespesa;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DespesaRequest(
    @NotNull(message = "Categoria é obrigatória")
    CategoriaDespesa categoria,

    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    String descricao,

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    BigDecimal valor,

    @NotNull(message = "Data é obrigatória")
    LocalDate data
) {}
