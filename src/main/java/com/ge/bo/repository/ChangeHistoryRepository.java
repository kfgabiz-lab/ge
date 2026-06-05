package com.ge.bo.repository;

import com.ge.bo.entity.ChangeHistory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 변경 이력 Repository
 */
public interface ChangeHistoryRepository extends JpaRepository<ChangeHistory, Long> {
}
