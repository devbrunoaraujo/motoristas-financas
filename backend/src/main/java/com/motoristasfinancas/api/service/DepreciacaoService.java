package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.DepreciacaoResponse;
import com.motoristasfinancas.api.model.Veiculo;
import com.motoristasfinancas.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepreciacaoService {

    private final VeiculoRepository veiculoRepository;
    private final PlanoAcessoService planoAcessoService;

    @Transactional(readOnly = true)
    public List<DepreciacaoResponse> calcularTodos(Long usuarioId) {
        planoAcessoService.exigirPro(usuarioId);

        return veiculoRepository.findByUsuarioIdAndAtivoTrue(usuarioId)
                .stream()
                .map(this::calcular)
                .toList();
    }

    @Transactional(readOnly = true)
    public DepreciacaoResponse calcularPorVeiculo(Long usuarioId, Long veiculoId) {
        planoAcessoService.exigirPro(usuarioId);

        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(veiculoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));
        return calcular(veiculo);
    }

    private DepreciacaoResponse calcular(Veiculo veiculo) {
        if (veiculo.getValorCompra() == null || veiculo.getDataAquisicao() == null) {
            return new DepreciacaoResponse(
                    veiculo.getId(),
                    veiculo.getApelido(),
                    veiculo.getValorCompra(),
                    veiculo.getValorRevendaEstimado(),
                    veiculo.getDataAquisicao(),
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    veiculo.getValorCompra(),
                    0
            );
        }

        LocalDate hoje = LocalDate.now();
        long dias = ChronoUnit.DAYS.between(veiculo.getDataAquisicao(), hoje);
        if (dias < 1) dias = 1;

        BigDecimal valorCompra = veiculo.getValorCompra();
        BigDecimal valorRevenda = veiculo.getValorRevendaEstimado() != null
                ? veiculo.getValorRevendaEstimado()
                : BigDecimal.ZERO;

        BigDecimal depreciacaoTotal = valorCompra.subtract(valorRevenda);
        if (depreciacaoTotal.compareTo(BigDecimal.ZERO) < 0) {
            depreciacaoTotal = BigDecimal.ZERO;
        }

        BigDecimal depreciacaoDiaria = depreciacaoTotal.divide(BigDecimal.valueOf(dias), 4, RoundingMode.HALF_UP);

        BigDecimal depreciacaoAcumulada = depreciacaoDiaria.multiply(BigDecimal.valueOf(dias));
        if (depreciacaoAcumulada.compareTo(depreciacaoTotal) > 0) {
            depreciacaoAcumulada = depreciacaoTotal;
        }

        BigDecimal valorAtual = valorCompra.subtract(depreciacaoAcumulada);

        return new DepreciacaoResponse(
                veiculo.getId(),
                veiculo.getApelido(),
                valorCompra,
                valorRevenda,
                veiculo.getDataAquisicao(),
                depreciacaoAcumulada.setScale(2, RoundingMode.HALF_UP),
                depreciacaoDiaria.setScale(4, RoundingMode.HALF_UP),
                valorAtual.setScale(2, RoundingMode.HALF_UP),
                dias
        );
    }
}
