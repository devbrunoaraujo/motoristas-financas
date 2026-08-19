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

import com.motoristasfinancas.api.dto.PlataformaRequest;
import com.motoristasfinancas.api.dto.PlataformaResponse;
import com.motoristasfinancas.api.security.RequireAdmin;
import com.motoristasfinancas.api.service.PlataformaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/plataformas")
@RequiredArgsConstructor
public class AdminPlataformaController {

    private final PlataformaService plataformaService;

    @RequireAdmin
    @GetMapping
    public ResponseEntity<List<PlataformaResponse>> listar(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(plataformaService.listarTodas());
    }

    @RequireAdmin
    @PostMapping
    public ResponseEntity<PlataformaResponse> criar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid PlataformaRequest request) {
        return ResponseEntity.ok(plataformaService.criar(request));
    }

    @RequireAdmin
    @PutMapping("/{id}")
    public ResponseEntity<PlataformaResponse> editar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid PlataformaRequest request) {
        return ResponseEntity.ok(plataformaService.editar(id, request));
    }

    @RequireAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        plataformaService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @RequireAdmin
    @PutMapping("/{id}/reativar")
    public ResponseEntity<Void> reativar(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        plataformaService.reativar(id);
        return ResponseEntity.noContent().build();
    }
}
