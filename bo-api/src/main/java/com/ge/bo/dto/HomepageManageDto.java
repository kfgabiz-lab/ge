package com.ge.bo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

public class HomepageManageDto {

  /** 설정 수정 요청 */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class UpdateRequest {

    @NotNull(message = "다국어 여부는 필수입니다.")
    private Boolean isMultilingual;
  }

  /** 설정 조회/수정 응답 */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class Response {
    private Boolean isMultilingual;
  }
}
