# 할 일 목록 (기술 부채 / 문제점)

> 전수 조사(2026-06-07) 결과 발견된 항목들을 우선순위별로 정리

---

## 🔴 심각 (보안 / 구조 문제)

- [ ] **list/page.tsx 리팩토링**
  - 파일: `bo/src/app/admin/templates/make/list/page.tsx` (1706줄)
  - 문제: `_shared/types.ts`의 `SearchFieldConfig` 타입을 파일 내부에 인라인 재정의, `useTemplateManagement` 훅 미사용
  - 해결: `_shared/types.ts` 타입 import로 교체, `useTemplateManagement` 훅 적용

- [ ] **grid-layout/page.tsx 리팩토링**
  - 파일: `bo/src/app/admin/templates/make/grid-layout/page.tsx` (3275줄)
  - 문제: `list/page.tsx`와 거의 동일 기능 중복 구현, `listGenerator.ts` 미사용하고 `buildTsxFile` 자체 인라인 구현, `useTemplateManagement` 훅 미사용
  - 해결: `list/page.tsx`와 통합하거나 `_shared` 공통 의존성으로 통일

- [ ] **임시 비밀번호 하드코딩 제거**
  - 파일: `bo-api/src/main/java/com/ge/bo/service/AdminService.java` (`resetPassword()`)
  - 문제: 임시 비밀번호 `'test12345'` 하드코딩 — 보안 취약
  - 해결: 랜덤 비밀번호 생성 로직으로 교체 (SecureRandom 기반)

- [ ] **JWT Secret 환경변수 분리**
  - 파일: `bo-api/src/main/resources/application.yml`
  - 문제: JWT secret 키 평문 하드코딩
  - 해결: 환경변수(`${JWT_SECRET}`) 또는 Vault로 분리

---

## 🟠 삭제 필요

- [ ] **page copy.tsx 삭제**
  - 파일: `bo/src/app/admin/widgetSub/[slug]/page copy.tsx`
  - 문제: 파일명에 공백 포함, i18n 미적용 구버전 백업, git 미추적(`??`) 상태
  - 해결: 파일 삭제

- [ ] **roles_backup 폴더 삭제**
  - 경로: `bo/src/app/admin/system/roles_backup/`
  - 문제: Next.js 라우팅에 노출되는 불필요 백업 폴더
  - 해결: 폴더 삭제

---

## 🟡 미완성 구현

- [ ] **use-menu-page-slug.ts 구현 완성**
  - 파일: `bo/src/hooks/use-menu-page-slug.ts`
  - 문제: 현재 인자를 그대로 반환하는 패스스루(미구현 상태)
  - 해결: URL 파라미터 기반 slug 처리 로직 실제 구현

- [ ] **system/roles vs settings/roles 중복 정리**
  - 파일: `bo/src/app/admin/system/roles/`, `bo/src/app/admin/settings/roles/`
  - 문제: 동일 기능(역할 CRUD) 두 페이지에 중복 구현, API endpoint와 i18n 적용 여부만 다름
  - 해결: 하나로 통합 또는 용도 명확히 분리

- [ ] **widget/[slug] 기능 widgetSub 수준으로 통일**
  - 파일: `bo/src/app/admin/widget/[slug]/page.tsx`
  - 문제: 수정 모드(`?id`, `?group_id`), 파일 업로드, MultiSelect 미지원 — widgetSub에만 구현됨
  - 해결: widget/[slug]에 해당 기능 추가 또는 widgetSub로 통합

- [ ] **i18n 미적용 페이지 일관성 확보**
  - 대상:
    - `bo/src/app/admin/system/roles/` — 한국어 하드코딩
    - `bo/src/app/admin/system/api/` — 한국어 하드코딩
    - `bo/src/app/admin/settings/slug-registry/` — 한국어 하드코딩
    - `bo/src/app/admin/manage/homepage/` — 한국어 하드코딩
  - 해결: `useI18n()` 훅 적용, 고정 텍스트 전부 `t()` 경유

---

## 🔵 문서화 필요 (Edge 브라우저 우회 코드)

> 아래 코드는 **제거하면 기능이 깨짐** — 삭제 금지, 주석/문서로 명확히 표시 필요

- [ ] `overflow: 'clip'` → RendererContainer
  - 이유: `overflow: hidden` 사용 시 Edge 비디오 GPU 레이어 버그 발생

- [ ] `display:none input` + `programmatic click()` → FileField
  - 이유: `overflow-y-auto` 컨테이너 내부에서 `onChange` 미발화 버그

- [ ] `isolation: 'isolate'` + DOM 직접 조작 `src` 주입 → VideoField
  - 이유: Edge에서 비디오 첫 프레임 디코딩 버그 대응

- [ ] `absolute inset-0` 방식 → RightDrawerLayout
  - 이유: `flex-1` 형제 방식 사용 시 Edge 파일다이얼로그 클릭 버그 발생
