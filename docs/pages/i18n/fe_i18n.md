# [다국어 관리] FE 상세 설계서

- **버전:** v1
- **작성일:** 2026-05-18
- **작성자:** Service Planner Agent
- **관련 문서:** `docs/db/i18n/db_i18n.md`, `docs/pages/i18n/be_i18n.md`

---

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 다국어(message_resource) 관리 |
| UI 방침 | 빌더 UI 패턴 — `PageLayout + SearchWidget + SpaceWidget + TableWidget` |
| 등록/수정 | Drawer (우측 슬라이드인) |
| 삭제 | ConfirmModal |
| 참조 패턴 | `system/roles/page.tsx` (빌더 UI), `settings/roles/RoleDrawer.tsx` (Drawer 스타일) |

---

## 2. 페이지 구조 및 라우팅

```
/admin/settings/i18n    → 다국어 목록 페이지 (검색 + 테이블 + Drawer)
```

---

## 3. 컴포넌트 구조

```
bo/src/app/admin/settings/i18n/
  └── page.tsx                          ← 다국어 목록 페이지 (신규)

bo/src/components/i18n/
  └── MessageResourceDrawer.tsx         ← 등록/수정 Drawer (신규)

bo/src/store/
  └── useMessageResourceStore.ts        ← 상태 관리 (신규)
```

---

## 4. 데이터 타입 정의

```typescript
/* 다국어 항목 타입 */
interface MessageResource {
    id: number;
    key: string;
    ko: string;
    en: string | null;
    active: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

/* 목록 조회 응답 타입 */
interface MessageResourcePage {
    content: MessageResource[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

/* 검색 파라미터 타입 */
interface MessageResourceSearch {
    key: string;
    ko: string;
    en: string;
    active: string;   /* '전체' | 'true' | 'false' */
    page: number;
    size: number;
}
```

### Zod 유효성 검사 스키마

```typescript
import { z } from 'zod';

/* 등록 스키마 */
export const createSchema = z.object({
    key: z
        .string()
        .min(1, '번역 키를 입력해주세요.')
        .max(255, '번역 키는 255자 이하여야 합니다.')
        .regex(/^[a-zA-Z0-9.]+$/, '번역 키는 영문, 숫자, 점(.)만 입력 가능합니다.'),
    ko: z
        .string()
        .min(1, '한국어를 입력해주세요.')
        .max(500, '한국어는 500자 이하여야 합니다.'),
    en: z
        .string()
        .max(500, '영어는 500자 이하여야 합니다.')
        .optional(),
});

/* 수정 스키마 (key 제외) */
export const updateSchema = z.object({
    ko: z
        .string()
        .min(1, '한국어를 입력해주세요.')
        .max(500, '한국어는 500자 이하여야 합니다.'),
    en: z
        .string()
        .max(500, '영어는 500자 이하여야 합니다.')
        .optional(),
    active: z.boolean(),
});

export type CreateFormData = z.infer<typeof createSchema>;
export type UpdateFormData = z.infer<typeof updateSchema>;
```

---

## 5. 상태 관리 설계 (useMessageResourceStore)

### 5.1 전역 상태

| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `items` | `MessageResource[]` | `[]` | 현재 페이지 목록 |
| `totalElements` | `number` | `0` | 전체 건수 |
| `totalPages` | `number` | `0` | 전체 페이지 수 |
| `currentPage` | `number` | `0` | 현재 페이지 (0부터) |
| `isLoading` | `boolean` | `false` | 목록 조회 로딩 |
| `isDrawerOpen` | `boolean` | `false` | Drawer 열림 여부 |
| `selectedItem` | `MessageResource \| null` | `null` | 수정 대상 (null이면 등록 모드) |

### 5.2 액션 목록

| 액션 | 설명 |
|---|---|
| `fetchItems(search)` | 목록 조회 (`GET /api/v1/message-resources`) |
| `createItem(data)` | 등록 (`POST /api/v1/message-resources`) |
| `updateItem(id, data)` | 수정 (`PUT /api/v1/message-resources/{id}`) |
| `deleteItem(id)` | 삭제 (`DELETE /api/v1/message-resources/{id}`) |
| `openDrawer(item?)` | Drawer 오픈 — item 없으면 등록, 있으면 수정 |
| `closeDrawer()` | Drawer 닫기 + selectedItem 초기화 |

---

## 6. 목록 페이지 (`i18n/page.tsx`)

### 6.1 Widget 구성

**SEARCH_WIDGET** — key / 한국어 / 영어 / 사용여부 검색

