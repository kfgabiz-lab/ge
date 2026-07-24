# Section Markup Guide

페이지 `<section>`·섹션형 래퍼 마크업 규칙입니다.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide/sections` → `SectionGuide.tsx` |
| **데이터** | `src/data/sectionGuide.ts` |
| **클래스 레지스트리** | [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) |
| **허브** | [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) |

---

## 목차

1. [마크업 워크플로](#마크업-워크플로)
2. [네이밍](#네이밍)
3. [마크업 패턴](#마크업-패턴)
4. [타이포그래피](#타이포그래피)
5. [도메인별 패턴](#key-visual-hero-sticky-markets)
6. [CSS 파일 매핑](#css-파일-매핑)
7. [섹션 가이드 · 체크리스트 · 금지](#섹션-가이드-guidesections)

---

## 마크업 워크플로

1. **검색** — [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) + `/guide/sections`에서 루트 클래스 중복 확인
2. **접두어** — 페이지 도메인 접두어 결정 (아래 표)
3. **마크업** — `<section className="{root}">` + BEM 하위 + 공통 클래스
4. **CSS** — 페이지 CSS 또는 `globals.css`에 `section.{root}` 스코프 추가
5. **갱신** — 레지스트리 MD · `sectionGuide.ts` · `SectionGuidePreviews.tsx`

---

## 네이밍

| 구분 | 패턴 | 예 |
|------|------|-----|
| 섹션 루트 | `{domain}_{block}` | `markets_hero`, `devices_product_video` |
| 하위 요소 | `{root}__{element}` | `markets_hero__tit` |
| 변형 | `{root}--{variant}` | `devices_help--overlay` |
| 상태 | `.is-{state}` | `is-active`, `is-in-view` |

### 도메인 접두어

| 접두어 | 용도 | CSS |
|--------|------|-----|
| `main_` | `/main` | `main.css` |
| `markets_` | `/markets/...` | `markets.css` |
| `devices_` | `/products-systems/...` | `devices-systems.css`, `devices-product-detail.css` |
| `common_` | 공통 배너·FAQ·404 | `globals.css`, `main.css`, `common-404.css` |
| `highlight_` | 공통 뉴스 섹션 | `globals.css` |
| `support_` | `/support/...` | `support.css` |
| `support_service_` | `/services/...` (Service Center · Warranty · Training) | `services.css`, `training.css` |
| `search_` | `/search` | `search.css` |
| `company-` | `/company/...` (레거시 kebab) | `company.css` |

> Company 페이지는 초기 구현 시 kebab-case(`company-blog-title`)를 사용합니다. 신규 섹션은 `company_` snake_case를 권장하되, 기존 패턴과의 일관성을 우선합니다.

---

## 마크업 패턴

```tsx
<section className="markets_example" id="markets-example">
  <div className="inner">
    <div className="markets_example__head">
      <h2 className="section_tit">Title</h2>
      <p className="section_desc">Description</p>
    </div>
    <ul className="markets_example__list">...</ul>
  </div>
</section>
```

### 공통 클래스 (`globals.css`)

| 클래스 | 용도 |
|--------|------|
| `.inner` | max-width 컨테이너 |
| `.section_tit` | 섹션 h2 (50px / 62px) |
| `.section_desc` | 섹션 설명 (18px / 28px) |
| `.img_area`, `.txt_area`, `.tit`, `.item` | 카드·리스트 패턴 |

UI 컴포넌트(버튼·필드·배너)는 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)를 따릅니다. 아이콘 경로·CSS 유틸은 [ICON_GUIDE.md](./ICON_GUIDE.md)를 따릅니다.

---

## 타이포그래피

### 섹션 헤드 (h2) — `.section_tit` · `.section_desc`

`CompanyAboutSectionHead` 등 섹션 내부 헤드에 사용 (`globals.css`).

| 요소 | desktop | mobile (≤780px) |
|------|---------|-----------------|
| `.section_tit` | 50px / **line-height 62px** / weight 600 / `var(--font-display)` | 36px / 44px |
| `.section_desc` | 18px / **line-height 28px** / weight **400** / `#666` (`--color-text-muted`) | 16px / 24px |

### 페이지 타이틀 (h1) — `__heading` · `__desc`

