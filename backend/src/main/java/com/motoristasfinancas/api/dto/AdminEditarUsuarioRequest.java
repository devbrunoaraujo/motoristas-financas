package com.motoristasfinancas.api.dto;

import com.motoristasfinancas.api.model.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminEditarUsuarioRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 120)
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    @NotNull(message = "Role é obrigatória")
    Role role
) {}
