# FO Contact Us(문의 접수 저장) API 명세서

> FO `/support/contact-us` 폼 제출 → `contact_us_inquiry` 테이블 저장(insert) 전용 신규 API.
> 문의결과조회(답변조회)·BO 관리자 조회/답변 화면은 **이번 범위 제외**.
> DB 스키마: `docs/db/contact-us/db_contact-us.md`

---

## 1. 개요

| 항목 | 값 |
|:---|:---|
| 엔드포인트 | `POST /api/v1/fo/contact-us` |
| 인증 | 불필요 (`SecurityConfig`에서 `/api/v1/fo/**` permitAll) |
| Content-Type | `application/json` |
| 성공 응답 | `201 Created` |
| 기능 | 폼 제출 내용 DB 저장(insert)만. 외부 전송/조회 없음 |

> ⚠️ **기존 `ContactUsController`(`/api/v1/public/contact-us`)와 무관.** 그쪽은 CTP(Salesforce) 전송 전용이며 DB 미저장. 재사용/수정하지 않는다.

---

## 2. 신규 클래스 설계 (bo-api 기존 레이어 컨벤션 준수)

> 기존 CTP `ContactUs*`(`ContactUsController/Service/Request/Response`)와 이름이 겹치지 않도록 **`Inquiry` 접미사**를 사용. 프로젝트 내 다른 테이블(`banner_data`/`download_log` 등)이 `fo_`/`bo_` 시스템 접두어를 쓰지 않는 컨벤션에 맞춰, 클래스명도 `Fo` 접두어 없이 `ContactUsInquiry`로 통일.

| 레이어 | 클래스 | 패키지 | 역할 |
|:---|:---|:---|:---|
| Controller | `ContactUsInquiryController` | `com.ge.bo.controller` | `POST /api/v1/fo/contact-us` 수신 (`FoCodeController` 등 FO 컨트롤러와 동일 패턴) |
| Service | `ContactUsInquiryService` | `com.ge.bo.service` | 교차검증 + 공통코드 검증 + 비밀번호 해시 + 저장 |
| Repository | `ContactUsInquiryRepository` | `com.ge.bo.repository` | `JpaRepository<ContactUsInquiry, Long>` (`DownloadLogRepository` 패턴) |
| Entity | `ContactUsInquiry` | `com.ge.bo.entity` | `contact_us_inquiry` 매핑, `@Builder` insert 전용 (`DownloadLog` 패턴) |
| Request DTO | `ContactUsInquiryRequest` | `com.ge.bo.dto` | record + Bean Validation (`ContactUsRequest` 검증 패턴 참고) |
| Response DTO | `ContactUsInquiryResponse` | `com.ge.bo.dto` | 저장 결과 반환 |

### 재사용 대상 (신규 아님)
- `SecurityConfig`의 `PasswordEncoder` Bean(BCrypt rounds=12) — 비밀번호 해시에 그대로 주입.
- `GlobalExceptionHandler` — 검증 실패·`BusinessException` 응답 포맷 자동 처리.
- `BusinessException.badRequest(...)` — 비밀번호 불일치, 유효하지 않은 코드값 등 검증 실패용.
- `CodeDetailRepository`(`com.ge.bo.repository`) — `inquiry_type`/`country` 코드값 존재·활성 검증에 주입.
- `FoCodeController`(`GET /api/v1/fo/codes/{groupCode}`) + `CodeService.getFoCodes(groupCode)` — FE 폼 옵션 조회용(이미 구현, 재사용).

### 신규 Repository 메서드 (CodeDetailRepository에 추가)
```java
// groupCode + code 조합이 활성(is_active=true) 코드로 존재하는지 검증
boolean existsByGroup_GroupCodeAndCodeAndActiveTrue(String groupCode, String code);
```
> 기존 `CodeDetailRepository`에는 `existsByGroupAndCode(CodeGroup, String)`(엔티티 인자)와 `findAllByGroup_GroupCodeAndActiveTrueOrderBySortOrderAsc(String)`만 있고, groupCode 문자열 + code 조합의 존재/활성 여부를 한 번에 확인하는 메서드가 없어 신규 추가한다. 파생 쿼리(derived query)라 시그니처만 선언하면 된다.

---

## 3. 요청 스펙 (ContactUsInquiryRequest)

