# Training 신청 내역(관리자 조회) BE 상세 설계서

> 대상 화면: `bo` `/admin/widget/trainingApplHis-list` (빌더 PAGE_TEMPLATE, slug_registry id=113)
> 데이터 소스 전환: 기존에 연결되어 있던 legacy `page_data`(`data_slug='trainingApplHis-data'`, 5건, 수기 목데이터)를 **더 이상 사용하지 않고**, FO 트레이닝 세션 등록 제출이 실제로 쌓이는 `training_registration` 테이블 기반 신규 조회 API로 완전히 교체한다.
> FO 제출 API(`POST /api/v1/fo/training/registrations`, `TrainingRegistrationController`)는 이번 설계와 무관 — 그대로 둔다.
> 재사용 표준 패턴: `LoginLogController`/`LoginLogService`/`LoginLogResponse`/`LoginLogDetailResponse` (조회 전용, flat record DTO + `from()` 팩토리, 목록/상세 분리)

---

## 1. 개요

| 항목 | 값 |
|:---|:---|
| 목록 조회 | `GET /api/v1/training-registrations` |
| 상세 조회 | `GET /api/v1/training-registrations/{id}` |
| 인증 | 필요 (`SecurityConfig`의 `anyRequest().authenticated()`에 의존, `LoginLogController`와 동일 — role 무관) |
| 기능 | `training_registration` 조회 전용(수정/삭제 없음, 이력성 append-only 테이블) |

---

## 2. 데이터 모델 — 2단계(2-hop) 조인 구조

`training_registration`은 `curriculum_id`/`session_id` 두 컬럼 모두 물리 FK로 `page_data(id)`를 가리키지만(`scripts/training_registration.sql`), **서로 다른 `data_slug` 행을 가리키는 두 개의 독립된 조인**이다 (실데이터 확인 완료 — `docs/dev/services/currMgmt-data.md`, `docs/dev/services/currDtlMgmt-data.md`, 로컬 DB `page_data` 실측).

```
training_registration
 ├─ curriculum_id ──▶ page_data (data_slug='currMgmt-data')      … 코스(커리큘럼) 레벨
 │                     data_json.curriculum.{title, training_course, product_category, ...}
 │
 └─ session_id    ──▶ page_data (data_slug='currDtlMgmt-data')   … 오퍼링(세션) 레벨
                       data_json.curriculum_detail1.{training_type, training_course, curriculum_id}
                       data_json.curriculum_detail2.{title, training_date_from, training_date_to,
                                                       register_period_from/to, address, phone, email, ...}
```

- FO 제출 시 `curriculumId` = 코스 상세 route의 `courseId`(= `currMgmt-data.id`), `sessionId` = 세션 상세 route의 `sessionId`(= `currDtlMgmt-data.id`). 근거: `TrainingRegistration.java` 필드 주석, `fo/src/app/services/training/data/trainingRegistrationData.ts`.
- 즉 **"커리큘럼(코스 제목)"과 "제목(오퍼링 제목)"은 서로 다른 조인 경로에서 나온다** — `curriculum_id` 단일 조인만으로는 오퍼링 레벨 값(제목/교육방식/시작일/종료일)을 채울 수 없다. 두 개의 LEFT JOIN이 모두 필요하다.
- 두 조인 모두 **OUTER(LEFT) JOIN**이다. FO 제출 이후 해당 커리큘럼/세션이 BO에서 삭제되어도 신청 이력(`training_registration`) 자체는 보존해야 하므로, 매칭 실패 시 해당 표시 컬럼만 NULL 처리한다.

---

## 3. 필드 매핑 (목록 컬럼 11개 + 검색 필드 9개)

