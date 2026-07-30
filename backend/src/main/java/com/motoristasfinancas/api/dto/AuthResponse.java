package com.motoristasfinancas.api.dto;

import com.motoristasfinancas.api.model.enums.Role;

public record AuthResponse(
    String token,
    String nome,
    String email,
    Role role
) {}
