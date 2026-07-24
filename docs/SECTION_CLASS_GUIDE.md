# Section Class Registry

사용 중인 **섹션 루트 클래스** 레지스트리입니다. 마크업 규칙·워크플로는 [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md)를 참고하세요.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide/sections` |
| **데이터** | `src/data/sectionGuide.ts` |
| **미리보기** | `SectionGuidePreviews.tsx` |
| **허브** | [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) |

---

## 목차

- [페이지 타이틀](#페이지-타이틀-__heading--__desc)
- [카테고리](#카테고리-sectionguidets)
- [Main](#main-main--maincss) · [Markets](#markets-markets--marketscss-globalscss) · [Products & Systems](#products--systems--devices-systemscss) · [Product Detail](#product-detail--devices-product-detailcss)
- [Company](#company--blog-companyblog--companycss) (Blog · Press · Articles · Events · About · ESG · Careers · Article Detail)
- [Common](#common--globalscss--maincss) · [Support](#support--connect-portal-supportconnect-portal--supportcss) · [Search](#search--all-results-search--searchcss)
- [Services](#services--service-center-servicesservice-center--servicescss) (Service Center · Warranty · Engineering Training · Request for Training)
- [공유·레이아웃](#공유레이아웃-패턴-섹션-루트-아님) · [가이드·개발](#가이드개발)

---

### 페이지 타이틀 (`__heading` · `__desc`)

Support · Company 등 페이지 최상단 h1 패턴. 타이포 스펙·금지 사항은 [SECTION_MARKUP_GUIDE.md § 타이포그래피](./SECTION_MARKUP_GUIDE.md#타이포그래피) 참고.

| 루트 클래스 | CSS | 컴포넌트 |
|-------------|-----|----------|
| `support_page_title` | `support.css` | `SupportPageTitle.tsx` — Support 하위 페이지 공통 h1 |
| `support_connect_title` | `support.css` | `ConnectPortalTitle.tsx` (alias) |
| `support_download_title` | `support.css` | `DownloadCenterTitle.tsx` (alias) |
| `support_tech_hub_title` | `support.css` | `TechHubTitle.tsx` (alias) |
| `support_where_to_buy_title` | `support.css` | `WhereToBuyTitle.tsx` (alias) |
| `support_contact_title` | `support.css` | `ContactUsTitle.tsx` (alias) |
| `company-about-title` | `company.css` | `CompanyAboutTitleSection.tsx` |
| `company-blog-title` | `company.css` | `blog/page.tsx` |
| `company-press-title` | `company-feed.css` | `CompanyPressTitle.tsx` |
| `company-articles-title` | `company-feed.css` | `CompanyArticlesTitle.tsx` |
| `company-careers-title` | `company.css` | `CompanyCareersPage.tsx` |

---

## 카테고리 (`sectionGuide.ts`)

| id | 라벨 | CSS | 라이브 |
|----|------|-----|--------|
| `main` | Main | `main.css` | `/main` |
| `markets` | Markets | `markets.css`, `globals.css` | `/markets/data-center` · `/markets/commercial-residential` (GNB) · `/markets/industrial` (GNB) · 기타 URL 직접 |
| `devices` | Products & Systems | `devices-systems.css` | `/products-systems/motor-control` |
| `product` | Product Detail | `devices-systems.css`, `devices-product-detail.css` | `/products-systems/motor-control/h100_plus` · Software: `/products-systems/software/scada` |
| `company-america` | Company — LS ELECTRIC America | `company.css` | `/company/ls-electric-america` |
| `company-ls-electric` | Company — LS ELECTRIC | `company.css` | `/company/ls-electric` |
| `company-affiliate-america` | Company — Affiliate in America | `company.css` | `/company/affiliate-in-america` |
| `company-esg` | Company — ESG | `company.css` | `/company/esg` |
| `company-careers` | Company — Careers | `company.css` | `/company/careers` |
| `company-blog` | Company — Blog | `company.css` | `/company/blog` |
| `company-press` | Company — Press | `company.css` | `/company/press` |
| `company-articles` | Company — Articles | `company.css` | `/company/articles` |
| `company-events` | Company — Events | `company.css` | `/company/events` |
| `company-article-detail` | Company — Article Detail | `company.css` | `/company/articles/detail` |
| `common` | Common | `globals.css`, `main.css` | — |
| `support` | Support — Connect Portal | `support.css` | `/support/connect-portal` |
| `support-download` | Support — Download Center | `support.css`, `devices-product-detail.css` | `/support/download-center` |
| `support-tech-hub` | Support — Tech Hub | `support.css`, `devices-product-detail.css` | `/support/tech-hub` |
| `support-contact-us` | Support — Contact Us | `support.css` | `/support/contact-us` |
| `support-where-to-buy` | Support — Where to Buy | `support.css` | `/support/where-to-buy` |
| `support-tech-hub-view` | Support — Tech Hub View | `support.css`, `devices-product-detail.css` | `/support/tech-hub/view` |
| `search` | Search — All Results | `search.css`, `devices-product-detail.css` | `/search` |
| `services-service-center` | Services — Service Center | `company.css`, `services.css` | `/services/service-center` |
| `services-warranty-policy` | Services — Warranty Policy | `company.css`, `services.css` | `/services/warranty-policy` |
| `services-engineering-training` | Services — Engineering Training | `company.css`, `training.css` | `/services/engineering-training` |
| `services-engineering-training-detail` | Services — Engineering Training Detail | `training.css` | `/services/engineering-training/breaker-training` |
| `services-engineering-training-session` | Services — Engineering Training Session | `training.css` | `/services/engineering-training/breaker-training/jul-14-2026` |

---

## Main (`/main`) — `main.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `main_visual` | `MainVisual.tsx` | `main_notic`·`video-swiper-section`·`banner_swiper` 포함 |
| `main_notic` | `MainVisual.tsx` | `main_visual` 하단 · MO Figma 6571:92270 · dark navy 123px · 15/23 Medium · white text/icon |
| `main_info` | `MainInfo.tsx` | 스탯 카운트업 · `info_box__count` ghost/live 고정 너비 (`main.css`) |
| `main_cards` | `MainCards.tsx` | GNB `marketsMegaMenu` grid 연동 · tablet 600~780px 2열 (gap 14px) |
| `main_products` | `MainProducts.tsx` | |
| `icon_cards` | `IconCards.tsx` | Explore More · 4 cards · `icon_card_01~04.svg` (`public/img/main/`) · Training(4) 링크 없음 |
| `what_we_do__inner` | `WhatWeDoSwiper.tsx` | 레거시: `__inner`가 루트 |
| `video-swiper-section` | `VideoSwiper.tsx` | `<div>`, `main_visual` 내부 — **image** · **video** (`/pub/img/video1.mp4`) · **image** (타입 `youtube` 지원) |
| `banner_swiper` | `BannerSwiper.tsx` | `<div>`, `main_visual` 내부 (가이드 미등록) |

---

## Markets (`/markets/...`) — `markets.css`, `globals.css`

페이지 modifier: `markets-page--data-center` · `--commercial-residential` · `--public-infrastructure` · `--oil-gas-mining` · `--power-grid` · `--industrial`

| 페이지 | 섹션 순서 |
|--------|-----------|
| **data-center** | hero → intro → **stats** → references → benefits → **solutions** → why → products → banner → highlights → FAQ |
| **commercial-residential** | hero → intro → **stats** → **explore** → references → benefits → **solutions_panel** → why → products → (하단 3종) |
| **industrial** | hero → intro → **stats** → **explore** → references → benefits → **solutions_panel** → why → products → (하단 3종) |
| **public-infrastructure** | hero → intro → **explore** → references → benefits → **solutions_panel** → why → products → (하단 3종) |
| **oil-gas-mining** | hero → intro → **explore** → references → benefits → **solutions_panel** → why → products → (하단 3종) |
| **power-grid** | hero → intro → **explore**(5탭) → references → benefits → **sustainability** → **smart_grid** → why → products → (하단 3종) |

