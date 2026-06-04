package com.ge.bo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** TOTP 2차 인증 관련 요청/응답 DTO */
public class TotpDto {

  /** TOTP 설정 요청 (QR 코드 발급) */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SetupRequest {
    /** 1단계 로그인 성공 후 발급된 임시 토큰 */
    private String tempToken;
  }

  /** TOTP 설정 응답 (QR 코드 URL + 비밀키) */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SetupResponse {
    /** otpauth:// URI (FE에서 QR 코드 렌더링) */
    private String qrCodeUrl;
    /** Base32 비밀키 (수동 입력용) */
    private String secret;
  }

  /** TOTP 등록 확인 요청 (최초 등록 시 앱 코드 검증) */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class ConfirmRequest {
    /** 1단계 로그인 성공 후 발급된 임시 토큰 */
    private String tempToken;
    /** Authenticator 앱에서 표시된 6자리 코드 */
    private String totpCode;
  }

  /** TOTP 검증 요청 (기존 등록 계정 로그인) */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class VerifyRequest {
    /** 1단계 로그인 성공 후 발급된 임시 토큰 */
    private String tempToken;
    /** Authenticator 앱 6자리 코드 */
    private String totpCode;
  }

  /** TOTP 검증 성공 응답 (JWT 발급) */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class VerifyResponse {
    private String accessToken;
    private Long expiresIn;
    private LoginResponse.AdminInfo adminInfo;
  }
}