```typescript
const SEARCH_WIDGET: SearchWidget = {
    type: 'search',
    widgetId: 'i18n-search',
    contentKey: 'i18nSearch',
    displayStyle: 'simple',
    rows: [
        {
            id: 'r1',
            cols: 4,
            fields: [
                { id: 'f1', type: 'input',  label: 'Key',     colSpan: 1, placeholder: '번역 키 검색' },
                { id: 'f2', type: 'input',  label: '한국어', colSpan: 1, placeholder: '한국어 검색' },
                { id: 'f3', type: 'input',  label: '영어',   colSpan: 1, placeholder: '영어 검색' },
                { id: 'f4', type: 'select', label: '사용여부', colSpan: 1, options: ['전체', '사용', '미사용'] },
            ],
        },
    ],
};
```

**SPACE_WIDGET** — 항목 추가 버튼 (우측 정렬)

```typescript
const SPACE_WIDGET: SpaceWidget = {
    type: 'space',
    widgetId: 'i18n-space',
    align: 'right',
    showBorder: false,
    items: [
        {
            id: 's1', type: 'action-button', label: '항목 추가',
            colSpan: 1, color: 'black', connType: 'close',
        },
    ],
};
```

**TABLE_WIDGET** — 목록 테이블

```typescript
const TABLE_WIDGET: TableWidget = {
    type: 'table',
    widgetId: 'i18n-table',
    contentKey: 'i18nList',
    displayMode: 'pagination',
    pageSize: 20,
    connectedSearchIds: ['i18n-search'],
    columns: [
        { id: 'c1', header: 'Key',     accessor: 'key',       cellType: 'text',    align: 'left',   sortable: true,  width: 200 },
        { id: 'c2', header: '한국어', accessor: 'ko',        cellType: 'text',    align: 'left',   sortable: false },
        { id: 'c3', header: '영어',   accessor: 'en',        cellType: 'text',    align: 'left',   sortable: false },
        {
            id: 'c4', header: '사용여부', accessor: 'active', cellType: 'badge',   align: 'center', sortable: false, width: 90,
            cellOptions: [
                { value: 'true',  text: '사용',   color: 'green' },
                { value: 'false', text: '미사용', color: 'gray'  },
            ],
        },
        { id: 'c5', header: '등록일', accessor: 'createdAt', cellType: 'text',    align: 'center', sortable: true,  width: 160 },
        { id: 'c6', header: '관리',   accessor: '_actions',  cellType: 'actions', align: 'center', sortable: false, width: 100, actions: ['edit', 'delete'] },
    ],
};
```

### 6.2 검색 상태

| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `searchValues` | `Record<string, string>` | `{ f1:'', f2:'', f3:'', f4:'전체' }` | 입력 중인 검색값 |
| `appliedSearch` | `Record<string, string>` | 동일 | 실제 적용된 검색값 |
| `sortKey` | `string \| null` | `null` | 정렬 컬럼 |
| `sortDir` | `'asc' \| 'desc'` | `'asc'` | 정렬 방향 |
| `deleteTarget` | `MessageResource \| null` | `null` | 삭제 확인 대상 |

### 6.3 이벤트 핸들러

| 대상 | 이벤트 | 동작 |
|---|---|---|
| 페이지 진입 | Mount | `fetchItems(defaultSearch)` 호출 |
| 검색 필드 변경 | `onSearchChange` | `searchValues` 업데이트 |
| 검색 버튼 | `onSearch` | `appliedSearch` 업데이트 → `fetchItems()` 호출 + page 0 리셋 |
| 초기화 버튼 | `onReset` | `searchValues`, `appliedSearch` 초기화 → `fetchItems()` |
| 수정 버튼 | `handlers.onEdit(row)` | `openDrawer(item)` |
| 삭제 버튼 | `handlers.onDelete(id)` | `deleteTarget` 설정 → ConfirmModal 오픈 |
| 삭제 확인 | ConfirmModal `onConfirm` | `deleteItem(id)` → 성공 토스트 → `fetchItems()` |
| 항목 추가 버튼 | SpaceWidget `onClose` | `openDrawer()` (등록 모드) |
| 페이지 변경 | `onPageChange` | `fetchItems({ page })` |
| 정렬 변경 | `onSort` | `sortKey`, `sortDir` 업데이트 → `fetchItems()` |

### 6.4 페이지 레이아웃

```tsx
<PageLayout mode="live">
    {/* 검색 위젯 */}
    <GridCell colSpan={12} rowSpan={1}>
        <WidgetRenderer mode="live" widget={SEARCH_WIDGET} contentColSpan={12}
            searchValues={searchValues}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            onReset={handleReset}
        />
    </GridCell>

    {/* 항목 추가 버튼 */}
    <GridCell colSpan={1} colStart={12} rowSpan={1}>
        <WidgetRenderer mode="live" widget={SPACE_WIDGET} contentColSpan={1}
            onClose={() => openDrawer()}
        />
    </GridCell>

    {/* 테이블 위젯 */}
    <GridCell colSpan={12} rowSpan={7}>
        <WidgetRenderer mode="live" widget={TABLE_WIDGET} contentColSpan={12}
            tableData={tableData}
            tableLoading={isLoading}
            totalElements={totalElements}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            handlers={handlers}
        />
    </GridCell>
</PageLayout>

{/* 등록/수정 Drawer */}
<MessageResourceDrawer />

{/* 삭제 확인 모달 */}
<ConfirmModal
    isOpen={!!deleteTarget}
    onClose={() => setDeleteTarget(null)}
    onConfirm={handleDeleteConfirm}
    title="항목 삭제"
    description={`'${deleteTarget?.key}' 항목을 삭제하시겠습니까?`}
    confirmText="삭제하기"
    variant="danger"
/>
```

