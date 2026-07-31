package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.AnalisePlataforma;
import com.motoristasfinancas.api.dto.FinalizarTurnoRequest;
import com.motoristasfinancas.api.dto.IniciarTurnoRequest;
import com.motoristasfinancas.api.dto.TurnoResponse;
import com.motoristasfinancas.api.model.GanhoPorPlataforma;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.model.Turno;
import com.motoristasfinancas.api.model.Veiculo;
import com.motoristasfinancas.api.repository.GanhoPorPlataformaRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;
import com.motoristasfinancas.api.repository.TurnoRepository;
import com.motoristasfinancas.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final VeiculoRepository veiculoRepository;
    private final RegistroDiaRepository registroDiaRepository;
    private final GanhoPorPlataformaRepository ganhoPlataformaRepository;
    private final PlanoAcessoService planoAcessoService;

    @Transactional(readOnly = true)
    public List<TurnoResponse> listar(Long usuarioId) {
        planoAcessoService.exigirPro(usuarioId);

        return turnoRepository.findByUsuarioIdOrderByDataDescHoraInicioDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TurnoResponse getTurnoAtivo(Long usuarioId) {
        planoAcessoService.exigirPro(usuarioId);

        return turnoRepository.findByUsuarioIdAndEmAndamentoTrue(usuarioId)
                .map(this::toResponse)
                .orElse(null);
    }

    @Transactional
    public TurnoResponse iniciar(Long usuarioId, IniciarTurnoRequest request) {
        planoAcessoService.exigirPro(usuarioId);

        // Verificar se já tem turno em andamento
        if (turnoRepository.findByUsuarioIdAndEmAndamentoTrue(usuarioId).isPresent()) {
            throw new RuntimeException("Já existe um turno em andamento. Finalize-o antes de iniciar outro.");
        }

        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(request.veiculoId(), usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        Turno turno = new Turno();
        turno.setUsuario(veiculo.getUsuario());
        turno.setVeiculo(veiculo);
        turno.setData(LocalDate.now());
        turno.setHoraInicio(LocalTime.now());
        turno.setKmInicio(request.kmInicio());
        turno.setEmAndamento(true);
        turno.aoCriar();

        turno = turnoRepository.save(turno);
        return toResponse(turno);
    }

    @Transactional
    public TurnoResponse finalizar(Long usuarioId, Long turnoId, FinalizarTurnoRequest request) {
        planoAcessoService.exigirPro(usuarioId);

        Turno turno = turnoRepository.findByIdAndUsuarioId(turnoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Turno não encontrado"));

        if (!turno.isEmAndamento()) {
            throw new RuntimeException("Este turno já foi finalizado");
        }

        if (request.kmFim().compareTo(turno.getKmInicio()) <= 0) {
            throw new RuntimeException("KM final deve ser maior que o KM inicial");
        }

        turno.setHoraFim(LocalTime.now());
        turno.setKmFim(request.kmFim());
        turno.setEmAndamento(false);

        // Buscar registros do dia para calcular ganhos
        List<RegistroDia> registros = registroDiaRepository.findByUsuarioIdAndDataBetween(
                usuarioId, turno.getData(), turno.getData());

        BigDecimal ganhoBruto = registros.stream()
                .map(RegistroDia::getGanhoBrutoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal gastoCombustivel = registros.stream()
                .map(RegistroDia::getGastoCombustivelCalculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lucro = registros.stream()
                .map(RegistroDia::getLucroLiquido)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        turno.setGanhoBruto(ganhoBruto);
        turno.setGastoCombustivel(gastoCombustivel);
        turno.setLucroLiquido(lucro);

        turno = turnoRepository.save(turno);
        return toResponse(turno);
    }

    @Transactional
    public void excluir(Long usuarioId, Long turnoId) {
        planoAcessoService.exigirPro(usuarioId);

        Turno turno = turnoRepository.findByIdAndUsuarioId(turnoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Turno não encontrado"));

        turnoRepository.delete(turno);
    }

    @Transactional(readOnly = true)
    public List<AnalisePlataforma> getAnalisePlataformas(Long usuarioId, LocalDate inicio, LocalDate fim) {
        planoAcessoService.exigirPro(usuarioId);

        List<RegistroDia> registros = registroDiaRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);

        // Agrupar ganhos por plataforma
        java.util.Map<String, BigDecimal> ganhosPorPlataforma = new java.util.HashMap<>();
        java.util.Map<String, Long> diasPorPlataforma = new java.util.HashMap<>();

        for (RegistroDia reg : registros) {
            List<GanhoPorPlataforma> ganhos = ganhoPlataformaRepository.findByRegistroDiaId(reg.getId());
            for (GanhoPorPlataforma g : ganhos) {
                String nome = g.getPlataforma().name();
                ganhosPorPlataforma.merge(nome, g.getValor(), BigDecimal::add);
                diasPorPlataforma.merge(nome, 1L, Long::sum);
            }
        }

        BigDecimal totalGeral = ganhosPorPlataforma.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<AnalisePlataforma> resultado = new ArrayList<>();
        for (var entry : ganhosPorPlataforma.entrySet()) {
            String plataforma = entry.getKey();
            BigDecimal ganhoTotal = entry.getValue();
            BigDecimal percentual = totalGeral.compareTo(BigDecimal.ZERO) > 0
                    ? ganhoTotal.multiply(BigDecimal.valueOf(100)).divide(totalGeral, 1, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            long dias = diasPorPlataforma.getOrDefault(plataforma, 0L);
            BigDecimal ganhoMedio = dias > 0
                    ? ganhoTotal.divide(BigDecimal.valueOf(dias), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            resultado.add(new AnalisePlataforma(plataforma, ganhoTotal, percentual, ganhoMedio, dias));
        }

        resultado.sort((a, b) -> b.ganhoTotal().compareTo(a.ganhoTotal()));
        return resultado;
    }

    private TurnoResponse toResponse(Turno turno) {
        BigDecimal kmRodado = BigDecimal.ZERO;
        if (turno.getKmInicio() != null && turno.getKmFim() != null) {
            kmRodado = turno.getKmFim().subtract(turno.getKmInicio());
        }

        BigDecimal horasTrabalhadas = BigDecimal.ZERO;
        if (turno.getHoraInicio() != null && turno.getHoraFim() != null) {
            long minutos = Duration.between(turno.getHoraInicio(), turno.getHoraFim()).toMinutes();
            horasTrabalhadas = BigDecimal.valueOf(minutos).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        }

        BigDecimal lucroPorKm = BigDecimal.ZERO;
        if (kmRodado.compareTo(BigDecimal.ZERO) > 0 && turno.getLucroLiquido() != null) {
            lucroPorKm = turno.getLucroLiquido().divide(kmRodado, 2, RoundingMode.HALF_UP);
        }

        BigDecimal lucroPorHora = BigDecimal.ZERO;
        BigDecimal ganhoPorHora = BigDecimal.ZERO;
        if (horasTrabalhadas.compareTo(BigDecimal.ZERO) > 0) {
            if (turno.getLucroLiquido() != null) {
                lucroPorHora = turno.getLucroLiquido().divide(horasTrabalhadas, 2, RoundingMode.HALF_UP);
            }
            if (turno.getGanhoBruto() != null) {
                ganhoPorHora = turno.getGanhoBruto().divide(horasTrabalhadas, 2, RoundingMode.HALF_UP);
            }
        }

        return new TurnoResponse(
                turno.getId(),
                turno.getVeiculo().getId(),
                turno.getVeiculo().getApelido(),
                turno.getData(),
                turno.getHoraInicio(),
                turno.getHoraFim(),
                turno.getKmInicio(),
                turno.getKmFim(),
                kmRodado,
                turno.getGanhoBruto(),
                turno.getGastoCombustivel(),
                turno.getLucroLiquido(),
                lucroPorKm,
                lucroPorHora,
                ganhoPorHora,
                turno.isEmAndamento()
        );
    }
}
