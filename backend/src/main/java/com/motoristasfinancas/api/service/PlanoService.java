package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.motoristasfinancas.api.dto.PlanoRequest;
import com.motoristasfinancas.api.dto.PlanoResponse;
import com.motoristasfinancas.api.model.Plano;
import com.motoristasfinancas.api.repository.PlanoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanoService {

    private final PlanoRepository planoRepository;

    public List<PlanoResponse> listar() {
        return planoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PlanoResponse> listarAtivos() {
        return planoRepository.findByAtivoTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PlanoResponse criar(PlanoRequest request) {
        Plano plano = new Plano();
        plano.setNome(request.nome());
        plano.setValorMensal(request.valorMensal());
        plano.setLimiteVeiculos(request.limiteVeiculos());
        plano.setDescricaoFuncionalidades(request.descricaoFuncionalidades());
        plano.setAtivo(true);

        plano = planoRepository.save(plano);
        return toResponse(plano);
    }

    public PlanoResponse atualizar(Long id, PlanoRequest request) {
        Plano plano = planoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        plano.setNome(request.nome());
        plano.setValorMensal(request.valorMensal());
        plano.setLimiteVeiculos(request.limiteVeiculos());
        plano.setDescricaoFuncionalidades(request.descricaoFuncionalidades());

        plano = planoRepository.save(plano);
        return toResponse(plano);
    }

    public void inativar(Long id) {
        Plano plano = planoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        plano.setAtivo(false);
        planoRepository.save(plano);
    }

    private PlanoResponse toResponse(Plano plano) {
        return new PlanoResponse(
                plano.getId(),
                plano.getNome(),
                plano.getValorMensal(),
                plano.getLimiteVeiculos(),
                plano.getDescricaoFuncionalidades(),
                plano.isAtivo()
        );
    }
}
