package com.ge.bo.dto;

/**
 * 엔티티 필드 상세 응답 DTO
 * - fieldName  : Java 필드명 (camelCase)
 * - columnName : 매핑된 DB 컬럼명 (snake_case)
 * - javaType   : Java 타입 단순명 (String, Long, LocalDateTime 등)
 * - isId       : PK 여부 (@Id)
 * - isNullable : null 허용 여부
 */
public record FieldInfoResponse(
        String fieldName,
        String columnName,
        String javaType,
        boolean isId,
        boolean isNullable
) {}
