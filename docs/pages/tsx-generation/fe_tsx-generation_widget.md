# Widget 빌더 "파일빌드" FE 상세 설계서

> 대상 화면: `/admin/templates/make/widget` (페이지 메이커 — Widget)
> BE 연계: [be_tsx-generation.md](./be_tsx-generation.md) §12
> 작성일: 2026-09-04 / 버전: v1.3 (구조 전환 — §1.2 경계 재정의 / §5.0.6 3축 공유 원칙 / §5.0.8 클래스 단일화 /
> §5.1.2 `buildSearchQueryParams` 직접 호출 / §5.2 런타임 파리티 / §10 실행 지침)
>
> v1.3 요약: 3라운드 연속으로 같은 유형의 Critical이 재발한 원인은 "생성기가 런타임 로직·클래스를 손으로
> 재구현한다"는 구조 자체였다. v1.3에서 **로직은 런타임 함수를 산출물이 직접 호출**, **클래스는 공용 상수를
> 생성 시점에 인라인**하는 방식으로 전환한다. 손 재구현은 원칙적으로 금지된다.

---

## 1. 개요

### 1.1 무엇을 만드는가

Widget 빌더에서 조립한 위젯 레이아웃을 **읽을 수 있는 tsx 소스 파일로 뽑아내는 기능**이다.
화면에서는 `[파일빌드]` 버튼으로 노출된다.

### 1.2 왜 만드는가 — "저장"과 목적이 다르다

Widget 빌더에는 이미 `[저장]`이 있다. 파일빌드는 그것과 **경쟁 기능이 아니다.**

| | `[저장]` (기존) | `[파일빌드]` (신규) |
|:---|:---|:---|
| 결과물 | DB `page_template.config_json` | 디스크의 `.tsx` 소스 파일 |
| 화면이 그려지는 방식 | 런타임에 `configJson`을 해석해서 그림 | 그냥 평범한 React 컴포넌트로 그려짐 |
| 이후 수정 주체 | 운영자 (빌더 UI에서) | **개발자 (에디터에서 코드로)** |
| 목적 | 코드 없이 화면 운영 | **개발자 커스터마이징 인계** |

즉 파일빌드의 산출물은 "빌더가 더 이상 관리하지 않는, 개발자에게 넘기는 코드"다.
따라서 생성된 코드는 **빌더 런타임(`WidgetRenderer`, `configJson`)에 의존하지 않고 혼자 동작**해야 한다.
이것이 이 설계의 최상위 제약이다.

**다만 "비의존"의 대상은 `configJson` 해석 경로이지, 순수 함수가 아니다.** (v1.3 경계 재정의)

| 산출물이 하는 일 | 판정 | 이유 |
|:---|:---:|:---|
| 런타임에 `configJson` 을 읽어와 해석해서 화면을 그린다 | ❌ 금지 | 이러면 파일빌드가 `[저장]`과 같아진다 |
| `WidgetRenderer` / `PageGridRenderer` / `FieldRenderer` / `TableRenderer` 를 import 해 위임한다 | ❌ 금지 | 인계받은 개발자가 마크업을 고칠 수 없다 |
| **config 값을 산출물 소스에 리터럴로 고정**하고, 그 리터럴을 순수 함수에 넘겨 호출한다 | ✅ 허용 | 리터럴은 그 파일 안에서 읽고 고칠 수 있다. DB도 런타임 해석도 개입하지 않는다 |
| `_shared/utils.ts` 등의 순수 함수를 import 해 호출한다 | ✅ 허용 | §5.0.6 — 이미 `evalColumnDataExpr` 등이 이 방식이다 |

세 번째 줄이 v1.3에서 새로 명시된 항목이다.
`evalColumnDataExpr("is_visible=001,...", row)` 처럼 **표현식 문자열 리터럴**을 넘기는 것이 이미 허용돼 있었고,
`buildSearchQueryParams([{...필드정의 리터럴...}], values)` 처럼 **객체 배열 리터럴**을 넘기는 것은
자료구조가 문자열에서 객체로 바뀐 것일 뿐 성격이 같다. 둘을 다르게 취급하지 않는다.

### 1.3 결과물이 놓이는 위치

```
bo/src/app/admin/generated/{폴더명}/{파일명}.tsx
```

`widgetSub`가 아니라 `generated`다. 두 디렉토리의 역할 구분은 §7에 정리했다.

---

## 2. 기존 생성기를 재사용할 수 없는 이유

List / Grid-Layout 빌더에는 이미 tsx 생성기가 있다.

| 위치 | 함수 |
|:---|:---|
| `_shared/generators/listGenerator.ts` | `buildListTsxFile(rows, columns, collapsible, buttons, buttonPosition, displayMode, pageSize)` |
| `list/page.tsx` / `grid-layout/page.tsx` | 위 함수를 감싸는 로컬 `buildTsxFile` |

이 함수는 **시그니처 자체가 "검색폼 1개 + 테이블 1개"라는 고정 조합을 전제**한다.
인자가 `rows`(검색 행)와 `columns`(테이블 컬럼)로 못 박혀 있어서,
"공간영역 2개 + 테이블 1개" 같은 Widget 빌더의 자유 조합을 표현할 방법이 없다.

또한 Widget 빌더의 데이터는 평평한 배열이 아니라 **2단 중첩 그리드**다.

```
PageWidgetItem[]              ← 12칸 기준 바깥 셀 (colSpan / rowSpan)
  └ contents: PageContentItem[]  ← 셀 내부 서브그리드 (colSpan / rowSpan)
       └ widget: PageWidget      ← 실제 위젯 (type 판별자 보유)
```

**결론: `listGenerator`는 손대지 않고 그대로 두고, `_shared/generators/widgetGenerator.ts`를 신규로 만든다.**
(기존 List/Grid-Layout 파일빌드 동작에는 어떤 영향도 주지 않는다.)

---

## 3. 자산 정리 — 재사용 / 신규

| 자산 | 경로 | 처리 |
|:---|:---|:---|
| 생성 모달 UI | `_shared/components/TemplateModals.tsx` → `GenerateModal` | **그대로 재사용** (수정 불필요) |
| 파일 쓰기 API | `POST /api/v1/page-templates/generate` | **그대로 재사용** |
| 이력 저장 API | `POST /api/v1/tsx-generation` | **그대로 재사용** |
| 그리드 셀 컴포넌트 | `@/components/layout/grid-cell` (`GridCell`, `ROW_HEIGHT`, `GAP_SIZE`) | **생성된 코드가 import해서 재사용** |
| 검색 폼 컴포넌트 | `@/components/search` (`SearchForm`, `SearchRow`, `SearchField`) | **생성된 코드가 import해서 재사용** |
| API 클라이언트 | `@/lib/api` | **생성된 코드가 import해서 재사용** |
| List 전용 생성기 | `_shared/generators/listGenerator.ts` | **수정 없음** |
| **위젯 생성기** | `_shared/generators/widgetGenerator.ts` | **신규 생성** |
| 빌더 화면 연결 | `widget/page.tsx` | **부분 수정** (버튼 + 모달 + 핸들러 추가) |

> `GenerateModal`은 이미 미리보기 문구가 `생성 경로: generated/{폴더명}/{파일명}.tsx`로 되어 있어
> 이번 저장 경로 정책과 그대로 맞는다. 손댈 필요 없다.

---

## 4. `widgetGenerator.ts` 설계

### 4.1 핵심 아이디어 — dispatch map

위젯 타입은 8종이고 앞으로도 늘어난다.
`if (type === 'search') ... else if (type === 'table') ...` 로 쓰면 타입이 늘 때마다 본문이 부풀고,
Phase 2 담당자가 어디를 고쳐야 하는지 알 수 없다.

그래서 **"타입 하나 = 함수 하나"로 완전히 분리**하고, 타입→함수 맵으로 위임한다.

```
widgetItems 순회
  → 각 content의 widget.type 확인
  → WIDGET_BLOCK_GENERATORS[type] 조회
      ├ 있음  → 해당 함수가 코드 조각(WidgetCodeBlock) 반환
      └ 없음  → 미지원 플레이스홀더 블록 반환 + unsupported 목록에 기록
  → 모든 조각을 모아 한 개의 tsx 파일로 조립
```

**Phase 2에서 나머지 5종을 추가할 때 손댈 곳은 딱 두 군데다:**
① 새 `generateXxxBlock` 함수 파일 추가, ② 맵에 한 줄 등록. 조립 로직은 건드리지 않는다.

### 4.2 코드 조각의 계약 — `WidgetCodeBlock`

각 블록 생성 함수가 **완성된 문자열이 아니라 "부위별로 나뉜 조각"** 을 돌려주는 것이 이 설계의 핵심이다.
tsx 파일은 `import → 헬퍼 → state → 핸들러 → JSX` 순서가 정해져 있는데,
블록마다 각 부위에 넣을 내용이 따로 있기 때문이다.
완성 문자열로 받으면 조립하는 쪽에서 다시 잘라내야 해서 성립하지 않는다.

```ts
/** 위젯 하나가 기여하는 코드 조각 */
export interface WidgetCodeBlock {
  /** 이 블록이 필요로 하는 import (조립 시 중복 제거·병합) */
  imports: ImportRequirement[];
  /** 컴포넌트 바깥에 놓일 상수/헬퍼 (예: 배지 색상 맵) */
  helperLines: string[];
  /** 컴포넌트 상단 useState / useRef 선언 */
  stateLines: string[];
  /** 컴포넌트 내부 핸들러·useEffect */
  handlerLines: string[];
  /** return JSX 안에 들어갈 마크업 (그리드 래퍼는 조립기가 씌움) */
  jsxLines: string[];
}

/** import 병합용 — 같은 모듈이면 named를 합집합으로 합친다 */
export interface ImportRequirement {
  module: string;                 // 예: '@/components/search'
  named?: string[];               // 예: ['SearchForm', 'SearchRow']
  defaultName?: string;           // 예: 'api'
}
```

### 4.3 생성 함수 시그니처

```ts
export type WidgetBlockGenerator = (
  widget: PageWidget,
  ctx: WidgetGenContext
) => WidgetCodeBlock;

/** 블록 생성 시 필요한 주변 정보 (블록 간 참조·이름 충돌 방지) */
export interface WidgetGenContext {
  /** 이 위젯의 고유 접미사 — 변수명 충돌 방지용 (예: 'Search1', 'Table1') */
  suffix: string;
  /** 들여쓰기 유틸 — listGenerator와 동일 규약(공백 4칸) */
  ind: (n: number) => string;
  /** 전체 위젯 목록 — Table이 connectedSearchIds로 Search를 역참조할 때 사용 */
  allWidgets: PageWidget[];
  /** 위젯 id → 변수 접미사 매핑 (연결 참조 해석용) */
  suffixOf: (widgetId: string) => string;
  /** 위젯별 connectedSlug가 비었을 때 사용할 기본 slug */
  mainConnectedSlug?: string;
}
```

> `suffix` 를 두는 이유: 한 페이지에 Table이 2개 있으면 `rows`, `page` 같은 state 이름이 충돌한다.
> `rowsTable1`, `rowsTable2` 처럼 접미사를 붙여 생성하면 개수 제한 없이 안전하다.
> 접미사는 **위젯 타입 + 등장 순번**으로 만든다(위젯 id를 그대로 쓰면 `w_1a2b` 같은 난독 변수명이 된다).

### 4.4 dispatch map

```ts
const WIDGET_BLOCK_GENERATORS: Partial<Record<PageWidgetType, WidgetBlockGenerator>> = {
  /* ── Phase 1 (구현 대상) ── */
  search: generateSearchBlock,
  table:  generateTableBlock,
  space:  generateSpaceBlock,

  /* ── Phase 2 (미구현) ──
   * form, category, sublist, multiselect, tab
   * 아래에 한 줄씩 추가하면 조립 로직 수정 없이 바로 동작한다. */
};
```

`Partial<Record<...>>` 로 선언하는 것이 중요하다. 전체 `Record`로 두면
Phase 2 5종을 지금 당장 빈 함수로라도 채워야 컴파일이 통과해서, 미구현 상태가 코드에 드러나지 않는다.
`Partial`이면 **"등록 안 된 타입 = 아직 미지원"** 이라는 사실이 타입에 그대로 나타난다.

### 4.5 미지원 타입 처리 — 조용히 빠뜨리지 말 것

맵에 없는 타입을 만나면 **그 위젯을 무시하는 것이 아니라**,
자리를 표시하는 플레이스홀더 JSX와 TODO 주석을 넣고 `unsupported` 목록에 기록한다.

```
/* TODO(파일빌드 Phase 2): {타입} 위젯은 아직 코드 생성이 지원되지 않습니다.
   빌더 화면에서 확인 후 직접 구현해주세요. */
<div className="...">{타입} 위젯 (미지원 — 직접 구현 필요)</div>
```

그리고 **빌드 결과와 함께 미지원 목록을 반환**해서, 화면에서 사용자에게 경고 토스트로 알린다.
말없이 빠지면 개발자가 산출물을 받고 나서야 위젯이 사라진 걸 발견하게 된다.

