package com.ge.bo.repository;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Repository — 히어로
 * 생성일시: 2026-07-11T14:24:12.513193200+09:00
 * 원본 Slug Entity: id=5, tableName=hero_banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import com.ge.bo.entity.HeroData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 히어로 Repository
 */
public interface HeroDataRepository
    extends JpaRepository<HeroData, Long>, JpaSpecificationExecutor<HeroData> {
}
