package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.motoristasfinancas.api.model.enums.Plataforma;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public record RegistroDiaRequest(
    @NotNull(message = "Veículo é obrigatório")
    Long veiculoId,

    @NotNull(message = "Data é obrigatória")
    @PastOrPresent(message = "Data não pode ser futura")
    LocalDate data,

    @NotNull(message = "KM rodado é obrigatório")
    @DecimalMin(value = "0.01", message = "KM rodado deve ser maior que zero")
    BigDecimal kmRodado,

    @NotEmpty(message = "Deve ter pelo menos um ganho de plataforma")
    List<@Valid GanhoPlataformaRequest> ganhos
) {
    public record GanhoPlataformaRequest(
        @NotNull(message = "Plataforma é obrigatória")
        Plataforma plataforma,

        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
        BigDecimal valor
    ) {}
}
