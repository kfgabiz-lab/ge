# Bo 구현 지시서: Space 버튼(action-button) 연결(connType) API 연동 옵션 추가

> 본 지시서는 사용자 승인이 완료된 확정 설계를 bo-builder가 그대로 구현할 수 있는 형태로 번역한 것이다.
> 확정 설계 내용을 임의로 변경하지 않는다. 구현 중 설계와 다른 판단이 필요하면 반드시 재승인을 받는다.

## 0. 퍼블리싱 재사용 근거 (신규 마크업 불필요)

`bo/src/app/admin/templates/builder-contents-layout/page.tsx`에 이미 아래 두 패턴이 퍼블리싱되어 있어
이번 작업은 **신규 마크업 퍼블리싱이 필요 없다.**

- `SAMPLE_SPACE`(303~318행): Space 위젯의 `action-button` 아이템 마크업(`connType: 'close' | 'content'` 예시)이 이미 존재. `connType: 'api'`는 동일한 `SearchFieldConfig` 아이템 셰이프(`type:'action-button'`)를 그대로 따르므로 별도 Space 레이아웃 변경이 없다.
- 108행 부근 `f_auto2` (`selectType: 'autocomplete'`): 입력형 자동완성 드롭다운 UI 패턴이 이미 퍼블리싱되어 있음. 신규 `ApiInfoSelectField`는 이 자동완성 UI 컨벤션(입력창 + Portal 드롭다운 + 검색 필터)을 그대로 따르는 `SlugSelectField` 구현체를 참고하므로, 시각적으로 신규 디자인이 아니다.

따라서 STEP 3(퍼블리싱)은 생략하고 바로 컴포넌트/타입/BE 구현으로 진행 가능하다.

## 1. 그리드 배치

- 해당 없음 — 이번 작업은 Space 위젯 내부 버튼의 "연결" 설정 항목(select + 하위 필드)에 옵션 1개(`<option value="api">`)와 조건부 렌더 블록을 추가하는 것으로, 신규 그리드 셀(colSpan/rowSpan)을 만들지 않는다.
- `ApiInfoSelectField`는 `ActionButtonField` 내부 `connType==='api'` 조건부 블록 안에 렌더되며, 부모 `FieldBase`가 이미 잡고 있는 grid 셀 안에서 세로로 쌓이는 하위 UI다 (popup 연결의 `SlugSelectField` 배치와 동일 위치 구조).

## 2. 스타일 매핑

| 대상 | 사용할 Bo 상수/컴포넌트 |
|------|------------------------|
| `ApiInfoSelectField` 입력창 | `INPUT_CLS` (`./_FieldBase`에서 import, `SlugSelectField.tsx` 28행과 동일) |
| `ApiInfoSelectField` 라벨 | `LABEL_CLS` (`./_FieldBase`) |
| `ActionButtonField` connType select | 기존 `SELECT_CLS`(`ActionButtonField.tsx` 61행) 그대로 재사용 — 신규 클래스 정의 금지 |

신규 raw Tailwind 클래스 조합을 만들지 말 것. 기존 `SlugSelectField.tsx`의 드롭다운 컨테이너 클래스(`bg-white border border-slate-200 rounded shadow-lg max-h-48 overflow-y-auto`)를 그대로 복사해 사용한다 (Bo 상수화되어 있지 않으므로 원본 그대로 재사용, 임의 변형 금지).

## 3. 컴포넌트 구조 및 파일별 변경사항

### 3-1. BE — `ApiInfoController.java` (`bo-api/src/main/java/com/ge/bo/controller/ApiInfoController.java`)

`getList`(33행) 위/아래 아무 곳이나 관례상 `getList` 다음, `getOne` 앞에 추가 (Slug 계열 컨트롤러 순서와 동일하게 `/active`를 `getList` 바로 다음에 배치):

```java
/** 활성 API 정보 전체 목록 (프론트 빌더 셀렉트다운용, 인증 사용자 접근 가능) */
@GetMapping("/active")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<List<ApiInfoResponse>> getActiveList() {
    return ResponseEntity.ok(apiInfoService.getActiveList());
}
```

