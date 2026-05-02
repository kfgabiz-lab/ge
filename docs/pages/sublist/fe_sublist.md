# SubList 컨텐츠 컴포넌트 FE 상세 설계서

> 작성일: 2026-05-02
> 버전: v0.1

---

## 1. 개요

### 1.1 설계 목적

폼(Form) 위젯 내 저장 컨텍스트에서, **단일 값이 아닌 다건 행(Row) 배열**을 입력·수정·삭제할 수 있는 컨텐츠 컴포넌트를 추가한다.

기존 위젯 타입(Table)은 API 데이터를 조회 전용으로 표시하는 반면, SubList는 **입력 목적의 편집 가능한 테이블**로 상위 Form의 `dataJson` 안에 배열 필드로 함께 저장된다.

### 1.2 사용 시나리오

```
[ 기본정보 폼 ]
  - 이름, 코드, 사용여부 등 단일 입력 필드

[ 상세정보 폼 ]
  - 기타 단일 입력 필드들
  - ┌─ SubList (다건 입력 목록) ───────────────────┐
    │ 항목 3개   [검색창]              + 항목 추가  │
    ├──────┬──────┬──────┬──────┬──────┬──────────┤
    │ 코드 │ 이름 │ 정렬 │ 기타 │ 사용 │   관리   │
    ├──────┼──────┼──────┼──────┼──────┼──────────┤
    │  Y   │  예  │  1   │  -   │  Y   │  ✏️ 🗑️  │
    └──────┴──────┴──────┴──────┴──────┴──────────┘
```

### 1.3 기존 위젯과의 차이

| 항목 | Table (기존) | SubList (신규) |
|---|---|---|
| 목적 | API 데이터 조회 (읽기 전용) | 행 배열 입력·수정·삭제 |
| 데이터 출처 | 독립 API (`page_data` slug) | 상위 Form `dataJson` 내 배열 |
| 독립 저장 | ✅ 가능 | ❌ 마스터(상위 Form) 없이 불가 |
| 편집 방식 | 팝업/경로 연결 | 인라인 편집 |
| 페이지네이션 | ✅ | ❌ (전체 행 표시) |

### 1.4 참조 파일

| 역할 | 경로 |
|---|---|
| 빌더 설정 UI | `bo/src/app/admin/templates/make/_shared/components/builder/SubListBuilder.tsx` |
| 렌더러 | `bo/src/app/admin/templates/make/_shared/components/renderer/SubListRenderer.tsx` |
| 위젯 타입 정의 | `bo/src/app/admin/templates/make/_shared/components/renderer/types.ts` |
| 빌더 분기 허브 | `bo/src/app/admin/templates/make/_shared/components/builder/CommonBuilderDispatcher.tsx` |
| 렌더러 분기 허브 | `bo/src/app/admin/templates/make/_shared/components/renderer/WidgetRenderer.tsx` |
| 템플릿 확인 페이지 | `bo/src/app/admin/templates/builder-contents-layout/page.tsx` |

---

## 2. 타입 정의

### 2.1 SubListColumn — 컬럼 설정

```ts
interface SubListColumn {
  id: string;                  // 컬럼 고유 ID (자동 생성)
  key: string;                 // 데이터 키 (영문 필수)
  label: string;               // 헤더 표시명
  type: SubListColumnType;     // 셀 입력 타입
  width?: number;              // 컬럼 너비 (px, 미설정 시 auto)
  required?: boolean;          // 필수 여부
  placeholder?: string;        // 입력 placeholder
  options?: string[];          // select 타입 전용 옵션 목록
  codeGroup?: string;          // 공통코드 그룹 연결 (select 타입)
  editable?: boolean;          // 편집 가능 여부 (기본 true)
  visible?: boolean;           // 렌더러 노출 여부 (기본 true)
}

/** 컬럼 셀 입력 타입 */
type SubListColumnType =
  | 'input'      // 텍스트 입력
  | 'select'     // 셀렉트 (옵션 또는 공통코드)
  | 'date'       // 날짜 선택
  | 'boolean'    // Y/N 토글
  | 'readonly';  // 읽기 전용 텍스트
```

### 2.2 SubListWidget — 위젯 설정

