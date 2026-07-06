# 연결 Slug(FETCH) 다건 매칭 화면 처리 설계

## 배경
`be_slug-relation.md`의 응답 규격 변경으로, TABLE/CATEGORY(EQ, fetch_fields 설정) relation의 매칭 결과가 2건 이상일 때 `string[]`로 내려온다. 이를 소비하는 3곳(Form의 `input`/`text` 필드, Table의 Text 컬럼)이 이 배열을 올바르게 표시하도록 수정한다.

## 원소 타입 분기 (Critical — 아키텍처 리뷰에서 확인된 사항)
기존 `Array.isArray(value)` 분기는 ARRAY_CONTAINS의 레코드 배열(`Record<string, unknown>[]`)만 상정하고 `formatFetchedRelArray`(utils.ts)로 각 레코드를 평탄화 + `data` 표현식을 재평가한다. 이번에 추가되는 `string[]`(이미 서버에서 값 추출이 끝난 배열)을 같은 분기로 그대로 흘려보내면 오동작한다.

→ 배열을 받았을 때 **원소가 `string`인지 `object`인지로 분기해야 한다**:
- `string[]` (신규, TABLE/CATEGORY 다건): 그대로 구분자로 join
- `Record[]` (기존, ARRAY_CONTAINS): 기존 `formatFetchedRelArray` 로직 유지

## 구분자 조회 규약 (공통 헬퍼로 통일)
`_fetchedRel{relationId}_sep` 키는 `field.fieldKey`가 아니라 **relationId 기반(`buildFetchKey`와 동일한 방식)**으로 조회해야 한다. `FieldRenderer`(input/text)와 `TableCellRenderer` 3곳에서 각자 구현하지 않고, `utils.ts`에 공통 헬퍼(예: `resolveFetchSeparator(rowData, relationSlugId)`)를 하나 추가해 재사용한다.

## 필드별 변경

### `input` (FieldRenderer.tsx, 640~723행)
- `<input>`은 여러 줄 개념이 없는 단일 라인 요소이므로, 배열이면 무조건 한 줄로 join한다.
- 별도 빌더 UI 설정(한줄/여러줄)은 추가하지 않는다 — 항상 한 줄 join 고정 동작.

### `text` (FieldRenderer.tsx, 726~751행)
- 기존 `Array.isArray(fetched)` 분기는 유지하되, 원소 타입에 따라 `string[]` 직접 join 경로와 기존 `formatFetchedRelArray` 경로로 나눈다.
- 구분자는 하드코딩(`,`) 대신 공통 헬퍼로 조회한 실제 값을 사용한다.
- `한줄/여러줄`(`fetchDisplayMode`) 설정은 그대로 유지한다 — MULTI_LINE이면 `\n`, ONE_LINE이면 구분자로 join.

### Table Text 컬럼 (TableCellRenderer.tsx, 350~363행)
- `text`와 동일한 원소 타입 분기 + 공통 헬퍼로 구분자 조회를 적용한다.

## preview 모드
- 기존과 동일하게 preview에서는 실제 배열/구분자 로직을 실행하지 않고 빈 값/샘플 텍스트만 표시한다 (아키텍처 리뷰 확인 결과: preview/live 분리 원칙 위배 없음).

## 미해결/확인 필요 항목
- 기존에 이미 `input` 필드에 다건 매칭 가능한 relation이 연결된 실제 운영 데이터가 있는지는 DB 직접 조회 없이는 확인 불가(Explore 조사 결과). 다만 `docs/ge_guide/builder/00-3.builder_field_reference.md`에 `input` + `relationSlugId` 조합이 공식 예시로 이미 문서화되어 있고, `masterKey`/`slaveKey`에 유니크 제약이 없어 구조적으로는 항상 다건 매칭이 가능한 상태였다 — 개발 완료 후 실데이터 기준 QA 검증(bo-qa-validator)이 필수다.