key-visual 6페이지 공통: `MainHeader` + breadcrumb · hero sticky scroll-over · MO key-visual `812px` (data-center 기준, commercial-residential 포함 · Figma 7603:186125) · `markets_intro` padding(마진 대체) · GNB Markets 링크: data-center · commercial-residential · industrial

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `markets_hero__sticky-wrap` | `MarketsHero.tsx` | key-visual 래퍼 · **sticky** on wrap (`min(1020px, 100svh)`) |
| `markets_hero` | `MarketsHero.tsx` | `--key-visual` · `--has-img` |
| `markets_intro` | `MarketsIntro.tsx` | 공통 · z-index 1 · 흰 배경 · `paragraphs` prop (power-grid 등) |
| `markets_stats` | `MarketsStats.tsx` | data-center · commercial-residential · industrial |
| `markets_explore` | `MarketsExplore.tsx` | commercial-residential · industrial · public-infrastructure · oil-gas-mining · power-grid (`--wide-tabs` 5탭) |
| `markets_references` | `MarketsReferences.tsx` | 카드 클릭 → 모달 |
| `markets_references_modal` | `MarketsReferencesModal.tsx` | `common_modal` · **`createPortal(document.body)`** · embedded 가이드만 in-flow |
| `markets_benefits` | `MarketsBenefits.tsx` | 공통 · 이미지 `public/img/markets/benefits/benefit_01~10.jpg` · `marketsBenefitImages` (`marketsContent.ts`) · 페이지별 매핑은 각 `*Content.ts` |
| `markets_solutions_panel` | `MarketsSolutionsPanel.tsx` | `--grouped` · `--stacked` · diagram-only (industrial) |

### `markets_solutions_panel` 레이아웃

| `layout` | modifier | 페이지 | 비고 |
|----------|----------|--------|------|
| `grouped` | `--grouped` | commercial-residential · public-infrastructure | 2 solution groups + diagrams · Figma 5535:94070 · 5841:92618 |
| `stacked` | `--stacked` | oil-gas-mining | solution list + diagram · Figma 5633:85749 |
| (default) | — | industrial | diagram only (`groups: []`) · mobile category cards · PC/MO diagram 분리 (`diagram.png` / `diagram_mo.png`) Figma 7465:147605 |

모바일 grouped는 Figma `7603:181474` 기준으로 panel `#f5f7fa` · `30px 24px`, panel 내 group 간격 `40px`, block/diagram 간격 `24px`, multi-block 간격 `24px`, title `24/34`, body `15/23`, Key Solutions `14/20`, diagram `287/154`, power diagram white inset `10px`를 사용합니다.

모바일 stacked는 Figma `6858:171384` 기준으로 panel 배경을 제거하고, 각 block을 `30px 24px` 카드로 분리합니다. 카드 간격은 `14px`, title/body 간격은 `6px`, body/capabilities 간격은 `12px`이며 trailing diagram은 마지막 block 내부에서 `287×400` crop으로 표시합니다.

데이터: `marketsCommercialSolutionsPanel.ts` · `marketsPublicInfrastructureSolutionsPanel.ts` · `marketsOilGasMiningSolutionsPanel.ts` · `marketsIndustrialSolutionsPanel.ts`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `markets_sustainability` | `MarketsSustainability.tsx` | power-grid 전용 |
| `markets_smart_grid` | `MarketsSmartGrid.tsx` | power-grid 전용 · `MarketsSmartGridDiagram.tsx` · `diagram.png` |
| `markets_solutions` | `MarketsSolutions.tsx` | data-center 전용 · desktop `stage--open` · mobile 아코디언 (Figma [5966:63794](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5966-63794)) |
| `markets_why` | `MarketsWhy.tsx` | 공통 · `.icon_area img` · SVG 경로 `img_why_*.svg` / data-center `why/why_*.svg` (Figma 7465:155034) / power-grid `why/why_*.svg` (Figma 7465:153537) / industrial `why/why_*.svg` / oil-gas-mining `why/why_*.svg` (Figma 7465:154000) · mobile `max-width: 780px` 공용 (`markets.css`) |
| `markets_products` | `MarketsProducts.tsx` | `badgesType2Only` (type1 제외) |
| `common_banner_01` | `CommonBanner01.tsx` | 페이지 하단 CTA |
| `highlight_news` | `HighlightNewsSection.tsx` | `--markets` · `markets-highlights` · 이미지 `public/img/devices-systems/highlights/highlight_01~03.jpg` (Figma [7577:84697](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7577-84697)) · `.tit` 2줄 말줄임 (`--markets`) |
| `common_faq` | `MarketsFaq.tsx` | CommonFaq 래퍼 |

`markets_smart_grid` 모바일은 Figma `7465:145850` 기준으로 body와 block을 column flex로 구성합니다. body `#f5f7fa` · 상하 `30px` · content `24px` · inner `gap: 40px`(block·diagram) · block 내부 `24px` · cards `10px` · card `#fff` `24px` · tit `24/34` · card tit `18/26` · desc `15/23` · diagram `287/160` crop입니다.

### `markets_solutions` 인터랙션

**Desktop** (`min-width: 781px`)

- 초기: `panel-card` 숨김 · map `left: 250px`
- hotspot 클릭 → `markets_solutions__stage--open` · map `left: 0` transition · panel fade-in
- **active hotspot 재클릭** → `--open` 제거 · panel 즉시 숨김 (`transition: none`)
- 다른 hotspot → 내용만 교체
- 맵 배경: `bg_datacenter.png` · `__map-bg--pc`

**Mobile** (`max-width: 780px` · `section.markets_solutions` — data-center 전용 컴포넌트 · 가이드 `/guide/sections` Markets 스코프 `markets-page--data-center`)

- 맵 배경: `bg_datacenter_mo.png` · `__map-bg--mo` (PC 이미지 `display: none`)
- hotspot: pill 라벨 숨김 · `__hotspot-pin` (`pin_default.svg` / active `pin_active.svg`)
- 좌표: PC `mapX`/`mapY` · MO `--mo-x`/`--mo-y` (`mobileMapX`/`mobileMapY` + 오프셋 `+3%`/`+5%`)
- desktop `__panel--desktop` 숨김 · `__accordion` 표시
- 핀·아코디언 트리거 동일 `activeId` 연동 · 열림 시 트리거 숨김 · `__accordion-panel` (`border: 1px solid #0c1625` · Figma [5966:63832](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5966-63832))
- 아코디언 순서: `marketsSolutionMobileOrder` (`marketsSolutions.ts`) · `mobileLabel` (예: Chiller · Outdoor substation)

데이터: `marketsSolutions.ts` · `marketsSolutionZones` · `marketsSolutionMobileOrder`

### `markets_why` (mobile · Markets 공용)

`max-width: 780px` · `section.markets_why` (`markets.css`) — data-center 전용 오버라이드 없음

| 영역 | 스펙 |
|------|------|
| 섹션 | `padding: 0` · 내부 `.inner` `padding: 70px 20px` |
| 배경 | `bg_section_main_info_mo.png` · PC `img_area img` 숨김 · `glow_area` 숨김 |
| 제목 | 30px / 40px · `letter-spacing: -0.02em` · 흰색 |
| 설명 | `margin-top: 8px` |
| 리스트 | `gap: 30px` |
| 항목 본문 | `margin-top: 2px` · 15px / 23px |

---

## Products & Systems — `devices-systems.css`

| 클래스 | 컴포넌트 | modifier |
|--------|----------|----------|
| `devices_hero` | `DevicesHero.tsx` | `--with-products` (`devices_products` 임베드) |
| `devices_products` | `DevicesProducts.tsx` | `--embedded` — `devices_hero`에 포함 · **배지 없음** |
| `devices_category` | `DevicesCategoryList.tsx` | `--stacked` |
| `devices_markets` | `DevicesMarkets.tsx` | — |
| `devices_help` | `DevicesHelp.tsx` | `--overlay` |

---

## Product Detail — `devices-product-detail.css`

**H100 Plus** (`/products-systems/motor-control/h100_plus`): hero → features → expert banner → lineup(type2) → downloads → video → other products → …

**Susol UL Smart MCCB** (`/products-systems/motor-control/susol-ul-smart-mccb`): hero → features → expert banner → lineup(type1) → downloads → hub banner → other products(2) → … (Video 없음)

**SCADA 상세** (`/products-systems/software/scada`): software hero → overview → benefits(`--list`) → applications → why

**HV System — Software** (`P-FO-PROD-040000P` · GNB 미연결 · `devices-page--product`):

| 페이지 | modifier | 섹션 순서 |
|--------|----------|-----------|
| **xEMS** | `--xems` | software hero → overview → benefits(`desc`) → **energy_solutions** (`--xems`) → why(`--image-only`) → … |
| **SCADA (HVDC)** | `--hvdc` | software hero → overview → benefits(`--list`) → applications → why → … |
| **Micro Grid** | `--micro-grid` | software hero → overview → benefits(`--list`) → applications → **micro_grid_why** → … |
| **Smart Factory** | `--smart-factory` | software hero → overview → benefits(`--list`) → applications → why(`--image-only` · `__block--split`) → … |

