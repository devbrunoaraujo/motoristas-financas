package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.motoristasfinancas.api.model.enums.TipoCombustivel;

public record VeiculoResponse(
    Long id,
    String apelido,
    String placa,
    TipoCombustivel tipoCombustivel,
    BigDecimal autonomia,
    boolean ativo,
    BigDecimal valorCompra,
    BigDecimal valorRevendaEstimado,
    LocalDate dataAquisicao,
    BigDecimal kmAtual
) {}
