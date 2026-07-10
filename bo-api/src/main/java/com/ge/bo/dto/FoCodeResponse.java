package com.ge.bo.dto;

import com.ge.bo.entity.CodeDetail;

/**
 * FO 공개 코드 응답 DTO — 비로그인 공개 API용 경량 응답
 * 관리자용 CodeDetailResponse와 달리 관리 메타(id/sortOrder/active/extra 등)를 제외하고
 * FO에서 코드→라벨 변환에 필요한 code, name만 노출한다 (최소 노출 원칙).
 * 사용법: FoCodeResponse.from(codeDetail)
 */
public record FoCodeResponse(
        String code,
        String name
) {
    public static FoCodeResponse from(CodeDetail d) {
        return new FoCodeResponse(d.getCode(), d.getName());
    }
}
