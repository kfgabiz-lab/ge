# Bo 구현 지시서: 데이터테이블(table) 컬럼 마스킹 (email/phone/name/custom)

> 작성: bo-design-bridge (STEP1 퍼블리싱 분석/번역)
> 대상: bo-builder (STEP3 실제 구현), bo-architect-reviewer (STEP2 구조 검토)
> ⚠️ 아래 내용은 지시서(제안)이며, 실제 코드(`page.tsx`, `types.ts`, `TableBuilder.tsx`, `TableCellRenderer.tsx`)는 아직 수정되지 않았다. 사용자 승인 후 STEP2/STEP3에서 반영한다.

---

## 1. 그리드 배치

- **변경 없음.** 신규 위젯이 아니라 기존 `table` 탭(`SAMPLE_TABLE`, `TAB_CONFIG.table = [{ colSpan: 12, rowSpan: 6 }]`) 내부에 컬럼 4개만 추가하는 것이므로 위젯 블록 자체의 colSpan/rowSpan은 그대로 유지한다.
- 근거: `builder-contents-layout/page.tsx` L437 `table: [{ widget: SAMPLE_TABLE, colSpan: 12, rowSpan: 6 }]`

---

## 2. 스타일 매핑

⚠️ **표준 매핑 테이블(styles.ts의 inputCls/selectCls 등)은 이 위치에 적용되지 않는다.**
`components/builder/fields/` 하위 ColEdit 계열 컴포넌트(`TextCodeGroupField.tsx`, `DateRangeStatusColumnField.tsx`, `InlineEditField.tsx`)는 전부 `styles.ts`가 아니라 **`_FieldBase.tsx`가 export하는 `INPUT_CLS` / `LABEL_CLS`**를 사용하는 것이 실제 컨벤션이다. 이 사실은 소스 확인 결과이며, 최초 지시(styles.ts 상수)와 다르므로 정정해서 반영한다.

| 사용처 | 클래스 | 실제 사용할 상수 | 임포트 경로 |
|---|---|---|---|
| maskType 토글 버튼 그룹 | `flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md` + 버튼별 `flex-1 py-1 text-[10px] font-semibold rounded transition-all` | 상수화 안 함 (기존 `InlineEditField.tsx`/`TextCodeGroupField.tsx`와 동일하게 인라인 유지 — 이 파일들도 상수 미사용) | - |
| 패턴 select | `w-full border ...` | `INPUT_CLS` | `./_FieldBase` |
| 라벨 | `text-[10px] font-medium text-slate-500 mb-1 block` | `LABEL_CLS` | `./_FieldBase` |
| 커스텀 정규식/치환값 input | `w-full border ...` (+`font-mono` for 정규식) | `` `${INPUT_CLS} font-mono` `` (정규식), `INPUT_CLS` (치환값) | `./_FieldBase` |
| 섹션 구분선/타이틀 | `space-y-1.5 pt-1 border-t border-slate-100` / `text-[10px] font-semibold text-slate-400 uppercase` | 인라인 유지 (`TextCodeGroupField.tsx`와 동일 패턴) | - |

---

## 3. 컴포넌트 구조

**신규 파일**: `bo/src/app/admin/templates/make/_shared/components/builder/fields/MaskField.tsx`
(`TextCodeGroupField.tsx`와 sibling 배치, 동일하게 `ColEditProps` 사용 — 신규 props 인터페이스 확장 불필요)

