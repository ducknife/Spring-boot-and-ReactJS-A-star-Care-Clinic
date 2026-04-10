package com.acare.backend.controller;

import com.acare.backend.dto.ApiResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/error")
public class CustomErrorController implements ErrorController {
    @RequestMapping
    public ResponseEntity<ApiResponse<Object>> handleError() {
        return ResponseEntity.ok(
                ApiResponse.fail(404, "Not found", "Trang ban truy cap khong ton tai"));
    }
}
