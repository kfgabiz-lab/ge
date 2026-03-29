package com.ge.bo.dto;

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
    }
}