| 화면 항목 | 구분 | 소스 | 컬럼/JSON 경로 | 확인 상태 |
|:---|:---|:---|:---|:---|
| 구분 (`training_schedule_type`) | 목록+검색 | — | 없음 | ⚠️ **확인 필요** — `training_registration`, `curriculum`, `curriculum_detail1/2/3` 어디에도 정기/비정기(`TRAININGSCHEDULETYPE`) 개념이 없음. legacy `trainingApplHis-data`에만 존재하던 수기 입력값(실측: id 919/700/1631/1826/1827)이었고 신규 데이터 모델에는 대응 필드가 없음. 아래 4절 참고 |
| 교육방식 (`training_type`) | 목록+검색 | session 조인 | `curriculum_detail1.training_type` (CSV, `001`/`002`, 코드그룹 TRAININGTYPE) | ✅ |
| Training (`training_course`) | 목록+검색 | curriculum 조인 | `curriculum.training_course` (`01`/`02`/`03`, 코드그룹 TRAININGCOURSE) | ✅ |
| 커리큘럼 (`curriculum`) | 목록+검색(제목 input) | curriculum 조인 | `curriculum.title` | ✅ |
| 제목 (`title`) | 목록+검색(input) | session 조인 | `curriculum_detail2.title` | ✅ |
| 시작일 (`trainingDate_from`) | 목록+검색(dateRange) | session 조인 | `curriculum_detail2.training_date_from` | ✅ (없으면 `training_registration.event_date` fallback, 5절 참고) |
| 종료일 (`trainingDate_to`) | 목록+검색(dateRange) | session 조인 | `curriculum_detail2.training_date_to` | ✅ (없으면 NULL, fallback 없음) |
| 신청일시 (`createdAt`) | 목록+검색(dateRange) | 자체 컬럼 | `training_registration.created_at` | ✅ |
| 발송대상=이메일 (`email`) | 목록 | 자체 컬럼 | `training_registration.email` | ✅ (마스킹은 BE 아님 — 6절 참고) |
| 신청자 (`applicant`) | 목록 | 자체 컬럼 | `training_registration.student_name` (사용자 확정: `last_name` 분기 없이 항상 `student_name`) | ✅ |
| actions(상세/수정) | 목록 | — | FE 전용(팝업 라우팅) | 범위 밖 |
| 검색기간유형 (`searchPeriodType`) | 검색(select) | — | 실검색조건 아님 — 3개 dateRange(신청일/시작일/종료일) 중 어느 것을 활성화할지 토글하는 FE 전용 필드 | ✅ |

---

## 4. "구분(training_schedule_type)" — 상수 `"01"`(정기 Training) 고정

- 위젯 `config_json`(`page_template.slug='trainingApplHis-list'`) 실측: 목록 컬럼 `accessor: training_schedule_type`(코드그룹 `TRAININGSCHEDULETYPE`, 01=정기 Training/02=비정기 Training), 검색 필드 `fieldKey: trainingScheduleType`, 그리고 `actions` 컬럼의 `editPageRules`가 이 값(01/02)으로 상세 팝업을 `trainingApplHisR-detail`(정기) / `trainingApplHisA-detail`(비정기)로 분기한다.
- `TRAININGSCHEDULETYPE`은 실존하는 공통코드 그룹이며(`code_group` 실측), **"어느 신청 플로우에서 들어온 데이터인가"를 구분하는 값**이다:
  - **01 정기 Training** = 카탈로그 커리큘럼(`curriculum`)+세션(`curriculum_detail`) 기반 신청 — 지금 이 설계의 대상인 `training_registration`(FO 세션 등록 폼)이 정확히 이 플로우다. 상세 팝업 `trainingApplHisR-detail`(slug id 104) 필드를 실측하니 `training_course`/`training_type`/`application_curriculum`/`training_date`(조인 값) + `student_name`/`email`/`job_title`/`phone`/`company`/`address`/`address_detail`/`city`/`state_province`/`zip_code`/`business_type`(BUSINESSTYPE)까지 `training_registration` 컬럼과 1:1로 대응한다.
  - **02 비정기 Training** = 현장 맞춤 기업교육 요청 — `sales_contact`/`on_site_contact`/`session_number`/`session_duration`/`training_products`/`certification_notes` 등 전혀 다른 필드 세트를 쓰며(`trainingApplHisA-detail` 실측), 지금도 legacy `page_data`로만 존재하고 전용 RDB 테이블이 없다. **이번 설계 범위 밖**(별도 요청 시 별도 기능).
- 결론: `training_registration` 테이블은 오직 "정기" 플로우만 나타내므로, 응답의 `trainingScheduleType`은 **저장된 값이 아니라 상수 `"01"` 고정 반환**한다(모든 행이 정기). 검색 파라미터 `trainingScheduleType`은 받되 `"01"` 이외의 값이 오면 결과 0건(정상 — 비정기 데이터가 이 테이블에 없으므로), `"01"` 또는 미지정이면 조건 없이 전체 반환.
- 부수 확인: `editPageRules`는 모든 행이 `01`이므로 항상 `trainingApplHisR-detail`로만 라우팅된다. 이 상세 팝업도 현재 `connectedSlug: "trainingApplHis-data"`(legacy page_data)로 연결돼 있어 **목록과 동일하게 신규 API로 데이터 소스 교체가 필요**하다 — STEP4(FE 연동 설계)/STEP6(FE 연동) 범위에 상세 팝업을 포함해야 한다(11절에 반영).

