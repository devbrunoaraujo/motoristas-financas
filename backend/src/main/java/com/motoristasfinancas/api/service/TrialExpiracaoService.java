package com.motoristasfinancas.api.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrialExpiracaoService {

    private final UsuarioRepository usuarioRepository;

    @Scheduled(fixedRate = 60000) // a cada 1 minuto
    @Transactional
    public void expirarTrials() {
        List<Usuario> usuariosTrial = usuarioRepository.findByStatus(StatusUsuario.TRIAL_ATIVO);
        LocalDate hoje = LocalDate.now();

        for (Usuario usuario : usuariosTrial) {
            if (usuario.getDataFimTrial() != null && hoje.isAfter(usuario.getDataFimTrial())) {
                usuario.setStatus(StatusUsuario.TRIAL_EXPIRADO);
                usuarioRepository.save(usuario);
                log.info("Trial expirado para usuário: {}", usuario.getEmail());
            }
        }
    }
}
