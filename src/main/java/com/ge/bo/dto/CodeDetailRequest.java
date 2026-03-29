package com.ge.bo.dto;

import jakarta.validation.constraints.*;

public record CodeDetailRequest(
    @NotBlank(message = "코드값을 입력해주세요.")
    @Size(max = 30) @Pattern(regexp = "^[A-Z0-9_]+$", message = "영문 대문자, 숫자, _만 사용 가능합니다.")
    String code,

    @NotBlank(message = "코드명을 입력해주세요.")
    @Size(max = 50, message = "코드명은 50자 이하로 입력해주세요.")
    String name,

    @Size(max = 200) String description,

    @NotNull(message = "정렬순서를 입력해주세요.")
    @Min(value = 1, message = "정렬순서는 1 이상이어야 합니다.")
    @Max(value = 999, message = "정렬순서는 999 이하여야 합니다.")
    Integer sortOrder,

    Boolean active,

    /* 기타 항목 1~5 (선택값) */
    @Size(max = 100) String extra1,
    @Size(max = 100) String extra2,
    @Size(max = 100) String extra3,
    @Size(max = 100) String extra4,
    @Size(max = 100) String extra5
) {}
