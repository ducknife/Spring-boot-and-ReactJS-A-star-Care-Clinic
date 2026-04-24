package com.acare.backend.dto.user;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserCreateRequest {
    @NotBlank(message = "Ho ten khong duoc de trong")
    private String fullName;

    @NotBlank(message = "Email khong duoc de trong")
    @Email(message = "Email khong hop le")
    private String email;

    private String phone;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @JsonAlias({"passwordHash"})
    private String password;

    @NotBlank(message = "Xac nhan mat khau khong duoc de trong")
    private String confirmPassword;

    private String role;
    @JsonAlias({"specialityId"})
    private Long specialtyId;
    @JsonAlias({"speciality"})
    private String specialty;
    @JsonAlias({"clinicRoom", "room"})
    private String clinicLocation;
    private Integer yearsExperience;
    private String department;
    private String gender;
    private String birthDate;
    private String address;
    private String idNumber;
    private String workingDays;
    private String shiftStart;
    private String shiftEnd;
}
