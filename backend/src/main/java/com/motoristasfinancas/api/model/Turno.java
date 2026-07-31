package com.motoristasfinancas.api.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
@Table(name = "turnos")
@Getter
@Setter
@NoArgsConstructor
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private LocalTime horaInicio;

    private LocalTime horaFim;

    @Column(precision = 10, scale = 2)
    private BigDecimal kmInicio;

    @Column(precision = 10, scale = 2)
    private BigDecimal kmFim;

    @Column(precision = 10, scale = 2)
    private BigDecimal ganhoBruto;

    @Column(precision = 10, scale = 2)
    private BigDecimal gastoCombustivel;

    @Column(precision = 10, scale = 2)
    private BigDecimal lucroLiquido;

    @Column(nullable = false)
    private boolean emAndamento = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    public void aoCriar() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }
}
