package com.ge.bo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 단일 필드 즉시 수정 요청 DTO
 * 테이블 inlineEdit 셀에서 특정 필드 값만 부분 업데이트할 때 사용
 */
@Getter
@NoArgsConstructor
public class FieldPatchRequest {

    /** 수정할 필드 경로 (dot notation 지원, 예: status / form1.status) */
    @NotBlank(message = "필드 키를 입력해주세요.")
    private String fieldKey;

    /** 저장할 값 (null 허용 — 값 제거 가능) */
    private Object value;
}
