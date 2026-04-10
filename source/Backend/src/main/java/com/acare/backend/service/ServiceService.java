package com.acare.backend.service;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.exception.ResourceNotFoundException;
import com.acare.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<com.acare.backend.entity.Service> getAllServices() {
        List<com.acare.backend.entity.Service> services = serviceRepository.findAll();
        services.sort((s1, s2) -> s2.getPrice().compareTo(s1.getPrice()));
        return services;
    }

    public com.acare.backend.entity.Service getById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay dich vu voi id=" + id));
    }

    public ApiResponse<com.acare.backend.entity.Service> addService(com.acare.backend.entity.Service request) {
        List<com.acare.backend.entity.Service> existed = serviceRepository.findByName(request.getName().trim());
        if (!existed.isEmpty()) {
            return ApiResponse.fail(409, "SERVICE ALREADY EXIST", request);
        }

        com.acare.backend.entity.Service created = serviceRepository.save(request);
        return ApiResponse.created("ADD SERVICE SUCCESSFULLY", created);
    }

    public ApiResponse<com.acare.backend.entity.Service> updateService(Long id, com.acare.backend.entity.Service update) {
        com.acare.backend.entity.Service service = getById(id);
        if (update.getName() != null) service.setName(update.getName());
        if (update.getDescription() != null) service.setDescription(update.getDescription());
        if (update.getPrice() != null) service.setPrice(update.getPrice());
        if (update.getDurationMin() != null) service.setDurationMin(update.getDurationMin());
        if (update.getActive() != null) service.setActive(update.getActive());

        com.acare.backend.entity.Service updated = serviceRepository.save(service);
        return ApiResponse.ok("UPDATE SERVICE SUCCESSFULLY", updated);
    }

    public ApiResponse<com.acare.backend.entity.Service> deleteService(Long id) {
        com.acare.backend.entity.Service service = getById(id);
        serviceRepository.deleteById(id);
        return ApiResponse.ok("DELETE SERVICE SUCCESSFULLY", service);
    }

    public List<com.acare.backend.entity.Service> searchServices(String name, Double minPrice, Double maxPrice) {
        List<com.acare.backend.entity.Service> services = serviceRepository.findAll();

        if (name != null && !name.trim().isEmpty()) {
            services = services.stream()
                    .filter(service -> service.getName() != null && 
                            service.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            services = services.stream()
                    .filter(service -> service.getPrice() != null && service.getPrice() >= minPrice)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            services = services.stream()
                    .filter(service -> service.getPrice() != null && service.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        return services;
    }
}
