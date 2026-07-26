# Training 신청 내역(관리자 조회) FE 연동 상세 설계서

> 대상 화면
> - 목록: `bo` `/admin/widget/trainingApplHis-list` (PAGE_TEMPLATE, slug_registry id=113) — 테이블 위젯 데이터 소스를 신규 API로 교체
> - 상세 팝업: `trainingApplHisR-detail` (slug id 104, type PAGE) — Form 위젯 데이터 소스를 신규 API로 교체
> 선행 문서: [be_training-registration.md](./be_training-registration.md) — 신규 API `GET /api/v1/training-registrations`, `GET /api/v1/training-registrations/{id}` 확정.
> 이 문서는 "빌더 프레임워크가 신규 REST API를 그대로 호출할 수 있는가"를 코드로 실측하고, 못 하는 부분의 최소 보완만 설계한다. 실제 코드 구현/DB config_json 변경은 이 문서 범위 밖(후속 STEP).

---

## 1. connectedSlug 데이터 흐름 실측 (코드 인용)

빌더 프레임워크의 Table/Form 위젯 데이터 조회는 **페이지 레벨 `connectedType` 값**에 따라 두 경로로 완전히 갈린다.

### 1.1 트리거 판정 — 오직 `connectedType === 'data'`

`useWidgetPageState.ts:373`
```ts
const pageIsEntity = options?.connectedType === "data";
```
- `connectedType`은 PAGE 템플릿 `configJson.connectedType`에서 온다(`widget/[slug]/page.tsx:64` `setConnectedType(config.connectedType || undefined)`).
- 타입 유니온은 `'none' | 'slug' | 'entity' | 'data'`(`useOutputMode.ts:19`)지만, **런타임에서 entity REST API를 타는 값은 `'data'` 하나뿐이다.** `'entity'`는 빌더에서 Form 필드를 엔티티 정의로부터 자동생성(EntityBuildButton)하는 빌드타임 개념일 뿐, 런타임 조회는 여전히 page_data 경로다. (⚠️ `useWidgetPageState.ts:133~138`, `widget/page.tsx:33` 주석은 "'entity' | 'data'면"이라 적혀 있으나 실제 코드는 `=== "data"`만 검사 — 주석이 코드보다 넓게 서술된 상태. 본 설계는 코드 기준으로 `'data'`만 사용한다.)

### 1.2 목록 테이블 조회 — `fetchTableData` (`useWidgetPageState.ts:443~542`)

```ts
// line 494 — entity 모드는 검색 파라미터를 아예 싣지 않는다
if (!isEntity) {
  Object.assign(params, buildSearchQueryParams(searchFields, sv));
}
// line 499 — URL 분기
const url = isEntity ? entityApiPath(connectedSlug) : `/page-data/${connectedSlug}`;
const res = await api.get(url, { params });
// line 503~517 — 응답 정규화 분기
const envelope = isEntity ? normalizeEntityPageEnvelope(res.data) : res.data;
const rows = isEntity
  ? (envelope.content as ...).map(normalizeEntityRow)
  : (envelope.content as ...).map(flattenPageDataItem);
```

| 항목 | `connectedType='none'`/`'slug'` (현재 상태, PAGE_DATA) | `connectedType='data'` (entity REST) |
|:---|:---|:---|
| URL | `/page-data/{connectedSlug}` | `entityApiPath(slug)` = `/{slug}` → 실제 `/api/v1/{slug}` (axios baseURL=`/api/v1`) |
| 검색 파라미터 | `buildSearchQueryParams`로 전송 | **전송 안 함** (line 494 `if (!isEntity)`) |
| 기대 행 shape | `{ id, dataJson, createdAt, ... }` (JSONB 래핑) → `flattenPageDataItem` | flat 행 `{ id, ...필드, createdAt, ... }` → `normalizeEntityRow` |
| 기대 envelope | `PageDataListResponse` = `{ content, totalElements, totalPages, page, first, last }` | Spring Data `Page<T>` = `{ content, ..., number }` → `normalizeEntityPageEnvelope`가 `number`→`page`로 변환 |

### 1.3 상세 팝업 조회 — 목록과 다른 경로 (`WidgetRenderer.tsx`)