Support · Company feed · About · Careers 등 **페이지 최상단 타이틀 섹션** 공통 패턴.

```tsx
<section className="support_download_title">
  <div className="inner">
    <h1 className="support_download_title__heading">Download Center</h1>
    <p className="support_download_title__desc">...</p>
  </div>
</section>
```

| 요소 | desktop | mobile (≤780px) |
|------|---------|-----------------|
| `__heading` (h1) | **70px / line-height 80px** / weight 800 / letter-spacing -0.02em / `jaka` / `#222` | 40px / 48px (페이지별 소폭 차이 있음) |
| `__desc` | **18px / line-height 28px** / weight **400** / `#666` / `margin-top: 11px` | 16px / 24px / `margin-top: 10~16px` |

> **`line-height: 1` 사용 금지** — 70px 제목은 반드시 `line-height: 80px`.  
> **`__desc`에 `font-weight: 300` 사용 금지** — Light(300)는 hero `__sub` 등에만 사용 (`markets_hero__sub`).

#### `__heading` 레지스트리 (70px / 80px)

| CSS 파일 | 클래스 |
|----------|--------|
| `support.css` | `support_connect_title__heading` · `support_download_title__heading` · `support_tech_hub_title__heading` · `support_where_to_buy_title__heading` · `support_contact_title__heading` |
| `company.css` | `company-blog-title__heading` · `company-about-title__heading` · `company-careers-title__heading` |
| `company-feed.css` | `company-press-title__heading` · `company-articles-title__heading` |

#### 기타 70px 제목 (hero·카테고리)

| CSS 파일 | 클래스 | 비고 |
|----------|--------|------|
| `devices-systems.css` | `devices_hero__tit` · `devices_category__tit` · `devices_explore__tit` | 페이지/카테고리 hero |
| `devices-product-detail.css` | `devices_product_hero__series` · `devices_*_hero__title` | 제품 상세 |
| `markets.css` | `markets_hero__tit` | 82px (Markets key-visual은 별도 스펙) |

Hero 부제는 `__sub` — desktop 24px / weight **300** / line-height 34px (`markets.css`).

### 섹션 vs 레이아웃

| 구분 | 예 | 가이드 등록 |
|------|-----|-------------|
| 페이지 `<section>` | `markets_hero`, `devices_product_downloads` | `sectionGuide.ts` + 이 문서 |
| 레이아웃·임베드 | `main_footer`, `devices_products--embedded` | `note` 또는 [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) 공유 패턴 |
| 모달·오버레이 | `common_modal`, `cookie_settings_modal`, `cookie_preferences_modal`, `markets_references_modal`, `support_contact_view_response_modal`, `support_contact_view_response_detail_modal`, `privacy_policy_modal` | Markets references 모달은 **body portal** (`createPortal`) |

### Key-visual hero sticky (Markets)

```tsx
<div className="markets_hero__sticky-wrap">
  <section className="markets_hero markets_hero--key-visual">...</section>
</div>
```

- sticky는 **wrap**에 적용 (`markets.css` · `min(1020px, 100svh)`)
- 이후 섹션 `z-index: 1` + 흰 배경 · 마진 대신 padding
- 모달은 섹션 밖 `document.body`에 portal

### `markets_solutions` (data-center)

- 루트: `markets_solutions` · 상태 클래스 `markets_solutions__stage--open`
- **desktop** (`min-width: 781px`): hotspot pill 클릭 → map `left:0` + `__panel--desktop` fade-in · active 재클릭 시 닫기 · `bg_datacenter.png`
- **mobile** (`max-width: 780px`): `bg_datacenter_mo.png` · 핀 아이콘 + `__accordion` · 핀·트리거 동일 zone 연동 · `marketsSolutionMobileOrder` · `mobileMapX`/`mobileMapY` · `mobileLabel`
- 마크업: `__map-bg--pc` / `__map-bg--mo` · `__hotspot-pin` · `__panel--desktop` · `__accordion` (`__accordion-trigger` · `__accordion-panel`)
- 데이터: `marketsSolutions.ts`
- 상세: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Markets 섹션

### `markets_solutions_panel` (commercial-residential · public-infrastructure · industrial · oil-gas-mining)

