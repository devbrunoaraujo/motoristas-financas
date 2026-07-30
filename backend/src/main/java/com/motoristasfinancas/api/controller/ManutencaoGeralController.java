package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AlertaManutencaoResponse;
import com.motoristasfinancas.api.dto.ManutencaoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.AlertaManutencaoService;
import com.motoristasfinancas.api.service.ManutencaoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/manutencao")
@RequiredArgsConstructor
public class ManutencaoGeralController {

    private final ManutencaoService manutencaoService;
    private final AlertaManutencaoService alertaService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/historico")
    public ResponseEntity<List<ManutencaoResponse>> historicoCompleto(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(manutencaoService.listarTodos(usuarioId));
    }

    @GetMapping("/alertas")
    public ResponseEntity<List<AlertaManutencaoResponse>> alertasAtivos(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(alertaService.listarAtivos(usuarioId));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
