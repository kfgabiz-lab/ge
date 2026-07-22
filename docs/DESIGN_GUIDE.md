# Design Guide

Figma [LSEA 디자인](https://www.figma.com/design/FJa9pa866Be2aj5HYV717D/LSEA_%EB%94%94%EC%9E%90%EC%9D%B8) 기반 UI 가이드 허브입니다.

| 항목 | 경로 |
|------|------|
| **라이브** | `/guide` → `src/app/guide/page.tsx` |
| **내비** | `src/components/guide/GuideNav.tsx` |

**라이브 URL**: [http://localhost:3000/pub/guide](http://localhost:3000/pub/guide)

`basePath` `/pub` 적용 시 브라우저 URL은 `/pub/guide/...`입니다. 문서·코드의 경로 표기는 `/guide/...` · `/markets/...` 형식을 유지합니다.

---

## 목차

1. [문서 역할](#문서-역할)
2. [갱신 워크플로](#갱신-워크플로)
3. [교차 참조](#교차-참조)
4. [라우트](#라우트)
5. [소스·CSS](#소스)
6. [Cursor 규칙](#cursor-규칙)

---

## 문서 역할

| 문서 | 담당 | 라이브 | 데이터 소스 |
|------|------|--------|-------------|
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) | 버튼·필드·배너·체크·모달 (Figma 04~08) | `/guide/components` | `ComponentGuide.tsx` · `globals.css` |
| [ICON_GUIDE.md](./ICON_GUIDE.md) | 공통·페이지 아이콘 | `/guide/ico` | `icoGuide.ts` · `pageIconGuide.ts` |
| [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) | 섹션 마크업·타이포 (`__heading` · `__desc`) | `/guide/sections` | — |
| [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) | 섹션 루트 클래스 레지스트리 | `/guide/sections` | `sectionGuide.ts` |
| [GNB_GUIDE.md](./GNB_GUIDE.md) | PC·모바일 GNB·메가 메뉴 | `/guide/gnb` | `gnb/mega/*.ts` · `gnbGuide.ts` |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 폴더·에셋 구조 | — | — |
| [README.md](./README.md) | 문서 인덱스 | — | — |

**원칙** — `*Guide.ts`·`sectionGuide.ts`가 **단일 소스**. MD는 사람이 읽는 규칙·레지스트리·워크플로 설명용입니다.

---

## 갱신 워크플로

| 작업 | 갱신 대상 |
|------|-----------|
| 새 섹션 | [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) · `sectionGuide.ts` · `SectionGuidePreviews.tsx` · 페이지 CSS |
| 새 UI 컴포넌트 | [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) · `ComponentGuide.tsx` · `globals.css` |
| 새 공통 아이콘 | `public/ico` · `icoGuide.ts` · [ICON_GUIDE.md](./ICON_GUIDE.md) |
| 페이지 전용 아이콘 | `public/img/{영역}/` · `pageIconGuide.ts` · [ICON_GUIDE.md](./ICON_GUIDE.md) §2 |
| GNB·메가 메뉴 | `src/data/gnb/mega/*.ts` · [GNB_GUIDE.md](./GNB_GUIDE.md) · `gnbGuide.ts` |

Figma·페이지 구현 시 **해당 MD + 라이브 가이드(`src/components/guide/`, `src/data/*Guide.ts`)를 동시 갱신**합니다.

---

## 교차 참조

대표 페이지별로 어느 가이드를 볼지 빠르게 찾습니다. 상세 스펙은 각 MD를 따릅니다.

| 작업 | 섹션 | 컴포넌트 | 아이콘 |
|------|------|----------|--------|
| `/search` | [SECTION_CLASS](./SECTION_CLASS_GUIDE.md) Search · tablet 2열 규칙 | [COMPONENT](./COMPONENT_GUIDE.md) `#search-80` · 검색 패널 | [ICON](./ICON_GUIDE.md) Search · MO clear |
| Cookie consent 모달 | [SECTION_CLASS](./SECTION_CLASS_GUIDE.md) Common | `CookieSettingsModal` · `CookiePreferencesModal` | `ico_cl.svg` · Check 22px |
| Support 검색 툴바 | `support_*_search` | `guide_field--search` `#search-280` | `ico_search_24` · `ico_clear_12` |
| Contact Us modals | [SECTION_CLASS](./SECTION_CLASS_GUIDE.md) Contact Us | `common_modal` | `ico_cl.svg` |
| GNB | [GNB_GUIDE](./GNB_GUIDE.md) | `gnb.css` | [ICON](./ICON_GUIDE.md) §3 |
| Software products | [SECTION_CLASS](./SECTION_CLASS_GUIDE.md) Product Detail | `DevicesSoftwareHero` 등 | `ico_filter_14` · `ico_swipe_70` |
| Company About | [SECTION_CLASS](./SECTION_CLASS_GUIDE.md) Company | `CompanyAboutIntroSection` 등 | `pageIconGuide.ts` |
| Services | [SECTION_CLASS](./SECTION_CLASS_GUIDE.md) Services | `guide_field` · `PageNumbering` · Swiper · `btn-lv01`/`btn-lv02` | `icon_link-14` · `ico_swipe_70` (Warranty) · `ico_up_16` (Curriculum native select) |

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
| 컴포넌트 | `src/components/guide/ComponentGuide.tsx` |
| 아이콘 | `IcoGuide.tsx`, `icoGuide.ts`, `pageIconGuide.ts` |
| 섹션 | `SectionGuide.tsx`, `SectionGuidePreviews.tsx`, `sectionGuide.ts` |
| GNB | `GnbGuide.tsx`, `gnbGuide.ts` |
| 내비 | `GuideNav.tsx` |
| 레이아웃 푸터 | `MainFooter.tsx` |

### CSS

| 파일 | 용도 |
|------|------|
| `globals.css` | 토큰·전역 custom scrollbar·버튼·`.guide_field`·FAQ·`common_banner_*`·`common_modal` |
| `components/guide.css` | 가이드 UI (`/guide` 전용) |
| `components/gnb.css` | GNB·메가 메뉴·모바일 패널 |
| `components/MainFooter.css` | `main_footer` |
| `main.css`, `markets.css`, `devices-systems.css`, `devices-product-detail.css`, `company.css`, `company-feed.css`, `support.css`, `services.css`, `training.css`, `search.css` | 페이지별 섹션 |

---

## Cursor 규칙

| 규칙 | 참조 MD |
|------|---------|
| `.cursor/rules/figma-component-guide.mdc` | [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) 등 |
| `.cursor/rules/section-markup-guide.mdc` | [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) |
| `.cursor/rules/no-paid-licenses.mdc` | 유료 라이선스 금지 |
