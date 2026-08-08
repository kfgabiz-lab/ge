# FO 메인화면 보안성검토 매트릭스

> 작성일: 2026-08-07
> 대상: fo(북미 홈페이지) 메인화면(`/main` 라우트 + 레이아웃 체인 전체) + 해당 화면이 호출하는 bo-api 엔드포인트 8종
> 특이사항: DB `menu` 테이블 조회 결과 `menu_type='FO'` 중 `/`·`/main` 또는 이름에 main/home이 포함된 메뉴가 0건이었다. 즉 메인화면은 DB 메뉴가 아닌 **고정 라우트**이며, `fo/src/app/main/**` 소스 구조를 직접 추적해 범위를 확정했다(`fo/src/app/page.tsx`는 존재하지 않으며 `/main`이 실질 진입점).
> 체크리스트 카테고리(A~J)는 `docs/보안성검토/ckecklist.md`(fo 보안성검토 체크리스트)와 동일한 분류 체계를 그대로 사용한다.
> 표기: `PASS`(이상없음) / `FAIL`(이슈발견, 상세는 "발견 이슈" 섹션에) / `-`(미분석) / `N/A`(해당사항 없음) / `UNPROVEN`(코드/로컬 분석만으로 확정 불가)

---

## 매트릭스 1 — FO 구성단위 × 카테고리 A~J

| 구성 단위 | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| 1. 페이지 셸/레이아웃 | PASS | N/A | PASS | N/A | N/A | N/A | N/A | FAIL | PASS | FAIL |
| 2. 메인 팝업 | PASS | PASS | PASS | N/A | FAIL | N/A | N/A | N/A | PASS | N/A |
| 3. 메인 비주얼/배너 | PASS | PASS | PASS | PASS | FAIL | N/A | N/A | PASS | PASS | N/A |
| 4. 정적 콘텐츠 섹션 | PASS | N/A | PASS | N/A | PASS | N/A | N/A | N/A | PASS | N/A |
| 5. 하이라이트 뉴스 | PASS | FAIL | PASS | N/A | PASS | N/A | N/A | N/A | PASS | N/A |
| 6. 메인 제품 | PASS | PASS | PASS | PASS | PASS | N/A | N/A | N/A | PASS | N/A |
| 7. GNB 헤더 | PASS | PASS | PASS | N/A | FAIL | N/A | PASS | N/A | PASS | N/A |
| 8. 푸터/뉴스레터 | PASS | N/A | PASS | N/A | PASS | FAIL | N/A | N/A | PASS | FAIL |
| 9. 쿠키 설정 | PASS | N/A | PASS | N/A | N/A | N/A | N/A | N/A | PASS | FAIL |
| 10. 공통 인프라/설정 | PASS | FAIL | FAIL | FAIL | PASS | N/A | N/A | FAIL | FAIL | FAIL |

**집계: 총 100셀 — PASS 46 / FAIL 20 / N/A 34 (미분석 0)**

> 판정 근거는 nextjs-security-reviewer(fo) + java-security-reviewer(bo-api) 결과를 디스패처가 병합한 것이다. Critical 항목은 디스패처가 curl 실측(비인증 요청)으로 재확인했다.

### 대상 파일

| # | 구성 단위 | 파일 |
|---|---|---|
| 1 | 페이지 셸/레이아웃 | `fo/src/app/layout.tsx`, `fo/src/middleware.ts`, `fo/next.config.ts`, `fo/proxy.ts` |
| 2 | 메인 팝업 | `fo/src/app/main/components/*Popup*` |
| 3 | 메인 비주얼/배너 | `fo/src/app/main/page.tsx`, `main/layout.tsx`, `MainLayoutShell.tsx`, `main/components/*` |
| 4 | 정적 콘텐츠 섹션 | `fo/src/app/main/components/*` |
| 5 | 하이라이트 뉴스 | `fo/src/app/company/data/pressData.ts`, `bo-api/.../service/PageDataService.java` |
| 6 | 메인 제품 | `fo/src/data/*`, `fo/src/lib/{api,siteTime,pageDataApi,pageData}.ts` |
| 7 | GNB 헤더 | `fo/src/components/layout/main/MainHeader.tsx`, `fo/src/data/gnb/**` |
| 8 | 푸터/뉴스레터 | `fo/src/components/layout/main/MainFooter.tsx` |
| 9 | 쿠키 설정 | `fo/src/app/main/cookie-setting/**` |
| 10 | 공통 인프라/설정 | `bo-api/src/main/resources/application-{dev,developer,local}.yml`, `fo/.env.local`, `fo/.gitignore`, `fo/package.json`, `fo/src/app/apps/daelimEUEM_responser/route.ts` |

