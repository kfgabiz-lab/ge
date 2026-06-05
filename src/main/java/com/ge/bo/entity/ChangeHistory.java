package com.ge.bo.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * 변경 이력 엔티티 — change_history 테이블 매핑
 * 이력성 테이블이므로 수정 없이 저장만 한다
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "change_history")
public class ChangeHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 변경 유형: CREATE / UPDATE / DELETE */
  @Column(nullable = false, length = 10)
  private String actionType;

  /** HTTP 메서드: POST / PUT / PATCH / DELETE */
  @Column(nullable = false, length = 10)
  private String method;

  /** 요청 URL (쿼리스트링 포함) */
  @Column(nullable = false, length = 500)
  private String requestUrl;

  /** 요청 바디 JSON (민감 정보 마스킹 후 저장) */
  @Column(columnDefinition = "TEXT")
  private String requestBody;

  /** 응답 HTTP 상태코드 */
  @Column(nullable = false)
  private Integer httpStatus;

  /** 로그인 사용자 이메일 (비로그인 시 NULL) */
  @Column(length = 100)
  private String loginUser;

  /** 클라이언트 IP (X-Forwarded-For 우선) */
  @Column(length = 50)
  private String clientIp;

  /** 요청 처리 시간(ms) */
  private Long durationMs;

  /** 발생일시 */
  @Column(nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Builder
  public ChangeHistory(String actionType, String method, String requestUrl,
      String requestBody, Integer httpStatus, String loginUser,
      String clientIp, Long durationMs) {
    this.actionType = actionType;
    this.method = method;
    this.requestUrl = requestUrl;
    this.requestBody = requestBody;
    this.httpStatus = httpStatus;
    this.loginUser = loginUser;
    this.clientIp = clientIp;
    this.durationMs = durationMs;
    this.createdAt = OffsetDateTime.now();
  }
}
