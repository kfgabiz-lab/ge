package com.ge.bo.dto;

import jakarta.validation.constraints.*;

/**
 * 메뉴 생성/수정 요청 DTO
 * 메뉴명·설명은 다국어관리(message_resource)에서 key를 선택하여 전달한다.
 */
public record MenuRequest(

    /** 메뉴명 다국어 키 — message_resource.key (WORD 타입) */
    @NotBlank(message = "메뉴명 다국어 키를 선택해주세요.")
    String nameMsgKey,

    /** 메뉴 설명 다국어 키 — message_resource.key (WORD/SENTENCE 타입, 선택) */
    String descriptionMsgKey,

    @Size(max = 200, message = "URL은 200자 이하로 입력해주세요.")
    @Pattern(regexp = "^$|^/[a-zA-Z0-9\\-_/]*$",
             message = "URL은 /로 시작하는 경로를 입력해주세요.")
    String url,

    @Size(max = 30, message = "아이콘명은 30자 이하여야 합니다.")
    String icon,

    Long parentId,

    @NotBlank(message = "메뉴 구분을 선택해주세요.")
    @Pattern(regexp = "^(BO|FO)$", message = "메뉴 구분은 BO 또는 FO만 가능합니다.")
    String menuType,

    @NotNull(message = "정렬 순서를 입력해주세요.")
    @Min(value = 1, message = "정렬 순서는 1 이상이어야 합니다.")
    @Max(value = 999, message = "정렬 순서는 999 이하여야 합니다.")
    Integer sortOrder,

    Boolean visible
) {}
