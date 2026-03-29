package com.ge.bo.service;

import com.ge.bo.dto.ColumnInfoResponse;
import com.ge.bo.dto.EntityInfoResponse;
import com.ge.bo.dto.FieldInfoResponse;
import com.ge.bo.dto.TableInfoResponse;
import jakarta.persistence.Column;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.metamodel.Attribute;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 데이터베이스 메타데이터 조회 서비스
 * - JPA 엔티티가 아닌 information_schema를 직접 쿼리 → JdbcTemplate 사용
 * - public 스키마의 일반 테이블(BASE TABLE)만 대상
 */
@Service
@RequiredArgsConstructor
public class DatabaseService {

    private final JdbcTemplate jdbcTemplate;
    private final EntityManagerFactory entityManagerFactory;

    /**
     * public 스키마의 테이블 목록 조회
     * - 테이블명 오름차순 정렬
     * - pg_description으로 테이블 comment 조회
     */
    public List<TableInfoResponse> getTables() {
        String sql = """
                SELECT
                    t.table_name,
                    obj_description(pc.oid, 'pg_class') AS comment,
                    COUNT(c.column_name)                 AS column_count
                FROM information_schema.tables        t
                JOIN pg_class                         pc ON pc.relname = t.table_name AND pc.relnamespace = 'public'::regnamespace
                JOIN information_schema.columns       c  ON c.table_schema = 'public' AND c.table_name = t.table_name
                WHERE t.table_schema = 'public'
                  AND t.table_type   = 'BASE TABLE'
                GROUP BY t.table_name, pc.oid
                ORDER BY t.table_name
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new TableInfoResponse(
                rs.getString("table_name"),
                rs.getString("comment"),           // null 가능
                rs.getInt("column_count")
        ));
    }

    /**
     * 특정 테이블의 컬럼 상세 정보 조회
     * - ordinal_position(컬럼 순서) 기준 정렬
     * - pg_description으로 컬럼 comment 조회
     * - information_schema.table_constraints로 PK 여부 판별
     *
     * @param tableName 조회할 테이블명
     */
    public List<ColumnInfoResponse> getColumns(String tableName) {
        String sql = """
                SELECT
                    col.column_name,
                    col.udt_name                           AS data_type,
                    col.character_maximum_length           AS length,
                    col.is_nullable = 'YES'                AS is_nullable,
                    COALESCE(pk.is_pk, false)              AS is_primary_key,
                    col.column_default,
                    pgd.description                        AS comment
                FROM information_schema.columns col
                -- 테이블 OID 조인 (comment 조회용)
                JOIN pg_class                 pc  ON pc.relname = col.table_name AND pc.relnamespace = 'public'::regnamespace
                -- 컬럼 comment
                LEFT JOIN pg_description      pgd ON pgd.objoid = pc.oid AND pgd.objsubid = col.ordinal_position
                -- PK 여부 서브쿼리
                LEFT JOIN (
                    SELECT kcu.column_name, true AS is_pk
                    FROM information_schema.table_constraints  tc
                    JOIN information_schema.key_column_usage   kcu
                         ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
                    WHERE tc.table_schema = 'public'
                      AND tc.table_name   = ?
                      AND tc.constraint_type = 'PRIMARY KEY'
                ) pk ON pk.column_name = col.column_name
                WHERE col.table_schema = 'public'
                  AND col.table_name   = ?
                ORDER BY col.ordinal_position
                """;

        /* ? 파라미터 2개: PK 서브쿼리용 tableName, 메인 WHERE용 tableName */
        return jdbcTemplate.query(sql, (rs, rowNum) -> new ColumnInfoResponse(
                rs.getString("column_name"),
                rs.getString("data_type"),
                (Integer) rs.getObject("length"),   // null 허용이므로 Object로 캐스팅
                rs.getBoolean("is_nullable"),
                rs.getBoolean("is_primary_key"),
                rs.getString("column_default"),     // null 가능
                rs.getString("comment")             // null 가능
        ), tableName, tableName);
    }

    /**
     * JPA Metamodel 기반 엔티티 목록 조회
     * - 엔티티명 오름차순 정렬
     * - BASIC 타입 필드 수만 카운트 (연관관계 필드 제외)
     */
    public List<EntityInfoResponse> getEntities() {
        return entityManagerFactory.getMetamodel().getEntities().stream()
                .sorted(Comparator.comparing(EntityType::getName))
                .map(entity -> {
                    String tableName = resolveTableName(entity.getJavaType());
                    long fieldCount = entity.getAttributes().stream()
                            .filter(a -> a.getPersistentAttributeType() == Attribute.PersistentAttributeType.BASIC)
                            .count();
                    return new EntityInfoResponse(entity.getName(), tableName, (int) fieldCount);
                })
                .collect(Collectors.toList());
    }

    /**
     * 특정 엔티티의 필드 목록 조회
     * - BASIC 타입 필드만 반환 (연관관계 필드 제외)
     * - PK 필드 먼저, 이후 알파벳 순 정렬
     *
     * @param entityName JPA 엔티티 클래스명
     */
    public List<FieldInfoResponse> getEntityFields(String entityName) {
        EntityType<?> entityType = entityManagerFactory.getMetamodel().getEntities().stream()
                .filter(e -> e.getName().equals(entityName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("엔티티를 찾을 수 없습니다: " + entityName));

        return entityType.getAttributes().stream()
                .filter(a -> a.getPersistentAttributeType() == Attribute.PersistentAttributeType.BASIC)
                .map(attr -> {
                    String fieldName  = attr.getName();
                    String columnName = resolveColumnName(entityType.getJavaType(), fieldName);
                    String javaType   = attr.getJavaType().getSimpleName();
                    boolean isId      = attr instanceof SingularAttribute<?, ?> sa && sa.isId();
                    boolean isNullable = attr instanceof SingularAttribute<?, ?> sa && sa.isOptional();
                    return new FieldInfoResponse(fieldName, columnName, javaType, isId, isNullable);
                })
                /* PK 먼저, 이후 필드명 알파벳 순 */
                .sorted(Comparator.comparing(FieldInfoResponse::isId).reversed()
                        .thenComparing(FieldInfoResponse::fieldName))
                .collect(Collectors.toList());
    }

    /** @Table 어노테이션 → 테이블명 추출 (없으면 클래스명 snake_case 변환) */
    private String resolveTableName(Class<?> clazz) {
        Table table = clazz.getAnnotation(Table.class);
        if (table != null && !table.name().isBlank()) return table.name();
        return toSnakeCase(clazz.getSimpleName());
    }

    /** @Column / @JoinColumn 어노테이션 → 컬럼명 추출 (없으면 필드명 snake_case 변환) */
    private String resolveColumnName(Class<?> clazz, String fieldName) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            Column column = field.getAnnotation(Column.class);
            if (column != null && !column.name().isBlank()) return column.name();
            JoinColumn joinColumn = field.getAnnotation(JoinColumn.class);
            if (joinColumn != null && !joinColumn.name().isBlank()) return joinColumn.name();
        } catch (NoSuchFieldException ignored) { /* 부모 클래스 필드 등 — 무시 */ }
        return toSnakeCase(fieldName);
    }

    /** camelCase → snake_case 변환 */
    private String toSnakeCase(String name) {
        return name.replaceAll("([A-Z])", "_$1").toLowerCase().replaceFirst("^_", "");
    }
}
