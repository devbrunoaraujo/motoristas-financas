package com.motoristasfinancas.api.dto;

import java.time.LocalDateTime;

import com.motoristasfinancas.api.model.enums.TipoNotificacao;

public record NotificacaoResponse(
    Long id,
    TipoNotificacao tipo,
    String titulo,
    String mensagem,
    boolean lida,
    LocalDateTime criadaEm
) {}
