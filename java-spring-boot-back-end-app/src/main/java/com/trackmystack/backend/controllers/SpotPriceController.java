package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.Metal;
import com.trackmystack.backend.models.SpotPrice;
import com.trackmystack.backend.repositories.SpotPriceRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spot-prices")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {"http://localhost:3000", "http://localhost:5173"},
        allowCredentials = "true",                          // <— String, not boolean
        allowedHeaders = {"Authorization", "Content-Type"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class SpotPriceController {

    private final SpotPriceRepository repo;

    // GET /api/spot-prices -> list all
    @GetMapping
    public List<SpotPrice> all() {
        return repo.findAll();
    }

    // GET /api/spot-prices/{id}
    @GetMapping("/{id}")
    public ResponseEntity<SpotPrice> one(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/spot-prices/latest?metal=GOLD
    @GetMapping("/latest")
    public ResponseEntity<SpotPrice> latest(@RequestParam Metal metal) {
        return repo.findTopByMetalOrderByRetrievedAtDesc(metal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/spot-prices/live
    @GetMapping("/live")
    public ResponseEntity<Map<String, BigDecimal>> liveSpotPrices() {
        String apiKey = System.getenv().getOrDefault("METALPRICE_API_KEY", "REPLACE_ME");

        String url = "https://api.metalpriceapi.com/v1/latest?api_key="
                + apiKey + "&base=USD&currencies=XAU,XAG";

        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        @SuppressWarnings("unchecked")
        Map<String, Object> body = rt.getForObject(url, Map.class);

        if (body == null || !Boolean.TRUE.equals(body.get("success"))) {
            return ResponseEntity.status(502).build();
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> rates = (Map<String, Object>) body.get("rates");
        if (rates == null || !rates.containsKey("XAU") || !rates.containsKey("XAG")) {
            return ResponseEntity.status(502).build();
        }

        BigDecimal xau = new BigDecimal(rates.get("XAU").toString());
        BigDecimal xag = new BigDecimal(rates.get("XAG").toString());

        // invert to USD per oz with modern rounding API
        BigDecimal gold = BigDecimal.ONE.divide(xau, 2, RoundingMode.HALF_UP);
        BigDecimal silver = BigDecimal.ONE.divide(xag, 2, RoundingMode.HALF_UP);

        return ResponseEntity.ok(Map.of("gold", gold, "silver", silver));
    }

    // POST /api/spot-prices
    @PostMapping
    public ResponseEntity<SpotPrice> create(@RequestBody CreateSpotPrice req) {
        SpotPrice s = new SpotPrice();
        s.setMetal(req.getMetal());
        s.setPricePerOtzUsd(req.getPricePerOtzUsd());  // <— using pricePerOtzUsd (not pricePaidPerOtzUsd)
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
