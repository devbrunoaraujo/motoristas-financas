package com.motoristasfinancas.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Meta;

public interface MetaRepository extends JpaRepository<Meta, Long> {

    Optional<Meta> findFirstByUsuarioIdOrderByVigenteDesdeDesc(Long usuarioId);
}
