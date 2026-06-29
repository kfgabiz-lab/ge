package com.ge.bo.repository;

import com.ge.bo.entity.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 트랜잭션 로그 Repository
 */
public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long>,
        JpaSpecificationExecutor<TransactionLog> {
}
