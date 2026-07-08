package com.ge.bo.repository;

import com.ge.bo.entity.ValidationRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 검증 규칙 Repository
 */
public interface ValidationRuleRepository extends JpaRepository<ValidationRule, Long> {

    /** 특정 slug 레지스트리에 속한 규칙 전체 (규칙생성 팝업 + 버튼필드 다중선택 조회용) */
  List<ValidationRule> findAllBySlugRegistryIdOrderByIdAsc(Long slugRegistryId);
}
