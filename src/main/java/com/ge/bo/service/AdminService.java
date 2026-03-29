package com.ge.bo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ge.bo.dto.AdminDto;
import com.ge.bo.entity.AdminUser;
import com.ge.bo.exception.BusinessException;
import com.ge.bo.repository.AdminRepository;
import com.ge.bo.repository.RoleRepository;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AdminDto.Response> getAllAdmins() {
        List<AdminUser> admins = adminRepository.findAll(org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Order.desc("createdAt"),
                org.springframework.data.domain.Sort.Order.desc("id")));
        return admins.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminDto.Response createAdmin(AdminDto.CreateRequest request) {
        // Generate employeeId if not provided
        String employeeId = request.getEmployeeId();
        if (employeeId == null || employeeId.trim().isEmpty() || employeeId.startsWith("BO-2026-")) {
            String maxId = adminRepository.findMaxEmployeeIdByPrefix().orElse("BO-2026-00000");
            int nextSequence = Integer.parseInt(maxId.substring(8)) + 1;
            employeeId = String.format("BO-2026-%05d", nextSequence);
        }

        if (!roleRepository.existsByCode(request.getRole())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "유효하지 않은 역할 코드입니다.");
        }
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "DUPLICATE_EMAIL", "이미 등록된 이메일 계정입니다.");
        }
        if (adminRepository.existsByEmployeeId(employeeId)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "DUPLICATE_EMPLOYEE_ID", "이미 등록된 사번입니다.");
        }

        // Always generate temporary password on backend
        String rawPassword = UUID.randomUUID().toString().substring(0, 12);

        AdminUser adminUser = AdminUser.builder()
                .email(request.getEmail())
                .name(request.getName())
                .employeeId(employeeId)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(request.getRole())
                .isActive(request.isActive())
                .build();

        AdminUser saved = adminRepository.save(adminUser);
        AdminDto.Response response = convertToResponse(saved);
        response.setTempPassword(rawPassword);

        return response;
    }

    @Transactional
    public AdminDto.Response updateAdmin(Long id, AdminDto.UpdateRequest request) {
        AdminUser adminUser = adminRepository.findById(id)
                .orElseThrow(
                        () -> new BusinessException(HttpStatus.NOT_FOUND, "ADMIN_NOT_FOUND", "해당 관리자를 찾을 수 없습니다."));

        if (request.getRole() != null && !roleRepository.existsByCode(request.getRole())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "유효하지 않은 역할 코드입니다.");
        }

        adminUser.setName(request.getName());
        adminUser.setEmployeeId(request.getEmployeeId());
        adminUser.setRole(request.getRole());
        adminUser.setActive(request.isActive());

        return convertToResponse(adminRepository.save(adminUser));
    }

    @Transactional
    public AdminDto.Response resetPassword(Long id) {
        AdminUser adminUser = adminRepository.findById(id)
                .orElseThrow(
                        () -> new BusinessException(HttpStatus.NOT_FOUND, "ADMIN_NOT_FOUND", "해당 관리자를 찾을 수 없습니다."));

        String tempPassword = "test12345"; // As per user request
        adminUser.setPasswordHash(passwordEncoder.encode(tempPassword));

        AdminDto.Response response = convertToResponse(adminRepository.save(adminUser));
        response.setTempPassword(tempPassword);
        return response;
    }

    @Transactional
    public AdminDto.Response toggleStatus(Long id, boolean isActive) {
        AdminUser adminUser = adminRepository.findById(id)
                .orElseThrow(
                        () -> new BusinessException(HttpStatus.NOT_FOUND, "ADMIN_NOT_FOUND", "해당 관리자를 찾을 수 없습니다."));

        adminUser.setActive(isActive);
        return convertToResponse(adminRepository.save(adminUser));
    }

    @Transactional
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    private AdminDto.Response convertToResponse(AdminUser user) {
        return AdminDto.Response.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .employeeId(user.getEmployeeId())
                .role(user.getRole())
                .isActive(user.isActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .regDt(user.getRegDt())
                .regTm(user.getRegTm())
                .build();
    }
}
