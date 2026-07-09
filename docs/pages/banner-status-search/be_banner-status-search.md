# 배너 게시상태 검색 BE 상세 설계서

## 1. 개요

- **도메인**: banner-list 화면의 search 위젯 select 필드(`status`: 게시/미게시) 검색
- **DB 설계**: [db_banner-status-search.md](../../db/banner-status-search/db_banner-status-search.md) (스키마 변경 없음)
- **대상 파일**: `bo-api/src/main/java/com/ge/bo/service/PageDataService.java`
- **핵심**: search select 값을 신규 검색 파라미터 `pubstatus_{key}` 로 받아,
  table `status` 컬럼 표시식과 **완전히 동일한 조건**의 WHERE 절을 생성한다.
- **엔드포인트 신규 추가 없음**: 기존 `GET /api/v1/page-data/{slug}` 의 동적 검색 파라미터 하나가 추가될 뿐이다.

---

## 2. 왜 신규 파라미터 접두사가 필요한가 (기존 구조 재검증 결과)

`PageDataService.appendWhereConditions`(678~906행)는 파라미터 키를 접두/접미사로 분기하며,
**모든 파라미터가 서로 AND 로만 결합**된다. 기존 분기별 능력:

| 패턴 | 처리 | OR/NOT 지원 |
|:---|:---|:---|
| `eq_{key}` | 정확 일치 `=` | ❌ |
| `drs_{key}` | CURRENT_DATE 대소 비교 (before/in_range/after), `<=` / `>=` | ❌ |
| `{key}_from` / `{key}_to` | dateRange 범위 | ❌ |
| `{key}_gte` / `{key}_lte` | 단일 date 범위 | ❌ |
| `f1\|f2` | **동일 검색값**에 대한 필드명 간 OR (ILIKE) | 제한적 |
| 단순 키 | ILIKE 부분 일치 | ❌ |

**결론:**
- "게시"(3조건 AND)는 이론상 `eq_isVisible=001` + `drs_postDate=in_range` 두 파라미터를 동시 전송해
  서버 변경 없이 표현 가능하다. **그러나 두 가지 이유로 재사용하지 않는다:**
  1. `drs_ in_range`는 부등호가 `<=` / `>=` 인데, 표시식은 strict `<` / `>` 다. "완전히 동일한 조건"이 목표이므로 불일치.
  2. "미게시"는 3조건의 부정 = **서로 다른 키 간 OR 조합**이며, 현재 AND 전용 구조로는 어떤 조합으로도 표현 불가.
- 따라서 게시/미게시를 하나의 원자 파라미터로 처리하는 **전용 접두사 `pubstatus_` 분기 신설**이 정합적이다.
  (기존 `drs_` 분기와 동형으로 추가 → 컨벤션 일관성 유지)

---

## 3. 신규 검색 파라미터 스펙

### 3.1 파라미터 형식

```
GET /api/v1/page-data/{slug}?pubstatus_{statusFieldKey}=published|unpublished
```

| 파라미터 | 값 | 의미 |
|:---|:---|:---|
| `pubstatus_status` | `published` | 게시 상태 행만 조회 |
| `pubstatus_status` | `unpublished` | 미게시 상태 행만 조회 |
| (값 없음/미전송) | - | 게시상태 필터 미적용 (전체) |

> `pubstatus_` 뒤의 키(`status`)는 search select 필드의 `fieldKey`다. WHERE 절 생성에는 직접 쓰이지 않고
> (실제 판정 필드는 `isVisible`/`postDate_from`/`postDate_to` 고정), 파라미터 네이밍/SQL Injection 검증 용도로만 쓴다.
> 값 검증: `published` / `unpublished` 외 값은 무시(조건 미추가).

### 3.2 게시상태 판정 필드 (표시식과 동일, 고정)

| 필드 | 조건(게시) |
|:---|:---|
| `isVisible` | `= '001'` |
| `postDate_from` | `< CURRENT_DATE` (strict) |
| `postDate_to` | `> CURRENT_DATE` (strict) |

날짜 비교는 기존 `drs_` 분기와 동일하게 8자리 숫자 문자열 비교를 사용한다:

```sql
substring(regexp_replace(<jsonpath>, '[^0-9]', '', 'g'), 1, 8)  vs  to_char(CURRENT_DATE, 'YYYYMMDD')
```

`postDate_from` / `postDate_to` / `isVisible` 은 `data_json` 최상위 또는 1단계 중첩 object에 존재할 수 있으므로,
기존 로직처럼 **최상위 + 1단계 중첩(EXISTS jsonb_each) 동시 탐색**한다.

---

## 4. 생성 SQL 조건

편의상 아래 축약 표기를 사용한다 (각 표현식은 최상위/중첩 동시 탐색으로 확장됨):

```
vis      = data_json->>'isVisible'
fromN(x) = substring(regexp_replace(x, '[^0-9]', '', 'g'), 1, 8)   -- x의 8자리 숫자
today    = to_char(CURRENT_DATE, 'YYYYMMDD')
pf       = data_json->>'postDate_from'
pt       = data_json->>'postDate_to'
```

### 4.1 published (게시)

```sql
AND (
  vis = '001'
  AND fromN(pf) < today
  AND fromN(pt) > today
)
```

### 4.2 unpublished (미게시) — published 의 정확한 부정

단순 `NOT(...)`은 SQL 3치 논리로 NULL 행을 양쪽에서 누락시키므로, 값 없음(NULL/빈문자)을 명시 포함한다:

```sql
AND (
  COALESCE(vis, '') <> '001'
  OR pf IS NULL OR fromN(pf) = '' OR fromN(pf) >= today
  OR pt IS NULL OR fromN(pt) = '' OR fromN(pt) <= today
)
```

