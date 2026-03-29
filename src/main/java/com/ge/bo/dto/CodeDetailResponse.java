package com.ge.bo.dto;

import com.ge.bo.entity.CodeDetail;

public record CodeDetailResponse(
    Long id,
    String code,
    String name,
    String description,
    Integer sortOrder,
    Boolean active,
    String extra1,
    String extra2,
    String extra3,
    String extra4,
    String extra5
) {
    public static CodeDetailResponse from(CodeDetail d) {
        return new CodeDetailResponse(
            d.getId(), d.getCode(), d.getName(), d.getDescription(),
            d.getSortOrder(), d.getActive(),
            d.getExtra1(), d.getExtra2(), d.getExtra3(), d.getExtra4(), d.getExtra5()
        );
    }
}
