package com.motoristasfinancas.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.model.Assinatura;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.StatusAssinatura;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.repository.AssinaturaRepository;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanoAcessoService {

    private final AssinaturaRepository assinaturaRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Retorna o nome do plano atual do usuário.
     * - TRIAL_ATIVO / TRIAL_EXPIRADO → "BASICO" (trial equivale ao básico)
     - ATIVO com assinatura → nome do plano da assinatura
     * - Sem assinatura → "BASICO"
     */
    @Transactional(readOnly = true)
    public String getPlanoAtual(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getStatus() == StatusUsuario.TRIAL_ATIVO
                || usuario.getStatus() == StatusUsuario.TRIAL_EXPIRADO
                || usuario.getStatus() == StatusUsuario.BLOQUEADO) {
            return "BASICO";
        }

        return assinaturaRepository.findFirstByUsuarioIdOrderByDataExpiracaoDesc(usuarioId)
                .filter(a -> a.getStatus() == StatusAssinatura.ATIVA)
                .map(a -> a.getPlano().getNome().toUpperCase())
                .orElse("BASICO");
    }

    /**
     * Verifica se o usuário tem acesso a funcionalidades Pro.
     * Pro e Premium têm acesso. Básico e Trial não.
     */
    @Transactional(readOnly = true)
    public boolean isPro(Long usuarioId) {
        String plano = getPlanoAtual(usuarioId);
        return plano.contains("PRO") || plano.contains("PREMIUM");
    }

    /**
     * Verifica se o usuário tem acesso a funcionalidades Premium.
     */
    @Transactional(readOnly = true)
    public boolean isPremium(Long usuarioId) {
        String plano = getPlanoAtual(usuarioId);
        return plano.contains("PREMIUM");
    }

    /**
     * Lança exceção se o usuário não tiver acesso Pro.
     */
    public void exigirPro(Long usuarioId) {
        if (!isPro(usuarioId)) {
            throw new PlanoIncompativelException("Esta funcionalidade requer plano Pro ou Premium");
        }
    }

    public static class PlanoIncompativelException extends RuntimeException {
        public PlanoIncompativelException(String message) {
            super(message);
        }
    }
}
