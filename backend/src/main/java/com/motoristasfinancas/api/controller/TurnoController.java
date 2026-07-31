package com.motoristasfinancas.api.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AnalisePlataforma;
import com.motoristasfinancas.api.dto.FinalizarTurnoRequest;
import com.motoristasfinancas.api.dto.IniciarTurnoRequest;
import com.motoristasfinancas.api.dto.TurnoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.TurnoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<TurnoResponse>> listar(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(turnoService.listar(usuarioId));
    }

    @GetMapping("/ativo")
    public ResponseEntity<TurnoResponse> getTurnoAtivo(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        TurnoResponse turno = turnoService.getTurnoAtivo(usuarioId);
        return turno != null ? ResponseEntity.ok(turno) : ResponseEntity.noContent().build();
    }

    @PostMapping("/iniciar")
    public ResponseEntity<TurnoResponse> iniciar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid IniciarTurnoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(turnoService.iniciar(usuarioId, request));
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<TurnoResponse> finalizar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid FinalizarTurnoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(turnoService.finalizar(usuarioId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        turnoService.excluir(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analise-plataformas")
    public ResponseEntity<List<AnalisePlataforma>> analisePlataformas(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "30") int dias) {
        Long usuarioId = getUsuarioId(user);
        LocalDate fim = LocalDate.now();
        LocalDate inicio = fim.minusDays(dias);
        return ResponseEntity.ok(turnoService.getAnalisePlataformas(usuarioId, inicio, fim));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
