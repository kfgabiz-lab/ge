package com.ge.bo.dto;

/**
 * API 동기화 결과 응답 DTO
 * - addedCount : 새로 추가된 API 수
 * - skippedCount : 이미 존재하여 건너뛴 API 수
 */
public record ApiInfoSyncResponse(int addedCount, int skippedCount) {
}
