package com.motoristasfinancas.api.dto;

import com.motoristasfinancas.api.model.enums.Role;
import com.motoristasfinancas.api.model.enums.StatusUsuario;

public record AuthResponse(
    String token,
    String nome,
    String email,
    Role role,
    StatusUsuario status
) {}
