package com.ge.bo.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * RoleMenu 복합 PK 클래스
 */
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RoleMenuId implements Serializable {
    private Long roleId;
    private Long menuId;
}
