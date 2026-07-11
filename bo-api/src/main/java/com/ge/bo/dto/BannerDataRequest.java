package com.ge.bo.dto;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Request DTO — 배너
 * 생성일시: 2026-07-11T14:32:07.519609300+09:00
 * 원본 Slug Entity: id=1, tableName=banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;

/**
 * 배너 등록/수정 요청 DTO
 */
public record BannerDataRequest(

    @NotBlank(message = "필수 입력 항목입니다: 배너    위치")
    String banner_position,

    @NotBlank(message = "필수 입력 항목입니다: 제목")
    String title,

    @NotNull(message = "필수 입력 항목입니다: 게시기간")
    OffsetDateTime post_date,

    @NotBlank(message = "필수 입력 항목입니다: prefix")
    String prefix,

    @NotBlank(message = "필수 입력 항목입니다: 타이틀")
    String main_title,

    @NotBlank(message = "필수 입력 항목입니다: bottomText")
    String bottom_text,

    String sub_title,

    @NotBlank(message = "필수 입력 항목입니다: url")
    String url,

    @NotBlank(message = "필수 입력 항목입니다: 이미지")
    String image,

    @NotNull(message = "필수 입력 항목입니다: 정렬순서")
    Integer sort_order,

    @NotBlank(message = "필수 입력 항목입니다: 공개여부")
    String is_visible,

    String info_sort
) {}
