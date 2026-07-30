package com.motoristasfinancas.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.StatusUsuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByStatus(StatusUsuario status);
}
