# FO 메인화면 보안성검토 매트릭스

> 작성일: 2026-08-07 / **전체 재분석: 2026-08-08**
> 대상: fo(북미 홈페이지) 메인화면(`/main` 라우트 + 레이아웃 체인 전체) + 해당 화면이 호출하는 bo-api 엔드포인트 9종
> 특이사항: DB `menu` 테이블 재조회 결과(2026-08-08) `menu_type='FO'` 중 `/`·`/main` 또는 이름에 main/home이 포함된 메뉴가 **여전히 0건**이다. 즉 메인화면은 DB 메뉴가 아닌 **고정 라우트**이며, `fo/src/app/main/**` 소스 구조를 직접 추적해 범위를 확정했다.
> 체크리스트 카테고리(A~J)는 `docs/보안성검토/ckecklist.md`(fo 보안성검토 체크리스트)와 동일한 분류 체계를 그대로 사용한다.
> 표기: `PASS`(이상없음) / `FAIL`(이슈발견, 상세는 "발견 이슈" 섹션에) / `N/A`(해당사항 없음) / `UNPROVEN`(재현 실패 — 코드상 구조는 있으나 실제 성립을 증명하지 못함)

---

## ⚠️ 2026-08-08 전체 재분석의 판정 원칙 (이번 회차부터 강제 적용)

기존 검토의 Critical 9건을 사용자가 하나씩 재검증한 결과 **절반 이상이 실제로는 성립하지 않았다.** 원인은 (1) 테스트/더미 데이터를 실유출처럼 서술, (2) git 이력만 근거로 판정, (3) 발동조건 확인 없이 CVE를 끼워맞춤, (4) 재현하지 않고 가능성만으로 Critical 판정이었다. 이를 반복하지 않기 위해 이번 재분석은 아래를 강제했다.

1. **git 명령어(log/show/blame/ls-files) 결과는 근거로 인정하지 않는다.** 오직 (a) 현재 디스크의 소스 내용, (b) 실제 실행 결과(curl / psql 실측)만 근거다.
2. **Critical/Warning은 실제로 재현한 것만.** 재현 못 하면 `UNPROVEN` 또는 Info로 강등하고, 강등 사실을 명시한다.
3. **테스트/더미/전시용 데이터와 실데이터를 반드시 구분해 서술한다.**
4. 리뷰어(`java-security-reviewer`, `nextjs-security-reviewer`) 정의 파일의 **"4-3. 준수사항"** 블록을 프롬프트에 명시적으로 재주지시켰다.

이 원칙에 따라 이번 회차에서 **기존 Warning 2건이 철회**되고, **기존 Critical 1건이 Info로 강등**되었으며(상세는 "기존 항목 재검증 결과" 참조), 반대로 **신규 Critical 1건이 재현과 함께 확인**되었다.

---

## 매트릭스 1 — FO 구성단위 × 카테고리 A~J

