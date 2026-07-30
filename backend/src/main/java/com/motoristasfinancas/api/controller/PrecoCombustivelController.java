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

import com.motoristasfinancas.api.dto.PrecoCombustivelRequest;
import com.motoristasfinancas.api.dto.PrecoCombustivelResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.PrecoCombustivelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/combustivel")
@RequiredArgsConstructor
public class PrecoCombustivelController {

    private final PrecoCombustivelService precoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<PrecoCombustivelResponse>> listar(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(precoService.listar(usuarioId));
    }

    @PostMapping
    public ResponseEntity<PrecoCombustivelResponse> criar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid PrecoCombustivelRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(precoService.criar(usuarioId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        precoService.excluir(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
