package com.ge.bo.controller;

import com.ge.bo.dto.*;
import com.ge.bo.service.CodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 공통코드 관리 REST API
 */
@RestController
@RequestMapping("/api/v1/codes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class CodeController {

    private final CodeService codeService;

    /* 그룹 전체 조회 */
    @GetMapping
    public ResponseEntity<List<CodeGroupResponse>> getAllGroups() {
        return ResponseEntity.ok(codeService.getAllGroups());
    }

    /* 그룹 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<CodeGroupResponse> getGroup(@PathVariable Long id) {
        return ResponseEntity.ok(codeService.getGroup(id));
    }

    /* 그룹 생성 */
    @PostMapping
    public ResponseEntity<CodeGroupResponse> createGroup(@Valid @RequestBody CodeGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(codeService.createGroup(request));
    }

    /* 그룹 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<CodeGroupResponse> updateGroup(@PathVariable Long id, @Valid @RequestBody CodeGroupRequest request) {
        return ResponseEntity.ok(codeService.updateGroup(id, request));
    }

    /* 그룹 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        codeService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    /* 코드 추가 */
    @PostMapping("/{groupId}/details")
    public ResponseEntity<CodeDetailResponse> createDetail(@PathVariable Long groupId, @Valid @RequestBody CodeDetailRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(codeService.createDetail(groupId, request));
    }

    /* 코드 수정 */
    @PutMapping("/{groupId}/details/{detailId}")
    public ResponseEntity<CodeDetailResponse> updateDetail(@PathVariable Long groupId, @PathVariable Long detailId, @Valid @RequestBody CodeDetailRequest request) {
        return ResponseEntity.ok(codeService.updateDetail(groupId, detailId, request));
    }

    /* 코드 삭제 */
    @DeleteMapping("/{groupId}/details/{detailId}")
    public ResponseEntity<Void> deleteDetail(@PathVariable Long groupId, @PathVariable Long detailId) {
        codeService.deleteDetail(groupId, detailId);
        return ResponseEntity.noContent().build();
    }
}
