package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AdminCriarUsuarioRequest;
import com.motoristasfinancas.api.dto.AdminDashboardResponse;
import com.motoristasfinancas.api.dto.AdminEditarUsuarioRequest;
import com.motoristasfinancas.api.dto.AdminUsuarioResponse;
import com.motoristasfinancas.api.dto.AssinaturaResponse;
import com.motoristasfinancas.api.dto.ConfirmarPagamentoRequest;
import com.motoristasfinancas.api.dto.TrialInfoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.security.RequireAdmin;
import com.motoristasfinancas.api.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UsuarioRepository usuarioRepository;

    @RequireAdmin
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @RequireAdmin
    @GetMapping("/usuarios")
    public ResponseEntity<List<AdminUsuarioResponse>> listarUsuarios(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(adminService.listarUsuarios());
    }

    @RequireAdmin
    @PostMapping("/usuarios")
    public ResponseEntity<AdminUsuarioResponse> criarUsuario(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid AdminCriarUsuarioRequest request) {
        return ResponseEntity.ok(adminService.criarUsuario(request));
    }

    @RequireAdmin
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<AdminUsuarioResponse> editarUsuario(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid AdminEditarUsuarioRequest request) {
        return ResponseEntity.ok(adminService.editarUsuario(id, request));
    }

    @RequireAdmin
    @PutMapping("/usuarios/{id}/inativar")
    public ResponseEntity<AdminUsuarioResponse> inativarUsuario(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(adminService.inativarUsuario(id));
    }

    @RequireAdmin
    @PutMapping("/usuarios/{id}/reativar")
    public ResponseEntity<AdminUsuarioResponse> reativarUsuario(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(adminService.reativarUsuario(id));
    }

    @RequireAdmin
    @PostMapping("/confirmar-pagamento")
    public ResponseEntity<AssinaturaResponse> confirmarPagamento(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid ConfirmarPagamentoRequest request) {
        Long adminId = getUsuarioId(user);
        return ResponseEntity.ok(adminService.confirmarPagamento(request, adminId));
    }

    @RequireAdmin
    @PutMapping("/usuarios/{id}/plano/{planoId}")
    public ResponseEntity<AssinaturaResponse> alterarPlano(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long planoId) {
        Long adminId = getUsuarioId(user);
        return ResponseEntity.ok(adminService.alterarPlano(id, planoId, adminId));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
