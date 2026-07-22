# Component Guide

Figma [LSEA 디자인](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8) 기반 UI 컴포넌트 구현 가이드입니다.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide/components` → `src/components/guide/ComponentGuide.tsx` |
| **스타일** | `src/assets/css/globals.css` (토큰·버튼·필드·배너·모달) |
| **가이드 UI** | `src/assets/css/components/guide.css` |
| **허브** | [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) |

`basePath`가 `/pub`이므로 브라우저 URL은 `/pub/guide/components`입니다. 문서·코드 내부 링크는 `/guide/...` 형식을 사용합니다.

---

## 목차

1. [참조 순서](#참조-순서-figma--코드)
2. [Figma 매핑 (04~08)](#figma-매핑-0408)
3. [디자인 토큰](#디자인-토큰-root)
4. [Button · Check · Textfield · Pagination · Banner](#button-04)
5. [React 컴포넌트 맵](#react-컴포넌트-맵-가이드-외-공유)
6. [구현 원칙 · 갱신 · 금지](#구현-원칙)

---

## 참조 순서 (Figma → 코드)

1. [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) — 가이드 허브
2. **이 문서** + `/guide/components`
3. [ICON_GUIDE.md](./ICON_GUIDE.md) — SVG·PNG·CSS 아이콘 유틸
4. [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) — 페이지 섹션 마크업
5. [GNB_GUIDE.md](./GNB_GUIDE.md) — GNB·메가 메뉴 (GNB 작업 시)

---

## Figma 매핑 (04~08)

| Figma | 앵커 | 클래스·패턴 |
|-------|------|-------------|
| 04 Button | `#button` | `btn-base`, `btn-lv01`~`03`, `btn-icon-56`, `btn-text-30`, `btn-line-30`, `btn_flat`, Swiper nav, Scroll to top |
| 05 Check | `#check` | MUI `Checkbox` + `GuideCheckboxIcon` (22px) |
| 06 Textfield | `#textfield` | MUI `TextField`/`Select`, `.guide_field`, 50px/38px |
| 07 Pagination | `#pagination` | `PageNumbering`, `ico_pag_chev_10.svg` |
| 08 Banner | `#banner` | `common_banner_01`~`04`, `btn-text-30`, `btn-lv01--line-solid` |

### 라이브 앵커 전체 목록

| 앵커 | 섹션 |
|------|------|
| `#button` | Button (04) |
| `#level-01` | `btn-lv01` — `--line-solid`, `--solid`, `--line` |
| `#level-02` | `btn-lv02` — `--solid`, `--more` |
| `#level-03` | `btn-lv03` — `--solid`, `--line` |
| `#icon-56` | `btn-icon-56`, `btn-icon-56--top` (Scroll to top) |
| `#text-30` | `btn-text-30` + `btn-text-30__icon` (arrow / link / external) |
| `#btn-line-30` | `btn-line-30`, `btn-line-30--on-dark` (Copy Link) |
| `#rolling-50` | `SwiperBarControls`, `SwiperNavButtons` |
| `#check` | Check (05) |
| `#check-22` | 22px 체크박스 세트 (default / Downloads) |
| `#textfield` | Textfield (06) |
| `#textfield-280` | Text field 280px |
| `#search-280` | Search field 280px + `ico_search_24` |
| `#search-80` | Search field 80px full-width (`/search` hero) |
| `#dropdown` | Select 50px / 38px |
| `#pagination` | Pagination (07) |
| `#pagination-page-numbering` | `PageNumbering` |
| `#banner` | Banner (08) |
| `#banner-01` ~ `#banner-04` | `common_banner_01` ~ `04` |
| `#banner-02-expert` | `common_banner_02` `variant="expert"` |

---

## 디자인 토큰 (`:root`)

