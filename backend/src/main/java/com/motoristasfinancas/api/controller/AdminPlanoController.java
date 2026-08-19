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

import com.motoristasfinancas.api.dto.PlanoRequest;
import com.motoristasfinancas.api.dto.PlanoResponse;
import com.motoristasfinancas.api.security.RequireAdmin;
import com.motoristasfinancas.api.service.PlanoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/planos")
@RequiredArgsConstructor
public class AdminPlanoController {

    private final PlanoService planoService;

    @RequireAdmin
    @GetMapping
    public ResponseEntity<List<PlanoResponse>> listar(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(planoService.listar());
    }

    @RequireAdmin
    @PostMapping
    public ResponseEntity<PlanoResponse> criar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid PlanoRequest request) {
        return ResponseEntity.ok(planoService.criar(request));
    }

    @RequireAdmin
    @PutMapping("/{id}")
    public ResponseEntity<PlanoResponse> atualizar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid PlanoRequest request) {
        return ResponseEntity.ok(planoService.atualizar(id, request));
    }

    @RequireAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        planoService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
