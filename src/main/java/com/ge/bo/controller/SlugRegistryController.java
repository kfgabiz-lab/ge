package com.ge.bo.controller;

import com.ge.bo.annotation.ApiLinkedEntity;

import com.ge.bo.dto.SlugRegistryRequest;
import com.ge.bo.dto.SlugRegistryResponse;
import com.ge.bo.service.SlugRegistryService;
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
 * Slug 레지스트리 REST API
 */
@RestController
@RequestMapping("/api/v1/slug-registry")
@RequiredArgsConstructor
@ApiLinkedEntity("SlugRegistry")
public class SlugRegistryController {

    private final SlugRegistryService slugRegistryService;

    /** 목록 조회 (type/keyword 필터 + 페이징, 관리자 전용) */
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<SlugRegistryResponse>> getList(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "slug", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(slugRegistryService.getList(type, keyword, pageable));
    }

    /** 활성 slug 전체 목록 (프론트 빌더 셀렉트다운용, 인증 사용자 접근 가능) */
    @GetMapping("/active")
    public ResponseEntity<List<SlugRegistryResponse>> getActiveList() {
        return ResponseEntity.ok(slugRegistryService.getActiveList());
    }

    /** 단건 조회 */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SlugRegistryResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(slugRegistryService.getOne(id));
    }

    /** 등록 */
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SlugRegistryResponse> create(@Valid @RequestBody SlugRegistryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(slugRegistryService.create(request));
    }

    /** 수정 (slug는 서비스에서 변경 무시) */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SlugRegistryResponse> update(@PathVariable Long id,
            @Valid @RequestBody SlugRegistryRequest request) {
        return ResponseEntity.ok(slugRegistryService.update(id, request));
    }

    /** 삭제 */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        slugRegistryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
