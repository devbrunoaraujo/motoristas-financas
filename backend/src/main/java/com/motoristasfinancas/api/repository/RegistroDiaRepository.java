package com.motoristasfinancas.api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motoristasfinancas.api.model.RegistroDia;

public interface RegistroDiaRepository extends JpaRepository<RegistroDia, Long> {

    List<RegistroDia> findByUsuarioIdOrderByDataDesc(Long usuarioId);

    Optional<RegistroDia> findByIdAndUsuarioId(Long id, Long usuarioId);

    Optional<RegistroDia> findByUsuarioIdAndData(Long usuarioId, LocalDate data);

    List<RegistroDia> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}
