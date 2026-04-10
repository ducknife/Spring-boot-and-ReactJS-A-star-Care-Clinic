package com.acare.backend.controller;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.entity.Appointment;
import com.acare.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

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

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Appointment>> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/today")
    public ResponseEntity<List<Appointment>> getTodayAppointments() {
        return ResponseEntity.ok(appointmentService.getTodayAppointments());
    }

    @GetMapping("/today/pending")
    public ResponseEntity<List<Appointment>> getTodayPendingAppointments() {
        return ResponseEntity.ok(appointmentService.getTodayPendingAppointments());
    }

    @GetMapping("/month/done")
    public ResponseEntity<List<Appointment>> getMonthDoneAppointments() {
        return ResponseEntity.ok(appointmentService.getMonthDoneAppointments());
    }

    @GetMapping("/month/done/{doctorId}")
    public ResponseEntity<List<Appointment>> getMonthDoneAppointmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getMonthDoneAppointmentsByDoctorId(doctorId));
    }

    @GetMapping("/{id}")
    public Appointment getAllAppointments(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @GetMapping("/pending/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPendingAppoinmentsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPendingByPatientId(patientId));
    }

    @GetMapping("/not-pending/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getDoneAppoinmentsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getNotPendingByPatientId(patientId));
    }

    @GetMapping("/pending/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getPendingAppoinmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getPendingByDoctorId(doctorId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAllAppoinmentsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getByDoctorId(doctorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.deleteById(id));
    }

    @PatchMapping("/done/{id}")
    public ResponseEntity<ApiResponse<Object>> changeAppointmentStatusFromPendingToDone(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.updateStatusDone(id));
    }

    @PatchMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<Object>> changeAppointmentStatusFromPendingToCanceled(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.updateStatusCancelled(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment update) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, update));
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<Appointment>> filterAppointments(
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate appointmentDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String roomName) {
        
        List<Appointment> filteredAppointments = appointmentService.filterAppointments(
                doctorName, patientName, appointmentDate, status, roomName);
        filteredAppointments.sort(Comparator.comparing(Appointment::getStartTime));
        return ResponseEntity.ok(filteredAppointments);
    }
}
