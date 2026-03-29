package com.ge.bo.controller;

import com.ge.bo.dto.PageDataListResponse;
import com.ge.bo.dto.PageDataRequest;
import com.ge.bo.dto.PageDataResponse;
import com.ge.bo.service.PageDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 페이지 데이터 API 컨트롤러
 * 기준: /api/v1/page-data/{slug}
 * - slug: 페이지 메이커에서 설정한 템플릿 식별자 (ex: user-list)
 */
@RestController
@RequestMapping("/api/v1/page-data/{slug}")
@RequiredArgsConstructor
public class PageDataController {

    private final PageDataService pageDataService;

    /**
     * 목록 조회 — 페이지네이션 + 동적 JSONB 검색
     * Query Params: page(기본 0), size(기본 20), 그 외는 검색 조건
     */
    @GetMapping
    public ResponseEntity<PageDataListResponse> search(
            @PathVariable String slug,
            @RequestParam Map<String, String> allParams,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(pageDataService.search(slug, allParams, page, size));
    }

    /** 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<PageDataResponse> getById(
            @PathVariable String slug,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(pageDataService.getById(slug, id));
    }

    /** 등록 */
    @PostMapping
    public ResponseEntity<PageDataResponse> create(
            @PathVariable String slug,
            @Valid @RequestBody PageDataRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pageDataService.create(slug, request));
    }

    /** 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<PageDataResponse> update(
            @PathVariable String slug,
            @PathVariable Long id,
            @Valid @RequestBody PageDataRequest request
    ) {
        return ResponseEntity.ok(pageDataService.update(slug, id, request));
    }

    /** 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String slug,
            @PathVariable Long id
    ) {
        pageDataService.delete(slug, id);
        return ResponseEntity.noContent().build();
    }
}
