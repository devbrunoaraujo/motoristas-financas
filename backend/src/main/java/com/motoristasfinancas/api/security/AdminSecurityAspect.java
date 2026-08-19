package com.motoristasfinancas.api.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import com.motoristasfinancas.api.model.enums.Role;
import com.motoristasfinancas.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Aspecto que intercepta métodos anotados com @RequireAdmin
 * e verifica se o usuário tem papel de ADMIN.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class AdminSecurityAspect {

    private final UsuarioRepository usuarioRepository;

    @Around("@annotation(RequireAdmin)")
    public Object verificarAdmin(ProceedingJoinPoint joinPoint) throws Throwable {
        // Encontrar o parâmetro @AuthenticationPrincipal User
        Object[] args = joinPoint.getArgs();
        User user = null;

        for (Object arg : args) {
            if (arg instanceof User) {
                user = (User) arg;
                break;
            }
        }

        if (user == null) {
            throw new RuntimeException("Autenticação necessária para endpoints admin");
        }

        var usuario = usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getRole() != Role.ADMIN) {
            throw new RuntimeException("Acesso permitido apenas para administradores");
        }

        return joinPoint.proceed();
    }
}
