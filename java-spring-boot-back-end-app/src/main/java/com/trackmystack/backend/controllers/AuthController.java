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
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User u = new User();
        u.setEmail(req.getEmail().trim().toLowerCase());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setCreatedAt(Instant.now());
        // (Optional) u.setRole("USER");

        userRepo.save(u);


        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, u.getEmail()));
    }

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

        String token = jwtUtil.generateToken(req.getEmail().trim().toLowerCase());
        return ResponseEntity.ok(new AuthResponse(token, req.getEmail().trim().toLowerCase()));
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name="Authorization", required=false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(401).build();
        String sub = jwtUtil.validateAndGetSubject(authHeader.substring(7));
        return sub == null ? ResponseEntity.status(401).build() : ResponseEntity.ok(new MeResponse(sub));
    }

    // DTOs
    @Data public static class RegisterRequest { private String email; private String password; }
    @Data public static class LoginRequest { private String email; private String password; }

    @Data public static class AuthResponse {
        private final String token;
        private final String email;
    }
    @Data public static class MeResponse { private final String email; }
}