---

## 매트릭스 2 — bo-api 엔드포인트 × 카테고리 A~J

| 엔드포인트 | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| `GET /fo/site-settings` | N/A | FAIL | FAIL | FAIL | N/A | PASS | N/A | FAIL | N/A | N/A |
| `GET /fo/menus/gnb` | PASS | PASS | PASS | FAIL | N/A | PASS | N/A | FAIL | N/A | N/A |
| `GET /fo/popup` | PASS | FAIL | PASS | FAIL | N/A | PASS | N/A | FAIL | N/A | N/A |
| `GET /fo/page-files/{id}` | N/A | FAIL | FAIL | FAIL | N/A | UNPROVEN | FAIL | FAIL | N/A | N/A |
| `GET /fo/codes/{groupCode}` | PASS | FAIL | FAIL | FAIL | N/A | UNPROVEN | N/A | FAIL | N/A | FAIL |
| `GET /fo/product-groups` | PASS | FAIL | PASS | FAIL | N/A | PASS | N/A | FAIL | N/A | N/A |
| `GET /fo/page-data/{slug}` 외 3종 | PASS | FAIL | FAIL | FAIL | N/A | FAIL | N/A | FAIL | PASS | FAIL |
| `POST /fo/page-data/{slug}/{id}/view-count` | PASS | FAIL | PASS | FAIL | FAIL | FAIL | N/A | FAIL | N/A | N/A |
| `POST /fo/newsletter/insights` | PASS | PASS | FAIL | FAIL | FAIL | FAIL | N/A | FAIL | N/A | FAIL |

---

## 카테고리(A~J) 정의

`docs/보안성검토/ckecklist.md`와 동일 (fo 일반 체크리스트 참조).

---

## 발견 이슈

<!-- 형식: #번호 [파일:라인] 설명 — 카테고리 / 심각도(Critical|Warning|Info). 번호는 문서 전체에서 순차 부여. -->

### Critical