⚠️ **주의 — 클래스 레벨 `@PreAuthorize` 오버라이드 필수**:
`ApiInfoController`는 클래스 선언(27행)에 `@PreAuthorize("@securityService.isSystemAdmin(authentication)")`가 이미 붙어 있어, 메서드에 별도 `@PreAuthorize`를 달지 않으면 이 신규 엔드포인트도 시스템관리자 전용이 된다.
반면 참고 대상인 `SlugRegistryController`/`SlugEntityController`는 클래스 레벨 `@PreAuthorize`가 없고 각 메서드에 개별로 붙어 있어 `/active`만 인증 사용자 누구나 접근 가능하다.
"동일한 기존 컨벤션을 따른다"는 확정 설계를 그대로 지키려면 위 예시처럼 `@PreAuthorize("isAuthenticated()")`를 메서드에 명시로 덮어써야 한다. (import 추가 불필요 — 이미 `org.springframework.security.access.prepost.PreAuthorize` import되어 있음, 18행)
`List` import는 이미 `java.util.List`가 없으므로 상단에 `import java.util.List;` 1줄 추가 필요.

### 3-2. BE — `ApiInfoService.java` (`bo-api/src/main/java/com/ge/bo/service/ApiInfoService.java`)

`getList` 메서드(52~56행) 바로 아래에 추가:

```java
/* ══════════ 활성 전체 목록 (빌더 드롭다운용) ══════════ */

@Transactional(readOnly = true)
public List<ApiInfoResponse> getActiveList() {
    return apiInfoRepository.findAllByActiveTrueOrderByNameAsc()
            .stream().map(ApiInfoResponse::from).toList();
}
```

`SlugRegistryService.getActiveList()`(42~45행)와 동일한 패턴. `active=true` 필터 + `name` 오름차순 정렬, 페이징 없음.

### 3-3. BE — `ApiInfoRepository.java` (`bo-api/src/main/java/com/ge/bo/repository/ApiInfoRepository.java`)

기존 `existsByMethodAndUrlPattern`(14행) 아래에 파생 쿼리 메서드 1개 추가:

```java
/** 활성 API 목록 조회 (빌더 드롭다운용) — name 오름차순 */
List<ApiInfo> findAllByActiveTrueOrderByNameAsc();
```

`SlugRegistryRepository.findAllByActiveTrueOrderBySlugAsc()`(23행)와 동일 패턴. `ApiInfo` 엔티티의 `active` 필드(`ApiInfo.java` 60행, `Boolean active`)를 그대로 사용 — 별도 컬럼 매핑 불필요.

### 3-4. FE — 신규 컴포넌트 `ApiInfoSelectField.tsx`

경로: `bo/src/app/admin/templates/make/_shared/components/builder/fields/ApiInfoSelectField.tsx`

`SlugSelectField.tsx` 전체 구조를 참고해 **API 도메인 전용으로 새로 작성** (제네릭화 금지, `SlugSelectField` 자체 수정 금지):

```typescript
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { INPUT_CLS, LABEL_CLS } from './_FieldBase';
import { useDropdownPosition } from '@/hooks/use-dropdown-position';
import { useOutsideClick } from '@/hooks/use-outside-click';

/** API 정보 옵션 (GET /api-infos/active 응답 축약형) */
export interface ApiInfoOption {
    id: number;
    name: string;
    method: string;
    urlPattern: string;
}

interface ApiInfoSelectFieldProps {
    /** 선택된 api_info.id — 값 없으면 undefined */
    value: number | undefined;
    onChange: (id: number | undefined) => void;
    apiInfoOptions: ApiInfoOption[];
    label?: string;          // 기본값: "연결 API"
    required?: boolean;
    emptyLabel?: string;     // 기본값: "— API 선택 —"
    hideLabel?: boolean;
}

export function ApiInfoSelectField({
    value, onChange, apiInfoOptions,
    label = '연결 API', required = false,
    emptyLabel = '— API 선택 —', hideLabel = false,
}: ApiInfoSelectFieldProps) {
    // ... SlugSelectField.tsx와 동일한 구조:
    //  - containerRef / inputWrapperRef / dropdownRef
    //  - useDropdownPosition(inputWrapperRef, isOpen)
    //  - useOutsideClick([containerRef, dropdownRef], closeAndRestore, isOpen)
    //  - search/isOpen state, value 동기화 useEffect
    //  - filtered: name/method/urlPattern 포함 여부로 필터링
    //  - handleSelect(opt) → onChange(opt.id)
    //  - handleClear() → onChange(undefined)
}
```