---

## 7. Drawer 컴포넌트 (`MessageResourceDrawer.tsx`)

### 7.1 구조

- 우측 슬라이드인 (420px, `RoleDrawer.tsx` 동일 스타일)
- 헤더: "항목 추가" / "항목 수정" + 닫기 버튼
- 바디: react-hook-form + Zod
- 푸터: 취소 버튼 + 등록/저장 버튼

### 7.2 폼 필드

| 필드 | 필수 | 비고 |
|---|---|---|
| Key | Y | 등록 시만 입력 가능, 수정 시 잠금(readOnly) |
| 한국어 | Y | textarea (여러 줄 대응) |
| 영어 | N | textarea (여러 줄 대응) |
| 사용여부 | Y | 수정 모드에서만 노출 (토글 버튼) |

### 7.3 제출 처리

```
등록 모드: createSchema 검증 → createItem(data) → 성공 토스트 → closeDrawer → fetchItems()
수정 모드: updateSchema 검증 → updateItem(id, data) → 성공 토스트 → closeDrawer → fetchItems()
실패 시: BE 응답 메시지 우선 → 없으면 기본 오류 토스트
```

---

## 8. API 연동 명세

| 액션 | Method | Endpoint | 호출 시점 |
|---|---|---|---|
| 목록 조회 | GET | `/api/v1/message-resources` | 페이지 진입, 검색, 정렬, 페이지 변경 |
| 등록 | POST | `/api/v1/message-resources` | Drawer 등록 제출 |
| 수정 | PUT | `/api/v1/message-resources/{id}` | Drawer 수정 제출 |
| 삭제 | DELETE | `/api/v1/message-resources/{id}` | ConfirmModal 확인 |

---

## 9. 영향도 평가

| 파일 | 수정 유형 | 영향 범위 |
|---|---|---|
| `settings/i18n/page.tsx` | **신규** | 없음 |
| `components/i18n/MessageResourceDrawer.tsx` | **신규** | 없음 |
| `store/useMessageResourceStore.ts` | **신규** | 없음 |

**기존 파일 수정 없음.**

---

## 10. FE 개발 체크리스트

### 10.1 데이터 및 유효성 검사
- [ ] Zod `createSchema` — key 정규식(`/^[a-zA-Z0-9.]+$/`) 적용 확인
- [ ] Zod `updateSchema` — key 필드 미포함 확인
- [ ] 등록 시 key 필수, 한국어 필수, 영어 선택 처리
- [ ] 수정 시 key 잠금(readOnly) 처리
- [ ] 에러 메시지 필드별 정상 표시 확인

### 10.2 상태 관리
- [ ] `isLoading` 상태 — 테이블 로딩 스피너 표시
- [ ] 빈 결과 — 빈 상태 메시지 표시
- [ ] API 실패 — 에러 토스트 표시
- [ ] `deleteTarget` — ConfirmModal 열림/닫힘 상태 정상 동작

### 10.3 API 연동
- [ ] 목록 조회 — 검색 4개 조건 AND 조합 정상 동작
- [ ] 등록 성공 — 성공 토스트 + Drawer 닫힘 + 목록 새로고침
- [ ] 수정 성공 — 성공 토스트 + Drawer 닫힘 + 목록 새로고침
- [ ] 삭제 성공 — 성공 토스트 + 목록 새로고침
- [ ] key 중복 등록 — 409 에러 토스트 "이미 사용 중인 번역 키입니다."
- [ ] 존재하지 않는 id 수정/삭제 — 404 에러 토스트
- [ ] Validation 에러 — 400 에러 토스트

### 10.4 컴포넌트 완결성
- [ ] SearchWidget 3개 input + 사용여부 select 정상 렌더링
- [ ] SpaceWidget 추가 버튼 클릭 시 등록 모드 Drawer 오픈
- [ ] TableWidget 수정 버튼 클릭 시 수정 모드 Drawer 오픈 + 기존 값 바인딩
- [ ] TableWidget 삭제 버튼 클릭 시 ConfirmModal 오픈
- [ ] active 컬럼 — 사용(green) / 미사용(gray) 배지 표시
- [ ] Drawer — 수정 모드에서 사용여부 토글 노출 확인

### 10.5 코드 품질
- [ ] `tsc --noEmit` 에러 없음
- [ ] 인라인 코딩 없음 — 모든 로직 컴포넌트/스토어 분리
- [ ] 하드코딩 잔재 없음 (API URL 등)
