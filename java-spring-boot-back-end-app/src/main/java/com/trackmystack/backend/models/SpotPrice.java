package com.trackmystack.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "spot_prices")
@Data @NoArgsConstructor
public class SpotPrice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Metal metal;

    @Column(name = "price_per_otz_usd", nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerOtzUsd;

    @Column(name = "retrieved_at", nullable = false)
    private Instant retrievedAt = Instant.now();
}
