package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.DashboardResponse;
import com.motoristasfinancas.api.dto.DiaResumo;
import com.motoristasfinancas.api.model.Despesa;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.repository.DespesaRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RegistroDiaRepository registroRepository;
    private final DespesaRepository despesaRepository;

    public DashboardResponse getDashboard(Long usuarioId) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioSemana = hoje.with(DayOfWeek.MONDAY);
        LocalDate inicioMes = hoje.withDayOfMonth(1);

        List<RegistroDia> registrosHoje = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, hoje, hoje);
        List<RegistroDia> registrosSemana = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicioSemana, hoje);
        List<RegistroDia> registrosMes = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicioMes, hoje);
        List<Despesa> despesasMes = despesaRepository.findByUsuarioIdAndDataBetween(usuarioId, inicioMes, hoje);

        BigDecimal ganhoBrutoDia = sumGanhoBruto(registrosHoje);
        BigDecimal ganhoBrutoSemana = sumGanhoBruto(registrosSemana);
        BigDecimal ganhoBrutoMes = sumGanhoBruto(registrosMes);

        BigDecimal gastoCombustivelDia = sumGastoCombustivel(registrosHoje);
        BigDecimal gastoCombustivelSemana = sumGastoCombustivel(registrosSemana);
        BigDecimal gastoCombustivelMes = sumGastoCombustivel(registrosMes);

        BigDecimal despesasMesTotal = despesasMes.stream()
                .map(Despesa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lucroLiquidoDia = sumLucroLiquido(registrosHoje);
        BigDecimal lucroLiquidoSemana = sumLucroLiquido(registrosSemana);
        BigDecimal lucroLiquidoMes = sumLucroLiquido(registrosMes).subtract(despesasMesTotal);

        BigDecimal kmTotalRodado = registrosMes.stream()
                .map(RegistroDia::getKmRodado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ganhoMedioPorKm = BigDecimal.ZERO;
        if (kmTotalRodado.compareTo(BigDecimal.ZERO) > 0) {
            ganhoMedioPorKm = ganhoBrutoMes.divide(kmTotalRodado, 2, RoundingMode.HALF_UP);
        }

        return new DashboardResponse(
                ganhoBrutoDia,
                ganhoBrutoSemana,
                ganhoBrutoMes,
                gastoCombustivelDia,
                gastoCombustivelSemana,
                gastoCombustivelMes,
                despesasMesTotal,
                lucroLiquidoDia,
                lucroLiquidoSemana,
                lucroLiquidoMes,
                kmTotalRodado,
                ganhoMedioPorKm,
                inicioSemana,
                inicioMes
        );
    }

    @Transactional(readOnly = true)
    public List<DiaResumo> getUltimosDias(Long usuarioId, int dias) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.minusDays(dias - 1);

        List<RegistroDia> registros = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, hoje);

        List<DiaResumo> resultado = new ArrayList<>();
        for (int i = 0; i < dias; i++) {
            LocalDate data = inicio.plusDays(i);
            final LocalDate dataFinal = data;

            List<RegistroDia> doDia = registros.stream()
                    .filter(r -> r.getData().equals(dataFinal))
                    .toList();

            BigDecimal ganho = sumGanhoBruto(doDia);
            BigDecimal combustivel = sumGastoCombustivel(doDia);
            BigDecimal lucro = sumLucroLiquido(doDia);

            BigDecimal percentualGanho = BigDecimal.ZERO;
            BigDecimal percentualCombustivel = BigDecimal.ZERO;

            BigDecimal total = ganho.add(combustivel);
            if (total.compareTo(BigDecimal.ZERO) > 0) {
                percentualGanho = ganho.multiply(BigDecimal.valueOf(100)).divide(total, 1, RoundingMode.HALF_UP);
                percentualCombustivel = combustivel.multiply(BigDecimal.valueOf(100)).divide(total, 1, RoundingMode.HALF_UP);
            }

            resultado.add(new DiaResumo(data, ganho, combustivel, lucro, percentualGanho, percentualCombustivel));
        }

        return resultado;
    }

    private BigDecimal sumGanhoBruto(List<RegistroDia> registros) {
        return registros.stream()
                .map(RegistroDia::getGanhoBrutoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumGastoCombustivel(List<RegistroDia> registros) {
        return registros.stream()
                .map(RegistroDia::getGastoCombustivelCalculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumLucroLiquido(List<RegistroDia> registros) {
        return registros.stream()
                .map(RegistroDia::getLucroLiquido)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
