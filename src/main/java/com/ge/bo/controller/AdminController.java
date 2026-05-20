package com.ge.bo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ge.bo.dto.AdminDto;
import com.ge.bo.dto.SiteDto;
import com.ge.bo.service.AdminService;
import com.ge.bo.service.SiteService;

import java.util.List;

import com.ge.bo.annotation.ApiLinkedEntity;

@RestController
@RequestMapping("/api/v1/admins")
@RequiredArgsConstructor
@ApiLinkedEntity("AdminUser")
public class AdminController {

    private final AdminService adminService;
    private final SiteService siteService;

    @GetMapping
    public ResponseEntity<List<AdminDto.Response>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminDto.Response> getAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
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

    /* 관리자별 홈페이지 매핑 조회 */
    @GetMapping("/{id}/sites")
    public ResponseEntity<List<SiteDto.Response>> getAdminSites(@PathVariable Long id) {
        return ResponseEntity.ok(siteService.getSitesByAdminUser(id));
    }

    /* 관리자 홈페이지 매핑 일괄 변경 */
    @PutMapping("/{id}/sites")
    public ResponseEntity<List<SiteDto.Response>> updateAdminSites(@PathVariable Long id,
            @Valid @RequestBody SiteDto.SiteMappingRequest request) {
        return ResponseEntity.ok(siteService.updateAdminUserSites(id, request));
    }
}
