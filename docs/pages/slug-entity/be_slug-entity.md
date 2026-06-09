# Slug Entity BE 상세 설계서

## 1. 개요
- **도메인**: Slug Entity — 빌더 연동용 엔티티 구조(필드) 정의 관리 CRUD
- **DB 설계**: [db_slug-entity.md](../../db/slug-entity/db_slug-entity.md)
- **패키지 경로**: `com.ge.bo`

---

## 2. 파일 구조

```
com.ge.bo/
├── entity/
│   ├── SlugEntity.java
│   └── SlugEntityField.java
├── dto/
│   ├── SlugEntityRequest.java          # entity 등록/수정 요청
│   ├── SlugEntityResponse.java         # entity 응답 (필드 목록 포함)
│   ├── SlugEntityFieldRequest.java     # 필드 단건 요청
│   └── SlugEntityFieldResponse.java    # 필드 단건 응답
├── repository/
│   ├── SlugEntityRepository.java
│   └── SlugEntityFieldRepository.java
├── service/
│   └── SlugEntityService.java
└── controller/
    └── SlugEntityController.java
```

---

## 3. 엔티티 설계

### 3.1 SlugEntity

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | @Id, IDENTITY | PK |
| slug | slug | String | @Column(length=100, unique=true, NOT NULL) | 식별자 (등록 후 수정 불가) |
| name | name | String | @Column(length=100, NOT NULL) | 표시명 |
| tableName | table_name | String | @Column(length=100, NOT NULL) | DB 테이블명 |
| description | description | String | @Column(columnDefinition="TEXT", NULL) | 상세 설명 |
| active | active | Boolean | @Column(NOT NULL, default=true) | 사용여부 |
| fields | - | List\<SlugEntityField\> | @OneToMany(mappedBy="entity", cascade=ALL, orphanRemoval=true) | 필드 목록 |
| createdBy~updatedAt | - | - | JPA Auditing 4개 | 감사 컬럼 |

### 3.2 SlugEntityField

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | @Id, IDENTITY | PK |
| entity | entity_id | SlugEntity | @ManyToOne(fetch=LAZY) | 소속 entity |
| fieldName | field_name | String | @Column(length=100, NOT NULL) | Java 필드명 |
| columnName | column_name | String | @Column(length=100, NOT NULL) | DB 컬럼명 |
| javaType | java_type | String | @Column(length=50, NOT NULL) | Java 타입 |
| columnType | column_type | String | @Column(length=50, NULL) | DB 타입 |
| columnLength | column_length | Integer | @Column(NULL) | 길이 |
| isPk | is_pk | Boolean | @Column(NOT NULL, default=false) | PK 여부 |
| isNullable | is_nullable | Boolean | @Column(NOT NULL, default=true) | NULL 허용 여부 |
| defaultValue | default_value | String | @Column(length=200, NULL) | 기본값 |
| description | description | String | @Column(length=500, NULL) | 컬럼 설명 |
| sortOrder | sort_order | Integer | @Column(NOT NULL, default=0) | 표시 순서 |
| createdBy~updatedAt | - | - | JPA Auditing 4개 | 감사 컬럼 |

### 3.3 DTO

**SlugEntityRequest** (entity 등록/수정):

| 필드 | 타입 | 필수 | Bean Validation | 비고 |
|:---|:---|:---|:---|:---|
| slug | String | Y | @NotBlank, @Size(max=100), @Pattern(^[a-zA-Z0-9_-]+$) | 영문/숫자/하이픈/언더스코어 |
| name | String | Y | @NotBlank, @Size(max=100) | 표시명 |
| tableName | String | Y | @NotBlank, @Size(max=100) | DB 테이블명 |
| description | String | N | - | 상세 설명 |
| active | Boolean | N | - | 미입력 시 true |

**SlugEntityFieldRequest** (필드 단건):

