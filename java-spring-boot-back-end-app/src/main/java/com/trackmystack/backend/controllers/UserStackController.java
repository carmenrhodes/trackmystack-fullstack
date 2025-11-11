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
import java.time.LocalDate;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/user-stack")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserStackController {

    private final UserStackRepository userStackRepo;
    private final UserRepository userRepo;

    // GET /api/user-stack?userId=1
    @GetMapping
    public List<UserStack> listByUser(@RequestParam Long userId) {
        return userStackRepo.findAllByUserId(userId);
    }

    // (Optional) GET /api/user-stack/user/1
    @GetMapping("/user/{userId}")
    public List<UserStack> listByUserPath(@PathVariable Long userId) {
        return userStackRepo.findAllByUserId(userId);
    }

    // POST /api/user-stack
    @PostMapping
    public ResponseEntity<UserStack> create(@RequestBody CreateUserStackRequest req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + req.getUserId()));

        UserStack us = new UserStack();
        us.setUser(user);
        us.setMetal(req.getMetal());
        us.setWeightOtz(req.getWeightOtz());
        us.setQuantity(req.getQuantity());
        us.setTotalPaidUsd(req.getTotalPaidUsd());
        us.setPurchasedOn(req.getPurchasedOn());
        us.setNotes(req.getNotes());

        UserStack saved = userStackRepo.save(us);
        return ResponseEntity.created(URI.create("/api/user-stack/" + saved.getId())).body(saved);
    }

    // PUT /api/user-stack/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserStack> update(@PathVariable Long id, @RequestBody UpdateUserStackRequest req) {
        UserStack us = userStackRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stack item not found: " + id));

        if (req.getMetal() != null) us.setMetal(req.getMetal());
        if (req.getWeightOtz() != null) us.setWeightOtz(req.getWeightOtz());
        if (req.getQuantity() != null) us.setQuantity(req.getQuantity());
        if (req.getTotalPaidUsd() != null) us.setTotalPaidUsd(req.getTotalPaidUsd());;
        if (req.getPurchasedOn() != null) us.setPurchasedOn(req.getPurchasedOn());
        if (req.getNotes() != null) us.setNotes(req.getNotes());

        return ResponseEntity.ok(userStackRepo.save(us));
    }

    // DELETE /api/user-stack/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userStackRepo.existsById(id)) return ResponseEntity.notFound().build();
        userStackRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/user-stack/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserStack> one(@PathVariable Long id) {
        return userStackRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class CreateUserStackRequest {
        private Long userId;
        private Metal metal;
        private BigDecimal weightOtz;
        private Integer quantity;
        private BigDecimal totalPaidUsd;
        private LocalDate purchasedOn;
        private String notes;
    }

    @Data
    public static class UpdateUserStackRequest {
        private Metal metal;
        private BigDecimal weightOtz;
        private Integer quantity;
        private BigDecimal totalPaidUsd;
        private LocalDate purchasedOn;
        private String notes;
    }
}
