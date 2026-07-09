# 배너 게시상태 검색 DB 설계서

## 0. 문서 목적

banner-list 화면의 search 위젯 select 필드(`status`: 게시/미게시)로 검색 시,
table 위젯의 `status` 컬럼 표시식과 **완전히 동일한 조건**으로 필터링되도록 하는 기능의 DB 관점 설계서.

**결론: 이 기능은 DB 스키마 변경이 전혀 없다.** 본 문서는 "왜 변경이 없는지"와
"어떤 기존 필드를 그대로 사용하는지"를 명확히 기록하여, 이후 에이전트가 신규 컬럼/인덱스 추가를
검토하지 않도록 근거를 남기는 것이 목적이다.

---

## 1. 스키마 변경 여부: **변경 없음**

| 항목 | 변경 여부 | 근거 |
|:---|:---|:---|
| 신규 테이블 | ❌ 없음 | 기존 `page_data` 테이블 그대로 사용 |
| 신규 컬럼 | ❌ 없음 | 게시상태 판정에 필요한 값은 모두 기존 `data_json`(JSONB) 내부 키에 존재 |
| 신규 인덱스 | ❌ 없음 | 기존 `IDX_PAGE_DATA_SLUG`, `IDX_PAGE_DATA_SLUG_CREATED` 로 충분 (slug 단위 조회) |
| 제약조건 | ❌ 없음 | 변경 없음 |

> banner-list 데이터는 페이지 메이커 공용 저장소인 `page_data` 테이블에 `template_slug = '<배너 slug>'`
> 로 저장된다. 상세 스키마는 [db_page-data.md](../page-data/db_page-data.md) 참조.

---

## 2. 게시상태 판정에 사용하는 기존 JSONB 필드

table 위젯 `status` 컬럼의 표시식은 고정이며 변경 대상이 아니다:

```
isVisible=001, postDate_from<today(), postDate_to>today() ? '게시' : '미게시'
```

이 표시식이 참조하는 `data_json` 내부 키(모두 기존 필드, 신규 없음):

| JSONB 키 | 타입(저장 포맷) | 의미 | 게시 판정 조건 |
|:---|:---|:---|:---|
| `isVisible` | String (`'001'` = 노출, 그 외 = 미노출) | 노출 여부 코드 | `isVisible = '001'` |
| `postDate_from` | String (날짜: `YYYY-MM-DD` 또는 `YYYYMMDD` 등) | 게시 시작일 | `postDate_from < CURRENT_DATE` (strict `<`) |
| `postDate_to` | String (날짜) | 게시 종료일 | `postDate_to > CURRENT_DATE` (strict `>`) |

> `postDate_from` / `postDate_to` 는 dateRange 필드가 from/to 분리 저장한 결과로,
> `page_data.data_json` 최상위 또는 1단계 중첩(content/tab 키 하위) object 안에 존재할 수 있다.
> (기존 `drs_` / `_from` / `_to` 검색 로직이 이미 최상위 + 1단계 중첩 동시 탐색을 수행하는 것과 동일한 구조)

---

## 3. 날짜 비교 방식 (기존 컨벤션 재사용)

`data_json`의 날짜는 문자열로 저장되므로, 기존 검색 로직과 동일하게 **숫자만 추출한 8자리(YYYYMMDD)**
문자열 비교로 오늘 날짜와 대소를 판정한다. 신규 함수/컬럼 없이 기존 SQL 표현식 패턴을 그대로 쓴다.

```sql
-- 저장값 포맷(YYYY-MM-DD / YYYYMMDD / YYYYMMDDHHMMSS)에 무관하게 앞 8자리 비교
substring(regexp_replace(data_json->>'postDate_from', '[^0-9]', '', 'g'), 1, 8)
  < to_char(CURRENT_DATE, 'YYYYMMDD')
```

> 이 표현식은 `PageDataService.appendWhereConditions`의 기존 `drs_` 분기에서 이미 사용 중인 것과
> 동일한 패턴이다. **단, 부등호는 표시식과 맞추기 위해 strict(`<`, `>`)를 사용한다.**
> (기존 `drs_ in_range`는 `<=` / `>=`를 쓰므로, 게시상태 검색은 이를 재사용하지 않고 전용 분기를 둔다 — 상세는 be 문서 참조)

---

## 4. "미게시"의 정확한 부정 — NULL(값 없음) 처리

미게시는 게시 조건의 **정확한 부정**이어야 한다. 게시 조건은 세 개의 AND 조합이므로,
부정은 세 개의 OR 조합이 된다:

```
미게시 = NOT(게시)
       = isVisible <> '001'
         OR NOT(postDate_from < today)
         OR NOT(postDate_to  > today)
```

**주의(SQL 3치 논리):** 날짜 필드가 없거나 NULL이면 `postDate_from < today` 는 `NULL`(=false 취급)로
평가되어 게시에서 제외된다(정상). 그러나 미게시를 단순 `NOT(...)`로 쓰면 `NOT(NULL)=NULL`이 되어
**해당 행이 게시·미게시 어디에도 안 잡히는 누락**이 발생한다.
따라서 미게시 조건은 값이 없는 경우(`IS NULL` / 빈 문자열)를 **명시적으로 포함**해야 완전한 부정이 된다.

이는 SQL WHERE 절 작성 방식의 문제이며 **DB 스키마와는 무관**하다. 구체적 SQL은 be 문서에서 정의한다.

---

## 5. DB 관점 체크리스트

- [x] 신규 테이블 없음 — `page_data` 재사용
- [x] 신규 컬럼 없음 — `isVisible` / `postDate_from` / `postDate_to` 기존 JSONB 키 사용
- [x] 신규 인덱스 없음 — slug 단위 조회 기존 인덱스로 충분
- [x] 마이그레이션 스크립트 불필요
- [ ] (be 문서에서 정의) 게시/미게시 SQL 조건이 표시식과 부등호까지 일치하는가?
- [ ] (be 문서에서 정의) 미게시 조건이 NULL/빈 값을 포함한 완전한 부정인가?
