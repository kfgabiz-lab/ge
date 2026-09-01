# 다운로드센터/테크허브/통합검색 문서 다중 카테고리 집계 BE 상세 설계서

## 1. 개요

- **문제**: FO 다운로드센터(`/support/download-center`) 좌측 Product Category에서 "Variable Frequency Drive"처럼
  한 카테고리명이 서로 다른 두 상위(LV1) 카테고리 아래에 각각 존재하는 경우(`L01-15`: LV Products and Systems,
  `L05-04`: Industrial Automation and Control), 실제로 두 카테고리 모두에 속한 문서가 있음에도 한쪽 카운트가
  항상 0으로 나온다. **테크허브(`/support/tech-hub`)도 동일 증상이 실측으로 확인됨.**
- **원인**: `contents_category`는 원래 다대다(문서 1건이 여러 카테고리에 속함) 구조인데,
  `DownloadCenterService.java`/`TechHubService.java`의 `REPRESENTATIVE_CATEGORY_JOIN`이 문서당 대표
  카테고리(LV1/LV2) **1개만** LATERAL 서브쿼리로 뽑아 카운트/필터/카드 표시에 사용한다. 대표로 뽑히지 못한
  카테고리 쪽은 항상 0건이 된다.
- **DB 설계 변경 없음**: `contents_category`는 이미 다대다 스키마이며 인덱스도 충분(`UNIQUE(contents_id, source_path)`가
  `contents_id` 선두 인덱스 역할). 쿼리 로직만 수정한다.
- **결정된 방향**: "대표 카테고리" 개념을 완전히 없애고, 문서가 **실제로 속한 카테고리 전부** 기준으로
  카운트·필터링·카드 표시가 이루어지도록 바꾼다.
- **대상 파일**:
  - `bo-api/src/main/java/com/ge/bo/service/DownloadCenterService.java` (다운로드센터 + `/search` Documents 탭이 공유)
  - `bo-api/src/main/java/com/ge/bo/service/TechHubService.java` (테크허브, 동일 패턴 별도 구현체)
  - `bo-api/src/main/java/com/ge/bo/dto/DownloadCenterContentResponse.java`, `TechHubContentResponse.java`,
    `TechHubDetailResponse.java` (응답에 `categories[]` 배열 추가)
  - `bo-api/src/main/java/com/ge/bo/controller/FoDownloadCenterController.java`,
    `FoTechHubController.java` (계약 주석만 정정, 코드 변경 없음)
- **엔드포인트 신규 추가 없음.** 기존 엔드포인트의 응답 구조 확장 + 내부 쿼리 로직 교체.
- **`/search` Documents 탭이 왜 같이 고쳐지는가**: `fo/src/app/search/components/SearchDocumentsPanel.tsx`는
  `/api/v1/fo/download-center/keyword-contents`(`DownloadCenterService.getContentsByKeyword` →
  `loadContents` 공용 메서드)가 반환하는 `items[]`를 그대로 받아 클라이언트에서 카테고리 필터링/카운트를
  한다. 즉 **다운로드센터와 완전히 같은 DTO(`DownloadCenterContentResponse`)를 공유**하므로, 이 문서의
  BE 변경(`categories[]` 추가) 하나로 다운로드센터와 `/search` Documents 탭이 동시에 해결된다. `/search` 쪽에
  필요한 나머지 작업(클라이언트 필터링 로직을 배열 매칭으로 변경)은 FE 설계 문서(STEP 2)에서 다룬다.

---

## 2. 현재 구조 재검증 결과

### 2.1 `DownloadCenterService.REPRESENTATIVE_CATEGORY_JOIN` (L96~104)

```sql
LEFT JOIN LATERAL (
  SELECT cc.category_l1_id, cc.category_l2_id FROM contents_category cc
  WHERE cc.contents_id = m.id
    AND cc.nahp_display_flag = true AND cc.is_deleted = false
  ORDER BY cc.nahp_level_seq ASC NULLS LAST,
           cc.category_l1_id ASC, cc.category_l2_id ASC NULLS LAST, cc.id ASC
  LIMIT 1
) rc ON true
```

