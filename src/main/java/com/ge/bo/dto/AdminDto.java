package com.ge.bo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

public class AdminDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "유효한 이메일 주소를 입력해주세요.")
        @Email(message = "유효한 이메일 주소를 입력해주세요.")
        private String email;

        @NotBlank(message = "이름은 2자 이상 50자 이하로 입력해주세요.")
        @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하로 입력해주세요.")
        private String name;

        @Size(max = 50, message = "사번은 50자 이내로 입력해주세요.")
        private String employeeId;

        @NotBlank(message = "유효하지 않은 역할 코드입니다.")
        private String role;

        @JsonProperty("isActive")
        private boolean isActive;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @Size(min = 2, max = 50, message = "이름은 2자 이상 50자 이하로 입력해주세요.")
        private String name;

        @Size(max = 50, message = "사번은 50자 이내로 입력해주세요.")
        private String employeeId;

        private String role;

        @JsonProperty("isActive")
        private boolean isActive;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String email;
        private String name;
        private String employeeId;
        private String role;
        @JsonProperty("isActive")
        private boolean isActive;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
        /* 등록일 (yyyymmdd) */
        private String regDt;
        /* 등록시간 (hhmmss) */
        private String regTm;
        private String tempPassword; // Only populated during creation
    }
}
