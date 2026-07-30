package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.RegistroDiaRequest;
import com.motoristasfinancas.api.dto.RegistroDiaResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.RegistroDiaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/registros")
@RequiredArgsConstructor
public class RegistroDiaController {

    private final RegistroDiaService registroService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<RegistroDiaResponse>> listar(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(registroService.listar(usuarioId));
    }

    @PostMapping
    public ResponseEntity<RegistroDiaResponse> criar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid RegistroDiaRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(registroService.criarOuAtualizar(usuarioId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        registroService.excluir(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
