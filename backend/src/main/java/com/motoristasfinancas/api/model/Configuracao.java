package com.motoristasfinancas.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "configuracoes", uniqueConstraints = @UniqueConstraint(columnNames = "chave"))
@Getter
@Setter
@NoArgsConstructor
public class Configuracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String chave;

    @Column(columnDefinition = "TEXT")
    private String valor;

    @Column(length = 200)
    private String descricao;
}
