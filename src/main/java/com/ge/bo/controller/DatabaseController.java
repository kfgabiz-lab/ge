package com.ge.bo.controller;

import com.ge.bo.dto.ColumnInfoResponse;
import com.ge.bo.dto.EntityInfoResponse;
import com.ge.bo.dto.FieldInfoResponse;
import com.ge.bo.dto.TableInfoResponse;
import com.ge.bo.service.DatabaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 데이터베이스 메타데이터 조회 API
 * - 단순 조회 전용 (읽기 전용)
 * - 인증된 관리자만 접근 가능 (SecurityConfig의 anyRequest().authenticated() 적용)
 */
@RestController
@RequestMapping("/api/v1/database")
@RequiredArgsConstructor
public class DatabaseController {

    private final DatabaseService databaseService;

    /**
     * 테이블 목록 조회
     * GET /api/v1/database/tables
     */
    @GetMapping("/tables")
    public ResponseEntity<List<TableInfoResponse>> getTables() {
        return ResponseEntity.ok(databaseService.getTables());
    }

    /**
     * 특정 테이블의 컬럼 정보 조회
     * GET /api/v1/database/tables/{tableName}/columns
     *
     * @param tableName 조회할 테이블명
     */
    @GetMapping("/tables/{tableName}/columns")
    public ResponseEntity<List<ColumnInfoResponse>> getColumns(@PathVariable String tableName) {
        return ResponseEntity.ok(databaseService.getColumns(tableName));
    }

    /**
     * JPA 엔티티 목록 조회
     * GET /api/v1/database/entities
     */
    @GetMapping("/entities")
    public ResponseEntity<List<EntityInfoResponse>> getEntities() {
        return ResponseEntity.ok(databaseService.getEntities());
    }

    /**
     * 특정 엔티티의 필드 목록 조회
     * GET /api/v1/database/entities/{entityName}/fields
     *
     * @param entityName JPA 엔티티 클래스명
     */
    @GetMapping("/entities/{entityName}/fields")
    public ResponseEntity<List<FieldInfoResponse>> getEntityFields(@PathVariable String entityName) {
        return ResponseEntity.ok(databaseService.getEntityFields(entityName));
    }
}