이 `rc.category_l1_id`/`rc.category_l2_id`가 다음 4곳에 전부 쓰인다:
- `buildFilterClause`(L144~153): `categories`/`parentCategories` 필터 조건
- `getCategoryCounts`(L513~544): L1/L2 카운트 `GROUP BY`
- `getDocTypeCounts`(L559~563): categories/parentCategories 필터가 있을 때만 조인
- `loadContents`(L432~501): 카드 응답의 `categoryL1Id`/`categoryL2Id` 표시값

### 2.2 `TechHubService.REPRESENTATIVE_CATEGORY_JOIN` (L51~59)

DownloadCenterService와 동일 패턴이 그대로 복사돼 있음(변수명만 `cat`). `getContents`/`getContentDetail`/
`findRelatedVideos`/`getCategoryCounts`/`getCertCounts` 전부가 이 대표 카테고리(`cat.category_l2_id` 등)를
기준으로 필터/카운트/표시한다. 단, TechHubService는 `parentCategories`(LV1 단독) 필터 개념 자체가 없다
(LV2만 필터).

### 2.3 이미 존재하는, 참고할 다중 카테고리 패턴

`DownloadCenterService.PRODUCT_CODE_EXISTS_CLAUSE`(L86~89, LV3 제품코드 필터)는 이미 대표 카테고리를 거치지
않고 EXISTS 서브쿼리로 다중 카테고리 소속을 판정한다:

```sql
EXISTS (SELECT 1 FROM contents_category cc3 WHERE cc3.contents_id = m.id
  AND cc3.nahp_display_flag = true AND cc3.is_deleted = false
  AND cc3.category_l3_id IN (:productCodes))
```

이번 변경은 이 패턴을 `categories`/`parentCategories`/카운트 쿼리에도 동일하게 적용하는 것이다.

---

## 3. 변경 스펙

### 3.1 필터: EXISTS로 전환 (조인 제거)

`buildFilterClause`(DownloadCenterService L144~153, TechHubService L82~84)의 대표 카테고리 조건을
EXISTS로 바꾼다.

**DownloadCenterService**
```sql
-- 기존
rc.category_l2_id IN (:cats)
(rc.category_l1_id IN (:parentCats) AND rc.category_l2_id IS NULL)

-- 변경 후
EXISTS (SELECT 1 FROM contents_category cc2 WHERE cc2.contents_id = m.id
  AND cc2.nahp_display_flag = true AND cc2.is_deleted = false
  AND cc2.category_l2_id IN (:cats))
EXISTS (SELECT 1 FROM contents_category cc2 WHERE cc2.contents_id = m.id
  AND cc2.nahp_display_flag = true AND cc2.is_deleted = false
  AND cc2.category_l1_id IN (:parentCats) AND cc2.category_l2_id IS NULL)
```

> "LV1-only" 의미(`category_l2_id IS NULL`인 소속 행)는 그대로 유지한다 — 한 문서가 어떤 카테고리 행에서는
> L2까지 태깅되고 다른 행에서는 L1까지만 태깅될 수 있으므로, 이 EXISTS는 "L1만 태깅된 행이 하나라도 있는지"를
> 본다(대표 선정과 무관하게 원본 데이터 그대로).

**TechHubService**: 동일하게 `cat.category_l2_id IN (:cats)` → EXISTS(`cc2.category_l2_id IN (:cats)`) 전환.

`FilterClause.needsCategoryJoin()`은 필터 용도로는 더 이상 필요 없다(EXISTS는 FROM 절 조인이 아니므로 행
증식이 없다) — **단, `loadContents`/카드 조회 쪽은 아래 3.3처럼 별도 조인이 계속 필요**하므로 완전히
제거하지 않고 "필터 EXISTS용"과 "카드 표시용 조인" 용도를 분리해서 유지한다.

### 3.2 카운트: JOIN + `COUNT(DISTINCT 문서id)`로 전환 ⚠️ 최우선 주의사항