| 클래스 | 컴포넌트 | id / 비고 |
|--------|----------|-----------|
| `devices_product_hero` | `DevicesProductHero.tsx` | `product-top` |
| `devices_product_features` | `DevicesProductFeaturesSection.tsx` | `product-key-feature` · `product-benefits` · `--list` · `desc` |
| `common_banner_02` | `CommonBanner02.tsx` | `--expert` · Key Features 아래 |
| `devices_product_lineup` | `DevicesProductLineup.tsx` | `product-lineup` · `table="susol-frame"`(Figma 6788:7576) · `table="metasol-ms"`(Figma 6788:8458) · `items` / `frameLineup` · `__footer` + `btn-lv02--solid` |
| `devices_product_downloads` | `DevicesProductDownloads.tsx` | `product-downloads` — list Figma 7922:118486 · Copy Link: `DevicesProductDownloadsCopyLink` (loading 1s → `Link copied!` toast 1s · `file.url`) |
| `devices_product_video` | `DevicesProductVideo.tsx` | `product-video` |
| `devices_product_other` | `DevicesProductOtherProducts.tsx` | `product-other` · Figma 4713:26185 · 50px 제목 · 카드 288px · IF 뱃지 type2(50px)만 · 슬라이드 4개 이하 시 `swiper_type_01_controls` 미표시 |
| `devices_software_hero` | `DevicesHvdcHero.tsx` 등 4종 | `product-top` · SCADA · xEMS · Micro Grid · Smart Factory 공통 |
| `devices_software_overview` | `DevicesHvdcOverview.tsx` 등 4종 | `product-overview` · SCADA(img) · 나머지(background) 공통 |
| `devices_product_applications` | `DevicesProductApplications.tsx` | `product-applications` · PC 3열 · 이미지 1:1 · Figma 6584:96117 |
| `devices_product_applications--xems` | `DevicesXemsEnergySolutions.tsx` | `product-applications` · PC 2열 · 비주얼 600/392 · diagram · Figma 6584:97108 |
| `devices_micro_grid_why` | `DevicesMicroGridHighlights.tsx` | `product-why` · Micro Grid 전용 · 항목+diagram PC/MO 분리 |
| `devices_product_why` | `DevicesProductWhy.tsx` | `product-why` · HVDC — 카드 타이틀·설명 |
| `devices_product_why` | `DevicesSoftwareHighlights.tsx` | `product-why` · `--image-only` · `__block--split` (단일 이미지 가로형) |

페이지 래퍼: `.devices-page--product` · 소프트웨어: `.devices-page--xems` · `--hvdc` · `--micro-grid` · `--smart-factory`

### `devices_product_applications` (SCADA · Micro Grid · Smart Factory)

| 영역 | desktop (`min-width: 781px`) | mobile (`max-width: 780px`) |
|------|------------------------------|-----------------------------|
| 그리드 | `repeat(3, minmax(0, 1fr))` · gap 24px | 1열 · gap 40px |
| 비주얼 | 1:1 · border `#e8e8e8` | 335×335 · `#f5f7fa` |
| 본문 | `__body` margin-top 24px · gap 10px | gap 6px |
| 타이틀 | 28px/38px semibold | 22px/32px |

### `devices_product_applications--xems`

| 영역 | desktop | mobile |
|------|---------|--------|
| 그리드 | `repeat(2, minmax(0, 1fr))` · gap 24px | 1열 |
| 비주얼 | 600/392 · `#f5f7fa` · `object-position: bottom` | 335×335 |
| diagram | `__diagram-picture` (SVG) | `__diagram-mobile` (CSS 조립) |

### `devices_micro_grid_why`

| 영역 | desktop | mobile |
|------|---------|--------|
| 패널 | padding 60px · 항목 gap 40px | padding 30px 24px 40px · 항목 gap 20px |
| diagram | `__diagram-picture` → `why_diagram.svg` | `__diagram-mobile` → `why_diagram_mobile.svg` · max-width 287px |

```tsx
<div className="devices_micro_grid_why__diagram">
  <div className="devices_micro_grid_why__diagram-picture">
    <img src={diagramImage} alt={diagramAlt} />
  </div>
  <div className="devices_micro_grid_why__diagram-mobile">
    <img src={diagramImageMobile} alt={diagramAlt} />
  </div>
</div>
```

---

## Company — Blog (`/company/blog`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-blog-title` | `blog/page.tsx` | 페이지 타이틀 |
| `company-blog-top` | `blog/page.tsx` · `CompanyBlogPage.tsx` | 히어로 · `company-blog-featured__title` 2줄 · `__desc` 3줄 말줄임 |
| `company-blog-list` | `CompanyBlogPage.tsx` | 툴바 · 리스트 · `__title` 1줄 · `__desc` 3줄 말줄임 · tablet 600~780px 2열 |
| `company-blog-list--no-data` | `CompanyBlogEmpty.tsx` | 검색 결과 없음 · `emptyStateIconSrc` (`/pub/img/common/empty_icon.svg`) · View All |

페이지: `/company/blog` · `/company/blog/no-data` (`.company-page--blog`)

---

## Company — Press (`/company/press`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-press-title` | `CompanyPressTitle.tsx` | 페이지 타이틀 |
| `company-press-featured` | `CompanyPressFeatured.tsx` | Featured · `__title` 2줄 말줄임 · `btn-text-30` Explore |
| `company-press-list` | `CompanyPressListSection.tsx` | 툴바(`GuideSelect` + `GuideSelectIcon` · `#dropdown`) · 그리드 · `__title` 2줄 말줄임 · tablet 600~780px 2열 · 페이지네이션 |
| `company-press-list--no-data` | `CompanyPressEmpty.tsx` | 검색 결과 없음 · `emptyStateIconSrc` · View All |

페이지: `/company/press` · `/company/press/no-data` (`.company-page--press`)

---

## Company — Articles (`/company/articles`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-articles-title` | `CompanyArticlesTitle.tsx` | 페이지 타이틀 · Figma 5584:53170 |
| `company-articles-featured` | `CompanyArticlesFeatured.tsx` | Featured · `__title` 2줄 말줄임 · `btn-text-30` Explore |
| `company-articles-list` | `CompanyArticlesListSection.tsx` | 툴바 · 그리드 · `.company-page--articles` `__title` 3줄 말줄임 · tablet 600~780px 2열 · 페이지네이션 |
| `company-articles-list--no-data` | `CompanyArticlesEmpty.tsx` | 검색 결과 없음 · `emptyStateIconSrc` · View All |

페이지: `/company/articles` · `/company/articles/no-data` (`.company-page--articles`) · 상세 `/company/articles/detail`

---

## Company — Events (`/company/events`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-press-title` | `CompanyPressTitle.tsx` | Events 타이틀 (공통 패턴) |
| `company-events-featured` | `CompanyEventsFeatured.tsx` | Swiper · `__title` 1줄 말줄임 · bar controls |
| `company-events-calendar` | `CompanyEventsCalendar.tsx` | 월별 일정 리스트 |
| `company-events-past` | `CompanyEventsPastSection.tsx` | Past Events · `__title` 1줄 말줄임 · 그리드 `minmax(0, 1fr)` · tablet 600~780px 2열 |

페이지 래퍼: `.company-page--events`

---

## Company — About shared (`company.css`)

