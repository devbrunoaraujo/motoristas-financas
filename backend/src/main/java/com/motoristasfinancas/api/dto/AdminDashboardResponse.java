package com.motoristasfinancas.api.dto;

import java.math.BigDecimal;

public record AdminDashboardResponse(
    long totalUsuarios,
    long usuariosTrialAtivo,
    long usuariosAtivos,
    long usuariosBloqueados,
    long usuariosTrialExpirado,
    BigDecimal receitaPotencial
) {}
