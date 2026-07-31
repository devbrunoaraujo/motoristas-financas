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

import com.motoristasfinancas.api.dto.CustoFixoRequest;
import com.motoristasfinancas.api.dto.CustoFixoResponse;
import com.motoristasfinancas.api.dto.PontoEquilibrioResponse;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.FinanceiroService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/financeiro")
@RequiredArgsConstructor
public class FinanceiroController {

    private final FinanceiroService financeiroService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/custos-fixos")
    public ResponseEntity<List<CustoFixoResponse>> listarCustosFixos(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(financeiroService.listarCustosFixos(usuarioId));
    }

    @PostMapping("/custos-fixos")
    public ResponseEntity<CustoFixoResponse> criarCustoFixo(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid CustoFixoRequest request) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(financeiroService.criarCustoFixo(usuarioId, request));
    }

    @DeleteMapping("/custos-fixos/{id}")
    public ResponseEntity<Void> excluirCustoFixo(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Long usuarioId = getUsuarioId(user);
        financeiroService.excluirCustoFixo(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ponto-equilibrio")
    public ResponseEntity<PontoEquilibrioResponse> getPontoEquilibrio(@AuthenticationPrincipal User user) {
        Long usuarioId = getUsuarioId(user);
        return ResponseEntity.ok(financeiroService.getPontoEquilibrio(usuarioId));
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
