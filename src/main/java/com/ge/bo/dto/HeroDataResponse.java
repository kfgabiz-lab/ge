package com.ge.bo.dto;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Response DTO — 히어로
 * 생성일시: 2026-07-11T14:24:12.513193200+09:00
 * 원본 Slug Entity: id=5, tableName=hero_banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import com.ge.bo.entity.HeroData;
import java.time.OffsetDateTime;

/**
 * 히어로 응답 DTO
 */
public record HeroDataResponse(
    Long id,
    String title,
    OffsetDateTime postDate,
    String titleText,
    String sub,
    String btnText,
    String btnUrl,
    String orderNo,
    String content,
    String defaultVal,
    String createdBy,
    OffsetDateTime createdAt,
    String updatedBy,
    OffsetDateTime updatedAt) {

  public static HeroDataResponse from(HeroData e) {
    return new HeroDataResponse(
        e.getId(),
        e.getTitle(),
        e.getPostDate(),
        e.getTitleText(),
        e.getSub(),
        e.getBtnText(),
        e.getBtnUrl(),
        e.getOrderNo(),
        e.getContent(),
        e.getDefaultVal(),
        e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt());
  }
}