---

## 5. 시작일/종료일 — `event_date` fallback 설계

- `training_registration.event_date`는 FO 제출 시 세션 시작일로 채워지는 자체 컬럼(폼 필수값)이다.
- `curriculum_detail2.training_date_from`/`training_date_to`(세션 조인 값)가 실제 존재하므로 이를 우선 사용한다.
- LEFT JOIN 실패(세션 page_data 삭제 등) 또는 `curriculum_detail2.training_date_from`이 NULL인 경우에만 `training_registration.event_date`를 시작일에 fallback한다. 종료일은 별도 자체 컬럼이 없으므로 fallback 없이 NULL.

---

## 6. 마스킹 처리 — BE 미처리, 위젯 설정 그대로 재사용

- `email`: `maskType:"custom", maskCustomRegex:"(?<=.{2}).(?=[^@]*@)", maskCustomReplacement:"*"`
- `applicant`: `maskType:"name", maskPattern:"mid"`
- 두 마스킹 모두 **빌더 테이블 위젯(`config_json`) 렌더링 단계에서 처리**되는 기존 컨벤션이며(BE가 별도 마스킹 유틸을 갖고 있지 않음), 신규 API는 원본 값을 그대로 응답한다. BE 신규 마스킹 로직 불필요.

---

## 7. 조회 로직 설계 — 네이티브 쿼리 채택 (Specification 미채택 사유)

> ⚠️ 사용자 지정 표준 패턴(`LoginLogService`의 `Specification<T>` + `JpaSpecificationExecutor`)을 그대로 따르지 못하는 부분이 있어 이유를 명시한다.

- `LoginLog`는 필터 대상 컬럼이 전부 자체 테이블의 스칼라 컬럼이라 JPA Criteria `Specification`으로 충분하다.
- 본 API는 검색 필드 9개 중 6개(구분/교육방식/Training/커리큘럼/제목/시작일/종료일)가 **조인된 `page_data.data_json`(JSONB) 내부 경로**를 조건으로 건다. JPA Criteria는 JSONB 경로 연산자(`->`, `->>`)에 대한 표준 경로 표현식이 없고, `PageData.dataJson`은 엔티티에 순수 `String` 컬럼(`JsonStringType`)으로 매핑되어 있어 Criteria로 JSON 내부 필드 조건을 걸 수 없다.
- 동일한 제약으로 이미 `FoTrainingService`(2-hop `page_data` 조회, `curriculum_detail1.curriculum_id` 등)와 `PageDataService`(dot-notation `eq_`/`condexpr_` 검색)가 `EntityManager` 네이티브 SQL + `jsonb ->>`/`jsonb_array_elements_text`로 구현되어 있다 — 동일 패턴을 재사용한다.
- **채택 방식**: `Repository`(Specification) 대신 `Service`에서 `@PersistenceContext EntityManager`로 COUNT 쿼리 + DATA 쿼리(LIMIT/OFFSET) 2회 실행, 원본 SQL에서 두 `page_data` 조인(`curriculum_id`/`session_id`)을 `LEFT JOIN`으로 직접 명시한다. `TrainingRegistrationRepository`(`JpaRepository`, `JpaSpecificationExecutor` 미추가)는 상세 조회(`findById`)에만 사용.
- 응답 페이징 포맷은 `PageDataListResponse`(기존, 네이티브 쿼리 결과용 페이징 DTO)와 동일한 구조를 재사용한다 — `Page<T>`(Spring Data)는 `Pageable` 기반 Repository 메서드 전제라 네이티브 COUNT+LIMIT/OFFSET 조합과 맞지 않는다.
- 정렬: MVP 범위는 `created_at DESC` 고정(= `신청일시` 내림차순, 위젯 기본 정렬과 일치). 조인 JSON 경로 컬럼까지 포함한 동적 정렬(`sort=` 자유 파라미터)은 화이트리스트 기반 ORDER BY 빌더가 필요해 이번 STEP 범위에서 제외 — 필요 시 별도 STEP.

### SQL 스케치 (DATA 쿼리)

