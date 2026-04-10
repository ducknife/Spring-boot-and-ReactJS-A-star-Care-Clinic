package com.acare.backend.service;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.entity.Appointment;
import com.acare.backend.entity.Room;
import com.acare.backend.entity.User;
import com.acare.backend.exception.ResourceNotFoundException;
import com.acare.backend.repository.AppointmentRepository;
import com.acare.backend.repository.RoomRepository;
import com.acare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ActivityLogService activityLogService;

    public ApiResponse<Appointment> createAppointment(Appointment appointment) {
        if (appointmentRepository.existsByDoctorIdAndStartTime(appointment.getDoctorId(), appointment.getStartTime())) {
            return ApiResponse.fail(409, "Bac si co lich vao khung gio nay.", null);
        }
        if (appointmentRepository.existsByRoomIdAndStartTime(appointment.getRoomId(), appointment.getStartTime())) {
            return ApiResponse.fail(409, "Phong co lich vao khung gio nay.", null);
        }

        Appointment saved = appointmentRepository.save(appointment);
        User patient = userRepository.findById(saved.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay benh nhan"));
        activityLogService.add("APPOINTMENT", "Benh nhan " + patient.getFullName() + " vua dat lich thanh cong");

        return ApiResponse.created("Da dat lich hen", saved);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lich hen voi id=" + id));
    }

    public List<Appointment> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(23, 59, 59);
        List<Appointment> result = appointmentRepository.findByStartTimeBetween(start, end);
        result.sort(Comparator.comparing(Appointment::getCreatedAt));
        return result;
    }

    public List<Appointment> getTodayPendingAppointments() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(23, 59, 59);
        List<Appointment> result = appointmentRepository.findByStartTimeBetweenAndStatus(start, end, "PENDING");
        result.sort(Comparator.comparing(Appointment::getCreatedAt));
        return result;
    }

    public List<Appointment> getMonthDoneAppointments() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = today.atTime(23, 59, 59);
        return appointmentRepository.findByStartTimeBetweenAndStatus(start, end, "DONE");
    }

    public List<Appointment> getMonthDoneAppointmentsByDoctorId(Long doctorId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = today.atTime(23, 59, 59);
        return appointmentRepository.findByStartTimeBetweenAndStatusAndDoctorId(start, end, "DONE", doctorId);
    }

    public List<Appointment> getPendingByPatientId(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByStatusAndPatientId("PENDING", patientId);
        appointments.sort(Comparator.comparing(Appointment::getStartTime));
        return appointments;
    }

    public List<Appointment> getNotPendingByPatientId(Long patientId) {
        List<Appointment> done = appointmentRepository.findByStatusAndPatientId("DONE", patientId);
        List<Appointment> cancelled = appointmentRepository.findByStatusAndPatientId("CANCELLED", patientId);
        done.addAll(cancelled);
        done.sort(Comparator.comparing(Appointment::getStartTime));
        return done;
    }

    public List<Appointment> getPendingByDoctorId(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByStatusAndDoctorId("PENDING", doctorId);
        appointments.sort(Comparator.comparing(Appointment::getStartTime));
        return appointments;
    }

    public List<Appointment> getByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public ApiResponse<Object> deleteById(Long id) {
        Appointment appointment = getAppointmentById(id);
        User patient = userRepository.findById(appointment.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay benh nhan"));
        appointmentRepository.deleteById(id);
        activityLogService.add("APPOINTMENT", "Benh nhan " + patient.getFullName() + " da huy lich hen " + id);
        return ApiResponse.ok("DELETE SUCCESSFULLY", null);
    }

    public ApiResponse<Object> updateStatusDone(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("DONE");
        appointmentRepository.save(appointment);
        return ApiResponse.ok("UPDATE APPOINTMENT STATUS SUCCESSFULLY", null);
    }

    public ApiResponse<Object> updateStatusCancelled(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
        return ApiResponse.ok("UPDATE APPOINTMENT STATUS SUCCESSFULLY", null);
    }

    public Appointment updateAppointment(Long id, Appointment update) {
        Appointment appointment = getAppointmentById(id);

        if (update.getDoctorId() != null) appointment.setDoctorId(update.getDoctorId());
        if (update.getRoomId() != null) appointment.setRoomId(update.getRoomId());
        if (update.getStartTime() != null) appointment.setStartTime(update.getStartTime());
        if (update.getNote() != null) appointment.setNote(update.getNote());

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> filterAppointments(
            String doctorName,
            String patientName,
            LocalDate appointmentDate,
            String status,
            String roomName) {
        List<Appointment> appointments = appointmentRepository.findAll();

        if (doctorName != null && !doctorName.trim().isEmpty()) {
            List<Long> doctorIds = userRepository.findByRole("DOCTOR").stream()
                    .filter(doctor -> doctor.getFullName().toLowerCase().contains(doctorName.toLowerCase()))
                    .map(User::getId)
                    .collect(Collectors.toList());

            appointments = appointments.stream()
                    .filter(apt -> doctorIds.contains(apt.getDoctorId()))
                    .collect(Collectors.toList());
        }

        if (patientName != null && !patientName.trim().isEmpty()) {
            List<Long> patientIds = userRepository.findByRole("PATIENT").stream()
                    .filter(patient -> patient.getFullName().toLowerCase().contains(patientName.toLowerCase()))
                    .map(User::getId)
                    .collect(Collectors.toList());

            appointments = appointments.stream()
                    .filter(apt -> patientIds.contains(apt.getPatientId()))
                    .collect(Collectors.toList());
        }

        if (appointmentDate != null) {
            LocalDateTime startOfDay = appointmentDate.atStartOfDay();
            LocalDateTime endOfDay = appointmentDate.atTime(23, 59, 59);

            appointments = appointments.stream()
                    .filter(apt -> apt.getStartTime() != null 
                            && !apt.getStartTime().isBefore(startOfDay) 
                            && !apt.getStartTime().isAfter(endOfDay))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.trim().isEmpty()) {
            appointments = appointments.stream()
                    .filter(apt -> apt.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        if (roomName != null && !roomName.trim().isEmpty()) {
            List<Long> roomIds = roomRepository.findAll().stream()
                    .filter(room -> room.getName().toLowerCase().contains(roomName.toLowerCase()))
                    .map(Room::getId)
                    .collect(Collectors.toList());

            appointments = appointments.stream()
                    .filter(apt -> apt.getRoomId() != null && roomIds.contains(apt.getRoomId()))
                    .collect(Collectors.toList());
        }

        return appointments;
    }
}
