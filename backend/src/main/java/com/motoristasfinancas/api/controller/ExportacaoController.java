package com.motoristasfinancas.api.controller;

import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.service.ExportacaoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class ExportacaoController {

    private final ExportacaoService exportacaoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/mensal")
    public ResponseEntity<byte[]> exportarMensal(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "xlsx") String formato,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {

        Long usuarioId = getUsuarioId(user);

        LocalDate hoje = LocalDate.now();
        int mesRef = mes != null ? mes : hoje.getMonthValue();
        int anoRef = ano != null ? ano : hoje.getYear();

        try {
            if ("pdf".equalsIgnoreCase(formato)) {
                byte[] pdf = exportacaoService.exportarPdf(usuarioId, mesRef, anoRef);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_" + mesRef + "_" + anoRef + ".pdf")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(pdf);
            } else {
                byte[] excel = exportacaoService.exportarExcel(usuarioId, mesRef, anoRef);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_" + mesRef + "_" + anoRef + ".xlsx")
                        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                        .body(excel);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Long getUsuarioId(User user) {
        return usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
}
