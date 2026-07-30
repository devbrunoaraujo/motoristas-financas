package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.RegistroDiaRequest;
import com.motoristasfinancas.api.dto.RegistroDiaResponse;
import com.motoristasfinancas.api.model.GanhoPorPlataforma;
import com.motoristasfinancas.api.model.PrecoCombustivel;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.model.Veiculo;
import com.motoristasfinancas.api.repository.PrecoCombustivelRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;
import com.motoristasfinancas.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistroDiaService {

    private final RegistroDiaRepository registroRepository;
    private final VeiculoRepository veiculoRepository;
    private final PrecoCombustivelRepository precoRepository;

    @Transactional(readOnly = true)
    public List<RegistroDiaResponse> listar(Long usuarioId) {
        return registroRepository.findByUsuarioIdOrderByDataDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RegistroDiaResponse criarOuAtualizar(Long usuarioId, RegistroDiaRequest request) {
        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(request.veiculoId(), usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        PrecoCombustivel precoVigente = precoRepository.findVigente(
                usuarioId, veiculo.getTipoCombustivel(), request.data())
                .orElseThrow(() -> new RuntimeException("Nenhum preço de combustível vigente cadastrado para esta data"));

        BigDecimal gastoCombustivel = calcularGastoCombustivel(
                request.kmRodado(), veiculo.getAutonomia(), precoVigente.getPreco());

        BigDecimal ganhoBrutoTotal = request.ganhos().stream()
                .map(RegistroDiaRequest.GanhoPlataformaRequest::valor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        RegistroDia registro = registroRepository.findByUsuarioIdAndData(usuarioId, request.data())
                .orElse(null);

        if (registro != null) {
            registro.getGanhos().clear();
            registro.setKmRodado(request.kmRodado());
            registro.setGanhoBrutoTotal(ganhoBrutoTotal);
            registro.setGastoCombustivelCalculado(gastoCombustivel);
            registro.setLucroLiquido(ganhoBrutoTotal.subtract(gastoCombustivel));
        } else {
            registro = new RegistroDia();
            registro.setUsuario(veiculo.getUsuario());
            registro.setVeiculo(veiculo);
            registro.setData(request.data());
            registro.setKmRodado(request.kmRodado());
            registro.setGanhoBrutoTotal(ganhoBrutoTotal);
            registro.setGastoCombustivelCalculado(gastoCombustivel);
            registro.setLucroLiquido(ganhoBrutoTotal.subtract(gastoCombustivel));
            registro.setGanhos(new ArrayList<>());
        }

        for (RegistroDiaRequest.GanhoPlataformaRequest ganhoReq : request.ganhos()) {
            GanhoPorPlataforma ganho = new GanhoPorPlataforma();
            ganho.setRegistroDia(registro);
            ganho.setPlataforma(ganhoReq.plataforma());
            ganho.setValor(ganhoReq.valor());
            registro.getGanhos().add(ganho);
        }

        registro = registroRepository.save(registro);
        return toResponse(registro);
    }

    @Transactional
    public void excluir(Long usuarioId, Long registroId) {
        RegistroDia registro = registroRepository.findByIdAndUsuarioId(registroId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        registroRepository.delete(registro);
    }

    private BigDecimal calcularGastoCombustivel(BigDecimal kmRodado, BigDecimal autonomia, BigDecimal precoCombustivel) {
        return kmRodado.divide(autonomia, 10, RoundingMode.HALF_UP)
                .multiply(precoCombustivel)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private RegistroDiaResponse toResponse(RegistroDia registro) {
        List<RegistroDiaResponse.GanhoPlataformaResponse> ganhosResponse = registro.getGanhos().stream()
                .map(g -> new RegistroDiaResponse.GanhoPlataformaResponse(g.getId(), g.getPlataforma(), g.getValor()))
                .toList();

        return new RegistroDiaResponse(
                registro.getId(),
                registro.getVeiculo().getId(),
                registro.getVeiculo().getApelido(),
                registro.getData(),
                registro.getKmRodado(),
                registro.getGanhoBrutoTotal(),
                registro.getGastoCombustivelCalculado(),
                registro.getLucroLiquido(),
                ganhosResponse
        );
    }
}