```tsx
'use client';

/**
 * MaskField — 텍스트 셀 마스킹 설정 (email/phone/name/custom)
 *
 * text 타입 컬럼에서 live 모드 표시값에 적용할 마스킹 규칙을 설정한다.
 * preview 모드는 항상 샘플 텍스트를 유지하며, live 모드에서만 실제 마스킹이 적용된다.
 *
 * 사용법:
 *   <MaskField values={col} onChange={patch => updateColumn(col.id, patch)} />
 */

import React from 'react';
import { ColEditProps } from './col-types';
import { INPUT_CLS, LABEL_CLS } from './_FieldBase';

const MASK_TYPES: { type: 'email' | 'phone' | 'name' | 'custom'; label: string }[] = [
    { type: 'email',  label: '이메일' },
    { type: 'phone',  label: '전화번호' },
    { type: 'name',   label: '이름' },
    { type: 'custom', label: '커스텀' },
];

const EMAIL_PATTERNS = [
    { value: 'idMid',   label: 'ID 중간 마스킹' },
    { value: 'idFull',  label: 'ID 전체 마스킹' },
    { value: 'prefix3', label: '앞 3글자 마스킹' },
    { value: 'suffix3', label: '뒤 3글자 제외 마스킹' },
];
const PHONE_PATTERNS = [
    { value: 'mid4',      label: '중간 4자리 마스킹' },
    { value: 'suffix4',   label: '뒤 4자리 마스킹' },
    { value: 'midSuffix', label: '중간+뒤 마스킹' },
];
const NAME_PATTERNS = [
    { value: 'mid',     label: '중간 마스킹' },
    { value: 'initial', label: '이름 마스킹' },
    { value: 'full',    label: '전체 마스킹' },
];

const DEFAULT_PATTERN: Record<'email' | 'phone' | 'name', string> = {
    email: 'idMid', phone: 'mid4', name: 'mid',
};

export function MaskField({ values, onChange }: ColEditProps) {
    const maskType = values.maskType;

    const patternOptions =
        maskType === 'email' ? EMAIL_PATTERNS :
        maskType === 'phone' ? PHONE_PATTERNS :
        maskType === 'name'  ? NAME_PATTERNS  : [];

    return (
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">마스킹 설정</span>

            {/* 마스킹 타입 선택 — 없음 / 이메일 / 전화번호 / 이름 / 커스텀 */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md">
                <button type="button"
                    onClick={() => onChange({ maskType: undefined, maskPattern: undefined, maskCustomRegex: undefined, maskCustomReplacement: undefined })}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded transition-all ${!maskType ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    없음
                </button>
                {MASK_TYPES.map(({ type, label }) => (
                    <button key={type} type="button"
                        onClick={() => onChange({
                            maskType: type,
                            maskPattern: type !== 'custom' ? DEFAULT_PATTERN[type] : undefined,
                            maskCustomRegex: type === 'custom' ? values.maskCustomRegex : undefined,
                            maskCustomReplacement: type === 'custom' ? values.maskCustomReplacement : undefined,
                        })}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded transition-all ${maskType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* 패턴 선택 — email/phone/name 전용 */}
            {maskType && maskType !== 'custom' && (
                <div>
                    <label className={LABEL_CLS}>마스킹 패턴</label>
                    <select
                        value={values.maskPattern ?? DEFAULT_PATTERN[maskType]}
                        onChange={e => onChange({ maskPattern: e.target.value })}
                        className={INPUT_CLS}
                    >
                        {patternOptions.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* 커스텀 정규식 — custom 전용 */}
            {maskType === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={LABEL_CLS}>정규식 <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            value={values.maskCustomRegex ?? ''}
                            onChange={e => onChange({ maskCustomRegex: e.target.value || undefined })}
                            placeholder="예: \d{4}$"
                            className={`${INPUT_CLS} font-mono`}
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLS}>치환값 <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            value={values.maskCustomReplacement ?? ''}
                            onChange={e => onChange({ maskCustomReplacement: e.target.value || undefined })}
                            placeholder="예: ****"
                            className={INPUT_CLS}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
```

**연결 지점 2곳** (`TableBuilder.tsx`) — 반드시 둘 다 수정, 하나만 하면 편집 모드/추가 모드 중 한쪽만 동작:

```tsx
// 1) 편집 모드 — renderColumnEdit() 내부, TextCodeGroupField 바로 다음 줄 (L342 부근)
{col.cellType === 'text' && <TextCodeGroupField values={col} onChange={patch} codeGroups={codeGroups} codeGroupsLoading={false} />}
{col.cellType === 'text' && <MaskField values={col} onChange={patch} />}

// 2) 추가 모드 — pendingCol 블록, TextCodeGroupField 바로 다음 (L493 부근)
{pendingCol.cellType === 'text' && (
    <MaskField values={pendingCol} onChange={patch => setPendingCol(prev => ({ ...prev!, ...patch }))} />
)}
```

`fields/index.ts`에도 export 추가 필요:
```ts
export { MaskField } from './MaskField';
```

---

## 4. 필드 구성 — types.ts 반영 필요 항목

⚠️ **현재 `types.ts`의 `TableColumnConfig`(L253~303)에는 마스킹 관련 필드가 전혀 없다.** 아래 4개 필드를 `displayAs?: 'text' | 'value';` (L286) 바로 다음에 추가해야 `SAMPLE_TABLE`에 마스킹 샘플 컬럼을 넣어도 타입 오류가 나지 않는다.

```ts
    /* ── 마스킹 전용 (text 셀 전용) ── */
    /** 마스킹 타입 — 미설정 시 마스킹 없음 */
    maskType?: 'email' | 'phone' | 'name' | 'custom';
    /** maskType별 패턴 키 — email: idMid/idFull/prefix3/suffix3, phone: mid4/suffix4/midSuffix, name: mid/initial/full */
    maskPattern?: string;
    /** maskType='custom' 전용 — 매칭할 정규식 문자열 */
    maskCustomRegex?: string;
    /** maskType='custom' 전용 — 매칭부 치환 문자열 */
    maskCustomReplacement?: string;
```

`CellType` 유니온(L226)은 변경 불필요 — 마스킹은 별도 셀 타입이 아니라 기존 `cellType: 'text'`의 부가 속성이다.

### SAMPLE_TABLE(`builder-contents-layout/page.tsx` L182~) 추가 제안 컬럼

기존 `c9`(상태 inlineEdit)와 `c6`(관리) 사이에 삽입 제안:

