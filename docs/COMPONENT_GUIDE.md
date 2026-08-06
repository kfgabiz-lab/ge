# Component Guide

Figma [LSEA 디자인](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8) 기반 UI 컴포넌트 구현 가이드입니다.

- **라이브**: `/guide/components` → `ComponentGuide.tsx`
- **스타일**: `src/assets/css/globals.css` (토큰·`.guide_field`), `src/assets/css/components/guide.css` (가이드 UI)
- **허브**: [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)

---

## 참조 순서 (Figma → 코드)

1. [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) — 가이드 허브
2. **이 문서** + `/guide/components`
3. [ICON_GUIDE.md](./ICON_GUIDE.md) — SVG·CSS 아이콘 유틸
4. [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) — 페이지 섹션 마크업
5. [GNB_GUIDE.md](./GNB_GUIDE.md) — GNB·메가 메뉴 (GNB 작업 시)

---

## Figma 매핑

| Figma | 앵커 | 클래스·패턴 |
|-------|------|-------------|
| 04 Button | `#button` | `btn-base`, `btn-lv01`~`03`, `btn-icon-56`, `btn-text-30`, Swiper nav |
| 05 Check | `#check` | MUI `Checkbox` + `ico_check.svg` / `ico_checked.svg` (22px) |
| 06 Textfield | `#textfield` | MUI `TextField`/`Select`, `.guide_field`, 높이 50px/38px, Select `ico_up_16.svg`, Search `ico_search_24.svg` |
| 07 Pagination | `#pagination` | `PageNumbering`, `ico_pag_chev_10.svg` |
| 08 Banner | `#banner` | `common_banner_01`~`03`, `btn-lv01--line-solid`, `btn-text-30`, `icon_link-14`, `icon_arrow-18` |
| 09 Modal | `#modal` | `devices_download_desc_modal`, 트리거 `devices_product_downloads__view-desc` |

---

## 구현 원칙

- 가이드에 **이미 있는** 컴포넌트는 동일 클래스·MUI 패턴·아이콘 경로를 **재사용**한다. Figma MCP 출력(Tailwind 등)을 그대로 붙이지 않는다.
- 가이드에 **없는** Figma 컴포넌트는 기능 구현과 함께 `ComponentGuide.tsx` + `globals.css`에 섹션을 **추가**해 가이드를 갱신한다.
- 토큰·치수는 `:root` 및 CSS 변수(`--color-*`, `--field-h`, `--btn-lv01-h` 등)를 따른다.
- 아이콘은 [ICON_GUIDE.md](./ICON_GUIDE.md)를 따른다. GNB 전용 아이콘은 [GNB_GUIDE.md](./GNB_GUIDE.md).

---

## 새 컴포넌트 추가 시 갱신

1. `src/components/guide/ComponentGuide.tsx` — 미리보기 섹션
2. `src/assets/css/globals.css` — 스타일·토큰
3. 필요 시 `public/ico/` + [ICON_GUIDE.md](./ICON_GUIDE.md)
4. **이 문서** — Figma 매핑 표

---

## 금지

- 가이드와 다른 버튼/필드/체크박스 스타일을 페이지에만 따로 정의
- 유료 UI 키트·아이콘 폰트 도입 (`.cursor/rules/no-paid-licenses.mdc`)
