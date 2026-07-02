# GE-FO 프로젝트 구조

> Next.js(App Router) 기반 FO(Front Office) 프로젝트 — 포트 3002
> `ge-fo`(https://github.com/kfgabiz-lab/ge-fo) 전체 반영 이후 기준으로 갱신됨
> 전체 tsx 파일별 목록·data slug 매핑은 [`fo-data-binding.md`](./fo-data-binding.md) 참고

---

## 1. 라우트 구조 개요

기존에는 `main`(홈) 페이지 1개만 존재했으나, `ge-fo` 전체 반영 이후 실제 서비스 페이지들이 대거 추가되어 **route group 기반의 다중 섹션 구조**로 확장되었습니다.

```
src/app/
├── layout.tsx                  # [Root Layout] 전역 CSS·메타데이터·공통 유틸 마운트
├── page.tsx                    # Root 페이지
│
├── main/                       # 홈(메인) — route group 밖의 독립 라우트
│   ├── layout.tsx               # Header + {children} + Footer 조합
│   ├── page.tsx                 # 메인 페이지 — 섹션 컴포넌트 조립
│   └── components/              # 메인 페이지 전용 섹션 (8개 섹션)
│
├── (company, markets, products-systems, search, services, support)/
│   └── layout.tsx               # Route Group 공통 레이아웃 (GNB/Footer 등)
│       ├── company/             # 회사소개 — 연혁, 채용, 뉴스룸(Press/Blog/Articles), ESG, 이벤트 등
│       ├── markets/             # 산업분야별 솔루션 — 데이터센터/전력망/산업/오일가스/공공인프라 등
│       ├── products-systems/    # 제품/시스템 — HVDC, Micro Grid, XEMS, 모터제어, VFD 등 제품 상세
│       ├── search/               # 통합검색 (문서/미디어/페이지/제품 탭별 검색)
│       ├── services/             # 서비스 — 엔지니어링 트레이닝, 서비스센터, 보증정책, 교육신청
│       └── support/               # 고객지원 — Contact Us, Download Center, Tech Hub, Where to Buy, Connect Portal
│
└── guide/                      # 개발용 컴포넌트/섹션/GNB/아이콘 가이드 페이지 (운영 배포 대상 아님)
    ├── layout.tsx
    ├── page.tsx
    ├── components/              # 컴포넌트 가이드
    ├── gnb/                     # GNB 가이드
    ├── ico/                     # 아이콘 가이드
    └── sections/                # 섹션 가이드
```

각 route group(`company`, `markets`, `products-systems`, `search`, `services`, `support`) 내부는 대체로 다음 패턴을 따릅니다:

```
{route-group}/
├── page.tsx                    # 대분류 목록/랜딩 페이지
├── {세부기능}/
│   ├── page.tsx                 # 세부 페이지
│   └── components/              # 해당 페이지 전용 컴포넌트 (Pascal 네이밍)
├── components/                  # 대분류 공용 컴포넌트
└── data/                        # 대분류 전용 정적 데이터 (.ts)
```

---

## 2. 레이아웃 영역 구조 (main 홈 기준)

```
┌─────────────────────────────────────────────────────┐
│  app/layout.tsx  (Root Layout)                      │
│  └─ <html>, <body> 전체 감싸기                        │
│     전역 CSS (reset, fonts, globals)                 │
│     공통 유틸 컴포넌트 (히스토리/스크롤 초기화)            │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  app/main/layout.tsx  (Main Layout)           │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  components/common/header.tsx           │  │  │
│  │  │  GNB + 메가메뉴 (최상단 고정 영역)          │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  app/main/page.tsx  (메인 콘텐츠)         │  │  │
│  │  │  [섹션1] MainVisual    (풀스크린 비주얼)   │  │  │
│  │  │  [섹션2] MainInfo      (브랜드 소개)      │  │  │
│  │  │  [섹션3] WhatWeDoSwiper (슬라이더)        │  │  │
│  │  │  [섹션5] MainCards      (카드 목록)       │  │  │
│  │  │  [섹션6] MainProducts   (제품 목록)       │  │  │
│  │  │  [섹션8] IconCards      (아이콘 카드)     │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  components/common/footer.tsx           │  │  │
│  │  │  뉴스레터 구독 폼 + SNS + 법적고지 (최하단)  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

> route group(company/markets/products-systems/search/services/support) 페이지들은 `(그룹)/layout.tsx`에서 동일한 GNB/Footer 패턴을 공유합니다.

---

## 3. 전체 디렉토리 구조 (폴더 레벨)

```
fo/
├── docs/
│   ├── fo-structure.md              # 프로젝트 구조 문서 (현재 파일)
│   └── fo-data-binding.md           # tsx 파일 ↔ BO data slug 매핑표
│
├── public/                          # 정적 파일 (이미지, 아이콘 900여개, 폰트)
│
├── src/
│   ├── app/                         # Next.js App Router — 상세는 1절 참고
│   │
│   ├── components/                  # 공용 컴포넌트 (카테고리별 분리, 총 73개 tsx)
│   │   ├── banners/                  # 배너 컴포넌트 (PascalCase 네이밍)
│   │   ├── common/                   # 헤더/푸터/GNB(+메가메뉴)/공용 배너(kebab-case)
│   │   ├── content/                  # 콘텐츠 섹션 (뉴스 하이라이트, 제품 특징)
│   │   ├── dev/                      # 개발용 디버그 테이블
│   │   ├── faq/                      # FAQ 컴포넌트
│   │   ├── form/                     # 폼 관련 (날짜선택, 셀렉트, 필드 아이콘)
│   │   ├── guide/                    # 가이드 페이지용 컴포넌트 (app/guide 대응)
│   │   ├── layout/                   # 레이아웃 보조 (Lenis 스크롤, markets 서브헤더/푸터)
│   │   ├── main/                     # 메인 페이지 섹션 컴포넌트 (kebab-case, app/main/components와 중복 — 4절 참고)
│   │   ├── modals/                   # 모달 (개인정보 정책 등)
│   │   ├── pagination/               # 페이지네이션
│   │   ├── product/                  # 제품 뱃지 등
│   │   ├── swiper/                   # Swiper 컨트롤 (네비/페이지네이션 버튼)
│   │   ├── ui/                       # 기본 UI 요소 (버튼, 탭)
│   │   └── video/                    # 영상 플레이어
│   │
│   ├── hooks/                       # 공용 커스텀 React Hook
│   │   ├── use-header-scroll.ts      # 스크롤 방향에 따른 헤더 상태 관리
│   │   └── use-media-query.ts        # 반응형 감지 훅
│   │
│   ├── lib/                         # 순수 유틸리티 함수
│   │   ├── api.ts                    # API fetch 공통 유틸
│   │   ├── googleMaps/                # Google Maps 로더 (Where to Buy 지도)
│   │   ├── navigation/                # GNB 닫기 이벤트, 히스토리 네비게이션 판별
│   │   ├── utils/                     # 날짜·숫자·문자열 포맷 유틸
│   │   ├── lenisScroll.ts / lenisOptions.ts / gnbScrollState.ts  # 신규 — Lenis 부드러운 스크롤 연동
│   │   ├── youtubeEmbed.ts / useYoutubeInViewPlayback.ts         # 신규 — 유튜브 임베드/뷰포트 재생 제어
│   │   ├── productBadge.ts           # 신규 — 제품 수상 뱃지 로직
│   │   └── useModalFocusTrap.ts      # 신규 — 모달 포커스 트랩
│   │
│   ├── data/                        # 정적 데이터 (API 연동 전 목업 포함)
│   │   ├── gnb/                       # GNB 메뉴 구조 + 메가메뉴 데이터(mega/)
│   │   ├── highlight-news/            # 뉴스 하이라이트 목업
│   │   ├── main/                      # 메인 페이지 목업
│   │   ├── search/                    # 검색 탭별(문서/미디어/페이지/제품) 콘텐츠
│   │   ├── services/                  # 서비스센터/트레이닝/보증정책 콘텐츠
│   │   ├── support/                   # Contact Us/Download Center/Tech Hub/Where to Buy 콘텐츠
│   │   └── breadcrumbConfig.ts, commonAssets.ts, pageIndex.ts 등  # 공용 데이터
│   │
│   ├── types/                       # 전역 TypeScript 타입 정의
│   │
│   └── assets/css/                  # 전역 스타일시트 (ls-publish 기준)
│       ├── reset.css / fonts.css / globals.css   # 초기화·폰트·디자인 토큰
│       ├── main.css / markets.css / support.css / services.css / company.css / devices-systems.css / search.css / training.css  # 페이지별 스타일
│       └── components/                # gnb.css, MainFooter.css, CommonFooter.css, SubFooter.css 등
│
├── .env.local                       # 환경변수 (NEXT_PUBLIC_API_URL)
├── next.config.ts                   # Next.js 설정 (이미지 remotePatterns 등)
├── tsconfig.json                    # TypeScript 설정 — path alias `@/*` → `src/*`
└── package.json                     # 의존성 (포트: 3002)
```

---

## 4. ⚠️ 확인 필요 — 중복/네이밍 불일치

`ge-fo` 전체 반영 과정에서 유입된 코드 중, **같은 목적으로 보이는 파일이 서로 다른 위치·네이밍 컨벤션으로 중복 존재**합니다. 임의로 정리하지 않고 목록만 남겨두며, 실제 사용 여부 확인 후 별도로 정리 필요:

| 항목 | 위치 A | 위치 B |
|---|---|---|
| 배너 컴포넌트 | `components/banners/CommonBanner01.tsx` (PascalCase) | `components/common/banners/common-banner01.tsx` (kebab-case) |
| 메인 섹션 컴포넌트 | `app/main/components/MainVisual.tsx` (PascalCase) | `components/main/main-visual.tsx` (kebab-case) |
| Cross-section nav 유틸 | `lib/navigation/cross-section-nav.ts` | `lib/navigation/crossSectionNav.ts` |
| 뉴스 하이라이트 데이터 | `data/highlightNews.ts` | `data/highlight-news/index.ts`, `main.ts` |
| 뉴스 하이라이트 컴포넌트 | `components/content/HighlightNewsSection.tsx` | `components/common/content/highlight-news-section.tsx` |

---

## 5. 신규 주요 의존성 (package.json 기준)

| 패키지 | 용도 |
|---|---|
| `lenis` | 부드러운 스크롤(smooth scroll) 처리 |
| `swiper` | 슬라이더/캐러셀 (배너, 비주얼, What We Do 등) |
| `@mui/material`, `@mui/x-date-pickers`, `@mui/x-data-grid` | UI 컴포넌트 (Select, DatePicker, 가이드용 데이터 테이블 등) |
| `dayjs` | 날짜 처리 |

---

## 환경변수

| 변수명 | 값 | 설명 |
|-------|----|-----|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | BE API 서버 주소 |