카운트는 여러 카테고리에 걸친 문서를 각 카테고리에서 한 번씩 세야 하므로 조인이 필요하다. 이때
**`count(*)`를 그대로 쓰면 안 되고 반드시 `count(DISTINCT m.id)`를 써야 한다** — `contents_category`는
문서당 최대 수십 행(LV3 제품코드까지 태깅된 경우 등)까지 존재할 수 있어, DISTINCT 없이 조인 집계하면
카운트가 실제 문서 수보다 훨씬 부풀려진다.

**DownloadCenterService.getCategoryCounts** (L513~544)
```sql
-- L2 카운트
SELECT cc.category_l1_id, cc.category_l2_id, count(DISTINCT m.id)::int
FROM contents_master m
JOIN contents_category cc ON cc.contents_id = m.id
  AND cc.nahp_display_flag = true AND cc.is_deleted = false
{fc.where() — 단, categories/parentCategories 필터는 3.1의 EXISTS 버전 사용}
GROUP BY cc.category_l1_id, cc.category_l2_id

-- L1 카운트
SELECT cc.category_l1_id, count(DISTINCT m.id)::int
FROM contents_master m
JOIN contents_category cc ON cc.contents_id = m.id
  AND cc.nahp_display_flag = true AND cc.is_deleted = false
{fc.where()}
GROUP BY cc.category_l1_id
```

**TechHubService.getCategoryCounts** (L257~280)도 동일 패턴(`cat.category_l2_id IS NOT NULL` 게이트 유지).

**DownloadCenterService.getDocTypeCounts**(L559~563)의 categories/parentCategories 필터는 3.1의 EXISTS로
바뀌므로 조인 자체가 필요 없어진다(`count(*)`는 그대로 유지 — EXISTS는 행 증식이 없으므로 안전).

**TechHubService.getCertCounts**(L283~314)도 동일 이유로 EXISTS 전환 시 조인 제거.

### 3.3 카드 표시: 대표 1개 → 실제 소속 카테고리 배열

**"대표 카테고리는 없다. 속해 있는 그대로 보여준다"** 는 방향에 맞춰, 응답 DTO에 카테고리 배열을 추가한다.

```java
public record DownloadCenterCategoryRef(String categoryL1Id, String categoryL2Id) {}
```

- `DownloadCenterContentResponse`: `categoryL1Id`/`categoryL2Id`(단일) → **`List<DownloadCenterCategoryRef> categories`로 교체**
- `TechHubContentResponse`, `TechHubDetailResponse`: 동일하게 `categories` 배열로 교체

`loadContents`(DownloadCenterService L432~501)의 `REPRESENTATIVE_CATEGORY_JOIN` 대신, 문서 목록 조회 시
`contents_category`를 별도 쿼리로 한 번에 긁어와(`WHERE cc.contents_id IN (:pageIds)`) 문서 ID별로
묶어서 `categories` 리스트를 채운다(기존 `masterMap` 누적 패턴과 동일한 방식으로 `versions`처럼 처리).

> ⚠️ **필드 제거는 Breaking Change**: `categoryL1Id`/`categoryL2Id` 단일 필드를 참조하는 FE가 있으면
> (다운로드센터 카드, `/search` 카드, 테크허브 카드/상세) 전부 `categories[]`로 바꿔야 한다. FE 설계
> 문서(STEP 2)에서 영향 범위를 확정한다.

---

## 4. 컨트롤러 계약 주석 정정 (코드 변경 없음)

`FoDownloadCenterController.java`에서 사실과 달라지는 주석 3곳을 정정한다:
- L69: "문서 1건은 항상 대표 카테고리(LV1/LV2) 1개로만 집계된다" → "문서 1건이 여러 카테고리에 속하면
  각 카테고리에서 모두 집계된다(대표 카테고리 없음)."
- L70~71: "l1Counts 합계/l2Counts 합계는 해당 필터 기준 total과 항상 일치한다" → "다중 카테고리 소속
  문서가 있으면 l1Counts/l2Counts 합계가 total보다 클 수 있다(정상 동작)."
- L100: "categories/parentCategories는 대표 카테고리 기준" → "실제 소속 카테고리 전부 기준(OR)."

