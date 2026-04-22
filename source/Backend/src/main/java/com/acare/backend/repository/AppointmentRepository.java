package com.acare.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.acare.backend.entity.Appointment;
import com.acare.backend.entity.enums.AppointmentStatus;
import com.acare.backend.repository.projection.DoctorDailyDoneCountProjection;
import com.acare.backend.repository.projection.DoctorPatientAppointmentProjection;
import com.acare.backend.repository.projection.DoctorPatientServiceCountProjection;
import com.acare.backend.repository.projection.TopNameCountProjection;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatusAndPatientId(AppointmentStatus status, Long patientId);
    Page<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status, Pageable pageable);
    List<Appointment> findByStatusAndDoctorId(AppointmentStatus status, Long doctorId);
    List<Appointment> findByStartTimeBetween(LocalDateTime from, LocalDateTime to);
    List<Appointment> findByStartTimeBetweenAndStatus(LocalDateTime from, LocalDateTime to, AppointmentStatus status);
    List<Appointment> findByStartTimeBetweenAndStatusAndDoctorId(LocalDateTime from, LocalDateTime to, AppointmentStatus status, Long doctorId);

    @Query("""
            select count(a) > 0
            from Appointment a
            where a.doctorId = :doctorId
                and a.status in :activeStatuses
                and :startTime < a.endTime
                and :endTime > a.startTime
            """)
    boolean existsDoctorConflict(@Param("doctorId") Long doctorId,
                                 @Param("startTime") LocalDateTime startTime,
                                 @Param("endTime") LocalDateTime endTime,
                                 @Param("activeStatuses") List<AppointmentStatus> activeStatuses);

    @Query("""
            select count(a) > 0
            from Appointment a
            where a.id <> :appointmentId
                and a.doctorId = :doctorId
                and a.status in :activeStatuses
                and :startTime < a.endTime
                and :endTime > a.startTime
            """)
    boolean existsDoctorConflictExcludingId(@Param("appointmentId") Long appointmentId,
                                            @Param("doctorId") Long doctorId,
                                            @Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime,
                                            @Param("activeStatuses") List<AppointmentStatus> activeStatuses);

    @Query("""
            select count(a) > 0
            from Appointment a
            where a.patientId = :patientId
                and a.status in :activeStatuses
                and :startTime < a.endTime
                and :endTime > a.startTime
            """)
    boolean existsPatientConflict(@Param("patientId") Long patientId,
                                  @Param("startTime") LocalDateTime startTime,
                                  @Param("endTime") LocalDateTime endTime,
                                  @Param("activeStatuses") List<AppointmentStatus> activeStatuses);

    @Query("""
            select count(a) > 0
            from Appointment a
            where a.id <> :appointmentId
                and a.patientId = :patientId
                and a.status in :activeStatuses
                and :startTime < a.endTime
                and :endTime > a.startTime
            """)
    boolean existsPatientConflictExcludingId(@Param("appointmentId") Long appointmentId,
                                             @Param("patientId") Long patientId,
                                             @Param("startTime") LocalDateTime startTime,
                                             @Param("endTime") LocalDateTime endTime,
                                             @Param("activeStatuses") List<AppointmentStatus> activeStatuses);

    @Query("""
            select u.fullName as name, count(a.id) as totalCount
            from Appointment a
            join a.doctor u
            where a.status = :status
                and a.startTime between :from and :to
            group by u.id, u.fullName
            order by count(a.id) desc, u.fullName asc
            """)
    List<TopNameCountProjection> findTopDoctorsByStatusAndStartTimeBetween(@Param("status") AppointmentStatus status,
                                                                            @Param("from") LocalDateTime from,
                                                                            @Param("to") LocalDateTime to,
                                                                            Pageable pageable);

    @Query("""
            select s.name as name, count(a.id) as totalCount
            from Appointment a
            join a.service s
            where a.status = :status
                and a.startTime between :from and :to
            group by s.id, s.name
            order by count(a.id) desc, s.name asc
            """)
    List<TopNameCountProjection> findTopServicesByStatusAndStartTimeBetween(@Param("status") AppointmentStatus status,
                                                                             @Param("from") LocalDateTime from,
                                                                             @Param("to") LocalDateTime to,
                                                                             Pageable pageable);

        @Query("""
            select coalesce(sum(s.price), 0)
            from Appointment a
            join a.service s
            where a.status = :status
            and a.startTime between :from and :to
            """)
        BigDecimal sumRevenueByStatusAndStartTimeBetween(@Param("status") AppointmentStatus status,
                                 @Param("from") LocalDateTime from,
                                 @Param("to") LocalDateTime to);

        @Query("""
            select count(a.id)
            from Appointment a
            where a.doctorId = :doctorId
            and a.status = :status
            and a.startTime >= :from
            and a.startTime < :to
            """)
        long countDoneAppointmentsByDoctorInRange(@Param("doctorId") Long doctorId,
                              @Param("status") AppointmentStatus status,
                              @Param("from") LocalDateTime from,
                              @Param("to") LocalDateTime to);

        @Query("""
            select count(distinct a.patientId)
            from Appointment a
            where a.doctorId = :doctorId
            and a.status = :status
            and a.startTime >= :from
            and a.startTime < :to
            """)
        long countDistinctDonePatientsByDoctorInRange(@Param("doctorId") Long doctorId,
                              @Param("status") AppointmentStatus status,
                              @Param("from") LocalDateTime from,
                              @Param("to") LocalDateTime to);

        @Query("""
            select function('date', a.startTime) as visitDate, count(a.id) as totalCount
            from Appointment a
            where a.doctorId = :doctorId
            and a.status = :status
            and a.startTime >= :from
            and a.startTime < :to
            group by function('date', a.startTime)
            order by function('date', a.startTime)
            """)
        List<DoctorDailyDoneCountProjection> countDoneAppointmentsByDoctorGroupedByDate(
            @Param("doctorId") Long doctorId,
            @Param("status") AppointmentStatus status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

        @Query("""
            select p.id as patientId,
               p.fullName as patientName,
               s.name as serviceName,
               count(a.id) as totalCount
            from Appointment a
            join a.patient p
            join a.service s
            where a.doctorId = :doctorId
            and a.status = :status
            and a.startTime >= :from
            and a.startTime < :to
            and (:keyword is null or lower(p.fullName) like lower(concat('%', :keyword, '%')))
            group by p.id, p.fullName, s.id, s.name
            order by p.fullName asc, count(a.id) desc, s.name asc
            """)
        List<DoctorPatientServiceCountProjection> summarizeDoctorPatientsByServiceInRange(
            @Param("doctorId") Long doctorId,
            @Param("status") AppointmentStatus status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("keyword") String keyword);

        @Query("""
            select a.id as appointmentId,
               a.appointmentCode as appointmentCode,
               a.startTime as startTime,
               a.endTime as endTime,
               a.status as status,
               s.name as serviceName,
               a.reason as reason,
               a.note as note
            from Appointment a
            join a.service s
            where a.doctorId = :doctorId
            and a.patientId = :patientId
            and a.status = :status
            and a.startTime >= :from
            and a.startTime < :to
            order by a.startTime desc
            """)
        Page<DoctorPatientAppointmentProjection> findDoctorPatientDoneAppointmentsInRange(
            @Param("doctorId") Long doctorId,
            @Param("patientId") Long patientId,
            @Param("status") AppointmentStatus status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

}
