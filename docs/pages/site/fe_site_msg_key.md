# FE 설계 문서 — 사이트 관리 다국어 키 연동

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 사이트 관리 다국어 입력 UI |
| 작성일 | 2026-06-01 |
| 참조 API 문서 | docs/pages/site/be_site_msg_key.md |

---

## 2. 변경 파일 목록

| 파일 | 변경 유형 | 내용 |
|---|---|---|
| `store/useSiteStore.ts` | 수정 | Site 타입에 `nameMsgKey`, `nameEn` 추가, createSite/updateSite payload 변경 |
| `app/admin/settings/sites/[id]/page.tsx` | 수정 | name 필드를 `message-key-select` → 한/영 직접 입력으로 교체 |

---

## 3. 타입 변경 (`useSiteStore.ts`)

### Site 인터페이스 추가 필드

```typescript
export interface Site {
    id: number;
    name: string;         // 한국어 사이트명
    nameMsgKey?: string;  // message_resource.key (예: site.1.name)
    nameEn?: string;      // 영어 사이트명
    description: string | null;
    domain: string | null;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}
```

### SiteCreateRequest / SiteUpdateRequest 변경

```typescript
// 기존
export interface SiteCreateRequest {
    name: string;
    description?: string;
    domain?: string;
    isActive: boolean;
}

// 변경 후
export interface SiteCreateRequest {
    nameKo: string;
    nameEn?: string;
    description?: string;
    domain?: string;
    isActive: boolean;
}
```

---

## 4. UI 변경 (`sites/[id]/page.tsx`)

### 4-1. name 필드 타입 변경

**현재:** `message-key-select` 타입 (MessageKeySelector 컴포넌트)

**변경 후:** 한/영 직접 입력 UI (2개의 input 필드)

```tsx
{/* 한국어 사이트명 */}
<div className="space-y-1">
    <label>
        {t('site.field.name.label')}
        <span className="text-[10px] text-slate-400 ml-1">KO</span>
        <span className="text-red-400 ml-0.5">*</span>
    </label>
    <input
        type="text"
        value={formValues.nameKo}
        onChange={e => handleChange('nameKo', e.target.value)}
        maxLength={255}
        placeholder={t('site.field.name.placeholder')}
    />
</div>

{/* 영어 사이트명 */}
<div className="space-y-1">
    <label>
        {t('site.field.name.label')}
        <span className="text-[10px] text-slate-400 ml-1">EN</span>
    </label>
    <input
        type="text"
        value={formValues.nameEn ?? ''}
        onChange={e => handleChange('nameEn', e.target.value)}
        maxLength={255}
        placeholder="Site name in English"
    />
</div>
```

### 4-2. 저장 payload 변경

```typescript
// 기존
const payload = {
    name: formValues.name.trim(),
    ...
};

// 변경 후
const payload = {
    nameKo: formValues.nameKo.trim(),
    nameEn: formValues.nameEn?.trim() || undefined,
    description: formValues.description?.trim() || undefined,
    domain: formValues.domain?.trim() || undefined,
    isActive: formValues.isActive === 'true',
};
```

### 4-3. 편집 모드 초기값 로딩

```typescript
// 기존 편집 모드 초기값
name: site.name

// 변경 후
nameKo: site.name,       // 한국어 = 기존 name
nameEn: site.nameEn ?? '' // 영어 = 신규 필드
```

---

## 5. 신규 다국어 키 (lang.sql 추가 필요)

| key | ko | en |
|---|---|---|
| `site.field.name.label.ko` | 사이트명 (한국어) | Site Name (KO) |
| `site.field.name.label.en` | 사이트명 (영어) | Site Name (EN) |
