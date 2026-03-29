package com.ge.bo.repository;

import com.ge.bo.entity.PageData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 페이지 데이터 JPA Repository
 * 동적 JSONB 검색은 PageDataService에서 EntityManager.createNativeQuery()로 처리
 */
public interface PageDataRepository extends JpaRepository<PageData, Long> {

    /**
     * id + templateSlug 조합 조회 — 다른 slug 데이터 접근 차단
     *
     * @param id           데이터 PK
     * @param templateSlug 페이지 식별자
     */
    Optional<PageData> findByIdAndTemplateSlug(Long id, String templateSlug);

    /**
     * id + templateSlug 조합 삭제 — 다른 slug 데이터 삭제 차단
     *
     * @param id           데이터 PK
     * @param templateSlug 페이지 식별자
     */
    void deleteByIdAndTemplateSlug(Long id, String templateSlug);
}
