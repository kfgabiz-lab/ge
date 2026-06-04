package com.ge.bo.logging;

import ch.qos.logback.classic.pattern.MessageConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.regex.Pattern;

/**
 * 로그 메시지에서 비밀번호·인증 정보를 자동 마스킹하는 Logback 컨버터
 * logback-spring.xml의 conversionRule에 등록 후 패턴에서 %maskedMsg 로 사용
 *
 * 마스킹 대상: password, passwordHash, passwd, pwd, credentials, secret
 * 마스킹 형태: key=value → key=****
 */
public class MaskingConverter extends MessageConverter {

  /** 비밀번호/인증 정보 필드 패턴 (JSON "key":"val", 파라미터 key=val 양쪽 대응) */
  private static final Pattern SENSITIVE_PATTERN = Pattern.compile(
      "(?i)(password|passwordHash|passwd|pwd|credentials|secret)"
          + "(\\s*[=:\"]+\\s*[\"']?)([^\"',&\\s}\\]]+)",
      Pattern.CASE_INSENSITIVE);

  private static final String MASK = "$1$2****";

  @Override
  public String convert(ILoggingEvent event) {
    String message = super.convert(event);
    if (message == null) {
      return null;
    }
    return SENSITIVE_PATTERN.matcher(message).replaceAll(MASK);
  }
}
