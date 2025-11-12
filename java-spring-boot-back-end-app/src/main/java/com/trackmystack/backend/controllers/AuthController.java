package com.trackmystack.backend.controllers;

import com.trackmystack.backend.models.User;
import com.trackmystack.backend.repositories.UserRepository;
import com.trackmystack.backend.security.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000"}, allowCredentials = "true")

// Handles user registration, login, and the /me endpoint.
// Uses JWT for stateless auth and stores users in the database.
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Register a new user account, hash their password, save them in the database, and return a JWT and basic profile info.
    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail().trim().toLowerCase()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User u = new User();
        u.setEmail(req.getEmail().trim().toLowerCase());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setFullName(req.getFullName());                 // <— store full name
        u.setCreatedAt(Instant.now());
        userRepo.save(u);

        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), u.getFullName(), u.getId()));
    }

    // Log in an existing user by verifying email/password. On success, return a fresh JWT + basic profile info.
    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail().trim().toLowerCase(),
                            req.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User u = userRepo.findByEmail(req.getEmail().trim().toLowerCase())
                .orElse(null);
        if (u == null) return ResponseEntity.status(401).body("Invalid credentials");

        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), u.getFullName(), u.getId()));
    }

    // Return the current logged-in user's info, based on the JWT in the Authorization header.
    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name="Authorization", required=false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }
            String email = jwtUtil.validateAndGetSubject(authHeader.substring(7));
            if (email == null) return ResponseEntity.status(401).build();

            return userRepo.findByEmail(email)
                    .map(u -> ResponseEntity.ok(new MeResponse(u.getId(), u.getEmail(), u.getFullName())))
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }


    // DTOs
    @Data public static class RegisterRequest { private String fullName; private String email; private String password; }
    @Data public static class LoginRequest { private String email; private String password; }

    @Data public static class AuthResponse {
        private final String token;
        private final String email;
        private final String fullName;
        private final Long userId;
    }

    @Data public static class MeResponse {
        private final Long userId;
        private final String email;
        private final String fullName;
    }
}

