# Icon Guide

프로젝트 아이콘 에셋 전체 가이드입니다.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide/ico` → `IcoGuide.tsx` |
| **공통 레지스트리** | `src/data/icoGuide.ts` · `public/ico/` |
| **페이지 레지스트리** | `src/data/pageIconGuide.ts` · `public/img/**/` |
| **GNB 사용 맥락** | `src/data/gnbGuide.ts` → [GNB_GUIDE.md](./GNB_GUIDE.md) |
| **허브** | [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) |

**동기화**: `public/ico` 파일 수 = `icoItems.length` (현재 **104**개) · `pageIconItems.length` (**17**개)

`basePath`는 `/pub`입니다. 앱·CSS·MD 모두 `/pub/ico/...`, `/pub/img/...`로 참조합니다.

---

## 목차

1. [경로·네이밍](#경로-규칙)
2. [공통 아이콘 (`public/ico`)](#1-공통-아이콘-publicico)
3. [CSS 아이콘 유틸](#css-아이콘-유틸-globalscss)
4. [페이지·레이아웃 아이콘](#2-페이지레이아웃-아이콘)
5. [GNB 아이콘](#3-gnb-아이콘)
6. [사용 패턴 · 갱신 · 금지](#사용-패턴)

---

## 경로 규칙

| 구분 | 저장 | 앱 참조 |
|------|------|---------|
| 공통 아이콘 | `public/ico/*` | `/pub/ico/파일명` |
| 페이지 전용 | `public/img/{영역}/` | `/pub/img/...` |

### 네이밍 (`public/ico`)

- 모든 파일은 `ico_` 접두사
- `ico_{역할}_{크기}_{색상}.svg` — 예: `ico_search_24_white.svg`
- `ico_{역할}_{크기}.svg` — 예: `ico_bell_20.svg`
- `ico_{역할}.svg` — 예: `ico_download.svg`
- 폼 PNG: `ico_{역할}_{on|off}_22.png`

### 알려진 오타 (파일명 유지)

| 파일 | 비고 |
|------|------|
| `ico_arrow_righ_24_white.svg` | `right` → `righ` — CSS·스와이퍼 다수 참조, **이름 변경 금지** |

---

## 1. 공통 아이콘 (`public/ico`)

**단일 소스**: `src/data/icoGuide.ts`의 `icoItems` 배열.  
라이브 카드·메타·코드 스니펫은 `/guide/ico` (`IcoGuide.tsx`)에서 동일 데이터를 렌더합니다.

### 카테고리 (`icoCategoryOrder`)

| ID | 라벨 | 개수 |
|----|------|------|
| `arrow` | Arrow / Chevron | 21 |
| `ui` | UI | 39 |
| `form` | Form | 10 |
| `breadcrumb` | Breadcrumb | 2 |
| `search` | Search / Global | 10 |
| `location` | Location / Contact | 9 |
| `media` | Media | 1 |
| `sns` | SNS | 6 |

### Arrow / Chevron

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_arrow_righ_24_white.svg` | 24 | 스와이퍼·배너 네비 (오타 유지) |
| `ico_arrow_right_14.svg` | 14 | 소형 인라인 화살표 |
| `ico_arrow_right_14_2.svg` | 14 | 소형 CTA 화살표 (variant 2 · services · product detail) |
| `ico_arrow_right_14_white.svg` | 14 | 소형 화살표 (다크 배경) |
| `ico_arrow_right_18.svg` | 18 | 버튼·링크 CTA (기본) |
| `ico_arrow_right_18_white.svg` | 18 | 버튼·링크 (다크 배경) |
| `ico_arrow_right_18_gray.svg` | 18 | 비활성·보조 CTA |
| `ico_arrow_right_18_list.svg` | 18 | 모바일 GNB depth3 리스트 chevron |
| `ico_arrow_right_20_list.svg` | 20 | 모바일 GNB depth1·depth2 리스트 chevron |
| `ico_arrow_right_24_blue.svg` | 24 | Level 버튼·`icon_arrow-14/20` |
| `ico_arrow_pager_14.svg` | 14 | Article detail pager PREV/NEXT |
| `ico_arrow_up_20.svg` | 20 | Scroll to top · `icon_arrow-top-20` |
| `ico_bottom_10.svg` | 10 | 셀렉트·소형 드롭다운 |
| `ico_bottom_14_white.svg` | 14 | 셀렉트 (다크 배경, Footer) |
| `ico_down.svg` | 24 | 펼침/접힘 (예비) |
| `ico_down_16.svg` | 16 | FAQ·셀렉트 닫힘 |
| `ico_down_16_white.svg` | 16 | FAQ·셀렉트 (다크) |
| `ico_up_16.svg` | 16 | FAQ·셀렉트 열림 |
| `ico_right_gray.svg` | 24 | 회색 화살표 (예비) |
| `ico_right_white.svg` | 24 | 흰색 화살표 (예비) |

### Breadcrumb (arrow 카테고리 혼재 1건)

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_right.svg` | 8 | 브레드크럼 구분 chevron |
| `ico_home.svg` | 13 | 브레드크럼 홈 (mask) |

### UI

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_bell_20.svg` | 20 | 공지 알림 (MainVisual) |
| `ico_calendar.svg` | 20 | 일정·캘린더 |
| `ico_cl.svg` | 24 | 모달·레이어 닫기 |
| `ico_close_24.svg` | 24 | GNB 검색 패널 닫기 |
| `ico_copy_14.svg` | 14 | Copy Link (라이트) |
| `ico_copy_white_14.svg` | 14 | Copy Link (다크) |
| `ico_loading_14.svg` | 14 | Copy Link 로딩 스피너 |
| `ico_agenda_dot_8.svg` | 8 | Agenda 모바일 타임라인 닷 |
| `ico_checked_footer_22.svg` | 22 | Footer 뉴스레터 checked |
| `ico_download.svg` | 18 | 다운로드 CTA |
| `ico_link.svg` | 56 | 섹션 링크 CTA · `icon_link-14` |
| `ico_modal_plus.svg` | 24 | 모달·확장 |
| `ico_more.svg` | 24 | View More |
| `ico_pag_chev_10.svg` | 10 | Pagination chevron |
| `ico_pdf_18.svg` | 18 | PDF 파일 목록 |
| `ico_qa_arrow.svg` | 16 | FAQ 아코디언 |
| `ico_refresh_14.svg` | 14 | 필터 초기화 |
| `ico_refresh_22.svg` | 22 | 새로고침 (예비) |
| `ico_scrto_18.svg` | 18 | Hero 스크롤 유도 |
| `ico_swipe_70.svg` | 70 | 모바일 가로 스크롤 스와이프 힌트 — Lineup (`DevicesProductLineupGrid`) · Warranty Coverage (`WarrantyTableScroll`) |
| `ico_calendar_18.svg` | 18 | DatePicker · 일반 캘린더 |
| `ico_training_calendar_18.svg` | 16 | Engineering Training — Add to Calendar (iCal / Outlook · Figma 6880:147102) |
| `ico_google_18.svg` | 18 | Engineering Training — Add to Calendar (Google) |
| `ico_training_class_size_18.svg` | 18 | Engineering Training 세션 — CLASS SIZE |
| `ico_training_date_18.svg` | 18 | Engineering Training 세션 — DATE (라벨 30% opacity) |
| `ico_training_duration_18.svg` | 18 | Engineering Training 세션 — DURATION (라벨 30% opacity) |
| `ico_training_products_18.svg` | 18 | Engineering Training 세션 — PRODUCTS COVERED (라벨 30% opacity) |
| `ico_eye_22.svg` | 22 | 비밀번호 표시 (예비) |
| `ico_filter_14.svg` | 14 | 모바일 필터 트리거 (Downloads · Tech Hub · Download Center) |
| `ico_fullscreen_16.svg` | 16 | 전체화면 (예비) |

### Form

| 세트 | unchecked / off | checked / on |
|------|-----------------|--------------|
| Checkbox SVG (기본) | `ico_check.svg` | `ico_checked.svg` |
| Downloads 필터 | `ico_check_block.svg` | `ico_checked_black.svg` |
| Checkbox PNG | `ico_checkbox_off_22.png` | `ico_checkbox_on_22.png` (Cookie Preferences · Contact Us · Training) |
| Radio PNG | `ico_radio_off_22.png` | `ico_radio_on_22.png` |
| Password PNG | `ico_password_off_22.png` | `ico_password_on_22.png` |

MUI 연동: `GuideCheckboxIcon`, `guideCheckboxIcons*` — [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) Check 섹션.

### Search / Global

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_search_24.svg` | 24 | 검색 (스크롤·폼·툴바·`/search` Hero) |
| `ico_search_24_white.svg` | 24 | 검색 (최상단 헤더) |
| `ico_gnb_search_ai_32.svg` | 32×36 | GNB 검색 패널 AI 마크 (`#gnb-search-panel`) |
| `ico_global_24.svg` | 24 | 글로벌 리전 트리거 (스크롤 헤더) · 라벨 **America** |
| `ico_global_24_white.svg` | 24 | 글로벌 리전 트리거 (최상단) · 라벨 **America** |
| `ico_clear_12.svg` | 12 | 검색어·필터 초기화 (`/search` Hero·active chips 포함) · Documents MO active-filter는 `brightness(25%)`로 `#222` 적용 |
| `ico_clear_12_black.svg` | 12 | Search Hero·404·PC GNB 검색어 초기화 `#222` (Figma `6571:102541` · `7334:130802`) |
| `ico_gnb_search_clear_24.svg` | 24 | 모바일 GNB 검색어 초기화 (Figma `7334:131929`) |
| `ico_right_14.svg` | 14 | 검색 product path chevron (`search_all__product-path-icon`) |
| `ico_close_24.svg` | 24 | GNB 검색 패널 닫기 |

### Common — 404 (`/404`)

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_404_home_80.svg` | 80 | Helpful Links — Return to Homepage |
| `ico_404_download_80.svg` | 80 | Helpful Links — Visit Download Center |
| `ico_404_contact_80.svg` | 80 | Helpful Links — Contact Us |
| `ico_404_request_80.svg` | 80 | Helpful Links — Request for Service |
| `ico_clear_12_black.svg` | 12 | Search clear (Figma `7334:130802`) |

GNB 배치·상태: [GNB_GUIDE.md](./GNB_GUIDE.md) · `gnbGuide.ts`

### Search (`/search`) — `search.css`

| 파일 / 유틸 | 용도 |
|-------------|------|
| `ico_search_24.svg` | Hero 검색 버튼 (`SearchAllHero`) |
| `ico_clear_12_black.svg` | Hero clear `#222` (Figma `6571:102541`) |
| `ico_clear_12.svg` | `SearchTabActiveFilters` chip/remove · Documents MO chip/clear `#222` CSS filter |
| `ico_right_14.svg` | `search_all__product-path-icon` (CSS background) |
| `icon_arrow-14` | `btn-text-30` Explore (`search_all__explore`) |
| `ico_copy_14.svg` · `ico_download.svg` | Documents 카드 액션 (`search_all` · `search_documents`) |
| `ico_up_16.svg` | AI Read more chevron (`search_all__ai-more-icon`) |

섹션·컴포넌트: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) Search · [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) Search field · React 맵

### Location / Contact

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_map_16.svg` | 16 | 주소·지도 핀 (America Operate 등) |
| `ico_map_16_1.svg` | 16 | Engineering Training 세션 LOCATION (variant) |
| `ico_map_14_navy.svg` | 14 | 지도 핀 (Where to Buy 카드 액션) |
| `ico_map_16_white.svg` | 16 | 주소 (다크 패널, America) |
| `ico_phone_16.svg` | 16 | 전화 (America Operate) |
| `ico_call_16.svg` | 16 | 전화 (예비) |
| `ico_call_14_navy.svg` | 14 | 전화 (Where to Buy 카드 액션) |
| `ico_location_20.svg` | 20 | 위치 검색 (Where to Buy) |
| `ico_training_location_18.svg` | 18 | Engineering Training 세션 — LOCATION INFORMATION |

### Engineering Training — Session Meta (`support_service_training_session_detail`)

Figma [5552:121284](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-121284). 데이터: `engineeringTrainingSessionAssets.metaIcons` · 컴포넌트: `EngineeringTrainingSessionDetail`.

| 파일 | 라벨 | 비고 |
|------|------|------|
| `ico_training_date_18.svg` | DATE | `iconMuted` — CSS `opacity: 0.3` |
| `ico_training_duration_18.svg` | DURATION | `iconMuted` |
| `ico_training_class_size_18.svg` | CLASS SIZE | 기본 opacity |
| `ico_training_location_18.svg` | LOCATION INFORMATION | location 카테고리 |
| `ico_training_products_18.svg` | PRODUCTS COVERED | `iconMuted` |
| `ico_agenda_dot_8.svg` | Agenda MO timeline | Figma 8007:107681 · `__agenda-dot` |

### Request for Training — Step Bar (`support_service_training_request`)

Figma [5601:125962](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5601-125962). 데이터: `requestForTrainingSteps` · 컴포넌트: `RequestForTrainingSteps`.

| 파일 | Step | 비고 |
|------|------|------|
| `ico_request_training_info_24.svg` | 1 Basic Information | 24px 내부 아이콘 · **44px 원형 배경은 CSS** (`__step-icon`) |
| `ico_request_training_calendar_24.svg` | 2 Requested Date(s) | 비활성 — 흰색 stroke/fill |
| `ico_request_training_location_24.svg` | 3 Training Class Location | 비활성 |
| `ico_request_training_file_24.svg` | 4 Training Class Details | 비활성 |
| `ico_request_training_arrow_active_24.svg` | 구분 화살표 | Step 1 이후 (활성) |
| `ico_request_training_arrow_24.svg` | 구분 화살표 | Step 2~3 이후 (비활성) |
| `ico_request_training_check_16.svg` | Step 1 완료 | 16px 체크 · **44px `#e60040` 원형 CSS** |
| `ico_request_training_calendar_active_24.svg` | 2 Requested Date(s) | 활성 Step — 네이비 캘린더 |
| `ico_request_training_location_active_24.svg` | 3 Training Class Location | 활성 Step — 네이비 핀 |
| `ico_request_training_file_active_24.svg` | 4 Training Class Details | 활성 Step — 네이비 파일 |
| `ico_clear_12.svg` | Step 4 제품 태그 | 선택 제거 버튼 |

배경: `/pub/img/services/request-for-training/step-bar-bg.png`

### Media · SNS

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_play_48.svg` | 48 | 동영상 재생 (Tech Hub) |
| `ico_sns_blog.svg` | 20 | 네이버 블로그 (예비) |
| `ico_sns_tv.svg` | 20 | 네이버 TV (예비) |
| `ico_share_facebook_44.svg` | 20 | Engineering Training 세션 Share — Facebook |
| `ico_share_x_44.svg` | 20 | Engineering Training 세션 Share — X |
| `ico_share_linkedin_44.svg` | 20 | Engineering Training 세션 Share — LinkedIn |
| `ico_share_email_44.svg` | 20 | Engineering Training 세션 Share — Email |

Figma [5552:121036](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8?node-id=5552-121036) · 아이콘 20×20 · 44px `#F5F5F5` 원형은 `__share-link` CSS · gap 18px.

푸터 SNS는 `public/img/footer/` 사용 (아래 Page 아이콘).

---

## CSS 아이콘 유틸 (`globals.css`)

`<img>` 대신 `span` + `background`로 쓰는 패턴입니다. [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) 버튼 섹션과 함께 참고합니다.

| 클래스 | 배경 SVG | 사용처 |
|--------|----------|--------|
| `icon_arrow-14` | `ico_arrow_right_24_blue.svg` | `btn-text-30` |
| `icon_arrow-18` | `ico_arrow_right_18.svg` | `btn-lv01--line-solid`, 배너 |
| `icon_arrow-20` | `ico_arrow_right_24_blue.svg` | `btn-icon-56` |
| `icon_arrow-top-20` | `ico_arrow_up_20.svg` | `btn-icon-56--top`, `.scroll_to_top__icon` |
| `icon_link-14` | `ico_link.svg` | `btn-text-30`, `common_banner_02` |
| `icon_external-18` | `ico_arrow_right_18.svg` | 외부 링크 CTA |
| `icon_download` | `ico_download.svg` | `btn-lv01--line` |
| `icon_more` | `ico_more.svg` | `btn-lv02--more` |
| `guide_field__select-icon` | `ico_up_16` / `ico_down_16` (상태) | MUI Select |

브레드크럼: `.breadcrumb_home` → `ico_home.svg` (mask), `.breadcrumb_sep` → `ico_right.svg`

---

## 2. 페이지·레이아웃 아이콘

`src/data/pageIconGuide.ts` · `/guide/ico` 하단 **Page / Layout** (`#ico-page`)

### Page — Footer SNS (`public/img/footer/`)

| 파일 | 크기 | 용도 |
|------|------|------|
| `ico_linkedin_40.svg` | 40 | LinkedIn |
| `ico_insta_40.svg` | 40 | Instagram |
| `ico_youtube_40.svg` | 40 | YouTube |
| `ico_face_40.svg` | 40 | Facebook |

### Page — Company America (`public/img/company/america/`)

| 파일 | 크기 | 용도 |
|------|------|------|
| `pillar-futuring.svg` | 56 | Mission pillar |
| `pillar-smart.svg` | 56 | Mission pillar |
| `pillar-energy.svg` | 56 | Mission pillar |
| `value-challenge.svg` | 72 | Core value |
| `value-agility.svg` | 72 | Core value |
| `value-excellence.svg` | 72 | Core value |
| `mission-value-plus.svg` | 24 | Core value 연결 (+) |
| `follow-insta.svg` | 32 | Follow SNS |
| `follow-facebook.svg` | 32 | Follow SNS |
| `follow-linkedin.svg` | 32 | Follow SNS |
| `follow-youtube.svg` | 32 | Follow SNS |

### Page — Common

| 파일 | 크기 | 용도 |
|------|------|------|
| `empty_icon.png` | 48 | 검색·목록 empty state |

### America 페이지와 공통 ico 통합

| 용도 | 공통 ico |
|------|----------|
| Shaping location | `ico_map_16_white` |
| Operate 주소 | `ico_map_16` |
| Operate 전화 | `ico_phone_16` |
| Where to Buy | `ico_map_14_navy`, `ico_call_14_navy` |

페이지 전용 SVG는 Figma 스펙이 공통 ico와 다를 때만 유지합니다. 재사용 가능하면 `public/ico`로 승격 후 `pageIconGuide`에서 제거합니다.

---

## 3. GNB 아이콘

GNB·메가 메뉴·모바일 패널에서 쓰는 아이콘은 `public/ico`에 있으며 `icoGuide.ts`에도 등록됩니다.

**사용 맥락 표** — `src/data/gnbGuide.ts` → `gnbGuideIcons` (라이브 `/guide/gnb`)

| 구분 | 대표 파일 |
|------|-----------|
| 검색 | `ico_search_24` / `_white` · `ico_close_24` |
| 글로벌 | `ico_global_24` / `_white` + 라벨 **America** |
| 메가 CTA | `ico_link` · `ico_arrow_right_14` · `ico_arrow_right_24_blue` |
| breadcrumb | `ico_home` · `ico_right` / `_white` · `ico_arrow_right_18` / `_white` / `_gray` |
| 모바일 리스트 | `ico_arrow_right_20_list` (depth1·2) · `ico_arrow_right_18_list` (depth3) · back `ico_arrow_right_14` (180°) |

배치·상태·클래스·모바일 depth 구조는 [GNB_GUIDE.md](./GNB_GUIDE.md)를 참고합니다.

---

## 사용 패턴

### `<img>` (권장: 장식·폼 아이콘)

```html
<img loading="lazy" decoding="async" src="/pub/ico/ico_search_24.svg" alt="" width="24" height="24" aria-hidden="true" />
```

의미 있는 버튼 내부는 `aria-label`을 버튼에, 아이콘은 `aria-hidden="true"`.

### CSS background (버튼·유틸 span)

```html
<button type="button" class="btn-icon-56" aria-label="Next">
  <span class="icon_arrow-20" aria-hidden="true" />
</button>
```

---

## 갱신 체크리스트

### 공통 ico 추가

1. `public/ico/` — 파일 추가 (`ico_` 접두사, LICENSE 확인)
2. `src/data/icoGuide.ts` — `icoItems` 등록 (카테고리·`usedIn`)
3. 필요 시 `globals.css` — CSS 유틸 클래스
4. GNB 사용 시 `gnbGuide.ts` 맥락 갱신
5. **이 문서** — 해당 카테고리 표 갱신

### 페이지 전용 추가

1. `public/img/{영역}/` — 파일 추가
2. `src/data/pageIconGuide.ts` — 등록
3. 재사용 가능하면 `public/ico`로 승격

### 동기화 검증 (PowerShell)

```powershell
$files = @(Get-ChildItem public/ico -File).Name
$registered = @(Select-String icoGuide.ts -Pattern 'fileName: "(.+)"' |
  ForEach-Object { $_.Matches.Groups[1].Value })
Compare-Object $files $registered
```

출력이 없으면 1:1 동기화입니다.

---

## 금지

- `ico_` 접두사 없는 공통 아이콘 파일명
- `icoGuide.ts` 미등록 `public/ico` 파일
- 동일 의미 SVG 중복 (페이지 폴더 ↔ `public/ico`)
- 유료 아이콘 폰트·키트 (`.cursor/rules/no-paid-licenses.mdc`)
