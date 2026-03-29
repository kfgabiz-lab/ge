package com.ge.bo.dto;

/**
 * 엔티티 목록 응답 DTO
 * - entityName : JPA 엔티티 클래스명
 * - tableName  : 매핑된 DB 테이블명
 * - fieldCount : 기본(BASIC) 필드 수
 */
public record EntityInfoResponse(
        String entityName,
        String tableName,
        int fieldCount
) {}