| 필드 | 타입 | 필수 | 정적 검증(Bean Validation) | 추가 검증(서비스) | 저장 컬럼 |
|:---|:---|:---|:---|:---|:---|
| `type` | String | ✅ | `@NotBlank`, `@Size(max=30)` | `INQUIRY_TYPE` 활성 코드값 존재 | `inquiry_type` |
| `productCategory` | String | ✖ | `@Size(max=1000)` | - | `product_category` ("카테고리1 \| 카테고리2 \| 카테고리3" 결합 문자열) |
| `email` | String | ✅ | `@NotBlank`, `@Email`, `@Size(max=255)` | - | `email` |
| `firstName` | String | ✅ | `@NotBlank`, `@Size(max=255)` | - | `first_name` |
| `lastName` | String | ✅ | `@NotBlank`, `@Size(max=255)` | - | `last_name` |
| `companyName` | String | ✅ | `@NotBlank`, `@Size(max=100)` | - | `company_name` |
| `country` | String | ✅ | `@NotBlank`, `@Size(max=2)` | `COUNTRYCODE` 활성 코드값 존재 | `country` |
| `description` | String | ✅ | `@NotBlank` | - | `inquiry_content` |
| `password` | String | ✅ | `@NotBlank`, `@Size(max=100)` | - | `password_hash` (BCrypt 해시 후 저장) |
| `confirmPassword` | String | ✅ | `@NotBlank` | password와 일치 | 저장 안 함 (검증만) |
| `marketingOptInFlag` | Boolean | ✅ | `@NotNull` | - | `marketing_opt_in_flag` |
| `privacyConsentFlag` | Boolean | ✅ | `@AssertTrue(개인정보 동의 필수)` | - | `privacy_consent_flag` |

> **`type`/`country` 검증 방식 변경**: 기존 `@Pattern`(정규식 하드코딩)/`@Size(min=2,max=2)` 정적 검증을 제거하고, 서비스 레이어에서 `CodeDetailRepository`로 **공통코드 실시간 존재·활성 검증**으로 전환. Bean Validation 단계는 null/blank/길이 상한만 거른 뒤, 실제 허용값 여부는 `code_detail`(활성)에 위임한다. BO 관리자가 코드를 추가/비활성해도 BE 소스 수정이 불필요하다.
> - `type` 저장값 예: `PRODUCT_INFORMATION` / `QUOTATION_REQUEST` / `PURCHASE` / `OTHERS` (groupCode `INQUIRY_TYPE`)
> - `country` 저장값 예: `US` / `CA` / `KR` (groupCode `COUNTRYCODE`, ISO 3166-1 alpha-2 대문자)
> `created_ip`, `created_at` 은 요청 바디가 아니라 서버에서 채운다 (IP는 `HttpServletRequest`의 X-Forwarded-For 우선, 시각은 `CURRENT_TIMESTAMP`).

### 요청 예시
```json
{
  "type": "QUOTATION_REQUEST",
  "productCategory": "LV Products and Systems | Magnetic Contactor | Metasol MS",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "ACME Corp",
  "country": "US",
  "description": "Please send a quotation for the Metasol MS.",
  "password": "secret1234",
  "confirmPassword": "secret1234",
  "marketingOptInFlag": true,
  "privacyConsentFlag": true
}
```

---

## 4. 서비스 처리 흐름 (ContactUsInquiryService)

```
1) Bean Validation 통과 (Controller @Valid → 실패 시 GlobalExceptionHandler가 400 VALIDATION_FAILED)
2) 공통코드 검증 (CodeDetailRepository)
   - existsByGroup_GroupCodeAndCodeAndActiveTrue("INQUIRY_TYPE", type) == false
       → BusinessException.badRequest("유효하지 않은 문의 유형입니다.")
   - existsByGroup_GroupCodeAndCodeAndActiveTrue("COUNTRYCODE", country) == false
       → BusinessException.badRequest("유효하지 않은 국가입니다.")
3) 교차 검증
   - password != confirmPassword → BusinessException.badRequest("비밀번호가 일치하지 않습니다.")
4) 비밀번호 해시: passwordEncoder.encode(password) → password_hash
5) ContactUsInquiry 엔티티 빌드 (요청 필드 매핑 + createdIp + createdAt)
6) contactUsInquiryRepository.save(entity)
7) ContactUsInquiryResponse(success=true, id, message) 반환 (201 Created)
```

> `privacyConsentFlag` 는 `@AssertTrue`로 이미 걸러지므로 서비스에서 별도 재검증 불필요.
> 제품 카테고리는 FO 폼상 필수(*) 표시가 없어 **필수 검증하지 않는다** (기존 CTP 서비스의 Others-외-필수 규칙은 이번 저장 도메인에 적용하지 않음).
> 공통코드 검증은 `code_detail`의 **활성(is_active=true)** 코드만 통과시킨다 — 비활성 코드로는 신규 접수를 막되, 과거 접수 데이터(문자열 코드값)는 그대로 보존된다.
> 개인정보 로그 미기록 원칙: 이메일/이름/문의내용 등은 로그로 남기지 않는다 (저장 성공 여부/`id` 정도만 info 로그).

