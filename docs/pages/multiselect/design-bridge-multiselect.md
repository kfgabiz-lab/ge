# Bo 구현 지시서: multiselect (옵션 소스 호출/연동 선택 기능개선)

> 대상: `currDltMgmt-basicInfo` 위젯 템플릿(id=108)의 `power_list`, `automation_list` 필드.
> 두 필드 모두 `type: "multiselect"` 공통 위젯이므로, 아래 3개 파일만 수정하면 두 필드 모두 자동 반영된다.
> (위젯별 개별 분기 절대 금지 — Rule 10 "컴포넌트 유지" 원칙)
>
> ⚠️ 본 작업은 builder-contents-layout 퍼블리싱 마크업 게이트를 사용자가 명시적으로 제외한 케이스다.
> MultiSelectBuilder/MultiSelectRenderer는 이미 STEP2~4가 완료되어 운영 중인 기존 컴포넌트이므로,
> 이번 지시서는 "기능개선" 범위(기존 컴포넌트 내부 로직 확장)로만 작성한다.

## 1. 그리드 배치
- 해당 없음. 이번 변경은 MultiSelect 위젯의 **설정 패널 내부 필드 구성**과 **렌더러 데이터 조회 로직** 개선이며,
  위젯 자체의 colSpan/rowSpan(그리드 배치)에는 영향이 없다.
- 신규로 추가되는 것은 설정 패널 안의 "호출 Slug" 필드 한 줄뿐이며, 이 줄 내부의 selectbox : 슬러그필드 비율만 2:8로 나눈다.

## 2. 스타일 매핑
새 UI는 신규 색상/클래스를 만들지 않고 `MultiSelectBuilder.tsx`가 이미 import하고 있는 기존 상수를 그대로 재사용한다.

| 용도 | 재사용할 기존 리소스 |
|------|----------------------|
| 라벨 텍스트 | `LABEL_CLS` (`./fields/_FieldBase`에서 이미 import됨, 35라인) |
| selectbox / input 공통 테두리 | `INPUT_CLS` (동일 import, 이미 파일 내 다른 select들(바탕색 등)에 사용 중) |
| 2:8 비율 한 줄 배치 | `grid grid-cols-10 gap-2` + `col-span-2` / `col-span-8` — **기존에 이미 쓰이는 패턴**을 그대로 따른다.
  참고 파일: `bo/src/app/admin/templates/make/_shared/components/builder/fields/FetchDisplayField.tsx` (33~57라인, `grid-cols-10`+`col-span-3`/`col-span-7` 동일 구조) |
| "연동 Slug" selectbox 자체 | `SlugSelectField` 컴포넌트 그대로 재사용 (신규 컴포넌트 생성 금지) |

## 3. 컴포넌트 구조 — 파일별 변경 지점

### (a) `bo/src/app/admin/templates/make/_shared/components/renderer/types.ts`
`MultiSelectWidget` 인터페이스(278~303라인)에 `sourceFilter?: string;`(287라인) 바로 아래에 2개 필드 추가.
기존 필드(`sourceSlug`, `sourceFilter`, `labelFields`)는 시그니처·의미 변경 없이 그대로 둔다(하위호환 필수).

```
/** 옵션 소스 모드 — 'call'(기본): sourceSlug 호출 slug에서 직접 조회 (기존 동작)
 *  'relation': sourceRelationSlugId로 지정한 slug-relation(FETCH, slaveType='CATEGORY')을 통해 조회
 *  미설정 시(레거시 데이터) 'call'로 취급 — 기존 저장 데이터는 수정 없이 그대로 동작 */
sourceMode?: 'call' | 'relation';

/** sourceMode='relation' 전용 — 옵션 목록을 가져올 slug-relation ID
 *  후보는 relationDir='FETCH' && slaveType='CATEGORY'인 relation만 (useSlugRelations 훅으로 조회 후 필터링)
 *  relation.masterSlug가 실제 조회 대상 slug가 되고, 각 행의 계층 라벨은 relation이 병합해 준
 *  `_fetchedRel{sourceRelationSlugId}` 값(서버가 categoryDepth/categoryDepthFrom 기준으로 이미 " > "로
 *  합쳐서 내려준 문자열)을 그대로 사용한다 */
sourceRelationSlugId?: number;
```

