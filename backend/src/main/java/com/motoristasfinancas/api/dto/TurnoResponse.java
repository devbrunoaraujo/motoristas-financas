package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record TurnoResponse(
    Long id,
    Long veiculoId,
    String veiculoApelido,
    LocalDate data,
    LocalTime horaInicio,
    LocalTime horaFim,
    BigDecimal kmInicio,
    BigDecimal kmFim,
    BigDecimal kmRodado,
    BigDecimal ganhoBruto,
    BigDecimal gastoCombustivel,
    BigDecimal lucroLiquido,
    BigDecimal lucroPorKm,
    BigDecimal lucroPorHora,
    BigDecimal ganhoPorHora,
    boolean emAndamento
) {}
