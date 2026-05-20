# [다국어 관리] BE 상세 설계서

- **버전:** v1
- **작성일:** 2026-05-18
- **작성자:** Architect Agent
- **DB 설계서:** `docs/db/i18n/db_i18n.md`

---

## 1. 개요

| 항목 | 내용 |
|:---|:---|
| 기능명 | 다국어(message_resource) CRUD 관리 |
| 경로 | `GET/POST/PUT/DELETE /api/v1/message-resources` |
| 접근 권한 | SUPER_ADMIN 전용 |
| DB 설계서 | `docs/db/i18n/db_i18n.md` |

---

## 2. 패키지 구조

```
com.ge.bo
├── controller/
│   └── MessageResourceController.java
├── service/
│   └── MessageResourceService.java
├── repository/
│   └── MessageResourceRepository.java
├── entity/
│   └── MessageResource.java
└── dto/
    └── MessageResourceDto.java
        ├── SearchRequest   (검색 파라미터)
        ├── CreateRequest   (등록 요청)
        ├── UpdateRequest   (수정 요청 — key 제외)
        └── Response        (응답)
```

---

## 3. API 명세

### 3.1 목록 조회 (검색 포함)

| 항목 | 내용 |
|:---|:---|
| Method | `GET` |
| Path | `/api/v1/message-resources` |
| 트랜잭션 | `@Transactional(readOnly = true)` |

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|:---|:---|:---:|:---|
| `key` | String | N | 번역 키 (부분 일치) |
| `ko` | String | N | 한국어 텍스트 (부분 일치) |
| `en` | String | N | 영어 텍스트 (부분 일치) |
| `active` | Boolean | N | 사용여부 (미입력 시 전체 조회) |
| `page` | int | N | 페이지 번호 (0부터, 기본값 0) |
| `size` | int | N | 페이지 크기 (기본값 20) |

**비즈니스 로직:**
- 입력된 검색 조건만 AND 조합으로 적용 (미입력 조건 제외)
- `key`, `ko`, `en`은 LIKE 부분 일치 검색
- 정렬 기준: `created_at DESC`

**Response Body:**
```json
{
  "content": [
    {
      "id": 1,
      "key": "BTN.SAVE",
      "ko": "저장",
      "en": "Save",
      "active": true,
      "createdBy": "admin",
      "createdAt": "2026-05-18T10:00:00",
      "updatedBy": "admin",
      "updatedAt": "2026-05-18T10:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "size": 20
}
```

---

### 3.2 등록

| 항목 | 내용 |
|:---|:---|
| Method | `POST` |
| Path | `/api/v1/message-resources` |
| 권한 | SUPER_ADMIN |
| 트랜잭션 | `@Transactional` |

**Request Body:**
```json
{
  "key": "BTN.SAVE",
  "ko": "저장",
  "en": "Save"
}
```

**비즈니스 로직:**
1. `key` 중복 확인 → 중복 시 `409 CONFLICT`
2. `active` 기본값 `true` 고정
3. `created_by` / `updated_by` JWT 토큰에서 추출한 관리자 ID 자동 주입
4. 저장 후 `MessageResourceDto.Response` 반환

**Response Body:** `MessageResourceDto.Response` (단건)

---

### 3.3 수정

| 항목 | 내용 |
|:---|:---|
| Method | `PUT` |
| Path | `/api/v1/message-resources/{id}` |
| 권한 | SUPER_ADMIN |
| 트랜잭션 | `@Transactional` |

**Request Body:**
```json
{
  "ko": "저장하기",
  "en": "Save",
  "active": true
}
```

**비즈니스 로직:**
1. 존재하지 않는 `id` → `404 NOT_FOUND`
2. `key` 변경 불가 — UpdateRequest에 key 필드 미포함
3. `updated_by` JWT 토큰에서 추출한 관리자 ID 자동 주입
4. 수정 후 `MessageResourceDto.Response` 반환

---

### 3.4 삭제

| 항목 | 내용 |
|:---|:---|
| Method | `DELETE` |
| Path | `/api/v1/message-resources/{id}` |
| 권한 | SUPER_ADMIN |
| 트랜잭션 | `@Transactional` |

**비즈니스 로직:**
1. 존재하지 않는 `id` → `404 NOT_FOUND`
2. 검증 통과 시 삭제
3. 응답: `200 OK` (본문 없음)

---

## 4. BE Validation (입력값 검증)

### 4.1 CreateRequest