**SlugSelectField와의 도메인별 차이점** (그대로 복붙 금지, 아래만 다르게 작성):
- `value`/`onChange` 타입이 `string`이 아닌 `number | undefined` (api_info.id는 숫자 PK)
- 옵션 매칭 기준: `slugOptions.find(s => s.slug === value)` → `apiInfoOptions.find(o => o.id === value)`
- 표시 텍스트(`formatOption` 대응): `${opt.method} ${opt.name}` — 드롭다운 옵션 항목에서는 `urlPattern`을 `SlugSelectField`가 `slug`를 회색 보조텍스트로 붙이는 것과 동일한 자리에 `(${opt.urlPattern})` 형태로 회색 보조텍스트로 표시
- 검색 필터링 대상 필드: `name` / `method` / `urlPattern` 3개 (SlugSelectField는 `name`/`slug` 2개)

### 3-5. FE — `ActionButtonField.tsx` 수정

파일: `bo/src/app/admin/templates/make/_shared/components/builder/fields/ActionButtonField.tsx`

1. **import 추가** (24~25행 `SlugSelectField` import 바로 아래):
```typescript
import { ApiInfoSelectField } from './ApiInfoSelectField';
import type { ApiInfoOption } from './ApiInfoSelectField';
```

2. **`ActionButtonFieldProps`에 prop 추가** (51~58행 `slugOptions?: SlugOption[];` 바로 아래):
```typescript
/** API 정보 목록 — API 연동 연결(connType='api') 선택용 */
apiInfoOptions?: ApiInfoOption[];
```

3. **컴포넌트 함수 시그니처에 destructure 추가** (127~138행, `slugOptions = [],` 바로 아래):
```typescript
apiInfoOptions = [],
```

4. **connType select에 옵션 추가** (240~252행, `<option value="excel">엑셀 다운로드</option>` 아래 또는 목록 중 적절한 위치):
```jsx
<option value="api">API 연동</option>
```

5. **`handleConnTypeChange` 초기화 필드 추가** (145~157행):
```typescript
const handleConnTypeChange = (newType: string) => {
    onChange({
        connType: newType as '' | 'content' | 'popup' | 'path' | 'close' | 'excel' | 'datasave' | 'api',
        popupSlug: undefined,
        fileLayerSlug: undefined,
        connectedContentWidgetIds: undefined,
        contentAction: undefined,
        excelTableWidgetId: undefined,
        dataSaveSlug: undefined,
        validationRuleIds: undefined,
        contentValidationRuleIds: undefined,
        apiInfoId: undefined,
    });
};
```
⚠️ 147행의 인라인 캐스트(`newType as '' | 'content' | ...`) 유니온에 `'api'` 추가를 빠뜨리지 말 것. TS가 자동 검출하지 못하는 위험 지점.

6. **`connType === 'api'` 렌더 블록 추가** (456~479행 `connType === 'popup'` 블록 패턴을 참고해 그 아래 또는 `path` 블록 앞에 삽입):
```jsx
{connType === 'api' && (
    <div className="space-y-1">
        <ApiInfoSelectField
            hideLabel
            value={values.apiInfoId}
            onChange={id => onChange({ apiInfoId: id })}
            apiInfoOptions={apiInfoOptions}
            emptyLabel="— API 선택 —"
        />
    </div>
)}
```
(popup 블록과 달리 `params` 입력란은 확정 설계에 없으므로 추가하지 않는다 — 6번 "이번 범위에서 제외" 참고)

### 3-6. FE — Prop 체인 연결 (slugOptions와 동일 경로로 apiInfoOptions 위협)

