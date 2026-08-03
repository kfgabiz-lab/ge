# 운영페이지 데이터 수정 병합저장 FE 설계서

## 배경

`PUT /api/v1/page-data/{slug}/{id}` 수정 저장의 `data_json` 반영 방식이 전량 대체에서 병합으로 바뀐다
(BE 설계: [be_page-data-merge-update.md](./be_page-data-merge-update.md)).
이 문서는 그 정책 아래에서 FE가 지켜야 할 계약과, 이번 변경에 따른 FE 작업 범위를 정리한다.

**결론: 병합 정책 도입에 따른 FE 코드 변경은 없다.** FE는 이미 병합 전제와 정합한 계약을 지키고 있으며,
아래 2·3장에서 그 근거를 확인 가능한 코드 지점과 함께 남긴다.

---

## 1. FE ↔ BE 계약

| 주체 | 책임 |
|:---|:---|
| FE | **이번 화면에 실제로 존재·표시되는 필드의 키만** `dataJson`에 담아 보낸다. 값이 비어 있으면 빈 문자열(`""`)로 담는다. |
| BE | 요청에 있는 키는 덮어쓰고, 없는 키는 기존 DB 값을 보존한다(중첩 객체는 재귀, 배열은 통째 교체). |

즉 FE 입장에서 **"키를 보내지 않는다 = 그 값은 건드리지 않는다"**, **"빈 문자열을 보낸다 = 값을 비운다"** 로
의미가 갈린다. 이 구분이 FE가 지켜야 할 유일한 규약이다.

---

## 2. 현재 FE 동작 — 병합 전제와 정합함

저장 페이로드는 `buildDataJson()`(`bo/src/app/admin/templates/make/_shared/utils.ts`)이 단독으로 조립한다.
아래 두 성질 때문에 별도 조치 없이 위 계약이 이미 성립한다.

| 케이스 | `buildDataJson` 동작 | 병합 시 결과 |
|:---|:---|:---|
| 화면에 있는 필드 | `section[key] = rawValues[f.id] ?? ""` — 값이 비어도 키를 씀 | 요청 값으로 갱신(빈 값이면 빈 값으로) |
| `hideCondition` 충족(숨김) 필드 | `if (f.hideCondition && evalFieldCondition(...)) return;` — **키 자체를 쓰지 않음** | 기존 DB 값 보존 |
| 템플릿에서 제거된 필드 | 위젯 `fields`에 없으므로 순회 대상 아님 — 키 없음 | 기존 DB 값 보존 |
| 다중 slug(그룹) 저장에서 다른 slug의 필드 | 해당 slug 위젯만 넘겨 조립하므로 키 없음 | 다른 slug 데이터에 영향 없음 |
| SubList `rows` / MultiSelect 배열 | 현재 화면 상태 전체를 배열로 씀 | 배열 통째 교체(요소 단위 병합 없음) |

> `contentKey`가 있으면 `dataJson[contentKey] = section`으로 중첩 저장되고, 다른 `connectedSlug` 위젯은
> `dataJson._rel[connectedSlug]`에 들어간다. 두 경로 모두 BE 재귀 병합 대상이므로 섹션 단위 유실이 없다.

**주의(설계상 의도된 동작):** `hideCondition`으로 숨겨진 필드는 "보존"이지 "삭제"가 아니다.
따라서 조건을 바꿔 필드를 숨긴 뒤 저장해도 그 필드의 예전 값은 DB에 남는다.
값을 실제로 비우려면 필드가 화면에 표시된 상태에서 비우고 저장해야 한다.

---

## 3. 선행 완료된 FE 변경 (STEP A / STEP B)

병합 정책과 맞물리는 FE 변경은 이미 반영돼 있다. 아래는 현재 코드의 상태 기록이다.

### STEP A — 수정 모드 진입 시 기본값 폴백

`restoreFormDataFromJson()`(`bo/src/app/admin/templates/make/_shared/hooks/useWidgetPageState.ts`)이
필드 값을 복원할 때의 우선순위:

1. `dataJson`에 해당 key가 있으면 그 저장값
2. key가 **아예 없을 때만** `computeFieldDefaultValue(f, t)`의 `defaultValue` 계열로 폴백

신규 등록의 `initFormDefaultValues`와 같은 기본값 계산 로직(`computeFieldDefaultValue`, `utils.ts`)을 공유하므로,
템플릿에 뒤늦게 추가된 필드가 수정 화면에서 빈칸이 아니라 신규 등록과 동일한 기본값으로 채워진다.
다국어 기본값(`defaultValueMsgKey`) 폴백을 위해 번역 함수 `t`를 인자로 받는다.

> 병합과의 관계: 이 폴백으로 채워진 필드는 화면에 표시되는 필드이므로 저장 시 키가 **포함**된다.
> 즉 "보존" 대상이 아니라 "그 기본값으로 기록"되는 것이 의도된 결과다.

### STEP B — 저장 페이로드 조립 일원화

page 모드(`useWidgetPageState.ts`)와 popup 모드(`WidgetRenderer.tsx`)의 등록(POST)·수정(PUT) 호출이
모두 `buildDataSavePayload()`(`utils.ts`)를 거친다. `dataJson` / `pkKeys` / `templateSlug` /
`validationRuleIds` / `groupId`를 한 곳에서 조립하므로, 호출부별로 필드를 누락해 검증 규칙이 적용되지 않는
편차가 생기지 않는다.

병합 정책에서 이 통합이 갖는 의미: **BE가 병합 후 최종값으로 검증(unique/maxCount)을 판정하려면
`validationRuleIds`가 모든 저장 경로에서 빠짐없이 전달되어야 한다.** 그 전제가 이 단계에서 보장된다.

---

## 4. FE 변경 없음 판정

| 항목 | 판정 | 근거 |
|:---|:---|:---|
| `buildDataJson` 수정 | 불필요 | 이미 "화면에 있는 필드 키만" 조립. 숨김 필드는 키 미기록 |
| `buildDataSavePayload` 수정 | 불필요 | 요청 스펙(URL/바디 필드) 변경 없음 |
| `restoreFormDataFromJson` 수정 | 불필요 | 응답 `dataJson`이 병합 후 최종값으로 내려오므로 복원 로직 그대로 동작 |
| 저장 후 재조회/화면 갱신 | 불필요 | `update()` 응답이 기존과 동일한 `PageDataResponse` |
| `CategoryRenderer` 정렬 저장(PUT) | 불필요 | 기존 `_dataJson` 전체 + `sortOrder`를 보내므로 병합 결과가 기존과 동일 |
| Data Entity 연동 저장 경로 | 해당 없음 | `page_data` 경로가 아님 — 이번 스코프 밖 |

---

## 5. QA 확인 포인트 (bo-qa-validator)

FE 코드 변경은 없지만, 화면 기준으로 병합이 의도대로 보이는지는 확인이 필요하다.

- [ ] `hideCondition`으로 숨겨진 필드가 있는 데이터를 수정 저장한 뒤, 조건을 되돌려 필드를 다시 표시했을 때 이전 값이 남아 있는가?
- [ ] 화면에 표시된 필드의 값을 지우고 저장하면 실제로 빈 값으로 저장되는가? (보존되면 안 됨)
- [ ] 다중 slug(그룹) 페이지에서 한 slug만 저장했을 때 다른 slug 데이터가 유지되는가?
- [ ] SubList 행을 전부 삭제하고 저장하면 빈 배열로 저장되는가? (이전 행이 되살아나면 안 됨)
- [ ] 템플릿에 새 필드를 추가한 뒤 기존 데이터를 열면 기본값(STEP A 폴백)이 표시되고, 저장 시 그 값이 기록되는가?
- [ ] unique 규칙 대상 필드가 숨겨진 상태로 저장할 때, 보존값 기준으로 중복 판정되는가?
