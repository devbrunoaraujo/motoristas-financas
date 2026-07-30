package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoCombustivel;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public record PrecoCombustivelRequest(
    @NotNull(message = "Tipo de combustível é obrigatório")
    TipoCombustivel tipoCombustivel,

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.001", message = "Preço deve ser maior que zero")
    BigDecimal preco,

    @NotNull(message = "Data de vigência é obrigatória")
    @PastOrPresent(message = "Data de vigência não pode ser futura")
    LocalDate vigenteDesde
) {}
