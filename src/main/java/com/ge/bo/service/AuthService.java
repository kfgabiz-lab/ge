package com.ge.bo.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ge.bo.dto.LoginRequest;
import com.ge.bo.dto.LoginResponse;
import com.ge.bo.entity.AdminUser;
import com.ge.bo.exception.BusinessException;
import com.ge.bo.repository.AdminRepository;
import com.ge.bo.security.JwtTokenProvider;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        AdminUser admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> BusinessException.unauthorized("이메일 또는 비밀번호가 일치하지 않습니다."));

        // 임시 잠금 확인 (로그인 시도 초과)
        if (admin.getLockedUntil() != null && admin.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "ACCOUNT_TEMPORARILY_LOCKED",
                    "로그인 시도 횟수를 초과했습니다. " + LOCK_DURATION_MINUTES + "분 후 다시 시도해주세요.");
        }

        // 계정 비활성화 확인
        if (!admin.isActive()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED",
                    "잠긴 계정입니다. 관리자에게 문의하세요.");
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            int attempts = admin.getFailedLoginAttempts() + 1;
            admin.setFailedLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                admin.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
                throw new BusinessException(HttpStatus.FORBIDDEN, "ACCOUNT_TEMPORARILY_LOCKED",
                        "로그인 시도 횟수(" + MAX_FAILED_ATTEMPTS + "회)를 초과했습니다. " + LOCK_DURATION_MINUTES + "분 후 다시 시도해주세요.");
            }
            throw BusinessException.unauthorized("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 - 실패 카운터 초기화
        admin.setFailedLoginAttempts(0);
        admin.setLockedUntil(null);
        admin.setLastLoginAt(LocalDateTime.now());

        String accessToken = jwtTokenProvider.generateAccessToken(admin.getEmail(), admin.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(admin.getEmail());

        // Refresh Token을 httpOnly 쿠키로 설정 (JS 접근 불가)
        setRefreshTokenCookie(response, refreshToken);

        return buildLoginResponse(accessToken, admin);
    }

    @Transactional(readOnly = true)
    public LoginResponse refresh(String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw BusinessException.unauthorized("유효하지 않은 Refresh Token입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        AdminUser admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> BusinessException.unauthorized("사용자를 찾을 수 없습니다."));

        if (!admin.isActive()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED", "잠긴 계정입니다. 관리자에게 문의하세요.");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(admin.getEmail(), admin.getRole());
        return buildLoginResponse(newAccessToken, admin);
    }

    public void logout(HttpServletResponse response) {
        clearRefreshTokenCookie(response);
    }

    private LoginResponse buildLoginResponse(String accessToken, AdminUser admin) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .expiresIn(3600)
                .adminInfo(LoginResponse.AdminInfo.builder()
                        .id(admin.getId())
                        .name(admin.getName())
                        .email(admin.getEmail())
                        .role(admin.getRole())
                        .build())
                .build();
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // 운영 환경에서는 true로 변경
                .path("/api/v1/auth")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/api/v1/auth")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