```ts
export interface WidgetBuildResult {
  tsxCode: string;
  /** 코드 생성이 안 된 위젯 타입 목록 (중복 제거) */
  unsupported: PageWidgetType[];
  /** 지원 타입이지만 생성기가 처리하지 않은 config 키 (§5.0.7 규칙 2) */
  unhandled: { widget: string; scope: 'widget' | 'field' | 'column'; keys: string[] }[];
}
```

`unsupported` 는 **위젯 타입 단위**, `unhandled` 는 **위젯 내부 속성 단위**의 누락을 잡는다.
전자만 있으면 "지원한다고 등록된 타입 안에서 조용히 빠지는 속성"(§5.0.7)을 끝내 못 잡는다.

### 4.6 진입점 — 조립 흐름

```ts
export const buildWidgetTsxFile = (
  items: PageWidgetItem[],
  options: WidgetBuildOptions
): WidgetBuildResult
```

```ts
export interface WidgetBuildOptions {
  /** 페이지 제목 (OutputModePanel의 pageTitle) */
  pageTitle?: string;
  /** 위젯별 connectedSlug 미지정 시 기본값 (om.mainConnectedSlug) */
  mainConnectedSlug?: string;
  /** 생성될 컴포넌트 이름 — 파일명에서 파생 (예: page → GeneratedPage) */
  componentName?: string;
}
```

**조립 순서 (`buildWidgetTsxFile` 본문)**

| 단계 | 하는 일 |
|:---|:---|
| 1 | `items` 를 순회하며 모든 `content.widget` 을 평탄화하고, 타입별 등장 순번으로 `suffix` 를 미리 확정한다 (`suffixOf` 맵 구성) |
| 2 | 각 위젯에 대해 dispatch map으로 `WidgetCodeBlock` 을 얻는다 |
| 3 | 전 블록의 `imports` 를 모듈 단위로 병합·중복 제거하고 import 문을 만든다 |
| 4 | `'use client'` → import → `helperLines` → 컴포넌트 선언 순으로 상단을 쌓는다 |
| 5 | `stateLines` → `handlerLines` 순으로 컴포넌트 본문을 쌓는다 |
| 6 | **그리드 구조를 복원**하면서 각 위젯 자리에 `jsxLines` 를 끼워 넣는다 (§4.7) |
| 7 | `tsxCode` 와 `unsupported` 를 반환한다 |

들여쓰기·문자열 누적 방식은 `listGenerator.ts`와 동일하게 `lines: string[]` + `ind(n)` 규약을 따른다.
새로운 방식을 만들지 말 것 — 두 생성기의 출력 스타일이 달라지면 유지보수가 갈라진다.

### 4.7 그리드 복원 규칙 (중요)

생성된 코드의 레이아웃은 빌더 미리보기(`PageGridRenderer`)와 **눈으로 같아야** 한다.
그래서 `PageGridRenderer`가 실제로 쓰는 방식을 그대로 코드로 옮긴다.

- 바깥 셀: 공통 컴포넌트 `GridCell`(`@/components/layout/grid-cell`)에 `colSpan` / `rowSpan` 전달
- 안쪽 서브그리드: `display:grid`, `gridTemplateColumns: repeat({item.colSpan}, 1fr)`,
  `gridAutoRows: {ROW_HEIGHT - GAP_SIZE}px`, `rowGap: {GAP_SIZE}px`
- 컨텐츠 칸: `gridColumn: span {c.colSpan}`, `gridRow: span {c.rowSpan}`

⚠️ **Tailwind 동적 클래스(`col-span-${n}`)를 생성하면 안 된다.** Tailwind v4는 빌드 타임에 클래스를
수집하므로 문자열 조합으로 만든 클래스는 CSS가 생성되지 않아 레이아웃이 깨진다.
`PageGridRenderer`가 클래스 대신 인라인 `style`을 쓰는 이유가 이것이며, 생성 코드도 동일하게 인라인 `style`을 쓴다.
(색상처럼 값이 유한한 것은 `listGenerator`의 `BADGE_BG`처럼 **정적 클래스 맵**을 만들어 쓴다.)

### 4.7.1 넘침(overflow) 제어는 그리드 래퍼가 아니라 "위젯 컨테이너"가 한다

런타임에서 높이·넘침을 누가 담당하는지가 명확히 갈려 있다.

```
PageGridRenderer
  └ 컨텐츠 칸 <div style={{ gridColumn, gridRow, height }}>   ← overflow 지정이 "없다"
       └ WidgetRenderer → 각 Renderer
            └ RendererContainer   ← h-full w-full rounded / border / overflow: clip|visible
```

| 사실 | 근거 |
|:---|:---|
| 컨텐츠 칸 래퍼에는 overflow가 없고 `height: rowSpan*ROW_HEIGHT - GAP_SIZE` 만 있다 | `PageGridRenderer.tsx:725-734` |
| 넘침 클리핑은 위젯별 `RendererContainer` 가 한다 (`clipOverflow` 기본 true → `overflow: clip`) | `RendererContainer.tsx:67, 74-78` |
| Space는 **의도적으로 클리핑하지 않는다** (`clipOverflow={false}`) — 잘리면 action-button 자체가 안 보이기 때문 | `SpaceRenderer.tsx:205`, `RendererContainer.tsx:51-52` |

따라서 생성기 규칙은 아래와 같다.

- **그리드 래퍼(`widgetGenerator.ts`의 컨텐츠 칸 `<div>`)에 `overflow` 를 넣지 않는다.**
  넣으면 런타임과 달라질 뿐 아니라, Space 위젯이 의도적으로 넘치게 둔 버튼 그룹까지 잘려 **새 결함이 생긴다.**
- **고정 높이(`rowSpan * ROW_HEIGHT - GAP_SIZE`)는 그대로 둔다.** 런타임과 동일한 계산이며,
  `isAutoTrailing` 예외도 런타임과 동일하다. 스타일별 고정 높이 테이블이나 가변 높이(auto)를 새로 만들지 않는다.
  rowSpan이 모자라면 런타임에서도 컨텐츠가 잘린다 — **잘리는 것이 정답**이고, 컨텐츠가 아래 위젯을 덮는 것이 오답이다.
- 넘침 제어는 각 블록이 만드는 **위젯 컨테이너**(= `RendererContainer` 등가 마크업)가 담당한다.

**`RendererContainer` prop → 생성 마크업 대응표** (`RendererContainer.tsx:56-110` 기준)

| prop | 기본값 | 생성 마크업 |
|:---|:---|:---|
| `fillHeight` | `true` | `h-full w-full rounded` (false면 `w-full rounded`) |
| `showBorder` | `true` | `border border-slate-200` |
| `className` | — | 위 두 개 뒤에 이어 붙인다 (순서까지 동일하게) |
| `bgColor` | — | `style={{ backgroundColor: '<값>' }}` (`none`/미설정이면 생략) |
| `clipOverflow` | `true` | `style={{ overflow: 'clip' }}` (false면 `'visible'`) |
| `contentColSpan` | — | `display:grid` + `gridTemplateColumns: repeat(N,1fr)` + `gridAutoRows` + `rowGap` + `columnGap`(= `GAP_SIZE`) |
| `rowIsAuto` | — | `gridTemplateRows` (auto / `ROW_HEIGHT-GAP_SIZE`px 혼합) |
| `contentPaddingTop` | — | `paddingTop` + `paddingBottom` |

⚠️ `overflow` 값은 반드시 **`clip`** 이다. `overflow-hidden` 을 쓰지 말 것 —
Edge에서 video GPU 레이어가 사라지는 버그 때문에 런타임이 `clip` 으로 고정해 둔 것이다(`RendererContainer.tsx:69-70`).

**블록별 컨테이너 사양 (런타임 1:1 대조)**

| 블록 | 런타임 | 생성 컨테이너 |
|:---|:---|:---|
| `search` (standard) | `<RendererContainer showBorder={false}>` (`SearchRenderer.tsx:222`) | `h-full w-full rounded` + `overflow:'clip'` |
| `search` (simple) | `<RendererContainer className="flex items-center gap-3 bg-white px-4">` (`SearchRenderer.tsx:141`) | `h-full w-full rounded border border-slate-200 flex items-center gap-3 bg-white px-4` + `overflow:'clip'` |
| `table` | `<RendererContainer className="bg-white">` (`TableRenderer.tsx:202`) | `h-full w-full rounded border border-slate-200 bg-white` + `overflow:'clip'` |
| `space` | `clipOverflow={false}` (`SpaceRenderer.tsx:199-205`) | `h-full w-full rounded[ border border-slate-200]` + `overflow:'visible'` |

**컨테이너 마크업은 블록마다 손으로 쓰지 않는다.** `widgetGenerator.ts` 에 방출기를 하나 두고 전 블록이 그것만 쓴다.

```ts
export const emitContainerOpen = (o: {
  showBorder?: boolean; className?: string; bgColor?: string;
  clipOverflow?: boolean; fillHeight?: boolean;
}): string;
export const emitContainerClose = (): string;
```

지금은 세 블록이 각자 다른 문자열로 컨테이너를 만들고 있어서(`spaceBlock`은 `h-full w-full rounded`,
`tableBlock`은 `rounded-xl overflow-hidden` + `h-full` 누락, `searchBlock`은 컨테이너 자체가 없음)
같은 종류의 누락이 **블록 수만큼 반복**된다. 단일 방출기로 모으면 이 계열 결함은 한 곳만 고치면 끝난다.

### 4.8 파일 배치

```
_shared/generators/
├── listGenerator.ts              # 기존 — 수정 없음
├── widgetGenerator.ts            # 신규 — 진입점 + 조립 + dispatch map + 공용 타입
└── widget/                       # 신규 — 타입별 블록 생성 함수
    ├── searchBlock.ts            # generateSearchBlock   (Phase 1)
    ├── tableBlock.ts             # generateTableBlock    (Phase 1)
    ├── spaceBlock.ts             # generateSpaceBlock    (Phase 1)
    └── (Phase 2: formBlock.ts / categoryBlock.ts / sublistBlock.ts /
          multiselectBlock.ts / tabBlock.ts)
```

블록 함수를 `widgetGenerator.ts` 한 파일에 몰아넣지 않는다.
Phase 2까지 8종이 한 파일에 들어가면 `listGenerator.ts`(40KB)보다 커져서 손댈 수 없는 파일이 된다.

---

## 5. Phase 1 — 타입별 블록 상세

Phase 1 대상 3종의 입력 타입과, 생성 코드가 다뤄야 할 최소 범위다.
(전체 옵션을 1:1로 다 지원하려 하지 말 것 — 아래 "Phase 1 범위"를 넘는 옵션은 TODO 주석으로 남긴다.)

### 5.0 모든 블록 공통 — 다국어(msgKey)와 값 표현식은 Phase 1 필수

이 절은 `search` / `table` / `space` 는 물론 Phase 2 블록에도 그대로 적용된다.

#### 5.0.1 왜 필수인가

빌더는 **i18n 모드가 기본**이다. 운영 템플릿에서 `label` / `header` / 옵션 텍스트 같은 평문 필드는
값이 비어 있거나 입력하다 만 잔여 문자열이 남아 있고, 실제로 화면에 보이는 값은
`labelMsgKey` / `headerMsgKey` 같은 **msgKey 필드에만** 존재한다.
따라서 평문 필드만 읽어서 코드를 만들면 **산출물이 라벨 없는 빈 화면**이 된다.
"다국어는 Phase 2" 로 미룰 수 있는 성격이 아니라, Phase 1 산출물이 화면으로 성립하기 위한 전제다.

#### 5.0.2 표시 텍스트 우선순위 — msgKey 우선, 평문은 폴백

런타임 렌더러 전체가 동일한 규칙을 쓴다. 생성기도 **똑같은 우선순위**를 따른다.

```
msgKey 있음 → t('<msgKey>')
msgKey 없음 → 평문 리터럴
둘 다 없음  → 렌더러의 기본 폴백과 동일한 값
```

| 근거(런타임) | 위치 |
|:---|:---|
| 테이블 헤더 | `TableRenderer.tsx` — `col.headerMsgKey ? t(col.headerMsgKey) : col.header \|\| (actions면 t('common.label.action') : '—')` |
| 검색 라벨 | `utils.ts` `resolveSearchFieldLabel(f, t)` — dateRange는 `start ~ end` 로 합성, 한쪽만 있으면 그쪽만 |
| 폼 라벨 | `FormRenderer.tsx` — `f.labelMsgKey ? t(f.labelMsgKey) : f.label` |
| badge / boolean 텍스트 | `TableCellRenderer.tsx` — `opt.textMsgKey ? t(...) : opt.text`, `trueTextMsgKey`/`falseTextMsgKey` 동일 |

