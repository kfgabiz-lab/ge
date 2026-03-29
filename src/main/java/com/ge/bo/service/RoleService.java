package com.ge.bo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ge.bo.dto.RoleDto;
import com.ge.bo.entity.Role;
import com.ge.bo.exception.BusinessException;
import com.ge.bo.repository.AdminRepository;
import com.ge.bo.repository.RoleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;

    @Transactional(readOnly = true)
    public List<RoleDto.Response> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoleDto.Response createRole(RoleDto.CreateRequest request) {
        if (roleRepository.existsByCode(request.getCode())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "DUPLICATE_ROLE_CODE", "이미 사용 중인 역할 코드입니다.");
        }

        Role role = Role.builder()
                .code(request.getCode().toUpperCase())
                .displayName(request.getDisplayName())
                .description(request.getDescription())
                .color(request.getColor() != null ? request.getColor() : "#6b7280")
                .isSystem(request.isSystem())
                .build();

        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public RoleDto.Response updateRole(Long id, RoleDto.UpdateRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "ROLE_NOT_FOUND", "역할을 찾을 수 없습니다."));

        role.setDisplayName(request.getDisplayName());
        role.setDescription(request.getDescription());
        role.setColor(request.getColor());

        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "ROLE_NOT_FOUND", "역할을 찾을 수 없습니다."));

        if (role.isSystem()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "SYSTEM_ROLE", "시스템 기본 역할은 삭제할 수 없습니다.");
        }

        long memberCount = adminRepository.countByRole(role.getCode());
        if (memberCount > 0) {
            throw new BusinessException(HttpStatus.CONFLICT, "ROLE_IN_USE",
                    "해당 역할을 사용 중인 관리자가 " + memberCount + "명 있습니다.");
        }

        roleRepository.deleteById(id);
    }

    private RoleDto.Response toResponse(Role role) {
        long memberCount = adminRepository.countByRole(role.getCode());
        return RoleDto.Response.builder()
                .id(role.getId())
                .code(role.getCode())
                .displayName(role.getDisplayName())
                .description(role.getDescription())
                .color(role.getColor())
                .isSystem(role.isSystem())
                .memberCount(memberCount)
                .build();
    }
}
