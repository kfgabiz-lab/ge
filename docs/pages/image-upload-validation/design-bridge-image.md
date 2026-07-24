# Bo 구현 지시서: 이미지 필드컴포넌트 업로드 밸리데이션 (image / media-이미지부분)

> STEP1 (bo-design-bridge) 산출물. STEP2(bo-architect-reviewer)가 "검증로직 배치 + preview/live 분리"를
> 최종 확정하기 전까지는 초안이며, 특히 "0. 스코프 재확인(원본 target_files 대비 추가 발견 파일)" 섹션은
> 반드시 STEP2에서 재검토·승인 후 STEP3(bo-builder)로 넘어가야 한다.

---

## 0. 스코프 재확인 — 실제 코드 추적 결과, orchestrator 최초 target_files(4개) 대비 추가 영향 파일 발견

context.json의 target_files는 4개(types.ts, ImageField.tsx, MediaField.tsx, FieldRenderer.tsx)였으나,
실제 데이터 흐름을 Read로 직접 추적한 결과 **영향 파일이 더 있음**을 확인했다. 이유: 이 코드베이스는
"페이지 메이커 필드 스키마"가 **3곳에 중복 정의**되어 있고(각각 명시적 필드 매핑 방식이라 자동 전파가
안 됨), 신규 필드는 3곳 모두에 추가하고 매핑 코드도 손으로 이어줘야 한다.

| 스키마 타입 | 파일 | 역할 |
|---|---|---|
| `SearchFieldConfig` | `bo/src/app/admin/templates/make/_shared/types.ts` (L43~) | **루트 스키마** — FieldRenderer가 실제로 받는 `field` 타입. `maxFileCount/maxFileSizeMB/mediaImageMaxSizeMB` 등 원본 정의 위치 |
| `FieldEditValues` | `bo/.../builder/fields/types.ts` (L36~) | 빌더 설정패널(ImageField/MediaField 등 L3 컴포넌트) 전용 UI props 타입. SearchFieldConfig과 거의 동일한 필드를 별도로 유지 |
| `SubListColumn` | `bo/.../components/renderer/types.ts` (L144~) | SubList 컬럼 전용 persisted 스키마 (SearchFieldConfig과 별도) |

또한 스키마 간 변환이 **전부 명시적 필드 나열 방식**이라 신규 필드는 아래 지점에도 한 줄씩 추가해야
실제로 동작한다 (자동 spread 아님, 직접 확인함):

| 파일 | 위치 | 방향 |
|---|---|---|
| `FormBuilder.tsx` | L330~390 `renderFieldComponent` 내 `values` 객체 | `FormFieldItem → FieldEditValues` (읽기) |
| `FormBuilder.tsx` | L419 `updateField(f.id, updates as Partial<FormFieldItem>)` | 캐스팅 방식이라 `FormFieldItem`(=`Omit<SearchFieldConfig,'colSpan'>`)에 필드만 추가하면 쓰기 방향은 자동 커버 — **단, L330 읽기 방향은 명시적 라인 추가 필수** |
| `SubListBuilder.tsx` | L101 `toFieldValues` / L172 `fromFieldValues` | `SubListColumn ⇄ FieldEditValues` 양방향, 각각 명시적 라인 추가 필수 |
| `SubListRenderer.tsx` | L60 `toFieldConfig` | `SubListColumn → SearchFieldConfig` (FieldRenderer 렌더용 변환), 명시적 라인 추가 필수 |

> ImageField.tsx는 FormBuilder와 SubListBuilder 양쪽에서 재사용되는 컴포넌트임을 직접 확인했다
> (`SubListBuilder.tsx:392 {col.type === "image" && <ImageField {...commonProps} />}`).
> 즉 "ImageField.tsx 하나만 고친다"고 해서 SubList의 image 컬럼까지 자동으로 새 설정이 붙지 않는다 —
> 위 3개 스키마 + 4개 매핑 파일을 함께 고쳐야 SubList에서도 동일하게 동작한다.