⚠️ **"평문이 있으면 평문 우선" 규칙을 만들지 말 것.** 평문 필드에는 입력 중 남은 잔여 문자열이 들어 있을 수 있어
(실측: blog-list 검색 라벨 평문이 `공ㄱ`) 평문 우선으로 두면 런타임과 다른 텍스트가 박힌다.

#### 5.0.3 구현 방식 — 생성 시점 하드코딩이 아니라 `t()` 이식

| | 채택 | 사유 |
|:---|:---|:---|
| 생성 시점에 메시지를 조회해 **한국어 문자열로 박기** | ❌ 기각 | BO는 ko/en 이중 언어(`useLanguageStore`)다. 문자열을 굳히면 생성 페이지는 영어 로케일에서 영구히 깨진다. 메시지 수정도 반영되지 않는다 |
| 생성 코드에 **`useI18n().t()` 이식** | ✅ 채택 | 손으로 쓴 BO 관리자 페이지(`logs/access` 등)가 이미 `@/hooks/use-i18n` + msgKey 방식이다. 인계받는 개발자에게는 **오히려 이쪽이 익숙한 코드**다. 의존 대상도 빌더가 아니라 앱 전역 훅이다 |

- import: `{ module: '@/hooks/use-i18n', named: ['useI18n'] }`
- state: `const { t } = useI18n();` — 여러 블록이 각자 push해도 조립기의 라인 중복 제거로 1회만 남는다
- 메시지 로딩은 `admin-layout` 이 앱 진입 시 `useI18nStore.fetchMessages()` 로 이미 수행한다. 생성 코드가 따로 로딩할 필요 없다
- 키가 없으면 `t()` 가 키 문자열을 그대로 돌려준다 — 런타임과 동일한 거동이므로 별도 방어를 넣지 않는다

**분기는 생성 시점에 끝낸다.** 생성기는 msgKey 유무를 알고 있으므로 산출물에 삼항 연산자를 남기지 않는다.

```tsx
// msgKey 있는 컬럼
{t('log.label.result')}
// msgKey 없는 컬럼
{"결과"}
```

#### 5.0.4 옵션 텍스트만 예외 — 무조건 `t()` 통과

`select` / `radio` / `checkbox` 의 옵션은 런타임이 `parseOpt(opt).text` 를 **무조건** `t(text)` 에 통과시킨다
(`FieldRenderer.tsx` 옵션 렌더링). 평문이면 키가 없어서 그대로 반환되므로 안전하다.

| 대상 | 생성 규칙 |
|:---|:---|
| 정적 옵션 텍스트 | `{t(<parseOpt(opt).text>)}` — 평문/키 구분 없이 항상 `t()` |
| 정적 옵션 **값** | 원문 그대로. **절대 번역하지 않는다** (`{common.label.publish}` 같은 브라켓 토큰이 값으로 쓰이며 조회 파라미터로 전송된다) |
| 공통코드 옵션 텍스트 | `{t(d.nameMsgKey \|\| d.name)}` — 런타임 `resolveOptions` 가 `nameMsgKey` 를 text 자리에 넣고 `t()` 로 넘기는 것과 동일 |

#### 5.0.5 값 표현식(`data`)도 Phase 1 포함

`data` 는 임의 JS가 아니라 **닫힌 DSL**이며, 이미 순수 함수 2개로 구현돼 있다.

| 함수 (`_shared/utils.ts`) | 역할 |
|:---|:---|
| `evalColumnDataExpr(expr, row)` | 조건식 `cond?a:b`(중첩 가능) / 연결식 `a+'-'+b` / 따옴표 리터럴 / row 필드 토큰 / `{msgKey}` 브라켓 토큰 |
| `evalConditionExpr` (위 함수가 내부 위임) | `=` `!=` `<` `>` `<=` `>=`, `today()` 함수 토큰, 콤마 AND |
| `resolveEvalExprI18n(value, t)` | 평가 결과가 `{msgKey}` 브라켓이면 `t()` 로 치환 |

- `eval`/`new Function` 을 쓰지 않는 자체 파서다. **생성기가 표현식을 파싱하거나 JS로 번역하려 하지 말 것.**
  표현식 문자열을 그대로 넘기면 끝이다 — 안전성 문제도 여기서 사라진다
- 생성 코드는 이 두 함수를 **import 해서 쓴다**

```tsx
resolveEvalExprI18n(evalColumnDataExpr("is_visible=001,publish_dttm<=today()?{common.label.publish}:{common.label.unPublish}", row), t)
```

#### 5.0.6 런타임 자산 공유 — 3개 축과 3개 결합 시점 (v1.3 핵심)

생성기가 런타임에서 가져와야 하는 것은 성격이 서로 다른 3종이며, **각각 다른 방식으로 공유한다.**
"전부 import" 도 "전부 손으로 재현" 도 답이 아니다.

| 축 | 무엇인가 | 공유 방식 | 결합 시점 | 산출물에 남는 것 |
|:---|:---|:---|:---|:---|
| **A. 로직** | 서버 계약·데이터 변환 (파라미터 조립, 표현식 평가, 응답 평탄화, 코드라벨, 정렬 순환) | 산출물이 **런타임 순수 함수를 import 해서 호출** | 런타임 | `import { buildSearchQueryParams } from '.../_shared/utils'` |
| **B. 클래스 문자열** | Tailwind className (입력창, 셀, 컨테이너, 배지) | 생성기가 **생성 시점에 공용 상수를 import → 문자열 리터럴로 인라인** | 생성 시점 | `className="w-full border … text-slate-800 …"` (리터럴) |
| **C. 컴포넌트** | `WidgetRenderer` / `FieldRenderer` / `TableRenderer` / `RendererContainer` / `TableCellRenderer` | **공유하지 않는다** | — | 평문 JSX |

**왜 A와 B의 결합 시점이 다른가**

- A는 인계 개발자가 고칠 대상이 아니다. 서버가 이해하는 파라미터 형식은 화면 디자인이 아니라 **계약**이며,
  런타임과 산출물이 다른 쿼리를 보내면 그건 커스터마이징이 아니라 **버그**다. 그래서 런타임에 붙여 둔다.
- B는 인계 개발자가 **가장 먼저 고칠 대상**이다. 산출물이 `className={inputCls}` 로 남으면
  그 개발자는 빌더 폴더의 상수를 고쳐야 하고, 그 순간 다른 모든 빌더 화면이 같이 바뀐다.
  그래서 상수는 생성기만 쓰고, **산출물에는 펼쳐진 문자열**을 남긴다.
- C는 §1.2 그대로 금지. 컴포넌트를 재사용하면 산출물이 "설정을 넘기는 껍데기"가 되어 존재 이유가 사라진다.

| 구분 | 판정 |
|:---|:---|
| `WidgetRenderer` / `PageGridRenderer` / `useWidgetPageState` / `configJson` 파싱 | ❌ 금지 |
| 렌더러 컴포넌트(`FieldRenderer`, `TableRenderer`, `TableCellRenderer`, `RendererContainer`, `SpaceRenderer`) | ❌ 금지 |
| `_shared/utils.ts` / `utils/formGridLayout.ts` 의 순수 함수 (`buildSearchQueryParams`, `buildDateRangeStatusParam`, `flattenPageDataItem`, `evalFieldCondition`, `evalColumnDataExpr`, `resolveEvalExprI18n`, `resolveCodeLabel`, `formatNowBySubType`, `calculateSpaceItemRowTracks` …) | ✅ 허용 — **동일 로직 재구현 금지** |
| `_shared/styles.ts` / `_shared/components/renderer/rendererStyles.ts` 의 클래스 상수 | ✅ 생성기만 import (산출물엔 인라인) — §5.0.8 |
| 앱 전역 자산 (`@/hooks/use-i18n`, `@/store/use-code-store`, `@/lib/api`, `@/components/search`, `@/components/layout/grid-cell`) | ✅ 허용 |

> `_shared/utils.ts` 는 React 컴포넌트를 하나도 import 하지 않는다(`utils.ts:5-11` — 타입 / `@/lib/api` /
> `sonner` / `serverClockFormat` 뿐). 산출물이 이 파일을 import해도 빌더 런타임이 딸려오지 않는다.

**손 재구현 금지 원칙(v1.3)**

> 런타임에 **이미 존재하는 순수 함수와 같은 일**을 생성기 안에서 다시 구현하면 안 된다.
> 필요한 입력(config)이 함수 시그니처와 맞지 않으면, 함수를 고치는 게 아니라
> **config를 산출물에 리터럴로 내보내고 그 함수에 넘긴다.**

이 원칙을 어긴 것이 3라운드 연속 Critical의 실제 원인이다.

| 라운드 | 결함 | 손 재구현한 대상 |
|:---|:---|:---|
| R1 | C1 msgKey / C2 `col.data` / C3 codeGroup | `resolveSearchFieldLabel`, `evalColumnDataExpr`, `resolveCodeLabel` |
| R2 | N1 displayStyle / N4 sortExpr / W1 빈값가드 | `SearchRenderer` 분기, `buildSearchQueryParams` 가드 |
| R3 | **N5 select+`data` → `condexpr_`/`condval_` 미전송** | `buildSearchQueryParams` 6개 분기 중 3개만 구현 |
| (미발견) | checkbox 값을 배열로 전송 → 런타임은 콤마 join 문자열 | 런타임 검색 state는 `Record<string,string>`(`useWidgetPageState.ts:287`), 체크박스는 `next.join(",")`(`FieldRenderer.tsx:1443`). 생성기는 `string[]` 이라 axios가 `key[]=a&key[]=b` 로 직렬화한다 |

마지막 줄은 QA가 아직 못 잡은 4라운드용 결함이다. §5.1.2 전환으로 **발견되기 전에 사라진다.**

#### 5.0.7 재발 방지 — "런타임이 분기 조건으로 읽는 config 필드"는 범위표 필수 항목

같은 실패가 세 번 반복됐다. `msgKey`(1차) → `col.data`(2차) → `displayStyle`(3차).
세 건 모두 원인이 동일하다.

> 런타임 렌더러는 그 필드를 읽는데 **설계 범위표에 없어서** 생성기가 필드의 존재 자체를 모르고,
> TODO도 `unsupported` 경고도 남지 않아 **화면이 깨진 뒤에야** 발견된다.

값 필드와 분기 필드는 사고 크기가 다르다.

| 종류 | 빠졌을 때 결과 | 예 |
|:---|:---|:---|
| 값 필드 | 그 칸 하나가 비거나 잘못 표시됨 | `headerMsgKey`, `col.data` |
| **분기 필드** | **레이아웃 전체가 다른 화면**이 나오고, 넘친 영역이 다른 위젯을 덮어 조작 불가가 됨 | `displayStyle` |

**규칙 1 — 렌더러 대조표 의무 (블록 신규 작성/수정 시 산출물)**

블록을 만들거나 고칠 때는 대응 런타임 렌더러 파일을 열고 아래 3종을 **전수로** 뽑아 표로 남긴다.
"확인했다"는 진술만으로는 인정되지 않는다(공통원칙 §1과 동일 기준).

1. Renderer의 props interface 전체
2. 렌더러가 **분기 조건**으로 쓰는 config 필드 — `if (x === ...)`, 삼항, `?? 기본값`, `.filter(...)` 조건
3. 렌더러가 표시 텍스트로 쓰는 필드 (msgKey 계열 포함)

각 항목의 처리 구분은 **지원 / TODO(미지원 명시) / 해당없음(사유 필수)** 셋 중 하나여야 하며 **빈칸은 금지**다.

| 렌더러 항목 | 종류 | 생성기 처리 | 근거 |
|:---|:---|:---|:---|
| (예) `displayStyle` | 분기 | 지원 (§5.1.1) | `SearchRenderer.tsx:119` |
| (예) `collapsible` | 분기 | 해당없음 — live 전용 접기 UI, 생성 페이지는 항상 펼침 | `SearchRenderer.tsx:225` |

**규칙 2 — 사람 체크리스트로 끝내지 말고 생성기가 스스로 잡게 한다**

체크리스트만으로는 네 번째가 또 난다. 블록마다 자기가 처리하는 키 집합을 코드에 선언하고,
생성 시점에 실제 config 객체의 키와 대조해 **처리 대상도 무시 대상도 아닌 키**를 결과에 실어 올린다.

```ts
export interface WidgetBuildResult {
  tsxCode: string;
  unsupported: PageWidgetType[];
  /** 생성기가 처리하지도, 무시 대상으로 선언하지도 않은 config 키 */
  unhandled: { widget: string; scope: 'widget' | 'field' | 'column'; keys: string[] }[];
}
```

- 각 블록은 `HANDLED_KEYS` 와 `IGNORED_KEYS`(빌더 편집 전용 키 등 화면에 영향 없는 것)를 선언한다
- 남은 키는 **① 산출물에 TODO 주석 1줄 ② `unhandled` 목록 ③ 생성 완료 시 경고 토스트** 로 3중 노출한다
- 이 장치가 있었다면 `blog-list` 의 `displayStyle` 은 **코드를 한 줄도 고치지 않은 상태에서 생성 즉시 경고로 잡혔다**

