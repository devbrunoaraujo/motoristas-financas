package com.motoristasfinancas.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.motoristasfinancas.api.dto.DespesaRequest;
import com.motoristasfinancas.api.dto.DespesaResponse;
import com.motoristasfinancas.api.model.Despesa;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.repository.DespesaRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DespesaService {

    private final DespesaRepository despesaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<DespesaResponse> listar(Long usuarioId) {
        return despesaRepository.findByUsuarioIdOrderByDataDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DespesaResponse criar(Long usuarioId, DespesaRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Despesa despesa = new Despesa();
        despesa.setUsuario(usuario);
        despesa.setCategoria(request.categoria());
        despesa.setDescricao(request.descricao());
        despesa.setValor(request.valor());
        despesa.setData(request.data());

        despesa = despesaRepository.save(despesa);
        return toResponse(despesa);
    }

    public DespesaResponse atualizar(Long usuarioId, Long despesaId, DespesaRequest request) {
        Despesa despesa = despesaRepository.findByIdAndUsuarioId(despesaId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));

        despesa.setCategoria(request.categoria());
        despesa.setDescricao(request.descricao());
        despesa.setValor(request.valor());
        despesa.setData(request.data());

        despesa = despesaRepository.save(despesa);
        return toResponse(despesa);
    }

    public void excluir(Long usuarioId, Long despesaId) {
        Despesa despesa = despesaRepository.findByIdAndUsuarioId(despesaId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));

        despesaRepository.delete(despesa);
    }

    private DespesaResponse toResponse(Despesa despesa) {
        return new DespesaResponse(
                despesa.getId(),
                despesa.getCategoria(),
                despesa.getDescricao(),
                despesa.getValor(),
                despesa.getData()
        );
    }
}
