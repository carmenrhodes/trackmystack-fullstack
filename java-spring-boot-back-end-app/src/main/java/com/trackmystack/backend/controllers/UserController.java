package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.User;
import com.trackmystack.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;

    // GET /api/users  - list all
    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }

    // POST /api/users - create
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        // TODO: hash password before save in a later milestone
        User saved = userRepository.save(user);
        return ResponseEntity
                .created(URI.create("/api/users/" + saved.getId()))
                .body(saved);
    }

    // GET /api/users/{id} - get by id
    @GetMapping("/{id}")
    public ResponseEntity<User> one(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/users/{id} - partial update (field-by-field)
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User req) {
        return userRepository.findById(id)
                .map(u -> {
                    if (req.getEmail() != null) u.setEmail(req.getEmail());
                    if (req.getPasswordHash() != null) u.setPasswordHash(req.getPasswordHash()); // hash later
                    User saved = userRepository.save(u);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/users/{id} - delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}