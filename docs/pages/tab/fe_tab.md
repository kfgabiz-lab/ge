# Tab 컨텐츠 컴포넌트 FE 상세 설계서

> 작성일: 2026-05-29
> 버전: v1.0

---

## 1. 개요

### 1.1 설계 목적

여러 탭으로 화면을 분리하고, 각 탭에 기존 빌더 페이지를 연결하여 렌더링하는 **탭 컨텐츠 컴포넌트**를 제공한다.

빌더에서 탭 개수(1~5개)를 설정하고 탭별 레이블·연결 페이지 slug를 지정하면, live 모드에서 해당 페이지 템플릿을 렌더링한다.

### 1.2 로딩 전략 — B방향 (일괄 선로드)

```
부모 페이지 마운트 시
  └─ 모든 탭 pageSlug에 대해 fetchTemplateConfig 일괄 호출
       ├─ 탭 1 템플릿 로드 완료
       ├─ 탭 2 템플릿 로드 완료
       └─ 탭 3 템플릿 로드 완료

탭 전환 시
  └─ 이미 로드된 템플릿 사용 (추가 API 호출 없음)
```

A방향(탭 클릭 시 개별 로드)에 비해 초기 로딩 비용이 있지만, 탭 전환이 즉시 이루어지는 장점이 있다.

### 1.3 사용 시나리오

```
[ 빌더 설정 ]

  탭 개수: 3

  탭 1  레이블: 기본정보   pageSlug: user-basic
  탭 2  레이블: 상세정보   pageSlug: user-detail
  탭 3  레이블: 기타       pageSlug: user-etc

[ live 렌더링 ]

  ┌─ 기본정보 ─ 상세정보 ─ 기타 ────────────────┐
  │                                              │
  │  (선택된 탭의 pageSlug 템플릿 렌더링)        │
  │                                              │
  └──────────────────────────────────────────────┘
```

### 1.4 참조 파일

| 역할 | 경로 |
|---|---|
| 빌더 설정 UI | `bo/src/app/admin/templates/make/_shared/components/builder/TabBuilder.tsx` |
| 렌더러 | `bo/src/app/admin/templates/make/_shared/components/renderer/TabRenderer.tsx` |
| 위젯 타입 정의 | `bo/src/app/admin/templates/make/_shared/components/renderer/types.ts` |
| 빌더 분기 허브 | `bo/src/app/admin/templates/make/_shared/components/builder/CommonBuilderDispatcher.tsx` |
| 렌더러 분기 허브 | `bo/src/app/admin/templates/make/_shared/components/renderer/WidgetRenderer.tsx` |
| 템플릿 확인 페이지 | `bo/src/app/admin/templates/builder-contents-layout/page.tsx` |
| 템플릿 API | `bo/src/app/admin/templates/make/_shared/templateApi.ts` |

---

## 2. 타입 정의

### 2.1 TabItem — 탭 아이템

```ts
interface TabItem {
    id: string;
    label: string;
    /** 연결된 빌더 페이지 slug — 미설정 시 빈 상태 표시 */
    pageSlug?: string;
    /** 직접 위젯 배열 주입 — pageSlug가 없을 때 PageGridRenderer로 렌더링 (미리보기·샘플 전용) */
    items?: { widget: AnyWidget; colSpan: number; rowSpan: number }[];
}
```

### 2.2 TabWidget — 위젯 설정

```ts
interface TabWidget {
    type: 'tab';
    widgetId: string;
    tabs: TabItem[];   // 최대 5개
}
```

### 2.3 AnyWidget 유니온

```ts
export type AnyWidget =
    | TextWidget | SearchWidget | TableWidget | FormWidget
    | SpaceWidget | CategoryWidget | SubListWidget | MultiSelectWidget
    | TabWidget;  // ← 추가됨
```

---

## 3. 빌더 설정 UI (TabBuilder)

### 3.1 설정 패널 구성

```
┌─ 탭 설정 ──────────────────────────────────────┐
│                                                  │
│  탭 개수   [ 1 ][ 2 ][ 3 ][4][5]  ← 버튼 토글  │
│                                                  │
│  ┌── 탭 1 ─────────────────────────────────┐    │
│  │  레이블    [ 기본정보              ]     │    │
│  │  연결 페이지 [ 선택하세요     ▼   ]     │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  ┌── 탭 2 ─────────────────────────────────┐    │
│  │  레이블    [ 상세정보              ]     │    │
│  │  연결 페이지 [ 선택하세요     ▼   ]     │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  (탭 개수만큼 반복)                              │
└──────────────────────────────────────────────────┘
```

