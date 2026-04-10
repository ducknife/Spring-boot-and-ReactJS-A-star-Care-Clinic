package com.acare.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.acare.backend.dto.auth.AuthResponse;
import com.acare.backend.dto.auth.LoginRequest;
import com.acare.backend.entity.User;
import com.acare.backend.exception.BadRequestException;
import com.acare.backend.repository.UserRepository;
import com.acare.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Sai tai khoan hoac mat khau"));

        if (!matchesPassword(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Sai tai khoan hoac mat khau");
        }

        String normalizedRole = normalizeRole(user.getRole());
        String token = jwtService.generateToken(user.getEmail(), List.of(user.getRole()));

        return new AuthResponse(
                user.getEmail(),
                new String[]{normalizedRole},
                user.getRole(),
                user.getId(),
                "Bearer",
                token,
                jwtService.getExpirationSeconds()
        );
    }

    private String normalizeRole(String role) {
        return "ADMIN".equals(role) ? "ADMIN" : "USER";
    }

    private boolean matchesPassword(String rawPassword, String storedHash) {
        if (storedHash == null || storedHash.isBlank()) return false;

        // Support legacy records without {id} prefix.
        if (!storedHash.startsWith("{")) {
            return storedHash.equals(rawPassword);
        }

        return passwordEncoder.matches(rawPassword, storedHash);
    }
}