`ActionButtonField`는 `SpaceBuilder`에서만 사용되며 (`grep` 확인 결과 다른 소비처 없음), `SpaceBuilder`는 `CommonBuilderDispatcher`를 통해서만 3개 컨테이너 페이지(`widget/page.tsx`, `quick-detail/page.tsx`, `quick-list/page.tsx`)에서 렌더된다. `slugOptions`가 정확히 이 경로로 흐르고 있으므로 **동일한 체인**으로 `apiInfoOptions`를 추가한다.

**a) `SpaceBuilder.tsx`** (`bo/src/app/admin/templates/make/_shared/components/builder/SpaceBuilder.tsx`)
- import 추가 (35~36행 `ContentWidgetOption`/`SlugOption` import 아래): `import type { ApiInfoOption } from './fields/ApiInfoSelectField';`
- `SpaceBuilderProps`에 prop 추가 (88~89행 `slugOptions?: SlugOption[];` 아래): `apiInfoOptions?: ApiInfoOption[];`
- 컴포넌트 함수 인자 destructure에 `apiInfoOptions = [],` 추가 (기존 `slugOptions` destructure 위치와 동일선상)
- `<ActionButtonField ... slugOptions={slugOptions} />` 호출부(301~312행)에 `apiInfoOptions={apiInfoOptions}` 추가

**b) `CommonBuilderDispatcher.tsx`** (`bo/src/app/admin/templates/make/_shared/components/builder/CommonBuilderDispatcher.tsx`)
- `context` 타입에 필드 추가 (28행 `slugOptions: {...}[];` 아래):
```typescript
/** API 정보 목록 — Space ActionButton API 연동 연결용 */
apiInfoOptions?: { id: number; name: string; method: string; urlPattern: string }[];
```
- 함수 destructure(47행)에 `apiInfoOptions = []` 추가
- `case 'space':` 블록(81~93행) `<SpaceBuilder ... slugOptions={slugOptions} />`에 `apiInfoOptions={apiInfoOptions}` 추가

**c) 컨테이너 페이지 3곳** — 각 파일에서 기존 `slugOptions` state/fetch 바로 아래에 동일 패턴으로 `apiInfoOptions` state 추가, 그리고 `space` 위젯으로 연결되는 `context={{ slugOptions, ... }}` 호출부에 `apiInfoOptions` 추가:

| 파일 | 기존 slugOptions fetch 위치 | 추가할 위치 |
|------|---------------------------|------------|
| `bo/src/app/admin/templates/make/widget/page.tsx` | 210~215행 (`/slug-registry/active`) | 215행 바로 다음 줄에 신규 useEffect 추가, 829행 부근 `context={{ slugOptions, ... }}`에 `apiInfoOptions` 추가 |
| `bo/src/app/admin/templates/make/quick-detail/page.tsx` | 104~109행 | 109행 바로 다음 줄에 신규 useEffect 추가, 320~321행 `context={{ slugOptions, ... }}`에 `apiInfoOptions` 추가 |
| `bo/src/app/admin/templates/make/quick-list/page.tsx` | 102~107행 | 107행 바로 다음 줄에 신규 useEffect 추가, `actionButtonOnly: true`가 붙은 space 전용 context 호출부(285행 부근)에 `apiInfoOptions` 추가 |

각 파일에 추가할 fetch 코드 (3곳 동일, `slugOptions` fetch 패턴 그대로 미러링):
```typescript
/* ── API 정보 — Space ActionButton API 연동 연결용 ── */
const [apiInfoOptions, setApiInfoOptions] = useState<{ id: number; name: string; method: string; urlPattern: string }[]>([]);
useEffect(() => {
    api.get('/api-infos/active')
        .then(res => setApiInfoOptions(res.data || []))
        .catch(() => { /* 조회 실패 시 빈 배열 유지 */ });
}, []);
```

## 4. 필드(타입) 구성

두 타입 정의 파일을 **반드시 동시에** 수정한다 (한쪽만 수정 시 타입 불일치 오류):

### 4-1. `bo/src/app/admin/templates/make/_shared/types.ts` — `SearchFieldConfig` (82행 부근)

