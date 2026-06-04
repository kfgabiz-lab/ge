# DB 마이그레이션: admin_user reg_dt/reg_tm 타입 및 데이터 수정

## 개요
- **목적**: reg_dt/reg_tm VARCHAR → DATE/TIME 타입 변환 + 빈 문자열 데이터 복구 + 타임존 명시
- **대상 테이블**: `admin_user`
- **변경 컬럼**: `reg_dt`, `reg_tm`

## 문제점
| # | 문제 | 내용 |
|---|------|------|
| 2 | 빈 문자열 | 기존 데이터 reg_dt, reg_tm 모두 '' (빈 문자열) |
| 3 | 날짜 연산 불가 | VARCHAR 타입으로 날짜 함수/인덱스 비효율 |
| 4 | 타임존 미명시 | OffsetDateTime.now() 시스템 타임존 의존 |

---

## 마이그레이션 SQL

```sql
-- ============================================================
-- 1단계: 기존 빈 문자열 데이터를 created_at 기준으로 복구 (KST 기준)
-- ============================================================
UPDATE admin_user
SET
  reg_dt = TO_CHAR((created_at AT TIME ZONE 'Asia/Seoul'), 'YYYYMMDD'),
  reg_tm = TO_CHAR((created_at AT TIME ZONE 'Asia/Seoul'), 'HH24MISS')
WHERE reg_dt = '' OR reg_tm = '';

-- ============================================================
-- 2단계: 타입 변경 VARCHAR → DATE / TIME
-- ============================================================
ALTER TABLE admin_user
  ALTER COLUMN reg_dt TYPE DATE
    USING TO_DATE(reg_dt, 'YYYYMMDD'),
  ALTER COLUMN reg_tm TYPE TIME
    USING TO_TIMESTAMP(reg_tm, 'HH24MISS')::TIME;
```

---

## 롤백 SQL

```sql
-- DATE/TIME → VARCHAR 롤백
ALTER TABLE admin_user
  ALTER COLUMN reg_dt TYPE CHARACTER VARYING(8)
    USING TO_CHAR(reg_dt, 'YYYYMMDD'),
  ALTER COLUMN reg_tm TYPE CHARACTER VARYING(6)
    USING TO_CHAR(reg_tm, 'HH24MISS');
```

---

## BE 코드 변경 내용

### AdminUser.java (Entity)
- `String regDt` → `LocalDate regDt`
- `String regTm` → `LocalTime regTm`
- `@PrePersist`: `OffsetDateTime.now()` → `OffsetDateTime.now(ZoneId.of("Asia/Seoul"))` 명시
- `now.format(DateTimeFormatter.ofPattern("yyyyMMdd"))` → `now.toLocalDate()`
- `now.format(DateTimeFormatter.ofPattern("HHmmss"))` → `now.toLocalTime()`

### AdminDto.java (DTO)
- `Response.regDt`: `String` → `LocalDate`
- `Response.regTm`: `String` → `LocalTime`

### AdminService.java
- 변경 없음 (`.regDt(user.getRegDt())` 타입만 자동 반영)
