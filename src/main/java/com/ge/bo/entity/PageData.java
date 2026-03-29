package com.ge.bo.entity;

import jakarta.persistence.*;
import lombok.*;
import io.hypersistence.utils.hibernate.type.json.JsonStringType;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 페이지 데이터 엔티티
 * 페이지 메이커로 생성된 모든 페이지의 CRUD 데이터를 범용 저장
 * - template_slug로 어떤 페이지의 데이터인지 구분
 * - data_json(JSONB)에 폼 필드 키:값 쌍을 저장
 */
@Entity
@Table(
    name = "page_data",
    indexes = {
        @Index(name = "idx_page_data_slug",         columnList = "template_slug"),
        @Index(name = "idx_page_data_slug_created",  columnList = "template_slug, created_at DESC")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
public class PageData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 페이지 식별자 — page_template.slug와 논리적으로 동일한 값 */
    @Column(name = "template_slug", nullable = false, length = 255)
    private String templateSlug;

    /** 폼 필드 데이터 JSON — { "name": "홍길동", "status": "active" } */
    @Type(JsonStringType.class)
    @Column(name = "data_json", nullable = false, columnDefinition = "jsonb")
    private String dataJson;

    @CreatedBy
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