America · LS ELECTRIC · Affiliate in America 페이지 공통 컴포넌트·클래스.

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-about-title` | `CompanyAboutTitleSection.tsx` | 페이지 타이틀 · `__heading` (70px/80px) · `__desc` (18px/28px/400) — [SECTION_MARKUP_GUIDE](./SECTION_MARKUP_GUIDE.md) 타이포 |
| `company-about-intro` | `CompanyAboutIntroSection.tsx` | 히어로 + 2열 텍스트 레이아웃 `__text` · `__headline` · `__body` |
| `company-about__head` | `CompanyAboutSectionHead.tsx` | 섹션 헤드 래퍼 · `section_tit` · `section_desc` (섹션 루트 아님) |
| `company-mission` | `CompanyMissionSection.tsx` | Philosophy · Mission · Core Value (Figma 4717:58745) · `americaMission` |
| `company-follow` | `CompanyFollowSection.tsx` | SNS 링크 · `americaFollow` (America 페이지 사용) |

데이터: `americaContent.ts` (`americaMission`, `americaFollow`) — `company-mission`은 America/LS ELECTRIC 공통, `company-follow`는 America 페이지에서 사용.

아이콘·에셋: Mission·Follow 전용 SVG (`pageIconGuide.ts`) · Philosophy 앰블럼 `philosophy-emblem.png`

---

## Company — LS ELECTRIC America (`/company/ls-electric-america`) — `company.css`

페이지 래퍼: `.company-page--america` (Figma 4040:96583) · `P-FO-COMP-010000P`

| 순서 | 클래스 | 컴포넌트 | 비고 |
|------|--------|----------|------|
| 1 | `company-about-title` | `CompanyAboutTitleSection.tsx` | 공통 |
| 2 | `company-america-intro` | `CompanyAmericaPage.tsx` | 히어로 · 소개 · 통계 |
| 3 | `company-america-shaping` | `CompanyAmericaPage.tsx` | Shaping What's Next · bastrop/utah 자동재생 webm · `company-america-shaping__block` · 카피 Figma [7954:181924](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7954-181924) / [7954:181899](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7954-181899) |
| 4 | `company-america-business` | `CompanyAmericaPage.tsx` | Core Business · `company-america-business__row--reverse` · tablet 600~780px 2열 |
| 5 | `common_banner_04` | `CommonBanner04.tsx` | Careers CTA (`globals.css`) |
| 6 | `company-america-operate` | `CompanyAmericaPage.tsx` | Figma [5601:127261](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5601-127261) · Head Office / Office / Affiliate 그룹 · `ico_map_16` · `ico_phone_16` · `ico_website_16` |
| 7 | `company-america-leaders` | `CompanyAmericaPage.tsx` | 피처드 CEO + 8명 4×2 (Figma) · tablet 600~780px 2열 |
| 8 | `company-mission` | `CompanyMissionSection.tsx` | 공통 |
| 9 | `company-follow` | `CompanyFollowSection.tsx` | 공통 |

아이콘: Shaping `ico_map_16_white` · Operate `ico_map_16` / `ico_phone_16` (`public/ico`)

---

## Company — LS ELECTRIC (`/company/ls-electric`) — `company.css`

페이지 래퍼: `.company-page--ls-electric` (Figma 4717:53765) · `P-FO-COMP-020000P`

| 순서 | 클래스 | 컴포넌트 | 비고 |
|------|--------|----------|------|
| 1 | `company-about-title` | `CompanyAboutTitleSection.tsx` | 공통 |
| 2 | `company-about-intro` | `CompanyAboutIntroSection.tsx` | 공통 · 히어로 PC/MO 분리 · 2열 텍스트 (Figma 4717:56038) |
| 3 | `company-ls-electric-highlights` | `CompanyLsElectricPage.tsx` | 2025 Highlights · `btn-text-30` IR 링크 |
| 4 | `company-ls-electric-business` | `CompanyLsElectricPage.tsx` | Our Business · 4 cards · tablet 600~780px 2열 (Figma 4717:55930) |
| 5 | `company-ls-electric-global` | `CompanyLsElectricPage.tsx` | Global Network · dark map · 4 stat cards (Figma 4717:54192) |
| 6 | `company-ls-electric-ptt` | `CompanyLsElectricPage.tsx` | PT&T · 3 cards · tablet 600~780px 2열 (Figma 4717:54159) |
| 7 | `company-ls-electric-rnd` | `CompanyLsElectricPage.tsx` | R&D Center · numbered list (Figma 4717:54125) |
| 8 | `company-ls-electric-history` | `CompanyLsElectricPage.tsx` | History · zigzag timeline (Figma 4717:54027) |
| 9 | `company-mission` | `CompanyMissionSection.tsx` | 공통 |

데이터: `lsElectricContent.ts` · Mission은 `americaContent.ts` 공유.

아이콘·UI: Highlights `btn-text-30` · Business·PT&T·R&D `CompanyAboutSectionHead`

### `company-ls-electric-global`

- 다크 full-bleed · `__bg-texture` · `__map` · `__stats` (4 stat cards)
- America `company-america-operate` 오피스 카드 패턴과 **다름**

### `company-ls-electric-history` (desktop)

```tsx
<ul className="company-ls-electric-history__timeline">
  <li className="company-ls-electric-history__era company-ls-electric-history__era--{id} company-ls-electric-history__era--left|right">
    <div className="company-ls-electric-history__era-body">...</div>
  </li>
</ul>
```

| 요소 | 구현 |
|------|------|
| 세로 축 | `__timeline::before` · 1px `#d9d9d9` |
| 핀 | `__era::before` · `history-pin.svg` (26px) |
| 점선 | `__era::after` · `#b9bdc9` dash 3px · 좌 `to left` / 우 `to right` |
| era 위치 | `nth-child(1–4)` · `top: 0 / 190 / 883 / 1125px` |
| 겹침 stacking | `__era-body` · `z-index: 1–4` (`__era`에 z-index 금지) |
| 좌측 era | `__era-head` · `text-align: right` |

모바일(≤780px): 축·핀·점선 숨김 · era static stack.

---

## Company — Affiliate in America (`/company/affiliate-in-america`) — `company.css`

페이지 래퍼: `.company-page--affiliate-america` (Figma 4717:53311) · `P-FO-COMP-030000P`

| 순서 | 클래스 | 컴포넌트 | 비고 |
|------|--------|----------|------|
| 1 | `company-about-title` | `CompanyAboutTitleSection.tsx` | 공통 (020000P 동일) |
| 2 | `company-about-intro` | `CompanyAboutIntroSection.tsx` | 공통 · `--headline-wide` · `--hero-bottom` · `--compact` |
| 3 | `company-affiliate-list` | `CompanyAffiliateAmericaPage.tsx` | Figma [5565:134319](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5565-134319) · 6 rows · tablet 600~780px 2열 · logo 360×216 `#f5f7fa` · 항목별 `logoWidth`/`logoHeight` |

데이터: `affiliateAmericaContent.ts`

---

## Company — ESG (`/company/esg`) — `company.css`

페이지 래퍼: `.company-page--esg` (Figma 4717:53513) · `P-FO-COMP-040000P`

| 순서 | 클래스 | 컴포넌트 | 비고 |
|------|--------|----------|------|
| 1 | `company-about-title` | `CompanyAboutTitleSection.tsx` | 공통 |
| 2 | `company-about-intro` | `CompanyAboutIntroSection.tsx` | 공통 · `--hero-bottom` · `--compact` |
| 3 | `company-esg-vision` | `CompanyEsgPage.tsx` | Mission · Vision · ESG Directivity |
| 4 | `company-esg-climate` | `CompanyEsgPage.tsx` | 2040 Carbon Neutrality roadmap |
| 5 | `company-esg-policies` | `CompanyEsgPage.tsx` | ISO 9001 · ISO 27001 download cards |

데이터: `esgContent.ts`

---

## Company — Careers (`/company/careers`) — `company.css`

페이지 래퍼: `.company-page--careers` (Figma [5565:137777](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5565-137777)) · `P-FO-COMP-090000P`

| 순서 | 클래스 | 컴포넌트 | 비고 |
|------|--------|----------|------|
| 1 | `company-careers-title` | `CompanyCareersPage.tsx` | Title · desc · Go to LinkedIn CTA |
| 2 | `company-careers-jobs` | `CompanyCareersPage.tsx` | Job Description · 2×2 cards · `#f5f7fa` |
| 3 | `company-careers-linkedin` | `CompanyCareersPage.tsx` | LinkedIn banner · external link |

데이터: `careersContent.ts`

---

## Company — Article Detail — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-article-detail` | `CompanyArticleDetail.tsx` | `--blog` · `--press` · `--events` · `--media` |

| variant | 페이지 | 특징 |
|---------|--------|------|
| `--blog` | `/company/blog/detail` | 태그 · hero image |
| `--press` | `/company/press/detail` | hero · bullets · body (Figma [7575:82740](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7575-82740)) |
| `--events` | `/company/events/detail` | `eventsMeta` (Venue · Dates 우측 정렬) · hero image |
| `--media` | `/company/articles/detail` | `heroVideo` · `section-title` / `subsection-title` / `pullquote` / `content-img` · Figma 5565:134495 · `P-FO-COMP-080200P` |

#### `company-article-detail__pager` (Figma [5870:55854](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5870-55854))

- PREV / NEXT · `ico_arrow_pager_14.svg` (위·아래 chevron) · 구분선 1×20px · 제목 18/28 ellipsis
- 행: `gap 30px` (라벨 영역 ↔ 제목) · 라벨↔화살표 `gap 50px` · 화살표↔구분선 `gap 10px`

데이터: `blogDetailContent.ts` · `pressDetailContent.ts` · `eventsDetailContent.ts` · `mediaArticleDetailContent.ts`