> - `<> '001'` 은 `NOT(= '001')` 이며 NULL 대비 `COALESCE(vis,'')` 로 값 없는 배너도 미게시에 포함.
> - `>= today` 는 `NOT(< today)`, `<= today` 는 `NOT(> today)` 의 경계 포함 부정.
> - 날짜 필드 자체가 없는 배너(NULL/빈값)도 미게시로 잡히도록 `IS NULL` / `= ''` 를 OR 로 추가.
> - 세 조건이 OR 이므로, 최상위/중첩 동시 탐색 확장 시 그룹 괄호에 주의 (중첩 EXISTS 는 게시 로직처럼 필드 단위로 구성).

### 4.3 최상위 + 1단계 중첩 확장 방식

`isVisible`/`postDate_*` 가 중첩 object 안에 있을 수 있으므로, 게시/미게시 그룹을
`(<최상위 판정> OR EXISTS(SELECT 1 FROM jsonb_each(data_json) kv WHERE jsonb_typeof(kv.value)='object' AND <kv.value 기준 동일 판정>))`
형태로 감싼다. 이는 기존 `drs_` 단순키 분기(712~744행)가 `nested` 변수로 처리하는 방식과 동일 패턴이다.

---

## 5. 코드 변경 지점 (2곳, 신규 엔드포인트 없음)

### 5.1 `appendWhereConditions` — `pubstatus_` 분기 신설

`drs_` 분기(683행) 앞 또는 뒤에 동형 블록 추가:

```java
// pubstatus_ 접두사 → 게시상태 검색 (table status 컬럼 표시식과 동일 조건)
// 형식: pubstatus_{fieldKey}=published|unpublished
if (key.startsWith("pubstatus_")) {
    String fk = key.substring("pubstatus_".length());
    if (!fk.matches("[a-zA-Z0-9_]+")) return;          // SQL Injection 방지
    // isVisible / postDate_from / postDate_to 고정 사용, CURRENT_DATE 직접 비교
    if ("published".equals(value)) {
        whereClause.append(" AND ( ... 4.1 게시 조건 (최상위+중첩) ... )");
    } else if ("unpublished".equals(value)) {
        whereClause.append(" AND ( ... 4.2 미게시 조건 (최상위+중첩) ... )");
    }
    // 그 외 값 → 조건 미추가
    return;
}
```

### 5.2 `bindSearchParams` — `pubstatus_` early return 추가 ⚠️ 필수

`bindSearchParams`(978행)는 `drs_` 처럼 CURRENT_DATE 를 직접 쓰는 파라미터는 **바인딩을 건너뛰어야** 한다.
이 early return 을 누락하면 마지막 "단순 키" 분기로 빠져 `p_pubstatus_status` 를 setParameter 하려다,
WHERE 절에는 해당 named parameter 가 없으므로 **런타임 예외(파라미터 미사용/불일치)** 가 발생할 수 있다.

```java
// drs_ / pubstatus_ 접두사 → CURRENT_DATE 직접 사용, 파라미터 바인딩 불필요
if (key.startsWith("drs_")) return;
if (key.startsWith("pubstatus_")) return;   // ← 신규 추가 (필수)
```

> `pubstatus_` 조건은 `isVisible='001'` 같은 리터럴을 SQL 안에 직접 넣거나(값이 고정 상수라 안전),
> named parameter 로 바인딩하려면 `bindSearchParams`에도 대응 setParameter 를 추가해야 한다.
> 값이 `'001'`, `today` 등 **모두 고정 상수/CURRENT_DATE**이므로 파라미터 바인딩 없이 리터럴로 처리하는 것이 단순·안전하다.

---

## 6. 검증 시나리오

| 시나리오 | 기대 결과 |
|:---|:---|
| select "게시" 검색 | table `status`='게시'로 표시되는 행과 **정확히 동일한 행 집합** 반환 |
| select "미게시" 검색 | table `status`='미게시'로 표시되는 행과 **정확히 동일한 행 집합** 반환 |
| `isVisible` 없는 배너 | 미게시에 포함 (누락 없음) |
| `postDate_from`/`postDate_to` 없는 배너 | 미게시에 포함 (누락 없음) |
| 오늘 = postDate_from 당일 (경계) | 표시식 strict `<` 기준으로 게시 아님 → 미게시 (부등호 일치 확인) |
| select 미선택(전체) | 게시상태 필터 미적용, 전체 조회 |
| 게시 검색 결과 수 + 미게시 검색 결과 수 = 전체 수 | 완전 분할(누락/중복 0) 검증 |

---

## 7. BE 개발 체크리스트

> ⚠️ 모든 항목 ✅ 전까지 완료 보고 불가

- [ ] `appendWhereConditions`에 `pubstatus_` 분기가 추가되었는가?
- [ ] `bindSearchParams`에 `pubstatus_` early return 이 추가되었는가? (누락 시 예외)
- [ ] 게시 조건 부등호가 표시식과 동일하게 strict(`<`,`>`)인가? (`drs_`의 `<=`/`>=` 아님)
- [ ] 미게시 조건이 `isVisible` NULL / `postDate_*` NULL·빈값을 포함한 완전한 부정인가?
- [ ] `isVisible`/`postDate_*` 를 최상위 + 1단계 중첩 동시 탐색하는가?
- [ ] `fk` 세그먼트에 SQL Injection 방지 정규식(`[a-zA-Z0-9_]+`)이 적용되는가?
- [ ] `published`/`unpublished` 외 값은 조건 미추가로 무시되는가?
- [ ] 게시 검색 결과 + 미게시 검색 결과 = 전체(누락/중복 0) 인가?
- [ ] 경계값(오늘 = postDate 당일) 처리가 표시식과 일치하는가?
- [ ] `./gradlew build` 오류가 없는가?