```ts
interface SubListWidget {
  type: 'sublist';
  widgetId: string;
  contentKey: string;           // 상위 Form dataJson 내 배열 키 (영문 필수)
  title?: string;               // 헤더 타이틀 (예: "코드 상세")
  showSearch?: boolean;         // 상단 검색창 표시 여부 (기본 false)
  addButtonLabel?: string;      // 추가 버튼 텍스트 (기본 "+ 추가")
  minRows?: number;             // 최소 행 수 (0 = 제한 없음)
  maxRows?: number;             // 최대 행 수 (0 = 제한 없음)
  showBorder?: boolean;         // 테두리 표시 여부 (기본 true)
  columns: SubListColumn[];     // 컬럼 설정 목록
}
```

### 2.3 AnyWidget 유니온 확장

```ts
// renderer/types.ts
export type AnyWidget =
  | TextWidget
  | SearchWidget
  | TableWidget
  | FormWidget
  | SpaceWidget
  | CategoryWidget
  | SubListWidget;  // ← 추가
```

### 2.4 행 데이터 구조 (런타임)

```ts
/** 렌더러 내부에서 관리하는 행 데이터 */
interface SubListRow {
  _rowId: string;                       // 행 고유 키 (UI 전용, 저장 제외)
  [key: string]: unknown;               // 컬럼 key → 값 매핑
}

/**
 * 상위 Form dataJson 저장 구조 예시
 * contentKey = 'codeDetails' 인 경우:
 *
 * {
 *   name: '예시 코드',
 *   codeDetails: [               ← SubList 배열
 *     { code: 'Y', name: '예', sortOrder: 1, active: true },
 *     { code: 'N', name: '아니오', sortOrder: 2, active: true }
 *   ]
 * }
 */
```

---

## 3. 빌더 설정 UI (SubListBuilder)

### 3.1 설정 패널 구성

```
┌─ SubList 설정 ─────────────────────────────────┐
│ [기본 설정]                                      │
│   타이틀        [ 코드 상세          ]           │
│   Content Key  [ codeDetails       ]           │
│   검색창 표시   [ ON / OFF ]                     │
│   추가버튼 텍스트 [ + 코드 추가     ]            │
│   최대 행 수    [ 0  ] (0 = 무제한)              │
│   테두리 표시   [ ON / OFF ]                     │
│                                                 │
│ [컬럼 설정]                                      │
│  ┌──────────────────────────────────────────┐  │
│  │ # │ 헤더명 │  Key  │  타입  │ 필수 │ 관리│  │
│  │ 1 │ 코드값 │ code  │ input  │  ✅  │✏️🗑│  │
│  │ 2 │ 코드명 │ name  │ input  │  ✅  │✏️🗑│  │
│  │ 3 │  정렬  │ sort  │ input  │      │✏️🗑│  │
│  │ 4 │  사용  │ active│boolean │      │✏️🗑│  │
│  └──────────────────────────────────────────┘  │
│  [+ 컬럼 추가]                                   │
└─────────────────────────────────────────────────┘
```

### 3.2 컬럼 추가/편집 다이얼로그

```
┌─ 컬럼 설정 ──────────────────────────┐
│ 헤더명   [ 코드값              ]     │
│ Key      [ code                ]     │  ← 영문 필수
│ 타입     [ input          ▼   ]     │
│ 너비(px) [ 120  ] (미입력 시 auto)  │
│ Placeholder [ 입력하세요      ]     │
│ 필수 여부  [ ON / OFF ]             │
│ 편집 가능  [ ON / OFF ]             │
│ 화면 표시  [ ON / OFF ]             │
│                         [취소][확인] │
└──────────────────────────────────────┘
```

**타입별 추가 설정:**

| 타입 | 추가 설정 항목 |
|---|---|
| `input` | Placeholder, 필수 여부 |
| `select` | 옵션 목록 직접 입력 or 공통코드 그룹 연결 |
| `date` | 필수 여부 |
| `boolean` | trueText (기본 Y), falseText (기본 N) |
| `readonly` | 없음 |

### 3.3 기본 설정 항목 상세

| 항목 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| 타이틀 | string | `''` | 헤더 왼쪽 표시 텍스트 |
| Content Key | string | `''` | 상위 Form dataJson의 배열 키 (영문 필수) |
| 검색창 표시 | boolean | `false` | 헤더 우측 검색 input 표시 |
| 추가버튼 텍스트 | string | `'+ 추가'` | 추가 버튼 레이블 |
| 최대 행 수 | number | `0` | 0 = 무제한, 초과 시 추가 버튼 비활성 |
| 테두리 표시 | boolean | `true` | 컴포넌트 외곽 테두리 |

