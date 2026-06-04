# FO Main 페이지 구조 가이드

> 경로: `/main` (port: 3002)  
> 파일: `fo/src/app/main/page.tsx`  
> 레이아웃: `fo/src/app/main/layout.tsx` → MainHeader + {children} + MainFooter

---

## 전체 섹션 구성

```
MainHeader                         ← 공통 헤더 (GNB)
│
main#Page_main.main-page
│
├── 1. MainVisual
│   ├── VideoSwiper                ← 메인 비주얼 (좌측 전체)
│   └── BannerSwiper               ← 우측 서브 배너
│   └── section.main_notic         ← 공지 바 (Exhibition 등)
│
├── 2. MainInfo                    ← 숫자 카운터 섹션
│
├── 3. WhatWeDoSwiper              ← What We Do 슬라이더
│
├── 4. HighlightNewsSection        ← Catch up on the latest news
│
├── 5. MainCards                   ← Industries We Serve
│
├── 6. MainProducts                ← Discover Our Products
│
├── 7. CommonBanner01              ← 중간 풀배너
│
├── 8. IconCards                   ← Explore More
│
└── 9. CommonBanner03Link          ← Contact Us / Where to buy
│
MainFooter                         ← 공통 푸터
```

---

## 섹션별 상세

### 1. MainVisual
**파일:** `components/MainVisual.tsx`  
**구성:** VideoSwiper + BannerSwiper + 공지 바

#### VideoSwiper
**파일:** `components/VideoSwiper.tsx`  
**클래스:** `.video-swiper-section > .video-swiper`

| 항목 | 내용 |
|------|------|
| 슬라이드 타입 | `youtube` / `video` / `image` 3가지 혼용 가능 |
| 현재 슬라이드 | slide-1(youtube), slide-2(image), slide-3(youtube) — 총 3개 |
| 자동재생 | Swiper autoplay 비사용 — 미디어(영상/유튜브) 종료 시 자동 다음 슬라이드 이동 |
| 이미지 슬라이드 | 5초(IMAGE_AUTOPLAY_DELAY) 후 자동 이동, 프로그레스바 표시 |
| 페이지네이션 | 숫자(01/02/03) + 프로그레스바 + 영상 재생/정지 버튼 |
| 뷰포트 감지 | IntersectionObserver(threshold: 0.2) — 화면 밖이면 미디어 일시정지 |
| 경로 복귀 감지 | `usePathname`으로 메인 재진입 시 Swiper remount (영상 처음부터 재생) |

슬라이드 콘텐츠 구조:
```
.video-slide
├── <iframe> / <video> / <Image>   ← 미디어 영역
├── .sl_dim                         ← 어두운 딤 레이어
└── .sl_content
    ├── .sl_subtit
    ├── .sl_tit (여러 줄 가능)
    └── <a> Explore 버튼
```

#### BannerSwiper
**파일:** `components/BannerSwiper.tsx`  
**클래스:** `.banner_swiper > .banner_swiper__inner`

| 항목 | 내용 |
|------|------|
| 슬라이드 수 | 3개 |
| 효과 | EffectFade (crossFade: true), 자동재생 4초 |
| 단일 슬라이드 | loop/autoplay 비활성화, `only` 클래스 추가 |
| 컨트롤 | BannerNavButtons(prev/next) + SwiperDotPagination |

#### 공지 바
**클래스:** `section.main_notic > .inner > a.item`  
- 아이콘 + 제목(Exhibition) + 설명 텍스트 + More 버튼 구성  
- 현재 하드코딩 정적 데이터

---

### 2. MainInfo
**파일:** `components/MainInfo.tsx`  
**클래스:** `section.main_info > .main_info__inner`

| 항목 | 내용 |
|------|------|
| 타이틀 | "Rooted in 50 years of expertise, driven by a vision to serve every corner of the world." |
| 카운터 항목 | 50+ Years / 107 Nations / 50 States — 3개 |
| 애니메이션 | IntersectionObserver(threshold: 0.25) 진입 시 카운트업 시작 |
| 이징 | easeOutCubic, 1600ms(COUNT_DURATION) |
| 순차 딜레이 | 항목별 120ms씩 딜레이 (index × 120ms) |

---

### 3. WhatWeDoSwiper
**파일:** `components/WhatWeDoSwiper.tsx`  
**클래스:** `section.what_we_do__inner > .swiper_type_01_area`

| 항목 | 내용 |
|------|------|
| 슬라이드 | Automation / Energy Solutions / Mobility & EV — 3개 |
| 효과 | EffectFade (crossFade: true), 자동재생 4초, loop |
| 마우스 인터랙션 | mouseenter → autoplay stop / mouseleave → autoplay start |
| 컨트롤 | SwiperBarControls (바 형태 페이지네이션 + prev/next) |