| 필드 | 어노테이션 | 규칙 | 오류 메시지 |
|:---|:---|:---|:---|
| `key` | `@NotBlank` | 필수 입력 | "번역 키를 입력해주세요." |
| `key` | `@Size(max=255)` | 최대 255자 | "번역 키는 255자 이하여야 합니다." |
| `key` | `@Pattern(regexp="^[a-zA-Z0-9.]+$")` | 영문·숫자·점(.)만 허용 | "번역 키는 영문, 숫자, 점(.)만 입력 가능합니다." |
| `ko` | `@NotBlank` | 필수 입력 | "한국어를 입력해주세요." |
| `ko` | `@Size(max=500)` | 최대 500자 | "한국어는 500자 이하여야 합니다." |
| `en` | `@Size(max=500)` | 최대 500자 (선택) | "영어는 500자 이하여야 합니다." |

### 4.2 UpdateRequest

| 필드 | 어노테이션 | 규칙 | 오류 메시지 |
|:---|:---|:---|:---|
| `ko` | `@NotBlank` | 필수 입력 | "한국어를 입력해주세요." |
| `ko` | `@Size(max=500)` | 최대 500자 | "한국어는 500자 이하여야 합니다." |
| `en` | `@Size(max=500)` | 최대 500자 (선택) | "영어는 500자 이하여야 합니다." |
| `active` | `@NotNull` | 필수 입력 | "사용여부를 입력해주세요." |

---

## 5. 보안 매트릭스

| API | 허용 Role | 비고 |
|:---|:---|:---|
| `GET /api/v1/message-resources` | SUPER_ADMIN | |
| `POST /api/v1/message-resources` | SUPER_ADMIN | |
| `PUT /api/v1/message-resources/{id}` | SUPER_ADMIN | |
| `DELETE /api/v1/message-resources/{id}` | SUPER_ADMIN | |

---

## 6. 트랜잭션 전략

| 메서드 | 전파 속성 | readOnly | 비고 |
|:---|:---|:---:|:---|
| `getList()` | `REQUIRED` | ✅ | 조회 전용 최적화 |
| `create()` | `REQUIRED` | ❌ | key 중복 확인 + 저장 원자성 보장 |
| `update()` | `REQUIRED` | ❌ | 존재 확인 + 수정 원자성 보장 |
| `delete()` | `REQUIRED` | ❌ | 존재 확인 + 삭제 원자성 보장 |

---

## 7. 예외 매핑

| 예외 상황 | HTTP Status | Error Code | 사용자 메시지 |
|:---|:---:|:---|:---|
| 번역 키 중복 | 409 | `DUPLICATE_MESSAGE_KEY` | "이미 사용 중인 번역 키입니다." |
| 항목 미존재 | 404 | `MESSAGE_RESOURCE_NOT_FOUND` | "다국어 항목을 찾을 수 없습니다." |
| 입력값 유효성 오류 | 400 | `VALIDATION_ERROR` | 필드별 오류 메시지 반환 |
| 권한 없음 | 403 | `AUTH_001` | "접근 권한이 없습니다." |

---

## 8. BE 개발 체크리스트

### N.1 API 명세
- [ ] GET `/api/v1/message-resources` — 검색 파라미터 4개(key·ko·en·active) AND 조합 동작
- [ ] POST `/api/v1/message-resources` — 등록 및 key 중복 409 처리
- [ ] PUT `/api/v1/message-resources/{id}` — 수정 (key 불변 확인)
- [ ] DELETE `/api/v1/message-resources/{id}` — 삭제 및 404 처리

### N.2 유효성 검사
- [ ] key: `@Pattern(regexp="^[a-zA-Z0-9.]+$")` 적용
- [ ] ko: `@NotBlank` 적용
- [ ] en: `@Size(max=500)` 선택 입력 처리
- [ ] active: UpdateRequest에서 `@NotNull` 적용

### N.3 비즈니스 로직
- [ ] key 중복 확인 로직 구현
- [ ] created_by / updated_by JWT 자동 주입 구현
- [ ] active 기본값 true 처리

### N.4 보안 및 예외 처리
- [ ] 404 / 409 예외 GlobalExceptionHandler 처리 확인
- [ ] SUPER_ADMIN 권한 체크 적용

### N.5 코드 품질
- [ ] `./gradlew build` BUILD SUCCESSFUL 확인
- [ ] 하드코딩 잔재 없음
- [ ] 공통 자산(`docs/common/be/`) 중복 개발 여부 확인
