package com.ge.bo.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 전역 예외 처리 핸들러 - 모든 API 에러를 일관된 형식으로 응답
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * JSON 파싱 실패 등 HttpMessageNotReadableException 예외 처리 (400 Bad Request)
     */
    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadableException(
            org.springframework.http.converter.HttpMessageNotReadableException ex) {
        log.error("JSON 파싱 에러 (잘못된 요청 데이터): ", ex);

        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("error", "MALFORMED_JSON");
        body.put("message", "요청 데이터 형식이 올바르지 않습니다.");
        body.put("detail", ex.getMessage());
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.badRequest().body(body);
    }

    /**
     * 입력값 유효성 검증 실패 (예: @NotBlank, @Size 위반)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("error", "VALIDATION_FAILED");
        body.put("message", "입력값 유효성 검증에 실패했습니다.");
        body.put("fieldErrors", fieldErrors);
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.badRequest().body(body);
    }

    /**
     * 커스텀 비즈니스 예외
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException ex) {
        log.error("비즈니스 예외 발생: {}", ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("status", ex.getStatus().value());
        body.put("error", ex.getErrorCode());
        body.put("message", ex.getMessage());
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(ex.getStatus()).body(body);
    }

    /**
     * 권한 없음 (403 Forbidden)
     */
    @ExceptionHandler({ org.springframework.security.access.AccessDeniedException.class,
            org.springframework.security.authorization.AuthorizationDeniedException.class })
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(Exception ex) {
        log.warn("권한 거부됨: {}", ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("status", 403);
        body.put("error", "FORBIDDEN");
        body.put("message", "이 리소스에 접근할 권한이 없습니다.");
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    /**
     * DB 제약조건 위반 (UNIQUE 등)
     */
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException ex) {
        log.error("데이터 무결성 위반: {}", ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("status", 409);
        body.put("error", "DATA_INTEGRITY");
        body.put("message", "데이터 무결성 제약조건 위반이 발생했습니다.");
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    /**
     * 그 외 예상치 못한 서버 에러
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        log.error("서버 내부 오류 발생: ", ex);

        Map<String, Object> body = new HashMap<>();
        body.put("status", 500);
        body.put("error", "INTERNAL_SERVER_ERROR");
        body.put("message", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        body.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
