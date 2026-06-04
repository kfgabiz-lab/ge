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

  /**
   * 홈페이지 목록 조회 (isActive 파라미터로 활성화 여부 필터링 가능)
   *
   * @param isActive 활성화 여부 필터 (null이면 전체 조회)
   * @return 홈페이지 응답 DTO 목록
   */
  @GetMapping
  public ResponseEntity<List<SiteDto.Response>> getAllSites(
      @RequestParam(required = false) Boolean isActive) {
    return ResponseEntity.ok(siteService.getAllSites(isActive));
  }

  /**
   * 홈페이지 단건 조회
   *
   * @param id 홈페이지 PK
   * @return 홈페이지 응답 DTO
   */
  @GetMapping("/{id}")
  public ResponseEntity<SiteDto.Response> getSiteById(@PathVariable Long id) {
    return ResponseEntity.ok(siteService.getSiteById(id));
  }

  /**
   * 홈페이지 신규 등록
   *
   * @param request 홈페이지 생성 요청 DTO
   * @return 201 Created 및 등록된 홈페이지 응답 DTO
   */
  @PostMapping
  public ResponseEntity<SiteDto.Response> createSite(
      @Valid @RequestBody SiteDto.CreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(siteService.createSite(request));
  }

  /**
   * 홈페이지 정보 수정
   *
   * @param id 홈페이지 PK
   * @param request 수정 요청 DTO
   * @return 수정된 홈페이지 응답 DTO
   */
  @PatchMapping("/{id}")
  public ResponseEntity<SiteDto.Response> updateSite(
      @PathVariable Long id,
      @Valid @RequestBody SiteDto.UpdateRequest request) {
    return ResponseEntity.ok(siteService.updateSite(id, request));
  }

  /**
   * 홈페이지 삭제
   *
   * @param id 홈페이지 PK
   * @return 204 No Content
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
    siteService.deleteSite(id);
    return ResponseEntity.noContent().build();
  }
}