슬라이드 구조:
```
Link.sl
├── .btn-text-30.link_more   ← Explore 버튼 (우상단)
├── .img_area > img
└── .txt_area
    ├── h3.tit
    └── p.txt
```

---

### 4. HighlightNewsSection
**파일:** `components/content/HighlightNewsSection.tsx`  
**데이터:** `data/highlightNews/main.ts`  
**클래스:** `section#main-news`

- variant: `"main"`, title: `"Catch up on the latest news"`
- 뉴스 카드 목록 (정적 데이터 `mainHighlightNewsItems` 사용)

---

### 5. MainCards
**파일:** `components/MainCards.tsx`  
**클래스:** `section.main_cards > .inner`

| 항목 | 내용 |
|------|------|
| 섹션 제목 | "Industries We Serve" |
| 카드 수 | 6개 (Data Center / Public Infrastructure / Oil & Gas / Power Grid / Industrial / Commercial & Residential) |
| 애니메이션 | IntersectionObserver(threshold: 0.18) 진입 시 `.is-in-view` 클래스 추가 |
| 순차 딜레이 | `--reveal-delay` CSS 변수로 카드별 300ms 간격 진입 애니메이션 |

카드 구조:
```
a.item[--reveal-delay]
├── .img_area > img
└── .txt_area
    ├── h3.tit
    └── span.btn-icon-56 > span.icon_arrow-20
```

---

### 6. MainProducts
**파일:** `components/MainProducts.tsx`  
**클래스:** `section.main_products > .inner`

| 항목 | 내용 |
|------|------|
| 섹션 제목 | "Discover Our Products" |
| 탭 | New Arrivals / Best Sellers — 2개 |
| 슬라이드 수 | 각 탭 8개 제품 |
| 데스크탑 | 4개씩 표시 (min-width: 781px) |
| 모바일 | 1.15개씩 표시 |
| 배지 | `ProductAwardBadge` — badges:1(lg) / badges:2(sm) 구분 |
| 컨트롤 | SwiperBarControls |
| 루프 조건 | 슬라이드 수 > slidesPerView × 2 일 때만 loop 활성화 |

---

### 7. CommonBanner01
**파일:** `components/banners/CommonBanner01.tsx`  
**클래스:** `section.common_banner_01`

- 풀배너 (배경 이미지 + 타이틀 + 버튼)
- 현재 정적 콘텐츠 ("Engineering the Future of Smart Energy")

---

### 8. IconCards
**파일:** `components/IconCards.tsx`  
**클래스:** `section.icon_cards > .inner`

| 항목 | 내용 |
|------|------|
| 섹션 제목 | "Explore More" |
| 카드 수 | 4개 (Connect Portal / Tech Hub / Download Center / Training) |
| 구조 | 아이콘 이미지 + 제목 + 설명 |

---

### 9. CommonBanner03Link
**파일:** `components/banners/CommonBanner03Link.tsx`

- "Contact Us" / "Where to buy" 2개 링크 배너
- props `items[]`로 `{ title, description }` 주입

---

## 데이터 구조

| 섹션 | 데이터 방식 |
|------|------------|
| VideoSwiper 슬라이드 | 컴포넌트 내 하드코딩 (`mainSlides[]`) |
| BannerSwiper 슬라이드 | 컴포넌트 내 하드코딩 (`bannerSlides[]`) |
| MainInfo 카운터 | 컴포넌트 내 하드코딩 (`mainInfoStats[]`) |
| WhatWeDoSwiper | 컴포넌트 내 하드코딩 (`whatWeDoSlides[]`) |
| HighlightNews | `data/highlightNews/main.ts` 별도 파일 |
| MainCards | 컴포넌트 내 하드코딩 (`cardItems[]`) |
| MainProducts | 컴포넌트 내 하드코딩 (`newArrivalsProducts[]`, `bestSellersProducts[]`) |
| IconCards | 컴포넌트 내 하드코딩 (`iconCardItems[]`) |

> **현재 모든 데이터가 정적 하드코딩 상태** — BE API 연동 없음

---

## 사용 공통 컴포넌트

| 컴포넌트 | 위치 | 용도 |
|----------|------|------|
| `SwiperBarControls` | `components/swiper/` | 바 형태 페이지네이션 + prev/next |
| `SwiperDotPagination` | `components/swiper/` | 점 형태 페이지네이션 |
| `BannerNavButtons` | `components/swiper/` | 배너 prev/next 버튼 |
| `TabButton` | `components/ui/` | 탭 버튼 (role="tab") |
| `ProductAwardBadge` | `components/product/` | 제품 뱃지 (iF Design 등) |

---

## 헤더 / GNB 메뉴

### 파일 구조

