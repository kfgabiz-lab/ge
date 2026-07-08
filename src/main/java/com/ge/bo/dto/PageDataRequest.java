package com.ge.bo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * 페이지 데이터 등록/수정 요청 DTO
 * dataJson: 폼 필드 키:값 쌍 (ex: { "name": "홍길동", "status": "active" })
 * pkKeys:   PK로 지정된 필드 키 목록 — 중복 방지 체크에 사용 (null이면 체크 생략)
 */
@Getter
@NoArgsConstructor
public class PageDataRequest {

  @NotNull(message = "데이터를 입력해주세요.")
    @NotEmpty(message = "최소 1개 이상의 필드를 입력해주세요.")
    private Map<String, Object> dataJson;

    /** PK 필드 키 목록 — FE 폼 빌더에서 isPk=true로 설정된 fieldKey 목록 */
  private List<String> pkKeys;

    /** 검증 규칙 id 목록 — 저장을 트리거한 action-button에서 다중선택된 규칙만 전달 */
  private List<Long> validationRuleIds;

    /** 다중 slug 저장 그룹 식별자 — FE에서 UUID 생성 후 같은 그룹의 모든 slug에 동일값 전달 */
  private String groupId;

    /** 페이지 식별 slug — 저장 전용 (조회에 미사용, 어느 페이지에서 생성된 데이터인지 추적) */
  private String templateSlug;
}
