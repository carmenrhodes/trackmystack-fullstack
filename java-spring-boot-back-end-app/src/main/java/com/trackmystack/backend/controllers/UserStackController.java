package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.Metal;
import com.trackmystack.backend.models.User;
import com.trackmystack.backend.models.UserStack;
import com.trackmystack.backend.repositories.UserRepository;
import com.trackmystack.backend.repositories.UserStackRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/user-stack")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserStackController {

    private final UserStackRepository userStackRepo;
    private final UserRepository userRepo;

    @GetMapping
    public List<UserStack> listByUser(@RequestParam Long userId) {
        return userStackRepo.findAllByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<UserStack> create(@RequestBody CreateUserStackRequest req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + req.getUserId()));

        UserStack us = new UserStack();
        us.setUser(user);
        us.setMetal(req.getMetal());
        us.setWeightOtz(req.getWeightOtz());
        us.setQuantity(req.getQuantity());
        us.setPricePaidPerUnitUsd(req.getPricePaidPerUnitUsd());
        us.setNotes(req.getNotes());

        return ResponseEntity.ok(userStackRepo.save(us));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserStack> update(@PathVariable Long id, @RequestBody UpdateUserStackRequest req) {
        UserStack us = userStackRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stack item not found: " + id));

        if (req.getMetal() != null) us.setMetal(req.getMetal());
        if (req.getWeightOtz() != null) us.setWeightOtz(req.getWeightOtz());
        if (req.getQuantity() != null) us.setQuantity(req.getQuantity());
        if (req.getPricePaidPerUnitUsd() != null) us.setPricePaidPerUnitUsd(req.getPricePaidPerUnitUsd());
        if (req.getNotes() != null) us.setNotes(req.getNotes());

        return ResponseEntity.ok(userStackRepo.save(us));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userStackRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateUserStackRequest {
        private Long userId;
        private Metal metal;
        private BigDecimal weightOtz;
        private Integer quantity;
        private BigDecimal pricePaidPerUnitUsd;
        private String notes;
    }

    @Data
    public static class UpdateUserStackRequest {
        private Metal metal;
        private BigDecimal weightOtz;
        private Integer quantity;
        private BigDecimal pricePaidPerUnitUsd;
        private String notes;
    }
}