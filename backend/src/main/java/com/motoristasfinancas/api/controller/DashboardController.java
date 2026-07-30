package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.DashboardResponse;
import com.motoristasfinancas.api.dto.DiaResumo;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(dashboardService.getDashboard(usuarioId));
    }

    @GetMapping("/ultimos-dias")
    public ResponseEntity<List<DiaResumo>> getUltimosDias(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "7") int dias) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(dashboardService.getUltimosDias(usuarioId, dias));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
