package com.motoristasfinancas.api.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AcessoInterceptor extends OncePerRequestFilter {

    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {
            User userDetails = (User) auth.getPrincipal();

            Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                    .orElse(null);

            if (usuario != null) {
                StatusUsuario status = usuario.getStatus();

                if (status == StatusUsuario.TRIAL_ATIVO && usuario.getDataFimTrial() != null) {
                    if (java.time.LocalDate.now().isAfter(usuario.getDataFimTrial())) {
                        usuario.setStatus(StatusUsuario.TRIAL_EXPIRADO);
                        usuarioRepository.save(usuario);
                        status = StatusUsuario.TRIAL_EXPIRADO;
                    }
                }

                if (status == StatusUsuario.TRIAL_EXPIRADO || status == StatusUsuario.BLOQUEADO) {
                    String path = request.getRequestURI();

                    if (!path.startsWith("/auth/") && !path.equals("/health")) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("""
                            {
                                "status": 403,
                                "mensagem": "Acesso bloqueado. Assine um plano para continuar.",
                                "statusUsuario": "%s"
                            }
                            """.formatted(status.name()));
                        return;
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
