package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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
import com.motoristasfinancas.api.service.PlataformaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/plataformas")
@RequiredArgsConstructor
public class AdminPlataformaController {

    private final PlataformaService plataformaService;

    @GetMapping
    public ResponseEntity<List<PlataformaResponse>> listar() {
        return ResponseEntity.ok(plataformaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<PlataformaResponse> criar(@RequestBody @Valid PlataformaRequest request) {
        return ResponseEntity.ok(plataformaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlataformaResponse> editar(
            @PathVariable Long id,
            @RequestBody @Valid PlataformaRequest request) {
        return ResponseEntity.ok(plataformaService.editar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        plataformaService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/reativar")
    public ResponseEntity<Void> reativar(@PathVariable Long id) {
        plataformaService.reativar(id);
        return ResponseEntity.noContent().build();
    }
}
