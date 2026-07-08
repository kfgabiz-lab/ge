package com.ge.bo.dto;

import jakarta.validation.constraints.*;

/**
 * 검증 규칙 등록/수정 요청 DTO
 */
public record ValidationRuleRequest(

    @NotNull(message = "slug 레지스트리를 선택해주세요.")
    Long slugRegistryId,

    @NotBlank(message = "규칙 유형을 선택해주세요.")
    @Pattern(regexp = "^(unique|maxCount)$", message = "올바른 규칙 유형을 선택해주세요.")
    String type,

    /** unique 전용 — 콤마구분 필드목록 */
    String fields,

    /** unique/maxCount 공통 — 콤마구분 key=value 조건 (선택) */
    String condition,

    /** maxCount 전용 — 최대 등록 건수 */
    Integer maxCount
) {}
