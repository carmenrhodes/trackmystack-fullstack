package com.trackmystack.backend.controllers;


import com.trackmystack.backend.models.StackActivity;
import com.trackmystack.backend.models.User;
import com.trackmystack.backend.repositories.StackActivityRepository;
import com.trackmystack.backend.repositories.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stack-activity")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class StackActivityController {

    private final StackActivityRepository repo;
    private final UserRepository userRepo;

    @GetMapping
    public List<StackActivity> list(@RequestParam Long userId) {
        return repo.findAllByUserIdOrderByExecutedAtDesc(userId);
    }

    @PostMapping
    public ResponseEntity<StackActivity> create(@RequestBody CreateActivity req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + req.getUserId()));

        StackActivity a = new StackActivity();
        a.setUser(user);
        a.setMetal(req.getMetal());
        a.setType(req.getType());
        a.setQuantityOtz(req.getQuantityOtz());
        a.setUnitPriceUsd(req.getUnitPriceUsd());
        a.setFeesUsd(req.getFeesUsd() == null ? BigDecimal.ZERO : req.getFeesUsd());
        return ResponseEntity.ok(repo.save(a));
    }

    @Data
    public static class CreateActivity {
        private Long userId;
        private StackActivity.Type type;  // BUY or SELL
        private com.trackmystack.backend.models.Metal metal;
        private BigDecimal quantityOtz;
        private BigDecimal unitPriceUsd;
        private BigDecimal feesUsd;
    }
}