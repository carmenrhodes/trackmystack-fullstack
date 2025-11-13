package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.Metal;
import com.trackmystack.backend.models.StackActivity;
import com.trackmystack.backend.models.User;
import com.trackmystack.backend.repositories.StackActivityRepository;
import com.trackmystack.backend.repositories.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/stack-activity")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class StackActivityController {

    private final StackActivityRepository repo;
    private final UserRepository userRepo;

    // GET /api/stack-activity?userId=1 -> list activity for a user (newest first)
    @GetMapping
    public List<StackActivity> list(@RequestParam Long userId) {
        return repo.findAllByUserIdOrderByExecutedAtDesc(userId);
    }

    // GET /api/stack-activity/{id} -> fetch one by id
    @GetMapping("/{id}")
    public ResponseEntity<StackActivity> one(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/stack-activity -> create BUY/SELL record
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

        StackActivity saved = repo.save(a);
        return ResponseEntity.created(URI.create("/api/stack-activity/" + saved.getId())).body(saved);
    }

    // DELETE /api/stack-activity/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateActivity {
        private Long userId;
        private StackActivity.Type type;
        private Metal metal;
        private BigDecimal quantityOtz;
        private BigDecimal unitPriceUsd;
        private BigDecimal feesUsd;
    }
}