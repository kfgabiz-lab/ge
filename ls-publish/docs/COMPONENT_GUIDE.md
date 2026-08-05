# Component Guide

Figma [LSEA 디자인](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8) · [04 Button](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1510-19129) 기반 UI 컴포넌트 구현 가이드입니다.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide/components` → `src/components/guide/ComponentGuide.tsx` |
| **스타일** | `src/assets/css/globals.css` (토큰·버튼·필드·배너·모달) |
| **가이드 UI** | `src/assets/css/components/guide.css` |
| **허브** | [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) |

`basePath` `/pub` — 브라우저 URL `/pub/guide/components`. 문서·코드 내부 링크는 `/guide/...` 형식.

---

## 목차

1. [참조 순서](#참조-순서-figma--코드)
2. [Figma 매핑 (04~08)](#figma-매핑-0408)
3. [디자인 토큰](#디자인-토큰-root)
4. [Button (04)](#button-04)
5. [Check (05)](#check-05)
6. [Textfield (06)](#textfield-06)
7. [Pagination (07)](#pagination-07)
8. [Banner (08)](#banner-08)
9. [React 컴포넌트 맵](#react-컴포넌트-맵-가이드-외-공유)
10. [구현 원칙 · 갱신 · 금지](#구현-원칙)

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
| [04 Button](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1510-19129) | `#button` | `btn-base`, `btn-lv01`~`03`, `btn-icon-56`, `btn-text-30`, `btn-line-30`, `btn_flat`, Swiper nav, Scroll to top |
| 05 Check | `#check` | MUI `Checkbox` + `GuideCheckboxIcon` (22px) |
| 06 Textfield | `#textfield` | MUI `TextField`/`Select`, `.guide_field`, 50px/38px |
| 07 Pagination | `#pagination` | `PageNumbering`, `ico_pag_chev_10.svg` |
| 08 Banner | `#banner` | `common_banner_01`~`04`, `btn-text-30`, `btn-lv01--line-solid` |

### 라이브 앵커

| 앵커 | 섹션 |
|------|------|
| `#button` | Button (04) |
| `#level-01` | Level 01_52px — `btn-lv01` `--line-solid` · `--solid` · `--line` |
| `#level-02` | Level 02_42px — `btn-lv02` `--solid` (가이드 미리보기) |
| `#level-03` | Level 03_42px — `btn-lv03` `--solid` · `--line` |
| `#icon-56` | `btn-icon-56`, `btn-icon-56--top` |
| `#text-30` | `btn-text-30` + `btn-text-30__icon` (arrow / link / external) |
| `#btn-line-30` | `btn-line-30`, `btn-line-30--on-dark` (Copy Link) |
| `#rolling-50` | `SwiperNavButtons` · scroll line · dark pagination · [Figma Rolling_50px](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1569-26352) |
| `#check` | Check (05) |
| `#check-22` | Check_22px (default / Downloads / Error) |
| `#textfield` | Textfield (06) |
| `#textfield-280` | Text field 280px |
| `#search-280` | Search 280px + Clear |
| `#search-80` | Search Hero 80px (`/search`) |
| `#dropdown` | Select 50px / 38px |
| `#textarea` | Textarea |
| `#password` | Password |
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
| `--color-primary-hover` | `#172c5c` |
| `--color-accent` | `#e60040` |
| `--color-text` / `--color-text-muted` | `#222` / `#666` |
| `--field-h` | `50px` |
| `--btn-lv01-h` | `52px` · min-w `220px` · px `24px` |
| `--btn-lv02-h` | `42px` · min-w `150px` · px `24px` |
| `--btn-lv03-h` | `42px` · min-w `150px` · px `24px` |
| `--btn-icon-56` | `56px` |
| `--btn-rolling-50` | `50px` |
| `--inner-max` | `1440px` |
| `--font-display` / `--font-body` | `jaka` / `Pretendard Variable` |
| 전역 scrollbar | 3px · track `#e8e8e8` · thumb `#888` · hover `#666` (Firefox `thin`) |

버튼·필드 스타일은 `section` 스코프 (`section .btn-lv01` 등). 페이지 섹션은 [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md).

---

## Button (04)

### Level 버튼

| 클래스 | 높이 | 가이드 미리보기 | 용도 |
|--------|------|-----------------|------|
| `btn-base` | — | — | 공통 flex·radius·disabled |
| `btn-lv01` + modifier | 52px | `--line-solid`, `--solid`, `--line` | 주요 CTA |
| `btn-lv02` + modifier | 42px | `--solid`만 | 보조 CTA |
| `btn-lv03` + modifier | 42px | `--solid`, `--line` | 소형 CTA |

아이콘 조합 (가이드·실사용):

| modifier | 아이콘 |
|----------|--------|
| `--line-solid` | (텍스트만 · Explore) / 필요 시 `icon_arrow-18` |
| `--line` | `icon_download` · `icon_link` |
| `--solid` (lv03) | `icon_external-18` (외부 링크 시) |

> `btn-lv02--more` (`icon_plus` / `icon_more`)는 CSS·페이지에서 유지되나 **가이드 `#level-02` 미리보기에서는 제외** (Line + Solid 섹션 비노출).

