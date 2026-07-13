package com.ge.bo.dto;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Request DTO — 히어로
 * 생성일시: 2026-07-11T14:24:12.513193200+09:00
 * 원본 Slug Entity: id=5, tableName=hero_banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;

/**
 * 히어로 등록/수정 요청 DTO
 */
public record HeroDataRequest(

    @NotBlank(message = "필수 입력 항목입니다: 타이틀")
    @Size(max = 100, message = "최대 100자까지 입력 가능합니다: 타이틀")
    String title,

    @NotNull(message = "필수 입력 항목입니다: 노출 기간")
    OffsetDateTime postDate,

    @NotBlank(message = "필수 입력 항목입니다: 타이틀 텍스트")
    @Size(max = 100, message = "최대 100자까지 입력 가능합니다: 타이틀 텍스트")
    String titleText,

    @Size(max = 100, message = "최대 100자까지 입력 가능합니다: 서브 타이틀")
    String sub,

    @Size(max = 20, message = "최대 20자까지 입력 가능합니다: 버튼 텍스트")
    String btnText,

    @Size(max = 255, message = "최대 255자까지 입력 가능합니다: 버튼 링크")
    String btnUrl,

    @Size(max = 2, message = "최대 2자까지 입력 가능합니다: 정렬 순서")
    String orderNo,

    @NotBlank(message = "필수 입력 항목입니다: 미디어 콘텐츠")
    String content,

    @Size(max = 10, message = "최대 10자까지 입력 가능합니다: 숨김 고정값")
    String defaultVal
) {}