actions 컬럼 상세 버튼 → `handleInternalPopupOpen(detailPopupSlug, row._id, ...)`(`WidgetRenderer.tsx:1728~1735`). 이 함수는 `useWidgetPageState`를 **쓰지 않고 자체 fetch**한다. 팝업 대상 템플릿의 `outputMode`에 따라 또 갈린다:

- **`outputMode==='page'`** (`WidgetRenderer.tsx:720~732`): `router.push('/admin/widgetSub/{slug}?id=N')`. → `widgetSub/[slug]/page.tsx`가 `useWidgetPageState({ enableUrlEditMode:true, connectedType })`를 태워 **`connectedType='data'`를 그대로 존중**(`useWidgetPageState.ts:782~789` `pageIsEntity ? entityItemPath(slug,id) : /page-data/{slug}/{id}`).
- **`outputMode==='layerpopup'`** (내부 팝업): 폼 값은 `fetchAndMapFieldValues`로 조회(`WidgetRenderer.tsx:791`), 이 함수는 **`/page-data/{connectedSlug}/{editId}` 경로가 하드코딩**되어 있고 entity 분기가 없다(`WidgetRenderer.tsx:120`). 팝업 내부 테이블 조회도 `/page-data/{slug}` 하드코딩(`WidgetRenderer.tsx:754`).

> 즉 상세 팝업이 `layerpopup`이면 `connectedType='data'`를 설정해도 무시되고 항상 page_data를 친다. `page`면 목록과 같은 entity 경로를 재사용한다. **확인 완료**: `trainingApplHisR-detail`(slug id 104) config_json 원문에 `"outputMode":"page"`로 이미 저장돼 있음(be 문서 작성 시 실측한 원문에서 직접 확인) — 아래 2.4/5.3은 A안(page)으로 확정한다.

---

## 2. 조사 결과 판정

### 2.1 entity/data 모드 실사용 여부

- 빌더 UI는 `connectedType='entity'`(Slug Entity)/`'data'`(Data Entity) 선택 + 엔티티 필드 자동생성(EntityBuildButton)까지 완비되어 있다(`OutputModePanel.tsx:210~277`, `widget/page.tsx:236~250`). 런타임 entity 경로(`entityApi.ts` 전체, `fetchTableData` isEntity 분기)도 프로덕션 배선 완료 상태다.
- **다만 "현재 어떤 운영 템플릿이 `connectedType='data'`로 저장돼 있는가"는 config_json(DB) 실측이 필요하며 코드만으로는 특정 화면을 지목할 수 없다.** 코드상 이 경로는 `SlugEntityCodeGenerator`가 생성한 Data Entity CRUD 화면을 위한 정식 메커니즘이며(가이드 `docs/ge_guide/builder/06.builder_entity_to_api_guide.md`), 본 화면도 이 경로에 **신규 수제 컨트롤러 API를 얹는 방식**으로 재사용한다. (추측으로 특정 화면명을 단정하지 않음 — 근거는 코드 경로의 존재까지다.)

### 2.2 신규 API 응답 호환성 판정

BE 응답(`TrainingRegistrationPageResponse`)은 `{ content, totalElements, totalPages, page, first, last }` + **flat 행**이다(be 문서 8절). entity 경로 기준으로 대조:

| 검사 지점 | 결과 |
|:---|:---|
| 행 shape (flat `{id, ...필드, createdAt}`) | ✅ `normalizeEntityRow`가 기대하는 flat 구조와 일치. 없는 감사컬럼(`createdBy`/`updatedAt`/`updatedBy`)은 destructure 시 `undefined`→`null` 처리라 무해(`entityApi.ts:55`). |
| envelope `content`/`totalElements`/`totalPages`/`last` | ✅ 그대로 사용됨. `hasMore = envelope.last === false`(`useWidgetPageState.ts:519`). |
| envelope `page` vs `number` | ⚠️ **cosmetic 불일치**. `normalizeEntityPageEnvelope`는 `raw.number`를 읽어 `page`로 매핑(`entityApi.ts:98`)하나 BE는 `page` 필드로 내려 `number`가 없다 → `envelope.page = undefined`. 그러나 `fetchTableData`는 `currentPage`에 인자 `page`를 쓰고(`useWidgetPageState.ts:528`) `envelope.page`를 읽지 않으므로 **실동작 무해**. 정규화 코드 수정 불필요. |

