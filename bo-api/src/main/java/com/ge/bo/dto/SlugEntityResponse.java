package com.ge.bo.dto;

import com.ge.bo.entity.SlugEntity;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Slug Entity 응답 DTO
 * - 목록 조회 시: fields 빈 배열
 * - 단건/활성 목록 조회 시: fields 포함
 */
public record SlugEntityResponse(
    Long id,
    String slug,
    String name,
    String tableName,
    String description,
    Boolean active,
    Integer fieldCount,
    List<SlugEntityFieldResponse> fields,
    String createdBy,
    OffsetDateTime createdAt,
    String updatedBy,
    OffsetDateTime updatedAt
) {
    /** 목록 조회용 — fields 빈 배열 */
    public static SlugEntityResponse fromList(SlugEntity e) {
        return new SlugEntityResponse(
            e.getId(), e.getSlug(), e.getName(), e.getTableName(),
            e.getDescription(), e.getActive(),
            e.getFields().size(), List.of(),
            e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt()
        );
    }

    /** 단건/활성 목록 — fields 포함 */
    public static SlugEntityResponse from(SlugEntity e) {
        List<SlugEntityFieldResponse> fieldList = e.getFields().stream()
            .map(SlugEntityFieldResponse::from)
            .toList();
        return new SlugEntityResponse(
            e.getId(), e.getSlug(), e.getName(), e.getTableName(),
            e.getDescription(), e.getActive(),
            fieldList.size(), fieldList,
            e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt()
        );
    }
}
