# Section Class Registry

사용 중인 **섹션 루트 클래스** 레지스트리입니다. 마크업 규칙·워크플로는 [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md)를 참고하세요.

- **라이브**: `/guide/sections`
- **데이터**: `src/data/sectionGuide.ts` · **미리보기**: `SectionGuidePreviews.tsx`

---

## 카테고리 (`sectionGuide.ts`)

| id | 라벨 | CSS | 라이브 |
|----|------|-----|--------|
| `main` | Main | `main.css` | `/main` |
| `markets` | Markets | `markets.css` | `/markets/data-center` |
| `devices` | Devices & Systems | `devices-systems.css` | `/devices-systems/motor-control` |
| `product` | Product Detail | `devices-systems.css`, `devices-product-detail.css` | `/devices-systems/motor-control/metasol-ms` |
| `company-blog` | Company — Blog | `company.css` | `/company/blog` |
| `company-press` | Company — Press | `company.css` | `/company/press` |
| `company-events` | Company — Events | `company.css` | `/company/events` |
| `company-article-detail` | Company — Article Detail | `company.css` | `/company/blog/detail` |
| `common` | Common | `globals.css`, `main.css` | — |
| `support` | Support — Connect Portal | `support.css` | `/support/connect-portal` |
| `support-download` | Support — Download Center | `support.css`, `devices-product-detail.css` | `/support/download-center` |
| `support-tech-hub` | Support — Tech Hub | `support.css`, `devices-product-detail.css` | `/support/tech-hub` |
| `support-contact-us` | Support — Contact Us | `support.css` | `/support/contact-us` |
| `support-where-to-buy` | Support — Where to Buy | `support.css` | `/support/where-to-buy` |
| `support-tech-hub-view` | Support — Tech Hub View | `support.css`, `devices-product-detail.css` | `/support/tech-hub/view` |

---

## Main (`/main`) — `main.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `main_visual` | `MainVisual.tsx` | `main_notic`·`video-swiper-section`·`banner_swiper` 포함 |
| `main_notic` | `MainVisual.tsx` | `main_visual` 하단 (가이드 미등록) |
| `main_info` | `MainInfo.tsx` | |
| `main_cards` | `MainCards.tsx` | |
| `main_products` | `MainProducts.tsx` | |
| `icon_cards` | `IconCards.tsx` | |
| `what_we_do__inner` | `WhatWeDoSwiper.tsx` | 레거시: `__inner`가 루트 |
| `video-swiper-section` | `VideoSwiper.tsx` | `<div>`, `main_visual` 내부 (가이드 미등록) |
| `banner_swiper` | `BannerSwiper.tsx` | `<div>`, `main_visual` 내부 (가이드 미등록) |

---

## Markets (`/markets/...`) — `markets.css`

| 클래스 | 컴포넌트 | id |
|--------|----------|-----|
| `markets_hero` | `MarketsHero.tsx` | — |
| `markets_stats` | `MarketsStats.tsx` | — |
| `markets_intro` | `MarketsIntro.tsx` | — |
| `markets_explore` | `MarketsExplore.tsx` | — |
| `markets_references` | `MarketsReferences.tsx` | — |
| `markets_benefits` | `MarketsBenefits.tsx` | — |
| `markets_solutions` | `MarketsSolutions.tsx` | `markets-solutions` |
| `markets_why` | `MarketsWhy.tsx` | — |
| `markets_products` | `MarketsProducts.tsx` | — |

---

## Devices & Systems — `devices-systems.css`

| 클래스 | 컴포넌트 | modifier |
|--------|----------|----------|
| `devices_hero` | `DevicesHero.tsx` | `--with-products` (`devices_products` 임베드) |
| `devices_products` | `DevicesProducts.tsx` | `--embedded` (가이드 미등록, `devices_hero`에 포함) |
| `devices_category` | `DevicesCategoryList.tsx` | `--stacked` |
| `devices_markets` | `DevicesMarkets.tsx` | — |
| `devices_help` | `DevicesHelp.tsx` | `--overlay` |

---

## Product Detail — `devices-product-detail.css`

| 클래스 | 컴포넌트 | id |
|--------|----------|-----|
| `devices_product_hero` | `DevicesProductHero.tsx` | `product-top` |
| `devices_hvdc_hero` | `DevicesHvdcHero.tsx` | `product-top` |
| `devices_hvdc_overview` | `DevicesHvdcOverview.tsx` | `product-overview` |
| `devices_product_features` | `DevicesProductKeyFeatures.tsx` | `product-key-feature` |
| `devices_product_lineup` | `DevicesProductLineup.tsx` | `product-lineup` |
| `devices_product_downloads` | `DevicesProductDownloads.tsx` | `product-downloads` |
| `devices_product_video` | `DevicesProductVideo.tsx` | `product-video` |
| `devices_product_other` | `DevicesProductOtherProducts.tsx` | `product-other` |
| `devices_product_benefits` | `DevicesProductBenefits.tsx` | `product-benefits` |
| `devices_product_applications` | `DevicesProductApplications.tsx` | `product-applications` |
| `devices_product_why` | `DevicesProductWhy.tsx` | `product-why` |

