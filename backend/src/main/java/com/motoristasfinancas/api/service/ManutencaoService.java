package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.ManutencaoRequest;
import com.motoristasfinancas.api.dto.ManutencaoResponse;
import com.motoristasfinancas.api.model.Manutencao;
import com.motoristasfinancas.api.model.Veiculo;
import com.motoristasfinancas.api.repository.ManutencaoRepository;
import com.motoristasfinancas.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManutencaoService {

    private final ManutencaoRepository manutencaoRepository;
    private final VeiculoRepository veiculoRepository;

    @Transactional(readOnly = true)
    public List<ManutencaoResponse> listarPorVeiculo(Long usuarioId, Long veiculoId) {
        veiculoRepository.findByIdAndUsuarioId(veiculoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        return manutencaoRepository.findByVeiculoIdOrderByDataDesc(veiculoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ManutencaoResponse> listarTodos(Long usuarioId) {
        return manutencaoRepository.findByVeiculoUsuarioIdOrderByDataDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ManutencaoResponse criar(Long usuarioId, Long veiculoId, ManutencaoRequest request) {
        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(veiculoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        Manutencao manutencao = new Manutencao();
        manutencao.setVeiculo(veiculo);
        manutencao.setTipo(request.tipo());
        manutencao.setDescricao(request.descricao());
        manutencao.setKmReferencia(request.kmReferencia());
        manutencao.setData(request.data());
        manutencao.setValor(request.valor());
        manutencao.setProximoKm(request.proximoKm());
        manutencao.setProximaData(request.proximaData());

        manutencao = manutencaoRepository.save(manutencao);
        return toResponse(manutencao);
    }

    @Transactional
    public void excluir(Long usuarioId, Long manutencaoId) {
        Manutencao manutencao = manutencaoRepository.findById(manutencaoId)
                .orElseThrow(() -> new RuntimeException("Manutenção não encontrada"));

        if (!manutencao.getVeiculo().getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Manutenção não pertence ao usuário");
        }

        manutencaoRepository.delete(manutencao);
    }

    private ManutencaoResponse toResponse(Manutencao m) {
        return new ManutencaoResponse(
                m.getId(),
                m.getVeiculo().getId(),
                m.getVeiculo().getApelido(),
                m.getTipo(),
                m.getDescricao(),
                m.getKmReferencia(),
                m.getData(),
                m.getValor(),
                m.getProximoKm(),
                m.getProximaData()
        );
    }
}