`labelFields` 필드 주석에 한 줄 추가(의미 명확화용, 타입 구조는 변경 없음):
`sourceMode='relation'일 때는 사용하지 않음 — 라벨은 _fetchedRel{id} 값으로 자동 구성됨`

### (b) `bo/src/app/admin/templates/make/_shared/components/builder/MultiSelectBuilder.tsx`

**추가 import (44~49라인 부근)**
```
import { useSlugRelations } from '../../hooks/useSlugRelations';
```
(CategoryBuilder.tsx 23라인과 동일한 상대경로 — 같은 디렉토리 레벨이므로 그대로 재사용 가능)

**컴포넌트 내부 (259라인, `connFieldOptions` 계산 다음 줄에 추가)**
```
const slugRelations = useSlugRelations();
/** "연동" 모드 후보 — FETCH 방향 && slaveType='CATEGORY'인 relation만 (CategoryBuilder 141~148라인과 동일한 필터링 패턴) */
const categoryFetchRelations = slugRelations.filter(r => r.relationDir === 'FETCH' && r.slaveType === 'CATEGORY');
```

**"호출 Slug" 블록(현재 350~356라인) 교체**

기존:
```tsx
{/* 호출 Slug */}
<SlugSelectField
    label="호출 Slug"
    value={widget.sourceSlug ?? ''}
    onChange={slug => onChange({ ...widget, sourceSlug: slug })}
    slugOptions={slugOptions}
/>
```

교체 후 구조 (2:8 grid, selectbox + 조건부 필드):
```tsx
{/* 옵션 소스 — 호출/연동 선택 (2:8) */}
<div className="grid grid-cols-10 gap-2">
    {/* 모드 선택 — 2/10 */}
    <div className="col-span-2">
        <label className={LABEL_CLS}>소스</label>
        <select
            value={widget.sourceMode ?? 'call'}
            onChange={e => onChange({ ...widget, sourceMode: e.target.value as 'call' | 'relation' })}
            className={INPUT_CLS}
        >
            <option value="call">호출</option>
            <option value="relation">연동</option>
        </select>
    </div>
    {/* 슬러그 필드 — 8/10, 모드에 따라 분기 */}
    <div className="col-span-8">
        {(widget.sourceMode ?? 'call') === 'call' ? (
            <SlugSelectField
                label="호출 Slug"
                value={widget.sourceSlug ?? ''}
                onChange={slug => onChange({ ...widget, sourceSlug: slug })}
                slugOptions={slugOptions}
            />
        ) : (
            <SlugSelectField
                label="연동 Slug"
                value={String(widget.sourceRelationSlugId ?? '')}
                onChange={slug => onChange({ ...widget, sourceRelationSlugId: slug ? Number(slug) : undefined })}
                slugOptions={categoryFetchRelations.map(r => ({
                    id: r.id,
                    slug: String(r.id),
                    name: r.description
                        ? `${r.description} (${r.masterSlug} → ${r.slaveSlug})`
                        : `${r.masterSlug} → ${r.slaveSlug}`,
                }))}
                formatDisplay={opt => opt.name}
                emptyLabel="연동 없음"
            />
        )}
    </div>
</div>
```
- `slugOptions` 매핑 방식은 신규 발명이 아니라 `CategoryField.tsx`(143~156라인), `CategoryBuilder.tsx`(138~151라인),
  `SelectField.tsx`(129~142라인)에서 이미 쓰고 있는 "SlugRelationOption → SlugOption({id, slug:String(id), name})" 변환을
  그대로 옮긴 것이다. 새 변환 로직을 만들지 말고 이 패턴을 복사한다.

**"표시 필드"(labelFields) 블록(현재 370~380라인) — 연동 모드일 때 숨김**
```tsx
{(widget.sourceMode ?? 'call') === 'call' && (
    <div>
        <label className={LABEL_CLS}>표시 필드 <span className="text-red-400">*</span></label>
        <input
            type="text"
            value={widget.labelFields ?? ''}
            onChange={e => onChange({ ...widget, labelFields: e.target.value })}
            placeholder="예: name,dept (쉼표 구분)"
            className={INPUT_CLS}
        />
    </div>
)}
```
연동 모드에서는 라벨이 relation이 병합한 `_fetchedRel{id}` 값으로 자동 결정되므로 이 입력을 노출하지 않는다(사용자가 채워도 무시됨을 암묵적으로 방지).