| 파일 | 역할 |
|------|------|
| `components/layout/main/MainHeader.tsx` | 메인 헤더 래퍼 — 스크롤 상태 관리 후 GnbMenu에 전달 |
| `components/layout/shared/GnbMenu.tsx` | GNB 실제 렌더링 (variant: main / markets 구분) |
| `components/layout/shared/useHeaderScroll.ts` | 스크롤 방향 감지 → headerMode 반환 |
| `components/layout/shared/HeaderBreadcrumb.tsx` | 브레드크럼 (메인에서는 표시 없음) |
| `data/gnb/navItems.ts` | GNB 메뉴 항목 정의 |
| `data/gnb/mega/` | 메뉴별 메가 패널 데이터 |
| `components/layout/shared/gnb-mega/` | 메뉴별 메가 패널 컴포넌트 |

---

### GNB 메뉴 항목

**데이터 파일:** `data/gnb/navItems.ts`

| 순서 | id | label | 메가 메뉴 타입 |
|------|-----|-------|--------------|
| 1 | `devices` | Devices & Systems | devices 타입 (depth2 + depth3) |
| 2 | `markets` | Markets | simple 타입 |
| 3 | `services` | Services | simple 타입 |
| 4 | `support` | Support | simple 타입 |
| 5 | `careers` | Careers | simple 타입 |
| 6 | `company` | Company | simple 타입 |

> 모든 항목에 `megaMenu`가 있어 `<button>`으로 렌더링 (클릭 시 메가 패널 열림)  
> `href`가 있어도 직접 이동 없이 메가 패널 우선 열림

---

### 헤더 스크롤 동작

**훅:** `useHeaderScroll` (topThreshold: 80)

| 상태 | 조건 | 적용 클래스 |
|------|------|------------|
| `full` (최상단) | scrollY ≤ 80 | `is-top` — 투명 배경, 흰색 로고/텍스트 |
| `revealed` (스크롤 업) | 위로 스크롤 | `is-gnb-revealed` — 흰 배경, 어두운 로고 |
| `hidden` (스크롤 다운) | 아래로 12px↑ 스크롤 | `is-gnb-hidden` — 헤더 숨김 |

> 메가 메뉴 또는 모바일 메뉴가 열려 있을 때는 `hideGnbOnScroll: false` → hidden 없이 revealed 유지

---

### 메가 메뉴 구조

**메가 메뉴 타입 2가지:**

#### devices 타입 (Devices & Systems 전용)
```
메가 패널
├── 카테고리 목록 (depth2) — 좌측
│   └── 선택 시 depth3 목록 노출
├── depth3 항목 목록 — 우측
└── Explore All 버튼 → 전체 목록 뷰로 전환
```

#### simple 타입 (Markets, Services, Support, Careers, Company)
```
메가 패널
├── 항목 리스트 (이미지 + 제목 + 설명)
└── 항목 hover 시 activeItemId 업데이트
```

**메가 패널 열기/닫기 동작:**

| 동작 | 결과 |
|------|------|
| GNB 버튼 클릭 | 해당 메가 패널 열림 (같은 버튼 재클릭 시 닫힘) |
| 다른 메뉴 클릭 | 현재 패널 닫고 새 패널 열림 |
| 스크롤 8px↑ 이상 이동 | 메가 패널 자동 닫힘 |
| ESC 키 | 메가 패널 닫힘 (explore-all 뷰면 category 뷰로 복귀) |
| 딤 클릭 | 메가 패널 닫힘 |
| 페이지 이동 | 모든 GNB 메뉴 닫힘 |

---

### 헤더 HTML 구조

```
header.main_header[is-top | is-invert | is-mega-open | is-gnb-hidden | is-gnb-revealed]
├── .main_header__gnb-row
│   └── .main_header__inner
│       ├── h1.main_header__logo
│       │   └── <Link> (로고 white + dark 2종)
│       ├── nav.main_header__nav
│       │   └── ul.main_header__nav-list
│       │       └── li.main_header__nav-item [is-active]
│       │           └── <button> or <Link>  ← 메가 있으면 button
│       ├── .main_header__actions--desktop
│       │   ├── button.main_header__btn-search
│       │   └── button.main_header__btn-global
│       └── .main_header__actions--mobile
│           ├── button.main_header__btn-search
│           └── button.main_header__btn-menu [is-active]
│
├── [메가 패널 영역]  ← activeNavId 있을 때만 렌더
│
└── [모바일 메뉴]
    ├── nav.main_header__mobile-menu [is-open]
    └── button.main_header__mobile-dim  ← 모바일 메뉴 열릴 때만 렌더

[헤더 바깥] button.gnb_mega_dim [is-open]  ← 메가 메뉴 딤 처리
```

---

### 모바일 메뉴

- 햄버거 버튼(`main_header__btn-menu`) 클릭 시 `is-active` + 메뉴 `is-open`
- 메뉴 열리면 `document.body.style.overflow = "hidden"` (스크롤 잠금)
- 모바일 메뉴는 GNB 항목을 단순 링크(`<Link>`)로만 나열 — 메가 패널 없음
- ESC 키 또는 딤 클릭으로 닫힘
