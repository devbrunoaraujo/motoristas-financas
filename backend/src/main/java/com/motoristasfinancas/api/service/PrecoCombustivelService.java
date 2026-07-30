package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.motoristasfinancas.api.dto.PrecoCombustivelRequest;
import com.motoristasfinancas.api.dto.PrecoCombustivelResponse;
import com.motoristasfinancas.api.model.PrecoCombustivel;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.repository.PrecoCombustivelRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrecoCombustivelService {

    private final PrecoCombustivelRepository precoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<PrecoCombustivelResponse> listar(Long usuarioId) {
        return precoRepository.findByUsuarioIdOrderByVigenteDesdeDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PrecoCombustivelResponse criar(Long usuarioId, PrecoCombustivelRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PrecoCombustivel preco = new PrecoCombustivel();
        preco.setUsuario(usuario);
        preco.setTipoCombustivel(request.tipoCombustivel());
        preco.setPreco(request.preco());
        preco.setVigenteDesde(request.vigenteDesde());

        preco = precoRepository.save(preco);
        return toResponse(preco);
    }

    public void excluir(Long usuarioId, Long precoId) {
        PrecoCombustivel preco = precoRepository.findByIdAndUsuarioId(precoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Preço não encontrado"));

        precoRepository.delete(preco);
    }

    private PrecoCombustivelResponse toResponse(PrecoCombustivel preco) {
        return new PrecoCombustivelResponse(
                preco.getId(),
                preco.getTipoCombustivel(),
                preco.getPreco(),
                preco.getVigenteDesde()
        );
    }
}
