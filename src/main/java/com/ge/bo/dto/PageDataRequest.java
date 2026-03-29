package com.ge.bo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 페이지 데이터 등록/수정 요청 DTO
 * dataJson: 폼 필드 키:값 쌍 (ex: { "name": "홍길동", "status": "active" })
 */
@Getter
@NoArgsConstructor
public class PageDataRequest {

    @NotNull(message = "데이터를 입력해주세요.")
    @NotEmpty(message = "최소 1개 이상의 필드를 입력해주세요.")
    private Map<String, Object> dataJson;
}
