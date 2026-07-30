package com.motoristasfinancas.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.motoristasfinancas.api.model.enums.Role;
import com.motoristasfinancas.api.model.enums.StatusUsuario;

public record AdminUsuarioResponse(
    Long id,
    String nome,
    String email,
    Role role,
    StatusUsuario status,
    LocalDate dataInicioTrial,
    LocalDate dataFimTrial,
    LocalDateTime criadoEm,
    AssinaturaResponse assinaturaAtiva
) {}
