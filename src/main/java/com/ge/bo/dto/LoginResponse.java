package com.ge.bo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private long expiresIn;
    private AdminInfo adminInfo;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminInfo {
        private Long id;
        private String name;
        private String email;
        private String role;
        @JsonProperty("isSystem")
        private boolean isSystem; // 시스템관리자 여부 (role.is_system 기반)
    }
}
