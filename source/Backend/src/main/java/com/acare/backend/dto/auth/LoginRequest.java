package com.acare.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank("Không được để trống username")
    private String username;

    @NotBlank("Không được để trống password")
    private String password;
}
