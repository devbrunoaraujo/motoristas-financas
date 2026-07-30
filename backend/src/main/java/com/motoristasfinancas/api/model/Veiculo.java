package com.motoristasfinancas.api.model;

import java.math.BigDecimal;

import com.motoristasfinancas.api.model.enums.TipoCombustivel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "veiculos")
@Getter
@Setter
@NoArgsConstructor
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 80)
    private String apelido;

    @Column(length = 10)
    private String placa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private TipoCombustivel tipoCombustivel;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal autonomia;

    @Column(nullable = false)
    private boolean ativo = true;
}
