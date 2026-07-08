package com.ge.bo.service;

import com.ge.bo.dto.ValidationRuleRequest;
import com.ge.bo.dto.ValidationRuleResponse;
import com.ge.bo.entity.SlugRegistry;
import com.ge.bo.entity.ValidationRule;
import com.ge.bo.exception.ErrorCode;
import com.ge.bo.repository.SlugRegistryRepository;
import com.ge.bo.repository.ValidationRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 검증 규칙 CRUD 서비스
 * 저장 시점 실제 검증 로직(unique/maxCount 판정)은 PageDataService에서 수행한다.
 */
@Service
@RequiredArgsConstructor
public class ValidationRuleService {

  private final ValidationRuleRepository validationRuleRepository;
  private final SlugRegistryRepository slugRegistryRepository;

    /* ══════════ slug별 목록 조회 (규칙생성 팝업 + 버튼필드 다중선택용) ══════════ */

  @Transactional(readOnly = true)
    public List<ValidationRuleResponse> getListBySlugRegistry(Long slugRegistryId) {
    return validationRuleRepository.findAllBySlugRegistryIdOrderByIdAsc(slugRegistryId)
                .stream().map(ValidationRuleResponse::from).toList();
  }

    /* ══════════ 등록 ══════════ */

  @Transactional
    public ValidationRuleResponse create(ValidationRuleRequest request) {
    SlugRegistry slugRegistry = slugRegistryRepository.findById(request.slugRegistryId())
                .orElseThrow(ErrorCode.SLUG_REGISTRY_NOT_FOUND::toException);

    ValidationRule entity = ValidationRule.builder()
                .slugRegistry(slugRegistry)
                .type(request.type())
                .fields(trimOrNull(request.fields()))
                .condition(trimOrNull(request.condition()))
                .maxCount(request.maxCount())
                .build();

    return ValidationRuleResponse.from(validationRuleRepository.save(entity));
  }

    /* ══════════ 수정 ══════════ */

  @Transactional
    public ValidationRuleResponse update(Long id, ValidationRuleRequest request) {
    ValidationRule entity = findOrThrow(id);

    entity.setType(request.type());
    entity.setFields(trimOrNull(request.fields()));
    entity.setCondition(trimOrNull(request.condition()));
    entity.setMaxCount(request.maxCount());

    return ValidationRuleResponse.from(entity);
  }

    /* ══════════ 삭제 ══════════ */

  @Transactional
    public void delete(Long id) {
    validationRuleRepository.delete(findOrThrow(id));
  }

    /* ══════════ 헬퍼 ══════════ */

  private ValidationRule findOrThrow(Long id) {
    return validationRuleRepository.findById(id)
                .orElseThrow(ErrorCode.VALIDATION_RULE_NOT_FOUND::toException);
  }

  private String trimOrNull(String value) {
    return (value == null || value.trim().isEmpty()) ? null : value.trim();
  }
}
