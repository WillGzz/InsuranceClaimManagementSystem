package com.insurance.claims.controller;

import com.insurance.claims.service.ResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reset")
public class ResetController {

    private final ResetService resetService;

    public ResetController(ResetService resetService) {
        this.resetService = resetService;
    }

    @PostMapping
    public ResponseEntity<String> resetData() {
        resetService.reset();
        return ResponseEntity.ok("Seed data reset successfully.");
    }
}

