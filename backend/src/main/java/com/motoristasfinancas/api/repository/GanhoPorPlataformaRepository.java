package com.motoristasfinancas.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.GanhoPorPlataforma;

public interface GanhoPorPlataformaRepository extends JpaRepository<GanhoPorPlataforma, Long> {

    List<GanhoPorPlataforma> findByRegistroDiaId(Long registroDiaId);
}
