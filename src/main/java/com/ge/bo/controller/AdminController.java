package com.ge.bo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ge.bo.dto.AdminDto;
import com.ge.bo.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admins")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminDto.Response>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping
    public ResponseEntity<AdminDto.Response> createAdmin(@Valid @RequestBody AdminDto.CreateRequest request) {
        return ResponseEntity.ok(adminService.createAdmin(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AdminDto.Response> updateAdmin(@PathVariable Long id,
            @Valid @RequestBody AdminDto.UpdateRequest request) {
        return ResponseEntity.ok(adminService.updateAdmin(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminDto.Response> toggleStatus(@PathVariable Long id,
            @RequestBody AdminDto.UpdateRequest request) {
        return ResponseEntity.ok(adminService.toggleStatus(id, request.isActive()));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<AdminDto.Response> resetPassword(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.resetPassword(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
