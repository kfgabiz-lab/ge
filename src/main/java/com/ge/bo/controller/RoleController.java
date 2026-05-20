package com.ge.bo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ge.bo.dto.RoleDto;
import com.ge.bo.service.RoleService;

import java.util.List;

import com.ge.bo.annotation.ApiLinkedEntity;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@ApiLinkedEntity("Role")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<List<RoleDto.Response>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    /** is_system=false 역할 목록 — 관리자 폼 권한 드롭다운용, 인증된 사용자 접근 가능 */
    @GetMapping("/assignable")
    public ResponseEntity<List<RoleDto.Response>> getAssignableRoles() {
        return ResponseEntity.ok(roleService.getAssignableRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<RoleDto.Response> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<RoleDto.Response> createRole(@Valid @RequestBody RoleDto.CreateRequest request) {
        return ResponseEntity.ok(roleService.createRole(request));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<RoleDto.Response> updateRole(@PathVariable Long id,
            @Valid @RequestBody RoleDto.UpdateRequest request) {
        return ResponseEntity.ok(roleService.updateRole(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
