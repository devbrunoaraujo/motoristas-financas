package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoCombustivel;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VeiculoRequest(
    @NotBlank(message = "Apelido é obrigatório")
    @Size(min = 2, max = 80, message = "Apelido deve ter entre 2 e 80 caracteres")
    String apelido,

    @Size(max = 10, message = "Placa deve ter no máximo 10 caracteres")
    String placa,

    @NotNull(message = "Tipo de combustível é obrigatório")
    TipoCombustivel tipoCombustivel,

    @NotNull(message = "Autonomia é obrigatória")
    @DecimalMin(value = "0.1", message = "Autonomia deve ser maior que zero")
    BigDecimal autonomia,

    BigDecimal valorCompra,
    BigDecimal valorRevendaEstimado,
    LocalDate dataAquisicao,
    BigDecimal kmAtual
) {}