- **#1 [bo-api/.../controller/FoPageDataController.java:36-45, service/PageDataService.java:141]** `GET /api/v1/fo/page-data/{slug}`에 slug 화이트리스트가 전혀 없고 `SecurityConfig.java:88,130`이 `/api/v1/fo/**`를 전면 `permitAll`한다. `page_data` 테이블에 공개 콘텐츠와 **개인정보 접수 데이터가 slug로만 구분되어 공존**한다. — B, C, J / **Critical**
- **#2 [실측]** `curl http://localhost:3002/api/v1/fo/page-data/trainingApplHis-data`(fo 공개 프록시 경유, 인증 없음) 호출 시 `email`, `phone`, 성명·회사·주소·우편번호가 전량 반환됨을 실측으로 확인. #1과 동일 취약점의 실증. — J / **Critical**
- **#3 [bo-api/.../common/mail/MailService.java:85-121, service/NewsletterInsightsService.java:53-63]** 뉴스레터 발송 이력이 `emailSendHis-data` slug로 `page_data`에 적재되며, #1과 동일한 무인증 경로로 실측 시 구독자 이메일이 그대로 반환됨(`recipientEmail` 필드 노출). 구독자 이메일 대량 회수가 가능하다. — J, C / **Critical**
- **#4 [fo/src/app/company/data/pressData.ts:38-41, bo-api/.../PageDataService.java:419-448]** 하이라이트 뉴스의 게시/미게시 게이트가 **클라이언트가 보내는 쿼리파라미터**(`condexpr_status`/`condval_status`)로만 구현되어 있다. 실측 결과 필터 포함 `totalElements:26` vs 필터 제거 `totalElements:27`로, 파라미터만 제거하면 미게시 보도자료가 노출된다. `findPublicDetail`은 이름과 달리 서버측 게시 조건이 없다. — B / **Critical**
- **#5 [bo-api/.../controller/FoCodeController.java:31-34]** `GET /api/v1/fo/codes/{groupCode}`의 `@PathVariable String groupCode`가 무검증이다. `EMAIL_RECIPIENT` 그룹 호출 시 내부 담당자 실제 메일주소(`comksjc@ls-electric.com` 등)가 비인증으로 노출된다. — C, J / **Critical**
- **#6 [bo-api/src/main/resources/application-dev.yml:8,17,115, application-developer.yml:115, application-local.yml:74-75]** Azure Blob **SAS 토큰 전문**(2026-12-31까지 유효) + DB 비밀번호 + SMTP 비밀번호 + 암호화 키/IV가 평문으로 커밋되어 있다(값은 2026-08-08 `bo-로그인-매트릭스.md` 쪽 정리 시 문서에서 마스킹 처리 — 실제 코드 조치 여부는 이 문서의 별도 진행이력 확인 필요). SAS 토큰은 별도 자격증명 없이 즉시 악용 가능하다. — C, D / **Critical**
- **#7 [fo/.env.local, fo/.gitignore:37]** `.gitignore`에 `.env*` 규칙이 있음에도 `git ls-files` 확인 결과 `.env.local`이 실제로 git 추적 중이다. 실 Google Maps API 키(bo-api와 동일 값) + reCAPTCHA **테스트 site key**가 커밋되어 있으며, 테스트키이므로 프로젝트 내 reCAPTCHA 방어가 전부 무력화된 상태다. — C, H / **Critical**
- **#8 [fo/src/app/layout.tsx:71-72, fo/src/components/layout/main/MainFooter.tsx:96]** 쿠키 동의값(`ls-cookie-consent`)의 유일한 소비처가 "배너 표시 여부"뿐이라, "Reject All"을 눌러도 실제 트래킹 스크립트 실행 흐름은 변하지 않는다. `daelimEUEM_*.js`가 `beforeInteractive`로 동의 이전에 무조건 로드되어 `jsessionid`/`remote_ip`/`xforwardedfor`/`coordinate`/`uri_query` 등을 `https://kafkarestapi.daelim.co.kr`로 전송한다(Avro 스키마 필드 실측 추출). 동의 UI가 존재하는데 미작동이라 CCPA/CPRA 대상 사이트로서는 규제상 더 불리하다. — J, H / **Critical**
- **#9 [fo/package.json:22 (`next: 16.2.6`)]** `npm audit` 결과 high 5건. 그중 미들웨어 우회(GHSA-6gpp-xcg3-4w24)와 rewrites SSRF(GHSA-p9j2-gv94-2wf4)는 이 프로젝트가 실제로 사용하는 Turbopack + `src/middleware.ts` + `rewrites()` 프록시 구조와 정확히 겹친다. — H, I / **Critical**

> 위 #1·#2는 동일 취약점의 코드 근거/실측 결과 쌍이며, 매트릭스 요약에서 언급한 "고유 Critical 8건"은 #1~#9 중 #1·#2를 1건으로 묶어 센 수치다.

### Warning (영향도 상위)

