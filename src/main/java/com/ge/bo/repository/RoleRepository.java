package com.ge.bo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ge.bo.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    boolean existsByCode(String code);
    Optional<Role> findByCode(String code);
}
