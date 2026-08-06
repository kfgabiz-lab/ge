# Icon Guide

`public/ico` SVG 아이콘 네이밍·사용 가이드입니다.

- **라이브**: `/guide/ico` → `IcoGuide.tsx`
- **데이터**: `src/data/icoGuide.ts`
- **허브**: [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)

> GNB 헤더·메가 메뉴 아이콘은 **이 가이드가 아닌** [GNB_GUIDE.md](./GNB_GUIDE.md) · `src/data/gnbGuide.ts`를 참고합니다.

---

## 경로

| 구분 | 경로 |
|------|------|
| 파일 | `public/ico/*.svg` |
| 앱 참조 | `/ico/파일명.svg` |

---

## 파일 네이밍

- 모든 파일은 `ico_` 접두사
- `ico_{역할}_{크기}_{색상}.svg` — 예: `ico_search_24_white.svg`
- `ico_{역할}.svg` — 예: `ico_bell_20.svg`

### 체크박스 (22px)

| 파일 | 용도 |
|------|------|
| `ico_check` / `ico_checked` | MUI Checkbox — [Component Guide](./COMPONENT_GUIDE.md#check) |
| `ico_check_block` / `ico_checked_black` | Downloads 필터 |

---

## CSS 유틸 클래스

`globals.css`에서 SVG를 background로 매핑합니다.

| 클래스 | 예 |
|--------|-----|
| `icon_arrow-14` | 소형 CTA |
| `icon_arrow-18` | 배너·링크 |
| `icon_arrow-20` | 카드 nav |
| `icon_link-14` | 외부 링크 |
| `icon_external-18` | Help 카드 |

페이지 마크업 시 **파일 직접 `<img>`** 또는 **CSS 유틸** 중 가이드·기존 패턴과 동일한 방식을 사용합니다.

---

## 새 아이콘 추가 시 갱신

1. `public/ico/` — SVG 추가 (LICENSE 확인)
2. `src/data/icoGuide.ts` — 메타 등록
3. 필요 시 `globals.css` — CSS 유틸 매핑
4. **이 문서** — 네이밍·용도 (필요 시)

---

## 금지

- GNB 전용 아이콘을 `icoGuide.ts`에 등록 (→ `gnbGuide.ts`)
- 유료 아이콘 폰트·키트 (`.cursor/rules/no-paid-licenses.mdc`)
