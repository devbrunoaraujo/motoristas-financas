package com.motoristasfinancas.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Plataforma;

public interface PlataformaRepository extends JpaRepository<Plataforma, Long> {

    List<Plataforma> findByAtivoTrueOrderById();

    Optional<Plataforma> findByNome(String nome);

    boolean existsByNome(String nome);
}