---

## 4. 렌더러 UI (SubListRenderer)

### 4.1 UI 구조

```
┌─ [타이틀] N개  [검색창________________]  [+ 추가] ─┐  ← 헤더
├──────┬──────┬──────┬──────┬──────┬───────────────┤
│ 헤더1│ 헤더2│ 헤더3│ 헤더4│ 헤더5│     관리       │  ← 컬럼헤더
├──────┼──────┼──────┼──────┼──────┼───────────────┤
│  값  │  값  │  값  │  값  │  Y   │    ✏️  🗑️     │  ← 일반 행
├──────┼──────┼──────┼──────┼──────┼───────────────┤
│[inp] │[inp] │[inp] │[inp] │[tog] │    ✓   ✕      │  ← 편집 중 행
├──────┼──────┼──────┼──────┼──────┼───────────────┤
│[inp] │[inp] │[inp] │[inp] │[tog] │    ✓   ✕      │  ← 신규 추가 행
└──────┴──────┴──────┴──────┴──────┴───────────────┘
│ 데이터가 없습니다.                                  │  ← 빈 상태
└────────────────────────────────────────────────────┘
```

### 4.2 모드별 동작

| 모드 | 동작 |
|---|---|
| **preview** | 샘플 2행 표시, 모든 버튼 disabled, 입력 불가 |
| **live** | 실제 CRUD 동작, 상위 Form에 배열 데이터 전달 |

### 4.3 행 상태 구분

| 상태 | 설명 | UI |
|---|---|---|
| `normal` | 저장된 행 | 텍스트 표시 + ✏️🗑️ |
| `editing` | 편집 중인 행 | 입력 컴포넌트 활성 + ✓✕ |
| `adding` | 신규 추가 행 | 입력 컴포넌트 활성 + ✓✕ (하단 고정) |

> 편집 중인 행과 추가 행은 동시에 1개씩만 존재 가능

### 4.4 헤더 영역 구성

| 요소 | 조건 | 설명 |
|---|---|---|
| 타이틀 | `title` 설정 시 표시 | 좌측 텍스트 |
| 행 수 카운트 | 항상 표시 | `N개` 형식 |
| 검색창 | `showSearch: true` 시 표시 | 클라이언트 사이드 필터링 |
| 추가 버튼 | 항상 표시 | `maxRows` 초과 시 disabled |

### 4.5 셀 타입별 렌더링

**일반(normal) 상태:**

| 타입 | 표시 방식 |
|---|---|
| `input` | 텍스트 값 그대로 표시 |
| `select` | 선택된 옵션 라벨 표시 (없으면 `-`) |
| `date` | `YYYY-MM-DD` 포맷 |
| `boolean` | `trueText` / `falseText` 배지 |
| `readonly` | 텍스트 (연한 색상) |

**편집(editing/adding) 상태:**

| 타입 | 입력 컴포넌트 |
|---|---|
| `input` | `<input type="text">` |
| `select` | `<select>` |
| `date` | `<input type="date">` |
| `boolean` | Y / N 토글 버튼 |
| `readonly` | 텍스트만 표시 (편집 불가) |

---

## 5. 데이터 흐름

### 5.1 상위 Form과의 연결

```
SubListRenderer
    │
    │  onChange(contentKey, rows[])
    ▼
FormRenderer (상위)
    │
    │  formValues[contentKey] = rows[]
    ▼
저장 시 dataJson = {
  ...기타필드,
  [contentKey]: rows[]   ← SubList 배열 포함
}
```

### 5.2 상위 WidgetRenderer Props 확장

```ts
// WidgetRenderer에 sublist 관련 props 추가
interface WidgetRendererProps {
  // ... 기존 props ...

  /** SubList 행 데이터 (contentKey별 매핑) */
  subListValues?: Record<string, SubListRow[]>;

  /** SubList 행 변경 콜백 */
  onSubListChange?: (contentKey: string, rows: SubListRow[]) => void;
}
```

### 5.3 preview 모드 샘플 데이터

