---
name: fullstack-performance
description: 웹페이지 렌더링 전체 구간(브라우저·Next.js 서버·bo-api·PostgreSQL)의 시간 분해(waterfall) 진단 체크리스트. Core Web Vitals, Next.js RSC/데이터페칭, Spring Boot 서버사이드, PostgreSQL 쿼리 최적화를 하나의 방법론으로 관통한다. 참고: wshobson/agents(performance-engineer, database-optimizer), borghei/Claude-Skills(performance-profiler)를 이 프로젝트(fo/bo/bo-api) 맥락에 맞게 재구성.
---

# 풀스택 성능 진단 체크리스트

한 페이지가 브라우저에 그려지기까지 시간이 **어느 구간**에서 소요되는지 분해하고, 구간별로 원인과 개선안을 찾는 방법론. FE 렌더링/DB 쿼리처럼 한쪽만 보지 않고 요청 전체 경로(브라우저 → Next.js → bo-api → PostgreSQL)를 관통해서 본다.

## 0. 측정 우선 원칙 (Baseline → Identify → Fix → Validate)

- 추측으로 병목을 단정하지 않는다. 반드시 **실측값**(네트워크 타이밍, 서버 로그, EXPLAIN ANALYZE)으로 근거를 남긴다.
- 순서: ①현재 상태를 수치로 기록(baseline) → ②구간별로 쪼개 병목 지점 특정 → ③개선안 제시(수정은 별도 승인 후) → ④수정 후 같은 방법으로 재측정해 비교
- 하나의 총 소요시간만 보고하지 않는다 — 반드시 구간별 표(아래 6번)로 분해한다.

## 1. 프론트엔드 렌더링 (브라우저)

**Core Web Vitals 목표치**
- LCP(Largest Contentful Paint) < 2.5s
- INP(Interaction to Next Paint) < 200ms
- CLS(Cumulative Layout Shift) < 0.1

**점검 항목**
- [ ] 이미지: 최신 포맷(WebP/AVIF), 명시적 width/height, LCP 이미지에 `priority`/`fetchpriority="high"`
- [ ] CLS: 이미지/광고 영역 사전 공간 확보(`aspect-ratio`), 폰트 `font-display: swap`
- [ ] JS 번들: 코드 스플리팅(`dynamic import`), 불필요한 라이브러리 전체 임포트 여부
- [ ] 렌더 블로킹: 초기 뷰포트에 불필요한 CSS/JS가 critical path를 막고 있는지

## 2. Next.js 서버사이드 (fo, App Router)

- [ ] **TTFB**: 서버 응답 첫 바이트까지 시간 — RSC 렌더링/데이터 페칭이 원인인지 네트워크 자체가 원인인지 구분
- [ ] **데이터 페칭 워터폴**: 컴포넌트 트리에서 `fetchApi()` 호출이 직렬(await 순차)로 걸려있어 워터폴이 생기는지, 병렬화(`Promise.all`) 가능한지 확인
- [ ] **RSC vs Client Component**: 불필요하게 큰 트리가 Client Component('use client')로 잡혀 있어 하이드레이션 비용이 커지지 않았는지
- [ ] **캐싱**: `fetch()` 옵션(`cache`, `next.revalidate`)이 매 요청마다 재조회하도록 되어있진 않은지 (이 프로젝트는 `fo/src/lib/api.ts`의 `fetchApi()`를 경유 — 캐싱 정책이 이 함수에 있는지 우선 확인)
- [ ] Next.js 자체 계측: `next dev`/`next build` 로그, 또는 페이지에 임시로 `console.time`을 넣어 서버 콘솔에서 구간 시간을 실측(측정 후 반드시 제거)

## 3. 서버사이드 — bo-api (Java 21 / Spring Boot 3)

이 프로젝트는 **Spring Boot Actuator가 현재 설정되어 있지 않다**(`application-*.yml`에 `management.endpoint` 항목 없음 — 확인 완료). 병목 실측은 아래 방식으로 대체한다.

- [ ] **요청 처리 시간**: 컨트롤러 진입~응답 사이 소요시간을 로그(`logback`) 또는 임시 `StopWatch`/`System.currentTimeMillis()` 계측으로 확인(측정 목적 임시 코드는 커밋하지 않음)
- [ ] **N+1 쿼리**: `application-developer.yml`에서 `hibernate.SQL: DEBUG` + `show-sql/format_sql: true`를 켜서(로컬 developer 프로파일) 화면 하나 렌더링에 실제 몇 개의 쿼리가 나가는지 로그로 센다. 반복 패턴(리스트 N건 조회 후 각 건마다 연관 엔티티 추가 조회)이 보이면 N+1
- [ ] **커넥션 풀**: HikariCP 풀 크기 대비 동시 요청 수 — 풀 고갈로 대기시간이 생기는 구간인지
- [ ] **동기 블로킹**: 외부 API 호출(CTP 연동 등)을 동기로 기다리고 있어 전체 응답시간을 늘리는지

## 4. DB 쿼리 — PostgreSQL

이 프로젝트 DB는 **PostgreSQL**(`org.postgresql.Driver`, 확인 완료)이다.

