package com.motoristasfinancas.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AuthResponse;
import com.motoristasfinancas.api.dto.CadastroRequest;
import com.motoristasfinancas.api.dto.LoginRequest;
import com.motoristasfinancas.api.dto.TrialInfoResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.AdminService;
import com.motoristasfinancas.api.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AdminService adminService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/cadastro")
    public ResponseEntity<AuthResponse> cadastrar(@RequestBody @Valid CadastroRequest request) {
        return ResponseEntity.ok(authService.cadastrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/trial-info")
    public ResponseEntity<TrialInfoResponse> getTrialInfo(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(adminService.getTrialInfo(usuarioId));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
