# 홈페이지(Site) 관리 FE 상세 설계서

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 홈페이지(Site) 관리 |
| 작성일 | 2026-05-14 |
| 관련 문서 | docs/db/site/db_site.md, docs/pages/site/be_site.md |

> **UI 방침**: 목록·상세 페이지 분리 구조 (roles 관리 동일 패턴).  
> 빌더 UI 컴포넌트 직접 활용, 슬러그 기반 자동조회 X, 커스텀 API 연동.
> - 목록 페이지: `TableWidget + SearchWidget + WidgetRenderer`
> - 상세 페이지: `FormWidget + SpaceWidget + WidgetRenderer`

---

## 2. 페이지 구조 및 라우팅

```
/admin/settings/sites           → 홈페이지 목록 페이지
/admin/settings/sites/new       → 홈페이지 등록 페이지
/admin/settings/sites/[id]      → 홈페이지 수정 페이지
```

---

## 3. 컴포넌트 구조

```
bo/src/app/admin/settings/sites/
  ├── page.tsx                   ← 홈페이지 목록 페이지
  └── [id]/
      └── page.tsx               ← 홈페이지 상세(등록/수정) 페이지
bo/src/store/useSiteStore.ts     ← 홈페이지 상태 관리 (Zustand)

— 기존 파일 수정 —
bo/src/components/layout/Header.tsx          ← 헤더 홈페이지 선택 드롭다운 추가
bo/src/components/admin-users/AdminDrawer.tsx ← 홈페이지 매핑 섹션 추가
```

---

## 4. 데이터 타입 정의

```typescript
interface Site {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}
```

### 유효성 검사 규칙

| 필드 | 필수 | 규칙 | 에러 메시지 |
|---|---|---|---|
| `name` | Y | 1~255자 | "홈페이지명을 입력해주세요." |
| `description` | N | 최대 500자 | - |
| `isActive` | Y | Boolean | - |

---

## 5. 상태 관리 설계 (useSiteStore)

### 5.1 전역 상태

| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `sites` | `Site[]` | `[]` | 전체 홈페이지 목록 |
| `activeSiteId` | `number \| null` | `null` | 헤더 선택 기준 홈페이지 ID (localStorage 동기화) |
| `isLoading` | `boolean` | `false` | 목록 조회 로딩 |

### 5.2 액션 목록

| 액션 | 설명 |
|---|---|
| `fetchSites()` | 전체 홈페이지 목록 조회 (`GET /api/v1/sites`) |
| `createSite(data)` | 홈페이지 등록 (`POST /api/v1/sites`) |
| `updateSite(id, data)` | 홈페이지 수정 (`PATCH /api/v1/sites/{id}`) |
| `deleteSite(id)` | 홈페이지 삭제 (`DELETE /api/v1/sites/{id}`) |
| `setActiveSiteId(id)` | 헤더 기준 홈페이지 변경 + localStorage 저장 |
| `loadActiveSiteFromStorage()` | 앱 초기화 시 localStorage → activeSiteId 복원 |

### 5.3 localStorage 동기화

- key: `bo_active_site_id`
- `setActiveSiteId(id)` 호출 시 localStorage 자동 저장
- 앱 초기화 시 `loadActiveSiteFromStorage()` 호출로 복원

---

## 6. 목록 페이지 (`sites/page.tsx`)

### 6.1 Widget 구성

**TABLE_WIDGET**

```typescript
const TABLE_WIDGET: TableWidget = {
    type: 'table',
    widgetId: 'sites-table',
    contentKey: 'sitesList',
    title: '홈페이지 목록',
    showBorder: true,
    columns: [
        { id: 'c1', header: '홈페이지명', accessor: 'name',        cellType: 'text',  align: 'left',   sortable: false },
        { id: 'c2', header: '설명',       accessor: 'description', cellType: 'text',  align: 'left',   sortable: false },
        {
            id: 'c3', header: '사용여부', accessor: 'isActive', cellType: 'badge', align: 'center', sortable: false,
            cellOptions: [
                { value: 'true',  text: '사용',   color: 'green' },
                { value: 'false', text: '미사용', color: 'gray'  },
            ],
        },
        { id: 'c4', header: '관리', accessor: '', cellType: 'actions', align: 'center', sortable: false, actions: ['edit', 'delete'] },
    ],
};
```

**SPACE_WIDGET** (상단 버튼 영역 — 홈페이지 추가)

```typescript
const SPACE_WIDGET: SpaceWidget = {
    type: 'space',
    widgetId: 'sites-top-space',
    align: 'right',
    showBorder: false,
    items: [
        {
            id: 's1', type: 'action-button', label: '홈페이지 추가', colSpan: 1,
            color: 'black', connType: 'path', fileLayerSlug: '/admin/settings/sites/new',
        },
    ],
};
```

