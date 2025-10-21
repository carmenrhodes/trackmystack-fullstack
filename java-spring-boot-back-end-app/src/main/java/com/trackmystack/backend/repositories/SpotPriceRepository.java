package com.trackmystack.backend.repositories;

import com.trackmystack.backend.models.Metal;
import com.trackmystack.backend.models.SpotPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpotPriceRepository extends JpaRepository<SpotPrice, Long> {
    Optional<SpotPrice> findTopByMetalOrderByRetrievedAtDesc(Metal metal);
}