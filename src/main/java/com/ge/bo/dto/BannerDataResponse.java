package com.ge.bo.dto;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Response DTO — 배너
 * 생성일시: 2026-07-11T14:32:07.519609300+09:00
 * 원본 Slug Entity: id=1, tableName=banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import com.ge.bo.entity.BannerData;
import java.time.OffsetDateTime;

/**
 * 배너 응답 DTO
 */
public record BannerDataResponse(
    Long id,
    String banner_position,
    String title,
    OffsetDateTime post_date,
    String prefix,
    String main_title,
    String bottom_text,
    String sub_title,
    String url,
    String image,
    Integer sort_order,
    String is_visible,
    String info_sort,
    String createdBy,
    OffsetDateTime createdAt,
    String updatedBy,
    OffsetDateTime updatedAt) {

  public static BannerDataResponse from(BannerData e) {
    return new BannerDataResponse(
        e.getId(),
        e.getBanner_position(),
        e.getTitle(),
        e.getPost_date(),
        e.getPrefix(),
        e.getMain_title(),
        e.getBottom_text(),
        e.getSub_title(),
        e.getUrl(),
        e.getImage(),
        e.getSort_order(),
        e.getIs_visible(),
        e.getInfo_sort(),
        e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt());
  }
}
