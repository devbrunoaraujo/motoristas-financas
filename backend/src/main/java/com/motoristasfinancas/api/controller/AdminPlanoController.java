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

import com.motoristasfinancas.api.dto.PlanoRequest;
import com.motoristasfinancas.api.dto.PlanoResponse;
import com.motoristasfinancas.api.service.PlanoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/planos")
@RequiredArgsConstructor
public class AdminPlanoController {

    private final PlanoService planoService;

    @GetMapping
    public ResponseEntity<List<PlanoResponse>> listar() {
        return ResponseEntity.ok(planoService.listar());
    }

    @PostMapping
    public ResponseEntity<PlanoResponse> criar(@RequestBody @Valid PlanoRequest request) {
        return ResponseEntity.ok(planoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid PlanoRequest request) {
        return ResponseEntity.ok(planoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        planoService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