- 루트: `markets_solutions_panel` · `layout` prop → `--grouped` | `--stacked`
- **grouped** — commercial-residential · public-infrastructure · 2 solution groups + diagrams
- **stacked** — oil-gas-mining · solution list + diagram (Figma 5633:85749)
- **diagram-only** — industrial (`groups: []`) · mobile categories cards (Figma 7465:147605)
- **mobile grouped** — panel `#f5f7fa` · `padding: 30px 24px` · panel 내 group 간격 `40px` · block/diagram `24px` · multi-block `24px` · title 24/34 · body 15/23 · key 14/20 · diagram 287/154 · power diagram white inset `10px` (Figma 7603:181474)
- **mobile stacked** — panel 투명 · block 카드 `display: flex; flex-direction: column` · 카드 간 `14px` · 카드 `padding: 30px 24px` · title/body `6px` · body/capabilities `12px` · 두 번째 카드 diagram `287×400` crop (Figma 6858:171384)
- **mobile industrial** — panel `#f5f7fa` `30px 24px` · diagram PC/MO 분리 (`diagram.png` / `diagram_mo.png` 287×166) + navy header category cards · gap `14px` (Figma 7465:147605)
- 데이터: `marketsCommercialSolutionsPanel.ts` · `marketsPublicInfrastructureSolutionsPanel.ts` · `marketsOilGasMiningSolutionsPanel.ts` · `marketsIndustrialSolutionsPanel.ts`
- 가이드 미리보기: grouped(commercial-residential · public-infrastructure) + stacked (`SectionGuidePreviews.tsx`)

### Support — Where to Buy (`/support/where-to-buy`)

- **검색** — `WhereToBuySearch` `embedded` prop → `support_where_to_buy_contents` 좌측 컬럼 내 배치 (`--embedded`, Figma 5752:47179)
- 페이지 `page.tsx` / `no-data/page.tsx`는 별도 `support_where_to_buy_search` 섹션 없음
- 상세: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Support — Where to Buy

### Support — Contact Us modals (`/support/contact-us/terms-modal`)

- **허브** — `support_contact_modals_hub` · `ContactUsModalsHubPage.tsx` · `P-FO-SUPP-050100P`
- **셸** — `common_modal` (`globals.css`) + 모달별 root (`support.css`)
- **View Response (입력)** — `support_contact_view_response_modal` · Inquiry Number + Password · `common_modal__foot` Confirm
- **View Response (상세)** — `support_contact_view_response_detail_modal` · `variant`: `answered` | `pending`
  - answered: Q/A inquiry·response · response 영역 `__trail` + `__text` · 답변일 `respondedAt`
  - pending: response `__date` = 접수일 `submittedAt` · `__pending` 중앙 안내 · `__response--pending`
  - 공통: `common_modal__foot` · `__confirm` (PC `min-width: 220px` · MO full width)
- **Privacy Policy** — `privacy_policy_modal` · 폼 `View Full Terms` 오버레이와 동일 셸
- **데이터** — `contactUsContent.ts` · `privacyPolicyContent.ts`
- **가이드** — `/guide/sections` · `SectionGuidePreviews.tsx` · embedded `common_modal--embedded`

### `markets_sustainability` · `markets_smart_grid` (power-grid)

- `markets_sustainability` — 2열 카드 그리드 (`SustainabilityCard[]`)
- `markets_smart_grid` — Use Case / Operation 블록 + `markets_smart_grid__diagram` 이미지 (`diagram.png` · Figma 4689:72050)
- `markets_smart_grid` mobile — body `#f5f7fa` · `30px` 상하 · content `24px` · inner `gap: 40px` · block `gap: 24px` · cards `gap: 10px` · card `#fff` `padding: 24px` · tit 24/34 · card tit 18/26 · desc 15/23 · diagram `287/160` crop (Figma 7465:145850)
- 라이브: `/markets/power-grid` · 가이드 미리보기: `marketsPowerGridContent.ts` 데이터

### `markets_benefits` · `markets_why`

