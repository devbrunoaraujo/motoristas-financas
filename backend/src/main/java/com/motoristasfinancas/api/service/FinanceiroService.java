package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.CustoFixoRequest;
import com.motoristasfinancas.api.dto.CustoFixoResponse;
import com.motoristasfinancas.api.dto.PontoEquilibrioResponse;
import com.motoristasfinancas.api.model.CustoFixo;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.repository.CustoFixoRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FinanceiroService {

    private final CustoFixoRepository custoFixoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroDiaRepository registroRepository;

    // CRUD CustoFixo

    @Transactional(readOnly = true)
    public List<CustoFixoResponse> listarCustosFixos(Long usuarioId) {
        return custoFixoRepository.findByUsuarioIdAndAtivoTrue(usuarioId)
                .stream()
                .map(this::toCustoFixoResponse)
                .toList();
    }

    @Transactional
    public CustoFixoResponse criarCustoFixo(Long usuarioId, CustoFixoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        CustoFixo custo = new CustoFixo();
        custo.setUsuario(usuario);
        custo.setDescricao(request.descricao());
        custo.setValorMensal(request.valorMensal());
        custo.setAtivo(true);

        custo = custoFixoRepository.save(custo);
        return toCustoFixoResponse(custo);
    }

    @Transactional
    public void excluirCustoFixo(Long usuarioId, Long custoId) {
        CustoFixo custo = custoFixoRepository.findById(custoId)
                .orElseThrow(() -> new RuntimeException("Custo não encontrado"));

        if (!custo.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Custo não pertence ao usuário");
        }

        custoFixoRepository.delete(custo);
    }

    // Ponto de Equilíbrio

    @Transactional(readOnly = true)
    public PontoEquilibrioResponse getPontoEquilibrio(Long usuarioId) {
        // Custos fixos do mês
        BigDecimal custosFixos = custoFixoRepository.findByUsuarioIdAndAtivoTrue(usuarioId)
                .stream()
                .map(CustoFixo::getValorMensal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Ganhos e gastos dos últimos 30 dias
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.minusDays(30);
        List<RegistroDia> registros = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, hoje);

        long diasComRegistro = registros.size();
        if (diasComRegistro == 0) {
            return new PontoEquilibrioResponse(
                    custosFixos, BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, false
            );
        }

        BigDecimal ganhoTotal = registros.stream()
                .map(RegistroDia::getGanhoBrutoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal custoVariavelTotal = registros.stream()
                .map(r -> r.getGastoCombustivelCalculado().add(r.getLucroLiquido().negate().add(r.getGanhoBrutoTotal())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Na verdade, custo variável = combustível + despesas (não lucro)
        BigDecimal combustivelTotal = registros.stream()
                .map(RegistroDia::getGastoCombustivelCalculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ganhoMedioDia = ganhoTotal.divide(BigDecimal.valueOf(diasComRegistro), 2, RoundingMode.HALF_UP);
        BigDecimal custoVariavelMedioDia = combustivelTotal.divide(BigDecimal.valueOf(diasComRegistro), 2, RoundingMode.HALF_UP);

        // Ponto de equilíbrio diário = custos_fixos_mensal / 30 + custo_variavel_medio_dia
        BigDecimal custosFixosDiario = custosFixos.divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP);
        BigDecimal pontoEquilibrioDia = custosFixosDiario.add(custoVariavelMedioDia);

        // Ponto de equilíbrio mensal
        BigDecimal pontoEquilibrioMes = custosFixos.add(custoVariavelMedioDia.multiply(BigDecimal.valueOf(30)));

        // Margem atual
        BigDecimal margemAtual = ganhoMedioDia.subtract(pontoEquilibrioDia);
        boolean acima = margemAtual.compareTo(BigDecimal.ZERO) > 0;

        return new PontoEquilibrioResponse(
                custosFixos,
                custoVariavelMedioDia,
                ganhoMedioDia,
                pontoEquilibrioDia,
                pontoEquilibrioMes,
                margemAtual,
                acima
        );
    }

    private CustoFixoResponse toCustoFixoResponse(CustoFixo custo) {
        return new CustoFixoResponse(
                custo.getId(),
                custo.getDescricao(),
                custo.getValorMensal(),
                custo.isAtivo()
        );
    }
}