결론: **목록 조회는 entity 경로와 shape/envelope 모두 호환**. 별도 정규화 추가 코드는 불필요하다. 남은 유일한 실질 문제는 검색(2.3)과 상세 팝업 경로(2.4)다.

### 2.3 검색 파라미터 전송 가능 여부 — 불가 (해결 필요)

- **실측 확정**: entity 모드는 `if (!isEntity)` 가드(`useWidgetPageState.ts:494`)로 검색 파라미터를 서버로 **전송하지 않는다.** 주석도 "entity API는 검색조건 파라미터를 지원하지 않으므로"라고 명시. 이 가정은 codegen 엔티티 API에 대해선 맞지만, **본 화면의 수제 컨트롤러 `/api/v1/training-registrations`는 be 문서 8절대로 9개 검색 파라미터를 정식 지원**하므로 가정이 이 API에는 틀리다.
- 검색은 이 화면의 실사용 필수 요구사항이므로 **최소 보완 필요**(2.4/5절 설계).

### 2.4 상세 팝업 경로 판정 — `outputMode='page'` 확정

`trainingApplHisR-detail`의 config_json 원문에 `"outputMode":"page"`로 저장돼 있음을 확인했다(A안 확정, layerpopup 분기 불필요):
- widgetSub 경로가 `connectedType='data'`를 이미 존중 → **FE 코드 변경 불필요**, config만 교체(5.3 참고).
- `WidgetRenderer.tsx`의 `fetchAndMapFieldValues`/`handleInternalPopupOpen` 관련 B안(layerpopup 분기)은 이 화면에는 적용되지 않는다 — 참고용으로만 문서에 남겨둔다.

---

## 3. 데이터 소스 교체 개요

```
[현재]  목록 table.connectedSlug = "trainingApplHis-data" (page_data, PAGE_DATA)  → /page-data/trainingApplHis-data
        상세 form.connectedSlug  = "trainingApplHis-data"                         → /page-data/trainingApplHis-data/{id}

[변경]  page.connectedType = "data"
        목록 table.connectedSlug = "training-registrations"  → /api/v1/training-registrations       (+검색 파라미터)
        상세 form.connectedSlug  = "training-registrations"  → /api/v1/training-registrations/{id}
```

`training-registrations`는 slug_registry에 등록된 slug가 아니라 **수제 컨트롤러의 경로 세그먼트**다. 런타임 fetch(`api.get('/'+slug)`)는 slug_registry를 조회하지 않으므로 등록 없이 동작한다. (빌더 UI의 Data Entity 드롭다운에는 노출되지 않으므로 connectedSlug/connectedType는 config_json에 직접 값을 세팅한다 — DB 반영은 후속 STEP.)

---

## 4. 컬럼/검색 필드 key 정합 (config_json)

entity 경로는 응답 필드명(camelCase)을 accessor로 매칭한다. `normalizeEntityRow`가 camelCase↔snake_case 별칭을 얹어주므로(`entityApi.ts:67~72`, `getCasingAliases`) **camelCase 또는 그 snake_case 변형은 자동 매칭**되지만, 레거시 config의 임의 accessor(`trainingDate_from`, `curriculum` 등)는 매칭되지 않는다. 아래 표대로 config_json의 컬럼 accessor / 검색 fieldKey를 **BE 응답 필드명에 맞춰 정렬**해야 한다.

### 4.1 목록 컬럼 accessor (BE `TrainingRegistrationResponse` 필드명 기준)

| 화면 항목 | accessor 설정값 | 비고 |
|:---|:---|:---|
| 구분 | `trainingScheduleType` | 항상 `"01"`(be 4절) |
| 교육방식 | `trainingType` | CSV, 코드그룹 TRAININGTYPE |
| Training | `trainingCourse` | TRAININGCOURSE |
| 커리큘럼 | `curriculumTitle` | 레거시 `curriculum` → `curriculumTitle`로 변경 |
| 제목 | `title` | |
| 시작일 | `trainingDateFrom` | 레거시 `trainingDate_from` → `trainingDateFrom` |
| 종료일 | `trainingDateTo` | 레거시 `trainingDate_to` → `trainingDateTo` |
| 신청일시 | `createdAt` | |
| 발송대상(이메일) | `email` | 마스킹은 위젯 렌더 단계(be 6절) — 변경 없음 |
| 신청자 | `applicant` | |
| actions(상세) | — | `detailPopupSlug='trainingApplHisR-detail'`, `editPageRules`는 모든 행 `01`→항상 R-detail(be 4절) |

