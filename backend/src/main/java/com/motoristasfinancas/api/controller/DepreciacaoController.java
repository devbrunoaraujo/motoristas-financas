package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.DepreciacaoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.DepreciacaoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/depreciacao")
@RequiredArgsConstructor
public class DepreciacaoController {

    private final DepreciacaoService depreciacaoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<DepreciacaoResponse>> calcularTodos(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(depreciacaoService.calcularTodos(usuarioId));
    }

    @GetMapping("/{veiculoId}")
    public ResponseEntity<DepreciacaoResponse> calcularPorVeiculo(
            @AuthenticationPrincipal User user,
            @PathVariable Long veiculoId) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(depreciacaoService.calcularPorVeiculo(usuarioId, veiculoId));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
