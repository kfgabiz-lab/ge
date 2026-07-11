package com.ge.bo.entity;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Entity — 배너
 * 생성일시: 2026-07-11T14:32:07.519609300+09:00
 * 원본 Slug Entity: id=1, tableName=banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.OffsetDateTime;

/**
 * 배너 엔티티
 * 배너 등록/수정 폼(banner-detail)    필드 재사용 Entity
 */
@Entity
@Table(name = "banner")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class BannerData {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 배너    위치 */
  @Column(name = "banner_position", nullable = false)
  private String banner_position;

  /** 제목 */
  @Column(name = "title", nullable = false)
  private String title;

  /** 게시기간 */
  @Column(name = "post_date", nullable = false)
  private OffsetDateTime post_date;

  /** prefix */
  @Column(name = "prefix", nullable = false)
  private String prefix;

  /** 타이틀 */
  @Column(name = "main_title", nullable = false)
  private String main_title;

  /** bottomText */
  @Column(name = "bottom_text", nullable = false)
  private String bottom_text;

  /** 서브타이틀 */
  @Column(name = "sub_title", nullable = true)
  private String sub_title;

  /** url */
  @Column(name = "url", nullable = false)
  private String url;

  /** 이미지 */
  @Column(name = "image", nullable = false)
  private String image;

  /** 정렬순서 */
  @Column(name = "sort_order", nullable = false)
  private Integer sort_order;

  /** 공개여부 */
  @Column(name = "is_visible", nullable = false)
  private String is_visible;

  /** infoSort */
  @Column(name = "info_sort", nullable = true)
  private String info_sort;

  @CreatedBy
  @Column(name = "created_by", nullable = false, updatable = false, length = 50)
  private String createdBy;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @LastModifiedBy
  @Column(name = "updated_by", nullable = false, length = 50)
  private String updatedBy;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;
}
