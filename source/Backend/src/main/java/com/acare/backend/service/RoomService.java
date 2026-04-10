package com.acare.backend.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.entity.Room;
import com.acare.backend.exception.ResourceNotFoundException;
import com.acare.backend.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        rooms.sort(Comparator.comparing(Room::getLocation).thenComparing(Room::getName));
        return rooms;
    }

    public List<Room> searchRooms(String floor) {
        List<Room> rooms = getAllRooms();
        if (floor == null || floor.isBlank()) return rooms;

        return rooms.stream()
                .filter(room -> room.getLocation() != null && room.getLocation().contains(floor))
                .toList();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay phong voi id=" + id));
    }

    public ApiResponse<Room> addRoom(Room room) {
        if (roomRepository.findByNameAndLocation(room.getName(), room.getLocation()).isPresent()) {
            return ApiResponse.fail(409, "ROOM EXISTED", room);
        }
        Room saved = roomRepository.save(room);
        return ApiResponse.created("ADDED ROOM SUCCESSFULLY", saved);
    }

    public ApiResponse<Object> deleteRoom(Long id) {
        getRoomById(id);
        roomRepository.deleteById(id);
        return ApiResponse.ok("DELETED ROOM SUCCESSFULLY", null);
    }

    public ApiResponse<Room> updateRoom(Long id, Room update) {
        Room room = getRoomById(id);
        if (update.getRoomType() != null) room.setRoomType(update.getRoomType());
        if (update.getLocation() != null) room.setLocation(update.getLocation());
        if (update.getName() != null) room.setName(update.getName());
        Room saved = roomRepository.save(room);
        return ApiResponse.ok("UPDATED ROOM SUCCESSFULLY", saved);
    }
}