```sql
SELECT
    tr.id, tr.curriculum_id, tr.session_id, tr.student_name, tr.email,
    tr.event_date, tr.created_at,
    curr.data_json->'curriculum'->>'title'            AS curriculum_title,
    curr.data_json->'curriculum'->>'training_course'   AS training_course,
    sess.data_json->'curriculum_detail1'->>'training_type' AS training_type,
    sess.data_json->'curriculum_detail2'->>'title'          AS session_title,
    sess.data_json->'curriculum_detail2'->>'training_date_from' AS training_date_from,
    sess.data_json->'curriculum_detail2'->>'training_date_to'   AS training_date_to
FROM training_registration tr
LEFT JOIN page_data curr ON curr.id = tr.curriculum_id AND curr.data_slug = 'currMgmt-data'
LEFT JOIN page_data sess ON sess.id = tr.session_id    AND sess.data_slug = 'currDtlMgmt-data'
WHERE 1=1
  -- 아래 8절 표의 조건을 각 파라미터 존재 시에만 추가
ORDER BY tr.created_at DESC
LIMIT :size OFFSET :offset
```

---

## 8. 목록 조회 API — `GET /api/v1/training-registrations`

### 요청 파라미터 (동적 필터)

| 파라미터 | 타입 | 매핑 대상 | WHERE 조건 |
|:---|:---|:---|:---|
| `createdFrom`/`createdTo` | date | `tr.created_at` | `>=` / `<=` (신청일 dateRange, `searchPeriodType=01`일 때 FE가 전송) |
| `trainingDateFrom`/`trainingDateTo`(검색용 범위) | date | `sess.data_json->'curriculum_detail2'->>'training_date_from'` | `>=`/`<=` (시작일 dateRange, `searchPeriodType=02`) |
| `trainingDateToFrom`/`trainingDateToTo`(검색용 범위) | date | `sess...training_date_to` | `>=`/`<=` (종료일 dateRange, `searchPeriodType=03`) |
| `trainingScheduleType` | String | 상수 `"01"` 고정(4절 참고). 파라미터로 `"01"` 외 값이 오면 결과 0건 | `=` (상수 비교) |
| `trainingType` | String | `sess...training_type` (CSV) | `LIKE '%값%'` (CSV 부분일치) |
| `trainingCourse` | String | `curr...training_course` | `=` |
| `curriculum` | String | `curr...title` | `LIKE '%값%'`(대소문자 무시) |
| `title` | String | `sess...title` | `LIKE '%값%'`(대소문자 무시) |
| `page`, `size` | int | - | 기본 `page=0`, `size=20`(`LoginLog` 컨벤션 준용, FE는 위젯 `pageSize=10` 요청) |

> `searchPeriodType`은 FE 전용 토글(어느 dateRange를 활성화할지)이며 BE에는 실제 3개 dateRange 파라미터 중 하나만 값이 채워져서 전달된다 — BE는 파라미터 존재 여부로만 조건을 적용하고 `searchPeriodType` 자체는 받지 않는다(기존 `LoginLog`의 `startDate`/`endDate` 방식과 동일하게 단순화).

### 응답 DTO — `TrainingRegistrationListResponse` (신규, flat record)

| 필드 | 타입 | 소스 |
|:---|:---|:---|
| `id` | Long | `tr.id` |
| `curriculumId` | Long | `tr.curriculum_id` |
| `sessionId` | Long | `tr.session_id` |
| `trainingScheduleType` | String | 항상 `"01"` (4절 참고, 상수) |
| `trainingType` | String | `sess.curriculum_detail1.training_type` |
| `trainingCourse` | String | `curr.curriculum.training_course` |
| `curriculumTitle` | String | `curr.curriculum.title` |
| `title` | String | `sess.curriculum_detail2.title` |
| `trainingDateFrom` | LocalDate | `sess.curriculum_detail2.training_date_from` (없으면 `tr.event_date`) |
| `trainingDateTo` | LocalDate | `sess.curriculum_detail2.training_date_to` |
| `createdAt` | OffsetDateTime | `tr.created_at` |
| `email` | String | `tr.email` (마스킹 없이 원본) |
| `applicant` | String | `tr.student_name` |

### 응답 포맷 — `TrainingRegistrationPageResponse` (신규, `PageDataListResponse`와 동일 구조)

