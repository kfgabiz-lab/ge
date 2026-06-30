package com.ge.bo.dto;

import com.ge.bo.entity.ErrorLog;

import java.time.OffsetDateTime;

/**
 * 오류로그 상세 응답 DTO — stackTrace 포함
 */
public record ErrorLogDetailResponse(
        Long id,
        String errorCode,
        Integer httpStatus,
        String method,
        String requestUrl,
        String message,
        String stackTrace,
        String clientIp,
        String loginUser,
        OffsetDateTime createdAt) {

    public static ErrorLogDetailResponse from(ErrorLog e) {
        return new ErrorLogDetailResponse(
                e.getId(),
                e.getErrorCode(),
                e.getHttpStatus(),
                e.getMethod(),
                e.getRequestUrl(),
                e.getMessage(),
                e.getStackTrace(),
                e.getClientIp(),
                e.getLoginUser(),
                e.getCreatedAt());
    }
}
