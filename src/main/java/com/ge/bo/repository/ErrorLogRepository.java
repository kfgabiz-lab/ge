package com.ge.bo.repository;

import com.ge.bo.entity.ErrorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 오류로그 Repository
 * - JpaSpecificationExecutor: 동적 필터링 지원
 */
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long>, JpaSpecificationExecutor<ErrorLog> {
}
