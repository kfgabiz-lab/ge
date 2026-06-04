# DB 마이그레이션: FK 제약 추가 및 제약명 표준화

## 개요
- **목적**: 누락된 FK 제약 6개 추가 + 기존 FK 제약명 표준화 (_fkey/_자동생성명 → _fk)
- **대상 테이블**: page_file, admin_user, admin_user_site, role_menu, code_detail, code_group, menu, page_data, page_template

## 문제점

| # | 문제 | 내용 |
|---|------|------|
| 1 | FK 누락 | page_file.data_id → page_data.id FK 없음 |
| 2 | FK 누락 | admin_user.role → role.code FK 없음 |
| 3 | FK 누락 | admin_user_site.admin_user_id → admin_user.id FK 없음 |
| 4 | FK 누락 | admin_user_site.site_id → site.id FK 없음 |
| 5 | FK 누락 | role_menu.role_id → role.id FK 없음 |
| 6 | FK 누락 | role_menu.menu_id → menu.id FK 없음 |
| 7 | 제약명 비표준 | 기존 6개 FK 제약명 자동생성/비표준 (_fkey, fkXXX 패턴) |
| 8 | 고립 데이터 | role_menu.menu_id 19건 — 존재하지 않는 menu.id 참조 |

---

## 마이그레이션 SQL

```sql
-- ============================================================
-- 1단계: role_menu 고립 데이터 삭제 (FK 추가 전 선행 필수)
--        menu 테이블에 존재하지 않는 menu_id 19건 삭제
-- ============================================================
DELETE FROM role_menu
WHERE menu_id NOT IN (SELECT id FROM menu);

-- ============================================================
-- 2단계: 누락된 FK 6개 추가
-- ============================================================

-- page_file.data_id → page_data.id
-- data_id는 NULL 허용(임시업로드 상태) → page_data 삭제 시 SET NULL
ALTER TABLE page_file
    ADD CONSTRAINT page_file_data_id_fk
    FOREIGN KEY (data_id) REFERENCES page_data(id) ON DELETE SET NULL;

-- admin_user.role → role.code (UNIQUE)
-- role 삭제 시 사용 중인 경우 차단 (RESTRICT)
ALTER TABLE admin_user
    ADD CONSTRAINT admin_user_role_fk
    FOREIGN KEY (role) REFERENCES role(code) ON DELETE RESTRICT;

-- admin_user_site 복합 PK — 부모 삭제 시 매핑 자동 삭제 (CASCADE)
ALTER TABLE admin_user_site
    ADD CONSTRAINT admin_user_site_admin_user_id_fk
    FOREIGN KEY (admin_user_id) REFERENCES admin_user(id) ON DELETE CASCADE;

ALTER TABLE admin_user_site
    ADD CONSTRAINT admin_user_site_site_id_fk
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

-- role_menu 복합 PK — 부모 삭제 시 매핑 자동 삭제 (CASCADE)
ALTER TABLE role_menu
    ADD CONSTRAINT role_menu_role_id_fk
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE;

ALTER TABLE role_menu
    ADD CONSTRAINT role_menu_menu_id_fk
    FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE;

-- ============================================================
-- 3단계: 기존 FK 제약명 표준화 (_fkey/_자동생성명 → _fk)
-- ============================================================
ALTER TABLE code_detail
    RENAME CONSTRAINT fk319pjwfq4jy1ieawdidthq01f TO code_detail_group_id_fk;

ALTER TABLE code_group
    RENAME CONSTRAINT code_group_site_id_fkey TO code_group_site_id_fk;

ALTER TABLE menu
    RENAME CONSTRAINT fkgeupubdqncc1lpgf2cn4fqwbc TO menu_parent_id_fk;

ALTER TABLE menu
    RENAME CONSTRAINT menu_site_id_fkey TO menu_site_id_fk;

ALTER TABLE page_data
    RENAME CONSTRAINT page_data_site_id_fkey TO page_data_site_id_fk;

ALTER TABLE page_template
    RENAME CONSTRAINT page_template_site_id_fkey TO page_template_site_id_fk;
```

---

## 롤백 SQL

```sql
-- FK 6개 삭제
ALTER TABLE page_file DROP CONSTRAINT IF EXISTS page_file_data_id_fk;
ALTER TABLE admin_user DROP CONSTRAINT IF EXISTS admin_user_role_fk;
ALTER TABLE admin_user_site DROP CONSTRAINT IF EXISTS admin_user_site_admin_user_id_fk;
ALTER TABLE admin_user_site DROP CONSTRAINT IF EXISTS admin_user_site_site_id_fk;
ALTER TABLE role_menu DROP CONSTRAINT IF EXISTS role_menu_role_id_fk;
ALTER TABLE role_menu DROP CONSTRAINT IF EXISTS role_menu_menu_id_fk;

-- 제약명 원복
ALTER TABLE code_detail RENAME CONSTRAINT code_detail_group_id_fk TO fk319pjwfq4jy1ieawdidthq01f;
ALTER TABLE code_group RENAME CONSTRAINT code_group_site_id_fk TO code_group_site_id_fkey;
ALTER TABLE menu RENAME CONSTRAINT menu_parent_id_fk TO fkgeupubdqncc1lpgf2cn4fqwbc;
ALTER TABLE menu RENAME CONSTRAINT menu_site_id_fk TO menu_site_id_fkey;
ALTER TABLE page_data RENAME CONSTRAINT page_data_site_id_fk TO page_data_site_id_fkey;
ALTER TABLE page_template RENAME CONSTRAINT page_template_site_id_fk TO page_template_site_id_fkey;
-- 주의: role_menu 고립 데이터 19건은 롤백 SQL로 복원 불가 (삭제 전 백업 권장)
```

---

## 변경 영향도

| 영역 | 변경 여부 | 내용 |
|------|-----------|------|
| BE (JPA Entity) | 없음 | 논리 참조(Long id, String role) 방식 유지, @ManyToOne 추가 불필요 |
| BE (Service/Repository) | 없음 | FK는 DB 레벨 무결성 강제, 애플리케이션 동작 변화 없음 |
| FE | 없음 | API 응답/요청 구조 변경 없음 |
| 데이터 | role_menu 19건 삭제 | 존재하지 않는 menu를 참조하는 고립 데이터 정리 |
