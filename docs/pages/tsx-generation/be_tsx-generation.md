# TSX 생성 이력 BE 상세 설계서

## 1. 개요
- **도메인**: 페이지 메이커 `[생성]` 버튼 클릭 시 TSX 파일 생성과 동시에 이력을 저장
- **DB 설계**: [db_tsx-generation.md](../../db/tsx-generation/db_tsx-generation.md)
- **패키지 경로**: `com.ge.bo`
- **핵심 특징**:
  - `[생성]` 과 `[저장/수정]`(page_template) 완전 분리된 독립 도메인
  - 생성 이력의 `configJson`을 다시 불러와 빌더에서 재편집·재생성 가능
  - 동일 경로에 여러 이력이 누적됨 (덮어쓰기 X)

### 1.1 두 개의 API가 한 쌍으로 동작한다

`[생성]` 버튼 한 번에 **두 개의 API가 순차 호출**된다. 둘은 담당이 다르므로 혼동하지 말 것.

| 순서 | API | 담당 | DB |
|:---|:---|:---|:---|
| 1 | `POST /api/v1/page-templates/generate` | **실제 tsx 파일 쓰기** (디스크) | 저장 없음 |
| 2 | `POST /api/v1/tsx-generation` | **생성 이력 적재** (재편집용 configJson + tsxCode) | `tsx_generation` |

이 문서의 §2~§11은 **2번(이력)** 도메인 설계다. **1번(파일 쓰기)** 의 경로 규칙은 §12를 참고할 것.

### 1.2 이 API를 사용하는 빌더 (호출처)

`tsx-generation`은 특정 빌더 전용이 아니다. 페이지 메이커의 **모든 빌더가 공유하는 공통 이력 저장소**이며,
빌더마다 `templateType` 값만 다르게 넣어 구분한다.

| 빌더 화면 | 경로 | `templateType` | 생성 코드 종류 |
|:---|:---|:---|:---|
| List 빌더 | `/admin/templates/make/list` | `LIST` | 검색폼 + 테이블 고정 조합 |
| Grid-Layout 빌더 | `/admin/templates/make/grid-layout` | `LIST` | 검색폼 + 테이블 고정 조합 |
| Layer 빌더 | (레이어 팝업 계열) | `LAYER` | 팝업 컴포넌트 |
| **Widget 빌더** | `/admin/templates/make/widget` | **`PAGE`** | **위젯 타입별 블록 조립 (신규)** |

> Widget 빌더의 `PAGE` 타입 tsx 생성(= "파일빌드") FE 설계는
> [fe_tsx-generation_widget.md](./fe_tsx-generation_widget.md) 참고.

---

## 2. 파일 구조

```
com.ge.bo/
├── entity/
│   └── TsxGeneration.java
├── dto/
│   ├── TsxGenerationRequest.java        # 저장 요청 (생성 버튼 클릭 시)
│   └── TsxGenerationResponse.java       # 응답 (목록 + 단건 공통)
├── repository/
│   └── TsxGenerationRepository.java
├── service/
│   └── TsxGenerationService.java
└── controller/
    └── TsxGenerationController.java
```

---

## 3. 엔티티 설계

### 3.1 TsxGeneration

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | @Id, BIGSERIAL | PK |
| name | name | String | @Column(length=100, NOT NULL) | 이력 식별 이름 (ex: `게시판 목록`) |
| folderName | folder_name | String | @Column(length=100, NOT NULL) | 저장 폴더 경로 (ex: `admin/board`) |
| fileName | file_name | String | @Column(length=100, NOT NULL) | 저장 파일명 (ex: `page.tsx`) |
| templateType | template_type | String | @Column(length=20, NOT NULL) | `LIST` / `LAYER` / `PAGE` (§1.2 참고) |
| configJson | config_json | String | @Column(columnDefinition="text", NOT NULL) | 빌더 설정 JSON 전문 |
| tsxCode | tsx_code | String | @Column(columnDefinition="text", NOT NULL) | 생성된 TSX 코드 전문 |
| createdBy | created_by | String | @CreatedBy, @Column(length=100) | 생성자 |
| createdAt | created_at | LocalDateTime | @CreatedDate | 생성일시 |

