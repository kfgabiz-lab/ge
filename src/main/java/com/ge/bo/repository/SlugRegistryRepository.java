package com.ge.bo.repository;

import com.ge.bo.entity.SlugRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

/**
 * Slug 레지스트리 Repository
 * - JpaSpecificationExecutor: type/keyword 동적 필터링 지원
 */
public interface SlugRegistryRepository extends JpaRepository<SlugRegistry, Long>, JpaSpecificationExecutor<SlugRegistry> {

    /** slug 중복 확인 (등록 시) */
    boolean existsBySlug(String slug);

    /** slug 중복 확인 (수정 시 — 자기 자신 제외) */
    boolean existsBySlugAndIdNot(String slug, Long id);

    /** 위젯 빌더용 — active=true 전체 목록, slug ASC 정렬 */
    List<SlugRegistry> findAllByActiveTrueOrderBySlugAsc();
}
