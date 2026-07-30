package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.PlataformaRequest;
import com.motoristasfinancas.api.dto.PlataformaResponse;
import com.motoristasfinancas.api.model.Plataforma;
import com.motoristasfinancas.api.repository.PlataformaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlataformaService {

    private final PlataformaRepository plataformaRepository;

    @Transactional(readOnly = true)
    public List<PlataformaResponse> listarTodas() {
        return plataformaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PlataformaResponse> listarAtivas() {
        return plataformaRepository.findByAtivoTrueOrderById()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PlataformaResponse criar(PlataformaRequest request) {
        if (plataformaRepository.existsByNome(request.nome())) {
            throw new RuntimeException("Plataforma já cadastrada");
        }

        Plataforma plataforma = new Plataforma();
        plataforma.setNome(request.nome());
        plataforma.setDescricao(request.descricao());
        plataforma.setAtivo(true);

        plataforma = plataformaRepository.save(plataforma);
        return toResponse(plataforma);
    }

    @Transactional
    public PlataformaResponse editar(Long id, PlataformaRequest request) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plataforma não encontrada"));

        plataforma.setNome(request.nome());
        plataforma.setDescricao(request.descricao());

        plataforma = plataformaRepository.save(plataforma);
        return toResponse(plataforma);
    }

    @Transactional
    public void inativar(Long id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plataforma não encontrada"));

        plataforma.setAtivo(false);
        plataformaRepository.save(plataforma);
    }

    @Transactional
    public void reativar(Long id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plataforma não encontrada"));

        plataforma.setAtivo(true);
        plataformaRepository.save(plataforma);
    }

    private PlataformaResponse toResponse(Plataforma plataforma) {
        return new PlataformaResponse(
                plataforma.getId(),
                plataforma.getNome(),
                plataforma.getDescricao(),
                plataforma.isAtivo()
        );
    }
}
