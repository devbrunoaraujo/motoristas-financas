package com.motoristasfinancas.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.dto.PlanoResponse;
import com.motoristasfinancas.api.service.PlanoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/planos")
@RequiredArgsConstructor
public class PlanoController {

    private final PlanoService planoService;

    @GetMapping
    public ResponseEntity<List<PlanoResponse>> listarAtivos() {
        return ResponseEntity.ok(planoService.listarAtivos());
    }
}
