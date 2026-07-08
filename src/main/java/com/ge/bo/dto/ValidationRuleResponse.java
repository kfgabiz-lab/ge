package com.ge.bo.dto;

import com.ge.bo.entity.ValidationRule;
import java.time.OffsetDateTime;

public record ValidationRuleResponse(
    Long id,
    Long slugRegistryId,
    String slug,
    String type,
    String fields,
    String condition,
    Integer maxCount,
    String createdBy,
    OffsetDateTime createdAt,
    String updatedBy,
    OffsetDateTime updatedAt
) {
  public static ValidationRuleResponse from(ValidationRule e) {
    return new ValidationRuleResponse(
            e.getId(),
            e.getSlugRegistry().getId(),
            e.getSlugRegistry().getSlug(),
            e.getType(), e.getFields(), e.getCondition(), e.getMaxCount(),
            e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedBy(), e.getUpdatedAt()
        );
  }
}
