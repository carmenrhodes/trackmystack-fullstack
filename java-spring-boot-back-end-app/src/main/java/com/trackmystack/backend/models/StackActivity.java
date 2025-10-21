package com.trackmystack.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "stack_activity")
@Data
@NoArgsConstructor
public class StackActivity {

    public enum Type { BUY, SELL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Metal metal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(name = "quantity_otz", nullable = false, precision = 10, scale = 4)
    private BigDecimal quantityOtz;

    @Column(name = "unit_price_usd", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPriceUsd;

    @Column(name = "fees_usd", nullable = false, precision = 12, scale = 2)
    private BigDecimal feesUsd = BigDecimal.ZERO;

    @Column(name = "executed_at", nullable = false)
    private Instant executedAt = Instant.now();
}