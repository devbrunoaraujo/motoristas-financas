package com.motoristasfinancas.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.motoristasfinancas.api.model.enums.StatusAssinatura;

public record AssinaturaResponse(
    Long id,
    Long usuarioId,
    String usuarioNome,
    Long planoId,
    String planoNome,
    StatusAssinatura status,
    LocalDate dataInicio,
    LocalDate dataExpiracao,
    String confirmadoPorNome,
    LocalDateTime confirmadoEm
) {}
