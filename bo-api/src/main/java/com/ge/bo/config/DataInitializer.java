package com.ge.bo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ge.bo.entity.AdminUser;
import com.ge.bo.repository.AdminRepository;

@Component
public class DataInitializer implements ApplicationRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository,
            @Lazy PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        /* 
        insertAdminIfAbsent("admin@ge.com", "시스템 관리자", "P@ssw0rd123", "SUPER_ADMIN");
        */
    }

    private void insertAdminIfAbsent(String email, String name, String password, String role) {
        if (!adminRepository.existsByEmail(email)) {
            adminRepository.save(AdminUser.builder()
                    .email(email)
                    .name(name)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .isActive(true)
                    .build());
        }
    }
}
