# FE 설계 — Space 액션버튼 connType='api' 이중 모드

> 작성일: 2026-07-13
> 대상: Space 위젯 action-button 필드, connType='api'
> 상태: 구현 완료

---

## 1. 트리거 축

| 축 | 조건 | 동작 |
|---|---|---|
| **mode1** | `field.apiInfoId === undefined` | api_info 조회 없음. 선택된 Form(main)/SubList(sub)을 id 유무로 판단해 entity 엔드포인트에 직접 POST/PUT |
| **mode2** | `field.apiInfoId` 값 있음 | 선택한 api_info 1건만 호출. 선택 컨텐츠위젯은 항상 단일 flat 바디로 합쳐 전송(자식 체이닝 없음) |

분기 지점: `useWidgetPageState.ts` `handleApiCall(apiInfoId, paramsStr, connectedContentWidgetIds)` 최상단
`if (apiInfoId == null) { ...mode1...; return; }`

---

## 2. 파일별 변경 지점

### 2-1. `ActionButtonField.tsx` (빌더 설정 UI)

```
connType === 'api' 블록 (약 463~540행)
- showContentWidgets = !values.apiInfoId || supportsContentData
  (기존: values.apiInfoId 유무로만 게이팅 → mode1에서 selectedApi 없어 supportsContentData가
   항상 false였던 숨은 갭 제거)
- apiContentWidgets = mode에 따라 체크박스 목록 자체를 분기 필터링
  - mode2(values.apiInfoId 있음): `type !== 'table'` → Form/SubList/MultiSelect 노출(기존 동작 유지)
  - mode1(values.apiInfoId 없음): `type === 'form' || type === 'sublist'` → MultiSelect는 목록에서부터 제외
    (mode1은 handleApiCall에서 애초에 Form/SubList만 대상으로 삼으므로, MultiSelect를 체크해도
     조용히 무시되는 UX를 막기 위해 선택 UI 단계에서 원천 차단)
- 컨텐츠위젯 체크박스 블록: showContentWidgets 조건으로 노출 (mode1/mode2 공통, 목록 내용은 위 필터로 분기)
- params 입력 필드: values.apiInfoId 있을 때만 노출 (mode2 전용 — mode1은 api_info 없어 의미 없음)
- mode1 안내 문구: !values.apiInfoId 일 때 "자동 모드: 선택한 Form/SubList를
  id 유무로 생성/수정 처리합니다." 1줄 노출 (기존 안내 텍스트 스타일 클래스 재사용)
```

### 2-2. `SpaceRenderer.tsx`

```
handleButtonClick 내부 (약 102~104행)
- 변경 전: else if (field.connType === 'api' && field.apiInfoId) { onApiCall?.(field.apiInfoId, ...) }
- 변경 후: else if (field.connType === 'api') { onApiCall?.(field.apiInfoId, ...) }
  → apiInfoId 없어도 onApiCall 호출 (field.apiInfoId는 optional로 그대로 전달 → undefined면 mode1)

타입: onApiCall?: (apiInfoId: number | undefined, params?: string, connectedContentWidgetIds?: string[]) => void;
```

### 2-3. `useWidgetPageState.ts` — `handleApiCall`

시그니처 변경:
```ts
const handleApiCall = useCallback(
  async (apiInfoId: number | undefined, paramsStr?: string, connectedContentWidgetIds?: string[]) => { ... }
```

#### mode1 로직 (apiInfoId == null)

