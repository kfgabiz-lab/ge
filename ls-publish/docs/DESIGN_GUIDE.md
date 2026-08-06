# Design Guide

Figma [LSEA 디자인](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8) 기반 UI 가이드 허브입니다.

**라이브**: [http://localhost:3000/guide](http://localhost:3000/guide)

---

## 문서 (마크업·구현 시 참조)

| 문서 | 용도 | 라이브 |
|------|------|--------|
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) | 버튼·필드·배너·모달 (Figma 04~09) | `/guide/components` |
| [ICON_GUIDE.md](./ICON_GUIDE.md) | SVG 아이콘 네이밍·사용 | `/guide/ico` |
| [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) | 섹션 마크업 규칙·워크플로 | `/guide/sections` |
| [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) | 섹션 루트 클래스 레지스트리 | `/guide/sections` |
| [GNB_GUIDE.md](./GNB_GUIDE.md) | GNB·메가 메뉴 | `/guide/gnb` |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 폴더·에셋 구조 | — |

---

## 라우트

| URL | 설명 |
|-----|------|
| `/` | 페이지 인덱스 |
| `/guide` | 가이드 허브 |
| `/guide/components` | 컴포넌트 가이드 |
| `/guide/ico` | 아이콘 가이드 |
| `/guide/sections` | 섹션 가이드 |
| `/guide/gnb` | GNB 가이드 |

---

## 소스

| 구분 | 경로 |
|------|------|
| 허브 | `src/app/guide/page.tsx` |
| 컴포넌트 | `ComponentGuide.tsx` |
| 아이콘 | `IcoGuide.tsx`, `src/data/icoGuide.ts` |
| 섹션 | `SectionGuide.tsx`, `SectionGuidePreviews.tsx`, `src/data/sectionGuide.ts` |
| GNB | `GnbGuide.tsx`, `src/data/gnbGuide.ts` |
| 내비 | `GuideNav.tsx` |

---

## CSS

| 파일 | 용도 |
|------|------|
| `globals.css` | 토큰·버튼·`.guide_field`·FAQ·공통 섹션 |
| `components/guide.css` | 가이드 UI (`/guide` 전용) |
| `components/page-index.css` | 페이지 인덱스 (`/`) |
| `components/gnb.css` | GNB·메가 메뉴 |
| `main.css`, `markets.css`, `devices-systems.css`, `devices-product-detail.css`, `company.css`, `support.css` | 페이지별 섹션 |

---

## Cursor 규칙

| 규칙 | 참조 MD |
|------|---------|
| `.cursor/rules/figma-component-guide.mdc` | [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) 등 |
| `.cursor/rules/section-markup-guide.mdc` | [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) |
