package com.motoristasfinancas.api.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-minutes}")
    private long expirationMinutes;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String gerarToken(String email, String role, Long usuarioId) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expirationMinutes * 60 * 1000);

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("usuarioId", usuarioId)
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims validarToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extrairEmail(String token) {
        return validarToken(token).getSubject();
    }

    public boolean tokenValido(String token) {
        try {
            validarToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
