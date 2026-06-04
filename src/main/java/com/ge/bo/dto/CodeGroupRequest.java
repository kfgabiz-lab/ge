package com.ge.bo.dto;

import jakarta.validation.constraints.*;

public record CodeGroupRequest(
    @NotBlank(message = "그룹코드를 입력해주세요.")
    @Size(max = 30) @Pattern(regexp = "^[A-Z0-9_]+$", message = "영문 대문자, 숫자, _만 사용 가능합니다.")
    String groupCode,

    /* msgKey가 있으면 BE에서 ko 텍스트를 채우므로 nullable */
    @Size(max = 50, message = "그룹명은 50자 이하로 입력해주세요.")
    String groupName,

    /* 다국어 키 (선택) — message_resource.key */
    @Size(max = 255)
    String groupNameMsgKey,

    @Size(max = 200) String description,

    Boolean active
) {}