> 마스킹(`maskType`)·코드그룹 매핑·정렬 옵션 등 나머지 컬럼 설정은 그대로 유지. 단 **정렬**: BE는 `created_at DESC` 고정이고 동적 `sort=`를 무시(be 7절)하므로, sortable 컬럼을 켜두면 정렬 클릭이 무반응이다 → 신청일시 외 컬럼 `sortable`은 끄는 것을 권장(무해하나 UX 혼선 방지).

### 4.2 검색 필드 fieldKey (BE 요청 파라미터명 기준, be 8절)

| 검색 필드 | type | fieldKey / fieldKey2 | 전송 파라미터 |
|:---|:---|:---|:---|
| 교육방식 | select | `trainingType` | `trainingType` |
| Training | select | `trainingCourse` | `trainingCourse` |
| 커리큘럼 | input | `curriculum` | `curriculum` |
| 제목 | input | `title` | `title` |
| 구분 | select | `trainingScheduleType` | `trainingScheduleType`(값 `01` 외엔 0건) |
| 신청일 범위 | dateRange | `createdFrom` / `createdTo` | `createdFrom`,`createdTo` |
| 시작일 범위 | dateRange | `trainingDateFrom` / `trainingDateTo` | `trainingDateFrom`,`trainingDateTo` |
| 종료일 범위 | dateRange | `trainingDateToFrom` / `trainingDateToTo` | `trainingDateToFrom`,`trainingDateToTo` |
| 검색기간유형 | select | `searchPeriodType` | FE 전용 토글(BE 미사용), `excludeFromSearch` 권장 |

> dateRange는 기본적으로 `{fieldKey}_from`/`_to`를 만들지만, **`fieldKey2`를 지정하면 시작=`fieldKey`/종료=`fieldKey2` 파라미터명을 그대로 전송**한다(`buildSearchQueryParams` `utils.ts:2403~2406`). BE 파라미터명이 `createdFrom`/`createdTo`처럼 독립 쌍이므로 fieldKey2 방식을 사용한다.

---

## 5. 최종 연동 방식 (config_json 값 + FE 코드 변경)

### 5.1 목록 `trainingApplHis-list` — config_json 설정

1. 최상위: `"connectedType": "data"` 추가.
2. table 위젯: `"connectedSlug": "training-registrations"` (레거시 `trainingApplHis-data`에서 교체).
3. 컬럼 accessor / 검색 fieldKey: 4절 표대로 정렬.

### 5.2 목록 검색 활성화 — FE 최소 보완 (필수)

entity 모드의 검색 파라미터 차단(2.3)을 **이 화면만 opt-in**으로 여는 방식. 전역 entity 화면에 영향을 주지 않기 위해 페이지 레벨 플래그를 신설한다(가드 전면 제거 대신).

- **`useWidgetPageState.ts`**
  - `UseWidgetPageStateOptions`에 `entitySearchEnabled?: boolean` 추가(주석 포함).
  - `fetchTableData` 파라미터 가드(`line 494`)를 다음으로 변경:
    ```ts
    // 변경 전:  if (!isEntity) { Object.assign(params, buildSearchQueryParams(searchFields, sv)); }
    // 변경 후:  if (!isEntity || options?.entitySearchEnabled) { Object.assign(params, buildSearchQueryParams(searchFields, sv)); }
    ```
    (BE가 인식하지 못하는 파라미터는 Spring이 무시하므로, 이 플래그가 켜진 화면만 파라미터를 실어도 안전.)
- **`widget/[slug]/page.tsx`**
  - `WidgetConfig`에 `entitySearch?: boolean` 필드 추가.
  - `useWidgetPageState(widgetItems, slug, { connectedType, entitySearchEnabled: config.entitySearch })`로 전달.
- **config_json**: 목록 최상위에 `"entitySearch": true` 추가.

> 대안(비권장): `line 494` 가드를 무조건 제거. 코드량은 더 적으나 기존 모든 `connectedType='data'` 화면이 갑자기 검색 파라미터를 전송하게 되어(현재는 미전송) codegen 컨트롤러가 필터를 시작할 가능성 → 영향도 큼. 플래그 방식이 blast radius 0.