```diff
- connType?: '' | 'content' | 'popup' | 'path' | 'close' | 'excel' | 'datasave'; // 클릭 시 연결 방식
+ connType?: '' | 'content' | 'popup' | 'path' | 'close' | 'excel' | 'datasave' | 'api'; // 클릭 시 연결 방식
```

`dataSaveSlug?: string;`(92행) 아래에 추가:
```typescript
apiInfoId?: number;   // API 연동 연결 api_info.id (connType='api' 전용)
```

### 4-2. `bo/src/app/admin/templates/make/_shared/components/builder/fields/types.ts` — `FieldEditValues` (72행 부근)

```diff
- connType?: '' | 'content' | 'popup' | 'path' | 'close' | 'excel' | 'datasave'; // 클릭 시 연결 방식
+ connType?: '' | 'content' | 'popup' | 'path' | 'close' | 'excel' | 'datasave' | 'api'; // 클릭 시 연결 방식
```

`dataSaveSlug?: string;`(81행) 아래에 추가:
```typescript
apiInfoId?: number;   // API 연동 연결 api_info.id (connType='api' 전용)
```

## 5. preview/live 처리

- **preview(빌더 화면) 모드**: `connType='api'` 선택 시 `ApiInfoSelectField`로 `api_info` 목록에서 1건을 선택하고 `apiInfoId`로 저장되는 것까지만 구현. 버튼을 클릭해도 실제 API 호출은 발생하지 않는다 (다른 connType들도 preview에서는 클릭 동작이 비활성인 것과 동일선상).
- **live 모드**: 이번 STEP 범위 아님. `SpaceRenderer.tsx`에서 버튼 클릭 시 `apiInfoId`로 실제 API를 실행하는 로직은 사용자 확정 설계 7번에 따라 **구현하지 않는다.** 이후 별도 STEP으로 분리해 진행한다.

## 6. 주의사항

- **절대 건드리면 안 되는 무관 connType 유니온** (사용자 확정 설계 8번, 다른 도메인이므로 이번 작업에서 손대지 않는다):
  - `EditPageRule.connType` (`bo/src/app/admin/templates/make/_shared/types.ts` 254행)
  - `NavItem.connType` (`bo/src/app/admin/templates/make/_shared/types.ts` 330행)
  - `TableColumnConfig.connType`
  - `ActionsField.tsx` / `TableButtonField.tsx`의 connType
- **Tailwind 동적 클래스 금지**: `ApiInfoSelectField`는 `SlugSelectField`처럼 고정 클래스 문자열만 사용하고, `` `bg-${color}` `` 같은 동적 조합 클래스를 만들지 않는다.
- **인라인 코딩 금지**: `ActionButtonField.tsx` 내부에 `connType==='api'` 블록을 자체 select/input으로 직접 구현하지 말고 반드시 `ApiInfoSelectField` 컴포넌트로 분리해서 사용한다 (Rule 10 컴포넌트 유지 원칙).
- **BE `@PreAuthorize` 확인 필수**: 3-1 항목의 클래스 레벨 `@PreAuthorize` 오버라이드를 빠뜨리면, 시스템관리자가 아닌 일반 빌더 사용자는 `ApiInfoSelectField` 드롭다운이 항상 빈 목록으로 보인다 (403으로 인해 `.catch()`가 빈 배열 유지). 반드시 검증 단계에서 비관리자 계정으로도 목록이 뜨는지 확인할 것.
- **prop 체인 누락 주의**: `slugOptions`가 3개 컨테이너 페이지 → `CommonBuilderDispatcher` → `SpaceBuilder` → `ActionButtonField` 4단계를 거치는 것과 동일하게, `apiInfoOptions`도 4단계 전부 빠짐없이 연결해야 한다. 한 단계라도 누락되면 TS 컴파일 에러 없이(모두 optional prop이므로) 조용히 빈 배열로 폴백되어 런타임에서만 드러난다 — 구현 후 반드시 4단계 전부 grep으로 재확인할 것.
- **범위 제외 항목** (사용자 확정 설계 7번): `SpaceRenderer.tsx`의 live 모드 실제 API 호출 로직은 이번 지시서에 포함하지 않았다. 별도 STEP.
