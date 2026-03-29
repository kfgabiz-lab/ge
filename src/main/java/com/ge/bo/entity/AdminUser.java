package com.ge.bo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "admin_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 20)
    private String role; // SUPER_ADMIN, EDITOR

    @Column(unique = true, length = 50)
    private String employeeId;

    private LocalDateTime lastLoginAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;

    @Builder.Default
    @Column(nullable = false)
    private int failedLoginAttempts = 0;

    private LocalDateTime lockedUntil;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /* 등록일 (yyyymmdd) */
    @Column(nullable = false, length = 8, updatable = false)
    private String regDt;

    /* 등록시간 (hhmmss) */
    @Column(nullable = false, length = 6, updatable = false)
    private String regTm;

    /* 저장 전 등록일/등록시간 자동 세팅 */
    @PrePersist
    private void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.regDt = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        this.regTm = now.format(DateTimeFormatter.ofPattern("HHmmss"));
    }
}
