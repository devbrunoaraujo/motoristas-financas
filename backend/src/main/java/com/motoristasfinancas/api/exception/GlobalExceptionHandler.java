package com.motoristasfinancas.api.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.motoristasfinancas.api.service.PlanoAcessoService;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PlanoAcessoService.PlanoIncompativelException.class)
    public ResponseEntity<Map<String, Object>> handlePlanoIncompativel(PlanoAcessoService.PlanoIncompativelException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", 403);
        body.put("mensagem", ex.getMessage());
        body.put("tipoPlanoRequerido", "PRO");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("mensagem", ex.getMessage());

        if (ex.getMessage().contains("já cadastrado")) {
            body.put("status", 409);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        if (ex.getMessage().contains("inválidos")) {
            body.put("status", 401);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }

        body.put("status", 400);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", 401);
        body.put("mensagem", "Email ou senha inválidos");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", 400);

        Map<String, String> erros = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            erros.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        body.put("erros", erros);
        body.put("mensagem", "Dados inválidos");

        return ResponseEntity.badRequest().body(body);
    }
}
