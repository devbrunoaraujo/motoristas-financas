package com.motoristasfinancas.api.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "planos")
@Getter
@Setter
@NoArgsConstructor
public class Plano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nome;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal valorMensal;

    @Column(nullable = false)
    private int limiteVeiculos;

    @Column(length = 500)
    private String descricaoFuncionalidades;

    @Column(nullable = false)
    private boolean ativo = true;
}
