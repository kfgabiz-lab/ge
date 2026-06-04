package com.ge.bo.controller;

import com.ge.bo.annotation.ApiLinkedEntity;
import com.ge.bo.dto.*;
import com.ge.bo.service.CodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 공통코드 관리 REST API
 */
@RestController
@RequestMapping("/api/v1/codes")
@RequiredArgsConstructor
@ApiLinkedEntity("CodeGroup")
public class CodeController {

  private final CodeService codeService;

  /**
   * 공통코드 그룹 전체 조회
   *
   * @return 코드 그룹 응답 DTO 목록
   */
  @GetMapping
  public ResponseEntity<List<CodeGroupResponse>> getAllGroups() {
    return ResponseEntity.ok(codeService.getAllGroups());
  }

  /**
   * 공통코드 그룹 단건 조회
   *
   * @param id 코드 그룹 PK
   * @return 코드 그룹 응답 DTO
   */
  @GetMapping("/{id}")
  public ResponseEntity<CodeGroupResponse> getGroup(@PathVariable Long id) {
    return ResponseEntity.ok(codeService.getGroup(id));
  }

  /**
   * 공통코드 그룹 신규 등록
   *
   * @param request 코드 그룹 생성 요청 DTO
   * @return 201 Created 및 등록된 코드 그룹 응답 DTO
   */
  @PostMapping
  public ResponseEntity<CodeGroupResponse> createGroup(
      @Valid @RequestBody CodeGroupRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(codeService.createGroup(request));
  }

  /**
   * 공통코드 그룹 수정
   *
   * @param id 코드 그룹 PK
   * @param request 수정 요청 DTO
   * @return 수정된 코드 그룹 응답 DTO
   */
  @PutMapping("/{id}")
  public ResponseEntity<CodeGroupResponse> updateGroup(
      @PathVariable Long id,
      @Valid @RequestBody CodeGroupRequest request) {
    return ResponseEntity.ok(codeService.updateGroup(id, request));
  }

  /**
   * 공통코드 그룹 삭제
   *
   * @param id 코드 그룹 PK
   * @return 204 No Content
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
    codeService.deleteGroup(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * 코드 상세 항목 추가
   *
   * @param groupId 코드 그룹 PK
   * @param request 코드 상세 생성 요청 DTO
   * @return 201 Created 및 등록된 코드 상세 응답 DTO
   */
  @PostMapping("/{groupId}/details")
  public ResponseEntity<CodeDetailResponse> createDetail(
      @PathVariable Long groupId,
      @Valid @RequestBody CodeDetailRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(codeService.createDetail(groupId, request));
  }

  /**
   * 코드 상세 항목 수정
   *
   * @param groupId 코드 그룹 PK
   * @param detailId 코드 상세 PK
   * @param request 수정 요청 DTO
   * @return 수정된 코드 상세 응답 DTO
   */
  @PutMapping("/{groupId}/details/{detailId}")
  public ResponseEntity<CodeDetailResponse> updateDetail(
      @PathVariable Long groupId,
      @PathVariable Long detailId,
      @Valid @RequestBody CodeDetailRequest request) {
    return ResponseEntity.ok(codeService.updateDetail(groupId, detailId, request));
  }

  /**
   * 코드 상세 항목 삭제
   *
   * @param groupId 코드 그룹 PK
   * @param detailId 코드 상세 PK
   * @return 204 No Content
   */
  @DeleteMapping("/{groupId}/details/{detailId}")
  public ResponseEntity<Void> deleteDetail(
      @PathVariable Long groupId,
      @PathVariable Long detailId) {
    codeService.deleteDetail(groupId, detailId);
    return ResponseEntity.noContent().build();
  }
}