| 변수 | 값·용도 |
|------|---------|
| `--color-primary` | `#0f1f45` — CTA·활성 pill |
| `--color-accent` | `#e60040` — 강조·호버 |
| `--color-text` / `--color-text-muted` | `#222` / `#666` |
| `--field-h` | `50px` — 기본 입력 높이 |
| `--btn-lv01-h` | `52px` |
| `--btn-lv02-h` | `46px` |
| `--btn-lv03-h` | `42px` |
| `--btn-icon-56` | `56px` — 원형 아이콘 버튼 |
| `--btn-rolling-50` | `50px` — 스와이퍼 바 컨트롤 |
| `--inner-max` | `1440px` |
| `--font-display` | `jaka` |
| `--font-body` | `Pretendard Variable` |
| 전역 scrollbar | 3px · track `#e8e8e8` · thumb `#888` · hover `#666` (Firefox `thin`) |

버튼·필드 스타일은 `section` 스코프 아래 정의됩니다 (`section .btn-lv01` 등). 페이지 섹션 마크업은 [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md)를 따릅니다.

---

## Button (04)

### Level 버튼

| 클래스 | 높이 | 용도 |
|--------|------|------|
| `btn-base` | — | 공통 flex·radius·disabled |
| `btn-lv01` + modifier | 52px | 주요 CTA (`--line-solid`, `--solid`, `--line`) |
| `btn-lv02` + modifier | 46px | 보조 CTA (`--solid`, `--more`) |
| `btn-lv03` + modifier | 42px | 소형 CTA (`--solid`, `--line`) |

아이콘 조합: `--line` → `icon_download` · `--more` → `icon_more` / `icon_plus` · `--line-solid` → `icon_arrow-18`

### Icon 56px

| 클래스 | 아이콘 유틸 | SVG |
|--------|-------------|-----|
| `btn-icon-56` | `icon_arrow-20` | `ico_arrow_right_24_blue.svg` |
| `btn-icon-56--top` | `icon_arrow-top-20` | `ico_arrow_up_20.svg` |

실사용: `ScrollToTopButton` → `.scroll_to_top__btn` + `.scroll_to_top__icon` (`layout.tsx` 전역)

### Text / Line 30px

| 클래스 | 아이콘 | 용도 |
|--------|--------|------|
| `btn-text-30` | `icon_arrow-14`, `icon_link-14`, `icon_arrow-18`, `icon_external-18` | 섹션 More·링크 CTA |
| `btn-line-30` | `btn-line-30__icon--copy` | Copy Link (라이트) |
| `btn-line-30--on-dark` | white copy | 다크 배경 Copy |

### Flat · Rolling

| 클래스 / 컴포넌트 | 용도 |
|-------------------|------|
| `btn_flat` | Footer 뉴스레터 Submit (`BtnFlat.tsx`, `MainFooter`, `CommonFooter`) |
| `SwiperBarControls` | 진행 바 + prev/next (`SwiperBarControls.tsx`) |
| `SwiperNavButtons` | 원형 prev/next (`SwiperNavButtons.tsx`) |
| `BannerNavButtons` | 메인 배너 네비 (`BannerNavButtons.tsx`) |

#### `btn_flat` 스코프

| 스코프 | CSS | 기본 | `:hover` |
|--------|-----|------|----------|
| `.main_footer .btn_flat` | `globals.css` | `--color-accent` 배경 · `#fff` 텍스트 | `--color-accent-hover` |
| `.main_footer__submit .btn_flat` | `MainFooter.css` | `#fff` 배경 · `#0c1625` 텍스트 | `#f5f7fa` 배경 · `#fff` 텍스트 |
| `.common_footer .btn_flat` | `CommonFooter.css` | 페이지별 오버라이드 | |

---

## Check (05)

MUI `Checkbox` + `GuideCheckboxIcon` (`src/components/form/GuideFieldIcons.tsx`)

