# 홈페이지(Site) BE 상세 설계서

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 홈페이지(Site) 관리 |
| 작성일 | 2026-05-14 |
| 관련 DB 문서 | docs/db/site/db_site.md |

글로벌/리전 개념의 홈페이지를 관리하는 API.  
관리자별 홈페이지 매핑(admin_user_site) 포함.  
관리자(admin_user)·권한(role)은 홈페이지와 무관하게 공통 유지.

---

## 2. API 명세

### 2-1. 홈페이지 목록 조회

- **Endpoint**: `GET /api/v1/sites`
- **Description**: 전체 홈페이지 목록을 조회합니다.
- **Query Params**:
  - `isActive` (Boolean, Optional): 사용여부 필터 (`true` / `false`)
- **Response**: `List<SiteDto.Response>`

**응답 예시**
```json
[
  {
    "id": 1,
    "name": "북미홈페이지",
    "description": "북미홈페이지 관리",
    "isActive": true,
    "createdBy": "system",
    "createdAt": "2026-05-14T00:00:00Z",
    "updatedBy": "system",
    "updatedAt": "2026-05-14T00:00:00Z"
  }
]
```

---

### 2-2. 홈페이지 단건 조회

- **Endpoint**: `GET /api/v1/sites/{id}`
- **Description**: 특정 홈페이지의 상세 정보를 조회합니다.
- **Path Params**: `id` (BIGINT, 필수)
- **Response**: `SiteDto.Response`

---

### 2-3. 홈페이지 등록

- **Endpoint**: `POST /api/v1/sites`
- **Description**: 새로운 홈페이지를 등록합니다.
- **Request Body**: `SiteDto.CreateRequest`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | String | ✓ | 홈페이지명 (최대 255자) |
| `description` | String | | 설명 |
| `isActive` | Boolean | ✓ | 사용여부 (기본값: true) |

- **Response**: `SiteDto.Response` (HTTP 201 Created)

---

### 2-4. 홈페이지 수정

- **Endpoint**: `PATCH /api/v1/sites/{id}`
- **Description**: 특정 홈페이지 정보를 부분 수정합니다.
- **Path Params**: `id` (BIGINT, 필수)
- **Request Body**: `SiteDto.UpdateRequest`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | String | ✓ | 홈페이지명 |
| `description` | String | | 설명 |
| `isActive` | Boolean | ✓ | 사용여부 |

- **Response**: `SiteDto.Response`

---

### 2-5. 홈페이지 삭제

- **Endpoint**: `DELETE /api/v1/sites/{id}`
- **Description**: 특정 홈페이지를 삭제합니다. 연관 데이터(menu, code_group 등)가 있으면 삭제를 거부합니다.
- **Path Params**: `id` (BIGINT, 필수)
- **Response**: HTTP 204 No Content

---

### 2-6. 관리자별 홈페이지 매핑 조회

- **Endpoint**: `GET /api/v1/admin-users/{id}/sites`
- **Description**: 특정 관리자에게 매핑된 홈페이지 목록을 조회합니다.
- **Path Params**: `id` (BIGINT, 관리자 ID, 필수)
- **Response**: `List<SiteDto.Response>`

**응답 예시**
```json
[
  { "id": 1, "name": "북미홈페이지", "isActive": true },
  { "id": 2, "name": "유럽홈페이지", "isActive": true }
]
```

---

### 2-7. 관리자 홈페이지 매핑 일괄 변경

- **Endpoint**: `PUT /api/v1/admin-users/{id}/sites`
- **Description**: 특정 관리자의 홈페이지 매핑을 일괄 교체합니다. 기존 매핑을 모두 삭제하고 전달된 siteId 목록으로 재등록합니다.
- **Path Params**: `id` (BIGINT, 관리자 ID, 필수)
- **Request Body**:

```json
{ "siteIds": [1, 2] }
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `siteIds` | List\<Long\> | ✓ | 매핑할 홈페이지 ID 목록 (빈 배열 허용 → 전체 해제) |

- **Response**: HTTP 200 OK, `List<SiteDto.Response>` (변경 후 매핑된 목록)

---

## 3. DTO 구조

```java
public class SiteDto {

    /** 등록 요청 */
    public static class CreateRequest {
        @NotBlank
        private String name;
        private String description;
        @NotNull
        private Boolean isActive;
    }

    /** 수정 요청 */
    public static class UpdateRequest {
        @NotBlank
        private String name;
        private String description;
        @NotNull
        private Boolean isActive;
    }

    /** 응답 */
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private Boolean isActive;
        private String createdBy;
        private String createdAt;
        private String updatedBy;
        private String updatedAt;
    }

    /** 관리자-홈페이지 매핑 변경 요청 */
    public static class SiteMappingRequest {
        @NotNull
        private List<Long> siteIds;
    }
}
```

---

## 4. 유효성 검사

| 필드 | 규칙 | HTTP Status | 메시지 |
|---|---|---|---|
| `name` | 필수값, 255자 이내 | 400 | "홈페이지명을 입력해주세요." |
| `isActive` | 필수값(Boolean) | 400 | "사용여부 값은 필수입니다." |
| `siteIds` | 필수값(Not Null), 존재하지 않는 siteId 포함 시 | 400 | "유효하지 않은 홈페이지 ID가 포함되어 있습니다." |

---

## 5. 예외 처리 정책

| 예외 상황 | HTTP Status | Error Code | 메시지 |
|---|---|---|---|
| 홈페이지 미존재 | 404 Not Found | `SITE_NOT_FOUND` | "해당 홈페이지를 찾을 수 없습니다." |
| 관리자 미존재 | 404 Not Found | `ADMIN_NOT_FOUND` | "해당 관리자를 찾을 수 없습니다." |
| 연관 데이터 있을 때 삭제 시도 | 409 Conflict | `SITE_HAS_DATA` | "해당 홈페이지에 연결된 데이터가 존재하여 삭제할 수 없습니다." |
| 유효하지 않은 siteId 포함 | 400 Bad Request | `INVALID_SITE_ID` | "유효하지 않은 홈페이지 ID가 포함되어 있습니다." |

---

## 6. 구현 대상 파일 (BE)

| 파일 | 설명 |
|---|---|
| `entity/Site.java` | site 테이블 엔티티 |
| `entity/AdminUserSite.java` | admin_user_site 테이블 엔티티 (복합 PK) |
| `dto/SiteDto.java` | CreateRequest / UpdateRequest / Response / SiteMappingRequest |
| `repository/SiteRepository.java` | JPA Repository |
| `repository/AdminUserSiteRepository.java` | JPA Repository (deleteByAdminUserId 등) |
| `service/SiteService.java` | CRUD 비즈니스 로직, 매핑 일괄 변경 |
| `controller/SiteController.java` | `/api/v1/sites` 엔드포인트 |
| `controller/AdminUserSiteController.java` | `/api/v1/admin-users/{id}/sites` 엔드포인트 |

---

## 7. 도메인 로직

- **매핑 일괄 변경**: `PUT /admin-users/{id}/sites` 호출 시 기존 `admin_user_site` 레코드를 `deleteByAdminUserId`로 전체 삭제 후, 전달된 `siteIds`로 재삽입 (role_menu 패턴 동일)
- **연관 데이터 삭제 보호**: 홈페이지 삭제 시 `menu`, `code_group`, `page_data`, `page_template`에 해당 `site_id`가 존재하면 409 반환
- **감사 컬럼**: `created_by`, `created_at`, `updated_by`, `updated_at` — Spring Security `SecurityContextHolder`에서 현재 사용자 추출하여 자동 기록
