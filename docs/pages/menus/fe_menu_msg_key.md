# FE 설계 문서 — 메뉴 관리 다국어 키 연동

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 메뉴 관리 다국어 입력 UI |
| 작성일 | 2026-06-01 |
| 참조 API 문서 | docs/pages/menus/be_menu_msg_key.md |

---

## 2. 변경 파일 목록

| 파일 | 변경 유형 | 내용 |
|---|---|---|
| `store/use-menu-store.ts` | 수정 | MenuItem 타입에 다국어 필드 추가, saveMenu payload 변경 |
| `components/menus/menu-detail.tsx` | 수정 | MenuForm, CreateMenuForm에 한/영 입력 필드 추가 |

---

## 3. 타입 변경 (`use-menu-store.ts`)

### MenuItem 인터페이스 추가 필드

```typescript
export interface MenuItem {
    // 기존 필드 유지
    id: number;
    name: string;          // 한국어 메뉴명
    description?: string;  // 한국어 설명

    // 신규 필드
    nameMsgKey?: string;        // message_resource.key
    nameEn?: string;            // 영어 메뉴명
    descriptionMsgKey?: string; // message_resource.key
    descriptionEn?: string;     // 영어 설명
    descriptionType?: 'WORD' | 'SENTENCE'; // 설명 타입

    // 나머지 기존 필드 유지
    url: string;
    icon: string;
    parentId: number | null;
    menuType: 'BO' | 'FO';
    sortOrder: number;
    visible: boolean;
    isSystem?: boolean;
    children?: MenuItem[];
}
```

### API payload 변경 (addMenu / updateMenu)

```typescript
// 기존
{ name, description, url, icon, ... }

// 변경 후
{ nameKo, nameEn, descriptionKo, descriptionEn, descriptionType, url, icon, ... }
```

---

## 4. UI 변경 (`menu-detail.tsx`)

### 4-1. 메뉴명 입력 (한/영 분리)

**현재:**
```tsx
<input type="text" value={name} maxLength={50} />
```

**변경 후:**
```tsx
{/* 한국어 메뉴명 */}
<div className="space-y-1">
    <label>{t('menu.form.name.label')} <span className="text-[10px] text-slate-400">KO</span></label>
    <input type="text" value={nameKo} maxLength={50} placeholder={t('menu.form.name.placeholder')} />
    {nameKoError && <p className="text-xs text-red-500">{nameKoError}</p>}
</div>

{/* 영어 메뉴명 */}
<div className="space-y-1">
    <label>{t('menu.form.name.label')} <span className="text-[10px] text-slate-400">EN</span></label>
    <input type="text" value={nameEn} maxLength={50} placeholder="Menu name in English" />
</div>
```

### 4-2. 메뉴 설명 입력 (한/영 + 타입 선택)

**현재:**
```tsx
<textarea value={description} maxLength={500} />
```

**변경 후:**
```tsx
{/* 설명 타입 선택 */}
<div className="flex items-center gap-2 mb-2">
    <label className="text-xs text-slate-500">{t('menu.form.description.type')}</label>
    <div className="flex gap-1">
        {(['WORD', 'SENTENCE'] as const).map(type => (
            <button
                key={type}
                type="button"
                onClick={() => setDescriptionType(type)}
                className={`px-2 py-0.5 text-xs rounded ${
                    descriptionType === type
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
                {type === 'WORD' ? t('menu.form.description.type.word') : t('menu.form.description.type.sentence')}
            </button>
        ))}
    </div>
</div>

{/* 한국어 설명 */}
<div className="space-y-1">
    <label>{t('menu.form.description.label')} <span className="text-[10px] text-slate-400">KO</span></label>
    <textarea value={descriptionKo} maxLength={500} rows={2} />
    <p className="text-right text-[10px] text-slate-400">{descriptionKo.length}/500</p>
</div>

{/* 영어 설명 */}
<div className="space-y-1">
    <label>{t('menu.form.description.label')} <span className="text-[10px] text-slate-400">EN</span></label>
    <textarea value={descriptionEn} maxLength={500} rows={2} placeholder="Description in English" />
    <p className="text-right text-[10px] text-slate-400">{descriptionEn.length}/500</p>
</div>
```

---

## 5. 상태 변경

### MenuForm / CreateMenuForm 로컬 상태 추가

```typescript
// 기존
const [name, setName] = useState(menu?.name ?? '');
const [description, setDescription] = useState(menu?.description ?? '');

// 변경 후
const [nameKo, setNameKo] = useState(menu?.name ?? '');
const [nameEn, setNameEn] = useState(menu?.nameEn ?? '');
const [descriptionKo, setDescriptionKo] = useState(menu?.description ?? '');
const [descriptionEn, setDescriptionEn] = useState(menu?.descriptionEn ?? '');
const [descriptionType, setDescriptionType] = useState<'WORD' | 'SENTENCE'>(
    menu?.descriptionType ?? 'WORD'
);
```

---

## 6. 신규 다국어 키 (lang.sql 추가 필요)

| key | ko | en |
|---|---|---|
| `menu.form.name.label.ko` | 메뉴명 (한국어) | Menu Name (KO) |
| `menu.form.name.label.en` | 메뉴명 (영어) | Menu Name (EN) |
| `menu.form.description.type` | 설명 타입 | Description Type |
| `menu.form.description.type.word` | 단어 | Word |
| `menu.form.description.type.sentence` | 문장 | Sentence |
| `menu.form.description.label.ko` | 메뉴 설명 (한국어) | Description (KO) |
| `menu.form.description.label.en` | 메뉴 설명 (영어) | Description (EN) |