**규칙 3 — "Phase 1 제외"로 미룰 수 있는 것과 없는 것**

| 종류 | Phase 1 제외 | 대신 해야 할 것 |
|:---|:---:|:---|
| 값 필드 | 가능 | TODO 주석 + `unhandled` 기록 |
| **분기 필드** | **불가** | 지원하거나, 지원 못 하면 **생성 자체를 막고** 사유를 사용자에게 알린다 |

**규칙 4 — `IGNORED_KEYS` 는 주장이 아니라 근거다 (v1.3 추가)**

N5는 `HANDLED_KEYS`/`IGNORED_KEYS` 장치를 **통과해버린** Critical이다.
`data` 키가 `IGNORED_FIELD_KEYS` 에 `'text 타입 전용 — Search Phase1 미지원'` 사유로 등록돼 있었는데
그 문구가 사실이 아니었다(`utils.ts:2843` 이 `select` 타입에서 이 키를 읽는다).
즉 **오분류 자체가 경고를 막는 은폐 장치로 작동**했다.

- `IGNORED_KEYS` 의 사유 문구에는 **"런타임에서 이 키를 읽는 지점이 없다"는 근거를 파일:라인으로** 남긴다.
  근거 없이 "…전용", "…미지원" 이라고만 쓴 항목은 **IGNORED 자격이 없다** → `HANDLED` 로 올리거나 unhandled로 노출한다
- 코드리뷰 게이트에 항목 추가: **`IGNORED_KEYS` 전 항목을 런타임 grep으로 대조**한다.
  `rg "f\.<key>|field\.<key>|col\.<key>" _shared/` 결과가 있는데 IGNORED면 즉시 critical
- 근본적으로는 §5.1.2처럼 **키 분류에 의존하지 않는 구조**(리터럴 통째 전달 + 런타임 함수 호출)로 바꾸는 것이
  가장 확실한 해결이다. 분류표는 마크업처럼 리터럴 전달이 불가능한 영역에만 남긴다

#### 5.0.8 클래스 문자열은 공용 상수 1곳에서만 나온다 (v1.3 신규)

3라운드 Warning/Info 대부분(R1·R3·R4·R5·R6·R7)이 **같은 결함 1종**이다 —
런타임 클래스 문자열을 생성기에 손으로 베껴 적었고, 그 사본이 원본과 조금씩 다르다.

| 대상 | 런타임 | 생성기(v1.2) | 차이 |
|:---|:---|:---|:---|
| 검색 input | `inputCls` (`styles.ts:9`) | 손으로 적은 축약본 | `text-slate-800`, `placeholder:text-slate-400`, `bg-white`, `disabled:*` 누락 (R7) |
| 검색 select | `selectCls` (`styles.ts:13`) | 손으로 적은 축약본 | 동일 계열 + `cursor-pointer` 누락 |
| select 화살표 | `SelectArrow` svg `w-3.5 h-3.5` | lucide `ChevronDown w-4 h-4` | 아이콘 자체가 다름 |
| 테이블 td | `px-4 py-3 max-w-[200px] overflow-hidden` (`TableRenderer.tsx:374`) | `px-4 py-3 text-slate-700 whitespace-nowrap` | 클리핑 없음 + 색 다름 (R4) |
| 정렬 헤더 | `flex items-center justify-center gap-1 w-full transition-colors …` (`:282`) | `flex items-center gap-1 cursor-pointer select-none` | 중앙정렬 없음 (R1) |
| space 그룹 | `flex items-center-safe gap-2 px-3 min-w-0 {justify}` (`SpaceRenderer.tsx:210`) | `… px-3 h-full {justify}` | `min-w-0` 누락 → **그리드 트랙 왜곡** (R3) |
| badge 셀 | `BADGE_CLS` + `gap-1.5` + `shapeCls` (`TableCellRenderer.tsx:104`) | 자체 `BADGE_BG` 맵 + `rounded-full` 고정 | 맵이 2벌, `showIcon` 미지원 |

**결정: 클래스 문자열은 공용 상수에서만 나온다. 생성기는 그 상수를 import 해서 문자열을 인라인한다.**

| 상수가 사는 곳 | 담는 것 | 소비자 |
|:---|:---|:---|
| `_shared/styles.ts` (**이미 존재**) | 필드 단위 — `inputCls`, `selectCls`, `fieldOptionGroupCls` 등 | `FieldRenderer`(이미 소비 중) + 생성기 |
| `_shared/components/renderer/rendererStyles.ts` (**신규**) | 위젯 크롬 단위 — 컨테이너 / 테이블 / space 그룹 / badge 맵 | 각 Renderer + 생성기 |

- **`rendererStyles.ts` 는 React를 import하지 않는 순수 모듈**이다(문자열 상수와, 플래그를 받아 문자열을
  돌려주는 함수만). 컴포넌트 파일에 상수를 두고 생성기가 그걸 import하면 생성기 모듈 그래프에 React
  컴포넌트가 딸려 들어오고 순환 참조가 생긴다
- **런타임 렌더러도 반드시 같은 상수를 소비하도록 고친다.** 이걸 빼면 "단일 진실"이 아니라 사본이 하나 더
  늘어날 뿐이다. 치환 결과 문자열은 **바이트 단위로 동일**해야 하며, 조건부 클래스
  (`isPreview ? … : …`)는 **같은 인자를 받는 함수**로 추출한다 — 그래야 생성기가 `isPreview=false` 로
  호출해 런타임 live와 동일한 문자열을 얻는다
- Tailwind v4 인식 문제 없음 — `inputCls` 가 이미 `styles.ts`(.ts 파일)에서 동작 중이다.
  단 **상수 값 자체는 항상 완성된 클래스 문자열**이어야 한다(`` `text-${color}-500` `` 금지, 공통원칙 §4)

**산출물에는 상수 import가 남지 않는다.** 생성기가 `import { inputCls } from '../../styles'` 하고
`className=${jsStringLiteral(inputCls)}` 로 찍는다. 산출물에는 펼쳐진 문자열만 보인다.

```ts
// 생성기 (searchBlock.ts)
import { inputCls } from '../../styles';
jsxLines.push(`<input type="text" className=${jsStringLiteral(inputCls)} … />`);

// 산출물
<input type="text" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 …" />
```

**태그 구조는 상수로 해결되지 않는다.** 클래스 단일화로 R3·R4·R6·R7은 사라지지만,
`span`→`button`(R1), 아이콘 3종·정렬 3단 순환(R2), 건수바 두 번째 `<p>`(R5)처럼
**DOM 구조·상호작용**이 다른 건은 개별 이식이 필요하다. §5.0.7 규칙 1의 렌더러 대조표는
클래스뿐 아니라 **태그 이름 / 자식 노드 개수 / 이벤트 핸들러** 도 항목으로 포함한다.

### 5.1 `generateSearchBlock`

**입력 타입** — `SearchWidget` (`_shared/components/renderer/types.ts`)

| 필드 | 타입 | 생성 시 쓰임 |
|:---|:---|:---|
| `widgetId` | `string` | suffix 매핑 키 |
| `contentKey` | `string` | 검색 파라미터 네임스페이스 |
| `rows` | `SearchRowConfig[]` | 행 단위 반복 → `<SearchRow cols={n}>` |
| **`displayStyle`** | `'standard' \| 'simple'` (미설정 시 `'standard'`) | **레이아웃 분기 — Phase 1 필수. §5.1.1** |

`SearchRowConfig` = `{ id, cols: 1~6, fields: SearchFieldConfig[] }`
`SearchFieldConfig` 는 옵션이 150개 가까운 대형 타입이다. **Phase 1은 아래만 다룬다.**

| 항목 | Phase 1 지원 범위 |
|:---|:---|
| 필드 타입 | `input` / `select` / `date` / `dateRange` / `checkbox` / `radio` / `hidden` |
| 공통 속성 | `label`, `fieldKey`(없으면 `varName(label)`), `colSpan`, `placeholder`, `required`, `defaultValue` |
| **다국어 (§5.0)** | `labelMsgKey`, `label2MsgKey`, `placeholderMsgKey`, `defaultValueMsgKey` — **msgKey 우선, 평문 폴백** |
| `select` 옵션 | 정적 `options: string[]` 및 `codeGroupCode` — 옵션 텍스트는 §5.0.4대로 **항상 `t()` 통과**, 옵션 값은 원문 유지 |
| 그 외 | `optionSlug` 연동, `disableCondition`, 데이터생성 등은 **Phase 1 제외 → TODO 주석** |

**라벨 표현식 생성 규칙** — 런타임 `resolveSearchFieldLabel(f, t)`(`utils.ts`)와 **의미가 동일해야 한다.**
그 함수는 `t` 를 런타임에 요구하므로 생성 시점에 호출할 수 없다. 대신 아래 표현식을 만들어 낸다.

| 필드 | 생성 표현식 |
|:---|:---|
| 일반 | `labelMsgKey` 있으면 `t('<key>')`, 없으면 `"<label>"` |
| `dateRange` / `yearMonthRange` | `[<시작라벨식>, <종료라벨식>].filter(Boolean).join(' ~ ')` — 한쪽만 있으면 그쪽만 남는다 |

⚠️ `` `${f.label} ~ ${f.label2 || ''}` `` 처럼 평문만 이어 붙이지 말 것. 라벨이 비면 `" ~ "` 만 남는다.

**생성물 개요**

| 조각 | 내용 |
|:---|:---|
| imports | `@/components/search` (`SearchForm`, `SearchRow`, `SearchField`), 사용 필드에 따라 `lucide-react` 아이콘, `codeGroupCode` 사용 시 `@/store/use-code-store`, msgKey/옵션 텍스트 사용 시 `@/hooks/use-i18n` |
| state | `const [params{suffix}, setParams{suffix}] = useState({ ...필드별 초기값 })` |
| handler | `handleSearch{suffix}` / `handleReset{suffix}` — 연결된 Table 블록의 fetch 함수를 호출 |
| jsx | `<SearchForm>` → `<SearchRow>` → `<SearchField>` 중첩 |

> 필드 변수명은 `listGenerator`와 동일하게 `fieldKey || varName(label)` 규칙을 따른다.
> `varName`은 `_shared/utils.ts`에 이미 있으므로 새로 만들지 말 것.

#### 5.1.1 `displayStyle` — Phase 1 포함 (simple 분기 구현)

`SearchWidget.displayStyle` 은 값이 **`'standard' | 'simple'` 2종뿐**이다
(`components/renderer/types.ts:51`, 기본값 `'standard'` — `SearchRenderer.tsx:58`).

**결정: Phase 1에 포함한다. unsupported 처리나 standard 강제 변환은 채택하지 않는다.**

| 대안 | 판정 | 사유 |
|:---|:---:|:---|
| Phase 1 포함 (simple 분기 구현) | ✅ 채택 | 값이 2종뿐이고, 필드 내부 마크업은 standard와 **완전히 동일한 생성 코드를 재사용**한다. 다른 것은 바깥 껍데기(라벨 유무 / 버튼 위치)뿐이라 비용이 작다 |
| simple은 unsupported로 막기 | ❌ 기각 | 기준 운영 템플릿(`blog-list`)이 simple이다. 막으면 **Phase 1 산출물이 하나도 안 나온다** |
| simple을 standard로 강제 변환 | ❌ 기각 | 레이아웃이 달라지는 것을 넘어 **높이가 72px → 153px로 넘쳐 아래 위젯을 덮는다.** "생성 화면 = 빌더 미리보기" 라는 §9.3 검증 기준 자체가 깨진다 |
| 분기 필드이므로 §5.0.7 규칙 3에 따라 제외 불가 | — | `displayStyle` 은 값 필드가 아니라 분기 필드다 |

**simple 생성 사양** (근거: `SearchRenderer.tsx:118-218`)

| 항목 | 규칙 |
|:---|:---|
| 대상 행 | **`rows[0]` 하나만** 그린다. `rows[1]` 이후는 런타임도 렌더링하지 않는다 → 존재하면 TODO 주석 1줄로 "이 행은 simple 스타일에서 표시되지 않습니다" 를 남긴다 |
| 컨테이너 | §4.7.1 표의 `search(simple)` 행 그대로 |
| 필드 영역 | `<div className="flex-1 grid grid-cols-{cols} gap-4">`, `cols = row.cols ?? 5` |
| 필드 래퍼 | `<div className="col-span-{min(field.colSpan ?? 1, cols)}">` |
| 라벨 | **없음.** `SearchField` / `label` / `required` 표시를 생성하지 않는다 |
| Enter 검색 | 필드 영역 div에만 `onKeyDown={e => { if (isEnterSearchTrigger(e)) handleSearch{suffix}(); }}`. 루트에 달면 버튼과 이중 실행된다(`SearchRenderer.tsx:143`). `isEnterSearchTrigger` 는 `@/components/search` 에서 import |
| 버튼 | **초기화(왼쪽) → 검색(오른쪽)** 순서. 클래스·아이콘(`RotateCcw` / `Search`)·텍스트 키(`common.btn.reset` / `common.btn.search`)는 `SearchRenderer.tsx:204-215` 와 동일 |
| i18n | simple이면 버튼 텍스트가 항상 `t()` 이므로 `needsI18n` 을 **무조건 true** 로 둔다 |
| import | simple에서는 `SearchForm` / `SearchRow` / `SearchField` 를 import하지 않는다 (미사용 import는 lint 경고가 된다) |