---

## Common — `globals.css` · `main.css` · `common-404.css`

| 클래스 | 컴포넌트 | CSS |
|--------|----------|-----|
| `common_banner_01` | `CommonBanner01.tsx` | `globals.css` |
| `common_banner_02` | `CommonBanner02.tsx` | `globals.css` · `variant` default/expert · `--expert` (product) |
| `common_banner_03` | `CommonBanner03.tsx`, `CommonBanner03Link.tsx` | `main.css` |
| `common_banner_04` | `CommonBanner04.tsx` | `globals.css` · 풀폭 다크 CTA (Banner 02 expert와 별도) |
| `common_faq` | `CommonFaq.tsx` | `globals.css` · desktop `min-width: 781px` · mobile `max-width: 780px` 공용 · 아코디언 `grid 0fr/1fr` + opacity/`translateY` · `prefers-reduced-motion` |
| `common_404_title` | `NotFoundTitle.tsx` | `common-404.css` · P-FO-COMMON-010000P |
| `common_404_search` | `NotFoundSearch.tsx` | `common-404.css` · 검색 + Popular Keywords · `ico_clear_12_black` (Figma 7334:130802) |
| `common_404_links` | `NotFoundHelpfulLinks.tsx` | `common-404.css` · Helpful Links 4카드 · 아이콘 `loading="lazy"` (React 19 preload 경고 방지) |
| `cookie_settings_modal` | `CookieSettingsModal.tsx` | `globals.css` · P-FO-COMMON-020000P · 우하단 동의 배너 · 설명 단일 문단(강제 줄바꿈 없음) |
| `cookie_preferences_modal` | `CookiePreferencesModal.tsx` | `globals.css` · P-FO-COMMON-040000M · 상세 분류 설정 · MO Figma 7334:130983 · PNG Check 22px |
| `highlight_news` | `HighlightNewsSection.tsx` | `globals.css` (`--main`, `--markets`) · 이미지 `highlight_01~03.jpg` · `--markets .tit` 2줄 말줄임 · tablet 640~1200px 2열 (gap 24px) |

### 404 Not found (`/404`) — `common-404.css`

Figma [7334:130743](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7334-130743) · `P-FO-COMMON-010000P` · 페이지: `common-page--404` · `NotFoundPage.tsx` · breadcrumb current `404 Not found`

| 섹션 | 스펙 (PC) |
|------|-----------|
| `common_404_title` | 상단 75px · H1 70/80 ExtraBold · 설명 18/28 `#666` |
| `common_404_search` | 제목과 75px · 필드 80px `#f5f5f5` · Popular Keywords 태그 |
| `common_404_links` | PC 4열 · tablet 600~780px 2열 · mobile 599px 이하 1열 · 하단 Light Blue BG `#f5f7fa` (PC section y=304px, MO y=200px부터 · Figma 7334:130744 / 7334:131077) · 아이콘 `loading="lazy"` |

아이콘: `ico_clear_12_black` · `ico_404_home_80` · `ico_404_download_80` · `ico_404_contact_80` · `ico_404_request_80`

### Cookie Settings (`/main/cookie-setting`) — `globals.css`

Figma [7334:130871](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7334-130871) · `P-FO-COMMON-020000P` · 헤더·푸터·본문 없는 단독 우하단 모달

| 영역 | 스펙 (PC) |
|------|-----------|
| Dim | `rgb(0 0 0 / 50%)` full viewport |
| Panel | `530×241` · `right/bottom: 40px` · padding `30px` · radius `4px` |
| Title | 24/34 SemiBold `#222` |
| Desc | 15/23 `#666` · gap `6px` |
| Buttons | 42px · flex 1 · gap `10px` · line ×2 + solid Accept |

| 영역 | 스펙 (MO · Figma [7334:131063](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7334-131063)) |
|------|-----------|
| Panel | 중앙 · max `335px` · min-height `377` · padding `20 24 30` · inset `20` |
| Title | 20/30 SemiBold |
| Desc | 15/23 `#666` |
| Buttons | 세로 풀폭 · gap `10px` · 버튼 위 `30px` |

### Cookie Preferences (`/main/cookie-setting/preferences`) — `globals.css`

Figma [7334:130670](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7334-130670) · `P-FO-COMMON-040000M` · `P-FO-COMMON-020000P`의 Settings 버튼에서 연동

| 영역 | 스펙 (PC) |
|------|-----------|
| Dim | `rgb(0 0 0 / 50%)` full viewport |
| Panel | 최대 `1200×700` · 중앙 · radius `4px` |
| Header | 40px inset · 제목 28/38 SemiBold · close 24px · divider |
| Body | 설명 16/24 · Necessary~Others 6개 체크 항목 · 스크롤 |
| Buttons | 220×52 · Reject / Save / Accept · gap `14px` |

모바일 Figma [7334:130901](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7334-130901) — 패널 너비 `335px` · viewport 상하 `61px` · 좌우 inset `24px` · 제목 20/30 · 본문 15/23 · 항목 제목 18/26 · 체크 간격 `10px` · 항목 간격 `20px` · 패널 내부 스크롤. 하단 actions는 `42px` 버튼 3개를 세로 배치하고 본문과 `#e8e8e8` 선으로 구분합니다.

Necessary는 필수 활성 상태이며, 나머지 분류는 사용자가 변경할 수 있습니다. 선택값은 `ls-cookie-preferences`, 전체 동의 상태는 `ls-cookie-consent`에 저장합니다.

#### Cookie modal 라우트·연동

| 경로·진입점 | 표시 | 비고 |
|-------------|------|------|
| `/main/cookie-setting` | `cookie_settings_modal`만 표시 | `MainLayoutShell`에서 헤더·푸터 제외 · Settings 클릭 시 상세 모달로 전환 |
| `/main/cookie-setting/preferences` | `cookie_preferences_modal`만 표시 | 상세 모달 직접 확인용 · 헤더·푸터 제외 |
| `MainFooter` Cookie Settings | 현재 페이지 위 동의 배너 | Settings 클릭 시 상세 모달로 전환 |
| `/guide/sections` | 두 모달 embedded 미리보기 | dim·fixed overlay 없이 가이드 흐름에 표시 |

두 확인 경로 모두 URL의 `basePath`가 적용되면 `/pub/main/cookie-setting...`으로 접근합니다. 코드·문서 내부 링크는 `/main/...` 형식을 유지합니다.

### `common_faq` (mobile · 공용)

Figma [5966:63556](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5966-63556) · `globals.css` `max-width: 780px` — Markets · Service Center 등 페이지 공통

| 영역 | 스펙 |
|------|------|
| 섹션 | `padding: 70px 0 80px` · 배경 `#f5f7fa` |
| 헤드 | 제목·설명 `gap: 8px` · 설명 `#666` |
| 제목 | 30px / 40px · `font-weight: 700` · `letter-spacing: -0.02em` |
| 리스트 | 상단 `#ddd` 구분선 · `padding-top: 24px` · full-bleed (`margin-left/right: -20px`) |
| 항목 | `padding: 25px 20px` · 항목 간 `#ddd` 구분선 + `24px` |
| Q | `Q` 20px `#0f1f45` · 질문 18px/26px semibold · flex 정렬 (멀티라인 대응) |
| 토글 | 36×36px · `is-open` 시 회전만 (PC와 동일 · 빨간 배경 강제 없음) |
| 답변 | `padding-left: 28px` · 15px/23px `#222` |
| 애니메이션 (PC·MO 공통) | `faq_answer_wrap` `grid-template-rows` 0fr→1fr · `faq_answer` opacity + `translateY` · 아이콘 rotate · `cubic-bezier(0.22, 1, 0.36, 1)` · `prefers-reduced-motion: reduce` 시 transition 없음 |

> 페이지별 PC 오버라이드 예: Service Center `services.css` — `padding-bottom: 150px` · `common_faq__bg` 배경 `#fff`

### `highlight_news` (공용)

`HighlightNewsSection.tsx` · `globals.css` · variant `--main` / `--markets`

| 항목 | 스펙 |
|------|------|
| 이미지 | Main · Markets · Products 공통 `public/img/devices-systems/highlights/highlight_01~03.jpg` · Figma [7577:84697](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7577-84697) |
| 데이터 | `mainHighlightNewsItems` · `marketsHighlightNewsItems` · `motorControlHighlights` |
| `--markets .tit` | 2줄 말줄임 (`-webkit-line-clamp: 2`) · PC·MO |
| tablet | 640~1200px · 2열 · gap 24px |

---

