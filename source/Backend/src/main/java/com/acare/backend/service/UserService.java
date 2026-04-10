package com.acare.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.entity.User;
import com.acare.backend.exception.BadRequestException;
import com.acare.backend.exception.ResourceNotFoundException;
import com.acare.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.sort((u1, u2) -> u1.getRole().compareTo(u2.getRole()));
        return users;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung voi id=" + id));
    }

    public List<User> getDoctors() {
        return userRepository.findByRole("DOCTOR");
    }

    public List<User> getPatients() {
        return userRepository.findByRole("PATIENT");
    }

    public ApiResponse<User> register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ApiResponse.fail(409, "EMAIL WAS USED", user);
        }
        if (userRepository.findByPhone(user.getPhone()).isPresent()) {
            return ApiResponse.fail(409, "NUMBER WAS USED", user);
        }
        if (userRepository.findByIdNumber(user.getIdNumber()).isPresent()) {
            return ApiResponse.fail(409, "ID NUMBER WAS USED", user);
        }

        user.setPasswordHash(encodeIfPresent(user.getPasswordHash()));
        User saved = userRepository.save(user);
        activityLogService.add("USER MANAGEMENT", "Tao tai khoan moi cho " + saved.getFullName());
        return ApiResponse.created("SIGN UP SUCCESSFULLY", saved);
    }

    public User updateUser(Long id, User update) {
        User user = getUserById(id);

        if (update.getFullName() != null) user.setFullName(update.getFullName());
        if (update.getEmail() != null) user.setEmail(update.getEmail());
        if (update.getPhone() != null) user.setPhone(update.getPhone());
        if (update.getGender() != null) user.setGender(update.getGender());
        if (update.getBirthDate() != null) user.setBirthDate(update.getBirthDate());
        if (update.getAddress() != null) user.setAddress(update.getAddress());
        if (update.getIdNumber() != null) user.setIdNumber(update.getIdNumber());
        if (update.getRole() != null) user.setRole(update.getRole());
        if (update.getPasswordHash() != null && !update.getPasswordHash().isBlank()) {
            user.setPasswordHash(encodeIfPresent(update.getPasswordHash()));
        }

        return userRepository.save(user);
    }

    public ApiResponse<Object> deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.deleteById(id);
        activityLogService.add("USER MANAGEMENT", "Da xoa tai khoan nguoi dung " + user.getFullName());
        return ApiResponse.ok("DELETED SUCCESSFULLY", null);
    }

    public List<User> searchUsers(String fullName, String role, String email) {
        List<User> users = userRepository.findAll();

        // Search theo tên người dùng
        if (fullName != null && !fullName.trim().isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getFullName() != null && 
                            user.getFullName().toLowerCase().contains(fullName.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (role != null && !role.trim().isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getRole().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        }

        if (email != null && !email.trim().isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getEmail() != null && 
                            user.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return users;
    }

    private String encodeIfPresent(String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new BadRequestException("Password khong duoc de trong");
        }

        if (rawPassword.startsWith("{")) {
            return rawPassword;
        }

        return passwordEncoder.encode(rawPassword);
    }
}
