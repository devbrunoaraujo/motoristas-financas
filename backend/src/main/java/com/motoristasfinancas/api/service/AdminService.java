package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.motoristasfinancas.api.dto.AdminDashboardResponse;
import com.motoristasfinancas.api.dto.AdminUsuarioResponse;
import com.motoristasfinancas.api.dto.AssinaturaResponse;
import com.motoristasfinancas.api.dto.ConfirmarPagamentoRequest;
import com.motoristasfinancas.api.model.Assinatura;
import com.motoristasfinancas.api.model.Plano;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.StatusAssinatura;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.repository.AssinaturaRepository;
import com.motoristasfinancas.api.repository.PlanoRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final PlanoRepository planoRepository;
    private final AssinaturaRepository assinaturaRepository;

    public AdminDashboardResponse getDashboard() {
        List<Usuario> todosUsuarios = usuarioRepository.findAll();

        long trialAtivo = todosUsuarios.stream()
                .filter(u -> u.getStatus() == StatusUsuario.TRIAL_ATIVO)
                .count();

        long ativos = todosUsuarios.stream()
                .filter(u -> u.getStatus() == StatusUsuario.ATIVO)
                .count();

        long bloqueados = todosUsuarios.stream()
                .filter(u -> u.getStatus() == StatusUsuario.BLOQUEADO)
                .count();

        long trialExpirado = todosUsuarios.stream()
                .filter(u -> u.getStatus() == StatusUsuario.TRIAL_EXPIRADO)
                .count();

        BigDecimal receitaPotencial = BigDecimal.ZERO;

        return new AdminDashboardResponse(
                todosUsuarios.size(),
                trialAtivo,
                ativos,
                bloqueados,
                trialExpirado,
                receitaPotencial
        );
    }

    public List<AdminUsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toAdminUsuarioResponse)
                .toList();
    }

    public AssinaturaResponse confirmarPagamento(ConfirmarPagamentoRequest request, Long adminId) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Plano plano = planoRepository.findById(request.planoId())
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin não encontrado"));

        Assinatura assinatura = new Assinatura();
        assinatura.setUsuario(usuario);
        assinatura.setPlano(plano);
        assinatura.setStatus(StatusAssinatura.ATIVA);
        assinatura.setDataInicio(LocalDate.now());
        assinatura.setDataExpiracao(LocalDate.now().plusDays(30));
        assinatura.setConfirmadoPor(admin);
        assinatura.setConfirmadoEm(LocalDateTime.now());

        assinatura = assinaturaRepository.save(assinatura);

        usuario.setStatus(StatusUsuario.ATIVO);
        usuarioRepository.save(usuario);

        return toAssinaturaResponse(assinatura);
    }

    private AdminUsuarioResponse toAdminUsuarioResponse(Usuario usuario) {
        AssinaturaResponse assinaturaAtiva = assinaturaRepository
                .findFirstByUsuarioIdOrderByDataExpiracaoDesc(usuario.getId())
                .map(this::toAssinaturaResponse)
                .orElse(null);

        return new AdminUsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getStatus(),
                usuario.getDataInicioTrial(),
                usuario.getDataFimTrial(),
                usuario.getCriadoEm(),
                assinaturaAtiva
        );
    }

    private AssinaturaResponse toAssinaturaResponse(Assinatura assinatura) {
        return new AssinaturaResponse(
                assinatura.getId(),
                assinatura.getUsuario().getId(),
                assinatura.getUsuario().getNome(),
                assinatura.getPlano().getId(),
                assinatura.getPlano().getNome(),
                assinatura.getStatus(),
                assinatura.getDataInicio(),
                assinatura.getDataExpiracao(),
                assinatura.getConfirmadoPor() != null ? assinatura.getConfirmadoPor().getNome() : null,
                assinatura.getConfirmadoEm()
        );
    }
}
