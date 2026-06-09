package com.ge.bo.controller;

import com.ge.bo.annotation.ApiLinkedEntity;
import com.ge.bo.dto.SlugEntityFieldRequest;
import com.ge.bo.dto.SlugEntityRequest;
import com.ge.bo.dto.SlugEntityResponse;
import com.ge.bo.service.SlugEntityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Slug Entity REST API
 */
@RestController
@RequestMapping("/api/v1/slug-entity")
@RequiredArgsConstructor
@ApiLinkedEntity("SlugEntity")
public class SlugEntityController {

    private final SlugEntityService slugEntityService;

    /** 목록 조회 (keyword 필터 + 페이징, 관리자 전용) */
    @GetMapping
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<Page<SlugEntityResponse>> getList(
        @RequestParam(required = false) String keyword,
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(slugEntityService.getList(keyword, pageable));
    }

    /** 활성 entity 전체 목록 (빌더 드롭다운용, 인증 사용자 접근 가능) */
    @GetMapping("/active")
    public ResponseEntity<List<SlugEntityResponse>> getActiveList() {
        return ResponseEntity.ok(slugEntityService.getActiveList());
    }

    /** 단건 조회 (필드 포함) */
    @GetMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<SlugEntityResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(slugEntityService.getOne(id));
    }

    /** 등록 */
    @PostMapping
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<SlugEntityResponse> create(@Valid @RequestBody SlugEntityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(slugEntityService.create(request));
    }

    /** 수정 (slug는 서비스에서 변경 무시) */
    @PutMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<SlugEntityResponse> update(
        @PathVariable Long id,
        @Valid @RequestBody SlugEntityRequest request) {
        return ResponseEntity.ok(slugEntityService.update(id, request));
    }

    /** 삭제 (하위 필드 CASCADE) */
    @DeleteMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        slugEntityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** 필드 목록 일괄 저장 */
    @PutMapping("/{id}/fields")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<SlugEntityResponse> saveFields(
        @PathVariable Long id,
        @Valid @RequestBody List<@Valid SlugEntityFieldRequest> fieldRequests) {
        return ResponseEntity.ok(slugEntityService.saveFields(id, fieldRequests));
    }
}