`FoTechHubController.java`에도 동일 취지 주석이 있으면 함께 정정한다(STEP 3 구현 시 재확인).

---

## 5. 영향받는 불변식 — 실측 근거

DB 덤프(`db_dump_20260827.sql`) 기준 `contents_category` 실측:
- 활성 행(`is_deleted=false AND nahp_display_flag=true`) 기준 문서 1,118건 중 **154건(13.8%)이 서로 다른
  LV1에 걸쳐 있음** (1개 LV1: 964건 / 2개: 149건 / 3개: 2건 / 4개: 3건)
- VFD 사례: L01-15 소속 143건, L05-04 소속 143건, 교집합 143건(사실상 동일 문서 집합)

즉 카운트 합계가 total을 넘는 경우가 실제로 발생하며(약 13.8% 규모), 이는 다중 카테고리 필터링에서
정상적인 동작이다. `l1Counts`/`l2Counts` 합계와 `total`을 비교/검증하는 다른 코드는 FE에 없음을 확인했다
(FE는 `l1CountMap.get(code)` 단순 조회만 함) — 이 불변식에 의존하는 부수 코드는 없다.

---

## 6. 검증 시나리오

| 시나리오 | 기대 결과 |
|:---|:---|
| download-center에서 "Industrial Automation and Control" 펼치기 | Variable Frequency Drive(140) — 기존 0에서 정상화 |
| download-center에서 "LV Products and Systems" 펼치기 | Variable Frequency Drive(140) — 기존과 동일 유지 |
| 두 카테고리 각각 체크 후 목록 비교 | 두 체크박스 모두 동일한 143건(또는 실측치)이 나열됨(같은 문서 집합) |
| Total(전체 카운트) | 981(또는 현재값)에서 불변 — count(DISTINCT m.id) 덕분에 total 자체는 안 바뀜 |
| l1Counts 합계 vs total | 합계가 total보다 클 수 있음(정상) — 화면에 별도 검증 로직 없는지 확인 |
| tech-hub 동일 카테고리 확인 | download-center와 동일하게 두 카테고리 모두 정상 카운트 |
| `/search` Documents 탭, VFD 키워드로 카테고리 필터 | 두 카테고리 체크박스 모두 정상 카운트(0 아님) |
| 문서 카드에 카테고리 다중 표시 | 여러 카테고리에 속한 문서 카드가 해당 카테고리 전부(또는 FE 설계에 따른 표기)를 반영 |
| `./gradlew build` | 오류 없음 |

---

## 7. BE 개발 체크리스트

> ⚠️ 모든 항목 ✅ 전까지 완료 보고 불가

- [ ] `DownloadCenterService.buildFilterClause`의 categories/parentCategories 조건이 EXISTS로 전환됐는가?
- [ ] `TechHubService.buildFilterClause`의 categoryL2Ids 조건이 EXISTS로 전환됐는가?
- [ ] `getCategoryCounts`(양쪽 서비스)가 `count(DISTINCT m.id)`를 쓰는가? (`count(*)` 그대로 두면 카운트 폭증 버그)
- [ ] `getDocTypeCounts`/`getCertCounts`의 불필요해진 대표카테고리 조인이 제거됐는가?
- [ ] `loadContents`(및 TechHub 상응 메서드)가 `categories[]` 배열을 정확히 채우는가?(N+1 없이 IN 절 1회 조회)
- [ ] `DownloadCenterContentResponse`/`TechHubContentResponse`/`TechHubDetailResponse`의 필드 변경이
      FE 설계 문서(STEP 2)와 합의된 형태인가?
- [ ] `REPRESENTATIVE_CATEGORY_JOIN` 상수 및 사용처가 코드에서 완전히 제거됐는가? (잔존 시 혼란 방지)
- [ ] 컨트롤러 주석 3곳(§4)이 정정됐는가?
- [ ] VFD 두 카테고리 모두 정상 카운트되는지 실제 API 호출로 확인했는가?
- [ ] total(전체 카운트)이 기존과 동일하게 유지되는가?
- [ ] `./gradlew build` 오류가 없는가?
