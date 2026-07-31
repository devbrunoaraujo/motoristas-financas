package com.motoristasfinancas.api.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ganhos_plataforma")
@Getter
@Setter
@NoArgsConstructor
public class GanhoPorPlataforma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registro_dia_id", nullable = false)
    private RegistroDia registroDia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plataforma_id", nullable = false)
    private Plataforma plataforma;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;
}
