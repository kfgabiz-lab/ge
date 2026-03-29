package com.ge.bo.dto;

/**
 * 테이블 목록 응답 DTO
 * - tableName  : 테이블명
 * - comment    : 테이블 설명 (없으면 null)
 * - columnCount: 컬럼 수
 */
public record TableInfoResponse(
        String tableName,
        String comment,
        int columnCount
) {}