### 5.3 상세 팝업 `trainingApplHisR-detail` — `outputMode='page'` 확정 (widgetSub 경로)

- config_json만 변경: 최상위 `"connectedType": "data"`, 각 Form 위젯 `"connectedSlug": "training-registrations"`.
- Form 필드 `fieldKey`를 `TrainingRegistrationDetailResponse` 필드명(camelCase: `trainingType`, `trainingCourse`, `curriculumTitle`, `title`, `studentName`→`applicant` 등, be 9절)에 맞춰 정렬.
- **FE 코드 변경 불필요**(`useWidgetPageState`가 `entityItemPath`로 `/api/v1/training-registrations/{id}` 조회).
- 날짜 필드는 `buildEntityDateFieldMeta`+`restoreEntityDateFields`가 자동 변환(`useWidgetPageState.ts:782~789`).

> `outputMode='layerpopup'`용 `WidgetRenderer.tsx` 분기(B안)는 이 화면에 해당 없음 — 적용하지 않는다.

---

## 6. 신규 / 재사용 파일

| 구분 | 파일 | 변경 |
|:---|:---|:---|
| 수정(필수) | `bo/.../hooks/useWidgetPageState.ts` | `entitySearchEnabled` 옵션 추가 + `fetchTableData` line 494 가드 확장 (검색 활성화) |
| 수정(필수) | `bo/src/app/admin/widget/[slug]/page.tsx` | `WidgetConfig.entitySearch` + 옵션 전달 |
| 재사용(변경 없음) | `bo/.../components/renderer/WidgetRenderer.tsx` | `outputMode='page'` 확정으로 이 파일 변경 불필요(layerpopup 분기 미적용) |
| 재사용(변경 없음) | `bo/.../utils/entityApi.ts` | `entityApiPath`/`entityItemPath`/`normalizeEntityRow`/`normalizeEntityPageEnvelope`/`buildEntityDateFieldMeta`/`restoreEntityDateFields` 그대로 호출 |
| 재사용(변경 없음) | `bo/.../utils.ts` | `buildSearchQueryParams`(fieldKey2 dateRange 매핑), `flattenPageDataItem` |
| 재사용(변경 없음) | `widgetSub/[slug]/page.tsx` | 상세 팝업 A안(outputMode='page') 시 그대로 동작 |
| config_json(후속 STEP, DB) | `page_template` (slug `trainingApplHis-list`, `trainingApplHisR-detail`) | `connectedType`/`connectedSlug`/accessor·fieldKey/`entitySearch` 값 세팅 |

> ⚠️ 신규 컴포넌트/신규 공통 함수 생성 없음. 전부 기존 entity 런타임 유틸 재사용 + 최소 분기 추가. bo-builder 착수 시 `reuse-check-result.json`로 재사용 근거 확정 권장.

---

## 7. STEP6(구현) 전 확인 체크리스트

- [ ] `trainingApplHis-list` config_json 실값에서 table `connectedSlug`/컬럼 accessor/검색 fieldKey 현재값 확인
- [x] `trainingApplHisR-detail` config_json의 `outputMode` 확인 → `page` 확정(2.4)
- [ ] 검색 필드 fieldKey를 BE 파라미터명(4.2)과 일치시켰는지 확인 (불일치 시 검색 무반응)
- [ ] 컬럼 accessor를 BE 응답 필드명(4.1)과 일치시켰는지 확인 (불일치 시 셀 공백)
- [ ] 정렬: 신청일시 외 컬럼 sortable off (BE `created_at DESC` 고정, 동적 sort 미지원)

---

## 8. 미해결/범위 밖

1. 동적 정렬(`sort=`) — BE 미지원(be 7절). FE도 sortable off로 회피, 별도 요청 시 별도 STEP.
2. `connectedType='data'`로 저장된 기존 운영 템플릿 특정 — config_json(DB) 실측 필요, 코드 범위 밖.
3. `useWidgetPageState.ts`/`widget/page.tsx` 주석의 "'entity' | 'data'" 서술이 코드(`=== 'data'`)보다 넓은 점 — 본 화면과 무관하나, 후속 정리 시 주석-코드 정합 권고(가이드 개선 후보).
</content>
</invoke>
