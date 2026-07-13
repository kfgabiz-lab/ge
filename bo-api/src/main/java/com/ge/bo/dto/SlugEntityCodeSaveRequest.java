package com.ge.bo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Slug Entity 기반 Java 코드 자동생성 — 저장 요청 DTO
 * - 미리보기(generate-preview) 응답값을 그대로 재전송해야 한다. (서버는 코드를 다시 생성하지 않음)
 * - 파일명은 서버에서 className 기준으로 다시 한 번 검증하며, 일치하지 않으면 저장이 차단된다.
 */
public record SlugEntityCodeSaveRequest(

    @NotBlank(message = "className을 입력해주세요.")
    @Pattern(regexp = "^[A-Z][A-Za-z0-9]*$", message = "className은 PascalCase 형식이어야 합니다.")
    String className,

    @NotBlank(message = "entityFileName을 입력해주세요.") String entityFileName,
    @NotBlank(message = "entityCode를 입력해주세요.") String entityCode,

    @NotBlank(message = "requestFileName을 입력해주세요.") String requestFileName,
    @NotBlank(message = "requestCode를 입력해주세요.") String requestCode,

    @NotBlank(message = "responseFileName을 입력해주세요.") String responseFileName,
    @NotBlank(message = "responseCode를 입력해주세요.") String responseCode,

    @NotBlank(message = "repositoryFileName을 입력해주세요.") String repositoryFileName,
    @NotBlank(message = "repositoryCode를 입력해주세요.") String repositoryCode,

    @NotBlank(message = "serviceFileName을 입력해주세요.") String serviceFileName,
    @NotBlank(message = "serviceCode를 입력해주세요.") String serviceCode,

    @NotBlank(message = "controllerFileName을 입력해주세요.") String controllerFileName,
    @NotBlank(message = "controllerCode를 입력해주세요.") String controllerCode
) {}
