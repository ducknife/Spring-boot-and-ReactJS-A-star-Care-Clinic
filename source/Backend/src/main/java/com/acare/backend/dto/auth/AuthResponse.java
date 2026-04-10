package com.acare.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String username;
    private String[] roles;
    private String originalRole;
    private Long id;
    private String tokenType;
    private String accessToken;
    private long expiresInSeconds;
}
