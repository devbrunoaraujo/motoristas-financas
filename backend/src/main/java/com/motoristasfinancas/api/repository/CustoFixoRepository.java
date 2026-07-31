package com.motoristasfinancas.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.CustoFixo;

public interface CustoFixoRepository extends JpaRepository<CustoFixo, Long> {

    List<CustoFixo> findByUsuarioIdAndAtivoTrue(Long usuarioId);
}