## Support — Connect Portal (`/support/connect-portal`) — `support.css`

| 클래스 | 컴포넌트 | id |
|--------|----------|-----|
| `support_connect_title` | `ConnectPortalTitle.tsx` | `support-connect-title` |
| `support_connect_video` | `ConnectPortalVideo.tsx` | `support-connect-video` |
| `support_connect_features` | `ConnectPortalFeatures.tsx` | `support-connect-features` |
| `support_connect_detail` | `ConnectPortalDetail.tsx` | — (`--reverse` 변형) |

페이지 래퍼: `.support-page--connect-portal`

---

## Support — Download Center (`/support/download-center`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_download_title` | `DownloadCenterTitle.tsx` | `support-download-title` — 레지스트리만 (`support_connect_title` 패턴) |
| `support_download_search` | `DownloadCenterSearch.tsx` | `support-download-search` |
| `support_download_contents` | `DownloadCenterContents.tsx` | `support-download-contents` — 레지스트리만 (`devices_product_downloads--center`) · Copy Link `file.url` · empty `empty_icon.svg` |

---

## Support — Tech Hub (`/support/tech-hub`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_tech_hub_title` | `TechHubTitle.tsx` | `support-tech-hub-title` |
| `support_tech_hub_search` | `TechHubSearch.tsx` | `support-tech-hub-search` |
| `support_tech_hub_contents` | `TechHubContents.tsx` | `support-tech-hub-contents` — `devices_product_downloads--tech-hub` (`--no-data`: `/support/tech-hub/no-data`) · empty `empty_icon.svg` |
| `support_tech_hub_empty` | `TechHubEmpty.tsx` | contents 내부 (Figma 3670:30917, 가이드 미등록) |

---

## Support — Contact Us (`/support/contact-us`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_contact_title` | `ContactUsTitle.tsx` | `support-contact-title` — Figma 5565:128146 · View Response CTA |
| `support_contact_view_response_modal` | `ContactUsViewResponseModal.tsx` | Figma 5565:128538 · `common_modal` · Confirm footer |
| `support_contact_view_response_modal` (error) | `ContactUsViewResponseModalErrorPreview.tsx` | Figma 5565:128558 · Textfield Error [1689:8145](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1689-8145) |
| `support_contact_view_response_detail_modal` | `ContactUsViewResponseDetailModal.tsx` | Figma 5870:58637 (PC) · 6561:76701 (MO) · Answered · Confirm footer |
| `support_contact_view_response_detail_modal` (pending) | `ContactUsViewResponseDetailPendingPreview.tsx` | Figma 5565:130669 (PC) · 6561:76756 (MO) · `--response--pending` |
| `support_contact_form` | `ContactUsForm.tsx` | `support-contact-form` — Figma 3670:30232 · Error sample 유형당 1개 (Select Lv1 · Email · Comments · Password · Checkbox Personal Info) · [1689:8145](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1689-8145) |
| `privacy_policy_modal` | `PrivacyPolicyModal.tsx` | Figma 5565:128523 · `common_modal` · Confirm footer |
| `support_contact_modals_hub` | `ContactUsModalsHubPage.tsx` | `P-FO-SUPP-050100P` · `/support/contact-us/terms-modal` |

페이지 래퍼: `.support-page--contact-us` · 모달 허브: `.support-page--contact-us-modals`

#### `support_contact_view_response_detail_modal` BEM

| 요소 | 클래스 | 비고 |
|------|--------|------|
| shell | `common_modal` + root | `variant`: `answered` \| `pending` · `embedded` 가이드 미리보기 |
| 문의 | `__inquiry` | `__type` · Q `__section-head` · `__trail` · `__text` |
| 구분선 | `__divider` | inquiry / response 사이 |
| 응답 | `__response` | pending 시 `__response--pending` |
| 응답 헤더 | `__section-head` | A badge · `__section-tit` · `__date` (pending=접수일 · answered=답변일) |
| answered | `__trail` · `__text` | response 영역에 product trail + 본문 |
| pending | `__pending` · `__pending-tit` · `__pending-desc` | 중앙 정렬 안내 |
| footer | `common_modal__foot` · `__confirm` | PC `min-width: 220px` · MO full width |

데이터: `contactUsViewResponseDetailSample` (`contactUsContent.ts`)

---

## Support — Where to Buy (`/support/where-to-buy`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_where_to_buy_title` | `WhereToBuyTitle.tsx` | `support-where-to-buy-title` — Figma 5752:47179 |
| `support_where_to_buy_search` | `WhereToBuySearch.tsx` | `--embedded` — `WhereToBuyContents` 좌측 컬럼 내 검색 (페이지 단독 섹션 아님) |
| `support_where_to_buy_contents` | `WhereToBuyContents.tsx` | `support-where-to-buy-contents` — embedded search + 결과 (`--no-data`: `/support/where-to-buy/no-data`) · empty `empty_icon.svg` |
| `support_where_to_buy_empty` | `WhereToBuyEmpty.tsx` | contents 내부 (Figma 3670:30719, 가이드 미등록) |
| `support_where_to_buy_banner` | `WhereToBuyBanner.tsx` | `support-where-to-buy-banner` — Figma 5752:47255 |

페이지 순서: `support_where_to_buy_title` → `support_where_to_buy_contents` (+ embedded search) → `support_where_to_buy_banner`

---

## Support — Tech Hub View (`/support/tech-hub/view`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----|
| `support_tech_hub_view` | `TechHubView.tsx` | `support-tech-hub-view` — Figma 3670:31687 |

페이지 래퍼: `.support-page--tech-hub-view`

---

## Search — All Results (`/search`) — `search.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `search_all_hero` | `SearchAllHero.tsx` | `search-all-hero` — `guide_field--search` 80px · clear 30px + `ico_clear_12_black` (Figma 4701:83900 · 6571:102541) |
| `search_all` | `SearchAllTabContent.tsx` | `search-all` — All 탭 · AI·Product/Documents/Media/Pages · tablet 600~780px Product/Media 2열 (Figma 4701:83900 · Pages 4701:83902) |
| `search_products` | `SearchProductsPanel.tsx` | `search-products` — Products 탭 · tablet 600~780px 2열 (Figma 4701:84687) |
| `search_documents` | `SearchDocumentsPanel.tsx` | `search-documents` — Documents 탭 · MO active-filter clear `#222` (Figma 4701:85037 · 6571:105004) |
| `search_media` | `SearchMediaPanel.tsx` | `search-media` — Media 탭 · tablet 600~780px 2열 (Figma 4701:84177) |
| `search_pages` | `SearchPagesPanel.tsx` | `search-pages` — Pages 탭 (Figma 4701:84292 · list 4701:83912) |

페이지 래퍼: `.search-page` · breadcrumb `homeOnly` · 탭 패널은 `devices_product_downloads` 필터·`PageNumbering` 재사용

| 헬퍼 (섹션 루트 아님) | 컴포넌트 | 비고 |
|----------------------|----------|------|
| — | `SearchAllPage.tsx` | Hero + `SearchAllTabContent` 조합 |
| — | `SearchDocumentsCard.tsx` | `search_all` 2열 · `search_documents` full-width 공유 |
| — | `SearchTabActiveFilters.tsx` | Products/Documents active chips · `ico_clear_12` · Documents MO `brightness(25%)` → `#222` |
| — | `SearchPageList.tsx` | All·Pages 탭 Pages 리스트 래퍼 (구분선·간격) |
| — | `SearchPageListItem.tsx` | Pages / list 단일 행 (`search_page__*`) |

아이콘: [ICON_GUIDE.md](./ICON_GUIDE.md) Search 표 · 컴포넌트: `btn-text-30` Explore · `guide_field--search` Hero

호버 (All 탭): `search_all__product-tit` · `search_all__media-tit` · `search_page__tit` — primary + underline (Media 썸네일 zoom 없음)

반응형: PC 781px 이상은 기본 레이아웃, tablet 600~780px은 All Product/Media·Products·Media 탭 2열(`40px 20px`), mobile 599px 이하는 1열입니다.

---

## Services — Service Center (`/services/service-center`) — `services.css`