페이지 래퍼: `.devices-page--product`

---

## Company — Blog (`/company/blog`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-blog-title` | `blog/page.tsx` | 페이지 타이틀 |
| `company-blog-top` | `blog/page.tsx` | 히어로 배경 · 하위 `company-blog-featured__*` |
| `company-blog-list` | `blog/page.tsx` | 툴바 · 리스트 · 페이지네이션 |

페이지 래퍼: `.company-page--blog`

---

## Company — Press (`/company/press`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-press-title` | `CompanyPressTitle.tsx` | 페이지 타이틀 |
| `company-press-featured` | `CompanyPressFeatured.tsx` | Featured 카드 · `btn-text-30` Explore |
| `company-press-list` | `CompanyPressListSection.tsx` | 툴바 · 그리드 · 페이지네이션 |
| `company-press-list--no-data` | `CompanyPressEmpty.tsx` | 검색 결과 없음 · View All |

페이지: `/company/press` · `/company/press/no-data` (`.company-page--press`)

---

## Company — Events (`/company/events`) — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-press-title` | `CompanyPressTitle.tsx` | Events 타이틀 (공통 패턴) |
| `company-events-featured` | `CompanyEventsFeatured.tsx` | Swiper `slidesPerView/Group: 2` (PC) · bar controls |
| `company-events-calendar` | `CompanyEventsCalendar.tsx` | 월별 일정 리스트 |
| `company-events-past` | `CompanyEventsPastSection.tsx` | Past Events 그리드 |

페이지 래퍼: `.company-page--events`

---

## Company — Article Detail — `company.css`

| 클래스 | 컴포넌트 | 비고 |
|--------|----------|------|
| `company-article-detail` | `CompanyArticleDetail.tsx` | `--blog` · `--press` · `--events` |

페이지: `/company/blog/detail` · `/company/press/detail` · `/company/events/detail`

---

## Common — `globals.css` · `main.css`

| 클래스 | 컴포넌트 | CSS |
|--------|----------|-----|
| `common_banner_01` | `CommonBanner01.tsx` | `globals.css` |
| `common_banner_02` | `CommonBanner02.tsx` | `globals.css` |
| `common_banner_03` | `CommonBanner03.tsx`, `CommonBanner03Link.tsx` | `main.css` |
| `common_banner_04` | `CommonBanner04.tsx` | `globals.css` |
| `common_faq` | `CommonFaq.tsx` | `globals.css` |
| `highlight_news` | `HighlightNewsSection.tsx` | `globals.css` (`--main`, `--markets`) |

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
| `support_download_contents` | `DownloadCenterContents.tsx` | `support-download-contents` — 레지스트리만 (`devices_product_downloads--center`) |

---

## Support — Tech Hub (`/support/tech-hub`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_tech_hub_title` | `TechHubTitle.tsx` | `support-tech-hub-title` |
| `support_tech_hub_search` | `TechHubSearch.tsx` | `support-tech-hub-search` |
| `support_tech_hub_contents` | `TechHubContents.tsx` | `support-tech-hub-contents` — `devices_product_downloads--tech-hub` (`--no-data`: `/support/tech-hub/no-data`) |
| `support_tech_hub_empty` | `TechHubEmpty.tsx` | contents 내부 (Figma 3670:30917, 가이드 미등록) |

---

## Support — Contact Us (`/support/contact-us`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_contact_title` | `ContactUsTitle.tsx` | `support-contact-title` |
| `common_banner_02` | `ContactUsBanner.tsx` → `CommonBanner02.tsx` | `support-contact-banner` — `linkWrapPanel={false}` |
| `support_contact_form` | `ContactUsForm.tsx` | `support-contact-form` — Figma 3670:30232 |
| `support_contact_terms_modal` | `ContactUsTermsModal.tsx` | `/support/contact-us/terms-modal` — Figma 3670:30503 |

페이지 래퍼: `.support-page--contact-us`

---

## Support — Where to Buy (`/support/where-to-buy`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----------|
| `support_where_to_buy_title` | `WhereToBuyTitle.tsx` | `support-where-to-buy-title` |
| `support_where_to_buy_search` | `WhereToBuySearch.tsx` | `support-where-to-buy-search` |
| `support_where_to_buy_contents` | `WhereToBuyContents.tsx` | `support-where-to-buy-contents` — Figma 3670:30637 (`--no-data`: `/support/where-to-buy/no-data`) |
| `support_where_to_buy_empty` | `WhereToBuyEmpty.tsx` | contents 내부 (Figma 3670:30719, 가이드 미등록) |

---

## Support — Tech Hub View (`/support/tech-hub/view`) — `support.css`

| 클래스 | 컴포넌트 | id · 비고 |
|--------|----------|-----|
| `support_tech_hub_view` | `TechHubView.tsx` | `support-tech-hub-view` — Figma 3670:31687 |

페이지 래퍼: `.support-page--tech-hub-view`

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
