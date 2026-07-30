package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AdminDashboardResponse;
import com.motoristasfinancas.api.dto.AdminUsuarioResponse;
import com.motoristasfinancas.api.dto.AssinaturaResponse;
import com.motoristasfinancas.api.dto.ConfirmarPagamentoRequest;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<AdminUsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarUsuarios());
    }

    @PostMapping("/confirmar-pagamento")
    public ResponseEntity<AssinaturaResponse> confirmarPagamento(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid ConfirmarPagamentoRequest request) {
        Long adminId = getUsuarioId(user);
        return ResponseEntity.ok(adminService.confirmarPagamento(request, adminId));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
