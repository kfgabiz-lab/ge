package com.ge.bo.repository;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Repository — 배너
 * 생성일시: 2026-07-12T13:37:46.284663+09:00
 * 원본 Slug Entity: id=1, tableName=banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import com.ge.bo.entity.BannerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 배너 Repository
 */
public interface BannerDataRepository
    extends JpaRepository<BannerData, Long>, JpaSpecificationExecutor<BannerData> {
}