**제약조건:**
- `name`, `folderName`, `fileName`, `templateType`, `configJson`, `tsxCode` NOT NULL
- `updated_at` 없음 — 생성 전용 이력 테이블 (수정 불가)
- JPA Auditing으로 `createdBy`, `createdAt` 자동 관리

### 3.2 DTO

**TsxGenerationRequest** (등록):

| 필드 | 타입 | 필수 | 검증 | 설명 |
|:---|:---|:---|:---|:---|
| name | String | Y | @NotBlank | 이력 식별 이름 |
| folderName | String | Y | @NotBlank | 저장 폴더 경로 |
| fileName | String | Y | @NotBlank | 저장 파일명 |
| templateType | String | Y | @NotBlank | `LIST` / `LAYER` / `PAGE` — 값 목록을 enum으로 강제하지 않음(문자열 그대로 저장) |
| configJson | String | Y | @NotBlank | 빌더 설정 JSON |
| tsxCode | String | Y | @NotBlank | 생성된 TSX 코드 |

**TsxGenerationResponse** (목록/단건 공통):

| 필드 | 타입 | 설명 |
|:---|:---|:---|
| id | Long | PK |
| name | String | 이력 식별 이름 |
| folderName | String | 저장 폴더 경로 |
| fileName | String | 저장 파일명 |
| templateType | String | `LIST` / `LAYER` / `PAGE` |
| configJson | String | 빌더 설정 JSON (재편집용) |
| tsxCode | String | 생성된 TSX 코드 전문 |
| createdBy | String | 생성자 |
| createdAt | LocalDateTime | 생성일시 |

---

## 4. API 엔드포인트 명세

| Method | URL | 설명 | 권한 | 성공 코드 |
|:---|:---|:---|:---|:---|
| POST | `/api/v1/tsx-generation` | 생성 이력 저장 | 인증된 관리자 | 201 |
| GET | `/api/v1/tsx-generation` | 이력 목록 조회 (페이징) | 인증된 관리자 | 200 |
| GET | `/api/v1/tsx-generation/{id}` | 단건 조회 (재편집용) | 인증된 관리자 | 200 |
| DELETE | `/api/v1/tsx-generation/{id}` | 이력 삭제 | 인증된 관리자 | 204 |

> **권한**: SUPER_ADMIN / EDITOR 모두 허용

---

## 5. 요청/응답 예시

### 5.1 생성 이력 저장

```
POST /api/v1/tsx-generation
Content-Type: application/json

{
  "name": "게시판 목록",
  "folderName": "admin/board",
  "fileName": "page.tsx",
  "templateType": "LIST",
  "configJson": "{\"templateType\":\"LIST\",\"searchRows\":[...],\"tableColumns\":[...]}",
  "tsxCode": "'use client';\nimport React from 'react';\n..."
}
```

**Response 201:** `TsxGenerationResponse`

---

### 5.2 이력 목록 조회

```
GET /api/v1/tsx-generation?templateType=LIST&page=0&size=20
```

**Query Params:**

| 파라미터 | 타입 | 기본값 | 설명 |
|:---|:---|:---|:---|
| templateType | String | - | `LIST` / `LAYER` / `PAGE` 필터 (선택) |
| page | int | 0 | 페이지 번호 (0-based) |
| size | int | 20 | 페이지 크기 |

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "게시판 목록",
      "folderName": "admin/board",
      "fileName": "page.tsx",
      "templateType": "LIST",
      "configJson": "{...}",
      "tsxCode": "'use client';...",
      "createdBy": "admin@example.com",
      "createdAt": "2026-04-13T10:00:00"
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "page": 0,
  "size": 20
}
```

---

### 5.3 단건 조회 (재편집용)

```
GET /api/v1/tsx-generation/1
```

**Response 200:** `TsxGenerationResponse` (configJson 포함 전체 필드)

---

### 5.4 이력 삭제

```
DELETE /api/v1/tsx-generation/1
```

**Response 204:** No Content

---

## 6. 비즈니스 로직 상세

### 6.1 생성 이력 저장

```mermaid
flowchart TD
    A[POST /tsx-generation] --> B[@Valid 검증]
    B -- 실패 --> C[400 VALIDATION_FAILED]
    B -- 성공 --> D[TsxGeneration 엔티티 생성]
    D --> E[저장]
    E --> F[201 Created + TsxGenerationResponse]
