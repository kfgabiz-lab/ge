package com.ge.bo.dto;

import com.ge.bo.entity.SlugRegistry;
import java.time.OffsetDateTime;

public record SlugRegistryResponse(
    Long id,
    String slug,
    String name,
    String type,
    String description,
    Boolean active,
    String createdBy,
    OffsetDateTime createdAt,
    String updatedBy,
    OffsetDateTime updatedAt
) {
  public static SlugRegistryResponse from(SlugRegistry e) {
    return new SlugRegistryResponse(
            e.getId(), e.getSlug(), e.getName(), e.getType(),
            e.getDescription(), e.getActive(),
            e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt()
        );
  }
}
