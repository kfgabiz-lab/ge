package com.ge.bo.dto;

import jakarta.validation.constraints.*;

public record CodeGroupRequest(
    @NotBlank(message = "그룹코드를 입력해주세요.")
    @Size(max = 30) @Pattern(regexp = "^[A-Z0-9_]+$", message = "영문 대문자, 숫자, _만 사용 가능합니다.")
    String groupCode,

    @NotBlank(message = "그룹명을 입력해주세요.")
    @Size(max = 50, message = "그룹명은 50자 이하로 입력해주세요.")
    String groupName,

    @Size(max = 200) String description,

    Boolean active
) {}
