package com.ge.bo.dto;

import jakarta.validation.constraints.*;

/**
 * Slug 레지스트리 등록/수정 요청 DTO
 * - slug: 등록 시에만 사용 (수정 시 서비스에서 무시)
 */
public record SlugRegistryRequest(

    @NotBlank(message = "slug를 입력해주세요.")
    @Size(max = 100, message = "slug는 100자 이하로 입력해주세요.")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "slug는 영문/숫자/하이픈/언더스코어만 가능합니다.")
    String slug,

    @NotBlank(message = "slug 별칭을 입력해주세요.")
    @Size(max = 100, message = "slug 별칭은 100자 이하로 입력해주세요.")
    String name,

    @NotBlank(message = "타입을 선택해주세요.")
    @Pattern(regexp = "^(PAGE_DATA|PAGE_TEMPLATE|ETC)$", message = "올바른 타입을 선택해주세요.")
    String type,

    String description,

    Boolean active
) {}