### Icon 56px

| 클래스 | 아이콘 유틸 | SVG |
|--------|-------------|-----|
| `btn-icon-56` | `icon_arrow-20` | `ico_arrow_right_24_blue.svg` |
| `btn-icon-56--top` | `icon_arrow-top-20` | `ico_arrow_up_20.svg` |

실사용: `ScrollToTopButton` → `.scroll_to_top__btn` + `.scroll_to_top__icon`

### Text / Line 30px

| 클래스 | 아이콘 | 용도 |
|--------|--------|------|
| `btn-text-30` | `icon_arrow-14`, `icon_link-14`, `icon_arrow-18`, `icon_external-18` | 섹션 More·링크 CTA |
| `btn-line-30` | `btn-line-30__icon--copy` | Copy Link (라이트) |
| `btn-line-30--on-dark` | white copy | 다크 배경 Copy |

Downloads / Search / Download Center Copy Link → `DevicesProductDownloadsCopyLink` (`devices_product_downloads__file-btn--copy`) · 클릭 시 로딩 1초 → `Link copied!` 1초 · `file.url`.

| 상태 | Figma | 클래스 |
|------|-------|--------|
| Default | 7954:145264 | `file-btn--copy` |
| Loading | 7954:145265 | `is-loading` + `file-btn-spinner` |
| Copied | 7954:145273 | `copy-toast` |

### Flat · Rolling

| 클래스 / 컴포넌트 | 용도 |
|-------------------|------|
| `btn_flat` | Footer 뉴스레터 Submit |
| `SwiperBarControls` | 진행 바 + prev/next |
| `SwiperNavButtons` | 원형 prev/next 50px · Icon 18px · gap 20px |
| `BannerNavButtons` | 메인 배너 네비 |
| `.video-pagination` | 메인 비주얼 번호·진행바·재생/일시정지 |

#### Rolling_50px (`#rolling-50`)

| 스펙 | 값 |
|------|-----|
| 버튼 | `--btn-rolling-50` · `swiper_type_01_btn` |
| 아이콘 | 18px · `swiper_type_01_icon` |
| 스크롤 라인 ↔ 네비 | `30px` |
| 스크롤 라인 | track 1px `#e8e8e8` · fill 2px `#888` |
| L ↔ R | `20px` |
| Default / Hover / Disabled | 흰+primary 보더 / primary 채움 / `opacity: 0.35` |
| Dark pagination | `01 02 03` + 110px progress + 14px pause |

#### `btn_flat` 스코프

| 스코프 | CSS | 기본 | `:hover` |
|--------|-----|------|----------|
| `.main_footer .btn_flat` | `globals.css` | accent · `#fff` | `--color-accent-hover` |
| `.main_footer__submit .btn_flat` | `MainFooter.css` | `#fff` · `#0c1625` | `#f5f7fa` · `#fff` |
| `.common_footer .btn_flat` | `CommonFooter.css` | 페이지별 오버라이드 | |

---

## Check (05)

MUI `Checkbox` + `GuideCheckboxIcon` (`GuideFieldIcons.tsx`)

| export | unchecked | checked | 사용처 |
|--------|-----------|---------|--------|
| `guideCheckboxIconsDefault` | `ico_check.svg` | `ico_checked.svg` | 가이드·일반 폼 |
| `guideCheckboxIconsDownloads` | `ico_check_block.svg` | `ico_checked_black.svg` | Downloads 필터 |
| `guideCheckboxIconsContactConsent` | `ico_checkbox_off_22.png` | `ico_checkbox_on_22.png` | Cookie · Contact Us · Training |
| Footer 관심분야 | CSS 흰 테두리 | `ico_checked_footer_22.svg` | `MainFooter.css` |

| 클래스 | 역할 |
|--------|------|
| `guide_checkbox--error` | 아이콘 테두리 `#e53a3d` |
| `guide_checkbox__error` | helper (`role="alert"`) |

라디오·비밀번호 PNG → [ICON_GUIDE.md](./ICON_GUIDE.md) Form.

---

## Textfield (06)

MUI `TextField` / `FormControl` + `GuideSelect` + `.guide_field`

| modifier | 의미 |
|----------|------|
| `guide_field--h50` / `--h38` | Select 높이 |
| `guide_field--w200` / `--w120` | 너비 |
| `guide_field--search` | 검색 + endAdornment |
| `guide_field--fill-muted` | 배경 `#f5f5f5` |
| `guide_field--error-gap` | helperText 여백 |

**테두리** — Default/Hover `#ddd` · Focus `#666` · Error `#e53a3d`

**Error 샘플** (Figma [1689:8145](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=1689-8145))

| 유형 | 앵커 |
|------|------|
| Text | `#textfield-280` |
| Search | `#search-280` |
| Select | `#dropdown` |
| Textarea | `#textarea` |
| Password | `#password` |
| Checkbox | `#check-22` |

| 헬퍼 | 역할 |
|------|------|
| `GuideSelect` | MUI Select 래퍼 |
| `GuideSelectIcon` | chevron (`ico_up_16`) |
| `guideFieldLabelSlot` | `InputLabel` shrink |