| 필드 | 타입 | 필수 | Bean Validation | 비고 |
|:---|:---|:---|:---|:---|
| fieldName | String | Y | @NotBlank, @Size(max=100) | Java 필드명 |
| columnName | String | Y | @NotBlank, @Size(max=100) | DB 컬럼명 |
| javaType | String | Y | @NotBlank, @Pattern(^(String\|Long\|Integer\|Boolean\|LocalDateTime\|LocalDate\|BigDecimal)$) | Java 타입 |
| columnType | String | N | @Size(max=50) | DB 타입 |
| columnLength | Integer | N | - | 길이 |
| isPk | Boolean | N | - | 미입력 시 false |
| isNullable | Boolean | N | - | 미입력 시 true |
| defaultValue | String | N | @Size(max=200) | 기본값 |
| description | String | N | @Size(max=500) | 컬럼 설명 |
| sortOrder | Integer | N | - | 미입력 시 0 |

**SlugEntityResponse** (응답):

| 필드 | 타입 | 설명 |
|:---|:---|:---|
| id | Long | PK |
| slug | String | 식별자 |
| name | String | 표시명 |
| tableName | String | DB 테이블명 |
| description | String | 상세 설명 |
| active | Boolean | 사용여부 |
| fieldCount | Integer | 필드 수 |
| fields | List\<SlugEntityFieldResponse\> | 필드 목록 (sortOrder ASC) |
| createdBy | String | 등록자 |
| createdAt | OffsetDateTime | 등록일시 |
| updatedBy | String | 수정자 |
| updatedAt | OffsetDateTime | 수정일시 |

---

## 4. API 엔드포인트 명세

| Method | URL | 설명 | 권한 | 성공 코드 |
|:---|:---|:---|:---|:---|
| GET | `/api/v1/slug-entity` | entity 목록 조회 (페이징 + 검색) | SUPER_ADMIN | 200 |
| GET | `/api/v1/slug-entity/active` | 활성 entity 목록 (빌더용, 페이징 없음) | 인증 사용자 | 200 |
| GET | `/api/v1/slug-entity/{id}` | entity 단건 조회 (필드 포함) | SUPER_ADMIN | 200 |
| POST | `/api/v1/slug-entity` | entity 등록 | SUPER_ADMIN | 201 |
| PUT | `/api/v1/slug-entity/{id}` | entity 수정 | SUPER_ADMIN | 200 |
| DELETE | `/api/v1/slug-entity/{id}` | entity 삭제 (필드 CASCADE) | SUPER_ADMIN | 204 |
| PUT | `/api/v1/slug-entity/{id}/fields` | 필드 목록 일괄 저장 | SUPER_ADMIN | 200 |

---

### 4.1 GET `/api/v1/slug-entity` — 목록 조회

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|:---|:---|:---|:---|
| page | int | N | 페이지 번호 (0-based, 기본 0) |
| size | int | N | 페이지 크기 (기본 20) |
| keyword | String | N | slug / name 부분 검색 |

**Response Body (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "slug": "member",
      "name": "회원",
      "tableName": "tb_member",
      "description": "회원 엔티티",
      "active": true,
      "fieldCount": 4,
      "fields": [],
      "createdBy": "admin",
      "createdAt": "2026-06-07T00:00:00+09:00",
      "updatedBy": "admin",
      "updatedAt": "2026-06-07T00:00:00+09:00"
    }
  ],
  "totalElements": 3,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

> 목록 조회 시 `fields`는 빈 배열로 반환. 필드 상세는 단건 조회(/id) 또는 필드 API로 조회.

---

### 4.2 GET `/api/v1/slug-entity/active` — 활성 목록 (빌더용)

- `active=true`인 전체 목록 반환 (페이징 없음)
- slug ASC 정렬
- 필드 목록 포함 반환 (빌더에서 필드 매핑에 사용)

**Response Body (200 OK):**
```json
[
  {
    "id": 1,
    "slug": "member",
    "name": "회원",
    "tableName": "tb_member",
    "active": true,
    "fieldCount": 4,
    "fields": [
      { "id": 1, "fieldName": "id", "columnName": "id", "javaType": "Long", "isPk": true, "isNullable": false, "sortOrder": 0 },
      { "id": 2, "fieldName": "memberName", "columnName": "member_name", "javaType": "String", "isPk": false, "isNullable": false, "sortOrder": 1 }
    ]
  }
]
```

---

### 4.3 GET `/api/v1/slug-entity/{id}` — 단건 조회

