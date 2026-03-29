package com.ge.bo.dto;

/**
 * 역할-메뉴 매핑 응답 DTO
 */
public record RoleMenuResponse(
    Long menuId,
    Long roleId,
    String roleName,
    String roleDisplayName,
    Boolean hasAccess
) {}
