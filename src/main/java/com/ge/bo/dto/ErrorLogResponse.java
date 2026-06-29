package com.ge.bo.dto;

import com.ge.bo.entity.ErrorLog;

import java.time.OffsetDateTime;

/**
 * 오류로그 목록 응답 DTO — stackTrace 제외 (대용량 TEXT 컬럼)
 */
public record ErrorLogResponse(
        Long id,
        String errorCode,
        Integer httpStatus,
        String method,
        String requestUrl,
        String message,
        String clientIp,
        String loginUser,
        OffsetDateTime createdAt) {

    public static ErrorLogResponse from(ErrorLog e) {
        return new ErrorLogResponse(
                e.getId(),
                e.getErrorCode(),
                e.getHttpStatus(),
                e.getMethod(),
                e.getRequestUrl(),
                e.getMessage(),
                e.getClientIp(),
                e.getLoginUser(),
                e.getCreatedAt());
    }
}
