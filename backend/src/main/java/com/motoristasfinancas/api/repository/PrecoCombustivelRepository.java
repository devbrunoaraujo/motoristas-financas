package com.motoristasfinancas.api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.motoristasfinancas.api.model.PrecoCombustivel;
import com.motoristasfinancas.api.model.enums.TipoCombustivel;

public interface PrecoCombustivelRepository extends JpaRepository<PrecoCombustivel, Long> {

    List<PrecoCombustivel> findByUsuarioIdOrderByVigenteDesdeDesc(Long usuarioId);

    Optional<PrecoCombustivel> findByIdAndUsuarioId(Long id, Long usuarioId);

    @Query("""
        SELECT p FROM PrecoCombustivel p
        WHERE p.usuario.id = :usuarioId
          AND p.tipoCombustivel = :tipo
          AND p.vigenteDesde <= :data
        ORDER BY p.vigenteDesde DESC
        LIMIT 1
    """)
    Optional<PrecoCombustivel> findVigente(
            @Param("usuarioId") Long usuarioId,
            @Param("tipo") TipoCombustivel tipo,
            @Param("data") LocalDate data);
}