페이지 래퍼: `.support-page--service-center` · `P-FO-SERV-010000P` · Figma PC [6023:137684](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6023-137684) · 모바일 [6880:146534](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-146534)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `company-about-title` | `ServiceCenterTitle.tsx` | `service-center-title` · `CompanyAboutTitleSection` |
| 2 | `support_service_cards` | `ServiceCenterCards.tsx` | `service-center-cards` · Figma `## 01_Card Group` |
| 3 | `support_service_banner` | `ServiceCenterBanner.tsx` | `service-center-banner` · Figma `## 02_Banner` |
| 4 | `support_service_offering` | `ServiceCenterOffering.tsx` | `service-center-offering` · Our Services · Swiper |
| 5 | `support_service_flow` | `ServiceCenterFlow.tsx` | `service-center-flow` · 5단계 플로우 · CTA `btn-text-30` + `icon_link-14` (Figma [7577:140048](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=7577-140048)) |
| 6 | `support_service_gics` | `ServiceCenterGics.tsx` | `service-center-gics` · Service Platform |
| 7 | `common_faq` | `CommonFaq.tsx` | `service-center-faq` |

데이터: `serviceCenterContent.ts` · breadcrumb: Services > Service center

**반응형** (`services.css`)

| 구간 | 비고 |
|------|------|
| PC `min-width: 781px` | 카드 행 레이아웃 · Flow 가로 다이어그램 |
| 모바일 `max-width: 780px` | Cards 1열(`display: contents`) · Flow 세로 트랙 · Figma 6880:146534 |
| 태블릿 `640–1200px` | Cards 2열 그리드 · KB full width · Flow diagram center |
| 태블릿 PC `781–1200px` | Flow diagram `width: 1440px` + `translateX(-50%)` |

### `support_service_cards`

```tsx
<section className="support_service_cards" id="service-center-cards">
  <div className="inner">
    <div className="support_service_cards__row support_service_cards__row--primary">
      <article className="support_service_cards__kb">...</article>
      <div className="support_service_cards__pair">
        <a className="support_service_cards__card">...</a>
      </div>
    </div>
    <div className="support_service_cards__row support_service_cards__row--secondary">
      <a className="support_service_cards__card">...</a>
    </div>
  </div>
</section>
```

| 블록 | 클래스 | 비고 |
|------|--------|------|
| Knowledge Base | `support_service_cards__kb` | `#0f1f45` 패널 642px |
| KB 링크 | `support_service_cards__kb-btn` | `btn-base btn-lv02` · `icon_link-14` · Power Products `215px` 고정 · Automation Products 콘텐츠 너비 |
| 링크 카드 | `support_service_cards__card` | 5장 · SVG `icon-*.svg` 80px |
| 아이콘 | `support_service_cards__icon` | `/pub/img/services/service-center/icon-*.svg` |

**호버** (`transition: 0.3s`)

| 대상 | 효과 |
|------|------|
| `support_service_cards__card` | 배경 `#f5f7fa` · `__tit` 밑줄 |
| `support_service_cards__kb-btn` | 배경 `#ddd` |

### `support_service_banner`

```tsx
<section className="support_service_banner" id="service-center-banner">
  <div className="support_service_banner__bg" aria-hidden="true">
    <img src="..." alt="" />
  </div>
  <div className="inner support_service_banner__inner">
    <h2 className="support_service_banner__tit">...</h2>
    <p className="support_service_banner__desc">...</p>
    <Link className="btn-base btn-lv01 btn-lv01--line-solid support_service_banner__cta">...</Link>
  </div>
</section>
```

- 배경: `help-01.jpg` · `object-fit: cover` · `min-height: 340px`
- **호버**: `section:hover .support_service_banner__cta` — `common_banner_01` / `support_service_warranty_banner` 패턴 (`#fff` 배경 · `var(--color-primary)` 텍스트)

| 헬퍼 (섹션 루트 아님) | 비고 |
|----------------------|------|
| `SwiperBarControls` · `SwiperNavButtons` | Offering 캐러셀 |
| `btn-text-30` | Flow · G-ICS CTA |
| `icon_link-14` | G-ICS CTA · KB 버튼 |
| `ServiceCenterHelp.tsx` | 페이지 미사용 (레거시) |

---

## Services — Warranty Policy (`/services/warranty-policy`) — `services.css`

페이지 래퍼: `.support-page--warranty-policy` · `P-FO-SERV-020000P` · Figma PC [5552:123797](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-123797) · 모바일 [6880:144569](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-144569)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `company-about-title` | `WarrantyPolicyTitle.tsx` | 공통 타이틀 |
| 2 | `support_service_warranty_coverage` | `WarrantyPolicyCoverage.tsx` | `warranty-coverage` |
| 3 | `support_service_warranty_banner` | `WarrantyPolicyBanner.tsx` | `warranty-support` |
| 4 | `support_service_warranty_extension` | `WarrantyPolicyExtension.tsx` | `warranty-extension` |
| 5 | `support_service_warranty_apply` | `WarrantyPolicyApply.tsx` | `warranty-apply` |

데이터: `warrantyPolicyContent.ts` · breadcrumb: Services > Warranty Policy

| 헬퍼 (섹션 루트 아님) | 컴포넌트 | 비고 |
|----------------------|----------|------|
| `support_service_warranty_cards` | `WarrantyFeatureCards.tsx` | coverage · extension 카드 그리드 |
| `support_service_warranty_bullets` | Coverage · Extension 내부 | 불릿 리스트 |
| `support_service_warranty_table` | Coverage · Apply | `--3col` · `--2col` |
| `WarrantyTableScroll` | Coverage · Apply | 모바일 가로 스크롤 · Coverage swipe overlay · Apply `stickyFirstCol` |
| `support_service_warranty_panel` | Extension 내부 | 2열 패널 |
| `btn-lv01--line-solid` | Banner CTA | [COMPONENT_GUIDE](./COMPONENT_GUIDE.md) |

**반응형** (`services.css`)

| 구간 | 비고 |
|------|------|
| PC `min-width: 781px` | 카드 4열 · 테이블 풀폭 · 배너 PC 이미지 |
| 모바일 `max-width: 780px` | 카드 1열 · Coverage `WarrantyTableScroll` + `ico_swipe_70` (Figma [6880:144915](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-144915)) · Apply sticky 1열 + edge shadow (Figma [6880:144576](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-144576)) · 배너 `banner-bg-mo.jpg` |
| 태블릿 `640–1200px` | `support_service_warranty_cards` 2열 (PC/모바일 규칙 이후 선언) |

---

## Services — Engineering Training (`/services/engineering-training`) — `training.css`

페이지 래퍼: `.support-page--engineering-training` · `P-FO-SERV-030000P` · Figma PC [5552:120879](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-120879) · Curriculum 모바일 [6880:148209](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-148209)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `company-about-title` | `EngineeringTrainingTitle.tsx` → `CompanyAboutTitleSection` | `engineering-training-title` · Figma 5552:120911 |
| 2 | `support_service_training_curriculum` | `EngineeringTrainingCurriculum.tsx` | `engineering-training-curriculum` · Figma 5552:120881 |

데이터: `engineeringTrainingContent.ts` · breadcrumb: Services > Training > Engineering Training  
구성: Title → Curriculum만 (`support_service_training_intro` 없음)

## Services — Service Training (`/services/service-training`) — `training.css`

페이지 래퍼: `.support-page--service-training` · `P-FO-SERV-030000P_1` · Engineering Training 커리큘럼 목록 복제 (동일 `support_service_training_curriculum` / card 패턴 · CSS 공유)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `company-about-title` | `ServiceTrainingTitle.tsx` | `service-training-title` |
| 2 | `support_service_training_curriculum` | `ServiceTrainingCurriculum.tsx` | `service-training-curriculum` |

데이터: `serviceTrainingContent.ts` · breadcrumb: Services > Training > Service Training  
라이브: `/services/service-training`

## Services — Sales Training (`/services/sales-training`) — `training.css`

페이지 래퍼: `.support-page--sales-training` · `P-FO-SERV-030000P_2` · Engineering Training 커리큘럼 목록 복제 (동일 `support_service_training_curriculum` / card 패턴 · CSS 공유)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `company-about-title` | `SalesTrainingTitle.tsx` | `sales-training-title` |
| 2 | `support_service_training_curriculum` | `SalesTrainingCurriculum.tsx` | `sales-training-curriculum` |

데이터: `salesTrainingContent.ts` · breadcrumb: Services > Training > Sales Training  
라이브: `/services/sales-training`

### `support_service_training_curriculum`

```tsx
<section className="support_service_training_curriculum">
  <div className="inner">
    <div className="support_service_training_curriculum__filters">...</div>
    <ul className="support_service_training_curriculum__list">
      <li className="support_service_training_curriculum__item">...</li>
    </ul>
    <PageNumbering className="support_service_training_curriculum__pagination" />
  </div>
</section>
```

