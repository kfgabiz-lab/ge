package com.ge.bo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ge.bo.entity.AdminUser;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    @org.springframework.data.jpa.repository.Query("SELECT MAX(a.employeeId) FROM AdminUser a WHERE a.employeeId LIKE 'BO-2026-%'")
    Optional<String> findMaxEmployeeIdByPrefix();

    long countByRole(String role);
}
