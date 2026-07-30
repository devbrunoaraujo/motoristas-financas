package com.motoristasfinancas.api.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.VeiculoRequest;
import com.motoristasfinancas.api.dto.VeiculoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.VeiculoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/veiculos")
@RequiredArgsConstructor
public class VeiculoController {

    private final VeiculoService veiculoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<VeiculoResponse>> listar(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(veiculoService.listar(usuarioId));
    }

    @PostMapping
    public ResponseEntity<VeiculoResponse> criar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid VeiculoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(veiculoService.criar(usuarioId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VeiculoResponse> atualizar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid VeiculoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(veiculoService.atualizar(usuarioId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        veiculoService.inativar(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