**이 확장된 파일 목록(총 8개)은 STEP2에서 반드시 재확인받을 것.** 원래 4개 파일만으로는 SubList의
image 컬럼과 (스키마 불일치로) Form의 image/media 필드 모두 정상 동작하지 않는다.

---

## 1. types.ts 신규 필드명 — orchestrator 제안 검토 결과 (수정 제안)

**orchestrator 제안**: `imageMaxWidthPx / imageMaxHeightPx / imageMaxSizeValue / imageMaxSizeUnit`

**검토 결과 — 용량 필드는 제안과 다르게 확정 제안함.** 이유:

- `MediaField`의 이미지 용량 제한은 이미 `mediaImageMaxSizeMB`로 **라이브 서비스 중**이다
  (`FieldRenderer.tsx` L2295 `handleMediaSelect`가 이미 이 값으로 즉시 차단 중 — toast.warning 포함,
  이미 동작하는 코드임을 직접 확인).
- `ImageField`의 `maxFileSizeMB`도 저장 시점 검증(`utils.ts` L507 `validateFormFields`,
  SubList는 L675 `validateSubListRows`)에서 **FILE_FIELD_TYPES 전체(file/image/video/media)에 대해
  이미 제네릭하게 사용 중**이다.
- 여기서 `imageMaxSizeValue`라는 완전히 새 숫자 필드를 만들면, 기존 `maxFileSizeMB` /
  `mediaImageMaxSizeMB`가 **저장 시점 검증에서는 계속 쓰이고, 업로드 즉시 검증에서는 새 필드를
  쓰는** 이원화가 생겨 두 검증 시점의 기준값이 어긋날 위험이 있고, 기존 저장된 템플릿 값이
  새 필드로 자동 이관되지 않아 무설정 취급되는 회귀가 생긴다.

**확정 제안**: 숫자 값은 **기존 필드를 그대로 재사용**하고, 단위만 새 필드로 추가한다.

```ts
/* ── 이미지 픽셀 제한 (ImageField[image] + MediaField 이미지부분 공용, 신규) ── */
imageMaxWidthPx?: number;   // 이미지 가로 최대(px) — 초과 시 업로드 즉시 차단
imageMaxHeightPx?: number;  // 이미지 세로 최대(px) — 초과 시 업로드 즉시 차단

/* ── 용량 제한 단위 (기존 숫자 필드와 짝, 신규) ── */
maxFileSizeUnit?: 'KB' | 'MB';        // maxFileSizeMB 값의 단위. 미설정 시 'MB' (ImageField 전용 노출 — File/Video 필드는 UI 미노출이라 실질 영향 없음)
mediaImageMaxSizeUnit?: 'KB' | 'MB';  // mediaImageMaxSizeMB 값의 단위. 미설정 시 'MB' (MediaField 이미지부분 전용)
```

- `imageMaxWidthPx`/`imageMaxHeightPx`는 기존에 대응 필드가 전혀 없으므로 제안대로 신규 추가.
- `maxFileSizeUnit`은 "파일 업로드 & 비디오 설정(Layer 전용)" 블록(`maxFileSizeMB` 바로 아래)에 추가.
  File/Video 필드컴포넌트는 이 필드에 대한 입력 UI를 추가하지 않으므로(스코프 제외) 값이 항상
  `undefined` → 기존 동작(MB 고정) 완전히 유지됨.
- `mediaImageMaxSizeUnit`은 "media 전용" 블록(`mediaImageMaxSizeMB` 바로 아래)에 추가.

**반영 대상**: `make/_shared/types.ts`(`SearchFieldConfig`), `builder/fields/types.ts`(`FieldEditValues`)
양쪽 동일 필드 추가. `renderer/types.ts`(`SubListColumn`)에는 media 타입이 SubList에 없으므로
`imageMaxWidthPx / imageMaxHeightPx / maxFileSizeUnit` 3개만 추가.

---

## 2. ImageField.tsx 설정 패널 마크업 변경

현재 구조(`grid grid-cols-2` 1행: 최대 이미지 수 | 개당 최대(MB)) 뒤에 아래 2개 섹션을 신규 추가.
기존 `INPUT_CLS`/`LABEL_CLS`(`_FieldBase.tsx`) 재사용, `DateRangeField.tsx` L386~421의
"최대 조회 기간"(숫자+단위 select 조합) 패턴을 그대로 따른다.

