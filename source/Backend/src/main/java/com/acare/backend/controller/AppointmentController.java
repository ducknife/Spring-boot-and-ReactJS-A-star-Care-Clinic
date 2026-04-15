package com.acare.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.dto.ApiResponseMapper;
import com.acare.backend.dto.appointment.AppointmentAvailabilityOption;
import com.acare.backend.dto.appointment.AppointmentCreateRequest;
import com.acare.backend.dto.appointment.AppointmentResponse;
import com.acare.backend.dto.appointment.AppointmentUpsertRequest;
import com.acare.backend.dto.appointment.DoctorByServiceResponse;
import com.acare.backend.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> create(@RequestBody AppointmentCreateRequest request) {
        return ResponseEntity.ok(ApiResponseMapper.map(appointmentService.createAppointment(request), AppointmentResponse::from));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<AppointmentResponse>> createAppointment(@RequestBody AppointmentUpsertRequest request) {
        return ResponseEntity.ok(ApiResponseMapper.map(appointmentService.createAppointment(request.toEntity()), AppointmentResponse::from));
    }

    @GetMapping
    public List<AppointmentResponse> getAppointments(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Boolean pending,
            @RequestParam(required = false) Boolean today,
            @RequestParam(required = false) Boolean doneThisMonth,
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate appointmentDate,
            @RequestParam(required = false) String status) {
            return appointmentService.getAppointments(
                doctorId,
                patientId,
                pending,
                today,
                doneThisMonth,
                doctorName,
                patientName,
                appointmentDate,
                status).stream().map(AppointmentResponse::from).toList();
    }

    @GetMapping("/today")
    public ResponseEntity<List<AppointmentResponse>> getTodayAppointments() {
            return ResponseEntity.ok(appointmentService.getTodayAppointments().stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/today/pending")
    public ResponseEntity<List<AppointmentResponse>> getTodayPendingAppointments() {
        return ResponseEntity.ok(appointmentService.getTodayPendingAppointments().stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/month/done")
    public ResponseEntity<List<AppointmentResponse>> getMonthDoneAppointments() {
        return ResponseEntity.ok(appointmentService.getMonthDoneAppointments().stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/month/done/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getMonthDoneAppointmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getMonthDoneAppointmentsByDoctorId(doctorId).stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/availability")
    public ResponseEntity<List<AppointmentAvailabilityOption>> getAvailability(
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailability(serviceId, date));
    }

    @GetMapping("/doctor-availability")
    public ResponseEntity<List<AppointmentAvailabilityOption>> getDoctorAvailability(
            @RequestParam Long doctorId,
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
            @RequestParam(required = false) Long appointmentId) {
        return ResponseEntity.ok(appointmentService.getDoctorAvailability(doctorId, serviceId, date, appointmentId));
    }

    @GetMapping("/doctors-by-service")
    public ResponseEntity<List<DoctorByServiceResponse>> getDoctorsByService(
            @RequestParam Long serviceId) {
        return ResponseEntity.ok(appointmentService.getDoctorsByServiceId(serviceId).stream()
                .map(DoctorByServiceResponse::fromMap)
                .toList());
    }

    @GetMapping("/{id}")
    public AppointmentResponse getAllAppointments(@PathVariable Long id) {
        return AppointmentResponse.from(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/pending/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getPendingAppoinmentsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPendingByPatientId(patientId).stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/not-pending/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getDoneAppoinmentsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getNotPendingByPatientId(patientId).stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/history/patient/{patientId}")
    public ResponseEntity<Page<AppointmentResponse>> getHistoryByPatientId(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "startTime,desc") String[] sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("startTime")));
        if (sort != null && sort.length > 0 && sort[0] != null && !sort[0].isBlank()) {
            String[] sortParts = sort[0].split(",");
            String property = sortParts[0];
            Sort.Direction direction = (sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1]))
                    ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            pageable = PageRequest.of(page, size, Sort.by(new Sort.Order(direction, property)));
        }

        Page<AppointmentResponse> response = appointmentService.getDoneByPatientId(patientId, pageable)
                .map(AppointmentResponse::from);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getPendingAppoinmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getPendingByDoctorId(doctorId).stream().map(AppointmentResponse::from).toList());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getAllAppoinmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getByDoctorId(doctorId).stream().map(AppointmentResponse::from).toList());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Object>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAppointmentById(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "PATIENT") String cancelledBy,
            @RequestParam(required = false) String cancelReason) {
        return ResponseEntity.ok(appointmentService.deleteById(id, cancelledBy, cancelReason));
    }

    @PatchMapping("/done/{id}")
    public ResponseEntity<ApiResponse<Object>> changeAppointmentStatusFromPendingToDone(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "DONE"));
    }

    @PatchMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<Object>> changeAppointmentStatusFromPendingToCanceled(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, "CANCELLED"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> updateAppointment(@PathVariable Long id, @RequestBody AppointmentUpsertRequest request) {
        return ResponseEntity.ok(AppointmentResponse.from(appointmentService.updateAppointment(id, request.toEntity())));
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<AppointmentResponse>> filterAppointments(
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate appointmentDate,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(appointmentService.filterAppointments(
            doctorName,
            patientName,
            appointmentDate,
            status).stream().map(AppointmentResponse::from).toList());
    }
}
