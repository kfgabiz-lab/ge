package com.ge.bo.repository;

import com.ge.bo.entity.SlugEntityField;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Slug Entity Field Repository
 */
public interface SlugEntityFieldRepository extends JpaRepository<SlugEntityField, Long> {

    /** entity별 필드 목록 조회 (sortOrder ASC) */
    List<SlugEntityField> findAllByEntityIdOrderBySortOrderAsc(Long entityId);
}
