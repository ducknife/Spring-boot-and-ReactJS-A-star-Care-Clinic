-- MySQL schema aligned with Backend entities
CREATE DATABASE IF NOT EXISTS acare_clinic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE acare_clinic;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'PATIENT',
    gender VARCHAR(10) DEFAULT 'OTHER',
    birth_date DATE,
    address VARCHAR(255),
    id_number VARCHAR(30) UNIQUE,
    created_at DATETIME,
    CONSTRAINT ck_users_role CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
    CONSTRAINT ck_users_gender CHECK (gender IN ('MALE', 'FEMALE', 'OTHER'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    room_type VARCHAR(80) NOT NULL,
    location VARCHAR(120) NOT NULL,
    CONSTRAINT uq_rooms_name_location UNIQUE (name, location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    price DOUBLE NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME,
    duration_min BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NULL,
    room_id BIGINT NULL,
    start_time DATETIME NOT NULL,
    status VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    note VARCHAR(255),
    created_at DATETIME,
    CONSTRAINT uq_appt_doctor_time UNIQUE (doctor_id, start_time),
    CONSTRAINT uq_appt_room_time UNIQUE (room_id, start_time),
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id)
        REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_appt_room FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT ck_appointments_status CHECK (status IN ('PENDING', 'DONE', 'CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activity_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    message TEXT,
    time DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;