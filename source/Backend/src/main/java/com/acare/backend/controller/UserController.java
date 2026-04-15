package com.acare.backend.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.dto.ApiResponseMapper;
import com.acare.backend.dto.user.DoctorProfileResponse;
import com.acare.backend.dto.user.DoctorProfileUpdateRequest;
import com.acare.backend.dto.user.DoctorPublicResponse;
import com.acare.backend.dto.user.UserCreateRequest;
import com.acare.backend.dto.user.UserResponse;
import com.acare.backend.dto.user.UserUpdateRequest;
import com.acare.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String email) {

        List<UserResponse> responses;

        if ((fullName != null && !fullName.isBlank())
                || (role != null && !role.isBlank())
                || (email != null && !email.isBlank())) {
            responses = userService.searchUsers(fullName, role, email).stream()
                    .map(UserResponse::from)
                    .toList();
        } else {
            responses = userService.getAllUsers().stream()
                    .map(UserResponse::from)
                    .toList();
        }

        responses = responses.stream()
                .sorted(Comparator.comparing(UserResponse::getRole, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(UserResponse.from(userService.getUserById(id)));
    }

    @GetMapping("/{id}/doctor-profile")
    public ResponseEntity<DoctorProfileResponse> getDoctorProfileByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getDoctorProfileByUserId(id));
    }

    @PutMapping("/{id}/doctor-profile")
    public ResponseEntity<DoctorProfileResponse> updateDoctorProfileByUserId(
            @PathVariable Long id,
            @RequestBody DoctorProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateDoctorProfileByUserId(id, request));
    }

    @GetMapping("/doctor")
    public ResponseEntity<Page<DoctorPublicResponse>> getDoctors(
            @PageableDefault(size = 4, sort = "fullName") Pageable pageable) {
        return ResponseEntity.ok(userService.getDoctors(pageable));
    }

    @GetMapping("/patient")
    public ResponseEntity<List<UserResponse>> getPatients() {
        return ResponseEntity.ok(userService.getPatients().stream().map(UserResponse::from).toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(UserResponse.from(userService.updateUser(id, request)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ResponseEntity.ok(ApiResponseMapper.map(userService.register(request), UserResponse::from));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> addUser(@Valid @RequestBody UserCreateRequest request) {
        return createUser(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String email) {
        return getUsers(fullName, role, email);
    }
}