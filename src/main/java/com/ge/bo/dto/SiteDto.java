package com.ge.bo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class SiteDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {

        @NotBlank(message = "홈페이지명을 입력해주세요.")
        @Size(max = 255, message = "홈페이지명은 255자 이하여야 합니다.")
        private String name;

        @Size(max = 500, message = "설명은 500자 이하여야 합니다.")
        private String description;

        @Size(max = 255, message = "도메인은 255자 이하여야 합니다.")
        private String domain;

        @NotNull(message = "사용여부 값은 필수입니다.")
        private Boolean isActive;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {

        @NotBlank(message = "홈페이지명을 입력해주세요.")
        @Size(max = 255, message = "홈페이지명은 255자 이하여야 합니다.")
        private String name;

        @Size(max = 500, message = "설명은 500자 이하여야 합니다.")
        private String description;

        @Size(max = 255, message = "도메인은 255자 이하여야 합니다.")
        private String domain;

        @NotNull(message = "사용여부 값은 필수입니다.")
        private Boolean isActive;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String domain;
        private Boolean isActive;
        private String createdBy;
        private LocalDateTime createdAt;
        private String updatedBy;
        private LocalDateTime updatedAt;
    }

    /** 관리자-홈페이지 매핑 일괄 변경 요청 */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SiteMappingRequest {

        @NotNull(message = "홈페이지 ID 목록은 필수입니다.")
        private List<Long> siteIds;
    }
}
