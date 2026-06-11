package com.ge.bo.repository;

import com.ge.bo.entity.PageData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 페이지 데이터 JPA Repository
 * 동적 JSONB 검색은 PageDataService에서 EntityManager.createNativeQuery()로 처리
 */
public interface PageDataRepository extends JpaRepository<PageData, Long> {

    /**
     * id + dataSlug 조합 조회 — 다른 slug 데이터 접근 차단
     *
     * @param id       데이터 PK
     * @param dataSlug 데이터 식별 slug
     */
  Optional<PageData> findByIdAndDataSlug(Long id, String dataSlug);

    /**
     * id + dataSlug 조합 삭제 — 다른 slug 데이터 삭제 차단
     *
     * @param id       데이터 PK
     * @param dataSlug 데이터 식별 slug
     */
  void deleteByIdAndDataSlug(Long id, String dataSlug);

    /**
     * group_id + dataSlug 조합 단건 조회 — 다중 slug 저장 수정 모드에서 사용
     *
     * @param groupId  그룹 식별자 (UUID)
     * @param dataSlug 데이터 식별 slug
     */
  Optional<PageData> findByGroupIdAndDataSlug(String groupId, String dataSlug);

    /**
     * group_id 기반 전체 조회 — 그룹 삭제 시 대상 레코드 일괄 수집
     *
     * @param groupId 그룹 식별자 (UUID)
     */
  List<PageData> findByGroupId(String groupId);
}