**"옵션 필터"(sourceFilter) 블록(358~368라인)은 그대로 유지** — 모드와 무관하게 fetch 이후 공통으로 적용되는 후처리 필터이므로 숨기지 않는다.

### (c) `bo/src/app/admin/templates/make/_shared/components/renderer/MultiSelectRenderer.tsx`

**추가 import**
- `useSlugRelations` 훅 (`../../hooks/useSlugRelations`)
- `formatFetchedRelValue` — 기존 `utils` import 목록(32라인)에 추가: `import { flattenPageDataItem, evalConditionExpr, formatFetchedRelValue } from '../../utils';`

**컴포넌트 내부 — 소스 모드 해석 (145라인 `labelFields` 변수 선언부 근처)**
```
const sourceMode = widget.sourceMode ?? 'call';
/* 연동 모드일 때만 relation 목록 조회 (호출 모드/미리보기에서는 불필요한 API 호출 방지) */
const relations = useSlugRelations(!isPreview && sourceMode === 'relation');
/* 실제 조회할 slug — 연동 모드면 선택된 relation의 masterSlug, 호출 모드면 기존 sourceSlug */
const effectiveSourceSlug = sourceMode === 'relation'
    ? relations.find(r => r.id === widget.sourceRelationSlugId)?.masterSlug
    : widget.sourceSlug;
```

**옵션 로드 useEffect (158~177라인) 수정**
- 가드 조건: `if (!widget.sourceSlug) return;` → `if (!effectiveSourceSlug) return;`
- fetch 대상: `` api.get(`/page-data/${widget.sourceSlug}` ...) `` → `` api.get(`/page-data/${effectiveSourceSlug}` ...) ``
- deps 배열: `[isPreview, widget.sourceSlug, widget.sourceFilter]` → `[isPreview, effectiveSourceSlug, widget.sourceFilter]`
- 연동 모드 진입 직후에는 `relations`가 비동기로 채워지기 전이라 `effectiveSourceSlug`가 일시적으로 `undefined`이며,
  relation 목록이 로드되면 deps 변경으로 effect가 자동 재실행된다(추가 로딩 상태 처리 불필요 — 기존 `useSlugRelations` 소비 패턴과 동일).
- 그 외 로직(`flattenPageDataItem`, `sourceFilter` 적용, `id: Number(row._id ?? 0)`)은 완전히 그대로 유지 — 연동 모드도 동일한 `/page-data/{slug}` 응답 형태를 그대로 사용하므로 변경 불필요.

**`buildLabel()` 함수(95~100라인) — 시그니처 및 구현 변경**

기존:
```ts
function buildLabel(item: OptionItem, labelFields: string): string {
    return labelFields
        .split(',')
        .map(f => String(getNestedValue(item as Record<string, unknown>, f.trim()) ?? ''))
        .filter(Boolean)
        .join(' > ');
}
```

변경 후:
```ts
function buildLabel(item: OptionItem, widget: MultiSelectWidget): string {
    if ((widget.sourceMode ?? 'call') === 'relation' && widget.sourceRelationSlugId) {
        const raw = item[`_fetchedRel${widget.sourceRelationSlugId}`];
        if (Array.isArray(raw)) {
            /* 다건 매칭 — resolveFetchSeparator를 내부적으로 사용하는 공통 헬퍼로 위임 (utils.ts 1110라인) */
            return formatFetchedRelValue(raw, item as Record<string, unknown>, widget.sourceRelationSlugId, undefined, 'ONE_LINE');
        }
        return raw != null ? String(raw) : '';
    }
    /* 호출 모드 — 기존 로직 그대로 유지 (' > ' 하드코딩은 호출 모드에서만 남는다) */
    const labelFields = widget.labelFields || 'name';
    return labelFields
        .split(',')
        .map(f => String(getNestedValue(item as Record<string, unknown>, f.trim()) ?? ''))
        .filter(Boolean)
        .join(' > ');
}
```
- `resolveFetchSeparator`를 직접 호출하지 않고 `formatFetchedRelValue`를 재사용하는 이유: 이 함수가 이미
  "배열이면 resolveFetchSeparator로 구분자 조회 후 join, 아니면 formatFetchedRelArray로 위임"하는 로직을
  캡슐화하고 있고, `TableCellRenderer.tsx`(444~473라인)의 `_fetchedRel{id}` 처리와 완전히 동일한 패턴이기 때문 —
  중복 로직을 새로 만들지 않는다.