- **benefits** — `public/img/markets/benefits/benefit_01~10.jpg` · `marketsBenefitImages` (`marketsContent.ts`) · 페이지별 이미지 순서는 각 `markets*Content.ts`
- **why** — `.icon_area img` · 공통 `img_why_*.svg` · data-center `data-center/why/why_*.svg` (Figma 7465:155034) · power-grid `power-grid/why/why_*.svg` (Figma 7465:153537) · industrial `industrial/why/why_*.svg` · oil-gas-mining `oil-gas-mining/why/why_*.svg` (Figma 7465:154000)
- **why mobile** — `section.markets_why` 공용 (`markets.css` `max-width: 780px`) · `bg_section_main_info_mo.png` · `.inner` `70px 20px` · 제목 30px/40px

### `common_faq` (공용)

- 루트: `common_faq` · `CommonFaq.tsx` · `globals.css`
- **mobile** (`max-width: 780px`): Figma 5966:63556 · Markets · Service Center 등 전 페이지 공용 · 상세: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Common — `common_faq`
- **애니메이션**: `faq_answer_wrap` grid 0fr→1fr · answer opacity/`translateY` · 아이콘 rotate · reduced-motion 대응

### `highlight_news` (공용)

- 루트: `highlight_news` · `--main` / `--markets` · `HighlightNewsSection.tsx` · `globals.css`
- **이미지**: `public/img/devices-systems/highlights/highlight_01~03.jpg` · Figma 7577:84697 · Main·Markets·Products 공통
- **`--markets .tit`**: 2줄 말줄임
- 상세: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Common — `highlight_news`

### Search (`/search`) — `search.css`

- **Hero** — `search_all_hero` · `guide_field--search` 80px (치수는 `search.css` 스코프, [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) `#search-80`)
- **탭** — `search_all__tabs` / `search_all__tab.is-active` · All·Products·Documents·Media·Pages
- **All 탭** — `search_all` · AI 요약 · 섹션별 Product/Documents/Media/Pages + `btn-text-30` Explore
- **개별 탭 패널** — `search_products` · `search_documents` · `search_media` · `search_pages`
  - 루트에 `devices_product_downloads` 병기 → `DevicesProductDownloadsFilter*` 재사용 (`devices-product-detail.css`)
  - Products/Documents: `SearchTabActiveFilters` active chips
  - Documents: `SearchDocumentsCard` (All 탭 2열 `search_all__document` · 탭 full-width `search_documents__card`)
  - Copy Link: `DevicesProductDownloadsCopyLink` · `file.url` (`productDownloadFile`) · loading → `Link copied!` toast
- **tablet 600~780px** — All Product/Media · Products 탭 · Media 탭 2열 (`40px 20px`), list divider 숨김
- **mobile 599px 이하** — 위 카드/리스트 1열
- **페이지 조합** — `SearchAllPage` = `SearchAllHero` + `SearchAllTabContent`
- 라이브: `/search` · Figma 4701:83900 (All) · 84687 · 85037 · 84177 · 84292

### Services — Engineering Training Session — `training.css`

- **Agenda PC** — `__table` + `SessionDetailTableScroll`
- **Agenda MO** — `__agenda-list` 타임라인 (`__agenda-dot` · Figma 8007:107681) · 테이블 숨김
- **Countdown** — DAYS / HOURS / MINS only (Figma 8007:106738)
- 상세: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Services — Engineering Training Session

### Software Product (`/products-systems/software/...`) — `devices-product-detail.css`

- **공유 Hero/Overview** — `devices_software_hero` · `devices_software_overview` (SCADA · xEMS · Micro Grid · Smart Factory · 컴포넌트 4종씩 · BEM `devices_software_*__*`)
- **Applications** — `devices_product_applications` (SCADA · Micro Grid · Smart Factory · PC 3열) · `--xems` (xEMS PC 2열 + diagram)
- **Why 변형** — `devices_product_why` (HVDC 카드형) · `--image-only` (`DevicesSoftwareHighlights`) · `__block--split` · `devices_micro_grid_why` (diagram PC/MO 분리)
- **pageId** — `P-FO-PROD-040000P` (xEMS · SCADA · Micro Grid · Smart Factory) · `pageIndex.ts` 참고
- **앵커** — `#product-overview` · `#product-benefits` · `#product-applications` · `#product-why` — `scroll-margin-top: 200px`

#### `devices_product_applications`

```tsx
<section className="devices_product_applications" id="product-applications">
  <div className="inner">
    <div className="devices_product_applications__head">
      <h2 className="section_tit">{title}</h2>
      {description ? <p className="section_desc">{description}</p> : null}
    </div>
    <div className="devices_product_applications__grid">
      <article className="devices_product_applications__card">...</article>
    </div>
  </div>
</section>
```

