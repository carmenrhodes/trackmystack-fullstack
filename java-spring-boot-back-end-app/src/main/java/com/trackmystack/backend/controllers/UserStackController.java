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
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/user-stack")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000"}, allowCredentials = "true")
public class UserStackController {

    private final UserRepository userRepo;
    private final UserStackRepository stackRepo;

    private User currentUser() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthenticated");
        }
        String email = auth.getName();
        return userRepo.findByEmail(email).orElseThrow();
    }

    // GET /api/user-stack
    @GetMapping
    public List<UserStack> listMine() {
        User me = currentUser();
        return stackRepo.findAllByUser_Id(me.getId());
    }

    // POST /api/user-stack -> create for current user
    @PostMapping
    public ResponseEntity<UserStack> create(@RequestBody CreateOrUpdateStackItem req) {
        User me = currentUser();

        UserStack s = new UserStack();
        s.setUser(me);


        if (req.getMetal() != null) {
            s.setMetal(Metal.valueOf(req.getMetal().trim().toUpperCase()));
        }


        if (req.getWeightOtz() != null) {
            s.setWeightOtz(new BigDecimal(String.valueOf(req.getWeightOtz())));
        }
        s.setQuantity(req.getQuantity() == null ? 1 : req.getQuantity());

        if (req.getTotalPaidUsd() != null) {
            s.setTotalPaidUsd(new BigDecimal(String.valueOf(req.getTotalPaidUsd())));
        }


        if (req.getPurchasedOn() != null && !req.getPurchasedOn().isBlank()) {
            s.setPurchasedOn(LocalDate.parse(req.getPurchasedOn()));
        }

        s.setNotes(req.getNotes());

        UserStack saved = stackRepo.save(s);
        return ResponseEntity.created(java.net.URI.create("/api/user-stack/" + saved.getId())).body(saved);
    }

    // PUT /api/user-stack/{id} -> update if owner
    @PutMapping("/{id}")
    public ResponseEntity<UserStack> update(@PathVariable Long id, @RequestBody CreateOrUpdateStackItem req) {
        User me = currentUser();
        return stackRepo.findById(id)
                .filter(existing -> existing.getUser() != null && existing.getUser().getId().equals(me.getId()))
                .map(existing -> {
                    if (req.getMetal() != null) {
                        existing.setMetal(Metal.valueOf(req.getMetal().trim().toUpperCase()));
                    }
                    if (req.getWeightOtz() != null) {
                        existing.setWeightOtz(new BigDecimal(String.valueOf(req.getWeightOtz())));
                    }
                    if (req.getQuantity() != null) {
                        existing.setQuantity(req.getQuantity());
                    }
                    if (req.getTotalPaidUsd() != null) {
                        existing.setTotalPaidUsd(new BigDecimal(String.valueOf(req.getTotalPaidUsd())));
                    }
                    if (req.getPurchasedOn() != null) {
                        if (req.getPurchasedOn().isBlank()) {
                            existing.setPurchasedOn(null);
                        } else {
                            existing.setPurchasedOn(LocalDate.parse(req.getPurchasedOn()));
                        }
                    }
                    if (req.getNotes() != null) {
                        existing.setNotes(req.getNotes());
                    }
                    return ResponseEntity.ok(stackRepo.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /api/user-stack/{id} -> delete if owner
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User me = currentUser();
        return stackRepo.findById(id)
                .filter(existing -> existing.getUser().getId().equals(me.getId()))
                .map(existing -> {
                    stackRepo.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Data
    public static class CreateOrUpdateStackItem {
        private String metal;
        private Double weightOtz;
        private Integer quantity;
        private Double totalPaidUsd;
        private String purchasedOn;
        private String notes;
    }
}
