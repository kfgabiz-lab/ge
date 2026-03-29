package com.ge.bo.dto;

/**
 * 컬럼 상세 응답 DTO
 * - columnName  : 컬럼명
 * - dataType    : 데이터 타입 (varchar, int8, timestamp 등)
 * - length      : 문자열 최대 길이 (숫자/날짜 타입은 null)
 * - isNullable  : NULL 허용 여부
 * - isPrimaryKey: PK 여부
 * - defaultValue: 기본값 (없으면 null)
 * - comment     : 컬럼 설명 (없으면 null)
 */
public record ColumnInfoResponse(
        String columnName,
        String dataType,
        Integer length,
        boolean isNullable,
        boolean isPrimaryKey,
        String defaultValue,
        String comment
) {}