⚠️ `grid-cols-{n}` / `col-span-{n}` 은 **생성 시점에 값이 확정**되므로 문자열 리터럴로 그대로 찍는다.
산출물에 템플릿 리터럴로 클래스를 조합하면 Tailwind v4에서 CSS가 생성되지 않는다(§4.7).
런타임이 `GRID_COLS` / `COL_SPAN` 맵을 쓰는 이유는 런타임엔 값이 동적이기 때문이며, 생성기는 그 맵을 옮길 필요가 없다.

⚠️ `hideCondition` 이 걸린 필드는 standard/simple **양쪽 모두** 런타임이 JSX에서 제거한다
(`SearchRenderer.tsx:155, 232` — `hiddenMap[field.id]`). 현재 생성기는 조회 파라미터에서만 제외하고
화면에는 그대로 남긴다. 이것도 분기 필드 누락이므로 Phase 1에서 함께 처리한다
(`evalFieldCondition` 은 이미 import 중이므로 JSX 조건부 렌더만 추가하면 된다).

#### 5.1.2 조회 파라미터 조립 — `buildSearchQueryParams` 를 산출물이 직접 호출한다 (v1.3 전환)

**v1.2까지는** 생성 코드의 `getSearchParams{suffix}` 가 런타임 `buildSearchQueryParams`(`utils.ts:2781-2861`)를
손으로 옮긴 것이었다. 런타임은 분기가 6개인데 생성기(`buildParamAssignLines`)는 3개만 구현했고,
빠진 분기가 라운드마다 하나씩 Critical로 발견됐다(W1 빈값가드 → N4 sortExpr → **N5 `condexpr_`/`condval_`**).

**결정: 손 재구현을 폐기하고, 산출물이 `buildSearchQueryParams` 를 import 해서 호출한다.**

| 대안 | 판정 | 사유 |
|:---|:---:|:---|
| 런타임 함수 직접 호출 + 필드 정의를 소스에 리터럴로 고정 | ✅ **채택** | 분기 6개가 전부 자동으로 따라온다. 앞으로 런타임에 7번째 분기가 생겨도 생성기를 고칠 필요가 없다 |
| 지금처럼 손으로 옮기되 분기 표를 §5.x에 못박기 | ❌ 기각 | 표는 v1.2에서 이미 만들었고 그 상태로 N5가 났다. 표를 늘려도 **표와 코드가 어긋나는 것을 막는 장치가 없다** |
| `buildSearchQueryParams` 를 생성기용으로 포크 | ❌ 기각 | 사본이 하나 더 늘 뿐 |

**호출 형태**

```tsx
import { buildSearchQueryParams } from '@/app/admin/templates/make/_shared/utils';
import type { SearchFieldConfig } from '@/app/admin/templates/make/_shared/types';

const SEARCH_FIELDS_Search1: SearchFieldConfig[] = [
  { id: 'title', type: 'input', label: '제목', fieldKey: 'title' },
  { id: 'status', type: 'select', label: '게시상태', fieldKey: 'status',
    data: 'is_visible=001,publish_dttm<=today()?{common.label.publish}:{common.label.unPublish}' },
];

const getSearchParamsSearch1 = (sv: Record<string, string> = paramsSearch1) =>
  buildSearchQueryParams(SEARCH_FIELDS_Search1, sv);
```

산출물을 열어 보면 **"이 검색폼은 이런 필드로 구성돼 있고, 그 정의를 이 함수에 넘긴다"** 가 그대로 읽힌다.
`configJson` 을 불러오지도, 파싱하지도 않는다 → §1.2 위반이 아니다(§1.2 표 3행).

**함께 따라오는 필수 변경 — 검색 state의 키와 자료형을 런타임과 맞춘다**

`buildSearchQueryParams` 는 `sv` 를 **`f.id` 기준**으로 읽고(`utils.ts:2802-2803, 2823`),
자료형은 **`Record<string, string>`** 이다(`useWidgetPageState.ts:287`). 생성기는 지금 fieldKey 기준 +
`string | string[]` 를 쓰고 있어 그대로는 맞물리지 않는다.

| 항목 | v1.2 (손 재구현) | v1.3 (직접 호출) |
|:---|:---|:---|
| state 키 | `fieldKey \|\| varName(label)` | **필드 리터럴의 `id`** |
| dateRange state 키 | `{key}_gte`/`{key}_lte` 또는 `fieldKey2` (출력 파라미터명과 같음) | 항상 `{id}_from` / `{id}_to`. **출력 파라미터명은 함수가 계산한다** |
| checkbox 값 | `string[]` (axios가 `key[]=a&key[]=b` 로 직렬화 — 런타임과 다름) | 콤마 join `string` (`FieldRenderer.tsx:1443` 과 동일) |
| 빈값 가드 / `today()` 치환 / hideCondition 제외 / `excludeFromSearch` | 생성 코드가 각각 구현 | **전부 함수가 처리** — 생성 코드에서 삭제 |

⚠️ **`id` 는 읽기 좋은 값으로 재작성해서 내보낸다.** 빌더의 `field.id` 는 `field-1725…` 같은 기계값이라
그대로 쓰면 산출물 state가 읽히지 않는다. 리터럴을 만들 때 `id` 를 `fieldKey || varName(label)` 로 **치환**한다.
`buildSearchQueryParams` 는 `id` 를 sv 조회 키와 `keyToId` 매핑에만 쓰므로(`utils.ts:2790, 2802, 2823`)
치환해도 동작이 같고, `hideCondition` 이 참조하는 fieldKey→id 매핑이 항등이 되어 오히려 단순해진다.
단 **치환 후 id가 서로 충돌하면**(같은 fieldKey 2개 등) 그 검색 위젯만 원본 `id` 를 그대로 쓰고 TODO 주석을 남긴다.

**필드 리터럴에 담을 키 — 손으로 고른 목록에 의존하지 않는다**

리터럴을 전체 config로 내보내면 안전하지만 장황하고, 골라 내보내면 짧지만
**"어떤 키를 고를지"가 또 하나의 손 관리 목록**이 되어 N5와 같은 실패를 반복한다. 그래서 둘을 합친다.

1. `utils.ts` 에 `buildSearchQueryParams` 와 **같은 모듈, 함수 바로 옆**에 읽는 키 목록을 상수로 둔다
   (`SEARCH_QUERY_PARAM_FIELD_KEYS`). 분기를 고치는 사람 눈에 들어오는 위치여야 한다
2. 생성기는 그 상수로 필드를 추린 리터럴을 만든다
3. **생성 시점에 자기 검증**한다 — 원본 config 필드와 추린 리터럴 각각에 동일한 탐침값
   (모든 키에 임의 문자열, dateRange는 `_from`/`_to`)을 넣고 `buildSearchQueryParams` 를 두 번 호출해
   결과를 비교한다. 다르면 **추리기를 포기하고 원본 필드를 통째로 내보낸 뒤 경고를 남긴다**

3번 덕분에 1번 목록은 "가독성 최적화"일 뿐 **정확성의 전제가 아니게 된다.** 목록이 낡아도 결과는 안 틀린다.

**표시(마크업)와 조회(파라미터)의 키 분류는 서로 독립이다**

`HANDLED_FIELD_KEYS` / `IGNORED_FIELD_KEYS` 는 이제 **마크업 생성 범위**만 판정한다.
조회 파라미터는 리터럴 통째로 함수에 넘어가므로 이 목록의 영향을 받지 않는다.
따라서 `IGNORED_FIELD_KEYS` 에서 `data` 를 제거하는 것은 여전히 필요하다(`select` 표시 로직과 무관하지만
**"런타임이 읽는 키"이므로 IGNORED 자격이 없다** — §5.0.7 규칙 4).

#### 5.1.3 placeholder / select 첫 옵션 — 한국어 리터럴 금지

런타임 `FieldRenderer` 의 placeholder 결정 규칙은 타입별로 다르며, **폴백까지 전부 메시지 키**다.

| 대상 | 런타임 규칙 | 근거 |
|:---|:---|:---|
| `input` 계열 | `placeholderMsgKey ? t(...) : placeholder \|\| t('common.input.placeholder')` | `FieldRenderer.tsx:1117` |
| `select` 첫 옵션(`<option value="">`) | ① `placeholderMsgKey` → `t(...)` ② `placeholder.trim() === '전체'` → `t('common.label.all')` ③ `placeholder \|\| t('common.select.placeholder')` | `FieldRenderer.tsx:1177-1180`, `constants.ts:53-54` |

- 생성기의 `'입력하세요'`, `<option value="">전체</option>` 같은 **한국어 리터럴은 전부 위 키로 대체**한다
- `'전체'` 특례(②)는 `constants.ts` 의 `SELECT_ALL_PLACEHOLDER` / `SELECT_ALL_MSG_KEY` 상수를 생성기가 import해 판정한다. 문자열 `'전체'` 를 생성기에 다시 적지 말 것

#### 5.1.4 산출물의 사용자 노출 문자열은 전부 `t()` 를 거친다

§5.0.3의 결정(로케일 고정 금지)은 라벨/헤더만이 아니라 **산출물의 모든 사용자 노출 문자열**에 적용된다.
`'전체 N건'`, `'불러오는 중...'`, `'데이터가 없습니다.'`, 에러 토스트 문구가 한국어로 굳어 있으면
EN 로케일에서 화면 절반이 한국어로 남아 결정이 반쪽이 된다.
런타임이 쓰는 키를 그대로 이식한다(예: `common.pagination.total`, `common.pagination.showing` —
`TableRenderer.tsx:206, 210`). 새 키를 만들지 말 것.

### 5.2 `generateTableBlock`

**입력 타입** — `TableWidget` (`_shared/components/builder/TableBuilder.tsx`)

| 필드 | 타입 | 생성 시 쓰임 |
|:---|:---|:---|
| `columns` | `TableColumnConfig[]` | `<thead>` / `<tbody>` 셀 렌더링 |
| `connectedSearchIds` | `string[]` | **어떤 Search 위젯의 파라미터를 조회에 실을지** — 블록 간 유일한 참조 관계 |
| `connectedSlug` | `string?` | 데이터 조회 API slug (비면 `ctx.mainConnectedSlug`) |
| `pageSize` | `number` | 페이지 크기 초기값 |
| `displayMode` | `'pagination' \| 'scroll'` | 하단 페이저 / 무한스크롤 분기 |
| `enableRowSelection` | `boolean?` | 체크박스 컬럼 추가 여부 |
| `sourceFilter` | `string?` | 서버 전용 필터식 — 조회 파라미터에 그대로 실음 |

`TableColumnConfig` 필수 필드는 `id / header / accessor / align / sortable / cellType`.
`cellType` 은 `text | badge | boolean | actions | file | date | dateRangeStatus | inlineEdit | button`.

**컬럼 속성 입력값 — Phase 1 대상 전체 목록**

| 속성 | Phase 1 | 생성 시 처리 |
|:---|:---:|:---|
| `header` / `headerMsgKey` | ✅ | §5.0.2 우선순위. 둘 다 없으면 `actions` 컬럼은 `t('common.label.action')`, 그 외 `'—'` |
| `accessor` | ✅ | `row['<accessor>']` 접근 키 |
| **`data`** | ✅ | **값 표현식.** §5.0.5대로 `resolveEvalExprI18n(evalColumnDataExpr("<expr>", row), t)` 로 감싼다 |
| **`codeGroupCode` / `displayAs`** | ✅ | `displayAs !== 'value'` 일 때 `resolveCodeLabel(strVal, '<code>', '<displayAs>', groups, t)` (`utils.ts`). 코드 원시값 노출 금지 |
| `align`, `width` + `widthUnit` | ✅ | 인라인 `style` |
| `sortable` | ✅ | 헤더 정렬 토글 + 조회 파라미터 |
| `cellOptions` + `textMsgKey`, `showIcon`, `badgeShape` | ✅ | badge 정적 클래스 맵. 텍스트는 §5.0.2 |
| `trueText`/`trueTextMsgKey`, `falseText`/`falseTextMsgKey` | ✅ | boolean. 텍스트는 §5.0.2 |
| `dateFormat` | ✅ | date 포맷 헬퍼 |
| `isNumber` | ✅ | 숫자면 `toLocaleString()` (런타임 `TableCellRenderer` 기본 분기와 동일) |
| `maskType` 계열 | ❌ | TODO 주석 |
| `relationSlugId` / `relationSlugIds` / `fetchDisplayMode` | ❌ | TODO + `unsupported` 기록 |
| `actions` / `editPageRules` / `editPopupSlug` / `buttonLabel` 계열 | ❌ | TODO 주석 |
| `inlineEdit*` | ❌ | TODO 주석 |
| `linkedDateRangeKey` / `before·inRange·afterText` 계열 | ❌ | TODO 주석 (`dateRangeStatus`) |