```

### 6.2 이력 목록 조회

```mermaid
flowchart TD
    A[GET /tsx-generation] --> B{templateType 파라미터?}
    B -- 있음 --> C[templateType 조건 추가]
    B -- 없음 --> D[전체 조회]
    C & D --> E[created_at DESC 정렬 + 페이징]
    E --> F[200 OK + 페이지 응답]
```

### 6.3 단건 조회

```mermaid
flowchart TD
    A["GET /tsx-generation/{id}"] --> B["id로 TsxGeneration 조회"]
    B -- 없음 --> C[404 TSX_GENERATION_NOT_FOUND]
    B -- 있음 --> D[200 OK + TsxGenerationResponse]
```

### 6.4 삭제

```mermaid
flowchart TD
    A["DELETE /tsx-generation/{id}"] --> B["id로 TsxGeneration 조회"]
    B -- 없음 --> C[404 TSX_GENERATION_NOT_FOUND]
    B -- 있음 --> D[삭제]
    D --> E[204 No Content]
```

---

## 7. Validation 상세

### 7.1 Controller 레벨 (Bean Validation)

| 필드 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|
| name | @NotBlank | 이름을 입력해주세요. |
| folderName | @NotBlank | 폴더명을 입력해주세요. |
| fileName | @NotBlank | 파일명을 입력해주세요. |
| templateType | @NotBlank | 템플릿 타입을 입력해주세요. |
| configJson | @NotBlank | 빌더 설정 JSON이 없습니다. |
| tsxCode | @NotBlank | 생성된 TSX 코드가 없습니다. |

### 7.2 Service 레벨 (비즈니스 Validation)

| 검증 항목 | HTTP | Error Code | 에러 메시지 |
|:---|:---|:---|:---|
| id로 이력 없음 | 404 | TSX_GENERATION_NOT_FOUND | 해당 생성 이력을 찾을 수 없습니다. |

---

## 8. 예외 매핑 테이블

| 예외 상황 | HTTP | Error Code | 사용자 메시지 |
|:---|:---|:---|:---|
| 이력 없음 | 404 | TSX_GENERATION_NOT_FOUND | 해당 생성 이력을 찾을 수 없습니다. |
| 요청 필드 빈 값 | 400 | VALIDATION_FAILED | 입력값을 확인해주세요. |
| 미인증 | 401 | UNAUTHORIZED | 로그인이 필요합니다. |
| 권한 부족 | 403 | FORBIDDEN | 접근 권한이 없습니다. |

> `ErrorCode` enum에 `TSX_GENERATION_NOT_FOUND` 추가 필요

---

## 9. 보안 매트릭스

| API | Method | 권한 |
|:---|:---|:---|
| `/api/v1/tsx-generation/**` | ALL | 인증된 관리자 (SUPER_ADMIN / EDITOR) |

---

## 10. Repository 쿼리 설계

| 메서드명 | 용도 |
|:---|:---|
| `findAllByTemplateTypeOrderByCreatedAtDesc(String templateType, Pageable)` | templateType 필터 목록 조회 |
| `findAllByOrderByCreatedAtDesc(Pageable)` | 전체 목록 조회 |

---

## 11. BE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 11.1 엔티티 및 DB

- [ ] TsxGeneration 엔티티의 모든 필드가 설계서와 일치하는가?
- [ ] `configJson`, `tsxCode`가 `columnDefinition = "text"`로 선언되었는가?
- [ ] `updated_at` 필드가 없는가? (생성 전용)
- [ ] JPA Auditing (`@CreatedBy`, `@CreatedDate`)이 동작하는가?
- [ ] `idx_tsx_gen_type`, `idx_tsx_gen_created` 인덱스가 생성되었는가?

### 11.2 API 엔드포인트

- [ ] POST `/api/v1/tsx-generation` — 저장이 구현되었는가?
- [ ] GET `/api/v1/tsx-generation` — 목록 조회가 구현되었는가?
- [ ] GET `/api/v1/tsx-generation/{id}` — 단건 조회가 구현되었는가?
- [ ] DELETE `/api/v1/tsx-generation/{id}` — 삭제가 구현되었는가?
- [ ] POST 성공 시 HTTP 201을 반환하는가?
- [ ] DELETE 성공 시 HTTP 204를 반환하는가?

### 11.3 목록 조회

- [ ] `templateType` 파라미터가 있을 때 필터링이 동작하는가?
- [ ] `templateType` 파라미터가 없을 때 전체 조회가 되는가?
- [ ] 결과가 `created_at DESC` 기준으로 정렬되는가?
- [ ] 페이지네이션이 올바르게 동작하는가?

### 11.4 단건 조회 / 삭제

- [ ] 존재하지 않는 id 요청 시 404가 반환되는가?

### 11.5 Request DTO Validation

- [ ] 모든 필수 필드에 @NotBlank가 적용되었는가?
- [ ] @Valid가 Controller @RequestBody에 적용되었는가?

### 11.6 트랜잭션

- [ ] GET API에 `@Transactional(readOnly = true)`가 적용되었는가?
- [ ] POST, DELETE API에 `@Transactional`이 적용되었는가?

### 11.7 예외 처리

- [ ] `TSX_GENERATION_NOT_FOUND`가 ErrorCode enum에 추가되었는가?
- [ ] 설계서 섹션 8의 모든 예외가 구현되었는가?

### 11.8 보안

- [ ] `/api/v1/tsx-generation/**`에 인증된 사용자만 접근 가능한가?
- [ ] SecurityConfig에 해당 경로가 올바르게 설정되었는가?

### 11.9 빌드

- [ ] `./gradlew build` 오류가 없는가?

### 11.10 FE 연동 테스트

- [ ] `[생성]` 버튼 클릭 시 TSX 파일 생성 + 이력 저장이 동시에 동작하는가?
- [ ] 이력 목록에서 불러오기 클릭 시 빌더에 configJson이 복원되는가?
- [ ] 이력 삭제 시 목록에서 해당 행이 제거되는가?
- [ ] 응답 `pageUrl`의 경로가 실제 파일이 쓰인 위치(`/admin/generated/...`)와 일치하는가? (§12.3)

---

## 12. 파일 생성 API (`POST /api/v1/page-templates/generate`)

> 이력 도메인과 짝을 이루는 **실제 파일 쓰기** API. 담당 클래스가 다르므로 별도로 정리한다.
> 이 API는 `PageTemplate` **DB에 아무것도 저장하지 않는다** — 오직 디스크에 tsx 파일만 만든다.

### 12.1 담당 클래스

| 역할 | 클래스 | 비고 |
|:---|:---|:---|
| 엔드포인트 | `controller/PageTemplateController#generate` | `@PreAuthorize("@securityService.isSystemAdmin(authentication)")` |
| 요청 DTO | `dto/PageTemplateGenerateRequest` | `slug` / `tsxCode` / `templateType` / `fileName` |
| 파일명·URL 결정 | `service/PageTemplateService#generateFile` | 응답 `pageUrl` 문자열을 만드는 곳 |
| 디스크 쓰기 | `service/PageTemplateFileService#writeFile` | 실제 경로를 결정하는 곳 |

### 12.2 요청 필드와 검증

| 필드 | 검증 | 설명 |
|:---|:---|:---|
| slug | `@NotBlank`, `^[a-zA-Z0-9_-]+$`, max 100 | 생성될 **폴더명** |
| tsxCode | `@NotBlank` | FE가 조립한 tsx 코드 전문 |
| templateType | `@NotBlank` | 값 목록을 enum/`@Pattern`으로 제한하지 않음 → `PAGE` 등 새 타입을 **BE 수정 없이** 그대로 받을 수 있다 |
| fileName | `^[a-zA-Z0-9_-]*$`, max 100 | 확장자 제외 파일명. 비우면 기본값 적용 |

**파일명 기본값 규칙** (`fileName`을 비웠을 때):

| templateType | 기본 파일명 |
|:---|:---|
| `LAYER` | `LayerPopup.tsx` |
| **그 외 전부** (`LIST`, `PAGE`, …) | `page.tsx` |

> 코드가 `"LAYER".equals(templateType)` 단일 분기이므로, `PAGE`는 자동으로 `page.tsx`로 떨어진다.
> 즉 **Widget 빌더의 `PAGE` 타입을 지원하기 위해 파일명 로직을 고칠 필요는 없다.**

### 12.3 저장 경로 — `widgetSub`가 아니라 `generated`

실제 쓰기 경로는 코드에 박혀 있지 않고 **설정값 하나로 결정된다.**

```yml
# bo-api/src/main/resources/application-{local,dev,developer,prod}.yml
page-template:
  output-dir: "../bo/src/app/admin/generated"
```

```
쓰기 경로 = {output-dir}/{slug}/{fileName}
         = bo/src/app/admin/generated/{slug}/{fileName}.tsx
```

`PageTemplateFileService`는 `output-dir`을 절대경로로 정규화한 뒤
결과 경로가 그 하위인지 검사(Path Traversal 차단)하고, 상위 디렉토리를 자동 생성한 후 덮어쓰기로 쓴다.

⚠️ **주의해서 볼 지점**: 응답으로 내려주는 `pageUrl` 문자열은
`PageTemplateService#generateFile`에 **별도로 하드코딩**되어 있어서, 위 설정과 자동으로 동기화되지 않는다.
과거 `output-dir`이 `widgetSub`였던 시절의 값이 그대로 남아 있어
**"파일은 `generated`에 쓰이는데 응답 URL은 `widgetSub`를 가리키는" 불일치**가 존재한다.

| 항목 | 값 |
|:---|:---|
| 실제 쓰기 위치 | `bo/src/app/admin/generated/{slug}/{fileName}.tsx` |
| 응답 `pageUrl` (수정 전) | `/admin/widgetSub/{slug}/{fileName}.tsx` ← 잘못된 값 |
| 응답 `pageUrl` (수정 후) | `/admin/generated/{slug}/{fileName}.tsx` |

수정 대상은 `PageTemplateService#generateFile`의 반환 문자열 **한 줄**뿐이다.

```java
// AS-IS
return "/admin/widgetSub/" + slug + "/" + resolvedName;
// TO-BE
return "/admin/generated/" + slug + "/" + resolvedName;
```

> 이 값은 `[생성]` 완료 토스트 메시지에 그대로 노출되므로, 잘못된 경로를 안내하면
> 개발자가 산출물을 못 찾는다. 상위 아키텍처 문서
> [`docs/03-architect/page/page-templates.md`](../../03-architect/page/page-templates.md) 역시
> 처음부터 `/admin/generated/{slug}`를 정본으로 기술하고 있으므로, `generated`가 맞는 값이다.

### 12.4 `generated` 와 `widgetSub` 의 역할 구분 (헷갈리기 쉬움)

두 디렉토리는 이름만 비슷할 뿐 **목적이 완전히 다르다. 서로 건드리지 말 것.**

| 디렉토리 | 목적 | 누가 만드나 | 실행 시점 |
|:---|:---|:---|:---|
| `bo/src/app/admin/generated/{slug}/` | **파일빌드 산출물.** 개발자가 가져가 커스터마이징하는 tsx 소스 | 이 API가 디스크에 씀 | 빌드 타임(정적 파일) |
| `bo/src/app/admin/widgetSub/[slug]/` | **런타임 위젯 렌더링.** DB의 `configJson`을 읽어 그때그때 화면을 그림 | 사람이 작성한 고정 라우트 | 런타임(동적) |

즉 `generated`는 "인계용 코드 결과물", `widgetSub`는 "빌더로 만든 화면의 실제 운영 페이지"다.
파일빌드 기능은 `generated`만 사용하며 `widgetSub` 쪽 코드는 일절 수정하지 않는다.

### 12.5 응답

```json
{ "pageUrl": "/admin/generated/board/page.tsx" }
```

| 예외 상황 | HTTP | 비고 |
|:---|:---|:---|
| slug/tsxCode/templateType 누락 | 400 | Bean Validation |
| `output-dir` 경계 이탈 | 500 | `PAGE_TEMPLATE_FILE_ERROR` |
| 디스크 쓰기 실패(IOException) | 500 | `PAGE_TEMPLATE_FILE_ERROR` |
| 시스템관리자 아님 | 403 | `@PreAuthorize` |
