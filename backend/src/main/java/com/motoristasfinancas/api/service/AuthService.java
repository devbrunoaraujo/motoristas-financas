package com.motoristasfinancas.api.service;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.motoristasfinancas.api.dto.AuthResponse;
import com.motoristasfinancas.api.dto.CadastroRequest;
import com.motoristasfinancas.api.dto.LoginRequest;
import com.motoristasfinancas.api.model.Usuario;
import com.motoristasfinancas.api.model.enums.Role;
import com.motoristasfinancas.api.model.enums.StatusUsuario;
import com.motoristasfinancas.api.repository.UsuarioRepository;
import com.motoristasfinancas.api.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse cadastrar(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.setRole(Role.MOTORISTA);
        usuario.setStatus(StatusUsuario.TRIAL_ATIVO);
        usuario.setDataInicioTrial(LocalDate.now());
        usuario.setDataFimTrial(LocalDate.now().plusDays(7));

        usuario = usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getId()
        );

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtService.gerarToken(
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getId()
        );

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole()
        );
    }
}
