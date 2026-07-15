# GNB Guide

글로벌 내비게이션(GNB)과 PC 메가 메뉴·모바일 패널 전용 문서입니다.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide/gnb` → `GnbGuide.tsx` |
| **스타일** | `src/assets/css/components/gnb.css` |
| **PC 컴포넌트** | `GnbMenu.tsx`, `GnbMegaPanel.tsx`, `gnb-mega/*` |
| **모바일 컴포넌트** | `GnbMobileMenuPanel.tsx`, `GnbMobileDepth*Menu.tsx` |
| **메타 데이터** | `src/data/gnbGuide.ts` |
| **허브** | [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) |

`basePath` `/pub` — 브라우저 URL `/pub/guide/gnb`. 문서·코드 내부 링크는 `/guide/...` 형식.

---

## 목차

1. [구조](#구조)
2. [PC 메가 패널](#메가-패널)
3. [Devices 4depth](#devices-4depth)
4. [모바일 GNB](#모바일-gnb)
5. [글로벌 리전 메뉴](#글로벌-리전-메뉴)
6. [GNB 아이콘](#gnb-아이콘)
7. [Explore All · Figma · 외부 링크](#explore-all-products)
8. [수정 시 체크리스트](#수정-시-체크리스트)

---

## 구조

```
GnbMenu.tsx (variant: main | markets)
  ├── PC: gnbNavItems (navItems.ts) → megaMenu per nav
  │         ├── devices  → GnbDevicesMegaPanel / GnbMegaPanel (4depth)
  │         └── simple   → grid (Markets) | sections (Services, Support, Company, …)
  ├── GnbGlobalTrigger → GnbGlobalMenu (#gnb-global-menu)
  └── Mobile (max-width: 780px): GnbMobileMenuPanel
            depth1 → depth2 → depth3 → depth4 (슬라이드 패널)
```

Nav 라벨 **Products & Systems** (`navId: devices`) — 경로 `/products-systems/...` 유지.

---

## 메가 패널

| Nav ID | Panel DOM ID | 타입 | 데이터 |
|--------|--------------|------|--------|
| `devices` | `#gnb-mega-panel-devices` | 4depth | `src/data/gnb/mega/devices.ts` |
| `markets` | `#gnb-mega-panel-markets` | simple · grid | `mega/markets.ts` |
| `services` | `#gnb-mega-panel-services` | simple · sections | `mega/services.ts` |
| `support` | `#gnb-mega-panel-support` | simple · sections | `mega/support.ts` |
| `careers` | `#gnb-mega-panel-careers` | simple · sections | `mega/careers.ts` |
| `company` | `#gnb-mega-panel-company` | simple · sections (3 columns) | `mega/company.ts` |

**Company mega** (Figma 5683:60839): About Us · Articles · Careers — `grid-template-columns: repeat(3, …)` · Articles → `/company/articles/detail` · Careers Search and Apply → `external: true` + `ico_link.svg`

패널 ID 상수: `src/data/gnb/panelIds.ts` (`GNB_MEGA_PANEL_ID`)

CSS modifier: `getMegaPanelClassName.ts` — 예) `gnb_mega--devices`, `gnb_mega--sections gnb_mega--services`

---

## Devices 4depth

- **depth2**: LV / MV / HV … (`categories`)
- **depth3**: 제품군 (예: Electronic Motor Protection Relay)
- **depth4**: 패널 타이틀 + 설명 + product(s) 그리드
- 기본 오픈: LV + `empr` (`devicesMegaDefaultCategoryId`, `devicesMegaDefaultDepth3Id`)

### PC hover 인터랙션 (`GnbMegaPanel.tsx`)

| 대상 | 동작 | 딜레이 |
|------|------|--------|
| `gnb_mega__depth2-btn` | `onCategoryChange` — depth3·depth4 데이터 교체 | **200ms** (`DEPTH_HOVER_DELAY_MS`) |
| `gnb_mega__depth3-btn` | `onDepth3Change` — depth4 패널 교체 | **200ms** |

패널 이탈·언마운트 시 timeout 정리. active 항목 재 hover 시 전환 없음.

주요 클래스:

- `gnb_mega__col--depth2`, `--depth3`, `--depth4`
- `gnb_mega__depth4-head`, `gnb_mega__depth4-arrow` (Arrow · Hover, `ico_arrow_right_24_blue.svg`)
- `gnb_mega__depth4-desc` — 설명은 `description` 문자열 한 줄 → `<p>` (내부 `span`/`br` 없음)

---

## 모바일 GNB

`max-width: 780px` — `gnb_mobile_shell` · `gnb_mobile_menu` · dim 오버레이.

### 패널 구조

| 래퍼 | 역할 |
|------|------|
| `gnb_mobile_shell` | 헤더·검색·패널 슬라이드 컨테이너 (`.is-open`) |
| `gnb_mobile_panel__gnb-row` | 로고·유틸·글로벌 select 행 |
| `gnb_mobile_menu` | depth 패널 스택 (`.is-open`) |
| `gnb_mobile_dim` | 배경 dim (fixed, z-index 1000) |

`main_header__inner` · `header__gnb-row` · `gnb_mobile_menu`가 **한 패널**로 함께 슬라이드됩니다.

### depth 네비게이션

| Level | 컴포넌트 | 레이아웃 |
|-------|----------|----------|
| depth1 | `GnbMobileDepth1Menu` | nav 1차 목록 |
| depth2 | `GnbMobileDepth2Menu` · `GnbMobileDepth2GridMenu` · `GnbMobileDepth2SectionsMenu` | list · grid(Markets) · sections(Services 등) |
| depth3 | `GnbMobileDepth3Menu` | list |
| depth4 | `GnbMobileDepth4Menu` | intro + products |

데이터 헬퍼: `src/data/gnb/mobileNavItems.ts` — `getMobileDepth2Items`, `getMobileDepth3Items`, `getMobileDepth4Data` 등.

### 주요 클래스·아이콘

| 클래스 | 비고 |
|--------|------|
| `gnb_mobile_list` · `gnb_mobile_list--depth2` · `--depth3` | 리스트 패딩·타이포 단계별 |
| `gnb_mobile_list__arrow` | depth1·2 chevron — `ico_arrow_right_20_list.svg` |
| `gnb_mobile_list__arrow--18` | depth3 chevron — `ico_arrow_right_18_list.svg` |
| `gnb_mobile_back` · `gnb_mobile_back__icon` | 뒤로 — `ico_arrow_right_14.svg` 180° |
| `gnb_mobile_explore` | Explore All Products CTA (Devices depth2 하단) |
| `gnb_mobile_global-select` | 리전 native select (America) |

### 모바일 검색 패널·dim

Figma [7334:131856](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9D%B8?node-id=7334-131856) · 검색 패널 `7334:131884`.

- `#gnb-search-panel.gnb_search.is-open`: 헤더 60px 아래 흰색 검색 패널 · `z-index: 9999`
- `.gnb_search_dim`: 검색 패널과 동일한 body portal의 viewport 전체 `rgb(0 0 0 / 50%)` dim · `z-index: 9998`
- `.main_header.is-search-open` / `.gnb_menu_wrap.is-search-open`: 흰색 헤더를 dim 위에 유지 · `z-index: 10000`
- dim 클릭 또는 Escape: 검색 닫기

Figma depth1 참고: 6880:135688

---

## 글로벌 리전 메뉴

- **트리거** — `GnbGlobalTrigger` · `ico_global_24` / `_white` + 라벨 **America** (`gnb_global_label`)
- **패널** — `#gnb-global-menu` · `gnb_global_menu__item` · 활성 `america`
- **데이터** — `src/data/gnb/gnbGlobalContent.ts` (`gnbGlobalRegions`, `gnbGlobalActiveRegionId`)
- **Figma** — 5683:60868

---

## GNB 아이콘

파일 레지스트리: [ICON_GUIDE.md](./ICON_GUIDE.md) · `src/data/icoGuide.ts`  
GNB·메가·모바일 **사용 맥락**: `src/data/gnbGuide.ts` → `gnbGuideIcons`

| 파일 | 용도 |
|------|------|
| `ico_search_24` / `_white` | 검색 버튼 |
| `ico_gnb_search_ai_32` | GNB 검색 패널 필드 AI 마크 (Figma 7334:131967 PC · 7334:131884 MO) |
| `ico_gnb_search_clear_24` | 모바일 GNB 검색 필드 clear 버튼 (Figma 7334:131929) |
| `ico_close_24` | 검색 닫기 |
| `ico_global_24` / `_white` | 글로벌 리전 트리거 + America 라벨 |
| `ico_link` | 외부 링크 (`gnb_mega__item-external`, `btn-text-30`) |
| `ico_arrow_right_14` | Explore All · mobile back (180°) |
| `ico_arrow_right_20_list` | 모바일 depth1·2 chevron |
| `ico_arrow_right_18_list` | 모바일 depth3 chevron |
| `ico_arrow_right_24_blue` | depth4 타이틀 CTA |
| `ico_arrow_right_18` / `_white` / `_gray` | breadcrumb |
| `ico_home`, `ico_right` / `_white` | breadcrumb |

---

## Explore All Products

- 데이터: `src/data/gnbExploreAllProducts.ts`
- 페이지: `/products-systems/explore-all` (`devices_explore`)
- GNB CTA: `gnb_mega__explore` · 모바일 `gnb_mobile_explore` → 위 페이지로 이동

### Figma 참고

| 패널 | Node (예) |
|------|-----------|
| GNB (Products & Systems · America) | 5683:60868 |
| Devices LV / EMPR | 2769:34864 |
| Services | 2769:35379 |
| Company (3 columns) | 5683:60839 |
| Support | 2769:35780 |
| Careers | 2769:35857 |
| Mobile depth1 | 6880:135688 |

### Support 메가 — 외부 링크 (`external: true` · 새 탭)

| 항목 | URL |
|------|-----|
| Product Finder | `https://pfinder.ls-electric.com/UL/product/list.do` |
| Product Match Guide | `https://pmg.ls-electric.com/` |
| LS Pre-Engineering | `https://lspe-x.ls-electric.com/` |
| Request for Service | `https://gics.ls-electric.com/public/index.do` |

데이터: `src/data/gnb/mega/support.ts` · `services.ts` (Request for Service)

---

## 수정 시 체크리스트

1. `src/data/gnb/mega/*.ts` · `mobileNavItems.ts` 데이터
2. `gnb.css` / 패널·모바일 modifier
3. **이 문서** · `gnbGuide.ts` 동기화
4. GNB 사용 아이콘 — `icoGuide.ts` 등록 + `gnbGuide.ts` `gnbGuideIcons` 갱신
