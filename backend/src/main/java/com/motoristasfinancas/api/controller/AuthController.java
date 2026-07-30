package com.motoristasfinancas.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.AuthResponse;
import com.motoristasfinancas.api.dto.CadastroRequest;
import com.motoristasfinancas.api.dto.LoginRequest;
import com.motoristasfinancas.api.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/cadastro")
    public ResponseEntity<AuthResponse> cadastrar(@RequestBody @Valid CadastroRequest request) {
        return ResponseEntity.ok(authService.cadastrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