```tsx
{
    id: 'c10', header: '이메일', accessor: 'email',
    align: 'left', sortable: false, cellType: 'text',
    maskType: 'email', maskPattern: 'idMid',
},
{
    id: 'c11', header: '전화번호', accessor: 'phone',
    align: 'center', sortable: false, cellType: 'text',
    maskType: 'phone', maskPattern: 'mid4',
},
{
    id: 'c12', header: '이름', accessor: 'name',
    align: 'center', sortable: false, cellType: 'text',
    maskType: 'name', maskPattern: 'mid',
},
{
    id: 'c13', header: '커스텀마스킹', accessor: 'customField',
    align: 'left', sortable: false, cellType: 'text',
    maskType: 'custom', maskCustomRegex: '\\d{4}$', maskCustomReplacement: '****',
},
```

> ⚠️ 참고: `TableCellRenderer.tsx`의 `default(text)` 분기는 `isPreview`일 때 항상 고정 문자열 `"샘플 텍스트"`를 반환한다(L352-354, 기존 로직 — 이번 작업에서 변경하지 않음). 따라서 위 4개 샘플 컬럼을 추가해도 `builder-contents-layout` preview 화면에 보이는 텍스트는 그대로 "샘플 텍스트"이며 마스킹된 값이 표시되지 않는다. 이는 버그가 아니라 확정된 아키텍처(“preview는 항상 샘플 텍스트 유지, live에서만 마스킹 적용”)에 따른 정상 동작이다. 이번 퍼블리싱의 목적은 **타입 정합성 검증** — 즉 4개 신규 필드를 넣은 컬럼 객체가 `TableColumnConfig` 타입에 부합하고 3개 화면(빌더미리보기/빌더템플릿/운영메뉴, 모두 동일한 `WidgetRenderer mode="preview"`를 공유)에서 오류 없이 렌더링되는지 확인하는 것이다.

---

## 5. preview/live 처리

- **변경 없음 — 기존 패턴 재사용.** `TableCellRenderer.tsx`의 `case 'text'`(default) 분기에서 `isPreview` 조기 return(L352-354)이 이미 존재하므로, live 모드 분기(L355~379) 안에서만 마스킹을 적용하면 된다.
- 제안 삽입 위치: L369 `if (col.codeGroupCode && col.displayAs !== 'value')` 블록과 L374 숫자 포맷 블록 사이, 또는 최종 `displayVal` 계산 직후 — `col.maskType`이 있으면 `applyMask(displayVal, col)` 결과로 감싸는 것을 제안한다. 정확한 삽입 순서(공통코드 변환 결과에도 마스킹을 적용할지 여부 등)는 STEP2 아키텍처 리뷰에서 확정 필요.
- 신규 유틸 함수명 제안: `applyMask(value: string, col: Pick<TableColumnConfig,'maskType'|'maskPattern'|'maskCustomRegex'|'maskCustomReplacement'>): string` — `utils.ts`의 `resolveCodeLabel`과 동일한 네이밍/배치 컨벤션(순수 함수, `TableCellRenderer.tsx`에서 import) 권장.

---

## 6. 주의사항

1. **⚠️ `confirmAddColumn`의 명시적 whitelist 복사 로직 (`TableBuilder.tsx` L294~326) 누락 주의.** 이 함수는 `pendingCol`(추가 모드)에서 실제 컬럼 객체로 변환할 때 cellType별 필드를 명시적으로 나열해서 복사한다(L320-321 codeGroupCode/displayAs 참고). 마스킹 4개 필드도 여기 추가하지 않으면 **"컬럼 추가" 버튼으로 새 text 컬럼을 만들 때 MaskField에서 입력한 마스킹 설정이 저장 시 전부 유실된다** (편집 모드의 `updateColumn`은 전체 patch 병합이라 문제 없지만, 추가 모드는 화이트리스트 방식이라 반드시 별도 추가 필요):
   ```ts
   maskType: p.cellType === 'text' ? p.maskType : undefined,
   maskPattern: p.cellType === 'text' && p.maskType && p.maskType !== 'custom' ? p.maskPattern : undefined,
   maskCustomRegex: p.cellType === 'text' && p.maskType === 'custom' ? p.maskCustomRegex : undefined,
   maskCustomReplacement: p.cellType === 'text' && p.maskType === 'custom' ? p.maskCustomReplacement : undefined,
   ```
2. Tailwind 동적 클래스 금지 — `MASK_TYPES`/패턴 select는 정적 옵션 배열만 사용하므로 해당 없음(동적 색상 클래스 없음).
3. 인라인 처리 → 컴포넌트 분리 필요 — 없음. `MaskField.tsx` 신규 분리로 전량 컴포넌트화됨. `TableBuilder.tsx`에는 2줄(편집/추가)만 추가.
4. `inlineEdit` cellType은 마스킹 적용 대상이 아니다(아키텍처 확정 사항) — `MaskField`는 `col.cellType === 'text'`일 때만 렌더링해야 하며 `inlineEdit`에는 절대 노출 금지.
5. custom 정규식은 사용자 입력값을 `new RegExp()`로 그대로 사용하게 되므로, STEP2/STEP3에서 정규식 파싱 실패(오탈자) 시 예외 처리(try/catch로 원본값 그대로 반환) 필요 — 이번 지시서 범위는 UI까지이며 파싱 실패 처리 로직은 아키텍처 리뷰 대상으로 남긴다.
