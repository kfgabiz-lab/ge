package com.ge.bo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ge.bo.entity.Role;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    boolean existsByCode(String code);
    Optional<Role> findByCode(String code);
    /** 전체 역할 목록 조회 (is_system 필터는 서비스 레이어 스트림에서 처리) */
    List<Role> findAllByOrderByIdAsc();
}