| 항목 | Phase 1 지원 범위 |
|:---|:---|
| `cellType` | `text` / `badge` / `boolean` / `date` |
| 목록 조회 | `connectedSlug` 기반 조회 + 연결된 Search 파라미터 병합 + 페이징/정렬 |
| 그 외 | `actions` / `inlineEdit` / `button` / `file` / `dateRangeStatus` / 팝업 연결 / 마스킹 / relation 은 **Phase 1 제외 → TODO 주석** |

**셀 값 계산은 cellType 분기보다 앞에서 한 번만 한다**

런타임 `TableCellRenderer` 는 `value` 를 스위치 진입 **전에** 한 번 만들고 모든 cellType이 그것을 쓴다.
생성기도 동일한 순서를 따른다. cellType별 분기 안에서 각자 `row['accessor']` 를 직접 읽으면
`data` / `codeGroupCode` 가 특정 분기에만 적용되는 누락이 반복된다.

```
① 원시값     row['<accessor>']
② data 표현식 col.data 있으면 resolveEvalExprI18n(evalColumnDataExpr(...), t)
③ 코드 변환   col.codeGroupCode && displayAs !== 'value' 이면 resolveCodeLabel(...)
④ cellType별 렌더 (text / badge / boolean / date)
```

⚠️ `col.data` 가 있으면서 `relationSlugId` / `relationSlugIds` 도 설정된 컬럼은 런타임이 전혀 다른 경로
(`formatFetchedRelMulti`)를 타므로 **Phase 1 미지원으로 분류**하고 TODO + `unsupported` 에 기록한다.

**정렬 키는 `_pathMap` 으로 변환한다**

`flattenPageDataItem` 이 만들어 주는 `row._pathMap` 은 `fieldKey → "sectionKey.fieldKey"` 매핑이다.
런타임(`useWidgetPageState.handleSortChange`)은 정렬 요청 직전에 이 맵으로 accessor를 실제 경로로 바꾼다
(그래서 `sort=blog.title,asc` 가 나간다). 생성 코드도 동일하게 변환해야 하며,
accessor를 그대로 보내면 서버가 인식하지 못한다.

**`col.data` 컬럼 정렬은 `sortExpr` 을 함께 보낸다**

표시(display)만 맞추면 정렬이 어긋난다. 런타임은 계산식 컬럼을 정렬할 때 `sort` 와 별도로
**원본 표현식 문자열을 `sortExpr` 로 함께 전송**한다(서버가 표현식 기준으로 정렬해야 하기 때문).

| 런타임 동작 | 근거 |
|:---|:---|
| `onSort(accessor, dir, dataExpr)` — `dataExpr` 은 계산식 컬럼(`col.data`)일 때만 전달 | `PageGridRenderer.tsx:128-129, 782` |
| `dataExpr` 이 없고 `cellType==='dateRangeStatus'` 면 `buildDateRangeStatusSortExpr(col)` 로 대체 | `useWidgetPageState.ts:813` |
| 정렬 해제(`dir === null`)면 `sortExpr` 을 보내지 않는다 | `useWidgetPageState.ts:814` |
| 전송 조건은 `sk && sortExpr && !isEntity` — **entity 연결 페이지는 `sortExpr` 을 보내지 않는다** | `useWidgetPageState.ts:378` |
| `sort` 키는 `resolveFetchSortKey` 를 거치지만 `_fetchedRel{n}` accessor가 아니면 **입력 그대로 반환**한다(no-op) | `utils.ts:1359-1373` |

생성 규칙:

- accessor → `col.data` 원문 매핑을 **생성 시점 상수**로 찍는다 (`const SORT_EXPR{suffix}: Record<string, string> = { ... }`).
  런타임 객체를 참조하지 않으므로 §1.2 위반이 아니다
- `sortExpr` 은 `_pathMap` 으로 치환하기 **전의 원본 accessor** 로 조회한다. `sort` 만 치환 대상이다
- 전송 조건에 `ctx.isEntity` 를 반영한다 (entity면 `sortExpr` 미전송)
- `dateRangeStatus` 는 Phase 1 미지원이므로 `buildDateRangeStatusSortExpr` 경로는 옮기지 않는다

**헤더 마크업도 런타임과 대조한다** — `th` 는 `whitespace-nowrap` 을 포함하고,
`textAlign` 은 `col.align` 이 아니라 **항상 `center`** 다(`TableRenderer.tsx:257-264`).
`width` 만 `col.width` + `col.widthUnit` 을 따른다. 본문 셀 정렬(`col.align`)과 헤더 정렬을 혼동하지 말 것.

**연결 해석 규칙**: `connectedSearchIds` 의 각 `widgetId` 를 `ctx.suffixOf()` 로 변환해
`{ ...params{searchSuffix} }` 를 fetch 파라미터에 펼쳐 넣는다.
연결된 Search가 **같은 페이지에 없으면** 무시하고 TODO 주석을 남긴다(끊어진 참조로 컴파일 에러를 내지 말 것).

**정렬 UI는 런타임 `SortIcon` / 3단 순환을 그대로 이식한다** (v1.3 — R1·R2)

| 런타임 | 근거 | 생성 규칙 |
|:---|:---|:---|
| 정렬 헤더는 `<span>` 이 아니라 **`<button>`** | `TableRenderer.tsx:267` | 태그를 button으로 |
| 헤더 클래스 `flex items-center justify-center gap-1 w-full transition-colors hover:text-slate-900` | `:282` | §5.0.8 상수(live 인자)로 인라인 |
| 아이콘 3종 — asc `ChevronUp`, desc `ChevronDown`, 미정렬 `ChevronsUpDown`, 전부 `w-3.5 h-3.5`, 미정렬만 `text-gray-300` | `:53-57` | `SortIcon` 을 산출물 로컬 컴포넌트로 이식. `ArrowUpDown` 단일 아이콘 금지 |
| 순환은 **asc → desc → 해제(null) → asc** | `:273-278` | 해제 상태에서는 `sort` / `sortExpr` 을 **아예 전송하지 않는다** |

- 순환 계산은 3항 연산 한 줄이지만 **런타임과 산출물 양쪽에 존재하면 또 갈라진다.**
  `utils.ts` 에 `nextSortDir(isCurrentColumn, currentDir)` 순수 함수를 두고 `TableRenderer` 와 산출물이 **함께 호출**한다(축 A)
- 정렬 state는 `sortDir: 'asc' | 'desc'` 가 아니라 **`'asc' | 'desc' | null`** 이어야 3단이 표현된다

**페이저는 런타임과 동일한 숫자 페이저로 맞춘다** (v1.3 — v1.2의 "간이 페이저 허용" 결정을 **철회**)

v1.2는 `totalPages > 1` 일 때만 `‹ 1 / N ›` 을 그리는 간이 페이저를 허용했다. 철회 사유:

| 사유 | 내용 |
|:---|:---|
| 검증 기준과 충돌 | §9.3의 판정 기준이 "생성 화면 = 빌더 미리보기" 다. 예외를 두면 **QA가 매 라운드 같은 항목을 이슈로 올리고 매번 예외인지 확인해야 한다** (실제로 3라운드 내내 I2로 올라왔다) |
| 이득이 작지 않음 | 런타임 페이저는 순수 프레젠테이션이다. 10개 단위 그룹 계산만 순수 함수로 빼면 나머지는 JSX 25줄이다 |
| 표시 조건도 다름 | 런타임은 `totalPages >= 1` 이면 항상 노출(`TableRenderer.tsx:428`). 산출물은 `> 1` — **1페이지 데이터에서 높이가 달라진다** |

- 페이지 그룹 계산(`Math.floor(currentPage / 10) * 10` ~ `min(+10, totalPages)`, `TableRenderer.tsx:451-454`)은
  `pageGroupRange(currentPage, totalPages)` 순수 함수로 추출해 런타임·산출물이 공유한다(축 A)
- 버튼 문구는 `t('common.btn.prev')` / `t('common.btn.next')`, 클래스는 §5.0.8 상수 (`TableRenderer.tsx:433, 459-463`)
- ⚠️ 페이저 안의 문구도 §5.1.4 대상이다 — 한국어 리터럴을 남기지 않는다

**상단 건수 바 / thead / td 도 런타임과 1:1** (v1.3 — R4·R5·R6)

| 항목 | 런타임 | 근거 |
|:---|:---|:---|
| 건수 바 | `flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-slate-100` + `<p>총 N건</p>` + `<p>{start}-{end} 표시 중</p>` 2개 | `TableRenderer.tsx:204-223` |
| thead | `sticky top-0 z-10` | `:236` |
| td | `px-4 py-3 max-w-[200px] overflow-hidden` (색 지정 없음 — 상속) | `:374` |
| tr | `border-b border-slate-100 hover:bg-slate-50/50` | `:306` |

**셀 내부 마크업의 단일 진실은 `TableCellRenderer` 다**

`cellType` 별 셀 내부는 `TableRenderer` 가 아니라 `TableCellRenderer` 가 그린다. Phase 1 4종의 클래스·구조를
그쪽 기준으로 맞추고, badge 색상 맵은 **생성기에 자체 맵(`BADGE_BG`)을 두지 말고**
`TableCellRenderer` 의 `BADGE_CLS` / `BADGE_DOT` 를 §5.0.8 상수로 옮겨 공유한다.

| cellType | 런타임 | 근거 |
|:---|:---|:---|
| `badge` | `inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium {shapeCls} {BADGE_CLS[color]}` + `showIcon` 이면 `w-1.5 h-1.5 rounded-full {BADGE_DOT[color]}` 점 | `TableCellRenderer.tsx:104-121` |
| `boolean` | `text-sm truncate block` + `text-emerald-600 font-medium` / `text-slate-400` | `:140` |
| `date` | `text-sm text-slate-700 truncate block` + `title={원본값}` | `:250-276` |
| `text`(기본) | `text-sm text-slate-600` 계열 | `:113` |

⚠️ `badgeShape` / `showIcon` 은 §5.2 표에 Phase 1 ✅ 로 적혀 있으나 v1.2 생성기는 둘 다 무시하고
`rounded-full` 로 고정했다. 상수 공유 시 함께 반영한다.

**생성물 개요**

| 조각 | 내용 |
|:---|:---|
| imports | `@/lib/api`, `sonner`(toast), 정렬 사용 시 `lucide-react`의 `ArrowUpDown`, `@/app/admin/templates/make/_shared/utils`(`flattenPageDataItem` + `data` 사용 시 `evalColumnDataExpr`·`resolveEvalExprI18n` + 코드연동 시 `resolveCodeLabel`), msgKey/`data`/코드연동 사용 시 `@/hooks/use-i18n`, 코드연동 시 `@/store/use-code-store` |
| helper | badge 색상 정적 클래스 맵 (`listGenerator`의 `BADGE_BG`/`BADGE_DOT`와 동일 형태) |
| state | `rows{suffix}`, `total{suffix}`, `page{suffix}`, `sort{suffix}`, `loading{suffix}` |
| handler | `fetchData{suffix}` + 최초 조회 `useEffect` |
| jsx | `<table>` 마크업 + 페이저(또는 스크롤 로더) |

### 5.3 `generateSpaceBlock`

**입력 타입** — `SpaceWidget` (`_shared/components/renderer/types.ts`)

| 필드 | 타입 | 생성 시 쓰임 |
|:---|:---|:---|
| `items` | `SearchFieldConfig[]` | 배치할 텍스트/버튼 목록 |
| `align` | `'left' \| 'center' \| 'right'` | 정렬 (정적 클래스 맵으로 변환) |
| `showBorder` | `boolean?` (기본 true) | 테두리 유무 |
| `bgColor` | `string?` (기본 `white`) | 배경색 (정적 클래스 맵으로 변환) |

⚠️ `SpaceWidget` 에는 **`contentKey` 가 없다.** Search/Table과 달리 파라미터 네임스페이스를 갖지 않는다.
`items` 는 타입상 `SearchFieldConfig[]` 이지만 실제로는 아래 2종만 들어온다.

| `item.type` | 의미 | 사용 필드 |
|:---|:---|:---|
| `textarea` | 텍스트 표시 | `content` / `contentMsgKey`, `fontSize`, `bold`, `textColor` |
| `action-button` | 동작 버튼 | `label` / `labelMsgKey`, `color`, `bgColor`, `connType`, `params`, `connectedSlug` |

⚠️ 두 종류 모두 표시 텍스트에 §5.0.2 우선순위를 적용한다.
런타임(`FieldRenderer`)은 버튼 라벨을 `labelMsgKey ? t(labelMsgKey) : label || t('common.btn.default')` 로 만든다.
평문만 읽으면 실제 화면이 `Blog 등록` 인 버튼이 산출물에서 `버튼` 으로 나온다.

