package com.motoristasfinancas.api.dto;

public record ConfiguracaoResponse(
    Long id,
    String chave,
    String valor,
    String descricao
) {}