```ts
/** preview 모드에서 보여줄 샘플 행 (컬럼 key 기준 자동 생성) */
const generatePreviewRows = (columns: SubListColumn[]): SubListRow[] => [
  { _rowId: 'preview-1', ...컬럼별샘플값 },
  { _rowId: 'preview-2', ...컬럼별샘플값 },
];
```

---

## 6. 이벤트 및 핸들러 명세

| 대상 | 이벤트 | 동작 |
|---|---|---|
| `+ 추가` 버튼 | Click | 하단에 신규 입력 행 추가, 첫 컬럼에 자동 포커스 |
| 신규 행 `✓` | Click | 필수 검증 → 통과 시 rows 배열에 추가, 행 상태 normal로 전환 |
| 신규 행 `✕` | Click | 신규 행 제거 |
| `✏️` 편집 | Click | 해당 행 editing 상태 전환, 첫 컬럼 자동 포커스 |
| 편집 행 `✓` | Click | 필수 검증 → 통과 시 rows 배열 업데이트, normal 전환 |
| 편집 행 `✕` | Click | 편집 취소, 원본 값 복원 |
| `🗑️` 삭제 | Click | confirm(`삭제하시겠습니까?`) → rows 배열에서 제거 |
| 검색창 | onChange | rows 클라이언트 필터링 (원본 배열 유지) |
| Enter 키 | KeyDown (편집/추가 행) | `✓` 클릭과 동일 |
| Escape 키 | KeyDown (편집/추가 행) | `✕` 클릭과 동일 |

---

## 7. 유효성 검사

### 7.1 컬럼 Key 규칙 (빌더)

| 검증 시점 | 조건 | 처리 |
|---|---|---|
| 저장 시 | Key 빈 값 | 에러 표시 — Key를 입력하세요 |
| 저장 시 | 한글/특수문자 포함 | 에러 표시 — 영문·숫자·_ 만 사용 가능 |
| 저장 시 | 동일 컬럼 내 Key 중복 | 에러 표시 — 이미 사용 중인 Key입니다 |

### 7.2 행 입력 유효성 검사 (렌더러)

| 검증 시점 | 조건 | 처리 |
|---|---|---|
| `✓` 클릭 | required 컬럼 빈 값 | 해당 셀 빨간 테두리 + 토스트 |
| `+ 추가` 클릭 | maxRows 초과 | 버튼 disabled (클릭 불가) |

---

## 8. builder-contents-layout 반영

### 8.1 탭 추가

```ts
// builder-contents-layout/page.tsx TABS 배열에 추가
const TABS = [
  { key: 'search',   label: '검색폼' },
  { key: 'table',    label: '데이터테이블' },
  { key: 'form',     label: '폼' },
  { key: 'space',    label: '공간영역' },
  { key: 'category', label: '카테고리' },
  { key: 'sublist',  label: '서브리스트' },   // ← 추가
];
```

### 8.2 샘플 위젯 데이터

```ts
const SAMPLE_SUBLIST: SubListWidget = {
  type: 'sublist',
  widgetId: 'guide-sublist',
  contentKey: 'codeDetails',
  title: '코드 상세',
  showSearch: true,
  addButtonLabel: '+ 코드 추가',
  showBorder: true,
  columns: [
    { id: 'c1', key: 'code',      label: '코드값', type: 'input',   required: true,  width: 120 },
    { id: 'c2', key: 'name',      label: '코드명', type: 'input',   required: true              },
    { id: 'c3', key: 'sortOrder', label: '정렬',   type: 'input',                    width: 80  },
    { id: 'c4', key: 'etc1',      label: '기타1',  type: 'input'                               },
    { id: 'c5', key: 'etc2',      label: '기타2',  type: 'input'                               },
    { id: 'c6', key: 'active',    label: '사용',   type: 'boolean',                  width: 80  },
  ],
};
```

---

## 9. 신규 파일 목록

| 파일 | 작업 |
|---|---|
| `builder/SubListBuilder.tsx` | 신규 생성 |
| `renderer/SubListRenderer.tsx` | 신규 생성 |
| `renderer/types.ts` | `SubListWidget`, `SubListColumn` 타입 추가 + `AnyWidget` 유니온 확장 |
| `builder/CommonBuilderDispatcher.tsx` | `case 'sublist'` 분기 추가 |
| `renderer/WidgetRenderer.tsx` | `sublist` 렌더러 분기 추가 + props 확장 |
| `builder-contents-layout/page.tsx` | `서브리스트` 탭 + 샘플 데이터 추가 |

