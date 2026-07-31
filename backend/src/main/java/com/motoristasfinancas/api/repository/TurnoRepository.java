package com.motoristasfinancas.api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.Turno;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    List<Turno> findByUsuarioIdOrderByDataDescHoraInicioDesc(Long usuarioId);

    Optional<Turno> findByIdAndUsuarioId(Long id, Long usuarioId);

    Optional<Turno> findByUsuarioIdAndEmAndamentoTrue(Long usuarioId);

    List<Turno> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}
