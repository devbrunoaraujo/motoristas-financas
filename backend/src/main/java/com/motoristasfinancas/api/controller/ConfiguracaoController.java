package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.ConfiguracaoRequest;
import com.motoristasfinancas.api.dto.ConfiguracaoResponse;
import com.motoristasfinancas.api.service.ConfiguracaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/configuracoes")
@RequiredArgsConstructor
public class ConfiguracaoController {

    private final ConfiguracaoService configuracaoService;

    @GetMapping
    public ResponseEntity<List<ConfiguracaoResponse>> listar() {
        return ResponseEntity.ok(configuracaoService.listar());
    }

    @GetMapping("/chave/{chave}")
    public ResponseEntity<String> buscarValor(@PathVariable String chave) {
        String valor = configuracaoService.buscarValor(chave);
        return valor != null ? ResponseEntity.ok(valor) : ResponseEntity.noContent().build();
    }
}