| 구성 단위 | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| 1. 페이지 셸/레이아웃 | PASS | N/A | PASS | FAIL(#26) | FAIL(#21) | N/A | N/A | PASS | PASS | PASS |
| 2. 메인 팝업 | PASS | PASS | PASS | N/A | PASS | N/A | N/A | PASS | PASS | PASS |
| 3. 메인 비주얼/배너 | PASS | PASS | FAIL(#22) | PASS | PASS | N/A | N/A | PASS | PASS | PASS |
| 4. 정적 콘텐츠 섹션 | PASS | N/A | PASS | N/A | PASS | N/A | N/A | PASS | PASS | N/A |
| 5. 하이라이트 뉴스 | PASS | PASS | FAIL(#22) | N/A | PASS | N/A | N/A | N/A | PASS | PASS |
| 6. 메인 제품 | PASS | PASS | PASS | PASS | PASS | N/A | N/A | PASS | PASS | N/A |
| 7. GNB 헤더 | PASS | PASS | PASS | N/A | PASS | N/A | PASS | PASS | PASS | N/A |
| 8. 푸터/뉴스레터 | PASS | N/A | PASS | N/A | PASS | FAIL(#24) | N/A | PASS | PASS | FAIL(#25) |
| 9. 쿠키 설정 | PASS | N/A | PASS | N/A | PASS | N/A | N/A | PASS | PASS | PASS |
| 10. 공통 인프라/설정 | PASS | N/A | PASS | FAIL(#26) | PASS | N/A | N/A | FAIL(#29) | UNPROVEN(#29) | PASS |

**집계: 총 100셀 — PASS 58 / FAIL 8 / N/A 33 / UNPROVEN 1**

### 대상 파일 (2026-08-08 실제 구조로 갱신)

| # | 구성 단위 | 파일 |
|---|---|---|
| 1 | 페이지 셸/레이아웃 | `fo/src/app/layout.tsx`, `fo/src/middleware.ts`, `fo/next.config.ts`, `fo/proxy.ts`(미실행), `fo/src/app/preview/route.ts` |
| 2 | 메인 팝업 | `fo/src/app/main/components/MainImagePopup.tsx` |
| 3 | 메인 비주얼/배너 | `fo/src/app/main/{page,layout,MainLayoutShell}.tsx`, `components/{MainVisual,mainVisualData,BannerSwiper,VideoSwiper}.*` |
| 4 | 정적 콘텐츠 섹션 | `fo/src/app/main/components/{MainInfo,MainCards,IconCards,WhatWeDoSwiper}.tsx` |
| 5 | 하이라이트 뉴스 | **`fo/src/data/highlightNews/highlightNewsData.ts`**, `fo/src/components/content/HighlightNewsSection.tsx` — ⚠️ 기존 문서의 `company/data/pressData.ts` 매핑은 **오류**였다. 메인의 하이라이트 뉴스는 `press-data`/`blog-data`/`articles-data` 3종을 **일반 검색 경로**(`fetchData({slug,page,size,where})`)로 조회한다(`highlightNewsData.ts:122-141` 확인) |
| 6 | 메인 제품 | `fo/src/app/main/components/{MainProducts,MainProductsClient,mainProductsData}.*`, `fo/src/data/**`, `fo/src/lib/{api,siteTime,pageDataApi,pageData}.ts` |
| 7 | GNB 헤더 | `fo/src/components/layout/main/MainHeader.tsx`, `fo/src/data/gnb/**` |
| 8 | 푸터/뉴스레터 | `fo/src/components/layout/main/MainFooter.tsx` |
| 9 | 쿠키 설정 | `fo/src/app/main/cookie-setting/**`, `components/CookieSettingPageClient.tsx` |
| 10 | 공통 인프라/설정 | `fo/.env.local`, `fo/.gitignore`, `fo/package.json`, `fo/src/app/apps/daelimEUEM_responser/route.ts`, `fo/next.config.ts`, `bo-api/src/main/resources/application-*.yml` |

---

## 매트릭스 2 — bo-api 엔드포인트 × 카테고리 A~J

| 엔드포인트 | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| `GET /fo/site-settings` | PASS | PASS | PASS | PASS | PASS | FAIL(#24) | N/A | N/A | FAIL(#24) | N/A |
| `GET /fo/menus/gnb` | PASS | PASS | PASS | N/A | PASS | FAIL(#24) | N/A | N/A | PASS | N/A |
| `GET /fo/popup` | PASS | PASS | PASS | N/A | PASS | FAIL(#24) | N/A | N/A | PASS | N/A |
| `GET /fo/page-files/{id}` | PASS | UNPROVEN(#30) | PASS | UNPROVEN(#30) | PASS | FAIL(#24) | UNPROVEN(#30) | N/A | PASS | N/A |
| `GET /fo/codes/{groupCode}` | PASS | FAIL(#28) | PASS | N/A | PASS | FAIL(#24) | N/A | N/A | PASS | N/A |
| `GET /fo/product-groups` | PASS | PASS | PASS | N/A | PASS | FAIL(#24) | N/A | N/A | PASS | N/A |
| `GET /fo/page-data/{slug}` 외 3종 | PASS | **FAIL(#20)** | FAIL(#22) | N/A | PASS | FAIL(#24) | PASS | N/A | PASS | FAIL(#22) |
| `POST /fo/page-data/{slug}/{id}/view-count` | PASS | FAIL(#23) | PASS | N/A | PASS | FAIL(#23) | N/A | N/A | FAIL(#23) | N/A |
| `POST /fo/newsletter/insights` | PASS | N/A | PASS | PASS | PASS | FAIL(#24) | N/A | N/A | FAIL(#24) | FAIL(#25) |

**집계: 총 90셀 — PASS 39 / FAIL 18 / N/A 30 / UNPROVEN 3**

> ⚠️ 경로 정정: `page-data` 계열은 3종이 아니라 **4종**(`GET /{slug}`, `GET /{slug}/datetime-range`, `GET /{slug}/{id}`, `GET /{slug}/{id}/adjacent`)이다. 이 중 `/datetime-range`가 이번 회차 최대 이슈(#20)의 원인이다.
> `GET /api/v1/fo/menus/gnb`(`FoMenuController`)와 `GET /api/v1/fo/gnb/devices-tree`(`FoGnbController`)는 서로 다른 컨트롤러다. 위 표의 항목은 전자다.

---

## 카테고리(A~J) 정의

`docs/보안성검토/ckecklist.md`와 동일 (fo 일반 체크리스트 30개 세부항목 참조).
A.인젝션/XSS · B.인증/인가(IDOR) · C.민감정보 노출 · D.SSRF/프록시/헤더/CSP · E.오픈리다이렉트/CSRF/클릭재킹 · F.폼입력검증/봇방어/RateLimit · G.검색/다운로드 · H.서드파티/공급망 · I.캐시/가용성(Next.js 특화) · J.개인정보/컴플라이언스

---

## 발견 이슈

<!-- 형식: #번호 [파일:라인] 설명 — 카테고리 / 심각도(Critical|Warning|Info). 번호는 문서 전체에서 순차 부여. -->

### Critical — 사용자 확정 완료 (2026-08-08, #보안성상세분석 결과. **이 블록은 재분석 대상 아님 / 결론 변경 금지**)

- 패스 **#1 [bo-api/.../controller/FoPageDataController.java:36-45, service/PageDataService.java:141]** `GET /api/v1/fo/page-data/{slug}`에 slug 화이트리스트가 전혀 없고 `SecurityConfig.java:88,130`이 `/api/v1/fo/**`를 전면 `permitAll`한다. `page_data` 테이블에 공개 콘텐츠와 **개인정보 접수 데이터가 slug로만 구분되어 공존**한다. — B, C, J / **Critical** — 패스(2026-08-08): `#보안성상세분석` 결과 사용자가 패스로 확정
- 패스 **#2 [실측]** `curl http://localhost:3002/api/v1/fo/page-data/trainingApplHis-data`(fo 공개 프록시 경유, 인증 없음) 호출 시 `email`, `phone`, 성명·회사·주소·우편번호가 전량 반환됨을 실측으로 확인. #1과 동일 취약점의 실증. — J / **Critical** — 패스(2026-08-08): `#보안성상세분석` 결과 사용자가 패스로 확정
- 패스 **#3 [bo-api/.../common/mail/MailService.java:85-121, service/NewsletterInsightsService.java:53-63]** 뉴스레터 발송 이력이 `emailSendHis-data` slug로 `page_data`에 적재되며, #1과 동일한 무인증 경로로 실측 시 구독자 이메일이 그대로 반환됨(`recipientEmail` 필드 노출). 구독자 이메일 대량 회수가 가능하다. — J, C / **Critical** — 패스(2026-08-08): 사용자가 패스로 확정(상세분석 미진행)
- ✅ **#4 [fo/src/app/company/data/pressData.ts:38-41, bo-api/.../PageDataService.java:419-448]** 하이라이트 뉴스의 게시/미게시 게이트가 **클라이언트가 보내는 쿼리파라미터**(`condexpr_status`/`condval_status`)로만 구현되어 있다. 실측 결과 필터 포함 `totalElements:26` vs 필터 제거 `totalElements:27`로, 파라미터만 제거하면 미게시 보도자료가 노출된다. `findPublicDetail`은 이름과 달리 서버측 게시 조건이 없다. — B / **Critical** — ✅ **수정 완료(2026-08-08)**: `PageDataService`에 `FO_PUBLISH_GATED_SLUGS`(press-data/blog-data/articles-data/events-data) + `FO_PUBLISH_GATE_SQL`을 도입해 `is_visible='001' AND publish_dttm<=today`를 서버측에서 하드코딩 강제(클라이언트 파라미터 무관). FO 공개 경로(`search(...,unpaged)` 6-arg 오버로드는 `enforcePublishGate=true` 고정, `findPublicDetail`/`findAdjacent`도 동일 게이트 적용) vs BO 관리자 경로(5-arg 오버로드, `enforcePublishGate=false`)로 완전 분리. `pressData.ts`의 클라이언트 파라미터(`PRESS_STATUS_WHERE`)는 빈 객체로 무력화. 미리보기는 slug+id 바인딩 5분 JWT 토큰(`isValidPreviewToken`)으로만 우회 가능. **실측 재검증 완료**: bo-api 재기동 후 DB 직접조회(`page_data` 27건 중 `is_visible≠'001'` 1건, id=2029) 대비 `GET /api/v1/fo/page-data/press-data?unpaged=true` → `totalElements:26`(미게시 0건 포함), `GET .../press-data/2029` → `404`, `.../adjacent` 이웃 목록에서도 2029 제외, 구버전 우회 파라미터(`condexpr_status`/`condval_status`) 추가 전송해도 여전히 `26`으로 무효화 확인.
  - ⚠️ **2026-08-08 재분석 후속**: 위 수정은 유효하나 **`/datetime-range` 경로에만 게이트가 누락**되어 있음이 새로 확인되었다 → **#20** 참조. #4의 수정 자체가 잘못된 것이 아니라, 같은 게이트를 적용해야 할 4번째 경로 하나가 빠진 것이다.
- 🟡 **#5 [bo-api/.../controller/FoCodeController.java:31-34]** `GET /api/v1/fo/codes/{groupCode}`의 `@PathVariable String groupCode`가 무검증이다. `EMAIL_RECIPIENT` 그룹 호출 시 내부 담당자 실제 메일주소(`comksjc@ls-electric.com` 등)가 비인증으로 노출된다. — C, J / **Critical** — 🟡 **위험수용(2026-08-08)**: `#보안성상세분석`(java-security-reviewer + nextjs-security-reviewer + 세션 독립분석, curl/DB 실측 병행) 결과 사용자가 **이메일 노출 자체는 수정불필요(위험수용)로 확정**. 단, 같은 분석에서 확인된 아래 구조적 사실은 이메일 여부와 무관하게 별도로 유효하며 아직 미해결 상태:
  - `groupCode`에 화이트리스트가 전혀 없어 FO가 쓰지 않는 임의 그룹까지 응답됨 — 예: `LOGIN_LOCK_ENABLED`(→`Y`), `LOGIN_LOCK_MAX_ATTEMPTS`(→`5`) 로그인 잠금 정책값도 비인증 노출(curl 실측)
  - 동일 이메일이 코드 테이블이 아닌 무인증 `GET /api/v1/message-resources`로도 중복 노출됨 — `comwjj@ls-electric.com`, `comksjc@ls-electric.com` 등 curl 실측 확인(`MessageResourceController.java:22-23`에 `@PreAuthorize` 없음)
  - `code_group.is_active=false`로 비활성화한 그룹도 API가 그대로 응답 — `CodeDetailRepository`가 그룹 활성 여부를 확인하지 않음(`SALESCATEGORY` 실측 확인)
  이 3건은 "임의 groupCode 무제한 응답" 구조 자체의 문제로, 이메일과 무관하게 남아있는 이슈. → **#28**로 계속 추적.
- **#6 [bo-api/src/main/resources/application-{dev,developer,local}.yml]** Azure Blob **SAS 토큰 전문** + DB 비밀번호 + SMTP 비밀번호 + 암호화 키/IV가 평문으로 커밋되어 있다. — C, D / **Critical** — ⚠️ **2026-08-08 재분석 결과: 현재 디스크 상태에서는 재현되지 않음.** 4개 프로필 전수 확인 결과 DB/메일/Redis/Azure Blob SAS 모두 `${ENV:}`(빈 기본값) 형태이고, `application.yml:31`의 JWT는 `${JWT_SECRET}`으로 **기본값조차 없어 미설정 시 부팅 실패**하는 fail-closed 형태다. `application-local.yml`의 `${DB_PASSWORD:1234}`/`${MAIL_PASSWORD:test}`는 로컬 개발용 자리표시자로 실자산이 아니다. **단, 유일하게 남은 리터럴 기본값 1건(reCAPTCHA 시크릿)은 fail-open 구조라 별도 항목으로 승계** → **#27**. (git 이력은 이번 회차 판정 근거에서 제외했으므로 "과거에 커밋되었는지"는 이 문서에서 판단하지 않는다.)
- 패스 **#7 [fo/.env.local, fo/.gitignore:37]** `.gitignore`에 `.env*` 규칙이 있음에도 `.env.local`이 실제로 git 추적 중이다. 실 Google Maps API 키(bo-api와 동일 값) + reCAPTCHA **테스트 site key**가 커밋되어 있으며, 테스트키이므로 프로젝트 내 reCAPTCHA 방어가 전부 무력화된 상태다. — C, H / **Critical** — 패스(2026-08-08): `#보안성상세분석`(git 이력 제외, 현재 소스+실측)으로 Maps 키 무제한/reCAPTCHA 테스트시크릿 통과를 직접 재현 확인했으나 사용자가 패스로 확정
- ℹ️ **#8 [fo/src/app/layout.tsx:71-72, fo/src/components/layout/main/MainFooter.tsx:96]** 쿠키 동의값(`ls-cookie-consent`)의 유일한 소비처가 "배너 표시 여부"뿐이라, "Reject All"을 눌러도 실제 트래킹 스크립트 실행 흐름은 변하지 않는다. `daelimEUEM_*.js`가 `beforeInteractive`로 동의 이전에 무조건 로드되어 `jsessionid`/`remote_ip`/`xforwardedfor`/`coordinate`/`uri_query` 등을 `https://kafkarestapi.daelim.co.kr`로 전송한다. — J, H / **Critical** — ℹ️ **의도된 설계(2026-08-08, 사용자 확인)**: `#보안성상세분석` 실측(Claude in Chrome, localStorage 조작 전/후 네트워크 캡처) 결과 Reject All 클릭 전후 스크립트 로딩·전송이 동일하게 발생함을 확인. 이 동작은 **결함이 아니라 의도된 설계**임을 사용자가 확인함. 수정 대상 아님.
- **#9 [fo/package.json:22 (`next: 16.2.6`)]** `npm audit` 결과 high 5건. 그중 미들웨어 우회(GHSA-6gpp-xcg3-4w24)와 rewrites SSRF(GHSA-p9j2-gv94-2wf4)는 이 프로젝트가 실제로 사용하는 Turbopack + `src/middleware.ts` + `rewrites()` 프록시 구조와 정확히 겹친다. — H, I / **Critical** — ⚠️ **2026-08-08 재분석 결과: Info로 강등(→ #29).** 원 판정이 바로 "발동조건 확인 없이 CVE를 끼워맞춘" 사례였다. 개별 권고의 전제조건을 실측 대조한 결과 **적용되는 것이 하나도 없었다**(상세는 #29).

> 위 #1·#2는 동일 취약점의 코드 근거/실측 결과 쌍이다.

---

### Critical (2026-08-08 재분석 신규 — 재현 완료)

- 🔴 **#20 [bo-api/.../service/PageDataService.java:314-318 (누락 지점), :166-168 (정상 지점), controller/FoPageDataController.java:54-63]** **`/datetime-range` 경로에만 게시 게이트가 누락되어, 주소 끝에 단어 하나만 덧붙이면 미게시 콘텐츠가 전량 열린다.** — B / **Critical**
  - **시나리오**: BO 담당자가 기사를 "비공개(002)"로 저장하거나 발행일을 미래로 잡아 예약해 둔다. 정상 목록 API로는 안 보인다. 그런데 외부인이 주소 끝에 `/datetime-range`만 붙여 다시 요청하면 서버가 게시상태 검사를 건너뛰고 미게시 글을 제목·본문까지 응답한다. **로그인도 토큰도 필요 없다.**
  - **원인**: `searchInternal()`(`:166-168`)은 `FO_PUBLISH_GATED_SLUGS`에 대해 `FO_PUBLISH_GATE_SQL`을 붙이지만, 같은 파일의 `searchDatetimeRange()`(`:314-318`)에는 이 두 줄이 통째로 빠져 있다. 즉 #4에서 만든 게이트 자체는 정상이며 **네 번째 경로 하나만 적용에서 빠진 상태**다.
  - **재현(디스패처 직접 실측, 리뷰어와 독립적으로 동일 결과)**:
    ```
    GET /api/v1/fo/page-data/press-data?size=1                → totalElements 26
    GET /api/v1/fo/page-data/press-data/datetime-range?size=1 → totalElements 27   ← +1
    blog-data 22 vs 25 / articles-data 19 vs 22 / events-data 15 vs 17   (총 +9건)
    ```
  - **DB 교차검증(psql 실측)**: `SELECT count(*) FROM page_data WHERE data_slug='press-data'` → **27** (= datetime-range 응답과 일치, 정상 경로 26과 1건 차이). 새어나온 `id=2029`의 실제 값은 `"is_visible": "002"`(비공개), `"publish_dttm": "2026-07-23"`, `"title": "LS ELECTRIC Continues Winning Orders for U.S. Data Center Power Infrastructure."` — **테스트 더미가 아니라 실제 대외 보도자료**다.
  - **유출 9건의 성격 구분(과장 방지)**: press-data 1건(2029, 비공개) / blog-data 3건(2261·1905·1858, 비공개) / events-data 2건(2037 비공개, **1930은 게시일 2026-08-22로 아직 공개 시점이 오지 않은 예약 발표건**) — 여기까지는 실 콘텐츠. articles-data 3건(2289~2291)은 `ABCDE APPLE` 류 **테스트 입력물이라 보안 피해 없음**.
  - **정상 동작 확인(대조군)**: 상세(`:450-452`)와 인접글(`:505-507`)은 게이트가 정상이다(미게시 2029 상세 → 404). 서명 없는 `alg:none` 위조 previewToken도 404로 거부된다.
  - **참고**: FO 메인화면의 하이라이트 뉴스는 일반 검색 경로를 쓰므로 **화면에는 미게시 글이 뜨지 않는다.** 이 이슈는 API를 직접 호출했을 때만 성립한다.

---

### Warning (2026-08-08 재분석 — 전부 재현 완료)

- 🟡 **#21 [fo/src/app/preview/route.ts:15-16, 42]** **오픈 리다이렉트 — 방어코드가 있으나 백슬래시로 우회된다.** — E / **Warning**
  - **시나리오**: 공격자가 피싱 메일에 `https://<LS 공식도메인>/preview?token=x&redirect=/\evil.com` 링크를 넣는다. 피해자는 주소가 LS 공식 도메인이라 안심하고 클릭한다. fo가 곧바로 `http://evil.com/`으로 307 리다이렉트한다. 피해자는 LS 사이트를 거쳐 왔다는 이유로 가짜 페이지를 신뢰하게 된다.
  - **원인**: `redirectParam.startsWith("/") && !redirectParam.startsWith("//")` 검사가 `//`만 막는다. WHATWG URL 파서는 http(s) 같은 special scheme에서 백슬래시를 슬래시와 동일 취급하므로 `/\evil.com`이 검사를 통과한 뒤 `new URL()`에서 호스트가 `evil.com`으로 재해석된다.
  - **재현(디스패처 직접 실측)**:
    ```
    redirect=%2F%5Cevil.com  → location: http://evil.com/            ← 우회 성공
    redirect=%2F%2Fevil.com  → location: http://localhost:3002/main  ← 기존 방어 정상(대조군)
    redirect=%2Fcompany%2Fpress → location: http://localhost:3002/company/press (대조군)
    ```
    리뷰어는 `/\\evil.com`, `/\t//evil.com` 변형도 동일하게 성공함을 확인했다.
  - **영향 범위(과장 방지)**: RCE도 데이터 유출도 아니다. **피싱 신뢰도 세탁이 전부다.** 다만 인증 없이 누구나 호출 가능하고, 개발자가 막으려고 넣은 방어가 실제로 뚫린다는 점에서 명백한 결함이다. `/preview`는 배너 프리뷰 쿠키를 심는 경로라 메인 비주얼 체인에 직접 연결된다.

- 🟡 **#22 [bo-api/.../PageDataService.java:244-245, :265, :267-269 및 :386-387, :407 / fo/src/lib/pageData.ts:75-85]** **공개 목록 API가 BO 관리자 실명과 소속 협력사명을 그대로 반환한다.** — C, J / **Warning**
  - **시나리오**: 로그인 없이 보도자료 목록 API를 부르면 각 글마다 `createdBy`/`updatedBy`에 콘텐츠를 등록한 **직원 실명과 소속(협력사명 포함)** 이 붙어 온다. 외부인이 슬러그 4종만 훑어도 담당자 명단과 협력 벤더를 확보해 표적 피싱·사칭 메일의 재료로 쓸 수 있다.
  - **원인**: `PageDataService`가 SELECT에 `created_by, updated_by`를 포함한 뒤 `buildUserNameMap(rows, 4, 6)`으로 **admin 테이블을 조인해 ID를 실명으로 치환**하고 그대로 응답에 싣는다. `searchDatetimeRange`도 동일 구조.
  - **재현(디스패처 직접 실측)**:
    ```
    curl "http://localhost:8080/api/v1/fo/page-data/press-data?size=3" -H "X-Site-Id: 1"
      → "createdBy":"김수정 (베이직인터내셔널)" , "createdBy":"장성주 (베이직인터내셔널)"
    (대조군) curl ".../press-data/2262"  → "createdBy":"21"   ← 상세 API는 치환하지 않음
    ```
    리뷰어의 4개 슬러그 전수 조사 결과 중복 제거 **실명 8건**(곽현수(LS ITC) / 김수정 / 박진주 / 백승훈 / 장성주 / 최은영 등). 전시용 더미가 아니라 실제 BO 계정 보유자 이름이다.
  - **범위 한정(과장 방지)**: **`/main` 페이지 HTML에는 유출되지 않는다**(`curl /main | grep createdBy` → 0건). 프론트가 화면용 필드만 골라 매핑하기 때문이며 RSC over-fetch는 **아니다.** 문제는 rewrite로 열려 있는 API를 직접 때렸을 때다. 노출되는 건 이름뿐이고 이메일/연락처는 없다. **목록 API 2곳(`searchInternal`, `searchDatetimeRange`)만의 문제**이며 상세 API는 정상이다.

- 🟡 **#23 [bo-api/.../PageDataService.java:476-490, controller/FoPageDataController.java:87-94]** **조회수를 누구나 무제한으로 올릴 수 있다.** — B, F, I / **Warning**
  - **시나리오**: 조회수 증가 API에 인증·중복방지·게시상태 확인이 전혀 없다. 명령 한 줄을 반복하면 특정 기사 조회수를 원하는 만큼 부풀릴 수 있어 "인기 콘텐츠" 정렬·통계가 오염되고, 동시에 인증 없는 무제한 UPDATE 경로가 되어 DB 부하를 만든다.
  - **재현(디스패처 직접 실측)**:
    ```
    GET  .../fo/page-data/press-data/2262            → "count":22
    POST .../fo/page-data/press-data/2262/view-count × 3회 → 전부 204
    GET  .../fo/page-data/press-data/2262            → "count":25   ← 정확히 +3
    ```
  - **원인**: WHERE 조건이 `data_slug`, `id`, `siteId`뿐이고 게시 게이트도 슬러그 제한도 없다.

- 🟡 **#24 [bo-api/.../security/LoginRateLimitFilter.java:29-41, SecurityConfig.java:51,164-165 / NewsletterInsightsService.java:35-49 / MailService.java:33 / NewsletterInsightsRequest.java / fo MainFooter.tsx:136-168]** **FO 전 경로에 요청 제한이 없고, 뉴스레터 신청 1건이 서버 스레드를 21초 붙잡는다.** — F, I / **Warning**
  - **시나리오**: 뉴스레터 구독 폼은 로그인도 캡차도 없이 누구나 호출할 수 있고, 서버는 요청을 받은 즉시 **그 자리에서(비동기 아님) SMTP 발송을 시도**한 뒤에야 응답한다. 공격자가 이 요청을 다수 동시에 던지면 톰캣 작업 스레드가 메일 발송 대기에 묶여 FO 메인화면의 다른 API까지 함께 느려진다. 부수적으로 매 요청마다 메일 발송이력 행이 쌓이고 담당자 메일함에 스팸이 무한히 들어간다.
  - **원인**: Rate Limit 필터가 `POST /api/v1/auth/login` **하나만** 대상으로 하고 나머지는 즉시 통과시킨다 → FO 9개 엔드포인트 전부 무제한. `NewsletterInsightsService.send()`가 `@Async` 없이 `mailService.sendMail(...)`을 동기 호출한다. `NewsletterInsightsRequest`에는 **reCAPTCHA 필드가 아예 없다** — 같은 FO 폼인 `TrainingRequestSubmitRequest`/`TrainingRegistrationRequest`는 reCAPTCHA를 쓰고 `RecaptchaService:37-55`가 서버측 siteverify로 제대로 검증하는데 **뉴스레터만 빠져 있다.**
  - **재현(디스패처 직접 실측)**:
    ```
    POST /api/v1/fo/newsletter/insights × 2회 → call1 code=201 time=21.051s / call2 code=201 time=21.053s
    (대조군) GET /api/v1/fo/popup → code=200 time=0.0046s
    429·차단 일절 없음.
    ```
    리뷰어들의 20건+ 연속 호출에서도 전부 201, 차단 없음.
  - **사실 구분(과장 방지)**: 발송 대상은 **사내 수신자(공통코드 EMAIL_RECIPIENT/NEWSLETTER)** 이며 **제3자에게 스팸을 보내는 구조가 아니다.** 메일 본문은 `HtmlUtils.htmlEscape` 처리되어 메일 HTML 인젝션은 성립하지 않는다. 서버측 `@Email`/`@Size` 검증은 정상 동작한다(형식 오류 → 400 실측). **21초 지연은 로컬 메일서버 도달 실패 때문일 가능성이 크며 운영에서도 21초라고 단정하지 않는다** — 다만 "요청 1건이 스레드를 붙잡는 동기 발송 + 제한 없음" 조합 자체는 그대로다.
  - 관련: `GlobalExceptionHandler`가 4xx마다 `errorLogService.saveAsync(...)`로 error_log 행을 INSERT하므로, 제한 없는 FO 경로와 결합되면 오류로그 테이블이 무제한 증가한다.

- 🟡 **#25 [bo-api/.../TransactionLogFilter.java:36-39]** **뉴스레터 구독자 이메일이 감사로그 테이블에 평문으로 적재된다.** — J / **Warning** (기존 #18 재확인 — 이번 회차에 직접 재현)
  - **재현(디스패처 직접 psql 실측)**: `#24` 검증용으로 보낸 요청 2건이 그대로 남아 있었다.
    ```
    SELECT request_url, request_body FROM transaction_log WHERE request_body ILIKE '%dispatcher-verify%';
      /api/v1/fo/newsletter/insights | {"email":"dispatcher-verify-1@example.com","areasOfInterest":"test"}
      /api/v1/fo/newsletter/insights | {"email":"dispatcher-verify-2@example.com","areasOfInterest":"test"}
    ```
  - **원인**: `/api/v1/auth/` 외 전 POST 본문이 무마스킹 적재된다. 실제 구독자가 입력한 이메일도 동일하게 평문 저장된다.

- 🟡 **#26 [fo/proxy.ts:64-93 (미실행) vs fo/src/middleware.ts:1-21 (실제 동작)]** **작성된 보안 로직이 런타임에 한 줄도 실행되지 않는다 + CSP가 사실상 부재하다.** — D / **Warning** (기존 #15·#16 통합 재확인)
  - **시나리오**: 루트 `proxy.ts`에 (a) AppScan 대응 XSS 패턴 차단 (b) 허용 메서드 제한 (c) 보안 헤더 재설정이 구현되어 있다. 그런데 이 프로젝트는 `src/` 구조라 라우팅 미들웨어는 `src/middleware.ts`가 잡고, **루트 `proxy.ts`는 Next.js에 로드되지 않는다.** 즉 코드만 보면 방어가 있는 것처럼 오독되지만 런타임에는 없다.
  - **재현(디스패처 직접 실측)**:
    ```
    GET  "http://localhost:3002/?q=%3Cscript%3E" → 404   (proxy.ts가 살아있다면 400이어야 함)
    POST "http://localhost:3002/"                → 404   (동일)
    ```
  - **CSP 실측**: 응답 헤더가 `Content-Security-Policy: frame-ancestors 'self'` **하나뿐**이고 `script-src`/`object-src`/`default-src`가 없다. `Permissions-Policy`도 없다. 반면 `X-Content-Type-Options: nosniff`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Frame-Options: SAMEORIGIN`은 정상 적용됨을 확인했다.
  - **사실 구분(과장 방지)**: 이건 **"XSS가 있다"는 뜻이 아니다.** 메인화면 전 구간에서 XSS 싱크를 찾지 못했다. CSP는 심층방어 누락으로만 보고한다.

- 🟡 **#27 [bo-api/src/main/resources/application-{dev,developer,local}.yml:93/92/80]** **reCAPTCHA 시크릿만 유일하게 fail-open 기본값을 갖는다.** — C, F / **Warning** (#6에서 승계)
  - **현재 디스크 상태 실측**: `recapchaKey: ${RECAPTCHA_SECRET:6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe}` — 이 값은 **Google이 공개한 reCAPTCHA 테스트용 시크릿**이라 그 자체가 유출 자산은 아니다(테스트 데이터를 유출로 과장하지 않는다).
  - **진짜 문제는 fail-open 구조다**: 다른 시크릿(DB/메일/Redis/Azure Blob SAS)은 전부 `${ENV:}`로 빈 기본값이라 미주입 시 기능이 죽는 fail-closed인데, **reCAPTCHA만 테스트 시크릿이 기본값으로 박혀 있어** `RECAPTCHA_SECRET` 환경변수가 운영에 주입되지 않으면 **캡차가 조용히 전부 통과된다.** Training Request 등 reCAPTCHA를 쓰는 폼의 봇 방어가 통째로 무력화된다.
  - **미확정 부분(정직한 표기)**: 운영 환경에 `RECAPTCHA_SECRET`이 실제로 주입되어 있는지는 이 환경에서 확인할 수 없다. 따라서 "지금 운영이 뚫려 있다"고 단정하지 않으며 Critical로 올리지 않는다.

---

### Info (2026-08-08 재분석)

- ℹ️ **#28 [bo-api/.../FoCodeController.java:31-34, CodeService.java:47-48, CodeDetailRepository.java:21, entity/CodeGroup.java:40-42]** `codes/{groupCode}` 화이트리스트 부재 + 그룹 활성 게이트 부재 (#5의 잔여 구조 이슈). — B / **Info**
  - 임의 그룹코드가 전부 200으로 응답됨을 재현(`BUSINESSTYPE`/`COUNTRY`/`INQUIRY_TYPE`/`BLOGCATEGORY`/`PRODUCTCATEGORY`/`TRAININGTYPE` 등). **다만 응답 내용은 전부 화면 표시용 라벨(전시 데이터)이라 그 자체로는 피해가 없다.** 실제 내부 메일주소가 나오는 `EMAIL_RECIPIENT`는 **사용자 위험수용 확정 항목**이라 새 이슈로 올리지 않는다.
  - `findAllByGroup_GroupCodeAndActiveTrueOrderBySortOrderAsc`가 `CodeDetail.active`만 보고 `CodeGroup.is_active`는 검사하지 않는다 — **코드근거만 있고 이번 회차에서 비활성 그룹 실재를 재확인하지 못해 미재현으로 표기한다.**
- ℹ️ **#29 [fo/package.json:22 (`next: 16.2.6`)]** 알려진 High 권고가 존재하나 **이 코드에서 발동하는 경로를 하나도 찾지 못했다.** — H, I / **Info** (기존 #9에서 강등)
  - 권고별 전제조건 실측 대조: Server Actions 계열(DoS/SSRF/Edge payload/함수노출) → `'use server'` **0건**(디스패처 직접 확인). Turbopack + single locale 미들웨어 우회 → `next.config.ts`에 **i18n 설정 0건**(디스패처 직접 확인). rewrites destination SSRF → destination 호스트가 `API_PROXY_TARGET` env 고정값이고 요청값 개입 지점 없음. Image Optimization SVG DoS → `dangerouslyAllowSVG` 미설정, `/_next/image?url=...svg` → **400**. `x-middleware-subrequest`(CVE-2025-29927류) → 헤더 삽입 요청 200 정상, 우회할 인가 로직 자체가 없음(`src/middleware.ts`는 `x-pathname`/`x-search` 주입 전용).
  - 캐시 혼동 권고 2건만 `UNPROVEN`(해당 버전대이나 fo 경로에서 재현 실패) → 매트릭스 1의 10번 행 I열이 UNPROVEN인 이유.
  - **결론**: "취약한 버전을 쓰고 있다"는 사실은 맞으므로 H열은 FAIL로 두되, **심각도는 Info**이며 정기 의존성 최신화 대상으로만 관리하면 된다.
- ℹ️ **#30 [bo-api/.../PageFileService.java:172-192, FoPageFileController.java:48-54]** `page-files/{id}` 게시게이트/IDOR — **재현 시도했으나 실패(UNPROVEN).** — B, D, G / **Info**
  - 코드상 `validateSiteAccess()`는 `siteId == null`이면 아무 검사 없이 return하고, siteId가 있어도 사이트 일치만 볼 뿐 게시상태는 보지 않는다. 구조적으로는 ID 순차 대입 경로다.
  - 그러나 이 환경은 `file-storage: local`이고 디스크에 실제 파일이 거의 없어 **id 1~1200 전수 프로빙 결과 전건 404**(팝업 API가 참조하는 611번도 404 — DB 행은 있으나 파일 부재)였다. **실제 파일 유출을 한 건도 재현하지 못했으므로 Critical/Warning으로 올리지 않는다.** 파일이 실재하는 서버에서 재검증이 필요하다.
  - 같은 컨트롤러가 업로드 시 저장된 `mimeType`을 그대로 `Content-Type`에 싣고 `inline`으로 내려주므로 관리자가 HTML/SVG를 올리면 API 오리진에서 실행될 여지가 있으나, **관리자 업로드 권한이 선행 조건**이고 재현 불가라 Info로만 둔다.
- ℹ️ **#31 [fo/src/app/main/components/mainVisualData.ts:30]** `fetchMediaMimeType`이 공통 `fetchApi()`를 우회해 직접 `fetch()`를 호출한다 — 프로젝트 기준선 이탈. **다만 URL이 env 고정 base + 숫자 mediaId라 SSRF는 성립하지 않는다.** 규약 준수 차원의 지적. — D / **Info**
- ℹ️ **#32 [fo/next.config.ts]** `images.unsplash.com` remotePattern이 소스 어디에서도 사용되지 않는다(`grep unsplash src/` → 0건)인데 `/_next/image?url=https://images.unsplash.com/...`는 200으로 동작한다. 안 쓰는 외부 출처는 제거하는 편이 깔끔하다. — D / **Info**
- ℹ️ **hero-data 게시기간 필터 부재**: `/page-data/hero-data` → 8건, `/datetime-range?drs_post_period=in_range` → 3건. 화면은 후자를 쓰므로 표시상 문제는 없고, 새어나오는 건 **전시용 배너 문구/이미지ID**뿐이다. `hero-data`는 `FO_PUBLISH_GATED_SLUGS` 대상이 아니다. **보안 이슈로 취급하지 않는다.**
- ℹ️ **`GET /api/v1/message-resources`(permitAll)** 가 비로그인에게 `createdBy:"comjsjc"` 같은 BO 관리자 로그인 ID를 노출한다. FO 9종에 포함되지 않고 fo 소스에서 호출하지도 않아 **범위 밖 — 미분석**으로 남긴다.

---

### 기존 항목 재검증 결과 (2026-08-08) — 철회·강등 내역

| 기존 # | 원 판정 | 재검증 결과 | 근거 |
|---|---|---|---|
| #6 | Critical (yml 시크릿 평문) | **현재 디스크 기준 재현 안 됨** — reCAPTCHA fail-open만 #27로 승계 | 4개 프로필 전수 확인, 전부 `${ENV:}` |
| #9 | Critical (next CVE 정확히 겹침) | **Info로 강등(#29)** — 권고별 전제조건 전부 미충족 | `'use server'` 0건 / i18n 0건 / SVG 400 실측 |
| #10 | Warning (X-Site-Id 생략 시 전 사이트 유출) | **철회 — 재현 실패** | 헤더 생략 26 / `X-Site-Id:1` 26 / `X-Site-Id:2` 0. DB에 `site_id`는 1(546행)과 NULL(177행)뿐이라 **교차 사이트 유출을 증명할 두 번째 사이트 자체가 없다.** 코드상 `siteId==null`이면 필터를 안 붙이는 건 사실이나 **실제 유출을 재현하지 못했으므로 Warning으로 두지 않는다.** |
| #11 | Warning (page-files IDOR) | **UNPROVEN으로 강등(#30)** | id 1~1200 전건 404 |
| #12 | Warning (업로드 MIME inline XSS) | **Info로 강등(#30에 병합)** | 관리자 업로드 권한 선행, 재현 불가 |
| #13 | Warning (뉴스레터 봇방어 부재) | **유지 — #24로 재현 완료** | 연속 POST 전부 201 |
| #14 | Warning (size 상한/unpaged) | **Info로 강등** | `size=100000` 요청해도 데이터가 26건뿐이라 DoS 규모를 재현할 수 없음. 구조적 사실만 유효 |
| #15 | Warning (proxy.ts 죽은 코드) | **유지 — #26으로 재현 완료** | `POST /` → 400 아닌 404 |
| #16 | Warning (CSP 미흡) | **유지 — #26으로 재현 완료** | 응답 헤더 실측 |
| #17 | Warning (JSESSIONID JSON 반환) | **철회** | 반환값은 **요청자 본인의 헤더**라 타인 세션 유출이 아니다. `application/json` + `nosniff`로 XSS도 성립하지 않는다. bo-api는 STATELESS라 값 자체가 빈 값이다 |
| #18 | Warning (로그 무마스킹) | **유지 — #25로 재현 완료** | transaction_log psql 실측 |
| #19 | Info (x-pathname 스머글링) | **범위 밖 유지** | `/main`에 소비처 없음 |

---

### 양호 확인 항목 (2026-08-08 재현으로 확인)

- **SQL 인젝션 방어가 실제로 견고하다.** `appendWhereConditions()`가 모든 필드키를 `[a-zA-Z0-9_]+`/`isValidSegments()`로 통과시킨 뒤에만 SQL에 조립하고 값은 전부 named parameter 바인딩. `sort`, `adjacent`의 `sortField/titleField`도 동일. **키 인용부호 삽입 / `sort=id) ;DROP…` / `sort=a'||(select current_user)||'` / `eq_a'||'b` / `in_a=1),(select 1)--` / `%' OR '1'='1` / `condexpr_` 7종 직접 시도 → 전부 400 또는 무시.**
- **하이라이트 뉴스 게시 게이트가 정상 경로에서 확실히 강제된다** — press-data 26건 전부 `is_visible=001` + `publish_dttm ≤ 오늘`. 우회 시도 `eq_is_visible=002` → 0건, `publish_dttm_gte=2026-09-01` → 0건. (단 `/datetime-range` 경로 누락은 #20)
- **CSRF가 Origin 검증으로 실제 차단된다** — `Origin: https://evil.com`으로 뉴스레터 POST 시 `application/json`, `text/plain`(simple request 우회 시도) **둘 다 403**. GET도 403.
- **CORS 화이트리스트에 와일드카드 없음** — `Origin: https://evil.example.com` GET/OPTIONS 모두 403 실측.
- **배너 프리뷰가 클라이언트 쿠키만 믿지 않는다** — 쿠키의 `recordId`를 bo-api `preview-tokens/verify`로 토큰·slug·recordId 3중 바인딩 검증. 위조 토큰 → `{"valid":false}`. `alg:none` 위조 토큰도 거부(`JwtTokenProvider:90-100`이 `verifyWith(getSigningKey())` 사용).
- **메인화면 전 구간에 `dangerouslySetInnerHTML` 0건, Server Action 0건, 방문자 입력이 서버 렌더에 섞이는 지점 0건.**
- **보안 헤더 6종이 실제 응답에 적용** — HSTS, nosniff, X-Frame-Options, Referrer-Policy, COOP, CORP (fo) / nosniff, X-Frame-Options: DENY (bo-api).
- 오류 응답에 스택트레이스·내부 경로 노출 없음. `?sortField=<script>alert(1)</script>` 반사도 `application/json` + `nosniff`라 브라우저 실행 불가 — **XSS로 보고하지 않는다.**
- YouTube 임베드가 `youtube-nocookie` + `postMessage` origin 화이트리스트 검증. 검색어는 `encodeURIComponent` 인코딩 + 목적지 경로 접두 고정.
- 뉴스레터 메일 본문 `HtmlUtils.htmlEscape` 적용, 수신자 주소가 서버측 코드테이블 고정값이라 SMTP 헤더 인젝션·SSRF 없음.
- `X-Site-Id`에 비숫자/오버플로 값 투입 시 스택트레이스 없이 400으로 정리되고, 미존재·비활성 사이트를 200/빈값으로 동일 처리해 사이트 ID 열거 차단.
- **Spring Security 6.5.0 CVE-2025-41248 → 해당 없음.** 발동조건인 "제네릭 상위 타입에 선언된 `@PreAuthorize`"가 bo-api에 존재하지 않고, FO 9개 엔드포인트는 애초에 `@PreAuthorize`를 쓰지 않는다.

---

### UNPROVEN (재현 실패 — 확정 불가)

`page-files` 실제 파일 유출(#30, 로컬에 파일 실체 없음) / `CodeGroup.is_active=false` 그룹 실재 확인(#28) / next 캐시 혼동 권고 2건(#29) / 운영 `RECAPTCHA_SECRET` 주입 여부(#27) / 운영 `API_PROXY_TARGET` 오염 가능성 / 운영 CDN 캐시 정책 / `daelimEUEM_run.js`(난독화 124KB) 전체 동작 / 인프라 레벨 rate limit(WAF·API GW) 존재 여부 / Download Center 범위(별도 점검 필요)

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-07 | 최초 작성 — security-review-dispatcher(nextjs-security-reviewer + java-security-reviewer) 점검 결과 반영, Critical 4건 실측 재확인 |
| 2026-08-08 | #4(하이라이트 뉴스 게시게이트 클라이언트단 우회) 수정 완료 확인 — bo-api 재기동 후 실측 재검증(리스트/상세/adjacent 3경로 + 구버전 우회파라미터 무효화) |
| 2026-08-08 | #5(FO codes API groupCode 무검증) `#보안성상세분석` 진행 — 이메일 노출 자체는 사용자 위험수용 확정. 단 화이트리스트 부재/message-resources 중복노출/비활성그룹 무시 3건은 미해결로 남김 |
| 2026-08-08 | #8(쿠키 동의 미작동) `#보안성상세분석` 진행 — Claude in Chrome 실측으로 동작 재확인. 사용자가 **의도된 설계**로 확정, 수정 대상 아님 |
| 2026-08-08 | #1·#2(page-data slug 화이트리스트) `#보안성상세분석` 진행 — 원 판정 근거가 실제로는 성립하지 않음을 확인. 사용자가 **패스**로 확정 |
| 2026-08-08 | #3(뉴스레터 이메일 노출) 상세분석 없이 사용자가 **패스**로 확정 |
| 2026-08-08 | #7(.env.local 커밋) `#보안성상세분석` 진행 — 사용자가 **패스**로 확정 |
| **2026-08-08** | **전체 재분석(`#보안성검토`) — 매트릭스 1(10구성단위) + 매트릭스 2(9엔드포인트) 총 190셀을 처음부터 재판정.** git 이력 근거 전면 배제, Critical/Warning은 curl·psql 실측 재현한 것만 인정. 결과: **신규 Critical 1건(#20 `/datetime-range` 게시게이트 누락)**, Warning 7건(#21~#27), Info 5건(#28~#32). 기존 Warning 2건 철회(#10 X-Site-Id·#17 JSESSIONID), 기존 Critical 1건 Info 강등(#9→#29), #6은 현재 디스크 기준 재현 안 됨(#27로 일부 승계). 매트릭스1의 5번 행 대상파일 매핑 오류(`pressData.ts`→`highlightNews/highlightNewsData.ts`) 정정 |
