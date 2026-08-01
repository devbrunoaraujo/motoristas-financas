package com.motoristasfinancas.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.dto.NotificacaoResponse;
import com.motoristasfinancas.api.model.Notificacao;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.model.enums.TipoNotificacao;
import com.motoristasfinancas.api.repository.MetaRepository;
import com.motoristasfinancas.api.repository.NotificacaoRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroDiaRepository registroRepository;
    private final MetaRepository metaRepository;

    @Transactional(readOnly = true)
    public List<NotificacaoResponse> listarNaoLidas(Long usuarioId) {
        return notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long contarNaoLidas(Long usuarioId) {
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    @Transactional
    public void marcarComoLida(Long usuarioId, Long notificacaoId) {
        Notificacao notificacao = notificacaoRepository.findById(notificacaoId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));

        if (!notificacao.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Notificação não pertence ao usuário");
        }

        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
    }

    @Transactional
    public void marcarTodasComoLidas(Long usuarioId) {
        List<Notificacao> naoLidas = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(usuarioId);
        for (Notificacao n : naoLidas) {
            n.setLida(true);
        }
        notificacaoRepository.saveAll(naoLidas);
    }

    // Job que roda a cada 30 minutos para gerar notificações
    @Scheduled(fixedRate = 1800000)
    @Transactional
    public void gerarNotificacoes() {
        List<Usuario> usuarios = usuarioRepository.findByStatus(StatusUsuario.ATIVO);

        for (Usuario usuario : usuarios) {
            verificarLucroBaixo(usuario);
            verificarMetaAtingida(usuario);
            verificarTrialExpirando(usuario);
        }
    }

    private void verificarLucroBaixo(Usuario usuario) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio30dias = hoje.minusDays(30);

        List<RegistroDia> registros = registroRepository.findByUsuarioIdAndDataBetween(
                usuario.getId(), inicio30dias, hoje);

        if (registros.size() < 5) return; // precisa de pelo menos 5 dias de dados

        BigDecimal mediaLucro = registros.stream()
                .map(RegistroDia::getLucroLiquido)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(registros.size()), 2, RoundingMode.HALF_UP);

        List<RegistroDia> registrosHoje = registroRepository.findByUsuarioIdAndDataBetween(
                usuario.getId(), hoje, hoje);

        if (!registrosHoje.isEmpty()) {
            BigDecimal lucroHoje = registrosHoje.get(0).getLucroLiquido();
            BigDecimal limite = mediaLucro.multiply(BigDecimal.valueOf(0.8)); // 80% da média

            if (lucroHoje.compareTo(limite) < 0 && mediaLucro.compareTo(BigDecimal.ZERO) > 0) {
                // Verificar se já não notificou hoje
                boolean jaNotificou = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(usuario.getId())
                        .stream()
                        .anyMatch(n -> n.getTipo() == TipoNotificacao.LUCRO_BAIXO && n.getCriadaEm().toLocalDate().equals(hoje));

                if (!jaNotificou) {
                    criarNotificacao(usuario, TipoNotificacao.LUCRO_BAIXO,
                            "Lucro abaixo da média",
                            "Seu lucro de hoje está 20% abaixo da média dos últimos 30 dias. Média: " + mediaLucro + ", Hoje: " + lucroHoje);
                }
            }
        }
    }

    private void verificarMetaAtingida(Usuario usuario) {
        metaRepository.findFirstByUsuarioIdOrderByVigenteDesdeDesc(usuario.getId())
                .ifPresent(meta -> {
                    LocalDate hoje = LocalDate.now();
                    LocalDate inicioMes = hoje.withDayOfMonth(1);

                    List<RegistroDia> registros = registroRepository.findByUsuarioIdAndDataBetween(
                            usuario.getId(), inicioMes, hoje);

                    BigDecimal lucroMes = registros.stream()
                            .map(RegistroDia::getLucroLiquido)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    if (lucroMes.compareTo(meta.getMetaMensal()) >= 0) {
                        boolean jaNotificou = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(usuario.getId())
                                .stream()
                                .anyMatch(n -> n.getTipo() == TipoNotificacao.META_ATINGIDA && n.getCriadaEm().toLocalDate().getMonth() == hoje.getMonth());

                        if (!jaNotificou) {
                            criarNotificacao(usuario, TipoNotificacao.META_ATINGIDA,
                                    "Meta mensal atingida!",
                                    "Parabéns! Você atingiu sua meta de " + meta.getMetaMensal() + " este mês. Lucro atual: " + lucroMes);
                        }
                    }
                });
    }

    private void verificarTrialExpirando(Usuario usuario) {
        if (usuario.getStatus() == StatusUsuario.TRIAL_ATIVO && usuario.getDataFimTrial() != null) {
            long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), usuario.getDataFimTrial());

            if (diasRestantes <= 2 && diasRestantes > 0) {
                boolean jaNotificou = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(usuario.getId())
                        .stream()
                        .anyMatch(n -> n.getTipo() == TipoNotificacao.TRIAL_EXPIRANDO);

                if (!jaNotificou) {
                    criarNotificacao(usuario, TipoNotificacao.TRIAL_EXPIRANDO,
                            "Trial expirando em " + diasRestantes + " dias",
                            "Seu período gratuito está acabando. Assine um plano para continuar usando.");
                }
            }
        }
    }

    private void criarNotificacao(Usuario usuario, TipoNotificacao tipo, String titulo, String mensagem) {
        Notificacao notificacao = new Notificacao();
        notificacao.setUsuario(usuario);
        notificacao.setTipo(tipo);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setLida(false);
        notificacao.aoCriar();
        notificacaoRepository.save(notificacao);
        log.info("Notificação criada para {}: {}", usuario.getEmail(), titulo);
    }

    private NotificacaoResponse toResponse(Notificacao n) {
        return new NotificacaoResponse(
                n.getId(),
                n.getTipo(),
                n.getTitulo(),
                n.getMensagem(),
                n.isLida(),
                n.getCriadaEm()
        );
    }
}
