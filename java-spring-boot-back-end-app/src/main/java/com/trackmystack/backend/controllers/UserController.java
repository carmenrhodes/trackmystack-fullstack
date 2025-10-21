package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.User;
import com.trackmystack.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
/*@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"}, allowCredentials = "true")*/
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        // passwordHash should be hashed later
        return ResponseEntity.ok(userRepository.save(user));
    }
}
