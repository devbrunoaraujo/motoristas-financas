package com.motoristasfinancas.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Assinatura;
import com.motoristasfinancas.api.model.enums.StatusAssinatura;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long> {

    Optional<Assinatura> findFirstByUsuarioIdOrderByDataExpiracaoDesc(Long usuarioId);

    List<Assinatura> findByUsuarioIdAndStatus(Long usuarioId, StatusAssinatura status);
}