| 항목 | Phase 1 지원 범위 |
|:---|:---|
| `textarea` | 전부 지원 (정적 마크업이라 위험 없음) |
| `action-button` | **모양만 생성.** `connType` 별 실제 동작(`content` 저장 / `popup` / `excel` / `api` / `datasave`)은 빌더 런타임에 강하게 묶여 있어 Phase 1에서 코드로 옮기지 않는다 → `onClick` 자리에 TODO 주석 |

> `action-button` 동작을 억지로 옮기면 `WidgetRenderer` 내부 로직을 통째로 복제하게 되어
> "빌더 런타임 비의존" 원칙(§1.2)이 깨진다. Phase 1은 의도적으로 껍데기만 만든다.
> 이 판단은 Phase 2에서 재검토 대상이다.

**배치 구조도 런타임과 맞춘다** (v1.3 — R3)

R3은 클래스 1개(`min-w-0`) 누락이 원인처럼 보이지만, 실제로는 **배치 방식 자체가 다르다.**

| 항목 | 런타임 `SpaceRenderer` | 생성기(v1.2) |
|:---|:---|:---|
| 컨테이너 | `RendererContainer` 에 `contentColSpan` / `rowIsAuto` / `fillHeight` 전달 → **내부가 CSS Grid** | grid 없이 flex 한 줄 |
| 아이템 묶음 | 연속된 `action-button` 을 **그룹으로 병합**(`SpaceRenderer.tsx:185-193`), 그룹마다 `gridColumn: span N` | 그룹 개념 없음 |
| 그룹 래퍼 | `flex items-center-safe gap-2 px-3 min-w-0 {justify}` — `justify` 는 **`action-button` 그룹에만** 적용 | `… px-3 h-full {justify}` — 항상 적용, `min-w-0` 없음 |
| `fillHeight` | 위젯 설정값을 전달 | `emitContainerOpen` 기본 `true` 고정 |
| 행 트랙 | `calculateSpaceItemRowTracks`(`utils/formGridLayout.ts:301`) 결과를 `rowIsAuto` 로 전달 | 없음 |

`min-w-0` 이 없으면 flex 행의 min-content 폭이 그리드 트랙을 밀어 **12열이 균등 분할되지 않는다**
(실측 50.08px×11 + 110.11px vs 런타임 55.08px×12). 그래서 클래스 하나만 고치면 되는 문제가 아니라,
그룹 병합 + `contentColSpan` 그리드 + `rowIsAuto` 를 함께 이식해야 한다.
`calculateSpaceItemRowTracks` 는 `formGridLayout.ts` 의 순수 함수이고 `widgetGenerator.ts` 가 이미
같은 모듈의 `packedRowLayout` / `normalizeFormItemRowSpans` 를 쓰고 있으므로 **그대로 호출한다**(축 A).

`emitContainerOpen` 은 `showBorder` / `fillHeight` / `bgColor` / `clipOverflow` 를 위젯 설정에서 받아
넘긴다. 기본값을 생성기가 임의로 고정하지 않는다.

---

## 6. `widget/page.tsx` 연결

### 6.1 현재 상태

`widget/page.tsx` 는 이미 아래를 갖고 있다 — 새로 만들 필요 없다.

| 이미 있는 것 | 값 |
|:---|:---|
| 위젯 데이터 | `const [widgetItems, setWidgetItems] = useState<PageWidgetItem[]>([])` |
| 템플릿 관리 훅 | `const tm = useTemplateManagement("PAGE")` — `saveModalName` / `saveModalSlug` 보유 |
| 출력 설정 훅 | `const om = useOutputMode()` — `pageTitle` / `mainConnectedSlug` 보유 |
| 저장 전 검증 | `validateBeforeSave()` |
| 모달 임포트 | `import { SaveModal, RuleCreateModal } from "../_shared/components/TemplateModals"` |

⚠️ `useTemplateManagement` 훅에는 **생성 관련 상태가 없다.**
List / Grid-Layout도 생성 상태는 각 페이지의 로컬 `useState`로 갖고 있다. Widget도 동일하게 로컬로 둔다.
(훅에 넣으면 생성 기능이 없는 다른 빌더까지 영향을 받는다.)

### 6.2 추가할 로컬 상태

```ts
const [showGenerateModal, setShowGenerateModal] = useState(false);
const [generateName,     setGenerateName]     = useState("");
const [generateSlug,     setGenerateSlug]     = useState("");
const [generateFileName, setGenerateFileName] = useState("page");
const [isGenerating,     setIsGenerating]     = useState(false);
```

### 6.3 `handleGenerateOpen` — 모달 열기

List/Grid-Layout과 동일 패턴이다.

1. `validateBeforeSave()` 로 먼저 검증한다. **실패하면 모달을 열지 않는다.**
   (저장이 안 되는 구성은 코드 생성도 안 된다. 검증을 따로 만들지 말고 기존 것을 그대로 쓴다.)
2. 기본값 채우기 — `generateName ← tm.saveModalName`, `generateSlug ← tm.saveModalSlug`, `generateFileName ← "page"`
3. `setShowGenerateModal(true)`

### 6.4 `handleGenerateConfirm` — 생성 실행

List/Grid-Layout의 `handleGenerateConfirm`과 **같은 3단 구조**를 따르되, 입력 데이터만 위젯 구조로 바꾼다.

```
0) 3개 입력값 공백 검사 → 미입력이면 return
1) 저장과 동일한 전처리를 거친 위젯 데이터 준비
     stampConnectedSlug(widgetItems, om.mainConnectedSlug)
     → normalizeFormItemRowSpans(...)
   ⚠️ handleSaveConfirm과 완전히 동일한 전처리여야 한다.
      전처리가 갈라지면 "저장한 화면"과 "빌드된 코드"의 레이아웃이 달라진다.
2) configJson 생성 — 저장 시와 동일한 형태(widgetItems + 출력설정)
3) buildWidgetTsxFile(items, { pageTitle, mainConnectedSlug, componentName })
     → { tsxCode, unsupported }
4) POST /page-templates/generate  { slug, fileName, tsxCode, templateType: "PAGE" }
5) POST /tsx-generation           { name, folderName, fileName: fileName + ".tsx",
                                    templateType: "PAGE", configJson, tsxCode }
6) 결과 안내
     - 성공 토스트: `TSX 파일 생성 완료! → ${fileRes.data.pageUrl}`
     - unsupported.length > 0 이면 경고 토스트 추가 (미지원 위젯 타입 안내)
7) finally: setIsGenerating(false)
   실패: getApiErrorMessage(err, "TSX 파일 생성 중 오류가 발생했습니다.")
```

**`templateType` 은 `"PAGE"`** 다. `useTemplateManagement("PAGE")` 와 값을 맞춘다.
BE는 이 값을 enum으로 제한하지 않고, `LAYER` 가 아니면 `page.tsx` 를 기본 파일명으로 쓰므로
**`PAGE` 를 넣기 위해 BE를 고칠 필요는 없다** (be_tsx-generation.md §12.2 참고).

### 6.5 모달 렌더링

기존 `SaveModal` 옆에 그대로 붙인다. `GenerateModal` 은 수정하지 않는다.

```tsx
<GenerateModal
  show={showGenerateModal}
  onClose={() => setShowGenerateModal(false)}
  name={generateName}          onNameChange={setGenerateName}
  slug={generateSlug}          onSlugChange={setGenerateSlug}
  fileName={generateFileName}  onFileNameChange={setGenerateFileName}
  isGenerating={isGenerating}
  onConfirm={handleGenerateConfirm}
/>
```

`import` 문에 `GenerateModal` 을 추가한다:
`import { SaveModal, RuleCreateModal, GenerateModal } from "../_shared/components/TemplateModals";`

### 6.6 버튼 배치

기존 `[저장]` 버튼 옆에 `[파일빌드]` 버튼을 추가한다.
버튼 스타일은 새로 만들지 말고 List/Grid-Layout의 생성 버튼과 동일한 공통 스타일을 따른다.

---

## 7. 저장 경로 — 왜 `generated` 인가

| 디렉토리 | 목적 | 성격 |
|:---|:---|:---|
| `bo/src/app/admin/generated/{slug}/` | **파일빌드 산출물.** 개발자가 가져가 수정하는 tsx 소스 | 정적 파일 |
| `bo/src/app/admin/widgetSub/[slug]/` | **런타임 위젯 렌더링.** DB `configJson`을 읽어 그때그때 그림 | 동적 라우트 |

`widgetSub/[slug]/page.tsx` 는 사람이 작성해 유지 중인 운영 라우트다.
여기에 생성 파일을 쓰면 **운영 중인 빌더 화면과 인계용 산출물이 같은 폴더에 섞인다.**
그래서 파일빌드는 `generated` 로 완전히 분리하고, **`widgetSub` 쪽 코드는 일절 수정하지 않는다.**

경로는 이미 정합하다 — BE의 `page-template.output-dir` 설정이 전 프로파일에서
`../bo/src/app/admin/generated` 이고, `GenerateModal` 의 경로 미리보기도 `generated/` 로 표기돼 있다.
다만 `/page-templates/generate` 응답의 `pageUrl` 문자열만 `widgetSub` 로 남아 있어
**성공 토스트에 잘못된 경로가 뜬다.** 이 한 줄은 BE에서 고친다 (be_tsx-generation.md §12.3).

> `bo/src/app/admin/generated/` 디렉토리는 아직 존재하지 않는다.
> BE가 `Files.createDirectories`로 자동 생성하므로 미리 만들 필요는 없다.

---

## 8. Phase 구분 요약

| | Phase 1 (이번) | Phase 2 (후속) |
|:---|:---|:---|
| 위젯 타입 | `search`, `table`, `space` | `form`, `category`, `sublist`, `multiselect`, `tab` |
| 신규 파일 | `widgetGenerator.ts` + `widget/{search,table,space}Block.ts` | `widget/{form,category,sublist,multiselect,tab}Block.ts` |
| 조립 로직 | 신규 작성 | **수정 없음** |
| dispatch map | 3종 등록 | 5줄 추가 |
| `widget/page.tsx` | 버튼·모달·핸들러 추가 | **수정 없음** |
| BE | `pageUrl` 문자열 1줄 수정 | 수정 없음 |

**Phase 2 담당자를 위한 확장 절차**

1. `_shared/generators/widget/{타입}Block.ts` 에 `generate{타입}Block: WidgetBlockGenerator` 를 작성한다.
2. `WidgetCodeBlock` 의 5개 부위(`imports` / `helperLines` / `stateLines` / `handlerLines` / `jsxLines`)에
   맞춰 조각을 채운다. **완성된 파일 문자열을 반환하면 안 된다.**
3. `widgetGenerator.ts` 의 `WIDGET_BLOCK_GENERATORS` 에 한 줄 등록한다.
4. 다른 위젯을 참조해야 하면 `ctx.allWidgets` / `ctx.suffixOf()` 를 쓴다.
   블록끼리 직접 import 하지 말 것 (순환 참조가 생긴다).

---

## 9. FE 개발 체크리스트

### 9.1 생성기

- [ ] `widgetGenerator.ts` 가 `listGenerator.ts` 를 수정하지 않고 신규 파일로 추가되었는가?
- [ ] 블록 생성 함수가 타입별 **개별 파일**로 분리되었는가?
- [ ] dispatch map이 `Partial<Record<PageWidgetType, ...>>` 로 선언되었는가?
- [ ] 미지원 타입이 무시되지 않고 플레이스홀더 + `unsupported` 반환으로 처리되는가?
- [ ] `imports` 가 모듈 단위로 병합·중복 제거되는가?
- [ ] 위젯이 2개 이상일 때 state/handler 변수명이 충돌하지 않는가? (suffix 검증)
- [ ] 생성 코드에 Tailwind 동적 클래스(`col-span-${n}` 등)가 없는가?
- [ ] 그리드가 `GridCell` + 인라인 `style` 로 복원되는가?
- [ ] 표시 텍스트가 **msgKey 우선 → 평문 폴백** 순서로 생성되는가? (§5.0.2 — 헤더/라벨/버튼라벨/badge·boolean 텍스트 전부)
- [ ] 옵션 텍스트가 항상 `t()` 를 통과하고, 옵션 **값** 은 번역되지 않았는가? (§5.0.4)
- [ ] `col.data` 표현식이 `evalColumnDataExpr` + `resolveEvalExprI18n` 재사용으로 생성되는가? (직접 파싱·JS 변환 금지, §5.0.5)
- [ ] `codeGroupCode` 컬럼이 `resolveCodeLabel` 로 이름 변환되어 코드 원시값이 노출되지 않는가?
- [ ] 셀 값 계산이 cellType 분기 **앞에서 한 번** 이뤄지는가? (§5.2)
- [ ] 정렬 요청이 `row._pathMap` 으로 실제 경로로 변환되는가?
- [ ] `col.data` 컬럼 정렬 시 `sortExpr` 이 함께 전송되고, entity 페이지에서는 전송되지 않는가? (§5.2)
- [ ] 동일 로직을 재구현하지 않고 `_shared/utils.ts` 의 기존 순수 함수를 import 했는가? (§5.0.6)