| export | unchecked | checked | 사용처 |
|--------|-----------|---------|--------|
| `guideCheckboxIconsDefault` | `ico_check.svg` | `ico_checked.svg` | 가이드·일반 폼 |
| `guideCheckboxIconsDownloads` | `ico_check_block.svg` | `ico_checked_black.svg` | Downloads 필터 |
| `guideCheckboxIconsContactConsent` | `ico_checkbox_off_22.png` | `ico_checkbox_on_22.png` | Cookie Preferences · Contact Us · Training 폼 (Figma Check 2030:31397/31398) |
| Footer 관심분야 | CSS 흰 테두리 | `ico_checked_footer_22.svg` | `MainFooter.css` |

라디오·비밀번호 PNG는 [ICON_GUIDE.md](./ICON_GUIDE.md) Form 섹션 참고.

---

## Textfield (06)

MUI `TextField` / `FormControl` + `GuideSelect` + 클래스 `.guide_field`

| modifier | 의미 |
|----------|------|
| `guide_field--h50` | Select 높이 50px (기본 `--field-h`) |
| `guide_field--h38` | Select 높이 38px (Downloads 버전 등) |
| `guide_field--w200` | 너비 200px |
| `guide_field--w120` | 너비 120px |
| `guide_field--search` | 검색 필드 + endAdornment |
| `guide_field--fill-muted` | Select 배경 `#f5f5f5` (Lv/Sub Category 등) |
| `guide_field--error-gap` | helperText 여백 |

| 헬퍼 | 역할 |
|------|------|
| `GuideSelect` | MUI Select 래퍼 (`src/components/form/GuideSelect.tsx`) |
| `GuideSelectIcon` | chevron (`ico_up_16` via CSS background) |
| `guideFieldLabelSlot` | `InputLabel` shrink 기본값 |

**모바일 (`max-width: 780px`)** — `GuideSelect` 기본 `useNativeOnMobile: true` → MUI `Select native`. 아이콘 클래스가 `.MuiSelect-icon`이 아니라 `.MuiNativeSelect-icon`이므로, 페이지 CSS에서 화살표 배경을 별도 지정해야 한다 (예: `training.css` curriculum · `devices-systems.css` explore). `appearance: none`으로 OS 기본 화살표를 숨긴다.

실사용 페이지: `devices_product_downloads`, `support_download_*`, `support_where_to_buy_*`, `support_service_training_curriculum`, `company-press-list` (`CompanyPressListToolbar` · `#dropdown`), `company-events-past`, `company-blog-list`, `search_all_hero` 등.

`globals.css`는 위 섹션 루트를 스코프로 `.guide_field` 공통 스타일을 적용합니다. 페이지 전용 오버라이드는 해당 CSS(`training.css` 등)에 둡니다.

### Search field 변형

| 변형 | 높이·너비 | CSS 스코프 | 실사용 |
|------|-----------|------------|--------|
| Toolbar | 50px · 280px | `globals.css` | Download Center, Tech Hub, Where to Buy (`#search-280`) |
| Hero | 80px · 100% | `search.css` · `section.search_all_hero` | `/search` · `SearchAllHero.tsx` (`#search-80`) |

Hero 변형은 `search_all_hero__field`·`search_all_hero__clear`·인기 태그와 함께 씁니다. Clear는 30px 원형 버튼 + `ico_clear_12_black`(Figma `6571:102541`)을 사용합니다. 글로벌 `guide_field--search` 규칙과 충돌하지 않도록 `section.search_all_hero` 스코프를 유지합니다.

