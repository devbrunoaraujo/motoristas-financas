package com.motoristasfinancas.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Manutencao;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    List<Manutencao> findByVeiculoIdOrderByDataDesc(Long veiculoId);

    List<Manutencao> findByVeiculoUsuarioIdOrderByDataDesc(Long usuarioId);
}
