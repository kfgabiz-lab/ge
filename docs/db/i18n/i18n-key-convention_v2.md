# i18n 키 네이밍 컨벤션 v2

## 개요

기존 v1 키의 중복·불일치 문제를 해소하고, 일관성 있는 네이밍 체계를 수립한 버전.
적용 대상: `message_resource` 테이블 전체 키

---

## v1 → v2 핵심 변경 원칙

| 원칙 | v1 (구) | v2 (신) |
|---|---|---|
| 위치 세그먼트 제거 | `menu.page.title`, `site.toast.deleted` | `menu.title`, `common.deleted` |
| toast 접두사 제거 | `site.toast.created` | `site.created` |
| 검증 메시지 통합 | `login.validation.id.required` | `validation.id.required` |
| 같은 텍스트 = 같은 키 | `menu.deleted` + `site.deleted` 별도 | `common.deleted` 하나 |
| word → label 일괄 | `common.word.*` | `common.label.*` |

---

## 키 네임스페이스 구조

```
common.*          범용 UI 요소 (버튼, 라벨, 상태, 메시지)
validation.*      입력 검증 오류 메시지
{domain}.*        도메인 고유 텍스트 (menu.*, site.*, login.*)
```

### common 하위 분류

| 접두사 | 용도 | 예시 |
|---|---|---|
| `common.btn.*` | 버튼 텍스트 | `common.btn.save`, `common.btn.cancel`, `common.btn.logout` |
| `common.label.*` | 폼/테이블 라벨 | `common.label.domain`, `common.label.isActive` |
| `common.status.*` | 상태 배지 | `common.status.active`, `common.status.inactive` |
| `common.field.*` | 필드 힌트 | `common.field.optional` |
| `common.deleted` | 삭제 완료 토스트 | (단수 — 도메인 구분 없이 공통) |
| `common.loading` | 로딩 텍스트 | |

### validation 하위 분류

| 패턴 | 용도 | 예시 |
|---|---|---|
| `validation.{field}.*` | 범용 필드 검증 | `validation.id.required`, `validation.password.min` |
| `validation.{domain}.{field}.*` | 도메인 특정 검증 | `validation.site.name.required` |

> 같은 한국어 텍스트라도 도메인마다 다른 맥락이면 도메인 prefix 사용

---

## 도메인별 키 패턴

### menu 도메인

```
menu.title              페이지 제목
menu.description        페이지 설명
menu.btn.add            "메뉴 추가" 버튼
menu.btn.add_under      하위 메뉴 추가 버튼 (파라미터 포함)
menu.confirm.delete     삭제 확인 문구
menu.error.*            에러 메시지
menu.tab.*              탭 텍스트
menu.placeholder.*      placeholder
menu.notice.*           안내 문구
menu.label.*            폼 라벨
```

### site 도메인

```
site.title.new          신규 등록 타이틀
site.title.edit         수정 타이틀
site.description        폼 설명
site.label.name         홈페이지명 라벨
site.placeholder.domain 도메인 placeholder
site.confirm.delete     삭제 확인 문구
site.created            등록 완료 토스트
site.updated            수정 완료 토스트
site.load_error         데이터 로드 실패
site.btn.add            추가 버튼
site.selector.empty     선택 없음 텍스트
site.selector.no_sites  사이트 없음 텍스트
```

### code 도메인

```
code.title.*              페이지/섹션 제목 (group, groupDetail, groupNew, detail)
code.placeholder.*        입력 placeholder
code.group.*              그룹 관련 메시지 (empty, searchEmpty, selectHint1/2, deactivateConfirm, created, saved, deleted)
code.detail.*             코드 상세 관련 메시지 (added, saved, deleted, toggleError, duplicate)
```

> common 통합 키: common.label.groupCode/groupName/code/codeName/sort/description/isActive/manage
> common.status.active/inactive 값: '사용'/'미사용' (2026-06-02 UPDATE)
> common.noChange, common.status.dirty 신규 추가

---

### login 도메인

```
login.title             로그인 폼 제목
login.subtitle          부제목
login.id.label          아이디 라벨
login.id.placeholder    아이디 placeholder
login.password.label    비밀번호 라벨
login.password.placeholder 비밀번호 placeholder
login.submit            로그인 버튼
login.brand.*           브랜드 패널 텍스트
login.error.*           로그인 에러 토스트
```

---

## 중복 정리 이력

| 정리 대상 | 처리 | 날짜 |
|---|---|---|
| `menu.create.title`, `menu.create.btn.submit` → `menu.btn.add` | 미사용 v1 키 DELETE | 2026-06-02 |
| `menu.page.title` → `common.label.menumanage` | v1 page 세그먼트 키 DELETE | 2026-06-02 |
| `menu.page.description`, `common.label.menumanage.desc` | 미사용 중복 키 DELETE | 2026-06-02 |
| `menu.deleted` + `site.deleted` → `common.deleted` | 동일 텍스트 통합 | 2026-06-02 |
| `common.word.*` → `common.label.*` | DB UPDATE 일괄 변경 | 2026-06-02 |
| `common.label.usermanage` ko 오타 수정 | "관리자 관리" → "사용자 관리" | 2026-06-02 |

---

## 소스 적용 현황

| 파일 | 변경 키 |
|---|---|
| `bo/src/app/admin/settings/sites/page.tsx` | `site.toast.deleted` → `common.deleted` |
| `bo/src/app/admin/settings/sites/[id]/page.tsx` | `site.toast.*` → `site.*`, `site.validation.*` → `validation.site.*` |
| `bo/src/components/layout/header.tsx` | `common.word.logout` → `common.btn.logout` |
| `bo/src/components/auth/login-form.tsx` | `login.validation.*` → `validation.*`, `login.toast.error.*` → `login.error.*` |
| `bo/src/components/menus/menu-detail.tsx` | `menu.deleted` → `common.deleted` |
| `bo/src/components/codes/code-group-list.tsx` | 하드코딩 전체 → `code.*`, `common.*` |
| `bo/src/components/codes/code-detail.tsx` | 하드코딩 전체 → `code.*`, `common.*`, `validation.code.*` |
| `bo/src/components/codes/code-detail-table.tsx` | 하드코딩 전체 → `code.*`, `common.*`, `validation.code.*` |

---

## 신규 키 등록 가이드라인

1. **버튼**: `common.btn.{action}` — save, cancel, delete, add, edit, logout, search, reset
2. **라벨**: `common.label.{field}` — 여러 도메인에서 공통 사용 시
3. **도메인 전용 라벨**: `{domain}.label.{field}`
4. **상태**: `common.status.{state}` — active, inactive, pending
5. **검증**: `validation.{field}.{rule}` 또는 `validation.{domain}.{field}.{rule}`
6. **완료 메시지**: 도메인 구분 없이 같은 텍스트면 `common.{action}ed` 사용
7. **에러**: `{domain}.error.{type}` — 도메인 고유 에러는 도메인 prefix 유지
