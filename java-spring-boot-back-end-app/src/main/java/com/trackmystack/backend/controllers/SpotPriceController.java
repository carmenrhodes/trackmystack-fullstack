package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.Metal;
import com.trackmystack.backend.models.SpotPrice;
import com.trackmystack.backend.repositories.SpotPriceRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/spot-prices")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class SpotPriceController {

    private final SpotPriceRepository repo;

    @GetMapping
    public List<SpotPrice> all() {
        return repo.findAll();
    }

    @GetMapping("/latest")
    public ResponseEntity<SpotPrice> latest(@RequestParam Metal metal) {
        return repo.findTopByMetalOrderByRetrievedAtDesc(metal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SpotPrice create(@RequestBody CreateSpotPrice req) {
        SpotPrice s = new SpotPrice();
        s.setMetal(req.getMetal());
        s.setPricePerOtzUsd(req.getPricePerOtzUsd());
        return repo.save(s);
    }

    @Data
    public static class CreateSpotPrice {
        private Metal metal;
        private BigDecimal pricePerOtzUsd;
    }
}