**호출 지점 3곳 수정** — 기존에는 컴포넌트 상단에서 계산한 `labelFields` 변수를 넘겼으나, 이제 `widget`을 그대로 넘긴다.
- 199~202라인(검색 필터링): `buildLabel(opt, labelFields)` → `buildLabel(opt, widget)`
- 286라인(드롭다운 목록 항목): 동일하게 변경
- 322라인(선택된 항목 태그): 동일하게 변경
- 145라인의 `const labelFields = widget.labelFields || 'name';` 선언은 더 이상 다른 곳에서 쓰이지 않으므로 제거.

## 4. 필드 구성 (types.ts 매핑)

| 저장 필드 | 타입 | 모드 | 비고 |
|-----------|------|------|------|
| `sourceMode` | `'call' \| 'relation'` (optional) | 공통 | 미설정 시 `'call'`로 취급 (하위호환) |
| `sourceSlug` | `string` (기존) | 호출 | 변경 없음 |
| `sourceRelationSlugId` | `number` (optional, 신규) | 연동 | `useSlugRelations()` 결과 중 `relationDir==='FETCH' && slaveType==='CATEGORY'`인 항목의 `id` |
| `sourceFilter` | `string` (기존) | 공통 | 모드 무관하게 fetch 후 적용되는 `evalConditionExpr` 필터, 변경 없음 |
| `labelFields` | `string` (기존, required) | 호출 전용 | 연동 모드에서는 UI 미노출·미사용. 타입 자체는 건드리지 않음(하위호환 데이터가 값을 갖고 있어도 무해) |

## 5. preview/live 처리
- preview 모드는 이번 변경과 무관 — 기존처럼 `PREVIEW_OPTIONS`/`PREVIEW_SELECTED_IDS` 고정 샘플을 그대로 사용하고,
  토글 버튼·검색창 모두 `disabled`(151~296라인 기존 disabled 패턴 그대로 유지).
- `sourceMode`/`sourceRelationSlugId`는 오직 live 모드의 실제 데이터 조회 로직에만 관여한다.
- 빌더 미리보기/빌더템플릿/운영메뉴페이지 3곳 모두 `MultiSelectRenderer` 하나를 공유하므로(Rule 10-3),
  이 렌더러 파일 하나만 고치면 3곳 모두 자동 반영된다 — 별도 화면별 분기 금지.

## 6. 주의사항
- Tailwind 동적 클래스 금지 — `col-span-${n}` 같은 동적 생성 금지, 위 코드처럼 `col-span-2`/`col-span-8` 리터럴 클래스만 사용.
- 인라인 처리 금지 — 이번 변경은 전부 기존 컴포넌트 파일(`MultiSelectBuilder.tsx`, `MultiSelectRenderer.tsx`, `types.ts`) 내부 수정으로만 진행하고, `widget/page.tsx` 등 상위 페이지에 분기 로직을 추가하지 않는다.
- `power_list`/`automation_list` 개별 위젯 단위로 특수 처리 금지 — 두 필드 모두 `type: 'multiselect'` 위젯이므로 위 3개 파일 수정만으로 동시에 적용되어야 한다. 위젯 ID나 contentKey 기준 조건 분기를 추가하면 Rule 10 위반.
- `categoryDepth`/`categoryDepthFrom` 기반 계층 구간(1~3, 1~2, 2~3 등) 로직은 새로 만들지 않는다 — 이미 slug-relation 설정(BE)이 계층 조합과 " > " 표시를 담당하며, 렌더러는 `_fetchedRel{id}` 값을 그대로 표시만 한다.
- `useSlugRelations()`는 CategoryBuilder.tsx에서와 동일하게 컴포넌트 최상단에서 무조건 호출하고(Rule of Hooks), `enabled` 파라미터로 API 호출 시점만 제어한다(렌더러 쪽 `!isPreview && sourceMode === 'relation'`).
