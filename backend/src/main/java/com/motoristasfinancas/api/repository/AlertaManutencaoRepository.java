package com.motoristasfinancas.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.AlertaManutencao;

public interface AlertaManutencaoRepository extends JpaRepository<AlertaManutencao, Long> {

    List<AlertaManutencao> findByVeiculoUsuarioIdAndAtivoTrue(Long usuarioId);

    List<AlertaManutencao> findByVeiculoIdAndAtivoTrue(Long veiculoId);
}
