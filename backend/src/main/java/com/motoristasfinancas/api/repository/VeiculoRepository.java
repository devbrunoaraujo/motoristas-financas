package com.motoristasfinancas.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    List<Veiculo> findByUsuarioIdAndAtivoTrue(Long usuarioId);

    Optional<Veiculo> findByIdAndUsuarioId(Long id, Long usuarioId);

    long countByUsuarioIdAndAtivoTrue(Long usuarioId);
}
