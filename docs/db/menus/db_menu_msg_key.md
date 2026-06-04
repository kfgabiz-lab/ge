# DB 설계 문서 — 메뉴 관리 다국어 키 컬럼 추가

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 메뉴 관리 다국어 키 연동 |
| 작성일 | 2026-06-01 |
| 관련 테이블 | menu(변경), message_resource(데이터 추가) |

메뉴명/메뉴설명에 다국어를 적용하기 위해 `message_resource` 연동 키 컬럼을 추가한다.
기존 `name`, `description` 컬럼은 한국어 기본값으로 유지하고,
다국어 조회 시에는 `name_msg_key`, `description_msg_key`를 통해 `message_resource`에서 언어별 값을 가져온다.

---

## 2. 테이블 변경

### 2-1. `menu` — 다국어 키 컬럼 추가

| 컬럼 | 타입 | NULL | 설명 |
|---|---|---|---|
| `name_msg_key` | TEXT | YES | message_resource.key 참조 (예: `menu.1.name`) |
| `description_msg_key` | TEXT | YES | message_resource.key 참조 (예: `menu.1.description`) |

**기존 컬럼 유지:**

| 컬럼 | 타입 | NULL | 설명 |
|---|---|---|---|
| `name` | VARCHAR(50) | NO | 한국어 메뉴명 (기본값 유지) |
| `description` | VARCHAR(500) | YES | 한국어 메뉴 설명 (기본값 유지) |

---

## 3. message_resource 키 규약

메뉴 생성 시 아래 패턴으로 `message_resource` 행을 자동 생성한다.

| 대상 | key 패턴 | resource_type | 비고 |
|---|---|---|---|
| 메뉴명 | `menu.{id}.name` | `WORD` | 고정 |
| 메뉴 설명 | `menu.{id}.description` | `WORD` 또는 `SENTENCE` | 입력 시 선택 |

- 메뉴 수정 시: 해당 key의 `ko`, `en`, `resource_type` 값 업데이트
- 메뉴 삭제 시: 해당 key 2건 `message_resource`에서 삭제

---

## 4. DDL

```sql
-- menu 테이블 다국어 키 컬럼 추가
ALTER TABLE menu ADD COLUMN name_msg_key TEXT;
ALTER TABLE menu ADD COLUMN description_msg_key TEXT;
```

---

## 5. 변경 영향도

| 테이블 | 변경 내용 | 비고 |
|---|---|---|
| `menu` | `name_msg_key`, `description_msg_key` 컬럼 추가 (NULL 허용) | 기존 데이터 영향 없음 |
| `message_resource` | 메뉴 CRUD 시 행 자동 생성/수정/삭제 | 스키마 변경 없음 |
