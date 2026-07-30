package com.motoristasfinancas.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Configuracao;

public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {

    Optional<Configuracao> findByChave(String chave);
}