All 탭 결과 카드 호버: Product/Media/Pages 제목에 `color: var(--color-primary)` + `text-decoration: underline`. Media 썸네일 zoom은 사용하지 않습니다. 섹션·아이콘 매핑은 [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Search · [ICON_GUIDE.md](./ICON_GUIDE.md) Search 표를 참고합니다.

---

## Pagination (07)

| 컴포넌트 | 경로 | 비고 |
|----------|------|------|
| `PageNumbering` | `src/components/pagination/PageNumbering.tsx` | 40×40 · active `#0F1F45` · chevron `ico_pag_chev_10.svg` · `onPageChange` 생략 시 UI만 |

실사용: Company Press/Events · Download Center · Devices Product Downloads · `support_service_training_curriculum` (1~5 페이지 UI, `engineeringTrainingContent.ts` `totalPages: 5`) 등.

---

## Banner (08)

| 앵커 | 컴포넌트 | 비고 |
|------|----------|------|
| `#banner-01` | `CommonBanner01` | 다크 CTA · `btn-lv01--line-solid` |
| `#banner-02` | `CommonBanner02` | default · 패널 링크 · `btn-text-30` |
| `#banner-02-expert` | `CommonBanner02` `variant="expert"` | 이메일 + `btn-line-30` Copy + CTA |
| `#banner-03` | `CommonBanner03` | HUB 정적 이미지 · `CommonBanner03Link` |
| `#banner-04` | `CommonBanner04` | 풀폭 다크 CTA |

> **Banner 02** — default는 Configurator 등 패널 전체 링크. expert는 제품 상세 연락 배너. **Banner 04**는 별도 풀폭 Expert CTA.

---

## React 컴포넌트 맵 (가이드 외 공유)

가이드 라이브에 없어도 프로젝트 전역에서 재사용하는 패턴입니다.

| 영역 | 컴포넌트 | CSS / 비고 |
|------|----------|------------|
| 배너 | `CommonBanner01`~`04`, `CommonBanner02CopyLink` | `globals.css` `common_banner_*` |
| 스와이퍼 | `SwiperBarControls`, `SwiperNavButtons`, `SwiperDotPagination`, `SwiperBarPagination` | 페이지별 CSS |
| FAQ | `CommonFaq`, `FaqItem` | `globals.css` `common_faq` |
| 탭 | `TabButton` | 페이지 CSS |
| 화살표 버튼 | `BtnArrow` | — |
| Flat 버튼 | `BtnFlat` | `btn_flat` |
| 모달 | `CookieSettingsModal`, `CookiePreferencesModal`, `ContactUsViewResponseModal`, `ContactUsViewResponseDetailModal`, `PrivacyPolicyModal`, `ContactUsTermsModal`, `MarketsReferencesModal` | `common_modal` · Cookie Settings 배너는 전용 셸 · Markets는 **body portal** |
| 비디오 | `DevicesProductVideoPlayer`, `VideoSwiper` | YouTube embed (`youtubeEmbed.ts`, `useYoutubeInViewPlayback`) · MP4는 `<video>` sources |
| 푸터 | `MainFooter`, `SiteFooter`, `CommonFooter` | `MainFooter.css` 등 |
| 레이아웃 | `ScrollToTopButton`, `ScrollToTopOnNavigate` | `scroll_to_top` |
| 브레드크럼 | `HeaderBreadcrumb` | `globals.css` breadcrumb |
| 뱃지 | `ProductAwardBadge` | `product-award-badge.css` |
| 검색 | `SearchAllPage`, `SearchAllTabContent`, `SearchAllHero` | `search.css` — Hero `#search-80` · All 탭 섹션 · tablet 600~780px Product/Media 2열 |
| 검색 | `SearchProductsPanel`, `SearchDocumentsPanel`, `SearchMediaPanel`, `SearchPagesPanel` | 탭별 패널 · 필터·페이지네이션 · tablet Products/Media 2열 |
| 검색 | `SearchTabActiveFilters`, `SearchDocumentsCard` | active chips · 문서 카드 · Documents MO clear `brightness(25%)` → `#222` |
| 검색 | `SearchPageList`, `SearchPageListItem` | Pages 리스트 (Figma 4701:83912) · `search_page__*` |
| 검색 필터 | `DevicesProductDownloadsFilter*` | `devices-product-detail.css` — Search 탭·Download Center 공유 |
| Services — Service Center | `ServiceCenterOffering.tsx` 등 | `services.css` — Swiper offering · flow diagram · [SECTION_CLASS_GUIDE](./SECTION_CLASS_GUIDE.md) |
| Services — Warranty Policy | `WarrantyFeatureCards.tsx` 등 | `services.css` — cards · table · banner CTA |
| Services — Engineering Training | `EngineeringTrainingCurriculum.tsx` | `guide_field--h50` · `--w200` · `--fill-muted` · `--search` · `training.css` |

### Cookie consent modals

| 컴포넌트 | 역할 | 셸·연동 |
|----------|------|---------|
| `CookieSettingsModal` | P-FO-COMMON-020000P · 동의 배너 | 전용 `cookie_settings_modal` 셸 · Settings / Reject All / Accept All |
| `CookiePreferencesModal` | P-FO-COMMON-040000M · 분류별 상세 설정 | `common_modal` 셸 · Settings에서 전환 · Necessary 필수 · 선택값 localStorage 저장 |

단독 확인 경로는 `/main/cookie-setting`, `/main/cookie-setting/preferences`이며 두 경로 모두 모달만 렌더합니다. 모바일 상세 설정은 Figma `7334:130983` 기준으로 335px 패널·24px 본문 여백·30px intro/list 간격·3px custom scrollbar·PNG Check 22px을 사용합니다. 하단 Reject/Save/Accept는 고정 footer 안에 42px 높이로 세로 배치합니다. 상세 클래스·치수는 [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md)를 참고합니다.

### Main Info 카운트업

| 패턴 | 파일 | 비고 |
|------|------|------|
| `info_box__count` ghost/live | `MainInfo.tsx` · `main.css` | 최종 숫자 ghost로 너비 고정 · `tabular-nums` · IntersectionObserver 1회 트리거 |

### Video (공유)

| 컴포넌트 | 경로 | 용도 |
|----------|------|------|
| `VideoSwiper` | `src/app/main/components/VideoSwiper.tsx` | 메인 비주얼 — 현재 3장: image · `/pub/img/video1.mp4` · image (`youtube` 타입 지원) |
| `DevicesProductVideoPlayer` | `src/components/video/DevicesProductVideoPlayer.tsx` | 제품 상세 — YouTube · `autoplayInView` 옵션 |

GNB 관련 컴포넌트는 [GNB_GUIDE.md](./GNB_GUIDE.md)를 참고합니다.

---

## 구현 원칙

- 가이드에 **이미 있는** 컴포넌트는 동일 클래스·MUI 패턴·아이콘 경로를 **재사용**한다. Figma MCP 출력(Tailwind 등)을 그대로 붙이지 않는다.
- 가이드에 **없는** Figma 컴포넌트는 기능 구현과 함께 `ComponentGuide.tsx` + `globals.css`에 섹션을 **추가**해 가이드를 갱신한다.
- 토큰·치수는 `:root` CSS 변수를 따른다.
- 아이콘은 [ICON_GUIDE.md](./ICON_GUIDE.md)를 따른다. CSS 배경 유틸(`icon_arrow-14` 등)과 `public/ico` 경로(`/pub/ico/...`)를 혼용하지 않는다.

---

## 새 컴포넌트 추가 시 갱신

1. `src/components/guide/ComponentGuide.tsx` — 미리보기 섹션·앵커 `id`
2. `src/assets/css/globals.css` — 스타일·토큰 (또는 전용 CSS)
3. 필요 시 `public/ico/` + `src/data/icoGuide.ts` + [ICON_GUIDE.md](./ICON_GUIDE.md)
4. **이 문서** — Figma 매핑·컴포넌트 맵 표

---

## 금지

- 가이드와 다른 버튼/필드/체크박스 스타일을 페이지에만 따로 정의
- 유료 UI 키트·아이콘 폰트 도입 (`.cursor/rules/no-paid-licenses.mdc`)
