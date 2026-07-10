package com.ge.bo.controller;

import com.ge.bo.dto.FoCodeResponse;
import com.ge.bo.service.CodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * FO 공개 코드 API — 비로그인 전체 허용 (/api/v1/fo/**)
 * - 관리자용 CodeService.getFoCodes()를 그대로 재사용하는 얇은 래퍼 (FO 공개 조회 전용)
 * - FO에서 코드값(예: 001)을 라벨(예: 뉴스레터)로 변환할 때 사용
 */
@RestController
@RequestMapping("/api/v1/fo/codes")
@RequiredArgsConstructor
public class FoCodeController {

    private final CodeService codeService;

    /**
     * 그룹 코드별 활성 코드 목록 조회
     * GET /api/v1/fo/codes/{groupCode}
     * 응답: [{code, name}] — 활성(is_active=true) 코드만 sortOrder 오름차순
     */
    @GetMapping("/{groupCode}")
    public ResponseEntity<List<FoCodeResponse>> getCodes(@PathVariable String groupCode) {
        return ResponseEntity.ok(codeService.getFoCodes(groupCode));
    }
}