- 필터: `guide_field--h50` · `--w200` · `--fill-muted` · `--search` 280px (Figma [5552:120847](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-120847)) — [COMPONENT_GUIDE](./COMPONENT_GUIDE.md) `#dropdown` · `#search-280`
- 리스트 10건 · `PageNumbering` UI 1~5 (`totalPages: 5`, `pageSize: 5`)
- 검색 입력은 로컬 state만 (목록 필터 미연동)
- **PC** (`min-width: 781px`): 카드 가로 380×246 · 리스트 구분선 · 필터 우측 정렬
- **모바일** (`max-width: 780px` · Figma [6880:148209](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-148209)): 필터 세로 gap 10 · 카드 세로(이미지 230px) · 리스트 gap 40 · 페이지네이션 상단 라인
- **태블릿** (`640–1200px`): 리스트 2열 그리드 · 카드 세로 레이아웃 (PC/모바일 규칙 이후 선언)
- **GuideSelect 모바일**: `useNativeOnMobile` → `.MuiNativeSelect-icon`에 `ico_up_16` 배경 (`training.css` · [COMPONENT_GUIDE](./COMPONENT_GUIDE.md) Textfield)

| 헬퍼 (섹션 루트 아님) | 컴포넌트 | 비고 |
|----------------------|----------|------|
| `support_service_training_card` | `EngineeringTrainingCard.tsx` | 리스트 카드 전체 `Link` (Figma [5552:120891](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-120891)) · PC 380×246 · 상세 `/services/engineering-training/{courseId}` |

---

## Services — Engineering Training Detail (`/services/engineering-training/[courseId]`) — `training.css`

페이지 래퍼: `.support-page--engineering-training-detail` · `P-FO-SERV-030100P` · Figma PC [5552:120915](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-120915) · 모바일 [6880:148338](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-148338)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `support_service_training_detail_hero` | `EngineeringTrainingDetailHero.tsx` | `engineering-training-detail-hero` · Figma 5552:121017 |
| 2 | `support_service_training_detail_schedule` | `EngineeringTrainingDetailSchedule.tsx` | `engineering-training-detail-schedule` · Month + Training Type 필터 · 세션 카드 (Figma [5841:98210](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5841-98210) · [5841:98213](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5841-98213)) |

데이터: `engineeringTrainingDetailContent.ts` · breadcrumb: Services > Training > Engineering Training > Engineering Training curriculum

**모바일** (`max-width: 780px` · Figma [6880:148338](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-148338))

| 섹션 | 비고 |
|------|------|
| Hero | 이미지 full-bleed 375×242 · 텍스트 20px inset · divider 숨김 · 타이틀 28/38 |
| Schedule | 필터 세로 gap 10 · 리스트 gap 40 · 날짜→카드 14 · 카드 padding 30×24 · radius 4 · tag→본문 8 · 본문→meta 20 · Figma [6880:148341](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=6880-148341) |
| PC | `min-width: 781px` 전용 (가로 히어로 · absolute 세션 카드) |

라우트 예: `/services/engineering-training/breaker-training`

---

## Services — Engineering Training Session (`/services/engineering-training/[courseId]/[sessionId]`) — `training.css`

페이지 래퍼: `.support-page--engineering-training-session` · `P-FO-SERV-030101P` · Figma [5552:121029](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-121029)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `support_service_training_session_detail` | `EngineeringTrainingSessionDetail.tsx` | `engineering-training-session-detail` · 탭 · 아젠다 · 등록 폼 · Error sample 유형당 1개 (Text Student Name · Search Street · Select Type of Business · Checkbox Consent) · [1689:8145](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1689-8145) · 사이드바 `__aside--pc` / `__aside--mo` |

데이터: `engineeringTrainingSessionDetailContent.ts` · breadcrumb: Services > Training > Engineering Training > curriculum > session date

| 헬퍼 (섹션 루트 아님) | 컴포넌트 | 비고 |
|----------------------|----------|------|
| `EngineeringTrainingSessionCountdown` | countdown | Time Remaining · DAYS / HOURS / MINS (초 없음 · Figma [8007:106738](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=8007-106738)) · PC `session-countdown-bg.svg` · MO `session-countdown-bg-mo.svg` |
| `support_service_training_session_detail__share` | title row | `/pub/ico/ico_share_*_44.svg` (20px) · `__share-link` 44px `#f5f5f5` 원형 CSS · gap 18px |
| `support_service_training_session_detail__meta-icon` | sidebar meta | `/pub/ico/ico_training_*_18.svg` — Figma 5552:121284 · date/duration/products `opacity: 0.3` |
| `EngineeringTrainingSessionDetailForm` | registration | `guide_field` · consent checkbox |
| `support_service_training_session_detail__calendar-actions` | Add to Calendar | Figma 5552:121281 · `btn-lv01--line` 220×52 · gap 16px · Google G + iCal 아이콘 18px |
| `support_service_training_session_detail__table` | agenda PC | No · Time · Contents · Trainer · swipe (`SessionDetailTableScroll`) |
| `support_service_training_session_detail__agenda-list` | agenda MO | 타임라인 · `__agenda-dot` (`ico_agenda_dot_8`) · Figma [8007:107681](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=8007-107681) |

라우트 예: `/services/engineering-training/breaker-training/jul-14-2026`

---

## Services — Request for Training (`/services/request-for-training`) — `training.css`

페이지 래퍼: `.support-page--request-for-training` · `P-FO-SERV-040000T_step_01` · Figma [5601:125956](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5601-125956)

| 순서 | 클래스 | 컴포넌트 | id · 비고 |
|------|--------|----------|-----------|
| 1 | `company-about-title` | `RequestForTrainingTitle.tsx` | `request-for-training-title` |
| 2 | `support_service_training_request` | `RequestForTraining.tsx` | `request-for-training` · 4단계 스텝바 · Step 1 폼 · Error sample 유형당 1개 (Search Keyword · Text Address 2) · [1689:8145](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1689-8145) · Next 220×52 |

데이터: `requestForTrainingContent.ts` · breadcrumb: Services > Training > Request for Training

| 헬퍼 (섹션 루트 아님) | 컴포넌트 | 비고 |
|----------------------|----------|------|
| `RequestForTrainingSteps` | step bar | `getRequestForTrainingSteps(n)` · `step-bar-bg.png` · `/pub/ico/ico_request_training_*` · completed `#e60040` 원형 CSS |
| `RequestForTrainingStep1Form` | Step 1 questionnaire | `guide_field` · radio · select · street search |
| `RequestForTrainingStep2Form` | Step 2 questionnaire | 세션 수·일수 · 날짜 범위(MUI DatePicker · `ico_calendar_18`) · 수강 인원 |
| `RequestForTrainingStep3Form` | Step 3 questionnaire | Training Type · 주소 · 연락처 |
| `RequestForTrainingStep4Form` | Step 4 questionnaire | `variant: power \| automation` · 제품 체크·태그 · 동의 · reCAPTCHA |

라우트: Step 1 `/services/request-for-training` · Step 2 `/services/request-for-training/step-2` · Step 3 `/services/request-for-training/step-3` · Step 4 Power `/services/request-for-training/step-4` · Step 4 type_01 `/services/request-for-training/step-4-type_01`

---

## 공유·레이아웃 패턴 (섹션 루트 아님)

| 패턴 | 컴포넌트 | CSS | 비고 |
|------|----------|-----|------|
| `main_footer` | `MainFooter.tsx` | `MainFooter.css` | 뉴스레터 · `btn_flat` Submit hover `#f5f7fa`/`#fff` · `footerAffiliateOptions` (13 계열사 · 새 탭) · `main_footer_02` |
| `product_award_badge` | `ProductAwardBadge.tsx` | `product-award-badge.css` | `type2` · standalone 그리드만 |
| `common_modal` | `ContactUsViewResponseModal.tsx`, `ContactUsViewResponseDetailModal.tsx`, `PrivacyPolicyModal.tsx`, `ContactUsTermsModal.tsx`, `MarketsReferencesModal.tsx` | `globals.css` · Markets 모달은 **body portal** |
| `btn-line-30` | `CommonBanner02CopyLink.tsx` 등 | `globals.css` | [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) |

---

## 가이드·개발

| 클래스 | 용도 |
|--------|------|
| `page-index` | 페이지 인덱스 |
| `component-guide` | 컴포넌트 가이드 |
| `guide-doc` + `ico-guide` | 아이콘 가이드 |
| `gnb_mega__col` | GNB 메가 메뉴 (`gnb.css`) |

---

*새 섹션 추가 시 이 표 · `sectionGuide.ts` · `SectionGuidePreviews.tsx`를 함께 갱신합니다.*
