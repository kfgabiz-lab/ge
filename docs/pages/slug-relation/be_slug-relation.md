# 연결 Slug(FETCH) 다건 매칭 응답 규격

## ⚠️ ARRAY_CONTAINS 설정 시 주의 (slaveSlug / slaveType)

`joinType: ARRAY_CONTAINS`는 `masterKey`(master 쪽 배열 필드, 예: 멀티셀렉트가 저장한 id 배열)에 담긴 값을 `slaveSlug.slaveKey`와 매칭한다. 설정 실수가 나기 쉬운 지점:

1. **`slaveSlug`는 배열에 실제로 저장되는 id의 출처 slug와 정확히 같아야 한다.** 예를 들어 멀티셀렉트의 `sourceSlug`가 `product-data`면, `masterKey` 배열에는 `product-data`의 id가 저장된다 — 이때 `slaveSlug`도 `product-data`여야 한다. 표시할 최종 텍스트가 카테고리명이라고 해서 `slaveSlug`를 `category-data`로 잡으면 안 된다(둘 다 id 체계가 다른 별개 테이블이라 매칭이 항상 0건이 된다).
2. **`slaveType`은 대부분 `TABLE`이어야 한다.** `CATEGORY`는 카테고리 계층(depth) 탐색 전용 코드 경로(`applyArrayContainsCategoryFetchBatch`, `categoryDepth`/`categoryDepthFrom`/`includeLeaf` 사용)로 완전히 분기되므로, `slaveSlug`가 카테고리 테이블이 아니면 `CATEGORY`로 설정하지 말 것.
3. **`fetchFields`는 콤마로 여러 경로를 나열할 수 없다.** `extractField`는 점(`.`)만 경로 구분자로 인식하므로, `fetchFields`는 단일 dot-path 하나만 지정한다 (예: `product.product_name`). 중첩 필드까지 자동으로 찾아주므로 정확한 섹션 경로를 몰라도 필드명만 맞으면 대부분 매칭된다.

**참고 사례**: relation id 10(`productManager-data.ms` → `product-data`)이 위 규칙을 정확히 따르는 정상 사례다. relation id 11/32(`currDtlMgmt-data.power_list`/`automation_list` → 원래 `category-data`로 잘못 설정돼 있었음)를 `product-data`/`TABLE`로 수정해 정상화한 사례가 있다.

## 개요
연결 Slug(FETCH) 관계에서 슬레이브 레코드가 매칭되었을 때 BE(`PageDataService.applyFetch`)가 내려주는 응답 형식을 정의한다.

## 응답 규격 (변경 후)

| 관계 유형 | fetch_fields | 매칭 건수 | 응답 값 타입 |
|---|---|---|---|
| TABLE / CATEGORY (EQ) | 설정됨 | 0건 | 키 자체 없음 |
| TABLE / CATEGORY (EQ) | 설정됨 | 1건 | `string` |
| TABLE / CATEGORY (EQ) | 설정됨 | 2건 이상 | `string[]` (각 레코드에서 추출한 값, 서버에서 합치지 않음) |
| TABLE / CATEGORY (EQ) | 미설정 | 1건(항상 LIMIT 1) | `Map<String,Object>` (레코드 전체, 기존과 동일, 변경 없음) |
| ARRAY_CONTAINS | 사용 안 함 | 0건 이상 | `List<Map<String,Object>>` (레코드 전체 배열, 기존과 동일, 변경 없음) |

## 구분자 전달
- 매칭 건수가 2건 이상이라 `string[]`을 반환하는 경우, 같은 응답에 형제 키로 구분자를 함께 포함한다.
- 키 이름: `_fetchedRel{relationId}_sep`
- 값: 해당 relation의 `fetchSeparator`(관리자가 설정한 값, 없으면 기본값 `,`)
- 기존 `_fetchedRel{relationId}` 키와 동일한 전달 경로(`applyFetch` → dataJson → FE `extractFetchRelData`)를 그대로 재사용한다. 별도 API·prop 추가 없음.

## CATEGORY 특이사항 (변경 없음)
- 한 레코드 안의 depth 범위(`categoryDepthFrom`~`categoryDepth`) 결합은 여전히 고정 구분자 `" > "`를 사용한다 — 이번 변경과 무관.
- "레코드가 여러 건"일 때만 위 배열 규칙이 적용된다.

## 영향 범위
- `resolveTableFetch`, `resolveCategoryFetch` (fetch_fields가 설정된 경로만 해당)
- `resolveArrayContainsFetch`는 이미 배열을 반환 중 — 변경 없음
- fetch_fields 미설정 경로(Map 전체 반환)는 변경 없음

## 하위 호환성
- 매칭 1건 이하인 기존 relation은 응답 형식 변화 없음(`string` 그대로)
- 매칭 2건 이상인 기존 relation은 **이번 변경으로 응답 타입이 `string` → `string[]`로 바뀐다** — 이를 소비하는 모든 FE 필드(`input`, `text`, Table Text 컬럼)가 배열을 처리하도록 함께 수정되어야 한다 (`fe_slug-relation.md` 참조)
