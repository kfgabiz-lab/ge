package com.ge.bo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
  private String email;
  private String password;
  /** reCAPTCHA v2 검증 토큰 (FE에서 전달) */
  private String recaptchaToken;
}
