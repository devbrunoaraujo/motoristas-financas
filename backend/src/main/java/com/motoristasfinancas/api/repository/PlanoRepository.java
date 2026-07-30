package com.motoristasfinancas.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Plano;

public interface PlanoRepository extends JpaRepository<Plano, Long> {

    List<Plano> findByAtivoTrue();
}
