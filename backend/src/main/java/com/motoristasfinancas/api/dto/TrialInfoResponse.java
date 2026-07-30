package com.motoristasfinancas.api.dto;

import java.time.LocalDate;

public record TrialInfoResponse(
    int diasRestantes,
    LocalDate dataFimTrial,
    boolean expirado,
    String whatsappAdmin
) {}