- [ ] **EXPLAIN (ANALYZE, BUFFERS)**: 의심되는 쿼리를 직접 이 옵션으로 실행해 실제 실행계획과 소요시간을 확인 — `Seq Scan`이 예상 밖으로 나오면 인덱스 누락 의심
- [ ] **인덱스**: WHERE/JOIN/ORDER BY에 자주 쓰이는 컬럼에 인덱스가 있는지, 복합 인덱스라면 컬럼 순서(선택도 높은 컬럼 우선)가 적절한지
- [ ] **N+1은 3번 항목과 함께 확인**: 쿼리 자체는 빨라도 개수가 문제인 경우가 많음
- [ ] **JSONB 조인 검색**: 이 프로젝트는 커스텀 RDB entity 검색에 JSONB + 네이티브 SQL을 쓰는 경우가 있음([[project_bo_builder_entity_api_pattern]] 참고 패턴) — JSONB 연산자(`@>`, `->>` 등)에 GIN 인덱스가 있는지 우선 확인

## 5. API 호출 패턴 진단 (`#성능검증` 전용)

단순히 느린 API를 찾는 것과 별개로, "API를 부르는 방식 자체"가 잘못됐는지 판별하는 항목.

**호출 API 목록**
- [ ] 브라우저 네트워크 로그에서 해당 페이지 로드 시 실제 발생한 API 호출을 전부 나열(엔드포인트, 메서드, 응답시간)
- [ ] FE 소스(`fo/src/lib/api.ts`의 `fetchApi()` 호출부, 또는 BO 화면이면 해당 API client)를 Grep해서 "코드상 호출 예정"인 API와 "실제 네트워크에 찍힌" API를 대조 — 코드엔 있는데 안 찍혔거나 반대인 경우도 이슈로 기록
- [ ] 목록은 아래 표 형식으로 정리:

```
| # | API(메서드+엔드포인트) | 동작시간 | 호출 위치(파일:라인) | 비고 |
|---|----------------------|---------|---------------------|------|
| 1 | GET /api/v1/fo/... | Xms | fo/src/... | 정상/이슈 |
```

**무분별한(중복) API 호출 판별**
- [ ] 동일 엔드포인트가 같은 페이지 로드에서 2회 이상 호출되는지 (예: 상위/하위 컴포넌트가 각자 같은 데이터를 따로 fetch)
- [ ] 리스트 렌더링 시 각 row마다 API를 개별 호출하는 패턴(N+1을 API 레벨로 겪는 경우)이 있는지 — 프론트 코드에서 `.map()` 내부에 `fetchApi()`가 있으면 우선 의심

**잘못된 쿼리 판별 (속도와 무관 — 설계 문제)**
- [ ] 실제 화면에 표시되는 필드보다 훨씬 넓은 범위를 조회하는지(`SELECT *`, 불필요한 JOIN, 안 쓰는 컬럼)
- [ ] WHERE 조건이 빠져서 전체 테이블을 긁어온 뒤 애플리케이션 코드에서 필터링하고 있는지 (DB에서 걸러야 할 조건을 메모리에서 거르는 패턴)
- [ ] 페이징이 필요한 목록인데 LIMIT 없이 전체를 가져오는지

**Chatty API 판별 (개별은 빠르지만 호출 수가 많은 경우)**
- [ ] 개별 API 응답시간은 목표치(예: 200ms) 이내라도, 페이지 하나에서 호출되는 API 개수가 비정상적으로 많아(예: 10개 이상) 왕복 지연이 누적되는지
- [ ] 이 경우 "느린 API"가 아니라 "합칠 수 있는 API를 쪼개 부른 구조" 문제로 별도 표기 — 개선안은 "API 통합(BFF 패턴) 검토"로 제시하되 실제 통합 설계는 이 진단의 범위 밖(별도 승인 후 설계)

## 6. 측정 도구 매핑 (이 프로젝트 기준)

| 구간 | 도구 |
|---|---|
| 브라우저 렌더링/네트워크 워터폴 | chrome-devtools MCP(`performance_start_trace`/`performance_stop_trace`/`performance_analyze_insight`, `list_network_requests`) 우선 — 안 되면 Claude in Chrome(`read_network_requests`, `javascript_tool`) → Playwright(`browser_network_requests`, `browser_evaluate`) |
| Next.js 서버 | 서버 콘솔 로그(`npm run dev` 실행 터미널), 임시 `console.time` |
| bo-api | `hibernate.SQL: DEBUG` 로그(developer 프로파일), 컨트롤러 임시 타임 로그 |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS)` (psql 직접 접속) |

## 7. 구간별 시간 분해표 (보고 산출물 형식)

```
| 구간 | 소요시간 | 전체 대비 % | 근거 |
|------|---------|-----------|------|
| 브라우저 - TTFB 대기 | Xms | X% | 네트워크 탭 실측 |
| Next.js - 데이터 페칭(직렬 3건) | Xms | X% | 서버 콘솔 로그 |
| bo-api - 컨트롤러 처리 | Xms | X% | 임시 타임 로그 |
| PostgreSQL - 쿼리 N건(N+1) | Xms | X% | hibernate.SQL 로그 |
| 브라우저 - 렌더/하이드레이션 | Xms | X% | Performance API |
```

전체 합계가 아니라 **가장 비중이 큰 구간부터** 병목으로 지목하고, 그 구간의 원인 코드(file:line)와 개선안을 함께 제시한다.

---

참고 원본: [wshobson/agents — performance-engineer](https://github.com/wshobson/agents/blob/main/plugins/performance-testing-review/agents/performance-engineer.md), [wshobson/agents — database-optimizer](https://github.com/wshobson/agents/blob/main/plugins/database-cloud-optimization/agents/database-optimizer.md), [borghei/Claude-Skills — performance-profiler](https://github.com/borghei/Claude-Skills/blob/main/engineering/performance-profiler/SKILL.md)
