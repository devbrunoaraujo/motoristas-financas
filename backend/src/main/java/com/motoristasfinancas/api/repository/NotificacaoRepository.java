package com.motoristasfinancas.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Notificacao;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(Long usuarioId);

    List<Notificacao> findByUsuarioIdOrderByCriadaEmDesc(Long usuarioId);

    long countByUsuarioIdAndLidaFalse(Long usuarioId);
}