### 6.2 로컬 상태

| 상태명 | 타입 | 설명 |
|---|---|---|
| `tableData` | `Record<string, unknown>[]` | sites를 테이블 row 형태로 변환 |
| `tableLoading` | `boolean` | 로딩 여부 |

### 6.3 이벤트 핸들러

| 대상 | 이벤트 | 동작 |
|---|---|---|
| 페이지 진입 | Mount | `fetchSites()` → `tableData` 구성 |
| 수정 버튼 | `handlers.onEdit(row)` | `router.push('/admin/settings/sites/{id}')` |
| 삭제 버튼 | `handlers.onDelete(id)` | confirm → `deleteSite(id)` → `fetchSites()` |
| 홈페이지 추가 버튼 | SpaceWidget path | `router.push('/admin/settings/sites/new')` |

---

## 7. 상세 페이지 (`sites/[id]/page.tsx`)

`id === 'new'` 이면 등록 모드, 숫자이면 수정 모드. (`roles/[id]/page.tsx` 동일 패턴)

### 7.1 Widget 구성

**FORM_WIDGET**

```typescript
const FORM_WIDGET: FormWidget = useMemo(() => ({
    type: 'form',
    widgetId: 'sites-detail-form',
    contentKey: 'sitesDetailForm',
    title: isNew ? '홈페이지 등록' : '홈페이지 수정',
    description: '필수 입력 항목은 * 로 표시됩니다.',
    showBorder: true,
    fields: [
        { id: 'name',        type: 'input',  label: '홈페이지명', colSpan: 8,  rowSpan: 1, required: true,  fieldKey: 'name',        placeholder: '예: 북미홈페이지' },
        { id: 'isActive',    type: 'select', label: '사용여부',   colSpan: 4,  rowSpan: 1, required: true,  fieldKey: 'isActive',    options: ['true', 'false'] },
        { id: 'description', type: 'input',  label: '설명',       colSpan: 12, rowSpan: 1, required: false, fieldKey: 'description', placeholder: '선택사항' },
    ],
}), [isNew]);
```

**SPACE_WIDGET** (취소/저장 버튼)

```typescript
const SPACE_WIDGET: SpaceWidget = {
    type: 'space',
    widgetId: 'sites-detail-space',
    align: 'right',
    showBorder: false,
    items: [
        { id: 's1', type: 'action-button', label: '취소', colSpan: 1, color: 'gray',  connType: 'close' },
        { id: 's2', type: 'action-button', label: '저장', colSpan: 1, color: 'black', connType: 'content', connectedContentWidgetIds: ['sites-detail-form'], contentAction: 'save' },
    ],
};
```

### 7.2 로컬 상태

| 상태명 | 타입 | 설명 |
|---|---|---|
| `loading` | `boolean` | 기존 데이터 로드 중 |
| `saving` | `boolean` | 저장 중 (중복 클릭 방지) |
| `formValues` | `Record<string, string>` | 폼 필드값 (`fieldId → value`) |

### 7.3 이벤트 핸들러

| 대상 | 이벤트 | 동작 |
|---|---|---|
| 페이지 진입 (수정 모드) | Mount | `GET /api/v1/sites/{id}` → `formValues` 바인딩 |
| 폼 필드 변경 | `onFormValuesChange` | `formValues` 업데이트 |
| 저장 버튼 | `onContentAction('save')` | validation → POST or PATCH → `router.push('/admin/settings/sites')` |
| 취소 버튼 | `onClose` | `router.back()` |

### 7.4 페이지 레이아웃

```tsx
<PageLayout mode="live">
    {/* 폼 */}
    <GridCell colSpan={12} rowSpan={5}>
        <WidgetRenderer mode="live" widget={FORM_WIDGET} contentColSpan={12}
            formValues={formValues} onFormValuesChange={handleFormChange} />
    </GridCell>

    {/* 버튼 */}
    <GridCell colSpan={2} colStart={11} rowSpan={1}>
        <WidgetRenderer mode="live" widget={SPACE_WIDGET} contentColSpan={2}
            onContentAction={handleContentAction} onClose={() => router.back()} />
    </GridCell>
</PageLayout>
```

---

## 8. 헤더 홈페이지 선택 드롭다운

**위치**: `Header.tsx` — 우측 액션 버튼 그룹 앞에 추가

```
[ Globe 아이콘 ]  [ 북미홈페이지 ▼ ]
```

- 마운트 시 `fetchSites()` + `loadActiveSiteFromStorage()` 호출
- isActive=true 홈페이지만 드롭다운에 표시
- 선택 시 `setActiveSiteId(id)` → localStorage 저장
- 홈페이지 없으면 "홈페이지 없음" 비활성 표시

