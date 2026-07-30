package com.motoristasfinancas.api.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "registros_dia", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "data"}))
@Getter
@Setter
@NoArgsConstructor
public class RegistroDia {

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

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal kmRodado;

    @Column(precision = 10, scale = 2)
    private BigDecimal ganhoBrutoTotal = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal gastoCombustivelCalculado = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal lucroLiquido = BigDecimal.ZERO;

    @OneToMany(mappedBy = "registroDia", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<GanhoPorPlataforma> ganhos = new ArrayList<>();
}
