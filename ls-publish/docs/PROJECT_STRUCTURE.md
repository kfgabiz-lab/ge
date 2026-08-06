# 프로젝트 폴더·에셋 구조

## 정적 리소스

### `public/`

| 경로 | 용도 |
|------|------|
| `public/ico/` | 공통 아이콘 (SVG·PNG) — `/pub/ico/...` · 레지스트리: `icoGuide.ts` |
| `public/img/` | 이미지·메인 비디오 (`main_sample.png`, `video1.mp4` 등) |
| `public/fonts/` | Plus Jakarta Sans, Pretendard |

### `src/assets/css/`

| 경로 | 용도 |
|------|------|
| `globals.css` | 디자인 토큰, 버튼, `.guide_field`·체크, FAQ, 공통 섹션 |
| `components/guide.css` | **가이드 UI** — `/guide` 전용 (hub, nav, doc, component-guide, section-guide) |
| `components/page-index.css` | 페이지 인덱스 (`/`) |
| `components/gnb.css` | GNB·메가 메뉴 |
| `main.css`, `markets.css` | 페이지별 |
| `devices-product-detail.css` | 제품 상세 |

## 앱 코드

### `src/app/`

| 경로 | 라우트 |
|------|--------|
| `page.tsx` | `/` — 페이지 인덱스 |
| `main/` | `/main` — `VideoSwiper` 슬라이드 데이터는 컴포넌트 인라인 · `main/data/mainSlides.dummy.ts`는 레거시 샘플 |
| `()/markets/` | `/markets` |
| `()/devices-systems/` | `/products-systems/...` |
| `guide/` | `/guide`, `/guide/components`, `/guide/ico`, `/guide/sections`, `/guide/gnb` |

### `src/components/`

| 경로 | 용도 |
|------|------|
| `layout/shared/GnbMenu.tsx` | GNB |
| `layout/shared/gnb-mega/` | 메가 패널 컴포넌트 |
| `guide/` | 가이드 UI |
| `banners/`, `swiper/`, `form/` | 공통 UI |

### `src/data/`

| 경로 | 용도 |
|------|------|
| `gnb/` | GNB·메가 메뉴 데이터 |
| `gnbGuide.ts` | GNB 가이드 메타 |
| `icoGuide.ts` | 공통 아이콘 (`public/ico`) 레지스트리 |
| `pageIconGuide.ts` | 페이지·레이아웃 전용 아이콘 레지스트리 |
| `sectionGuide.ts` | 섹션 가이드 메타 |
| `pageIndex.ts` | 페이지 인덱스 표 |
| `footerAffiliateOptions.ts` | 푸터 계열사 select (13개 · 새 탭) |
| `support/connectPortalContent.ts` | Connect Portal 콘텐츠·외부 URL |

## 문서 (`docs/`)

| 파일 | 용도 |
|------|------|
| [README.md](./README.md) | 문서 인덱스 |
| [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) | **허브** — 라우트·갱신·교차 참조 |
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) | UI 컴포넌트 |
| [ICON_GUIDE.md](./ICON_GUIDE.md) | 아이콘 레지스트리 |
| [SECTION_MARKUP_GUIDE.md](./SECTION_MARKUP_GUIDE.md) | 섹션 마크업·타이포 |
| [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) | 섹션 클래스 레지스트리 |
| [GNB_GUIDE.md](./GNB_GUIDE.md) | GNB·메가·모바일 |

가이드 스타일은 `components/guide.css` — `/guide` layout에서만 로드합니다. `/guide/gnb`만 `gnb.css`를 추가 로드합니다.

상세: [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)
