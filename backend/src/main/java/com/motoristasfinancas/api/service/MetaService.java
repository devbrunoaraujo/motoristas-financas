package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.MetaProgresso;
import com.motoristasfinancas.api.dto.MetaRequest;
import com.motoristasfinancas.api.dto.MetaResponse;
import com.motoristasfinancas.api.model.Meta;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.repository.MetaRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MetaService {

    private final MetaRepository metaRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroDiaRepository registroRepository;

    @Transactional(readOnly = true)
    public MetaResponse getMeta(Long usuarioId) {
        return metaRepository.findFirstByUsuarioIdOrderByVigenteDesdeDesc(usuarioId)
                .map(this::toResponse)
                .orElse(null);
    }

    @Transactional
    public MetaResponse criarOuAtualizar(Long usuarioId, MetaRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Meta meta = metaRepository.findFirstByUsuarioIdOrderByVigenteDesdeDesc(usuarioId)
                .orElse(null);

        if (meta != null) {
            meta.setMetaDiaria(request.metaDiaria());
            meta.setMetaSemanal(request.metaSemanal());
            meta.setMetaMensal(request.metaMensal());
        } else {
            meta = new Meta();
            meta.setUsuario(usuario);
            meta.setMetaDiaria(request.metaDiaria());
            meta.setMetaSemanal(request.metaSemanal());
            meta.setMetaMensal(request.metaMensal());
            meta.setVigenteDesde(LocalDate.now());
        }

        meta = metaRepository.save(meta);
        return toResponse(meta);
    }

    @Transactional(readOnly = true)
    public MetaProgresso getProgresso(Long usuarioId) {
        Meta meta = metaRepository.findFirstByUsuarioIdOrderByVigenteDesdeDesc(usuarioId)
                .orElse(null);

        if (meta == null) {
            return null;
        }

        LocalDate hoje = LocalDate.now();
        LocalDate inicioSemana = hoje.with(DayOfWeek.MONDAY);
        LocalDate inicioMes = hoje.withDayOfMonth(1);

        List<RegistroDia> registrosHoje = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, hoje, hoje);
        List<RegistroDia> registrosSemana = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicioSemana, hoje);
        List<RegistroDia> registrosMes = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicioMes, hoje);

        BigDecimal realizadoDiaria = registrosHoje.stream()
                .map(RegistroDia::getLucroLiquido)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal realizadoSemanal = registrosSemana.stream()
                .map(RegistroDia::getLucroLiquido)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal realizadoMensal = registrosMes.stream()
                .map(RegistroDia::getLucroLiquido)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal percentualDiaria = calcularPercentual(realizadoDiaria, meta.getMetaDiaria());
        BigDecimal percentualSemanal = calcularPercentual(realizadoSemanal, meta.getMetaSemanal());
        BigDecimal percentualMensal = calcularPercentual(realizadoMensal, meta.getMetaMensal());

        return new MetaProgresso(
                meta.getMetaDiaria(), realizadoDiaria, percentualDiaria,
                meta.getMetaSemanal(), realizadoSemanal, percentualSemanal,
                meta.getMetaMensal(), realizadoMensal, percentualMensal
        );
    }

    private BigDecimal calcularPercentual(BigDecimal realizado, BigDecimal meta) {
        if (meta.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        return realizado.multiply(BigDecimal.valueOf(100))
                .divide(meta, 1, RoundingMode.HALF_UP);
    }

    private MetaResponse toResponse(Meta meta) {
        return new MetaResponse(
                meta.getId(),
                meta.getMetaDiaria(),
                meta.getMetaSemanal(),
                meta.getMetaMensal(),
                meta.getVigenteDesde()
        );
    }
}
