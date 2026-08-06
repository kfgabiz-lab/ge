# Section Markup Guide

페이지 `<section>`·섹션형 래퍼 마크업 규칙입니다.

- **클래스 레지스트리**: [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md)
- **라이브 미리보기**: `/guide/sections` · `src/data/sectionGuide.ts`
- **허브**: [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)

---

## 마크업 워크플로

1. **검색** — [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) + `/guide/sections`에서 루트 클래스 중복 확인
2. **접두어** — 페이지 도메인 접두어 결정 (아래 표)
3. **마크업** — `<section className="{root}">` + BEM 하위 + 공통 클래스
4. **CSS** — 페이지 CSS 또는 `globals.css`에 `section.{root}` 스코프 추가
5. **갱신** — 레지스트리 MD · `sectionGuide.ts` · `SectionGuidePreviews.tsx`

---

## 네이밍

| 구분 | 패턴 | 예 |
|------|------|-----|
| 섹션 루트 | `{domain}_{block}` | `markets_hero`, `devices_product_video` |
| 하위 요소 | `{root}__{element}` | `markets_hero__tit` |
| 변형 | `{root}--{variant}` | `devices_help--overlay` |
| 상태 | `.is-{state}` | `is-active`, `is-in-view` |

### 도메인 접두어

| 접두어 | 용도 | CSS |
|--------|------|-----|
| `main_` | `/main` | `main.css` |
| `markets_` | `/markets/...` | `markets.css` |
| `devices_` | `/devices-systems/...` | `devices-systems.css`, `devices-product-detail.css` |
| `common_` | 공통 배너·FAQ | `globals.css`, `main.css` |
| `highlight_` | 공통 뉴스 섹션 | `globals.css` |
| `support_` | `/support/...` | `support.css` |
| `company-` | `/company/...` (레거시 kebab) | `company.css` |

> Company 페이지는 초기 구현 시 kebab-case(`company-blog-title`)를 사용합니다. 신규 섹션은 `company_` snake_case를 권장하되, 기존 패턴과의 일관성을 우선합니다.

---

## 마크업 패턴

```tsx
<section className="markets_example" id="markets-example">
  <div className="inner">
    <div className="markets_example__head">
      <h2 className="section_tit">Title</h2>
      <p className="section_desc">Description</p>
    </div>
    <ul className="markets_example__list">...</ul>
  </div>
</section>
```

### 공통 클래스 (`globals.css`)

| 클래스 | 용도 |
|--------|------|
| `.inner` | max-width 컨테이너 |
| `.section_tit` | 섹션 h2 (50px) |
| `.section_desc` | 섹션 설명 (18px) |
| `.img_area`, `.txt_area`, `.tit`, `.item` | 카드·리스트 패턴 |

UI 컴포넌트(버튼·필드·배너)는 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)를 따릅니다.

---

## CSS 파일 매핑

| 파일 | 담당 |
|------|------|
| `globals.css` | 공통 토큰, `common_*`, `highlight_news`, 가이드 |
| `main.css` | `main_*`, `icon_cards`, `what_we_do__inner` |
| `markets.css` | `markets_*` |
| `devices-systems.css` | `devices_hero`, `devices_category`, `devices_markets` 등 |
| `devices-product-detail.css` | `devices_product_*`, `devices_hvdc_*` |
| `company.css` | `company-*`, `company-article-detail` |
| `support.css` | `support_*` |

---

## 섹션 가이드 (`/guide/sections`)

데이터는 `src/data/sectionGuide.ts`의 `sectionGuideCategories`에 정의합니다. 카테고리별 목록은 [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) 상단 표를 참고하세요.

| 파일 | 역할 |
|------|------|
| `sectionGuide.ts` | 카테고리·엔트리 메타 (루트 클래스, 컴포넌트, CSS, modifier) |
| `SectionGuide.tsx` | TOC·카테고리 렌더 · `previewByCategory` 매핑 |
| `SectionGuideBlock.tsx` | 엔트리 메타 헤더 + 미리보기 슬롯 |
| `SectionGuidePreviews.tsx` | 도메인별 미리보기 컴포넌트 |

### 미리보기 정책

- **대표 1개** — 중첩·임베드 섹션(`devices_products`, `main_notic` 등)은 부모 엔트리 `note`에만 기록
- **레지스트리만** — 다른 섹션과 동일 패턴인 Title·Contents는 MD 레지스트리에만 등록 (예: `support_download_title`)
- **No Data** — Empty 컴포넌트는 Contents 섹션 내부 변형으로 처리, 별도 가이드 엔트리 없음

---

## 새 섹션 추가 체크리스트

1. [SECTION_CLASS_GUIDE.md](./SECTION_CLASS_GUIDE.md) — 해당 카테고리 표에 추가
2. `src/data/sectionGuide.ts` — 카테고리·엔트리 (중첩·임베드는 대표 1개만)
3. `SectionGuidePreviews.tsx` — 미리보기 (또는 `SectionGuide.tsx`에 `livePage` 링크만)
4. `SectionGuide.tsx` — `previewByCategory`에 카테고리 id 매핑
5. 해당 CSS 파일 — `section.{root}` 스타일

---

## 금지

- 등록된 루트 클래스 재사용·다른 도메인 접두어 혼용
- 범용 단독 이름 (`content`, `wrapper`, `section1`)
- Figma MCP Tailwind를 섹션 루트로 그대로 사용
- 중첩·임베드 섹션을 가이드에 별도 중복 등록
