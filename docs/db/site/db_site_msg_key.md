# DB 설계 문서 — 사이트 관리 다국어 키 컬럼 추가

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 사이트 관리 다국어 키 연동 |
| 작성일 | 2026-06-01 |
| 관련 테이블 | site(변경), message_resource(데이터 추가) |

사이트명에 다국어를 적용하기 위해 `message_resource` 연동 키 컬럼을 추가한다.
기존 `name` 컬럼은 한국어 기본값으로 유지하며,
현재 `name` 컬럼에 message_resource.key 값이 잘못 저장된 경우 마이그레이션으로 정정한다.

---

## 2. 테이블 변경

### 2-1. `site` — 다국어 키 컬럼 추가

| 컬럼 | 타입 | NULL | 설명 |
|---|---|---|---|
| `name_msg_key` | TEXT | YES | message_resource.key 참조 (예: `site.1.name`) |

**기존 컬럼 유지:**

| 컬럼 | 타입 | NULL | 설명 |
|---|---|---|---|
| `name` | TEXT | NO | 한국어 사이트명 (기본값 유지) |

---

## 3. message_resource 키 규약

사이트 생성 시 아래 패턴으로 `message_resource` 행을 자동 생성한다.

| 대상 | key 패턴 | resource_type | 비고 |
|---|---|---|---|
| 사이트명 | `site.{id}.name` | `WORD` | 고정 |

- 사이트 수정 시: 해당 key의 `ko`, `en` 값 업데이트
- 사이트 삭제 시: 해당 key `message_resource`에서 삭제

---

## 4. DDL

```sql
-- site 테이블 다국어 키 컬럼 추가
ALTER TABLE site ADD COLUMN name_msg_key TEXT;
```

---

## 5. 기존 데이터 마이그레이션

현재 `site.name` 컬럼에 message_resource.key 값이 저장되어 있을 수 있다.
신규 저장 방식 적용 후 기존 데이터는 수동 정정이 필요하다.

```sql
-- 기존 데이터 확인용 쿼리
SELECT id, name FROM site;

-- name에 한글명이 들어가 있는 정상 데이터는 name_msg_key를 NULL로 유지
-- name에 message_resource.key가 들어가 있는 경우:
--   1. name 컬럼을 해당 key의 ko 값으로 업데이트
--   2. name_msg_key에 해당 key 값 이동
```

---

## 6. 변경 영향도

| 테이블 | 변경 내용 | 비고 |
|---|---|---|
| `site` | `name_msg_key` 컬럼 추가 (NULL 허용) | 기존 데이터 영향 없음, 수동 마이그레이션 별도 |
| `message_resource` | 사이트 CRUD 시 행 자동 생성/수정/삭제 | 스키마 변경 없음 |
