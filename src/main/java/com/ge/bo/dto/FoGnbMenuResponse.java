package com.ge.bo.dto;

import com.ge.bo.entity.Menu;

import java.util.List;

/**
 * FO GNB 메뉴 응답 DTO — 비로그인 공개 API용 경량 응답
 * 사용법: FoGnbMenuResponse.from(menu) — visible=true 자식만 포함
 */
public record FoGnbMenuResponse(
        Long id,
        String name,
        String nameMsgKey,
        String url,
        String icon,
        Integer sortOrder,
        List<FoGnbMenuResponse> children
) {

    /** Menu 엔티티 → DTO 변환 (자식 visible=true 필터링 포함) */
    public static FoGnbMenuResponse from(Menu menu) {
        List<FoGnbMenuResponse> childResponses = menu.getChildren().stream()
                .filter(c -> Boolean.TRUE.equals(c.getVisible()))
                .map(FoGnbMenuResponse::from)
                .toList();

        return new FoGnbMenuResponse(
                menu.getId(),
                menu.getName(),
                menu.getNameMsgKey(),
                menu.getUrl(),
                menu.getIcon(),
                menu.getSortOrder(),
                childResponses
        );
    }
}