### 3.2 설정 항목 상세

| 항목 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| 탭 개수 | number (1~5) | `1` | 버튼 토글로 선택. 줄이면 초과 탭 데이터 제거 |
| 레이블 | string | `'탭 N'` | 탭 버튼에 표시될 텍스트 |
| 연결 페이지 | string (pageSlug) | `''` | pageTemplates 목록에서 SELECT BOX로 선택 |

### 3.3 탭 개수 변경 시 처리

| 변경 | 처리 |
|---|---|
| 늘릴 때 | 새 `TabItem` 추가 (`{ id: uuid, label: '탭 N', pageSlug: '' }`) |
| 줄일 때 | 뒤에서부터 탭 제거 (경고 없이 즉시 제거) |

### 3.4 연결 페이지 SELECT BOX

- `pageTemplates` props로 전달받은 목록 표시
- 옵션 형식: `name (slug)` — 미선택 시 `'-- 연결 없음 --'`
- 선택 시 해당 `TabItem.pageSlug` 업데이트

---

## 4. 렌더러 UI (TabRenderer)

### 4.1 UI 구조

```
┌─ 기본정보 ── 상세정보 ── 기타 ────────────────────────┐  ← 탭 바
├────────────────────────────────────────────────────────┤
│                                                        │
│   PageGridRenderer (선택된 탭의 pageSlug 템플릿)       │  ← 탭 패널
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 4.2 모드별 동작

| 모드 | 동작 |
|---|---|
| **preview** | 탭 바 렌더링, 탭 전환 인터랙션 동작, `items`가 있으면 직접 렌더링, `pageSlug`만 있으면 슬러그명 안내, 둘 다 없으면 "페이지를 연결하세요" 안내 |
| **live** | 탭 바 렌더링, B방향 선로드, 탭 전환 시 해당 pageSlug 템플릿 PageGridRenderer 렌더링 |

### 4.3 탭 바 스타일

| 상태 | 스타일 |
|---|---|
| 활성 탭 | 하단 border 강조(`border-slate-800`), 배경 흰색 |
| 비활성 탭 | 하단 border 투명, 텍스트 흐림 |
| 호버 | 텍스트 진하게 |

### 4.4 pageSlug 없는 탭 처리

| 상황 | live 모드 표시 |
|---|---|
| `pageSlug` 빈 문자열 또는 미설정 | "연결된 페이지가 없습니다" 안내 |
| `pageSlug` 있으나 템플릿 로드 실패 | "페이지를 불러올 수 없습니다" 안내 |
| 템플릿 로드 중 | 로딩 스피너 |

---

## 5. 데이터 흐름

### 5.1 B방향 선로드 흐름

```
TabRenderer 마운트
        │
        ▼
모든 탭의 pageSlug 배열 추출
(pageSlug가 있는 탭만 대상)
        │
        ▼
Promise.all(slugs.map(slug => fetchTemplateConfig(slug)))
        │
        ├─ 성공 → templateMap: Record<slug, TemplateConfig> 상태 저장
        └─ 실패 → 해당 slug는 null 저장
        │
        ▼
탭 전환 시
  → templateMap[activeTab.pageSlug]?.widgetItems 를 PageGridRenderer에 전달
```

### 5.2 TemplateConfig 구조

```ts
// templateApi.ts의 fetchTemplateConfig 반환값
interface TemplatePopupConfig {
    widgetItems: PageWidgetItem[];
    // ...
}
```

### 5.3 live 모드 props 전달

```
부모 페이지 (PageGridRenderer)
        │
        ▼
WidgetRenderer (widget.type === 'tab')
        │
        ▼
TabRenderer
  ├─ mode="live"
  ├─ widget={tabWidget}
  ├─ 부모 pageSlug에서 파생된 contextId (쿼리 파라미터 전달용)
  └─ PageGridRenderer (각 탭 패널)
       ├─ searchValues
       ├─ onSearchChange
       ├─ tableDataMap
       ├─ formValues
       └─ ... (일반 WidgetRenderer props와 동일)
