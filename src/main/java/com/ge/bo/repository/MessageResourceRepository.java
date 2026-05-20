package com.ge.bo.repository;

import com.ge.bo.entity.MessageResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageResourceRepository extends JpaRepository<MessageResource, Long> {

    /** 번역 키 중복 확인 */
    boolean existsByKey(String key);

    /**
     * 검색 조건 AND 조합 조회
     * - key, ko, en: 부분 일치 (LIKE), 빈 문자열이면 조건 무시
     * - active: null이면 전체 조회
     */
    @Query("""
        SELECT m FROM MessageResource m
        WHERE (:key   IS NULL OR :key   = '' OR m.key LIKE %:key%)
          AND (:ko    IS NULL OR :ko    = '' OR m.ko  LIKE %:ko%)
          AND (:en    IS NULL OR :en    = '' OR m.en  LIKE %:en%)
          AND (:active IS NULL OR m.active = :active)
        ORDER BY m.createdAt DESC
    """)
    Page<MessageResource> search(
        @Param("key")    String key,
        @Param("ko")     String ko,
        @Param("en")     String en,
        @Param("active") Boolean active,
        Pageable pageable
    );
}