```json
{
  "content": [
    {
      "id": 12,
      "curriculumId": 1625,
      "sessionId": 1900,
      "trainingScheduleType": null,
      "trainingType": "001,002",
      "trainingCourse": "03",
      "curriculumTitle": "power product Sales Training",
      "title": "예시 오퍼링 A",
      "trainingDateFrom": "2026-07-30",
      "trainingDateTo": "2026-07-31",
      "createdAt": "2026-07-24T09:30:00+09:00",
      "email": "john.smith@example.com",
      "applicant": "John Smith"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "page": 0,
  "size": 20,
  "first": true,
  "last": true
}
```

---

## 9. 상세 조회 API — `GET /api/v1/training-registrations/{id}`

- `TrainingRegistrationRepository.findById(id)`(기존, 변경 없음)로 자체 컬럼 전체 조회 → 없으면 404(`TRAINING_REGISTRATION_NOT_FOUND`, 신규 `ErrorCode`, `LoginLogService.getOne()`/`LOGIN_LOG_NOT_FOUND` 패턴 그대로).
- 이어서 `PageDataRepository.findById(curriculumId)` / `findById(sessionId)`(기존, 변경 없음)로 조인 표시값 보강. 단건이라 8절의 네이티브 JOIN 없이 기존 리포지토리 메서드 재사용으로 충분(N+1 우려 없음).

### 응답 DTO — `TrainingRegistrationDetailResponse` (신규, flat record)

`TrainingRegistrationListResponse`의 전체 필드 + 아래 자체 컬럼 전부:

| 필드 | 타입 |
|:---|:---|
| `jobTitle` | String |
| `phone` | String |
| `companyName` | String |
| `eventDate` | LocalDate |
| `streetAddress`, `address2`, `apartment`, `city`, `stateProvince`, `zipCode` | String |
| `typeOfBusiness` | String |
| `privacyConsentFlag` | Boolean |
| `createdIp` | String |

---

## 10. 신규/재사용 파일

| 레이어 | 클래스 | 상태 |
|:---|:---|:---|
| Controller | `TrainingRegistrationAdminController` (`com.ge.bo.controller`) | 신규 — 기존 `TrainingRegistrationController`(FO 제출)와 이름 충돌 방지 |
| Service | `TrainingRegistrationAdminService` (`com.ge.bo.service`) | 신규 — 기존 `TrainingRegistrationService`(FO 제출)는 무수정 |
| Response DTO | `TrainingRegistrationListResponse`, `TrainingRegistrationDetailResponse`, `TrainingRegistrationPageResponse` (`com.ge.bo.dto`) | 신규 |
| Repository | `TrainingRegistrationRepository` | 재사용, 변경 없음 (JPQL/Specification 추가 불필요 — 7절 사유) |
| Repository | `PageDataRepository` | 재사용, 변경 없음 (`findById`만 사용) |
| Entity | `TrainingRegistration`, `PageData` | 재사용, 변경 없음 |
| ErrorCode | `TRAINING_REGISTRATION_NOT_FOUND` 추가 | `ErrorCode.java`에 항목 1건 추가 |

---

## 11. 범위 밖 / 확인 필요 종합

1. ~~구분(`training_schedule_type`) 데이터 소스~~ — **해결됨(4절)**: 상수 `"01"` 고정.
2. **빌더 위젯 연동 방식은 이번 BE 설계 범위 밖** — 목록 `trainingApplHis-list`뿐 아니라 상세 팝업 `trainingApplHisR-detail`(slug id 104, 4절 참고)도 현재 `page_template.config_json`의 `connectedSlug`(각각 `trainingApplHis-data`, `slug_registry` type=`PAGE_DATA`)로 데이터를 가져오는 구조다. `slug_registry`에는 `PAGE_DATA`/`PAGE_TEMPLATE` 두 타입만 존재하며(실측), 본 설계의 신규 REST API(`/api/v1/training-registrations`, `/{id}`)를 이 제네릭 `connectedSlug` 메커니즘이 목록·상세 둘 다 그대로 호출할 수 있는지는 **STEP4(FE 연동 설계)에서 확인 필요**(이번 STEP은 bo-api 신규 API 설계까지만).
3. **`register_period_to`/`register_date_to` 필드명 불일치** — `curriculum_detail2` 실데이터에 구버전(`register_date_from/to`)과 신버전(`register_period_from/to`) 키가 혼재하나, 이번 화면(시작일/종료일)에는 사용하지 않는 필드라 범위 밖으로 별도 조치 없음.
4. **동적 정렬(`sort=`) 미지원** — 7절 참고, MVP는 `created_at DESC` 고정.

