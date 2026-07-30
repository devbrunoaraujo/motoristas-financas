package com.motoristasfinancas.api.dto;

import com.motoristasfinancas.api.model.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminCriarUsuarioRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 120)
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 100)
    String senha,

    @NotNull(message = "Role é obrigatória")
    Role role
) {}
