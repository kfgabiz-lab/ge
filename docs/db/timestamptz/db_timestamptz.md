# DB 마이그레이션: TIMESTAMP → TIMESTAMPTZ

## 개요
- **목적**: 글로벌 확장 대비 타임존 정보 포함 타입으로 전환
- **변경 전**: `TIMESTAMP WITHOUT TIME ZONE` (LocalDateTime)
- **변경 후**: `TIMESTAMP WITH TIME ZONE` (OffsetDateTime)
- **기존 데이터 처리**: KST(Asia/Seoul, UTC+9) 기준으로 저장된 값에 타임존 정보 추가

---

## 영향 테이블 및 컬럼

| 테이블 | 변경 컬럼 |
|---|---|
| `admin_user` | `last_login_at`, `locked_until`, `created_at`, `updated_at` |
| `role` | `created_at`, `updated_at` |
| `role_menu` | `created_at` |
| `menu` | `created_at`, `updated_at` |
| `site` | `created_at`, `updated_at` |
| `admin_user_site` | `created_at` |
| `code_group` | `created_at`, `updated_at` |
| `code_detail` | `created_at`, `updated_at` |
| `page_template` | `created_at`, `updated_at` |
| `page_data` | `created_at`, `updated_at` |
| `page_file` | `created_at` |
| `tsx_generation` | `created_at` |
| `slug_registry` | `created_at`, `updated_at` |
| `api_info` | `created_at`, `updated_at` |
| `message_resource` | `created_at`, `updated_at` |
| `error_log` | `created_at` |

---

## 마이그레이션 SQL

```sql
-- ============================================================
-- TIMESTAMPTZ 마이그레이션
-- 기존 데이터: KST(Asia/Seoul, UTC+9) 기준으로 저장되어 있으므로
--             AT TIME ZONE 'Asia/Seoul' 으로 타임존 정보 부여
-- ============================================================

-- admin_user
ALTER TABLE admin_user
  ALTER COLUMN last_login_at TYPE TIMESTAMPTZ USING last_login_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN locked_until  TYPE TIMESTAMPTZ USING locked_until  AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN created_at    TYPE TIMESTAMPTZ USING created_at    AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at    TYPE TIMESTAMPTZ USING updated_at    AT TIME ZONE 'Asia/Seoul';

-- role
ALTER TABLE role
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- role_menu
ALTER TABLE role_menu
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul';

-- menu
ALTER TABLE menu
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- site
ALTER TABLE site
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- admin_user_site
ALTER TABLE admin_user_site
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul';

-- code_group
ALTER TABLE code_group
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- code_detail
ALTER TABLE code_detail
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- page_template
ALTER TABLE page_template
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- page_data
ALTER TABLE page_data
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- page_file
ALTER TABLE page_file
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul';

-- tsx_generation
ALTER TABLE tsx_generation
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul';

-- slug_registry
ALTER TABLE slug_registry
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- api_info
ALTER TABLE api_info
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- message_resource
ALTER TABLE message_resource
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul',
  ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Asia/Seoul';

-- error_log
ALTER TABLE error_log
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Asia/Seoul';
```

---

## 롤백 SQL

```sql
-- TIMESTAMPTZ → TIMESTAMP 롤백
-- 주의: 롤백 시 타임존 정보가 손실됨 (UTC 기준으로 변환된 후 타임존 제거)

ALTER TABLE admin_user
  ALTER COLUMN last_login_at TYPE TIMESTAMP USING last_login_at AT TIME ZONE 'UTC',
  ALTER COLUMN locked_until  TYPE TIMESTAMP USING locked_until  AT TIME ZONE 'UTC',
  ALTER COLUMN created_at    TYPE TIMESTAMP USING created_at    AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at    TYPE TIMESTAMP USING updated_at    AT TIME ZONE 'UTC';

ALTER TABLE role
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE role_menu
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC';

ALTER TABLE menu
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE site
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE admin_user_site
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC';

ALTER TABLE code_group
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE code_detail
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE page_template
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE page_data
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE page_file
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC';

ALTER TABLE tsx_generation
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC';

ALTER TABLE slug_registry
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE api_info
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE message_resource
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC',
  ALTER COLUMN updated_at TYPE TIMESTAMP USING updated_at AT TIME ZONE 'UTC';

ALTER TABLE error_log
  ALTER COLUMN created_at TYPE TIMESTAMP USING created_at AT TIME ZONE 'UTC';
```

---

## BE 코드 변경 내용

### Entity (18개)
- `import java.time.LocalDateTime` → `import java.time.OffsetDateTime`
- 모든 날짜 필드 타입 변경

### DTO (11개)
- `AdminDto`, `ApiInfoResponse`, `MenuResponse`, `MessageResourceDto`,
  `PageDataResponse`, `PageFileResponse`, `PageTemplateResponse`,
  `SiteDto`, `SlugRegistryResponse`, `TsxGenerationResponse`

### Service (2개)
- `AuthService`: `LocalDateTime.now()` → `OffsetDateTime.now()`
- `PageDataService`: `toLocalDateTime()` → `toOffsetDateTime()`

### Jackson 설정 (신규)
- `OffsetDateTime` ISO-8601 직렬화 설정 추가

---

## FE 영향

API Response 날짜 포맷 변경:
- 변경 전: `"2026-05-30T14:30:00"
- 변경 후: `"2026-05-30T05:30:00Z"` (UTC) 또는 `"2026-05-30T14:30:00+09:00"` (KST)


JavaScript `new Date()`, `dayjs()` 모두 ISO-8601 타임존 포함 포맷 파싱 가능 → FE 코드 변경 불필요