- 필드 목록 포함 반환 (sortOrder ASC)

**Response Body (200 OK):** SlugEntityResponse (fields 포함)

---

### 4.4 POST `/api/v1/slug-entity` — entity 등록

**Request Body:**
```json
{
  "slug": "member",
  "name": "회원",
  "tableName": "tb_member",
  "description": "회원 엔티티",
  "active": true
}
```

**Response (201 Created):** SlugEntityResponse

---

### 4.5 PUT `/api/v1/slug-entity/{id}` — entity 수정

- slug는 수정 불가 (서비스에서 무시)

**Request Body:** SlugEntityRequest
**Response (200 OK):** SlugEntityResponse

---

### 4.6 DELETE `/api/v1/slug-entity/{id}` — entity 삭제

- ON DELETE CASCADE로 하위 slug_entity_field 자동 삭제

**Response (204 No Content)**

---

### 4.7 PUT `/api/v1/slug-entity/{id}/fields` — 필드 목록 일괄 저장

- 기존 필드 전체 삭제 후 요청 목록으로 재삽입 (orphanRemoval 활용)
- FE에서 인라인 편집 후 "저장" 클릭 시 호출

**Request Body:**
```json
[
  { "fieldName": "id", "columnName": "id", "javaType": "Long", "isPk": true, "isNullable": false, "sortOrder": 0 },
  { "fieldName": "memberName", "columnName": "member_name", "javaType": "String", "columnType": "VARCHAR", "columnLength": 100, "isPk": false, "isNullable": false, "sortOrder": 1 },
  { "fieldName": "createdAt", "columnName": "created_at", "javaType": "LocalDateTime", "columnType": "TIMESTAMP", "isPk": false, "isNullable": true, "sortOrder": 2 }
]
```

**Response (200 OK):** SlugEntityResponse (갱신된 필드 목록 포함)

---

## 5. 비즈니스 로직 상세

### 5.1 entity 등록

```mermaid
flowchart TD
    A[POST /slug-entity] --> B[@Valid 검증]
    B -- 실패 --> C[400 VALIDATION_FAILED]
    B -- 성공 --> D[slug 중복 확인]
    D -- 중복 --> E[409 SLUG_ENTITY_SLUG_DUPLICATE]
    D -- 없음 --> F[entity 저장]
    F --> G[201 Created]
```

### 5.2 필드 일괄 저장

```mermaid
flowchart TD
    A[PUT /slug-entity/id/fields] --> B[entity 존재 확인]
    B -- 없음 --> C[404 SLUG_ENTITY_NOT_FOUND]
    B -- 있음 --> D[@Valid 검증]
    D -- 실패 --> E[400 VALIDATION_FAILED]
    D -- 성공 --> F[기존 fields 전체 clear]
    F --> G[요청 목록 순서대로 재삽입]
    G --> H[200 OK - 갱신된 entity 반환]
```

**핵심 비즈니스 규칙:**
1. fields clear → 재삽입 방식 (orphanRemoval=true 활용)
2. sortOrder는 요청 배열의 index 순서 그대로 0부터 재부여
3. isPk / isNullable 미입력 시 각각 false / true 기본값 적용

---

## 6. Validation 상세

### 6.1 Controller 레벨 (Bean Validation)

| 필드 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|
| slug | @NotBlank, @Size(max=100), @Pattern(^[a-zA-Z0-9_-]+$) | slug는 영문/숫자/하이픈/언더스코어만 가능합니다. |
| name | @NotBlank, @Size(max=100) | 표시명을 입력해주세요. |
| tableName | @NotBlank, @Size(max=100) | DB 테이블명을 입력해주세요. |
| fieldName | @NotBlank, @Size(max=100) | 필드명을 입력해주세요. |
| columnName | @NotBlank, @Size(max=100) | 컬럼명을 입력해주세요. |
| javaType | @NotBlank, @Pattern(허용값 7개) | 올바른 Java 타입을 선택해주세요. |

### 6.2 Service 레벨 (비즈니스 Validation)

