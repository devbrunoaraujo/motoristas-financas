package com.motoristasfinancas.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.MetaProgresso;
import com.motoristasfinancas.api.dto.MetaRequest;
import com.motoristasfinancas.api.dto.MetaResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.MetaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/metas")
@RequiredArgsConstructor
public class MetaController {

    private final MetaService metaService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<MetaResponse> getMeta(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        MetaResponse meta = metaService.getMeta(usuarioId);
        return meta != null ? ResponseEntity.ok(meta) : ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<MetaResponse> criarOuAtualizar(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid MetaRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(metaService.criarOuAtualizar(usuarioId, request));
    }

    @GetMapping("/progresso")
    public ResponseEntity<MetaProgresso> getProgresso(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        MetaProgresso progresso = metaService.getProgresso(usuarioId);
        return progresso != null ? ResponseEntity.ok(progresso) : ResponseEntity.noContent().build();
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