**분기 필드 / 컨테이너 파리티 (§4.7.1 · §5.0.7 — 3회 반복된 사고 계열)**

- [ ] 블록마다 **렌더러 대조표**(props / 분기 필드 / 표시 텍스트 전수)를 작성했고, 모든 항목이 지원·TODO·해당없음 중 하나로 채워졌는가? (빈칸 금지)
- [ ] 생성기가 `HANDLED_KEYS` / `IGNORED_KEYS` 로 미처리 config 키를 감지해 `unhandled` + TODO + 경고 토스트로 노출하는가?
- [ ] `SearchWidget.displayStyle === 'simple'` 이 전용 마크업으로 생성되는가? (라벨 없음 / 한 줄 인라인 / 버튼 우측, §5.1.1)
- [ ] simple에서 `rows[1]` 이후를 그리지 않고 TODO로 알리는가?
- [ ] 위젯 컨테이너가 `emitContainerOpen` 단일 방출기로 생성되고, §4.7.1 표와 클래스·순서·`overflow` 값이 일치하는가?
- [ ] 그리드 컨텐츠 칸 `<div>` 에 `overflow` 를 **넣지 않았는가?** (Space의 의도적 넘침이 잘리면 안 된다)
- [ ] `overflow` 값이 `clip` 인가? (`overflow-hidden` 사용 금지)
- [ ] 컨텐츠 칸 높이가 런타임과 동일한 `rowSpan * ROW_HEIGHT - GAP_SIZE` 고정인가? (가변 높이·스타일별 높이표 도입 금지)
- [ ] `hideCondition` 필드가 조회 파라미터뿐 아니라 **화면에서도** 제거되는가? (§5.1.1)
- [ ] **(v1.3)** 생성기 안에 런타임 순수 함수와 같은 일을 하는 코드가 없는가? (`buildSearchQueryParams` 손 재구현 금지, §5.0.6)
- [ ] **(v1.3)** 산출물이 `buildSearchQueryParams` 를 호출하고, 검색 필드 정의를 리터럴로 담고 있는가? (§5.1.2)
- [ ] **(v1.3)** 검색 state가 `Record<string,string>` 이고 키가 필드 `id`(읽기 좋은 값으로 치환) 기준인가?
- [ ] **(v1.3)** 생성기 안에 손으로 적은 Tailwind 클래스 문자열이 없는가? (`styles.ts` / `rendererStyles.ts` 경유, §5.0.8)
- [ ] **(v1.3)** 런타임 렌더러도 같은 상수를 소비하도록 치환됐고, 치환 전후 문자열이 동일한가?
- [ ] **(v1.3)** `IGNORED_KEYS` 전 항목에 "런타임이 읽지 않는다"는 파일:라인 근거가 붙어 있는가? (§5.0.7 규칙 4)
- [ ] **(v1.3)** 정렬이 asc→desc→해제 3단이고, 해제 시 `sort`/`sortExpr` 을 전송하지 않는가? (§5.2)
- [ ] **(v1.3)** 페이저가 런타임과 동일한 숫자 페이저인가? (간이 페이저 허용 철회, §5.2)
- [ ] 빈 검색값이 조회 파라미터에서 제외되는가? (§5.1.2 — 함수가 처리)
- [ ] placeholder / select 첫 옵션 폴백이 메시지 키인가? (한국어 리터럴 금지, §5.1.3)
- [ ] 산출물에 사용자 노출 한국어 리터럴이 0건인가? (`전체 N건` / `불러오는 중...` / `데이터가 없습니다.` / 토스트, §5.1.4)

### 9.2 화면 연결

- [ ] `[파일빌드]` 클릭 시 `validateBeforeSave()` 실패면 모달이 열리지 않는가?
- [ ] `GenerateModal` 을 수정 없이 재사용했는가?
- [ ] 생성 전처리가 `handleSaveConfirm` 과 동일한가? (`stampConnectedSlug` → `normalizeFormItemRowSpans`)
- [ ] `templateType` 으로 `"PAGE"` 를 전송하는가?
- [ ] 두 API(`/page-templates/generate`, `/tsx-generation`)가 모두 호출되는가?
- [ ] 미지원 위젯이 있을 때 사용자에게 경고가 노출되는가?

### 9.3 산출물 검증

- [ ] 파일이 `bo/src/app/admin/generated/{slug}/{fileName}.tsx` 에 생성되는가?
- [ ] 성공 토스트의 경로가 `generated` 를 가리키는가? (`widgetSub` 아님)
- [ ] 생성된 tsx가 **타입 에러 없이 컴파일**되는가?
- [ ] 생성된 화면이 빌더 미리보기와 레이아웃이 일치하는가?
- [ ] 생성된 코드가 `WidgetRenderer` / `configJson` 에 의존하지 않는가? (§1.2 최상위 제약)
- [ ] `widgetSub` 디렉토리가 수정되지 않았는가?

---

## 10. v1.3 구조 전환 실행 지침 (bo-builder 착수용)

### 10.1 전면 재작성이 아니다 — 파일별 교체 범위

| 파일 | 현재 | 조치 | 재작성 비율 |
|:---|---:|:---|---:|
| `generators/widgetGenerator.ts` | 343줄 | `emitContainerOpen` 이 `rendererStyles` 의 컨테이너 클래스 함수를 호출하도록 교체. 조립·그리드·`unhandled` 골격은 **그대로** | ~10% |
| `generators/widget/searchBlock.ts` | 568줄 | 파라미터 조립부 삭제 + 필드 리터럴 방출기 신설 + state 키/자료형 변경 + 마크업 클래스 상수화 | ~40% |
| `generators/widget/tableBlock.ts` | 437줄 | 정렬(아이콘·3단·해제)·페이저·건수바·thead·td·셀 마크업 교체. fetch/조립 골격은 유지 | ~35% |
| `generators/widget/spaceBlock.ts` | 130줄 | 컨테이너 인자 전달 + 그룹 병합·grid 배치 이식 | ~40% |
| `_shared/styles.ts` | 66줄 | 필드 단위 상수 **추가만** (기존 값 변경 금지) | 추가 |
| `_shared/components/renderer/rendererStyles.ts` | — | 신규(순수 모듈) | 신규 |
| `_shared/utils.ts` | 2889줄 | `SEARCH_QUERY_PARAM_FIELD_KEYS` / `nextSortDir` / `pageGroupRange` 추가. **기존 함수 시그니처·동작 변경 금지** | 추가 |

**블록 함수의 계약(`WidgetCodeBlock`), dispatch map, 2단 그리드 복원, `unhandled` 장치는 전부 유지된다.**
v1.2에서 만든 구조가 틀린 것이 아니라, 그 구조 안에서 **내용을 손으로 채운 것**이 문제였다.

### 10.2 런타임 렌더러 수정 — 문자열을 상수로 바꾸는 것 외에는 하지 않는다

| 파일 | 수정 지점 |
|:---|:---|
| `RendererContainer.tsx` | `:71-74` 클래스·overflow 계산을 `rendererStyles` 의 순수 함수 호출로 |
| `TableRenderer.tsx` | `:204`(건수바) `:236`(thead) `:259`(th) `:282`(정렬 버튼) `:374`(td) `:429-471`(페이저) 클래스 + `:273-278` → `nextSortDir` + `:451-454` → `pageGroupRange` |
| `TableCellRenderer.tsx` | `:41,53` `BADGE_CLS`/`BADGE_DOT` 를 `rendererStyles` 로 이동 후 import |
| `SpaceRenderer.tsx` | `:210` 그룹 래퍼 클래스 |
| `SearchRenderer.tsx` | `:141`(simple 컨테이너) `:206,212`(버튼) 클래스 |
| `FieldRenderer.tsx` | Phase 1 7종 분기의 잔여 인라인 클래스(날짜 아이콘, `~` 구분자, 옵션 라벨/체크박스)만 상수화 |

⚠️ **판정 기준: 치환 전후 렌더링 결과 문자열이 바이트 단위로 같아야 한다.**
조건부 클래스는 상수가 아니라 **같은 인자를 받는 함수**로 뽑는다(생성기는 live 인자로 호출).
이 파일들은 모든 빌더 화면이 쓰므로, 파일빌드 산출물뿐 아니라 **기존 빌더 미리보기 회귀도 1회 확인**한다.

### 10.3 착수 순서 (앞 단계가 뒤 단계를 무효화하지 않도록 이 순서를 지킨다)

1. `_shared/utils.ts` 에 `SEARCH_QUERY_PARAM_FIELD_KEYS` / `nextSortDir` / `pageGroupRange` 추가
2. `rendererStyles.ts` 신설 + `styles.ts` 상수 추가 → **런타임 렌더러가 먼저 소비하도록 치환**하고 회귀 확인
3. `searchBlock.ts` 파라미터 조립 전환 (§5.1.2) — N5 해소
4. `tableBlock.ts` / `spaceBlock.ts` / `widgetGenerator.ts` 를 상수 소비로 교체 — R3·R4·R6·R7 해소
5. 태그 구조·상호작용 개별 이식 — R1(button+중앙정렬) / R2(SortIcon 3종·3단) / R5(두 번째 `<p>`) / 페이저
6. `IGNORED_KEYS` 전 항목에 런타임 근거(파일:라인) 부여, 근거 없는 항목은 `HANDLED` 또는 unhandled로 (§5.0.7 규칙 4)
7. I5(`spaceBlock` `IGNORED_ITEM_KEYS` 에 `fieldKey`) / I3(생성 코드 `useCallback` 또는 disable 주석)

2번을 3~5번보다 **먼저** 하지 않으면 생성기가 아직 없는 상수를 참조하게 된다.

### 10.4 잔여 이슈가 구조 전환으로 해소되는지 여부

| 이슈 | 구조 전환만으로 해소? | 근거 |
|:---|:---:|:---|
| **N5** select+`data` → `condexpr_`/`condval_` | ✅ 자동 | `buildSearchQueryParams` 직접 호출 시 6개 분기 전부 따라온다 |
| (미발견) checkbox 배열 직렬화 | ✅ 자동 | state 자료형이 런타임과 같아진다 |
| (미발견) dateRange state 키 불일치 | ✅ 자동 | 출력 파라미터명을 함수가 계산 |
| **R7** input/select 텍스트 색 | ✅ 자동 | `inputCls`/`selectCls` 인라인 |
| **R4** td 클래스 | ✅ 자동 | 상수 공유 |
| **R6** thead sticky | ✅ 자동 | 상수 공유 |
| **R3** space 래퍼 | ⚠️ 부분 | `min-w-0`/`h-full` 은 상수로 해소. **그룹 병합·grid 배치·`fillHeight` 전달은 개별 이식** |
| **R1** 정렬 헤더 정렬 | ⚠️ 부분 | 클래스는 자동, **`span`→`button` 태그 교체는 개별** |
| **R2** 정렬 아이콘·순환 | ❌ 개별 | 아이콘 3종 이식 + `nextSortDir` 공유 + `sortDir` 타입에 `null` 추가 |
| **R5** 건수바 두 번째 `<p>` | ⚠️ 부분 | 클래스는 자동, **노드 추가는 개별** |
| **I2** 페이저 | ❌ 개별 | v1.2 예외를 철회하고 런타임과 동일하게 교체 (§5.2) |
| **I5 / I3** | ❌ 개별 | 구조와 무관 |

즉 **Critical 계열은 전부 자동 해소, Warning/Info는 절반이 자동 해소되고 나머지는 태그 구조 이식**이다.

### 10.5 다음 라운드 QA 판정 기준 변경

3라운드까지는 "런타임과 다른 곳을 찾는" 방식이었고, 그래서 매번 새 항목이 나왔다.
v1.3 이후에는 **구조 위반을 먼저 본다.**

- 생성기 안에 런타임 순수 함수와 같은 일을 하는 코드가 있으면 → 결과가 맞아도 **critical** (다음 라운드에 갈라진다)
- 생성기 안에 손으로 적은 Tailwind 클래스 문자열이 있으면 → **critical** (`styles.ts`/`rendererStyles.ts` 경유해야 함)
- `IGNORED_KEYS` 항목에 파일:라인 근거가 없으면 → **critical**
- 그 다음에 화면 실측(클래스 체인·쿼리스트링 diff)을 본다

**미도입 결정 — DOM diff 자동화 회귀 테스트**
QA가 요청한 "런타임 DOM vs 산출물 DOM 자동 diff" 는 이번 라운드에 도입하지 않는다.
산출물은 파일로 떨어진 뒤 Next 라우트로 렌더돼야 비교가 가능해 테스트 하네스 비용이 크고,
현재 BO에 프런트 테스트 러너가 없다. 대신 위 4개 게이트로 **원인 단계에서** 막는다.
Phase 2에서 위젯 5종이 추가될 때 재검토한다.
