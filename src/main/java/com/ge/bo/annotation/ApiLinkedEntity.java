package com.ge.bo.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 이 컨트롤러 또는 메서드가 특정 JPA Entity와 연관되어 있음을 선언합니다.
 * 백엔드 초기화 및 API 메타데이터 동기화 (ApiInfoService) 시 이 값을 읽어들여
 * connected_entity로 100% 매칭되어 저장됩니다.
 */
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ApiLinkedEntity {
    /**
     * @return 연결하려는 JPA Entity 의 클래스명 (예: "AdminUser", "CodeGroup")
     */
    String value();
}
