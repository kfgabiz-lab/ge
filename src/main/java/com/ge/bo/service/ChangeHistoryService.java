package com.ge.bo.service;

import com.ge.bo.entity.ChangeHistory;
import com.ge.bo.repository.ChangeHistoryRepository;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

/**
 * 변경 이력 서비스
 * - @Async: 메인 응답과 분리하여 비동기로 DB에 저장
 *
 * 사용법:
 *   changeHistoryService.saveAsync(method, requestUrl, requestBody, httpStatus, clientIp, durationMs);
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChangeHistoryService {

  private final ChangeHistoryRepository changeHistoryRepository;

  /** 민감 정보 필드 마스킹 패턴 (password, passwordHash, passwd, pwd, secret, credentials) */
  private static final Pattern SENSITIVE_PATTERN = Pattern.compile(
      "(?i)(\"(?:password|passwordHash|passwd|pwd|secret|credentials)\"\\s*:\\s*\")([^\"]*)(\")",
      Pattern.CASE_INSENSITIVE);

  /**
   * 변경 이력 비동기 저장
   *
   * @param method      HTTP 메서드 (POST / PUT / PATCH / DELETE)
   * @param requestUrl  요청 URL
   * @param requestBody 요청 바디 원문
   * @param httpStatus  응답 상태코드
   * @param clientIp    클라이언트 IP
   * @param durationMs  처리 시간(ms)
   */
  @Async
  public void saveAsync(String method, String requestUrl, String requestBody,
      int httpStatus, String clientIp, long durationMs) {
    try {
      ChangeHistory history = ChangeHistory.builder()
          .actionType(resolveActionType(method))
          .method(method)
          .requestUrl(requestUrl)
          .requestBody(maskSensitiveFields(requestBody))
          .httpStatus(httpStatus)
          .loginUser(getCurrentUser())
          .clientIp(clientIp)
          .durationMs(durationMs)
          .build();

      changeHistoryRepository.save(history);
    } catch (Exception e) {
      // 이력 저장 실패가 메인 기능에 영향을 주지 않도록 예외를 삼킴
      log.warn("변경 이력 저장 실패: {}", e.getMessage());
    }
  }

  /** HTTP 메서드 → action_type 변환 */
  private String resolveActionType(String method) {
    return switch (method.toUpperCase()) {
      case "POST"          -> "CREATE";
      case "PUT", "PATCH"  -> "UPDATE";
      case "DELETE"        -> "DELETE";
      default              -> "UNKNOWN";
    };
  }

  /** 요청 바디에서 민감 필드값을 **** 로 치환 */
  private String maskSensitiveFields(String body) {
    if (StringUtils.isBlank(body)) {
      return body;
    }
    return SENSITIVE_PATTERN.matcher(body).replaceAll("$1****$3");
  }

  /** 현재 로그인 사용자 이메일 (비로그인 시 null) */
  private String getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return null;
    }
    return auth.getName();
  }
}