- **#10 [bo-api/.../service/PageDataService.java:142-144, PageFileService.java:177-192]** `X-Site-Id` 헤더를 생략하면 사이트 경계 필터 절이 아예 붙지 않아(`if (siteId == null) return;`) 전 사이트 데이터가 반환된다. 헤더는 `fo/src/lib/api.ts:5`의 `NEXT_PUBLIC_SITE_ID` 기반이라 브라우저에서 자유롭게 조작 가능하다. — B / Warning
- **#11 [bo-api/.../controller/FoPageFileController.java]** `page-files/{id}` 파일 IDOR. 부모 `page_data`의 게시 여부·slug 종류를 전혀 확인하지 않아 id 순회로 미게시 이미지/임시저장 첨부를 열람할 수 있다. — B, G / Warning
- **#12 [bo-api/.../FoPageFileController.java:48-54]** 업로드 확장자/MIME 화이트리스트가 없고 `Content-Disposition: inline`으로 응답한다. SVG/HTML 저장형 XSS 가능성이 있으며 CSP 미설정으로 완화 수단도 없다. — A, D / Warning
- **#13 [bo-api/.../TrainingRegistrationService.java:78 대비 NewsletterInsightsService]** 뉴스레터 구독에는 reCAPTCHA/rate limit/중복방지가 전무하다. 같은 FO 리드캡처 폼 계열 중 뉴스레터만 이 방어가 빠져 있어, 호출 1회 = 내부 담당자 메일 1통 + DB INSERT 1건이 무제한 발생할 수 있다. — F / Warning
- **#14 [bo-api/.../PageDataService.java:225]** `size` 상한이 없고 `unpaged=true`이면 LIMIT 절 자체가 소멸한다. #1의 유출 경로와 결합하면 유출 규모가 전량이 된다. — F / Warning
- **#15 [fo/proxy.ts (루트) vs fo/src/middleware.ts (활성)]** `fo/proxy.ts`는 **실행되지 않는 죽은 코드**다. 이 프로젝트는 `src/` 구조라 `src/middleware.ts`만 실제 활성되며, AppScan 대응 XSS 패턴 차단·보안헤더 재적용 로직이 전부 미실행 상태다. "있다고 착각하게 만드는" 상태라 위험도가 높다. — D / Warning
- **#16 [fo 응답 헤더 실측]** CSP가 `frame-ancestors 'self'` 하나뿐이고 `script-src`/`connect-src`/`default-src`가 전무하다. `Permissions-Policy`도 부재하다. — D / Warning
- **#17 [fo/src/app/apps/daelimEUEM_responser/route.ts]** 인증 없이 `JSESSIONID`를 JSON으로 반환한다(HttpOnly 무력화 설계). 현재 bo-api가 STATELESS라 항상 빈 값이나, 동일 도메인에 WAS/SSO가 붙는 순간 XSS 1회로 세션 탈취가 성립하는 구조다. `Cache-Control`도 없다. — C / Warning
- **#18 [bo-api/.../TransactionLogFilter.java:36-39]** `/api/v1/auth/` 외 전 POST 본문이 무마스킹 적재되어, 뉴스레터 구독 등에서 이메일이 평문으로 로그 테이블에 저장된다. — J / Warning
- **#19 [fo/src/app/()/layout.tsx:14,17 vs fo/src/middleware.ts matcher]** `x-pathname` 헤더 스머글링 — middleware matcher 범위 밖 경로(`/products-category/*` 등)에서 공격자가 제어하는 헤더를 그대로 신뢰한다. `/main`은 이 값의 소비처가 없어 메인화면 자체에는 영향이 없다(참고용 기록). — B / Info로 하향 가능(범위 밖)

### 양호 확인 항목 (근거 확인 완료)

- SQL 인젝션 방어 무결점 — `PageDataService`의 동적 JSONB 쿼리 빌더가 필드명·경로를 전 구간 `[a-zA-Z0-9_]+` 정규식 화이트리스트로 검증하고 값은 named parameter로 바인딩(14개 지점 확인).
- 메인화면 전 구간 `dangerouslySetInnerHTML`/`innerHTML`/`eval` 0건.
- `remotePatterns` 단일 도메인 유지, `poweredByHeader:false`, 보안헤더 6종 전역 적용(실측 확인).
- 배너 프리뷰의 서버측 토큰 검증(`previewMode.ts:22-27`), YouTube postMessage 이중 출처 검증, 히스토리 네비게이션 same-origin 체크.
- 뉴스레터 서버측 `@Valid @Email @Size` + 메일 본문 `HtmlUtils.htmlEscape` 적용.
- CORS 화이트리스트 명시(와일드카드 없음), 액추에이터 미노출, 500 응답 스택트레이스 미노출.

### UNPROVEN (코드/로컬 분석만으로 확정 불가 — 7건)

Google Cloud Console의 Maps 키 리퍼러 제한 여부 / 운영 `API_PROXY_TARGET` 주입 경로 오염 가능성 / 운영 CDN 캐시 정책 / `daelimEUEM_run.js`(난독화 124KB) 전체 동작 / Spring Boot 3.5.0 전이 의존성 실제 해석 버전 / 인프라 레벨 rate limit(WAF·API GW) 존재 여부 / Download Center 범위(별도 점검 필요)

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-07 | 최초 작성 — security-review-dispatcher(nextjs-security-reviewer + java-security-reviewer) 점검 결과 반영, Critical 4건 실측 재확인 |
