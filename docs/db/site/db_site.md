# DB 설계 문서 — 홈페이지(Site) 관리

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 홈페이지(Site) 관리 |
| 작성일 | 2026-05-14 |
| 관련 테이블 | site(신규), admin_user_site(신규), menu, code_group, page_data, page_template(변경) |

글로벌/리전 개념의 홈페이지(사이트)를 관리하는 기능.  
헤더에서 홈페이지 선택 시 해당 홈페이지 기준으로 메뉴·공통코드·페이지 데이터 전체가 필터링된다.  
관리자(admin_user)와 권한(role)은 홈페이지와 무관하게 공통으로 유지하며,  
관리자별로 접근 가능한 홈페이지를 별도 매핑 테이블(admin_user_site)로 관리한다.

---

## 2. 신규 테이블

### 2-1. `site` — 홈페이지

```sql
CREATE TABLE site (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_by  TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_by  TEXT NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL
);
```

| 컬럼 | 타입 | NOT NULL | 설명 |
|---|---|---|---|
| id | BIGINT IDENTITY | ✓ | PK |
| name | TEXT | ✓ | 홈페이지명 (예: 북미홈페이지) |
| description | TEXT | | 설명 |
| is_active | BOOLEAN DEFAULT TRUE | ✓ | 사용여부 |
| created_by | TEXT | ✓ | 등록자 |
| created_at | TIMESTAMPTZ | ✓ | 등록일시 |
| updated_by | TEXT | ✓ | 수정자 |
| updated_at | TIMESTAMPTZ | ✓ | 수정일시 |

---

### 2-2. `admin_user_site` — 관리자 ↔ 홈페이지 매핑

```sql
CREATE TABLE admin_user_site (
    admin_user_id   BIGINT NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
    site_id         BIGINT NOT NULL REFERENCES site(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (admin_user_id, site_id)
);

CREATE INDEX admin_user_site_admin_user_id_idx ON admin_user_site (admin_user_id);
CREATE INDEX admin_user_site_site_id_idx ON admin_user_site (site_id);
```

| 컬럼 | 타입 | NOT NULL | 설명 |
|---|---|---|---|
| admin_user_id | BIGINT FK | ✓ | 관리자 PK (복합 PK) |
| site_id | BIGINT FK | ✓ | 홈페이지 PK (복합 PK) |
| created_at | TIMESTAMPTZ | ✓ | 매핑 등록일시 |

> `role_menu` 패턴과 동일한 복합 PK 구조. 관리자 삭제·홈페이지 삭제 시 CASCADE 삭제.

---

## 3. 기존 테이블 변경

### 3-1. `menu` — site_id 추가

```sql
ALTER TABLE menu ADD COLUMN site_id BIGINT REFERENCES site(id);
UPDATE menu SET site_id = 1;
ALTER TABLE menu ALTER COLUMN site_id SET NOT NULL;

CREATE INDEX menu_site_id_idx ON menu (site_id);
```

### 3-2. `code_group` — site_id 추가 + unique 변경

```sql
ALTER TABLE code_group ADD COLUMN site_id BIGINT REFERENCES site(id);
UPDATE code_group SET site_id = 1;
ALTER TABLE code_group ALTER COLUMN site_id SET NOT NULL;

-- group_code 단독 unique → (site_id, group_code) 복합 unique
ALTER TABLE code_group DROP CONSTRAINT code_group_group_code_key;
ALTER TABLE code_group ADD CONSTRAINT code_group_site_id_group_code_key UNIQUE (site_id, group_code);

CREATE INDEX code_group_site_id_idx ON code_group (site_id);
```

### 3-3. `page_data` — site_id 추가

```sql
ALTER TABLE page_data ADD COLUMN site_id BIGINT REFERENCES site(id);
UPDATE page_data SET site_id = 1;
ALTER TABLE page_data ALTER COLUMN site_id SET NOT NULL;

CREATE INDEX page_data_site_id_idx ON page_data (site_id);
```

### 3-4. `page_template` — site_id 추가

```sql
ALTER TABLE page_template ADD COLUMN site_id BIGINT REFERENCES site(id);
UPDATE page_template SET site_id = 1;
ALTER TABLE page_template ALTER COLUMN site_id SET NOT NULL;

CREATE INDEX page_template_site_id_idx ON page_template (site_id);
```

---

## 4. 초기 데이터 (마이그레이션)

```sql
-- 기본 홈페이지 1건 INSERT
INSERT INTO site (name, description, is_active, created_by, created_at, updated_by, updated_at)
VALUES ('북미홈페이지', '북미홈페이지 관리', true, 'system', now(), 'system', now());
-- → id = 1 자동 할당
```

기존 데이터(`menu`, `code_group`, `page_data`, `page_template`)는 위 3-1~3-4의 UPDATE로 모두 `site_id = 1`로 귀속.

---

## 5. 변경 영향도

| 테이블 | 영향 | 비고 |
|---|---|---|
| site | 신규 생성 | |
| admin_user_site | 신규 생성 | |
| menu | site_id 컬럼 추가, NOT NULL | 기존 데이터 site_id=1 업데이트 |
| code_group | site_id 추가, unique constraint 변경 | group_code 중복 허용 (site별) |
| page_data | site_id 컬럼 추가, NOT NULL | |
| page_template | site_id 컬럼 추가, NOT NULL | |
| admin_user | 변경 없음 | 공통 유지 |
| role | 변경 없음 | 공통 유지 |
| role_menu | 변경 없음 | menu_id → site 자동 식별 |
| slug_registry | 변경 없음 | site 무관 |
