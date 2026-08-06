# GNB Guide

글로벌 내비게이션(GNB)과 메가 메뉴 전용 문서입니다.

- **허브**: [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)
- **라이브**: `/guide/gnb`
- **스타일**: `src/assets/css/components/gnb.css`
- **컴포넌트**: `GnbMenu.tsx`, `GnbMegaPanel.tsx`
- **메타 데이터**: `src/data/gnbGuide.ts`

## 구조

```
GnbMenu.tsx (variant: main | markets)
  └── gnbNavItems (navItems.ts)
        └── megaMenu per nav
              ├── devices  → GnbDevicesMegaPanel / GnbMegaPanel (4depth)
              └── simple   → grid (Markets) | sections (Services, Support, …)
```

## 메가 패널

| Nav ID | Panel DOM ID | 타입 | 데이터 |
|--------|--------------|------|--------|
| `devices` | `#gnb-mega-panel-devices` | 4depth | `src/data/gnb/mega/devices.ts` |
| `markets` | `#gnb-mega-panel-markets` | simple · grid | `mega/markets.ts` |
| `services` | `#gnb-mega-panel-services` | simple · sections | `mega/services.ts` |
| `support` | `#gnb-mega-panel-support` | simple · sections | `mega/support.ts` |
| `careers` | `#gnb-mega-panel-careers` | simple · sections | `mega/careers.ts` |
| `company` | `#gnb-mega-panel-company` | simple · sections | `mega/company.ts` |

패널 ID 상수: `src/data/gnb/panelIds.ts` (`GNB_MEGA_PANEL_ID`)

CSS modifier: `getMegaPanelClassName.ts` — 예) `gnb_mega--devices`, `gnb_mega--sections gnb_mega--services`

## Devices 4depth

- **depth2**: LV / MV / HV … (`categories`)
- **depth3**: 제품군 (예: Electronic Motor Protection Relay)
- **depth4**: 패널 타이틀 + 설명 + product(s) 그리드
- 기본 오픈: LV + `empr` (`devicesMegaDefaultCategoryId`, `devicesMegaDefaultDepth3Id`)

주요 클래스:

- `gnb_mega__col--depth2`, `--depth3`, `--depth4`
- `gnb_mega__depth4-head`, `gnb_mega__depth4-arrow` (Arrow · Hover, `ico_arrow_right_24_blue.svg`)
- `gnb_mega__depth4-desc` — 설명은 `<p>` + `<br />`

## GNB 아이콘

Icon Guide(`icoGuide.ts`)의 **GNB 카테고리는 사용하지 않습니다.** GNB 전용 목록은 `gnbGuide.ts` → `gnbGuideIcons`.

| 파일 | 용도 |
|------|------|
| `ico_search_24` / `_white` | 검색 버튼 |
| `ico_global_24` / `_white` | 언어 |
| `ico_link` | 외부 링크 (`btn-text-30`) |
| `ico_arrow_right_14` | Explore All |
| `ico_arrow_right_24_blue` | depth4 타이틀 CTA |
| `ico_arrow_right_18` / `_white` | breadcrumb |
| `ico_home`, `ico_right` / `_white` | breadcrumb |

## Explore All Products

- 데이터: `src/data/gnbExploreAllProducts.ts`
- 뷰: `gnb_mega--explore-all`

## Figma 참고

| 패널 | Node (예) |
|------|-----------|
| Devices LV / EMPR | 2769:34864 |
| Services | 2769:35379 |
| Company | 2769:35523 |
| Support | 2769:35780 |
| Careers | 2769:35857 |

## 수정 시 체크리스트

1. `src/data/gnb/mega/*.ts` 데이터
2. `gnb.css` / 패널별 modifier
3. 문서(`docs/GNB_GUIDE.md`)·`gnbGuide.ts` 동기화
4. Icon Guide에 GNB 아이콘 중복 등록하지 않기