- xEMS: 동일 루트 + `devices_product_applications--xems` · `__diagram-picture` / `__diagram-mobile`
- 상세 스펙: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Product Detail — `devices_product_applications`

#### `devices_micro_grid_why`

```tsx
<section className="devices_micro_grid_why" id="product-why">
  <div className="inner">
    <h2 className="section_tit">{renderMultilineText(title)}</h2>
    <div className="devices_micro_grid_why__panel">
      <div className="devices_micro_grid_why__items">...</div>
      <div className="devices_micro_grid_why__diagram">
        <div className="devices_micro_grid_why__diagram-picture"><img ... /></div>
        <div className="devices_micro_grid_why__diagram-mobile"><img ... /></div>
      </div>
    </div>
  </div>
</section>
```

- PC: `why_diagram.svg` · MO: `why_diagram_mobile.svg` · Figma 6584:100040

### Company About (`/company/ls-electric-america` · `/company/ls-electric` · `/company/affiliate-in-america`) — `company.css`

- **공통 컴포넌트** — `CompanyAboutTitleSection` (`company-about-title`) · `CompanyAboutIntroSection` (`company-about-intro`) · `CompanyAboutSectionHead` (`company-about__head`) · `CompanyMissionSection`
- **페이지 래퍼** — `company-page--america` · `company-page--ls-electric` · `company-page--affiliate-america` · desktop `inner` max-width 1440px
- **America** — intro → shaping → business → careers banner → operate (Head Office / Office / Affiliate) → leaders → mission → follow
- **LS ELECTRIC** — intro → highlights → business → global → ptt → rnd → history → mission
- **Affiliate in America** — intro(`company-about-intro` + modifiers) → `company-affiliate-list`

#### `company-affiliate-list__item` (Figma 5565:134319)

```tsx
<li className="company-affiliate-list__item">
  <div className="company-affiliate-list__logo">
    <img src={item.logo} alt="" width={item.logoWidth} height={item.logoHeight} />
  </div>
  <div className="company-affiliate-list__meta">
    <dl className="company-affiliate-list__fields company-affiliate-list__fields--left">...</dl>
    <dl className="company-affiliate-list__fields company-affiliate-list__fields--right">...</dl>
  </div>
</li>
```

- 로고 박스: 360×216 · `padding 24px` · `#f5f7fa` · 항목별 크기 `affiliateAmericaContent.ts` (`logoWidth` / `logoHeight`)
- 행: `gap 80px` · meta 열 `gap 60px` · field `gap 30px` / label-value `gap 10px`

### Company — Careers (`/company/careers`) — `company.css`

- **페이지 래퍼** — `company-page--careers` (Figma 5565:137777 · `P-FO-COMP-090000P`)
- **섹션 순서** — `company-careers-title` → `company-careers-jobs` → `company-careers-linkedin`
- **CTA** — Go to LinkedIn (`btn-lv01--solid`) · Explore Open Positions (`icon_external-18`)
- 데이터: `careersContent.ts`

### Company — Article Detail (`company-article-detail`)

- **variant** — `blog` · `press` · `events` · `media` (`CompanyArticleDetail.tsx`)
- **media** (`--media`) — `/company/articles/detail` · `heroVideo` · `section-title` / `subsection-title` / `pullquote` / `content-img` (Figma 5565:134495)
- **blog** — tags row · `/company/blog/detail`
- **press** — hero · highlight bullets · body (Figma 7575:82740) · `/company/press/detail`
- **events** (`--events`) — `/company/events/detail` · `eventsMeta`: Venue · Dates (우측 정렬) · hero image

#### `company-article-detail__pager` (blog · press · events · media 공통)

```tsx
<nav className="company-article-detail__pager">
  <Link className="company-article-detail__pager-item company-article-detail__pager-item--prev">
    <span className="company-article-detail__pager-dir">
      <span className="company-article-detail__pager-leading">
        <span className="company-article-detail__pager-label">PREV</span>
        <img className="company-article-detail__pager-chev company-article-detail__pager-chev--up" ... />
      </span>
      <span className="company-article-detail__pager-sep" />
    </span>
    <span className="company-article-detail__pager-title">...</span>
  </Link>
  {/* NEXT: pager-chev--down */}
</nav>
```

