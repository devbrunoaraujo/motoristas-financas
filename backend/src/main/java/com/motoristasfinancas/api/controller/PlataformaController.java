package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.PlataformaResponse;
import com.motoristasfinancas.api.service.PlataformaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/plataformas")
@RequiredArgsConstructor
public class PlataformaController {

    private final PlataformaService plataformaService;

    @GetMapping
    public ResponseEntity<List<PlataformaResponse>> listarAtivas() {
        return ResponseEntity.ok(plataformaService.listarAtivas());
    }
}
