# 연결 Slug(FETCH) 다건 매칭 응답 규격

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