```

---

## 6. 이벤트 및 핸들러

| 대상 | 이벤트 | 동작 |
|---|---|---|
| 탭 버튼 | Click | `activeIdx` 상태 변경 → 해당 탭 패널 표시 |
| 탭 패널 | 마운트 | B방향: 이미 로드된 템플릿 사용 (추가 API 없음) |
| 탭 패널 내 검색/테이블 | 각 위젯 이벤트 | 해당 탭 컨텍스트에서 독립적으로 동작 |

---

## 7. 수정/추가 파일 목록

| 파일 | 작업 내용 |
|---|---|
| `renderer/types.ts` | `TabItem`에 `items` 필드 추가 — ✅ 완료 |
| `renderer/index.ts` | `TabItem`, `TabWidget` export 추가 — ✅ 완료 |
| `builder-contents-layout/page.tsx` | 탭 샘플 기본정보/상세정보/기타 구성 — ✅ 완료 |
| `renderer/WidgetRenderer.tsx` | `TabPlaceholder` items 렌더링 지원 — ✅ 완료 |
| **`builder/TabBuilder.tsx`** | **신규 생성** — 탭 설정 빌더 UI |
| **`renderer/TabRenderer.tsx`** | **신규 생성** — 탭 렌더러 (TabPlaceholder 대체) |
| `builder/CommonBuilderDispatcher.tsx` | `case 'tab': return <TabBuilder ...>` 추가 |
| `renderer/WidgetRenderer.tsx` | `TabPlaceholder` → `TabRenderer` import 교체 |
| `renderer/index.ts` | `TabRenderer` export 추가 |

---

## 8. FE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 8.1 타입 및 구조

- [ ] `TabItem`, `TabWidget` 타입이 `types.ts`에 정의되었는가?
- [ ] `AnyWidget` union에 `TabWidget`이 포함되었는가?
- [ ] `index.ts`에서 `TabItem`, `TabWidget`, `TabRenderer` export가 추가되었는가?

### 8.2 빌더 (TabBuilder)

- [ ] 탭 개수 버튼(1~5)이 표시되고 클릭 시 탭 목록이 조정되는가?
- [ ] 탭 개수 줄일 때 초과 탭이 제거되는가?
- [ ] 각 탭의 레이블 입력이 동작하는가?
- [ ] 각 탭의 연결 페이지 SELECT BOX에 `pageTemplates` 목록이 표시되는가?
- [ ] pageSlug 선택 시 `TabItem.pageSlug`가 저장되는가?
- [ ] `CommonBuilderDispatcher`에서 `case 'tab'`으로 `TabBuilder`가 렌더링되는가?

### 8.3 렌더러 — preview 모드

- [ ] 탭 바가 렌더링되는가?
- [ ] 탭 클릭 시 활성 탭이 전환되는가?
- [ ] `items`가 있는 탭은 PageGridRenderer로 위젯이 직접 렌더링되는가?
- [ ] `pageSlug`만 있는 탭은 슬러그명 안내가 표시되는가?
- [ ] 둘 다 없는 탭은 "페이지를 연결하세요"가 표시되는가?

### 8.4 렌더러 — live 모드

- [ ] 마운트 시 모든 탭 pageSlug의 템플릿이 일괄 선로드되는가?
- [ ] 탭 전환 시 추가 API 호출 없이 즉시 전환되는가?
- [ ] `pageSlug`가 없는 탭은 "연결된 페이지가 없습니다"가 표시되는가?
- [ ] 템플릿 로드 중에는 로딩 스피너가 표시되는가?
- [ ] 로드 실패 탭은 "페이지를 불러올 수 없습니다"가 표시되는가?
- [ ] 각 탭 패널의 검색/테이블/폼이 독립적으로 동작하는가?

### 8.5 Rule 10 준수

- [ ] 인라인 코딩이 없는가?
- [ ] `builder-contents-layout` 탭 탭에서 UI가 확인 가능한가?
- [ ] preview 모드와 live 모드의 탭 바 UI가 동일한가?
- [ ] `TabPlaceholder` 인라인 코드가 `TabRenderer.tsx`로 완전히 이관되었는가?

### 8.6 코드 품질

- [ ] `tsc --noEmit` 실행 결과 신규 에러가 없는가?
- [ ] 불필요한 `console.log`가 없는가?
- [ ] 모든 주석이 한글로 작성되었는가?
