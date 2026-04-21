package com.ge.bo.dto;

import com.ge.bo.entity.SlugRegistry;
import java.time.LocalDateTime;

public record SlugRegistryResponse(
    Long id,
    String slug,
    String name,
    String type,
    String description,
    Boolean active,
    String createdBy,
    LocalDateTime createdAt,
    String updatedBy,
    LocalDateTime updatedAt
) {
    public static SlugRegistryResponse from(SlugRegistry e) {
        return new SlugRegistryResponse(
            e.getId(), e.getSlug(), e.getName(), e.getType(),
            e.getDescription(), e.getActive(),
            e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt()
        );
    }
}
