package com.ge.bo.repository;

import com.ge.bo.entity.PageTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 페이지 템플릿 레포지토리
 */
public interface PageTemplateRepository extends JpaRepository<PageTemplate, Long> {

    /** 이름 오름차순 전체 조회 */
    List<PageTemplate> findAllByOrderByNameAsc();

    /** 이름 중복 검사 */
    boolean existsByName(String name);

    /** slug 중복 검사 */
    boolean existsBySlug(String slug);

    /** 이름 중복 검사 (자신 제외 — 수정 시) */
    boolean existsByNameAndIdNot(String name, Long id);

    /** slug 중복 검사 (자신 제외 — 수정 시) */
    boolean existsBySlugAndIdNot(String slug, Long id);

    /** slug로 단건 조회 */
    Optional<PageTemplate> findBySlug(String slug);
}
