package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.motoristasfinancas.api.model.enums.Plataforma;

public record RegistroDiaResponse(
    Long id,
    Long veiculoId,
    String veiculoApelido,
    LocalDate data,
    BigDecimal kmRodado,
    BigDecimal ganhoBrutoTotal,
    BigDecimal gastoCombustivelCalculado,
    BigDecimal lucroLiquido,
    List<GanhoPlataformaResponse> ganhos
) {
    public record GanhoPlataformaResponse(
        Long id,
        Plataforma plataforma,
        BigDecimal valor
    ) {}
}
