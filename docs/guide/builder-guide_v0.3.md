# Builder 시스템 완전 가이드 v0.3

> 마지막 업데이트: 2026-04-28
> 문서 버전: v0.3 — 카테고리 위젯, 위젯 빌더, 공통 렌더링 체계 반영

---

## 목차

1. [왜 이 시스템이 필요한가](#1-왜-이-시스템이-필요한가)
2. [전체 구조 한눈에 보기](#2-전체-구조-한눈에-보기)
3. [빌더 종류와 역할](#3-빌더-종류와-역할)
4. [위젯 타입 카탈로그](#4-위젯-타입-카탈로그)
5. [그리드 레이아웃 시스템](#5-그리드-레이아웃-시스템)
6. [미리보기 = 실제 화면 (WYSIWYG 원칙)](#6-미리보기--실제-화면-wysiwyg-원칙)
7. [운영자 실전 가이드 (관리자방식)](#7-운영자-실전-가이드-관리자방식)
8. [개발자 실전 가이드 (개발자방식)](#8-개발자-실전-가이드-개발자방식)
9. [공통 컴포넌트 아키텍처](#9-공통-컴포넌트-아키텍처)
10. [꼭 지켜야 할 규칙](#10-꼭-지켜야-할-규칙)
11. [API 레퍼런스](#11-api-레퍼런스)
12. [주요 파일 위치](#12-주요-파일-위치)

---

## 1. 왜 이 시스템이 필요한가

### 기존 방식의 문제

관리자 화면이 필요할 때마다 개발자가 처음부터 코드를 짜면:

- 비슷한 코드가 파일마다 조금씩 다르게 복사됨
- 버그 수정·디자인 변경 시 모든 파일을 일일이 찾아 고쳐야 함
- 개발자 없이는 화면 변경이 불가능
- 빌더에서 보이는 미리보기와 실제 화면이 다를 수 있음

### 이 시스템의 해결책

| 기존 문제 | 이 시스템의 해결 |
|---|---|
| 화면마다 코드 파편화 | 공통 컴포넌트 1개가 모든 화면 담당 |
| 버그 수정 → 모든 파일 수정 | 공통 컴포넌트 1개만 고치면 전체 반영 |
| 개발자 없이 화면 변경 불가 | 운영자가 빌더 UI에서 직접 설정·저장 |
| 미리보기 ≠ 실제 화면 | 빌더와 실제 화면이 **동일한 렌더러** 공유 → 완전 일치 |

### 핵심 설계 원칙 (절대 어기지 말 것)

**원칙 1. 단일 공통 컴포넌트 파이프라인**
> 어떤 빌더를 통해 만들든, 최종 렌더링은 반드시 동일한 공통 렌더러를 통해야 한다.

**원칙 2. 인라인 스타일 땜질 금지**
> 특정 페이지 파일에서 `style={{ paddingTop: '4px' }}` 를 추가하여 레이아웃을 맞추는 것은 절대 금지.
> 레이아웃이 틀어진다면 **공통 컴포넌트의 설계 결함**이므로 공통 컴포넌트를 개선해야 한다.

**원칙 3. 미리보기 = 실제 화면 (WYSIWYG)**
> 빌더 미리보기와 실제 운영 화면은 픽셀 단위로 동일해야 한다.
> 이를 위해 빌더 미리보기와 실제 출력 페이지가 **동일한 렌더러 컴포넌트**를 공유한다.

---

## 2. 전체 구조 한눈에 보기

```
┌─────────────────────────────────────────────────────┐
│                   빌더 (Builder)                      │
│                                                       │
│  quick-list    ─────┐                                │
│  quick-detail  ─────┤  설정 → configJson → DB 저장   │
│  widget        ─────┘                                │
└────────────────────────────┬────────────────────────┘
                             │ slug로 연결
┌────────────────────────────▼────────────────────────┐
│                  출력 페이지 (Page)                   │
│                                                       │
│  /admin/generated/[slug]                             │
│    → DB에서 configJson 로드                           │
│    → PageGridRenderer (격자 배치)                    │
│    → WidgetRenderer (위젯 타입별 분기)               │
│    → 각 Renderer (SearchRenderer 등)                 │
└─────────────────────────────────────────────────────┘
```

### 3계층 컴포넌트 구조

```
1. Layout (레이아웃)
   PageLayout — 12칸 그리드 캔버스 제공
   PageGridRenderer — 위젯 셀 배치 (outer + inner 격자)
   RendererContainer — 개별 위젯 공통 컨테이너 (테두리·배경색)

2. Content (컨텐츠)
   WidgetRenderer — 위젯 타입별 렌더러 분기 허브
   SearchRenderer — 검색폼
   TableRenderer — 데이터 테이블
   FormRenderer — 입력 폼
   SpaceRenderer — 버튼·텍스트 자유 배치
   CategoryRenderer — 계층형 카테고리 목록

3. Field (필드)
   FieldRenderer — 폼·검색 내부의 개별 입력 요소
   TableCellRenderer — 테이블 셀 개별 렌더링
```

---

## 3. 빌더 종류와 역할

### 3.1 Quick-List 빌더

**경로:** `/admin/templates/make/quick-list`
**목적:** 검색폼 + 데이터 테이블로 구성된 목록 화면 제작

```
┌──────────────────────────────────┐
│  [검색폼]                        │
│  키워드 [    ]  상태 [▼]  [검색] │
├──────────────────────────────────┤
│  [버튼 영역]              [등록] │
├──────────────────────────────────┤
│  [테이블]                        │
│  No │ 제목 │ 상태 │ 등록일 │ 관리│
│  1  │ ...  │ 활성 │ ...   │ 수정│
└──────────────────────────────────┘
```

설정 탭:
- **검색 탭**: 검색 필드 추가 (input/select/date/radio 등)
- **테이블 탭**: 컬럼 추가·정렬·표시 방식 설정
- **버튼 탭**: 목록 상단 버튼 추가 (등록·엑셀 다운로드 등)

---

### 3.2 Quick-Detail 빌더

**경로:** `/admin/templates/make/quick-detail`
**목적:** 데이터 입력·수정·상세 폼 화면 제작 (레이어 팝업 포함)

```
┌──────────────────────────────────┐
│  [폼]                            │
│  이름  [              ]          │
│  이메일 [             ]          │
│  부서  [▼]  직급 [▼]            │
├──────────────────────────────────┤
│  [버튼 영역]    [취소] [삭제] [저장]│
└──────────────────────────────────┘
```

설정 탭:
- **상세페이지 탭**: 폼 필드 구성 (일반 페이지용)
- **LayerPopup 탭**: 레이어 팝업용 폼 + 팝업 크기·위치 설정

---

### 3.3 Widget 빌더

**경로:** `/admin/templates/make/widget`
**목적:** 검색폼·테이블·폼·공간·카테고리를 자유롭게 조합한 페이지 제작

```
좌측: 설정 패널          우측: 미리보기
┌─────────────┐          ┌───────────────────────────┐
│ 위젯 1      │          │ col 6     │ col 6          │
│  col 12 row 8│         │ [카테고리]│ [폼]           │
│  ┌카테고리  │          │           │                │
│  │ col 3    │          │           │                │
│  └          │          │           │                │
│  + 컨텐츠  │           └───────────────────────────┘
│             │
│ + 위젯 추가│
└─────────────┘
```

**핵심 개념:**
- **위젯 셀 (Outer)**: 12칸 그리드에서 공간을 차지하는 큰 컨테이너 (colSpan 1~12, rowSpan 단위: 80px)
- **컨텐츠 (Inner)**: 위젯 셀 안에 배치되는 실제 기능 요소 (검색·테이블·폼·공간·카테고리)

하나의 위젯 셀 안에 여러 컨텐츠를 조합할 수 있습니다.

---

## 4. 위젯 타입 카탈로그

### 4.1 검색폼 (Search)

검색 조건을 입력하는 폼입니다.

| 표시 방식 | 설명 |
|---|---|
| `standard` | CSS Grid 형태 (일반 검색폼 — 여러 행) |
| `simple` | 인라인 Flex 형태 (한 줄 검색바) |

지원 필드 타입:

| 타입 | 형태 | 사용 예 |
|---|---|---|
| `input` | 텍스트 입력 | 검색어, 이름 |
| `select` | 드롭다운 | 상태, 분류 |
| `date` | 날짜 선택 | 등록일 |
| `dateRange` | 기간 선택 | 조회기간 (Key 영문 필수) |
| `radio` | 라디오 버튼 | 공개여부 |
| `checkbox` | 체크박스 | 카테고리 복수선택 |
| `button` | 버튼 선택 | 오늘/1주/1개월 |

---

### 4.2 테이블 (Table)

데이터 목록을 표시하는 테이블입니다.

| 표시 방식 | 설명 |
|---|---|
| `pagination` | 페이지 번호 방식 (1, 2, 3 ... 페이지) |
| `scroll` | 무한 스크롤 (스크롤 내리면 자동 로드) |

컬럼 셀 타입:

| 타입 | 표시 형태 | 주요 옵션 |
|---|---|---|
| `text` | 일반 텍스트 | `isNumber`: 숫자 3자리 콤마, 공통코드 연동 |
| `badge` | 색상 배지 | `badgeShape`: round/square, `showIcon`: 도트 표시 |
| `boolean` | 참/거짓 텍스트 | `trueText`/`falseText` 커스텀 |
| `file` | 첨부파일 수 | 클릭 시 파일 뷰어 팝업 |
| `actions` | 액션 버튼 그룹 | edit/detail/delete 프리셋 + 커스텀 버튼 |

---

### 4.3 폼 (Form)

데이터 입력·수정 폼입니다.

| 필드 타입 | 표시 형태 | 사용 예 |
|---|---|---|
| `input` | 텍스트 입력 | 이름, 이메일 |
| `select` | 드롭다운 | 부서, 권한 |
| `date` | 날짜 선택 | 입사일 |
| `dateRange` | 기간 선택 | 계약기간 |
| `radio` | 라디오 버튼 | 고용형태 |
| `checkbox` | 체크박스 | 담당업무 |
| `button` | 버튼 선택 | 상태 선택 |
| `textarea` | 여러 줄 텍스트 | 소개, 메모 |
| `file` | 파일 첨부 | 첨부파일 |
| `image` | 이미지 첨부 | 프로필 사진 |
| `video` | 동영상 | URL 또는 파일 업로드 |
| `action-button` | 액션 버튼 | 저장, 삭제, 팝업 열기 |

설정 옵션:
- **연결 Slug**: 폼 데이터를 저장·조회할 `page_data` 슬러그
- **타이틀**: 폼 상단에 표시되는 제목
- **테두리 표시**: 폼 영역 테두리 on/off
- **바탕색**: 폼 배경색 설정

---

### 4.4 공간 (Space)

버튼·텍스트를 자유롭게 배치하는 영역입니다.

| 아이템 타입 | 설명 |
|---|---|
| `textarea` | 안내 텍스트 표시 |
| `action-button` | 액션 버튼 (저장·삭제·닫기·팝업 열기·경로 이동) |

버튼 연결 방식 (`connType`):

| 연결 방식 | 동작 |
|---|---|
| `form` | 연결된 폼 위젯의 저장·삭제 실행 |
| `popup` | 레이어 팝업 열기 |
| `path` | 다른 경로로 이동 |
| `close` | 팝업 닫기 |

정렬 설정: 좌측 / 가운데 / 우측

---

### 4.5 카테고리 (Category)

계층형 카테고리 목록을 표시·관리하는 위젯입니다.

```
┌─ 대분류 ────┐ ┌─ 중분류 ────┐ ┌─ 소분류 ────┐
│ A-001 항목A  │ │ B-001 하위1  │ │ C-001 세부1  │
│ A-002 항목B ●│→│ B-002 하위2  │ │ C-002 세부2  │
│ A-003 항목C  │ │              │ │              │
└─────────────┘ └─────────────┘ └─────────────┘
```

**depth 구조:**
- depth 1 (대분류): **연결 Slug** 설정 (page_data 슬러그)
- depth 2+ (중분류, 소분류 ...): **상위 카테고리 위젯 연결** 설정 (선택 시 자동 필터링)

**설정 항목:**

| 항목 | 설명 |
|---|---|
| Key | 위젯 식별자 (영문 필수) |
| 연결 Slug (depth 1만) | 카테고리 데이터를 저장할 page_data 슬러그 |
| 상위 카테고리 위젯 (depth 2+) | 상위 depth 위젯 선택 → 상위 선택값 기준 자동 필터 |
| Depth (계층) | 1=대분류, 2=중분류, 3=소분류, 4=세분류 |
| 레이블 | 위젯 헤더에 표시되는 이름 (예: 대분류) |
| CRUD 허용 | 등록·수정·삭제 버튼 노출 여부 |

**동작 방식:**
- 항목 클릭 시 해당 항목 선택 (강조 표시)
- 선택된 항목 ID가 연결된 하위 depth 위젯으로 자동 전달
- live 모드에서 항목 hover 시 수정(✏️)·삭제(🗑️) 버튼 표시

---

## 5. 그리드 레이아웃 시스템

### 5.1 기본 단위

모든 화면은 **12칸 × 80px** 그리드를 기준으로 구성됩니다.

```
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐  ← 12칸 (가로)
│  │  │  │  │  │  │  │  │  │  │  │  │  ← 80px (세로 1행)
├──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┤
│                                    │  ← 80px (세로 2행)
└────────────────────────────────────┘
```

| 속성 | 설명 | 단위 |
|---|---|---|
| `colSpan` | 가로 칸 수 | 1~12 |
| `rowSpan` | 세로 행 수 | 1행 = 80px |

### 5.2 위젯 셀 + 컨텐츠 구조 (Widget 빌더)

Widget 빌더는 **2단계 중첩 그리드**를 사용합니다.

```
PageLayout (12칸 외부 그리드)
  └── 위젯 셀 (Outer Cell, colSpan/rowSpan으로 공간 차지)
        └── 컨텐츠 그리드 (Inner Grid, 위젯 셀 colSpan 기준)
              ├── 컨텐츠 A (colSpan, rowSpan 지정)
              └── 컨텐츠 B (colSpan, rowSpan 지정)
```

**예시:** 위젯 셀이 col 12를 차지하고, 내부에 카테고리(col 3)와 폼(col 9)을 배치

```
┌────────────────────────────────────────┐  ← 위젯 셀 (col 12)
│ ┌──────┐ ┌──────────────────────────┐ │
│ │카테  │ │         폼               │ │
│ │고리  │ │  이름 [        ]         │ │
│ │(col3)│ │  이메일[        ]        │ │
│ └──────┘ └──────────────────────────┘ │
│           (col 9)                      │
└────────────────────────────────────────┘
```

### 5.3 크기 조절

빌더에서 각 위젯/컨텐츠의 크기를 직접 숫자로 입력합니다.

```
크기  Col [ 6 ] / 12    Row [ 3 ]
         ↑ 가로 칸 수        ↑ 세로 행 수 (× 80px)
```

- Col 6 = 전체 너비의 절반
- Row 3 = 80px × 3 = 240px 높이

---

## 6. 미리보기 = 실제 화면 (WYSIWYG 원칙)

### 핵심 구조

빌더의 미리보기와 실제 운영 페이지는 **완전히 동일한 렌더러 컴포넌트**를 사용합니다.

```
[빌더 미리보기]              [실제 운영 페이지]
PageLayout (mode=preview)    PageLayout (mode=live)
  PageGridRenderer             PageGridRenderer
    WidgetRenderer               WidgetRenderer
      FormRenderer                 FormRenderer   ← 동일한 컴포넌트!
```

- `mode="preview"` : 샘플 데이터 표시, 입력 비활성 (빌더 미리보기)
- `mode="live"` : 실제 API 데이터, 인터랙티브 입력 (운영 화면)

**→ 미리보기에서 보이는 것이 저장 후 실제 화면에서 보이는 것과 완전히 동일합니다.**

### 렌더링 흐름

```
사용자가 메뉴 클릭
  ↓
/admin/generated/[slug]/page.tsx
  ↓
GET /api/v1/page-templates/by-slug/{slug}
  ↓
configJson 파싱 → widgetItems 배열 추출
  ↓
PageGridRenderer (외부 12칸 그리드 + 내부 서브 그리드)
  ↓
WidgetRenderer (위젯 타입별 분기)
  ├── type=search   → SearchRenderer → FieldRenderer
  ├── type=table    → TableRenderer  → TableCellRenderer
  ├── type=form     → FormRenderer   → FieldRenderer
  ├── type=space    → SpaceRenderer  → FieldRenderer
  └── type=category → CategoryRenderer
```

---

## 7. 운영자 실전 가이드 (관리자방식)

> 코드 없이 빌더 UI만으로 화면을 만들고 즉시 반영하는 방법입니다.

### 권장 제작 순서

> **Layer(팝업) 먼저, List(목록) 나중에** 만드세요.
> Layer에서 필드 Key를 먼저 확정해야 List 컬럼 Key와 일치시킬 수 있습니다.

```
STEP 1 → Layer Builder (등록/수정 팝업)
STEP 2 → Layer Builder (상세 팝업, 필요 시)
STEP 3 → List Builder (목록 화면)
STEP 4 → 메뉴 연결
```

---

### STEP 1 — Layer Builder (등록/수정 팝업)

**경로:** `/admin/templates/make/quick-detail` → **LayerPopup 탭**

#### 팝업 기본 설정

| 설정 | 선택지 |
|---|---|
| 팝업 유형 | 중앙 팝업 / 우측 드로어 |
| 너비 | Small(sm) / Medium(md) / Large(lg) / X-Large(xl) |
| 제목 | 팝업 상단 타이틀 텍스트 |

#### 폼 필드 추가

```
[+ 행 추가] 클릭
  → 행 컬럼 수 선택 (1~5칸)
    → [+ 필드 추가] 클릭
      → 필드 타입 선택
        → 설정 패널에서 세부 항목 입력
```

#### 필드 설정 항목

| 항목 | 필수 | 설명 | 예시 |
|---|---|---|---|
| 라벨 | ✅ | 필드 위 표시 텍스트 | 제목, 작성자 |
| **Key** | ✅ | **반드시 영문** — DB 저장 키 | title, author |
| ColSpan | ✅ | 가로 칸 수 (행 컬럼 수 이하) | 2 |
| 필수 여부 | - | 저장 전 빈 값 검증 | ON/OFF |
| 읽기 전용 | - | 수정 불가 (상세 팝업용) | ON/OFF |

#### 저장

```
[저장/수정] 클릭
  → 저장 모달 열림
    → Slug 선택 (slug-registry에서 등록한 slug)
    → 이름 입력
    → [저장]
```

---

### STEP 2 — Layer Builder (상세 팝업, 선택)

STEP 1과 동일한 방법으로 만들되:
- 모든 필드를 **읽기 전용** ON
- 다른 slug로 저장 (예: `board-detail`)

---

### STEP 3 — List Builder (목록 화면)

**경로:** `/admin/templates/make/quick-list`

#### 검색 탭 — 검색 필드 구성

```
[+ 행 추가] → 컬럼 수 선택 → [+ 필드 추가] → 타입 선택 → 설정
```

| 검색 방식 | 사용 타입 | 주의사항 |
|---|---|---|
| 키워드 입력 | input | - |
| 드롭다운 선택 | select | 옵션 목록 입력 |
| 날짜 단건 | date | Key 영문 필수 |
| 날짜 범위 | dateRange | Key 영문 필수 |
| 단일 선택 | radio | - |
| 복수 선택 | checkbox | - |
| 버튼 선택 | button | - |

#### 테이블 탭 — 컬럼 구성

```
[+ 컬럼 추가] → 타입 선택 → 설정
```

| 표시 내용 | 사용 타입 | 설정 포인트 |
|---|---|---|
| 일반 텍스트 | text | Key = Layer 필드 Key와 동일하게 |
| 색상 배지 | badge | cellOptions에 값·텍스트·색상 입력 |
| 공개/비공개 | boolean | trueText/falseText 커스텀 |
| 수정/삭제 버튼 | actions | 팝업 slug 연결 (STEP 1의 slug) |
| 첨부파일 수 | file | Key = Layer 파일 Key와 동일하게 |

#### Actions 컬럼 설정 예시

```
수정 버튼: ON → 팝업 slug: board       (STEP 1의 slug)
상세 버튼: ON → 팝업 slug: board-detail (STEP 2의 slug)
삭제 버튼: ON
```

#### 버튼 탭 — 목록 상단 버튼

```
[+ 버튼 추가]
  → 이름: 등록
  → 타입: primary
  → 액션: 레이어 팝업 열기
  → 팝업 slug: board (STEP 1의 slug)
```

---

### STEP 4 — 메뉴 연결

**경로:** `/admin/menus`

```
[페이지 메이커 연동] 클릭
  → 저장된 LIST 템플릿 목록에서 선택
  → URL 자동 입력: /admin/generated/{slug}
  → [저장]
  → 즉시 운영 화면에 반영
```

---

## 8. 개발자 실전 가이드 (개발자방식)

> 빌더로 초안을 생성하고 코드를 직접 수정하는 방법입니다.
> 복잡한 비즈니스 로직, 특수 UI가 필요할 때 사용합니다.

### 관리자방식 vs 개발자방식

| 항목 | 관리자방식 | 개발자방식 |
|---|---|---|
| 반영 방법 | 저장 즉시 | 코드 수정 후 빌드 |
| 커스터마이징 | 빌더 설정 범위 내 | 코드 수준 완전 자유 |
| 팝업 | DB에서 런타임 로드 | LayerPopup.tsx 직접 import |
| 대상 | 운영자, 기획자 | 개발자 |

### 파일 위치

```
bo/src/app/admin/generated/
  └── {slug}/
       ├── page.tsx         ← 목록 페이지
       └── LayerPopup.tsx   ← 레이어 팝업
```

> **Next.js 우선순위:** `generated/{slug}/page.tsx` 파일이 존재하면
> 공통 렌더러 `[slug]/page.tsx` 보다 **자동으로 우선 실행**됩니다.

### 파일 생성 방법

**방법 A — 빌더에서 [생성] 버튼**
```
빌더 → [생성] 버튼 → slug 입력
  → page.tsx 자동 생성
  → LayerPopup.tsx 자동 생성
```

**방법 B — 직접 파일 작성**
```
기존 generated/ 폴더의 파일을 반드시 먼저 참조
→ 동일한 구조·패턴으로 작성
```

### page.tsx 기본 구조

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SearchForm, SearchRow, SearchField } from '@/components/search';
import { TableRenderer } from '@/app/admin/templates/make/_shared/components/renderer/TableRenderer';
import api from '@/lib/api';
import LayerPopup from './LayerPopup';
import type { TableColumnConfig } from '@/app/admin/templates/make/_shared/types';

const SLUG = 'board'; // page-data API 식별자

// 테이블 컬럼 정의
const COLUMNS: TableColumnConfig[] = [
    {
        id: 'c-title', header: '제목', accessor: 'title',
        align: 'left', sortable: true, cellType: 'text',
    },
    {
        id: 'c-status', header: '상태', accessor: 'status',
        align: 'center', sortable: false, cellType: 'badge',
        badgeShape: 'round', showIcon: true,
        cellOptions: [
            { value: 'active',   text: '활성',   color: 'emerald' },
            { value: 'inactive', text: '비활성', color: 'red' },
        ],
    },
    {
        id: 'c-actions', header: '관리', accessor: '_id',
        align: 'center', sortable: false, cellType: 'actions',
        actions: ['edit', 'delete'],
    },
];

export default function GeneratedPage() {
    // [1] 상태 선언
    const [searchKeyword, setSearchKeyword] = useState('');
    const [data,          setData]          = useState<Record<string, unknown>[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages,    setTotalPages]    = useState(0);
    const [currentPage,   setCurrentPage]   = useState(0);
    const [layerOpen,     setLayerOpen]     = useState(false);
    const [editId,        setEditId]        = useState<number | null>(null);
    const [editData,      setEditData]      = useState<Record<string, unknown> | null>(null);

    // [2] 데이터 로직
    const fetchData = async (page: number) => {
        const params: Record<string, string | number> = { page, size: 10 };
        if (searchKeyword.trim()) params['keyword'] = searchKeyword;

        const res = await api.get(`/page-data/${SLUG}`, { params });
        const rows = (res.data.content as { id: number; dataJson: Record<string, unknown> }[])
            .map(item => ({ _id: item.id, ...item.dataJson }));
        setData(rows);
        setTotalElements(res.data.totalElements ?? 0);
        setTotalPages(res.data.totalPages ?? 0);
        setCurrentPage(page);
    };

    const handleRegister = () => { setEditId(null); setEditData(null); setLayerOpen(true); };
    const handleEdit     = (row: Record<string, unknown>) => {
        setEditId(row._id as number);
        setEditData(row);
        setLayerOpen(true);
    };
    const handleDelete = async (id: number) => {
        if (!confirm('삭제하시겠습니까?')) return;
        await api.delete(`/page-data/${SLUG}/${id}`);
        fetchData(currentPage);
    };

    useEffect(() => { fetchData(0); }, []);

    // [3] 화면 렌더링
    return (
        <>
            {/* 검색폼 */}
            <SearchForm onSearch={() => fetchData(0)} onReset={() => { setSearchKeyword(''); fetchData(0); }}>
                <SearchRow cols={4}>
                    <SearchField label="검색어">
                        <input
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            placeholder="검색어 입력"
                            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                        />
                    </SearchField>
                </SearchRow>
            </SearchForm>

            {/* 등록 버튼 */}
            <div className="flex justify-end mb-3">
                <button
                    onClick={handleRegister}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-all"
                >
                    등록
                </button>
            </div>

            {/* 테이블 — 공통 컴포넌트 사용 */}
            <TableRenderer
                mode="live"
                columns={COLUMNS}
                data={data}
                totalElements={totalElements}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={fetchData}
                handlers={{ onEdit: handleEdit, onDelete: handleDelete }}
            />

            {/* 레이어 팝업 */}
            <LayerPopup
                isOpen={layerOpen}
                onClose={() => setLayerOpen(false)}
                editId={editId}
                initialData={editData}
                onSave={async (formData) => {
                    if (editId) {
                        await api.put(`/page-data/${SLUG}/${editId}`, { dataJson: formData });
                    } else {
                        await api.post(`/page-data/${SLUG}`, { dataJson: formData });
                    }
                    setLayerOpen(false);
                    fetchData(currentPage);
                }}
            />
        </>
    );
}
```

### LayerPopup.tsx 기본 구조

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { FieldRenderer } from '@/app/admin/templates/make/_shared/components/renderer/FieldRenderer';

interface LayerPopupProps {
    isOpen:       boolean;
    onClose:      () => void;
    onSave?:      (data: Record<string, unknown>) => Promise<void>;
    editId?:      number | null;
    initialData?: Record<string, unknown> | null;
}

export default function LayerPopup({ isOpen, onClose, onSave, editId, initialData }: LayerPopupProps) {
    // [1] 필드별 상태
    const [title, setTitle] = useState('');

    // [2] 로직
    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(String(initialData.title ?? ''));
        } else if (isOpen) {
            setTitle('');
        }
    }, [isOpen, initialData]);

    const handleSave = async () => {
        if (!title.trim()) { toast.error('[필수] 제목을 입력하세요'); return; }
        await onSave?.({ title });
    };

    if (!isOpen) return null;

    // [3] 화면
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-900">
                        {editId ? '수정' : '등록'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 transition-all">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        {/* FieldRenderer 공통 컴포넌트 사용 */}
                        <FieldRenderer
                            mode="live"
                            field={{ id: 'title', type: 'input', label: '제목', colSpan: 12, required: true, placeholder: '제목을 입력하세요' }}
                            value={title}
                            onChange={setTitle}
                        />
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-100 transition-all">
                        닫기
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-all">
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### 개발자방식 메뉴 연결

개발자방식은 `page_template` DB에 저장하지 않으므로 [페이지 메이커 연동] 버튼을 사용할 수 없습니다.

```
/admin/menus → 해당 메뉴 클릭
  → URL 입력란에 직접 입력: /admin/generated/board
  → [저장]
```

---

## 9. 공통 컴포넌트 아키텍처

### 9.1 PageLayout

모든 빌더·렌더러가 공유하는 **12칸 그리드 캔버스**입니다.

```tsx
// 빌더 미리보기 (격자선 기본 표시)
<PageLayout mode="preview">
  ...
</PageLayout>

// 실제 운영 페이지 (격자선 기본 숨김)
<PageLayout mode="live" title="게시판">
  ...
</PageLayout>
```

- `G` 키로 격자 가이드라인 on/off 토글 (preview/live 모두 동작)

---

### 9.2 PageGridRenderer

`widgetItems` 배열을 받아 외부 GridCell + 내부 서브 그리드로 렌더링합니다.

```tsx
<PageGridRenderer
    mode="preview"                     // preview | live
    widgetItems={widgetItems}          // 위젯 셀 배열
    onItemClick={(id) => setEditing(id)} // 빌더 전용: 위젯 선택 클릭
    selectedItemId={editingItemId}     // 빌더 전용: 선택 상태 표시
/>
```

빌더 미리보기와 실제 운영 페이지 모두 이 컴포넌트 하나로 처리합니다.

---

### 9.3 WidgetRenderer

모든 위젯 타입의 **분기 허브**입니다.

```tsx
<WidgetRenderer
    mode="live"
    widget={widget}               // AnyWidget (type 필드로 분기)
    contentColSpan={colSpan}      // 그리드 열 수
    // 검색
    searchValues={searchValues}
    onSearch={() => handleSearch(widgetId)}
    onReset={() => handleReset(widgetId)}
    // 폼
    formValues={formValuesMap[widgetId]}
    onFormValuesChange={(fieldId, value) => updateFormValue(widgetId, fieldId, value)}
    onFormAction={(connectedId, action) => handleFormAction(connectedId, action)}
    // 테이블
    tableData={tableDataMap[widgetId]?.rows}
    tableLoading={tableDataMap[widgetId]?.loading}
    onPageChange={(page) => handlePageChange(widgetId, page)}
/>
```

---

### 9.4 RendererContainer

모든 렌더러의 **공통 최상위 컨테이너**입니다.

```tsx
// 기본 (테두리 + 배경색)
<RendererContainer showBorder bgColor="#f8f9fa">
    {children}
</RendererContainer>

// CSS Grid 배치 (폼/공간)
<RendererContainer showBorder contentColSpan={12}>
    <div style={{ gridColumn: 'span 6', gridRow: 'span 1' }}>...</div>
</RendererContainer>
```

| Prop | 기본값 | 설명 |
|---|---|---|
| `showBorder` | `true` | 테두리 표시 여부 |
| `bgColor` | 없음(투명) | 배경색 CSS 값 (`'none'` 또는 hex) |
| `contentColSpan` | 없음 | CSS Grid 열 수 (Form/Space용) |
| `className` | `''` | 추가 Tailwind 클래스 |

**구현 방식:**
- 테두리: `border border-slate-200` (Tailwind 클래스)
- overflow: `overflow-hidden` → 자식 배경에 의한 테두리 가림 방지

---

### 9.5 CommonBuilderDispatcher

빌더에서 위젯 타입에 따라 적절한 Builder 컴포넌트를 렌더링하는 **분기 허브**입니다.

```tsx
<CommonBuilderDispatcher
    widget={content.widget}
    onChange={w => updateContent(itemId, contentId, w)}
    context={{
        slugOptions,        // PAGE_DATA slug 목록
        pageTemplates,      // 레이어 팝업 템플릿 목록
        searchWidgets,      // 현재 페이지의 Search 위젯 목록
        formWidgets,        // 현재 페이지의 Form 위젯 목록
        categoryWidgets,    // 현재 페이지의 Category 위젯 목록
        maxColSpan,         // 필드 colSpan 최대값
    }}
/>
```

위젯 타입 → 빌더 매핑:

| type | 렌더링되는 빌더 |
|---|---|
| `search` | SearchWidgetBuilder |
| `table` | TableBuilder |
| `form` | FormBuilder |
| `space` | SpaceBuilder |
| `category` | CategoryBuilder |

---

## 10. 꼭 지켜야 할 규칙

### 규칙 1 — Key는 반드시 영문

```
✅ title / regDate / user_name / attachFile
❌ 제목 / 등록일 / 파일첨부
```

한글 Key를 사용하면:
- 데이터는 저장되지만 목록에 표시되지 않음
- DateRange 검색이 동작하지 않음
- API 파라미터로 전송 불가

---

### 규칙 2 — Layer Key = List Key (반드시 동일)

```
Layer 폼 필드 Key: title      →  List 테이블 컬럼 Key: title  ✅
Layer 파일 필드 Key: attach   →  List 파일 컬럼 Key:  attach  ✅

Layer Key: reg_date           →  List Key: regDate            ❌ 불일치!
```

불일치 시 발생하는 문제:
- 목록 컬럼이 비어 있음
- 파일 개수가 0으로 표시
- 수정 팝업에 기존 값이 채워지지 않음

---

### 규칙 3 — Layer 먼저, List 나중에 저장

```
❌ List 저장 → Layer 저장   (팝업 slug를 찾을 수 없어 팝업이 열리지 않음)
✅ Layer 저장 → List 저장
```

---

### 규칙 4 — Slug 형식

```
✅ board / notice-list / faq / product-category
❌ 게시판 / board 1 (공백 포함) / Board (대문자)
```

Layer slug와 List slug는 **동일하게** 맞춰야 팝업이 올바르게 연결됩니다.

---

### 규칙 5 — 인라인 스타일 땜질 금지

레이아웃이 틀어졌을 때:

```
❌ 해당 page.tsx에 style={{ paddingTop: '4px' }} 추가
✅ 공통 Renderer 컴포넌트의 설계 결함으로 판단 → Renderer 수정
```

특정 페이지에서만 문제가 생긴다면, 그것은 공통 컴포넌트가 그 상황을 처리하지 못하는 **설계 결함**입니다. 공통 컴포넌트를 개선해야 합니다.

---

### 규칙 6 — 신규 파일 생성 전 기존 파일 참조 의무

```
❌ 기존 파일 확인 없이 독자적으로 새 파일 작성
✅ 동일 디렉토리의 기존 파일을 먼저 읽고 → 구조·스타일·패턴 파악 → 동일하게 적용
```

---

## 11. API 레퍼런스

### 공통(JSON) 데이터 API — `page_data`

별도 테이블·Controller·Repository 개발 없이 slug 등록만으로 즉시 사용 가능합니다.

| 목적 | 메서드 | URL |
|---|---|---|
| 목록 조회 | GET | `/api/v1/page-data/{slug}?page=0&size=10` |
| 단건 조회 | GET | `/api/v1/page-data/{slug}/{id}` |
| 등록 | POST | `/api/v1/page-data/{slug}` → `{ dataJson: {...} }` |
| 수정 | PUT | `/api/v1/page-data/{slug}/{id}` → `{ dataJson: {...} }` |
| 삭제 | DELETE | `/api/v1/page-data/{slug}/{id}` (파일 함께 삭제) |
| 엑셀 다운로드 | GET | `/api/v1/page-data/{slug}/export` |

**검색 파라미터 처리 방식:**

| 형식 | BE 처리 |
|---|---|
| 일반 문자열 | `ILIKE '%값%'` 부분 일치 |
| `eq_` 접두사 | `= 값` 완전 일치 (카테고리 필터 등) |
| `시작~종료` 형식 | `>= 시작 AND <= 종료` 범위 검색 |

> ⚠️ 파라미터 이름(fieldKey)은 **반드시 영문**이어야 합니다.

---

### 페이지 템플릿 API — `page_template`

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/api/v1/page-templates` | 전체 목록 |
| GET | `/api/v1/page-templates/{id}` | ID로 단건 |
| GET | `/api/v1/page-templates/by-slug/{slug}?type=LIST` | slug + 타입으로 조회 |
| POST | `/api/v1/page-templates` | 신규 저장 |
| PUT | `/api/v1/page-templates/{id}` | 수정 |
| DELETE | `/api/v1/page-templates/{id}` | 삭제 |

templateType 값:

| 값 | 설명 |
|---|---|
| `LIST` | quick-list 빌더로 만든 목록 화면 |
| `LAYER` | quick-detail 빌더로 만든 팝업/상세 화면 |
| `PAGE` | widget 빌더로 만든 자유 조합 화면 |

---

### 파일 API — `page_file`

| 메서드 | URL | 설명 |
|---|---|---|
| POST | `/api/page-files/upload` | 업로드 (임시 상태) |
| GET | `/api/page-files/{id}` | 다운로드 |
| GET | `/api/page-files/meta?ids=1,2,3` | 메타 일괄 조회 |
| PATCH | `/api/page-files/link` | page_data에 연결 |
| DELETE | `/api/page-files/{id}` | 삭제 |

---

## 12. 주요 파일 위치

### 빌더 페이지

| 경로 | 역할 |
|---|---|
| `bo/src/app/admin/templates/make/quick-list/page.tsx` | 검색폼 + 테이블 목록 빌더 |
| `bo/src/app/admin/templates/make/quick-detail/page.tsx` | 폼 + 레이어 팝업 빌더 |
| `bo/src/app/admin/templates/make/widget/page.tsx` | 자유 조합 위젯 빌더 |

### 공통 렌더러 (`make/_shared/components/renderer/`)

| 파일명 | 역할 |
|---|---|
| `WidgetRenderer.tsx` | 위젯 타입별 렌더러 분기 허브 |
| `PageGridRenderer.tsx` | outer + inner 격자 배치 |
| `RendererContainer.tsx` | 모든 렌더러 공통 컨테이너 (테두리·배경·grid) |
| `SearchRenderer.tsx` | 검색폼 렌더러 |
| `TableRenderer.tsx` | 데이터 테이블 렌더러 |
| `TableCellRenderer.tsx` | 테이블 셀 타입별 렌더러 |
| `FormRenderer.tsx` | 입력 폼 렌더러 |
| `SpaceRenderer.tsx` | 공간 영역 렌더러 |
| `CategoryRenderer.tsx` | 카테고리 목록 렌더러 |
| `FieldRenderer.tsx` | 폼·검색 필드 개별 렌더러 |

### 공통 빌더 (`make/_shared/components/builder/`)

| 파일명 | 역할 |
|---|---|
| `CommonBuilderDispatcher.tsx` | 위젯 타입별 빌더 UI 분기 허브 |
| `SearchWidgetBuilder.tsx` | 검색폼 설정 UI |
| `TableBuilder.tsx` | 테이블 설정 UI |
| `FormBuilder.tsx` | 폼 설정 UI |
| `SpaceBuilder.tsx` | 공간 설정 UI |
| `CategoryBuilder.tsx` | 카테고리 설정 UI |
| `SizeSettingPanel.tsx` | 위젯·컨텐츠 크기 설정 패널 |
| `ContentRowHeader.tsx` | 컨텐츠 헤더 (이름·크기·삭제) |

### 출력 페이지

| 경로 | 역할 |
|---|---|
| `bo/src/app/admin/generated/[slug]/page.tsx` | 관리자방식 공통 렌더러 |
| `bo/src/app/admin/generated/{slug}/page.tsx` | 개발자방식 생성 파일 |
| `bo/src/app/admin/generated/{slug}/LayerPopup.tsx` | 개발자방식 팝업 컴포넌트 |

### 레이아웃 공통

| 경로 | 역할 |
|---|---|
| `bo/src/components/layout/PageLayout.tsx` | 12칸 그리드 캔버스 |
| `bo/src/components/layout/GridCell.tsx` | 그리드 셀 (colSpan·rowSpan·height·overflow 통합 관리) |

### 개발 가이드 참고 페이지

| 경로 | 역할 |
|---|---|
| `bo/src/app/admin/templates/builder-contents-layout/page.tsx` | 모든 위젯 타입 UI 확인 (탭별 preview) |
