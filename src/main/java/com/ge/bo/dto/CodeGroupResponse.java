package com.ge.bo.dto;

import com.ge.bo.entity.CodeGroup;
import java.util.List;

public record CodeGroupResponse(
    Long id,
    String groupCode,
    String groupName,
    String description,
    Boolean active,
    List<CodeDetailResponse> details
) {
    public static CodeGroupResponse from(CodeGroup g) {
        return new CodeGroupResponse(
            g.getId(), g.getGroupCode(), g.getGroupName(), g.getDescription(), g.getActive(),
            g.getDetails() != null ? g.getDetails().stream().map(CodeDetailResponse::from).toList() : List.of()
        );
    }
}
