package com.acare.backend.service;

import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.dto.user.DoctorProfileResponse;
import com.acare.backend.dto.user.DoctorProfileUpdateRequest;
import com.acare.backend.dto.user.DoctorPublicResponse;
import com.acare.backend.dto.user.UserCreateRequest;
import com.acare.backend.dto.user.UserUpdateRequest;
import com.acare.backend.entity.DoctorProfile;
import com.acare.backend.entity.PatientProfile;
import com.acare.backend.entity.Specialty;
import com.acare.backend.entity.User;
import com.acare.backend.entity.enums.Gender;
import com.acare.backend.entity.enums.UserRole;
import com.acare.backend.exception.BadRequestException;
import com.acare.backend.exception.ResourceNotFoundException;
import com.acare.backend.repository.DoctorProfileRepository;
import com.acare.backend.repository.PatientProfileRepository;
import com.acare.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final SpecialtyService specialtyService;
    private final ActivityLogService activityLogService;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.sort(Comparator
                .comparing((User u) -> u.getRole().name())
                .thenComparing(User::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)));
        return users;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung voi id=" + id));
    }

    public Page<DoctorPublicResponse> getDoctors(Pageable pageable) {
        Page<User> doctorPage = userRepository.findByRole(UserRole.DOCTOR, pageable);
        List<User> doctors = doctorPage.getContent();
        if (doctors.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, doctorPage.getTotalElements());
        }

        List<Long> userIds = doctors.stream().map(User::getId).toList();
        Map<Long, DoctorProfile> profileByUserId = new HashMap<>();
        doctorProfileRepository.findByUserIdIn(userIds)
                .forEach(profile -> profileByUserId.put(profile.getUserId(), profile));

        List<DoctorPublicResponse> content = doctors.stream()
                .map(user -> DoctorPublicResponse.from(user, profileByUserId.get(user.getId())))
                .toList();

        return new PageImpl<>(content, pageable, doctorPage.getTotalElements());
    }

    public List<User> getPatients() {
        return userRepository.findByRole(UserRole.PATIENT);
    }

    public ApiResponse<User> register(UserCreateRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("PASSWORD MISMATCH");
        }

        UserRole role = parseRoleOrDefault(request.getRole());
        DoctorSpecialization doctorSpecialization = resolveDoctorSpecialization(role, request);
        String doctorClinicLocation = resolveDoctorClinicLocation(role, request);

        User normalized = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(encodeIfPresent(request.getPassword()))
                .role(role)
                .gender(parseGenderOrDefault(request.getGender()))
                .birthDate(parseBirthDate(request.getBirthDate()))
                .address(request.getAddress())
                .idNumber(request.getIdNumber())
                .enabled(true)
                .build()
                .withDefaults();

        validateUniqueFields(normalized, null);

        User saved = userRepository.save(normalized);
        provisionProfileByRole(saved, doctorSpecialization, doctorClinicLocation, request);
        activityLogService.addAdminIfCurrentUser("ADMIN CREATE USER: " + saved.getFullName());
        return ApiResponse.created("SIGN UP SUCCESSFULLY", saved);
    }

    public User updateUser(Long id, User update) {
        User user = getUserById(id).mergeFrom(update);

        user = normalizeDefaultValues(user);
        validateUniqueFields(user, id);

        User saved = userRepository.save(user);
        provisionProfileByRole(saved, null, null, null);
        activityLogService.addAdminIfCurrentUser("ADMIN UPDATE USER: " + saved.getFullName());

        return saved;
    }

    public User updateUser(Long id, UserUpdateRequest request) {
        if (request == null) {
            throw new BadRequestException("Du lieu cap nhat khong hop le");
        }

        User update = User.builder()
                .fullName(trimToNull(request.getFullName()))
                .email(trimToNull(request.getEmail()))
                .phone(trimToNull(request.getPhone()))
                .gender(parseGenderOrNull(request.getGender()))
                .birthDate(parseBirthDate(request.getBirthDate()))
                .address(trimToNull(request.getAddress()))
                .idNumber(trimToNull(request.getIdNumber()))
                .role(parseRoleOrNull(request.getRole()))
                .enabled(request.getEnabled())
                .build();

        return updateUser(id, update);
    }

    public ApiResponse<Object> deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.deleteById(id);
        activityLogService.addAdminIfCurrentUser("ADMIN DELETE USER: " + user.getFullName());
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
            UserRole roleFilter = parseRole(role);
            users = users.stream()
                .filter(user -> user.getRole() == roleFilter)
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

    public DoctorProfileResponse getDoctorProfileByUserId(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() != UserRole.DOCTOR) {
            throw new BadRequestException("Nguoi dung nay khong phai bac si");
        }

        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultDoctorProfile(userId));

        return DoctorProfileResponse.from(profile);
    }

    public DoctorProfileResponse updateDoctorProfileByUserId(Long userId, DoctorProfileUpdateRequest request) {
        if (request == null) {
            throw new BadRequestException("Du lieu cap nhat khong hop le");
        }

        User user = getUserById(userId);
        if (user.getRole() != UserRole.DOCTOR) {
            throw new BadRequestException("Chi co the cap nhat lich lam viec cho bac si");
        }

        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultDoctorProfile(userId));

        String clinicLocation = normalizeClinicLocation(request.getClinicLocation(), profile.getClinicLocation());
        String workingDays = normalizeWorkingDays(request.getWorkingDays(), profile.getWorkingDays());
        java.time.LocalTime shiftStart = parseShiftTimeOrDefault(request.getShiftStart(), profile.getShiftStart());
        java.time.LocalTime shiftEnd = parseShiftTimeOrDefault(request.getShiftEnd(), profile.getShiftEnd());
        Integer yearsExperience = normalizeYearsExperience(request.getYearsExperience(), profile.getYearsExperience());
        DoctorSpecialization specialization = resolveDoctorSpecializationForProfileUpdate(request.getSpecialtyId(), profile.getSpecialtyId());

        if (!shiftEnd.isAfter(shiftStart)) {
            throw new BadRequestException("Gio ket thuc phai sau gio bat dau");
        }

        DoctorProfile saved = doctorProfileRepository.save(profile.toBuilder()
            .specialtyId(specialization.specialtyId())
            .specialty(specialization.specialty())
            .department(specialization.department())
                .clinicLocation(clinicLocation)
                .workingDays(workingDays)
                .shiftStart(shiftStart)
                .shiftEnd(shiftEnd)
                .yearsExperience(yearsExperience)
                .build());

        activityLogService.addAdminIfCurrentUser("ADMIN UPDATE DOCTOR PROFILE: " + user.getFullName());

        return DoctorProfileResponse.from(saved);
    }

    private UserRole parseRole(String role) {
        try {
            return UserRole.valueOf(role.trim().toUpperCase());
        } catch (Exception ex) {
            throw new BadRequestException("Role khong hop le");
        }
    }

    private UserRole parseRoleOrNull(String role) {
        if (role == null || role.isBlank()) {
            return null;
        }

        return parseRole(role);
    }

    private Gender parseGenderOrNull(String gender) {
        if (gender == null || gender.isBlank()) {
            return null;
        }

        return parseGenderOrDefault(gender);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private User normalizeDefaultValues(User user) {
        return user.withDefaults();
    }

    private DoctorProfile createDefaultDoctorProfile(Long userId) {
        DoctorSpecialization defaultSpecialization = resolveGeneralDoctorSpecialization();
        DoctorProfile profile = DoctorProfile.createForUser(userId, defaultSpecialization.specialtyId()).toBuilder()
                .department(defaultSpecialization.department())
                .specialty(defaultSpecialization.specialty())
                .clinicLocation("CS1 - Tầng 1")
                .build();
        return doctorProfileRepository.save(profile);
    }

    private String normalizeClinicLocation(String incoming, String fallback) {
        String value = incoming != null ? incoming.trim() : null;
        if (value == null || value.isBlank()) {
            value = fallback;
        }

        if (value == null || value.isBlank()) {
            throw new BadRequestException("Phong kham khong duoc de trong");
        }

        return value;
    }

    private String normalizeWorkingDays(String incoming, String fallback) {
        String source = incoming;
        if (source == null || source.isBlank()) {
            source = fallback;
        }
        if (source == null || source.isBlank()) {
            source = "MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY";
        }

        Set<String> normalized = new LinkedHashSet<>();
        Arrays.stream(source.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(s -> s.toUpperCase(Locale.ROOT))
                .forEach(day -> {
                    try {
                        java.time.DayOfWeek parsed = java.time.DayOfWeek.valueOf(day);
                        if (parsed != java.time.DayOfWeek.SATURDAY && parsed != java.time.DayOfWeek.SUNDAY) {
                            normalized.add(day);
                        }
                    } catch (IllegalArgumentException ex) {
                        throw new BadRequestException("Ngay lam viec khong hop le: " + day);
                    }
                });

        if (normalized.isEmpty()) {
            throw new BadRequestException("Bac si phai co it nhat mot ngay lam viec");
        }

        return String.join(",", normalized);
    }

    private java.time.LocalTime parseShiftTimeOrDefault(String raw, java.time.LocalTime fallback) {
        if (raw == null || raw.isBlank()) {
            return fallback != null ? fallback : java.time.LocalTime.of(8, 0);
        }

        try {
            return java.time.LocalTime.parse(raw.trim(), DateTimeFormatter.ofPattern("HH:mm"));
        } catch (DateTimeParseException ex) {
            throw new BadRequestException("Gio lam viec khong hop le (HH:mm)");
        }
    }

    private Integer normalizeYearsExperience(Integer incoming, Integer fallback) {
        Integer value = incoming != null ? incoming : fallback;
        if (value == null) {
            value = 0;
        }
        if (value < 0) {
            throw new BadRequestException("So nam kinh nghiem khong hop le");
        }
        return value;
    }

    private DoctorSpecialization resolveDoctorSpecializationForProfileUpdate(Long incomingSpecialtyId, Long fallbackSpecialtyId) {
        Long effectiveSpecialtyId = incomingSpecialtyId != null ? incomingSpecialtyId : fallbackSpecialtyId;
        if (effectiveSpecialtyId == null) {
            return resolveGeneralDoctorSpecialization();
        }

        Specialty specialty = specialtyService.getRequiredActiveById(effectiveSpecialtyId);
        return new DoctorSpecialization(
                specialty.getId(),
                normalizeDepartmentValue(specialty.getCode()),
                specialty.getName());
    }

    private void validateUniqueFields(User user, Long currentUserId) {
        if (user.getEmail() != null) {
            userRepository.findByEmailIgnoreCase(user.getEmail())
                    .filter(found -> !found.getId().equals(currentUserId))
                    .ifPresent(found -> {
                        throw new BadRequestException("EMAIL WAS USED");
                    });
        }
        if (user.getPhone() != null && !user.getPhone().isBlank()) {
            userRepository.findByPhone(user.getPhone())
                    .filter(found -> !found.getId().equals(currentUserId))
                    .ifPresent(found -> {
                        throw new BadRequestException("NUMBER WAS USED");
                    });
        }
        if (user.getIdNumber() != null && !user.getIdNumber().isBlank()) {
            userRepository.findByIdNumber(user.getIdNumber())
                    .filter(found -> !found.getId().equals(currentUserId))
                    .ifPresent(found -> {
                        throw new BadRequestException("ID NUMBER WAS USED");
                    });
        }
    }

    private void provisionProfileByRole(
            User user,
            DoctorSpecialization doctorSpecialization,
            String doctorClinicLocation,
            UserCreateRequest request) {
        if (user.getRole() == UserRole.DOCTOR && !doctorProfileRepository.existsByUserId(user.getId())) {
            DoctorSpecialization resolved = doctorSpecialization != null
                    ? doctorSpecialization
                    : resolveGeneralDoctorSpecialization();

            java.time.LocalTime start = java.time.LocalTime.of(8, 0);
            java.time.LocalTime end = java.time.LocalTime.of(17, 0);
            try {
                if (request != null && request.getShiftStart() != null && !request.getShiftStart().isBlank()) {
                    start = java.time.LocalTime.parse(request.getShiftStart(), DateTimeFormatter.ofPattern("HH:mm"));
                }
                if (request != null && request.getShiftEnd() != null && !request.getShiftEnd().isBlank()) {
                    end = java.time.LocalTime.parse(request.getShiftEnd(), DateTimeFormatter.ofPattern("HH:mm"));
                }
            } catch (Exception e) {}
            
            String days = (request != null && request.getWorkingDays() != null && !request.getWorkingDays().isBlank())
                 ? request.getWorkingDays() : "MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY";
              days = normalizeWorkingDays(days, "MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY");

            String clinicLocation = (doctorClinicLocation != null && !doctorClinicLocation.isBlank())
                    ? doctorClinicLocation.trim()
                    : "CS1 - Tầng 1";

            DoctorProfile profile = DoctorProfile.createForUser(user.getId(), resolved.specialtyId()).toBuilder()
                    .department(resolved.department())
                    .specialty(resolved.specialty())
                    .shiftStart(start)
                    .shiftEnd(end)
                    .workingDays(days)
                    .clinicLocation(clinicLocation)
                    .build();
            doctorProfileRepository.save(profile);
            return;
        }

        if (user.getRole() == UserRole.PATIENT && !patientProfileRepository.existsByUserId(user.getId())) {
            patientProfileRepository.save(PatientProfile.createForUser(user.getId()));
        }
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

    private UserRole parseRoleOrDefault(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return UserRole.PATIENT;
        }

        try {
            return UserRole.valueOf(rawRole.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Role khong hop le");
        }
    }

    private Gender parseGenderOrDefault(String rawGender) {
        if (rawGender == null || rawGender.isBlank()) {
            return Gender.OTHER;
        }

        try {
            return Gender.valueOf(rawGender.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Gender khong hop le");
        }
    }

    private java.time.LocalDate parseBirthDate(String rawBirthDate) {
        if (rawBirthDate == null || rawBirthDate.isBlank()) {
            return null;
        }

        try {
            return java.time.LocalDate.parse(rawBirthDate, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } catch (DateTimeParseException ignored) {
        }

        try {
            return java.time.LocalDate.parse(rawBirthDate, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException ex) {
            throw new BadRequestException("Ngay sinh khong hop le");
        }
    }

    private DoctorSpecialization resolveDoctorSpecialization(UserRole role, UserCreateRequest request) {
        if (role != UserRole.DOCTOR) {
            return null;
        }

        if (request.getSpecialtyId() == null) {
            throw new BadRequestException("DOCTOR SPECIALTY IS REQUIRED");
        }

        Specialty specialty = specialtyService.getRequiredActiveById(request.getSpecialtyId());
        String resolvedDepartment = normalizeDepartmentValue(specialty.getCode());
        String resolvedSpecialty = specialty.getName();

        return new DoctorSpecialization(specialty.getId(), resolvedDepartment, resolvedSpecialty);
    }

    private String resolveDoctorClinicLocation(UserRole role, UserCreateRequest request) {
        if (role != UserRole.DOCTOR) {
            return null;
        }

        if (request.getClinicLocation() == null || request.getClinicLocation().isBlank()) {
            throw new BadRequestException("DOCTOR CLINIC LOCATION IS REQUIRED");
        }

        return request.getClinicLocation().trim();
    }

    private DoctorSpecialization resolveGeneralDoctorSpecialization() {
        Specialty generalSpecialty = specialtyService.getRequiredByCode("GENERAL");
        return new DoctorSpecialization(
                generalSpecialty.getId(),
                normalizeDepartmentValue(generalSpecialty.getCode()),
                generalSpecialty.getName());
    }

    private String normalizeDepartmentValue(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            return null;
        }

        return rawValue.trim().toUpperCase(Locale.ROOT);
    }

    private record DoctorSpecialization(Long specialtyId, String department, String specialty) {
    }
}
