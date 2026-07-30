package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.AlertaManutencaoRequest;
import com.motoristasfinancas.api.dto.AlertaManutencaoResponse;
import com.motoristasfinancas.api.model.AlertaManutencao;
import com.motoristasfinancas.api.model.Veiculo;
import com.motoristasfinancas.api.repository.AlertaManutencaoRepository;
import com.motoristasfinancas.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertaManutencaoService {

    private final AlertaManutencaoRepository alertaRepository;
    private final VeiculoRepository veiculoRepository;
    private final PlanoAcessoService planoAcessoService;

    @Transactional(readOnly = true)
    public List<AlertaManutencaoResponse> listarAtivos(Long usuarioId) {
        planoAcessoService.exigirPro(usuarioId);

        return alertaRepository.findByVeiculoUsuarioIdAndAtivoTrue(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AlertaManutencaoResponse criar(Long usuarioId, Long veiculoId, AlertaManutencaoRequest request) {
        planoAcessoService.exigirPro(usuarioId);

        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(veiculoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        AlertaManutencao alerta = new AlertaManutencao();
        alerta.setVeiculo(veiculo);
        alerta.setTipo(request.tipo());
        alerta.setAtivo(true);
        alerta.setAlertarAposKm(request.alertarAposKm());
        alerta.setAlertarAposData(request.alertarAposData());

        alerta = alertaRepository.save(alerta);
        return toResponse(alerta);
    }

    @Transactional
    public void desativar(Long usuarioId, Long alertaId) {
        planoAcessoService.exigirPro(usuarioId);

        AlertaManutencao alerta = alertaRepository.findById(alertaId)
                .orElseThrow(() -> new RuntimeException("Alerta não encontrado"));

        if (!alerta.getVeiculo().getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Alerta não pertence ao usuário");
        }

        alerta.setAtivo(false);
        alertaRepository.save(alerta);
    }

    private AlertaManutencaoResponse toResponse(AlertaManutencao a) {
        return new AlertaManutencaoResponse(
                a.getId(),
                a.getVeiculo().getId(),
                a.getVeiculo().getApelido(),
                a.getTipo(),
                a.isAtivo(),
                a.getAlertarAposKm(),
                a.getAlertarAposData()
        );
    }
}
