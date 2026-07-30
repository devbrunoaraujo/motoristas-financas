package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.ConfiguracaoRequest;
import com.motoristasfinancas.api.dto.ConfiguracaoResponse;
import com.motoristasfinancas.api.model.Configuracao;
import com.motoristasfinancas.api.repository.ConfiguracaoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ConfiguracaoRepository configuracaoRepository;

    @Transactional(readOnly = true)
    public List<ConfiguracaoResponse> listar() {
        return configuracaoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public String buscarValor(String chave) {
        return configuracaoRepository.findByChave(chave)
                .map(Configuracao::getValor)
                .orElse(null);
    }

    @Transactional
    public ConfiguracaoResponse salvar(String chave, ConfiguracaoRequest request) {
        Configuracao config = configuracaoRepository.findByChave(chave)
                .orElse(null);

        if (config != null) {
            config.setValor(request.valor());
        } else {
            config = new Configuracao();
            config.setChave(chave);
            config.setValor(request.valor());
            config.setDescricao(chave.replace("_", " "));
        }

        config = configuracaoRepository.save(config);
        return toResponse(config);
    }

    private ConfiguracaoResponse toResponse(Configuracao config) {
        return new ConfiguracaoResponse(
                config.getId(),
                config.getChave(),
                config.getValor(),
                config.getDescricao()
        );
    }
}