```
[기존 유지] 최대 이미지 수  |  개당 최대(MB) → 라벨을 "개당 최대"로 변경(단위 select 별도 행으로 이동)

[신규] 섹션 타이틀: "이미지 크기 제한 (px)"
  grid-cols-2: [가로 최대(px) 입력]  [세로 최대(px) 입력]
  - value={values.imageMaxWidthPx ?? ''} / imageMaxHeightPx ?? ''
  - 0 또는 빈값 = 제한 없음 (DateRangeField의 maxRangeValue 패턴과 동일하게 0이면 undefined로 저장)

[신규] 섹션 타이틀: "용량 제한"
  grid-cols-2: [용량 숫자 입력(기존 maxFileSizeMB 재사용)]  [단위 select: KB/MB]
  - select value={values.maxFileSizeUnit ?? 'MB'}
  - INPUT_CLS를 select에도 그대로 사용(DateRangeField 선례와 동일, 별도 selectCls 불필요)

[기존 유지] 허용 형식 (고정) 박스
```

---

## 3. MediaField.tsx 이미지 부분 변경

"── 이미지 섹션 ──" 블록만 수정 (동영상 섹션은 변경 없음 — **out_of_scope 참고**).

```
[섹션 타이틀 유지] 이미지 설정

[신규] "이미지 크기 제한 (px)" — grid-cols-2: [가로 최대(px)] [세로 최대(px)]
  - imageMaxWidthPx / imageMaxHeightPx — ImageField와 동일 필드명 공유 (필드 인스턴스가 다르므로 충돌 없음)

[기존 "최대 크기 (MB)" 단일 input을 아래로 교체]
  grid-cols-2: [용량 숫자(mediaImageMaxSizeMB 재사용, 라벨 "최대 크기"로 변경)] [단위 select(mediaImageMaxSizeUnit, 기본 MB)]

[기존 유지] 허용 형식 (고정) 박스
[섹션 타이틀 유지] 동영상 설정 — 완전히 그대로 유지, 변경 없음
```

---

## 4. styles.ts / 스타일 상수 매핑

이번 작업은 **빌더 설정패널(내부 도구 UI)** 범위라 `make/_shared/styles.ts`의 `inputCls/selectCls`
(라이브 렌더러용 공용 상수)는 대상이 아니다. ImageField.tsx/MediaField.tsx는 이미
`_FieldBase.tsx`의 `INPUT_CLS`/`LABEL_CLS`를 쓰고 있으므로 신규 input/select 전부 동일 상수 재사용.

| 사용처 | 클래스 | 근거 |
|---|---|---|
| 신규 가로/세로 px input | `INPUT_CLS` | 기존 ImageField/MediaField 숫자 input과 동일 |
| 신규 용량 단위 select | `INPUT_CLS` | `DateRangeField.tsx` L409~412 선례 — select에도 INPUT_CLS 그대로 사용 |
| 신규 라벨 | `LABEL_CLS` | 기존 라벨과 동일 |

라이브 렌더링(FieldRenderer.tsx) 쪽은 이번 기능으로 새로운 화면 요소(입력창/드롭다운)가 생기지
않는다 — 파일 선택 시점에 즉시 검증 후 `toast.warning`으로만 알리므로 스타일 상수 매핑 대상 없음.

---

## 5. FieldRenderer.tsx 검증 로직 데이터 흐름

### case "image" (`handleImgSelect`, 현재 L1708~1712)
현재는 확장자만 필터링하고 **용량 검증이 전혀 없다** (기존 버그, 이번에 함께 해결).