---

## 5. 응답 스펙 (ContactUsInquiryResponse)

| 필드 | 타입 | 설명 |
|:---|:---|:---|
| `success` | boolean | 저장 성공 여부 (true) |
| `id` | Long | 생성된 PK (접수 식별자) |
| `message` | String | 안내 문구 |

### 성공 응답 (201)
```json
{
  "success": true,
  "id": 123,
  "message": "문의가 정상적으로 접수되었습니다."
}
```

---

## 6. 에러 케이스 (GlobalExceptionHandler 공통 포맷)

| 상황 | HTTP | error | 응답 예 |
|:---|:---|:---|:---|
| 필수값 누락 / 형식 위반 (`@NotBlank`,`@Email`,`@Size` 등) | 400 | `VALIDATION_FAILED` | `{ "status":400, "error":"VALIDATION_FAILED", "fieldErrors":{ "email":"..." } }` |
| `@AssertTrue`(개인정보 미동의) | 400 | `VALIDATION_FAILED` | 위와 동일 (fieldErrors에 해당 필드) |
| `type` 값이 `INQUIRY_TYPE` 활성 코드에 없음 | 400 | `BAD_REQUEST` | `{ "status":400, "error":"BAD_REQUEST", "message":"유효하지 않은 문의 유형입니다." }` |
| `country` 값이 `COUNTRYCODE` 활성 코드에 없음 | 400 | `BAD_REQUEST` | `{ "status":400, "error":"BAD_REQUEST", "message":"유효하지 않은 국가입니다." }` |
| 비밀번호 불일치 (교차검증) | 400 | `BAD_REQUEST` | `{ "status":400, "error":"BAD_REQUEST", "message":"비밀번호가 일치하지 않습니다." }` |
| JSON 파싱 실패 | 400 | `MALFORMED_JSON` | `{ "status":400, "error":"MALFORMED_JSON", ... }` |
| 서버 오류 | 500 | `INTERNAL_SERVER_ERROR` | `{ "status":500, "error":"INTERNAL_SERVER_ERROR", ... }` |

> 위 응답 포맷/에러코드는 모두 기존 `GlobalExceptionHandler`가 자동 생성 — 신규 핸들러 불필요.
> `type`/`country`는 이제 `@Pattern`이 아니라 서비스의 공통코드 검증에서 걸리므로 `VALIDATION_FAILED`(fieldErrors)가 아니라 `BAD_REQUEST`(message)로 응답된다.

---

## 7. FE 연동 (공통코드 API — 폼 옵션 렌더)

> FO `ContactUsForm.tsx`의 하드코딩된 `contactUsInquiryTypes`/`contactUsCountryOptions`(`fo/src/data/support/contactUsContent.ts`)를 제거하고, 아래 공개 API로 옵션을 조회해 렌더한다. (실제 FE 구현은 fo-fe-builder STEP4)

| 용도 | 요청 | 응답(200) |
|:---|:---|:---|
| 문의유형 옵션 | `GET /api/v1/fo/codes/INQUIRY_TYPE` | `[{ "code": "PRODUCT_INFORMATION", "name": "Product Information" }, ...]` |
| 국가 옵션 | `GET /api/v1/fo/codes/COUNTRYCODE` | `[{ "code": "US", "name": "United States" }, ...]` |

- 응답은 `FoCodeResponse` 형태 `[{ code, name }]` — 활성 코드만 `sortOrder` 오름차순.
- FE 매핑: 옵션 라벨은 `name`, 폼 제출 시 값은 `code` 그대로 전송(라디오/셀렉트 value = `code`).
- 저장 API(`POST /api/v1/fo/contact-us`)의 `type`/`country`에는 위 `code` 값(대문자)을 그대로 전달한다 — BE가 동일 코드로 재검증하므로 표기가 일치해야 한다.
- 기존 재사용 패턴 참고: `fo/src/app/company/data/blogData.ts`(`BLOGCATEGORY`), `fo/src/app/main/components/mainVisualData.ts`(`BANNER_PREFIX`)가 동일하게 `GET /api/v1/fo/codes/{groupCode}`를 호출한다.

---

## 8. 범위 밖 (이번 STEP 제외)

- 문의결과조회(답변조회) API — 제외
- BO 관리자 조회/답변/목록 화면 및 조회 API — 제외 (인덱스만 미리 설계에 반영)
- 접수 확인/알림 이메일 발송 — 제외
- 스팸 방지(reCAPTCHA/rate-limit) — 제외 (`created_ip` 컬럼만 확보)
- 전체 국가 코드 시드 — 제외 (초기 US/CA/KR만, 이후 BO 코드관리에서 추가)
