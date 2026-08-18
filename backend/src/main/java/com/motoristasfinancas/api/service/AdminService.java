package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.AdminCriarUsuarioRequest;
import com.motoristasfinancas.api.dto.AdminDashboardResponse;
import com.motoristasfinancas.api.dto.AdminEditarUsuarioRequest;
import com.motoristasfinancas.api.dto.AdminUsuarioResponse;
import com.motoristasfinancas.api.dto.AssinaturaResponse;
import com.motoristasfinancas.api.dto.ConfirmarPagamentoRequest;
import com.motoristasfinancas.api.dto.TrialInfoResponse;
import com.motoristasfinancas.api.model.Assinatura;
import com.motoristasfinancas.api.model.Plano;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.Role;
import com.motoristasfinancas.api.model.enums.StatusAssinatura;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.repository.AssinaturaRepository;
import com.motoristasfinancas.api.repository.ConfiguracaoRepository;
import com.motoristasfinancas.api.repository.PlanoRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final PlanoRepository planoRepository;
    private final AssinaturaRepository assinaturaRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public List<AdminUsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toAdminUsuarioResponse)
                .toList();
    }

    @Transactional
    public AdminUsuarioResponse criarUsuario(AdminCriarUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.setRole(request.role());
        usuario.setStatus(StatusUsuario.TRIAL_ATIVO);
        usuario.setDataInicioTrial(LocalDate.now());
        usuario.setDataFimTrial(LocalDate.now().plusDays(7));

        usuario = usuarioRepository.save(usuario);
        return toAdminUsuarioResponse(usuario);
    }

    @Transactional
    public AdminUsuarioResponse editarUsuario(Long usuarioId, AdminEditarUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setRole(request.role());

        usuario = usuarioRepository.save(usuario);
        return toAdminUsuarioResponse(usuario);
    }

    @Transactional
    public AdminUsuarioResponse inativarUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setStatus(StatusUsuario.BLOQUEADO);
        usuario = usuarioRepository.save(usuario);
        return toAdminUsuarioResponse(usuario);
    }

    @Transactional
    public AdminUsuarioResponse reativarUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setStatus(StatusUsuario.ATIVO);
        usuario = usuarioRepository.save(usuario);
        return toAdminUsuarioResponse(usuario);
    }

    @Transactional
    public AssinaturaResponse alterarPlano(Long usuarioId, Long planoId, Long adminId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Plano plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin não encontrado"));

        // Cancelar assinaturas ATIVAS existentes
        assinaturaRepository.findByUsuarioIdAndStatus(usuarioId, StatusAssinatura.ATIVA)
                .forEach(a -> {
                    a.setStatus(StatusAssinatura.CANCELADA);
                    assinaturaRepository.save(a);
                });

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

    @Transactional
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

    @Transactional(readOnly = true)
    public TrialInfoResponse getTrialInfo(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String whatsapp = configuracaoRepository.findByChave("whatsapp_admin")
                .map(c -> c.getValor())
                .orElse("");

        if (usuario.getDataFimTrial() == null) {
            return new TrialInfoResponse(0, null, true, whatsapp);
        }

        LocalDate hoje = LocalDate.now();
        long diasRestantes = ChronoUnit.DAYS.between(hoje, usuario.getDataFimTrial());
        boolean expirado = diasRestantes < 0;

        if (expirado) diasRestantes = 0;

        return new TrialInfoResponse(
                (int) diasRestantes,
                usuario.getDataFimTrial(),
                expirado,
                whatsapp
        );
    }

    private AdminUsuarioResponse toAdminUsuarioResponse(Usuario usuario) {
        AssinaturaResponse assinaturaAtiva = assinaturaRepository
                .findFirstByUsuarioIdAndStatusOrderByDataExpiracaoDesc(usuario.getId(), StatusAssinatura.ATIVA)
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