| 검증 항목 | HTTP | Error Code | 에러 메시지 |
|:---|:---|:---|:---|
| slug 중복 | 409 | SLUG_ENTITY_SLUG_DUPLICATE | 이미 사용 중인 slug입니다. |
| entity 없음 | 404 | SLUG_ENTITY_NOT_FOUND | 해당 entity를 찾을 수 없습니다. |

---

## 7. 예외 매핑 테이블

| 예외 상황 | HTTP | Error Code | 사용자 메시지 |
|:---|:---|:---|:---|
| entity 없음 | 404 | SLUG_ENTITY_NOT_FOUND | 해당 entity를 찾을 수 없습니다. |
| slug 중복 | 409 | SLUG_ENTITY_SLUG_DUPLICATE | 이미 사용 중인 slug입니다. |
| 권한 부족 | 403 | FORBIDDEN | 접근 권한이 없습니다. |
| Validation 실패 | 400 | VALIDATION_FAILED | (필드별 메시지) |

---

## 8. 보안 매트릭스

| API | Method | 권한 | 비고 |
|:---|:---|:---|:---|
| `/api/v1/slug-entity` (관리) | GET, POST, PUT, DELETE | ROLE_SUPER_ADMIN | |
| `/api/v1/slug-entity/{id}/fields` | PUT | ROLE_SUPER_ADMIN | |
| `/api/v1/slug-entity/active` | GET | 인증 사용자 | 빌더 드롭다운 용도 |

---

## 9. Repository 쿼리 설계

**SlugEntityRepository:**

| 메서드명 | 용도 |
|:---|:---|
| `findAll(Specification, Pageable)` | 키워드 필터 + 페이징 목록 조회 |
| `findAllByActiveTrueOrderBySlugAsc()` | 빌더용 활성 목록 |
| `existsBySlug(String)` | slug 중복 확인 (등록 시) |

**SlugEntityFieldRepository:**

| 메서드명 | 용도 |
|:---|:---|
| `findAllByEntityIdOrderBySortOrderAsc(Long)` | entity별 필드 목록 조회 |
| `deleteAllByEntityId(Long)` | entity별 필드 전체 삭제 (일괄 저장 시) |

---

## 10. DataInitializer 처리

기존 `DataInitializer`에 추가:
- `initSlugEntityMenu()` — `/admin/settings/slug-entity` URL 없으면 Settings 하위에 메뉴 등록

---

## 11. BE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 11.1 엔티티 및 DB
- [ ] SlugEntity / SlugEntityField 엔티티 필드가 설계서와 일치하는가?
- [ ] slug에 UNIQUE 제약이 적용되었는가?
- [ ] @OneToMany cascade=ALL, orphanRemoval=true 설정이 되었는가?
- [ ] 감사 컬럼 4개가 JPA Auditing으로 자동 설정되는가?
- [ ] DataInitializer에 메뉴 등록이 포함되었는가?

### 11.2 API 엔드포인트
- [ ] GET `/api/v1/slug-entity` — 페이징 + 키워드 조회가 구현되었는가?
- [ ] GET `/api/v1/slug-entity/active` — 활성 목록 전체 조회가 구현되었는가?
- [ ] GET `/api/v1/slug-entity/{id}` — 단건 조회 (필드 포함)가 구현되었는가?
- [ ] POST `/api/v1/slug-entity` — 등록이 구현되었는가?
- [ ] PUT `/api/v1/slug-entity/{id}` — 수정이 구현되었는가?
- [ ] DELETE `/api/v1/slug-entity/{id}` — 삭제가 구현되었는가?
- [ ] PUT `/api/v1/slug-entity/{id}/fields` — 필드 일괄 저장이 구현되었는가?
- [ ] POST 성공 시 HTTP 201을 반환하는가?
- [ ] DELETE 성공 시 HTTP 204를 반환하는가?

### 11.3 비즈니스 로직
- [ ] slug 중복 시 409가 발생하는가?
- [ ] 필드 일괄 저장 시 기존 필드가 완전히 교체되는가?
- [ ] entity 삭제 시 하위 필드가 CASCADE로 삭제되는가?

### 11.4 보안
- [ ] 관리 API — ROLE_SUPER_ADMIN 권한이 적용되었는가?
- [ ] /active — 인증 사용자면 접근 가능한가?
