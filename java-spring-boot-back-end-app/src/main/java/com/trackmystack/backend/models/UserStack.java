package com.trackmystack.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_stack")
@Getter @Setter @NoArgsConstructor
public class UserStack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Metal metal;

    @Column(name = "weight_otz", nullable = false, precision = 12, scale = 4)
    private BigDecimal weightOtz;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_paid_per_unit_usd", precision = 12, scale = 2)
    private BigDecimal pricePaidPerUnitUsd;

    @Column( name = "purchased_on" )
    private LocalDate purchasedOn;

    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}