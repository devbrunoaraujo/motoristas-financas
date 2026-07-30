package com.motoristasfinancas.api.dto;

public record PlataformaResponse(
    Long id,
    String nome,
    String descricao,
    boolean ativo
) {}
