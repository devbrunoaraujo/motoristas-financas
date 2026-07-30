package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AlertaManutencaoRequest;
import com.motoristasfinancas.api.dto.AlertaManutencaoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.AlertaManutencaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/veiculos/{veiculoId}/alertas")
@RequiredArgsConstructor
public class AlertaManutencaoController {

    private final AlertaManutencaoService alertaService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<AlertaManutencaoResponse> criar(
            @AuthenticationPrincipal User user,
            @PathVariable Long veiculoId,
            @RequestBody @Valid AlertaManutencaoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(alertaService.criar(usuarioId, veiculoId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(
            @AuthenticationPrincipal User user,
            @PathVariable Long veiculoId,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        alertaService.desativar(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
