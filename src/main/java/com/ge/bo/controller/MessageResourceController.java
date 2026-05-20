package com.ge.bo.controller;

import com.ge.bo.dto.MessageResourceDto;
import com.ge.bo.service.MessageResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/message-resources")
@RequiredArgsConstructor
public class MessageResourceController {

    private final MessageResourceService messageResourceService;

    /**
     * 목록 조회 (검색 + 페이징)
     * - key, ko, en: 부분 일치 검색 (빈 값이면 조건 무시)
     * - active: "전체"/"사용"/"미사용" (빈 값이면 전체 조회)
     */
    @GetMapping
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<MessageResourceDto.PageResponse> getList(
            @RequestParam(defaultValue = "")    String key,
            @RequestParam(defaultValue = "")    String ko,
            @RequestParam(defaultValue = "")    String en,
            @RequestParam(defaultValue = "")    String active,
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "20")  int size) {
        return ResponseEntity.ok(messageResourceService.getList(key, ko, en, active, page, size));
    }

    /**
     * 등록
     */
    @PostMapping
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<MessageResourceDto.Response> create(
            @Valid @RequestBody MessageResourceDto.CreateRequest request) {
        return ResponseEntity.ok(messageResourceService.create(request));
    }

    /**
     * 수정 — key 변경 불가
     */
    @PutMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<MessageResourceDto.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody MessageResourceDto.UpdateRequest request) {
        return ResponseEntity.ok(messageResourceService.update(id, request));
    }

    /**
     * 삭제
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@securityService.isSystemAdmin(authentication)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        messageResourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