모바일(`max-width: 780px`): `GuideSelect` `useNativeOnMobile: true` → `.MuiNativeSelect-icon` 화살표는 페이지 CSS에서 지정 (`appearance: none`).

### Search field

| 변형 | 높이·너비 | 스코프 | 실사용 |
|------|-----------|--------|--------|
| Toolbar | 50px · 280px | `globals.css` | `#search-280` · Blog · Press · Training · Download Center |
| Hero | 80px · 100% | `search.css` · `search_all_hero` | `/search` · `#search-80` |

Hero Clear: 30px + `ico_clear_12_black` (Figma `6571:102541`). All 탭 카드 호버: Product/Media/Pages 제목 primary + underline. → [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Search · [ICON_GUIDE.md](./ICON_GUIDE.md).

---

## Pagination (07)

| 컴포넌트 | 경로 | 비고 |
|----------|------|------|
| `PageNumbering` | `PageNumbering.tsx` | 40×40 · active `#0F1F45` · `ico_pag_chev_10.svg` |

---

## Banner (08)

| 앵커 | 컴포넌트 | 비고 |
|------|----------|------|
| `#banner-01` | `CommonBanner01` | `btn-lv01--line-solid` |
| `#banner-02` | `CommonBanner02` | default · `btn-text-30` |
| `#banner-02-expert` | `CommonBanner02` `variant="expert"` | Copy + CTA |
| `#banner-03` | `CommonBanner03` | HUB 이미지 |
| `#banner-04` | `CommonBanner04` | 풀폭 다크 CTA |

---

## React 컴포넌트 맵 (가이드 외 공유)

| 영역 | 컴포넌트 | CSS / 비고 |
|------|----------|------------|
| 배너 | `CommonBanner01`~`04`, `CommonBanner02CopyLink` | `common_banner_*` |
| 스와이퍼 | `SwiperBarControls`, `SwiperNavButtons`, `SwiperDotPagination`, `SwiperBarPagination` | 페이지별 |
| FAQ | `CommonFaq`, `FaqItem` | `common_faq` |
| 탭 | `TabButton` | 페이지 CSS |
| 화살표 / Flat | `BtnArrow`, `BtnFlat` | `btn_flat` |
| 모달 | Cookie · Contact · Privacy · Markets · MainImagePopup | `common_modal` · portal |
| 비디오 | `DevicesProductVideoPlayer`, `VideoSwiper` | YouTube / MP4 |
| 푸터 | `MainFooter`, `SiteFooter`, `CommonFooter` | |
| 레이아웃 | `ScrollToTopButton`, `ScrollToTopOnNavigate` | `scroll_to_top` |
| 브레드크럼 / 뱃지 | `HeaderBreadcrumb`, `ProductAwardBadge` | |
| 검색 | `SearchAll*` · 탭 패널 · `SearchTabActiveFilters` · `SearchDocumentsCard` · `SearchPageList*` | `search.css` |
| 검색 필터 | `DevicesProductDownloadsFilter*` | Download Center 공유 |
| Services | Service Center · Warranty · Engineering Training | `services.css` · `training.css` |

### Cookie consent

| 컴포넌트 | 역할 |
|----------|------|
| `CookieSettingsModal` | P-FO-COMMON-020000P · 동의 배너 |
| `CookiePreferencesModal` | P-FO-COMMON-040000M · 분류 설정 · `common_modal` |

단독: `/main/cookie-setting`, `/main/cookie-setting/preferences` → [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md).

### Main Info · Video

| 패턴 | 파일 |
|------|------|
| `info_box__count` ghost/live | `MainInfo.tsx` · `main.css` |
| `VideoSwiper` | 메인 비주얼 |
| `DevicesProductVideoPlayer` | 제품 상세 YouTube |

GNB → [GNB_GUIDE.md](./GNB_GUIDE.md).

---

## 구현 원칙

- 가이드에 **있는** 패턴은 동일 클래스·MUI·아이콘 경로를 **재사용**. Figma MCP Tailwind를 그대로 붙이지 않는다.
- 가이드에 **없는** Figma 컴포넌트는 구현과 함께 `ComponentGuide.tsx` + `globals.css` + **이 문서**를 갱신한다.
- 토큰·치수는 `:root` CSS 변수.
- 아이콘은 [ICON_GUIDE.md](./ICON_GUIDE.md). CSS 유틸과 `/pub/ico/...` 경로를 혼용하지 않는다.

---

## 새 컴포넌트 추가 시 갱신

1. `ComponentGuide.tsx` — 미리보기·앵커 `id`
2. `globals.css` — 스타일·토큰
3. 필요 시 `public/ico/` + `icoGuide.ts` + [ICON_GUIDE.md](./ICON_GUIDE.md)
4. **이 문서** — Figma 매핑·앵커·표

---

## 금지

- 가이드와 다른 버튼/필드/체크 스타일을 페이지에만 따로 정의
- 유료 UI 키트·아이콘 폰트 (`.cursor/rules/no-paid-licenses.mdc`)
