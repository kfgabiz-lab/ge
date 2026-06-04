package com.ge.bo.common.client;

import lombok.Getter;

/**
 * 외부 API 응답 래퍼
 * 사용법: result.isSuccess() → true면 result.getData() 사용
 *        result.isSuccess() → false면 result.getErrorMessage() 확인
 *
 * @param <T> 응답 바디 타입
 */
@Getter
public class ApiCallResult<T> {

    private final boolean success;
    private final int statusCode;
    private final T data;
    private final String errorMessage;

    private ApiCallResult(boolean success, int statusCode, T data, String errorMessage) {
        this.success      = success;
        this.statusCode   = statusCode;
        this.data         = data;
        this.errorMessage = errorMessage;
    }

    /** 성공 응답 생성 */
    public static <T> ApiCallResult<T> success(int statusCode, T data) {
        return new ApiCallResult<>(true, statusCode, data, null);
    }

    /** 실패 응답 생성 */
    public static <T> ApiCallResult<T> failure(int statusCode, String errorMessage) {
        return new ApiCallResult<>(false, statusCode, null, errorMessage);
    }
}
