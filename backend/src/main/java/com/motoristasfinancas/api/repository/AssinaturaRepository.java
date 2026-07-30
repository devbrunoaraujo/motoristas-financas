package com.motoristasfinancas.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Assinatura;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long> {

    Optional<Assinatura> findFirstByUsuarioIdOrderByDataExpiracaoDesc(Long usuarioId);
}
