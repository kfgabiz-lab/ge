package com.ge.bo.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * AdminUserSite 복합 PK 클래스
 */
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AdminUserSiteId implements Serializable {
    private Long adminUserId;
    private Long siteId;
}
