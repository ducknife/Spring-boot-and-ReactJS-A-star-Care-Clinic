package com.acare.backend.controller;

import com.acare.backend.dto.ApiResponse;
import com.acare.backend.entity.Service;
import com.acare.backend.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping /* tạo đường dẫn, phương thức GET */
    public ResponseEntity<List<Service>> getService() {
        List<Service> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Service>> addService(@RequestBody Service addedService) {
        return ResponseEntity.ok(serviceService.addService(addedService));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getService(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Service>> updateService(@PathVariable Long id, @RequestBody Service update) {
        return ResponseEntity.ok(serviceService.updateService(id, update));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Service>> updateService(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.deleteService(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchService(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        List<Service> services = serviceService.searchServices(name, minPrice, maxPrice);
        services.sort(Comparator.comparing((Service s) -> s.getPrice()).reversed());
        return ResponseEntity.ok(services);
    }
}
