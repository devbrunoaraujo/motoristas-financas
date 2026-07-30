package com.motoristasfinancas.api.dto;

public record ConfirmarPagamentoRequest(
    Long usuarioId,
    Long planoId
) {}
