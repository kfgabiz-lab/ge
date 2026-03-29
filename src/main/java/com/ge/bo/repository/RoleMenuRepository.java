package com.ge.bo.repository;

import com.ge.bo.entity.RoleMenu;
import com.ge.bo.entity.RoleMenuId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 역할-메뉴 매핑 Repository
 */
public interface RoleMenuRepository extends JpaRepository<RoleMenu, RoleMenuId> {

    /** 특정 메뉴의 역할 매핑 전체 조회 */
    List<RoleMenu> findByMenuId(Long menuId);

    /** 매핑 존재 확인 */
    boolean existsByRoleIdAndMenuId(Long roleId, Long menuId);

    /** 매핑 삭제 */
    void deleteByRoleIdAndMenuId(Long roleId, Long menuId);
}