```
handleImgSelect(selected) 를 async로 변경:
  1) filterByAccept(selected, FILE_TYPE_PRESETS.image)  // 기존 그대로
  2) 확장자 통과 파일 각각에 대해:
     a. 용량 검사 — file.size vs field.maxFileSizeMB * (unit===KB?1024:1024*1024)
        → 초과 시 해당 파일 제외 + toast.warning (신규 i18n 키)
     b. 픽셀 검사 — 신규 유틸 getImageNaturalSize(file)로 실제 width/height 판독
        → imageMaxWidthPx/imageMaxHeightPx 초과 시 해당 파일 제외 + toast.warning
  3) 최종 통과 파일만 onFileChange 반영 (기존 slice(0,maxCount) 로직 유지)
```

### case "media" (`handleMediaSelect`, 현재 L2295~2313)
기존에 이미지/동영상 용량 검증은 있으나 **KB 단위 미지원 + 픽셀 검증 없음**.

```
handleMediaSelect(selected) 내 isImg 분기에 추가:
  - 기존: file.size > imgMaxMB * 1024*1024 (MB 고정) → mediaImageMaxSizeUnit 반영한 바이트 환산으로 교체
  - 신규: getImageNaturalSize(file) → imageMaxWidthPx/imageMaxHeightPx 초과 시 차단 + toast.warning
  - 동영상 분기(vidMaxMB)는 변경 없음
```

### utils.ts 신규/변경
- 신규: `getImageNaturalSize(file: File): Promise<{width:number; height:number} | null>`
  (`Image()` + `URL.createObjectURL` + onload/onerror, 완료 후 `URL.revokeObjectURL`, 디코딩 실패 시 null
  반환 — null이면 픽셀 검증은 건너뛰고 확장자/용량 검증 결과만으로 통과 여부 결정, STEP2 확정 필요)
- 변경: `validateFormFields`(L507)/`validateSubListRows`(L675)의 `f.maxFileSizeMB! * 1024 * 1024` 하드코딩을
  `f.maxFileSizeMB! * (f.maxFileSizeUnit === 'KB' ? 1024 : 1024*1024)`로 단위 인지형 수정.
  (media 타입은 이 제네릭 저장시점 검증 대상이 원래 아니므로 그대로 미포함 유지)
- 가로/세로 px 제한은 저장 시점(save-time) 재검증에는 추가하지 않음 — 업로드 즉시 차단되므로
  저장 시점까지 초과 파일이 도달할 수 없다는 전제. (STEP2 확인 필요 사항으로 별도 표시)

---

## 6. preview/live 처리

- 설정 패널(ImageField.tsx/MediaField.tsx) UI는 빌더 전용이라 preview/live 분기 없음 — 공통.
- 라이브 캔버스(FieldRenderer.tsx)에서는 `isPreview` 시 파일 입력 자체가 렌더되지 않으므로
  (`canAdd = !isPreview && ...`) 이번 검증 로직은 **자연히 live 모드에서만 실행**된다.
  별도 disabled 패턴 추가 불필요 — 기존 preview 차단 구조를 그대로 통과.

---

## 7. 주의사항

- Tailwind 동적 클래스 금지 — 신규 UI 전부 `INPUT_CLS`/`LABEL_CLS` 상수만 사용, 조건부 클래스 문자열
  조합 금지.
- 인라인 처리 금지 — `getImageNaturalSize`는 반드시 `utils.ts`에 공통 함수로 추가하고
  `FieldRenderer.tsx`에서 import해서 사용 (case "image"/"media" 양쪽에서 동일 함수 재사용, 각자
  인라인 구현 금지).
- 신규 i18n 메시지 키 후보 (STEP3에서 관리자 화면으로 등록 필요 — `common.field.*` 네임스페이스):
  - `common.field.image_width_limit` (예: "가로 {px}px 이하 이미지만 업로드 가능합니다")
  - `common.field.image_height_limit`
  - `common.field.image_size_limit_unit` (기존 `common.field.file_size_limit`는 {mb} 파라미터 고정이라
    KB 단위 표시가 부자연스러움 — 신규 키로 {size}(예: "500KB") 통합 파라미터 사용 권장)
- SubListColumn 쪽은 `mediaImageMaxSizeUnit`/media 관련 필드 추가 불필요 (SubList에 media 타입 컬럼
  없음 — `SubListBuilder.tsx` typeBadgeCls 목록에 media 없음, 직접 확인함).
