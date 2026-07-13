package com.ge.bo.dto;

/**
 * Slug Entity 기반 Java 코드 자동생성 — 미리보기 응답 DTO
 * - 이 단계에서는 파일시스템에 아무것도 쓰지 않고, 생성될 코드 문자열만 반환한다.
 * - 저장(generate-save) 요청 시 이 응답값을 FE가 그대로 재전송해야 한다. (서버가 재생성하지 않음)
 */
public record SlugEntityCodePreviewResponse(
    Long slugEntityId,
    String slug,
    String tableName,
    String className,

    String entityFileName,
    String entityCode,

    String requestFileName,
    String requestCode,

    String responseFileName,
    String responseCode,

    String repositoryFileName,
    String repositoryCode,

    String serviceFileName,
    String serviceCode,

    String controllerFileName,
    String controllerCode,

    /** 참고용 CREATE TABLE DDL 문자열 — 실제로 실행되지 않는다. */
    String ddl
) {}
