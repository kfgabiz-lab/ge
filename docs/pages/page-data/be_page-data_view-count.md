# FO 페이지 데이터 조회수(count) 증가 API 명세서

> FO 상세 페이지(company blog/press/articles/events 등, page_data 기반 상세 화면 전체 공통) 진입 시 `page_data.count`를 +1 하는 전용 API.
> 기존 FO 상세조회 API(`GET /api/v1/fo/page-data/{slug}/{id}`, `FoPageDataController.detail()`)와 완전히 분리된 별도 write 전용 엔드포인트 — 상세조회 로직/트랜잭션에는 영향 없음.
> DB 스키마: [db_page-data.md](../../db/page-data/db_page-data.md)

---

## 1. 개요

| 항목 | 값 |
|:---|:---|
| 엔드포인트 | `POST /api/v1/fo/page-data/{slug}/{id}/view-count` |
| 인증 | 불필요 (`SecurityConfig`에서 `/api/v1/fo/**` permitAll) |
| 요청 바디 | 없음 |
| 성공 응답 | `204 No Content` |
| 기능 | `page_data.count`를 원자적으로 +1. 호출될 때마다 무조건 증가(중복방지/세션 없음) |

---

## 2. 클래스 설계 (기존 `FoPageDataController`/`PageDataService`에 추가)

| 레이어 | 변경 내용 |
|:---|:---|
| Controller | `FoPageDataController`에 `incrementViewCount()` 메서드 추가 |
| Service | `PageDataService`에 `incrementViewCount(String slug, Long id, Long siteId)` 메서드 추가 |
| Entity | `PageData`에 `count` 필드 추가 (`insertable=false, updatable=false` — 일반 CRUD 플로우 무영향) |

### 재사용 대상 (신규 아님)
- `FoPageDataController`의 `{slug}/{id}` 경로 파라미터 + `X-Site-Id` 헤더 wrapper 패턴 (`detail()`과 동일)
- `PageDataService`의 WHERE절 조립 패턴(`data_slug = :slug AND id = :id` + `(site_id = :siteId OR site_id IS NULL)`) — `findPublicDetail()` 참고
- 이미 주입된 `@PersistenceContext EntityManager`

---

## 3. API 스펙

```
POST /api/v1/fo/page-data/{slug}/{id}/view-count
X-Site-Id: 1   (선택, 없으면 사이트 스코프 미적용)
```

**Path Variables:**

| 변수 | 타입 | 설명 |
|:---|:---|:---|
| slug | String | `data_slug` — 예: `blog-data`, `press-data`, `articles-data`, `events-data` |
| id | Long | `page_data.id` |

**Response 204:** No Content (바디 없음)

> 존재하지 않는 `slug`/`id` 조합으로 호출해도 **404가 아닌 204**를 반환한다 — 근거는 4절 참고.

---

## 4. 서비스 처리 흐름 (PageDataService.incrementViewCount)

```
1) WHERE절 조립: data_slug = :slug AND id = :id
   (X-Site-Id 헤더 있으면 AND (site_id = :siteId OR site_id IS NULL) 추가)
2) 원자적 네이티브 UPDATE 실행
     UPDATE page_data SET "count" = "count" + 1 <WHERE절>
   (count는 PostgreSQL 예약어라 큰따옴표 인용)
3) executeUpdate() 반환값(영향 row 수)은 검사하지 않음 — 0건이어도 예외 없이 통과
4) 컨트롤러가 204 반환
```

**존재하지 않는 id/slug → 204 고정(404 아님) 근거:**
- **열거(enumeration) 공격 방지**: 404를 반환하면 id 존재 여부가 응답으로 노출되어 유효 id를 탐침하는 oracle이 됨. 204 고정은 존재/부재를 구분 불가능하게 만든다.
- **fire-and-forget 성격**: FE는 이 API의 결과를 기다리지 않는 부수효과 호출이므로, 실패해도 화면 흐름에 영향이 없어야 한다.

**동시성 안전성:**
- 애플리케이션에서 값을 읽어와 +1 후 저장(read-modify-write)하는 방식이 아니라, 단일 SQL `SET "count" = "count" + 1`로 DB가 원자적으로 처리한다. PostgreSQL이 해당 행에 write lock을 걸고 UPDATE를 직렬화하므로 동시 요청 N건 시 정확히 +N이 반영되며 lost update가 발생하지 않는다. 별도 락(낙관/비관) 불필요.

---

## 5. Repository/Entity 상세

### 5.1 PageData 엔티티 신규 필드

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| count | count | Long | `@Column(name="count", nullable=false, insertable=false, updatable=false)` | 조회수. DB `DEFAULT 0`으로 채워지며, JPA save(create/update) 시 절대 값이 바뀌지 않음 — 오직 본 API의 네이티브 UPDATE로만 증가 |

### 5.2 원자적 UPDATE 쿼리

```java
@Transactional  // readOnly=false(write) — findPublicDetail()의 readOnly 트랜잭션과 완전히 별개
public void incrementViewCount(String slug, Long id, Long siteId) {
    StringBuilder where = new StringBuilder("WHERE data_slug = :slug AND id = :id");
    if (siteId != null) {
        where.append(" AND (site_id = :siteId OR site_id IS NULL)");
    }
    Query q = entityManager.createNativeQuery(
        "UPDATE page_data SET \"count\" = \"count\" + 1 " + where);
    q.setParameter("slug", slug);
    q.setParameter("id", id);
    if (siteId != null) q.setParameter("siteId", siteId);
    q.executeUpdate();
}
```

---

## 6. 예외 매핑 테이블

| 상황 | HTTP | 비고 |
|:---|:---|:---|
| 정상 호출(존재/미존재 무관) | 204 | No Content |
| `id` 경로변수가 숫자가 아님 | 400 | Spring 타입 변환 실패 자동 처리(기존 `detail()`과 동일 동작) |

---

## 7. 보안 매트릭스

| API | Method | 권한 |
|:---|:---|:---|
| `/api/v1/fo/page-data/**` | ALL | 비로그인 전체 허용(`permitAll`) — 기존 FO 공개 API와 동일 |

---

## 8. FE 연동 (fo-fe-builder STEP4에서 구현)

- 상세 페이지가 **서버 컴포넌트**(`fo/src/app/company/*/detail/[id]/page.tsx`, async function)이므로, 이 API는 **서버 컴포넌트 내부에서 직접 호출하지 않는다** — Next.js Link 프리페치 시 서버 컴포넌트가 실제 방문 없이 먼저 실행되어 조회수가 과다 증가할 위험이 있기 때문.
- 대신 4개 도메인 공통 컴포넌트 `fo/src/app/company/components/CompanyArticleDetail.tsx`에 CSR(클라이언트 사이드, `"use client"` + `useEffect`) 방식으로 마운트 시 1회 호출한다 — 실제 브라우저 마운트 시점에만 실행되어 프리페치와 무관.
- `fo/src/lib/pageDataApi.ts`에 `fetchApi<void>("/api/v1/fo/page-data/{slug}/{id}/view-count", { method: "POST" })` 형태의 공통 호출 함수를 추가해 재사용한다.
- 응답(204)을 화면에 표시하지 않으며, 호출 실패 시에도 별도 에러 처리 없이 무시한다(fire-and-forget).

---

## 9. 범위 밖 (이번 STEP 제외)

- 조회수 화면 표시 (FO/bo 모두) — 제외
- 중복 방문 방지(세션/쿠키 기반 dedup) — 제외
- bo 관리자 화면에서의 조회수 노출/정렬/검색 — 제외
