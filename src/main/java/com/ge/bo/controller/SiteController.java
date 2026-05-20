package com.ge.bo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ge.bo.dto.SiteDto;
import com.ge.bo.service.SiteService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;

    /* 홈페이지 목록 조회 */
    @GetMapping
    public ResponseEntity<List<SiteDto.Response>> getAllSites(
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(siteService.getAllSites(isActive));
    }

    /* 홈페이지 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<SiteDto.Response> getSiteById(@PathVariable Long id) {
        return ResponseEntity.ok(siteService.getSiteById(id));
    }

    /* 홈페이지 등록 */
    @PostMapping
    public ResponseEntity<SiteDto.Response> createSite(@Valid @RequestBody SiteDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(siteService.createSite(request));
    }

    /* 홈페이지 수정 */
    @PatchMapping("/{id}")
    public ResponseEntity<SiteDto.Response> updateSite(@PathVariable Long id,
            @Valid @RequestBody SiteDto.UpdateRequest request) {
        return ResponseEntity.ok(siteService.updateSite(id, request));
    }

    /* 홈페이지 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
        siteService.deleteSite(id);
        return ResponseEntity.noContent().build();
    }
}