---

## 10. FE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 10.1 타입 및 구조

- [ ] `SubListWidget`, `SubListColumn` 타입이 `types.ts`에 정의되었는가?
- [ ] `AnyWidget` 유니온에 `SubListWidget`이 추가되었는가?
- [ ] `contentKey`가 영문인지 빌더에서 검증되는가?

### 10.2 빌더 (SubListBuilder)

- [ ] 기본 설정(타이틀, contentKey, 검색창, 추가버튼, 최대행, 테두리) 설정이 가능한가?
- [ ] 컬럼 추가 다이얼로그가 열리는가?
- [ ] 컬럼 타입(input/select/date/boolean/readonly) 선택이 가능한가?
- [ ] select 타입 선택 시 옵션 입력 or 공통코드 연결 UI가 표시되는가?
- [ ] 컬럼 Key 영문 검증이 동작하는가?
- [ ] 컬럼 Key 중복 검증이 동작하는가?
- [ ] 컬럼 편집(✏️)이 가능한가?
- [ ] 컬럼 삭제(🗑️)가 가능한가?
- [ ] 컬럼 순서 변경이 가능한가? (DnD)
- [ ] CommonBuilderDispatcher에 `case 'sublist'` 분기가 연결되어 있는가?

### 10.3 렌더러 — preview 모드

- [ ] 샘플 2행이 표시되는가?
- [ ] 컬럼 헤더가 올바르게 표시되는가?
- [ ] 추가 버튼이 disabled 상태인가?
- [ ] 편집/삭제 버튼이 disabled 상태인가?
- [ ] builder-contents-layout 서브리스트 탭에서 확인 가능한가?

### 10.4 렌더러 — live 모드

- [ ] `+ 추가` 클릭 시 신규 행이 하단에 생성되는가?
- [ ] 신규 행의 첫 컬럼에 자동 포커스되는가?
- [ ] `✓` 클릭 시 필수 검증이 동작하는가?
- [ ] `✓` 클릭 시 rows 배열에 행이 추가되는가?
- [ ] `✕` 클릭 시 신규 행이 제거되는가?
- [ ] `✏️` 클릭 시 해당 행이 편집 모드로 전환되는가?
- [ ] 편집 모드에서 원본 값이 올바르게 채워지는가?
- [ ] 편집 `✓` 클릭 시 rows 배열이 업데이트되는가?
- [ ] 편집 `✕` 클릭 시 원본 값으로 복원되는가?
- [ ] `🗑️` 클릭 시 confirm이 표시되는가?
- [ ] confirm 확인 시 rows 배열에서 행이 제거되는가?
- [ ] Enter 키가 `✓` 와 동일하게 동작하는가?
- [ ] Escape 키가 `✕` 와 동일하게 동작하는가?
- [ ] maxRows 초과 시 `+ 추가` 버튼이 disabled되는가?
- [ ] 검색창 입력 시 rows 필터링이 동작하는가?

### 10.5 상위 Form 연동

- [ ] 행 변경 시 상위 `onSubListChange` 콜백이 호출되는가?
- [ ] 상위 Form 저장 시 `dataJson[contentKey]`에 배열이 포함되는가?
- [ ] 상위 Form 수정 모드 진입 시 기존 배열 데이터가 렌더러에 채워지는가?

### 10.6 Rule 10 준수

- [ ] 인라인 코딩이 없는가? (모든 UI가 컴포넌트 안에 있는가?)
- [ ] `builder-contents-layout` 서브리스트 탭이 추가되었는가?
- [ ] preview 모드와 live 모드의 UI가 동일한가?
- [ ] 레이아웃 컴포넌트(`RendererContainer`)를 사용하는가?

### 10.7 코드 품질

- [ ] `tsc --noEmit` 실행 결과 신규 에러가 없는가?
- [ ] 불필요한 `console.log`가 제거되었는가?
- [ ] 모든 주석이 한글로 작성되었는가?
- [ ] 공통 필드 컴포넌트(`FieldRenderer` 등)를 재사용하고 있는가?