| 단계 | 내용 |
|---|---|
| 대상 수집 | `connectedContentWidgetIds` 중 type이 `form`/`sublist`인 위젯만 대상 (multiselect/table 제외). MultiSelect는 애초에 `ActionButtonField.tsx`의 `apiContentWidgets`가 mode1일 때 체크박스 목록에서부터 제외하므로 선택 자체가 불가능하다 |
| 유효성 검사 | `validateDataSaveWidgets` 재사용 |
| main/sub 분류 | main = 선택된 Form 중 첫 번째. sub = main과 `connectedSlug`가 다른 SubList 전체(이 시점에는 `parentIdField` 유무를 따지지 않음) |
| 자식 저장 루프 내부 | sub 각 위젯을 순회하며 `connectedSlug` 또는 `parentIdField`가 없으면 그 위젯은 warning 메시지만 남기고 저장을 skip(continue) — 나머지 sub 위젯은 계속 처리 |
| 현재 레코드 식별 | `storedId = searchParams.get("id") ?? options?.sharedDataId`, `storedGroupId = searchParams.get("group_id") ?? currentGroupId`, `existingParentId = storedId ?? Number(storedGroupId)` — `handleContentAction`(1047~1051행)과 동일 판별 기준 재사용 |
| 부모(main) 판단 | `existingParentId` 있으면 `PUT entityItemPath(mainSlug, id)`, 없으면 `POST entityApiPath(mainSlug)` → 생성 시 응답 id를 parentId로 사용 |
| 자식(sub) 각 행 판단 | `typeof row.id === 'number'` → `PUT entityItemPath(subSlug, row.id)` (기존행). 그 외(UUID 문자열, 신규행) → `POST entityApiPath(subSlug)` |
| 바디 변환 | `buildDataJson(..., isEntity=true)` → `buildEntityRequestBody` + `buildEntityDateFieldMeta`/`buildSubListEntityDateFieldMeta` 그대로 재사용 |
| 실패 처리 | 성공/실패 카운트 집계 후 toast만 표시 (롤백 없음 — 기존 정책 유지) |

#### mode2 로직 (apiInfoId 있음) — 변경 사항

- 기존: `apiInfo.connectedEntity && formWidgetsForParent.length > 0` 조건으로 `childSubListWidgets`를 분류해 부모 저장 후 자식 SubList를 개별 엔드포인트로 체이닝 저장하던 로직 **완전 제거**.
- 변경 후: 선택된 `targetWidgets` 전체를 그대로 `buildDataJson`에 넘겨 **항상 단일 flat 바디**로 조립 → `api.request({ method, url, data: { ...contentBody, ...restParams } })` 한 번만 호출.
- `apiInfo.connectedEntity` 여부에 따라 `buildEntityRequestBody` 변환 적용 여부만 그대로 유지(§02.builder_data_process.md 패턴).

### 2-4. 타입 전파

`apiInfoId: number` → `apiInfoId?: number` (SearchFieldConfig, 기존 이미 optional) /
`onApiCall` 콜백 시그니처 `(apiInfoId: number, ...)` → `(apiInfoId: number | undefined, ...)`

영향 파일: `SpaceRenderer.tsx:52`, `WidgetRenderer.tsx:176`, `PageGridRenderer.tsx:87`.
`page.tsx`는 `gridProps` 스프레드 방식이라 수정 불필요.

---

## 3. 하위 호환 변경사항 (Breaking Change)

기존에 **`connType='api'` + apiInfoId 선택 + `apiInfo.connectedEntity` 설정** 조합으로 동작하던
"부모 Form 저장 후 자식 SubList 자동 체이닝 저장" 기능은 **mode2에서 완전히 제거**되었다.

- 기존 설정을 그대로 두면: apiInfoId가 여전히 선택돼 있으므로 mode2로 동작하며, 선택된 Form+SubList
  데이터가 **하나의 flat 바디**로 합쳐져 apiInfoId가 가리키는 API 엔드포인트 1건에만 전송된다.
  (자식 SubList가 부모와 다른 entity라면 저장 바디에 알 수 없는 필드가 섞여 서버가 거부할 수 있음)
- **전환 방법**: 부모/자식 자동 체이닝이 필요한 설정은 action-button에서 **apiInfoId 선택을 해제**
  (`— API 선택 —`으로 되돌림)하면 mode1로 전환되어 동일한 체이닝 저장(id 유무 기반 생성/수정)이 수행된다.

---

## 4. 트랜잭션 실패 처리

부모 저장 성공 후 자식 저장 일부 실패 시에도 롤백/보상 로직은 없다 — 기존과 동일하게
`toast.error`로 실패 건수만 안내한다 (mode1/mode2 공통 정책, 재논의 없이 유지).
