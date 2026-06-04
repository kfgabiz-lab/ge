package com.ge.bo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.OffsetDateTime;

/**
 * 홈페이지(Site) 엔티티
 */
@Entity
@Table(name = "site")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Site {

  @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사이트명 (한국어 기본값) */
  @Column(nullable = false)
    private String name;

    /** 사이트명 다국어 키 (message_resource.key 참조, 예: site.1.name) */
  @Column(name = "name_msg_key")
    private String nameMsgKey;

  @Column
    private String description;

  @Column
    private String domain;

  @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

  @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy;

  @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

  @LastModifiedBy
    @Column(name = "updated_by", nullable = false)
    private String updatedBy;

  @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