---

## 9. 관리자 Drawer — 홈페이지 매핑 섹션

**위치**: `AdminDrawer.tsx` — 역할 선택 아래

**UI**: `MenuRoleMatrix.tsx` 동일한 체크박스 그리드 패턴

```
홈페이지 접근 권한
[ ✓ 북미홈페이지 ] [ 유럽홈페이지 ]
```

**동작**:
1. `isDrawerOpen` 시 → `GET /api/v1/admin-users/{id}/sites` → `mappedSiteIds` Set 구성
2. 체크박스 토글 → 로컬 상태만 변경
3. 저장 버튼 → 관리자 PATCH + `PUT /api/v1/admin-users/{id}/sites` 순차 처리

**로컬 상태 추가**

| 상태명 | 타입 | 설명 |
|---|---|---|
| `mappedSiteIds` | `Set<number>` | 체크된 siteId 집합 |
| `isSitesLoading` | `boolean` | 매핑 조회 로딩 |

---

## 10. API 연동 명세

| 액션 | Method | Endpoint | 호출 시점 |
|---|---|---|---|
| 목록 조회 | GET | `/api/v1/sites` | 목록 페이지 진입, Header 마운트 |
| 단건 조회 | GET | `/api/v1/sites/{id}` | 상세 페이지 진입 (수정 모드) |
| 등록 | POST | `/api/v1/sites` | 상세 페이지 저장 (등록 모드) |
| 수정 | PATCH | `/api/v1/sites/{id}` | 상세 페이지 저장 (수정 모드) |
| 삭제 | DELETE | `/api/v1/sites/{id}` | 목록 페이지 삭제 버튼 |
| 관리자 매핑 조회 | GET | `/api/v1/admin-users/{id}/sites` | AdminDrawer 오픈 |
| 관리자 매핑 변경 | PUT | `/api/v1/admin-users/{id}/sites` | AdminDrawer 저장 |

---

## 11. 수정 대상 파일 영향도

| 파일 | 수정 유형 | 영향 범위 |
|---|---|---|
| `settings/sites/page.tsx` | **신규** | - |
| `settings/sites/[id]/page.tsx` | **신규** | - |
| `useSiteStore.ts` | **신규** | - |
| `Header.tsx` | **수정** — 드롭다운 추가 | 전체 관리자 레이아웃 헤더 |
| `AdminDrawer.tsx` | **수정** — 매핑 섹션 추가 | 관리자 등록/수정 Drawer |

---

## 12. 개발 체크리스트

### 12.1 목록 페이지

- [ ] 페이지 진입 시 `fetchSites()` 호출되는가?
- [ ] TableWidget에 tableData가 올바르게 전달되는가?
- [ ] isActive 값이 사용/미사용 배지로 표시되는가?
- [ ] 수정 버튼 클릭 시 `sites/{id}`로 이동하는가?
- [ ] 삭제 버튼 클릭 시 confirm 후 삭제되는가?
- [ ] 삭제 성공 후 목록이 새로고침되는가?
- [ ] 연관 데이터 삭제 시도 시 409 에러 토스트가 표시되는가?
- [ ] "홈페이지 추가" 버튼 클릭 시 `sites/new`로 이동하는가?

### 12.2 상세 페이지

- [ ] 수정 모드 진입 시 기존 데이터가 formValues에 바인딩되는가?
- [ ] 등록 모드 진입 시 formValues가 초기화되는가?
- [ ] 저장 성공 시 목록 페이지로 이동하는가?
- [ ] 취소 버튼 클릭 시 이전 페이지로 이동하는가?
- [ ] 홈페이지명 빈 값 저장 시 에러 처리되는가?
- [ ] 저장 중 중복 클릭이 방지되는가?

### 12.3 헤더 홈페이지 드롭다운

- [ ] isActive=true 홈페이지만 표시되는가?
- [ ] 선택 시 localStorage에 저장되는가?
- [ ] 새로고침 후 선택값이 복원되는가?

### 12.4 관리자 Drawer 홈페이지 매핑

- [ ] Drawer 오픈 시 매핑 API가 호출되는가?
- [ ] 매핑된 홈페이지가 체크 표시되는가?
- [ ] 저장 시 PUT 호출되는가?
- [ ] 빈 배열(전체 해제)도 정상 처리되는가?

### 12.5 코드 품질

- [ ] `tsc --noEmit` 신규 에러 없는가?
- [ ] useSiteStore 에러 시 toast 처리되는가?
- [ ] 저장/삭제 중 중복 클릭이 방지되는가?
