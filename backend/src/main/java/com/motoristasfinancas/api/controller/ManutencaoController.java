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

import com.motoristasfinancas.api.dto.ManutencaoRequest;
import com.motoristasfinancas.api.dto.ManutencaoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.ManutencaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/veiculos/{veiculoId}/manutencoes")
@RequiredArgsConstructor
public class ManutencaoController {

    private final ManutencaoService manutencaoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<ManutencaoResponse>> listar(
            @AuthenticationPrincipal User user,
            @PathVariable Long veiculoId) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(manutencaoService.listarPorVeiculo(usuarioId, veiculoId));
    }

    @PostMapping
    public ResponseEntity<ManutencaoResponse> criar(
            @AuthenticationPrincipal User user,
            @PathVariable Long veiculoId,
            @RequestBody @Valid ManutencaoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(manutencaoService.criar(usuarioId, veiculoId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @AuthenticationPrincipal User user,
            @PathVariable Long veiculoId,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        manutencaoService.excluir(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