- 아이콘: `/pub/ico/ico_arrow_pager_14.svg` · PREV `transform: none` · NEXT `rotate(180deg)` (Figma 5870:55854)

#### `company-ls-electric-history` (zigzag timeline)

```tsx
<section className="company-ls-electric-history">
  <div className="inner">
    <div className="company-ls-electric-history__head">...</div>
    <ul className="company-ls-electric-history__timeline">
      <li className="company-ls-electric-history__era company-ls-electric-history__era--beginning company-ls-electric-history__era--left">
        <div className="company-ls-electric-history__era-body">...</div>
      </li>
    </ul>
  </div>
</section>
```

- desktop: `__era` absolute · Figma Y `nth-child` top · 핀/점선 `::before`/`::after` · 콘텐츠 stacking은 `__era-body` z-index
- 에셋: `history-pin.svg` · era 이미지 `history-{id}.jpg`
- 상세: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Company — LS ELECTRIC

---

## CSS 파일 매핑

| 파일 | 담당 |
|------|------|
| `globals.css` | 공통 토큰, `common_*`, `highlight_news`, 가이드 |
| `main.css` | `main_*`, `icon_cards`, `what_we_do__inner` |
| `markets.css` | `markets_*` |
| `devices-systems.css` | `devices_hero`, `devices_category`, `devices_markets` 등 |
| `devices-product-detail.css` | `devices_product_*`, `devices_software_*`, `devices_micro_grid_*` |
| `company.css` | `company-*`, `company-article-detail` |
| `company-feed.css` | `company-press-*`, `company-articles-*`, `company-events-*` |
| `support.css` | `support_*` |
| `services.css` | `support_service_*` — Service Center · Warranty Policy |
| `training.css` | `support_service_training_*` — Engineering Training · Request for Training |
| `search.css` | `search_*` — `/search` (탭·AI·필터 패널) |
| `components/MainFooter.css` | `main_footer`, `main_footer_02` |

---

## 섹션 가이드 (`/guide/sections`)

데이터는 `src/data/sectionGuide.ts`의 `sectionGuideCategories`에 정의합니다. 카테고리별 목록은 [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) 상단 표를 참고하세요.

| 파일 | 역할 |
|------|------|
| `sectionGuide.ts` | 카테고리·엔트리 메타 (루트 클래스, 컴포넌트, CSS, modifier) |
| `SectionGuide.tsx` | TOC·카테고리 렌더 · `previewByCategory` 매핑 |
| `SectionGuideBlock.tsx` | 엔트리 메타 헤더 + 미리보기 슬롯 |
| `SectionGuidePreviews.tsx` | 도메인별 미리보기 컴포넌트 |

### 미리보기 정책

- **대표 1개** — 중첩·임베드 섹션(`devices_products`, `main_notic` 등)은 부모 엔트리 `note`에만 기록
- **레지스트리만** — 다른 섹션과 동일 패턴인 Title·Contents는 MD 레지스트리에만 등록 (예: `support_download_title`)
- **No Data** — Empty 컴포넌트는 Contents 섹션 내부 변형으로 처리, 별도 가이드 엔트리 없음

---

## 새 섹션 추가 체크리스트

1. [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) — 해당 카테고리 표에 추가
2. `src/data/sectionGuide.ts` — 카테고리·엔트리 (중첩·임베드는 대표 1개만)
3. `SectionGuidePreviews.tsx` — 미리보기 (또는 `SectionGuide.tsx`에 `livePage` 링크만)
4. `SectionGuide.tsx` — `previewByCategory`에 카테고리 id 매핑
5. 해당 CSS 파일 — `section.{root}` 스타일
6. **신규 라우트** — `src/data/pageIndex.ts`에 `pageId` · `link` · Figma·modifier `note` 추가

---

## 금지

- 등록된 루트 클래스 재사용·다른 도메인 접두어 혼용
- 범용 단독 이름 (`content`, `wrapper`, `section1`)
- Figma MCP Tailwind를 섹션 루트로 그대로 사용
- 중첩·임베드 섹션을 가이드에 별도 중복 등록
