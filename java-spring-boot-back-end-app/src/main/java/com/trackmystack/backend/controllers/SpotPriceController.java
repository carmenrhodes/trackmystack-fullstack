package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.Metal;
import com.trackmystack.backend.models.SpotPrice;
import com.trackmystack.backend.repositories.SpotPriceRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/spot-prices")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class SpotPriceController {

    private final SpotPriceRepository repo;

    // GET /api/spot-prices -> list all
    @GetMapping
    public List<SpotPrice> all() {
        return repo.findAll();
    }

    // GET /api/spot-prices/{id} -> get one
    @GetMapping("/{id}")
    public ResponseEntity<SpotPrice> one(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/spot-prices/latest?metal=GOLD -> latest record
    @GetMapping("/latest")
    public ResponseEntity<SpotPrice> latest(@RequestParam Metal metal) {
        return repo.findTopByMetalOrderByRetrievedAtDesc(metal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/spot-prices -> create new record
    @PostMapping
    public ResponseEntity<SpotPrice> create(@RequestBody CreateSpotPrice req) {
        SpotPrice s = new SpotPrice();
        s.setMetal(req.getMetal());
        s.setPricePerOtzUsd(req.getPricePerOtzUsd());

        SpotPrice saved = repo.save(s);
        return ResponseEntity.created(URI.create("/api/spot-prices/" + saved.getId())).body(saved);
    }

    // DELETE /api/spot-prices/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateSpotPrice {
        private Metal metal;
        private BigDecimal pricePerOtzUsd;
    }
}
