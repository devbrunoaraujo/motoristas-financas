package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.motoristasfinancas.api.dto.VeiculoRequest;
import com.motoristasfinancas.api.dto.VeiculoResponse;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.Veiculo;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PlanoAcessoService planoAcessoService;

    public List<VeiculoResponse> listar(Long usuarioId) {
        return veiculoRepository.findByUsuarioIdAndAtivoTrue(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public VeiculoResponse criar(Long usuarioId, VeiculoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        long veiculosAtivos = veiculoRepository.countByUsuarioIdAndAtivoTrue(usuarioId);
        int limite = getLimiteVeiculos(usuarioId);
        if (veiculosAtivos >= limite) {
            throw new RuntimeException("Limite de veículos atingido (" + limite + "). Faça upgrade do seu plano.");
        }

        Veiculo veiculo = new Veiculo();
        veiculo.setUsuario(usuario);
        veiculo.setApelido(request.apelido());
        veiculo.setPlaca(request.placa());
        veiculo.setTipoCombustivel(request.tipoCombustivel());
        veiculo.setAutonomia(request.autonomia());
        veiculo.setValorCompra(request.valorCompra());
        veiculo.setValorRevendaEstimado(request.valorRevendaEstimado());
        veiculo.setDataAquisicao(request.dataAquisicao());
        veiculo.setKmAtual(request.kmAtual());
        veiculo.setAtivo(true);

        veiculo = veiculoRepository.save(veiculo);
        return toResponse(veiculo);
    }

    public VeiculoResponse atualizar(Long usuarioId, Long veiculoId, VeiculoRequest request) {
        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(veiculoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        veiculo.setApelido(request.apelido());
        veiculo.setPlaca(request.placa());
        veiculo.setTipoCombustivel(request.tipoCombustivel());
        veiculo.setAutonomia(request.autonomia());
        veiculo.setValorCompra(request.valorCompra());
        veiculo.setValorRevendaEstimado(request.valorRevendaEstimado());
        veiculo.setDataAquisicao(request.dataAquisicao());
        veiculo.setKmAtual(request.kmAtual());

        veiculo = veiculoRepository.save(veiculo);
        return toResponse(veiculo);
    }

    public void inativar(Long usuarioId, Long veiculoId) {
        Veiculo veiculo = veiculoRepository.findByIdAndUsuarioId(veiculoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        veiculo.setAtivo(false);
        veiculoRepository.save(veiculo);
    }

    private int getLimiteVeiculos(Long usuarioId) {
        String plano = planoAcessoService.getPlanoAtual(usuarioId);
        if (plano.contains("PREMIUM")) return Integer.MAX_VALUE;
        if (plano.contains("PRO")) return 3;
        return 1; // Básico e Trial
    }

    private VeiculoResponse toResponse(Veiculo veiculo) {
        return new VeiculoResponse(
                veiculo.getId(),
                veiculo.getApelido(),
                veiculo.getPlaca(),
                veiculo.getTipoCombustivel(),
                veiculo.getAutonomia(),
                veiculo.isAtivo(),
                veiculo.getValorCompra(),
                veiculo.getValorRevendaEstimado(),
                veiculo.getDataAquisicao(),
                veiculo.getKmAtual()
        );
    }
}
