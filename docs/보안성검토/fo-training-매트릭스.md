# FO Training 페이지 보안성검토 매트릭스

> 작성일: 2026-08-08 / **전체 재분석: 2026-08-09**
> 대상: fo(북미 홈페이지) Training 관련 FO 메뉴 4개 그룹 + 해당 화면이 호출하는 bo-api 엔드포인트
> 범위 확정: DB `menu` 테이블 조회로 확정된 5개 메뉴 항목(id 86 / 121 / 223 / 224 / 178). 이 중 id=121은 id=86과 url이 완전히 동일한 중복 메뉴 항목이므로 같은 소스 파일로 커버되어 별도 행을 두지 않는다. BO 관리자측 Training 관리 화면은 이번 범위에서 제외.
> 체크리스트 카테고리(A~J)는 `docs/보안성검토/ckecklist.md`(fo 보안성검토 체크리스트)와 동일한 분류 체계를 그대로 사용한다.
> 표기: `PASS`(이상없음) / `FAIL`(이 문서 신규 이슈 발견, 상세는 "발견 이슈" 섹션에) / `승계(#n)`(`fo-메인화면-매트릭스.md`에서 이미 추적/판정된 것과 **동일 근본원인** — 사실만 인용하고 이 문서 집계에는 포함하지 않음) / `N/A`(해당사항 없음) / `UNPROVEN`(재현 실패) / `-`(미분석)

---

## ⚠️ 판정 원칙

### 기본 원칙 (`fo-메인화면-매트릭스.md`에서 승계 — 이 프로젝트 보안성검토 표준)

1. **git 명령어(log/show/blame/ls-files) 결과는 근거로 인정하지 않는다.** 오직 (a) 현재 디스크의 소스 내용, (b) 실제 실행 결과(curl / psql 실측)만 근거다.
2. **Critical/Warning은 실제로 재현한 것만.** 재현 못 하면 `UNPROVEN` 또는 Info로 강등하고, 강등 사실을 명시한다.
3. **테스트/더미/전시용 데이터와 실데이터를 반드시 구분해 서술한다.**
4. 리뷰어(`java-security-reviewer`, `nextjs-security-reviewer`) 정의 파일의 **"4-3. 준수사항"** 블록을 프롬프트에 명시적으로 재주지시한다.
5. **판단(editorializing) 금지.** 발견한 사실·근거·심각도 분류까지만 기록하고, "고쳐야 한다/결함이다"라는 판단은 문서에 넣지 않는다(사용자 몫).

### 2026-08-09 재분석에서 추가로 강제한 원칙

초판(2026-08-08)이 테스트/개발 환경 특성을 감안하지 않고 심각도를 과하게 매겼다는 지적에 따라 아래 2가지를 추가 강제하고 40셀 전체를 재판정했다.

6. **타 매트릭스 문서와 동일 근본원인이면 이 문서 집계에서 제외한다.** `fo-메인화면-매트릭스.md`에서 이미 사용자가 패스/위험수용/의도된설계로 확정했거나 이미 별도 번호로 추적 중인 항목과 근본원인이 같으면, "Training 범위에서도 동일하게 성립한다"는 사실만 인용하고 이 문서의 Critical/Warning/Info 신규 집계에 중복 포함하지 않는다. 매트릭스 표에는 `승계(#n)`으로 표기한다.
7. **reCAPTCHA가 정상 키로 동작하는 상태를 기준으로 재평가한다.** 이 프로젝트의 reCAPTCHA 키(FO site key / BO secret)가 Google 공식 테스트 키쌍인 것은 `fo-메인화면-매트릭스.md` #7(패스 확정) / #27(별도 추적)의 사안이며, 운영 배포에서 실키로 교체된다는 전제로 판단한다. 따라서 "테스트 키라서 캡차가 통과된다"를 전제로 성립하던 파생 이슈(무제한 자동화 남용 등)는 그 전제를 제거하고 다시 계산한다.
   - Google reCAPTCHA v2 토큰은 1회용이라, 실키 환경에서는 동일 토큰 재사용으로 스크립트 반복 전송이 성립하지 않는다.
   - reCAPTCHA 상태와 **무관하게 그대로 남는 사실**(예: 동기 메일 발송으로 인한 스레드 점유, 중복 제출 판정 부재)은 그대로 유지한다.

---

## 매트릭스 — 메뉴 × 카테고리 A~J

| 메뉴 | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| Engineering Training | FAIL(T-20) | FAIL(T-1,T-14,T-15) | FAIL(T-16) / 승계(#22,#1,#2,#7) | FAIL(T-17) / 승계(#26) | PASS | FAIL(T-4,T-13,T-14) / 승계(#7,#27) | 승계(#30) | 승계(#29) | FAIL(T-7) / ✅T-12 | FAIL(T-19) / 승계(#1,#2) |
| Sales Training | FAIL(T-20) | FAIL(T-1,T-14,T-15) | FAIL(T-16) / 승계(#22,#1,#2,#7) | FAIL(T-17) / 승계(#26) | PASS | FAIL(T-4,T-13,T-14) / 승계(#7,#27) | 승계(#30) | 승계(#29) | FAIL(T-7) / ✅T-12 | FAIL(T-19) / 승계(#1,#2) |
| Service Training | FAIL(T-20) | FAIL(T-1,T-14,T-15) | FAIL(T-16) / 승계(#22,#1,#2,#7) | FAIL(T-17) / 승계(#26) | PASS | FAIL(T-4,T-13,T-14) / 승계(#7,#27) | 승계(#30) | 승계(#29) | FAIL(T-7) / ✅T-12 | FAIL(T-19) / 승계(#1,#2) |
| Training Request | FAIL(T-6) | PASS | FAIL(T-9) / 승계(#7) | FAIL(T-17) / 승계(#26) | PASS | FAIL(T-4,T-13) / 승계(#7,#27) | N/A | 승계(#29) | PASS(✅T-12) | FAIL(T-19) |

**집계: 총 40셀 — PASS 6 / FAIL 26 / 승계전용 7 / N/A 1 / UNPROVEN 0**
> (2026-08-09 T-12 수정 반영: Training Request의 I셀이 T-12 단독이었으므로 PASS로 전환. Eng/Sales/Service의 I셀은 T-7(Info)이 남아 FAIL 유지)

> Engineering / Sales / Service 3개 메뉴는 소스가 100% 공유(라우트 prefix와 `training_course` 코드 01/02/03만 다름)이므로 A~J 판정이 전부 동일하다.
> `FAIL` 셀은 "그 카테고리에서 이 문서 기준 신규로 기록할 사실이 발견됨"을 의미하며, 심각도는 아래 "발견 이슈"의 분류를 따른다. **FAIL 26셀 중 Warning 항목이 걸린 셀은 7셀**(Eng/Sales/Service의 B·F 각 2셀 + Training Request의 F 1셀)**이고 나머지 19셀은 전부 Info다.** (T-12 수정으로 I셀 4개에서 Warning이 해소됨 — Eng/Sales/Service는 T-7(Info)만 남아 FAIL 유지, Training Request는 PASS 전환)
> `승계` 표기는 `fo-메인화면-매트릭스.md`의 해당 번호에서 이미 판정·추적 중인 사안이며, Training 범위에서도 동일하게 성립한다는 사실만 기록한 것이다.

### 심각도 집계 (이 문서 신규 분)

| 심각도 | 건수 | 항목 |
|---|---|---|
| **Critical** | **0건** | — |
| Warning | 3건 (미해결 2건) | T-1, T-4(부분 수정 — Rate Limit 미적용 잔존), ~~T-12~~ ✅수정 완료(2026-08-09) |
| Info | 10건 | T-6, T-7, T-9, T-13, T-14, T-15, T-16, T-17, T-19, T-20 |
| 승계(집계 제외) | 7건 | T-2(→#1·#2) / T-3(→#7·#27) / T-5(→#7) / T-8(→#22) / T-10(→#26) / T-11(→#29) / T-21(→#30) |
| 철회 | 1건 | T-18 (재현 불가 — `fo-메인화면-매트릭스.md` #10과 동일 사유) |

---

## 대상 메뉴 / 경로 / 소스 파일

| menu id | 메뉴 | URL | 소스 파일 |
|---|---|---|---|
| 86, 121 | Engineering Training | `/services/engineering-training` | `fo/src/app/services/engineering-training/page.tsx`, `[courseId]/page.tsx`, `[courseId]/[sessionId]/page.tsx` |
| 223 | Sales Training | `/services/sales-training` | `fo/src/app/services/sales-training/page.tsx`, `[courseId]/page.tsx`, `[courseId]/[sessionId]/page.tsx` |
| 224 | Service Training | `/services/service-training` | `fo/src/app/services/service-training/page.tsx`, `[courseId]/page.tsx`, `[courseId]/[sessionId]/page.tsx` |
| 178 | Training Request | `/services/request-for-training` | `fo/src/app/services/request-for-training/{page,step-2/page,step-3/page,step-4/page,layout}.tsx`, `components/**`(20개), `data/requestForTrainingCodes.ts`, `fo/src/lib/training/trainingRequestSubmit.ts` |

> id=121은 id=86과 url이 동일한 중복 메뉴 항목이다(같은 소스 파일 → 함께 커버됨).
> Engineering / Sales / Service Training 3개는 라우트만 다르고 동일한 공통 컴포넌트·데이터 레이어를 공유한다:
> - 공통 컴포넌트: `fo/src/app/services/training/components/**`(15개 — TrainingCard, TrainingCurriculum(Page), TrainingDetail(Hero|Page|Schedule|Session), TrainingSession(Countdown|Detail|DetailAside|DetailForm|DetailTableScroll|LocationMap|Page), TrainingTitle)
> - 공통 데이터: `fo/src/app/services/training/data/**`(trainingContent.ts, trainingData.ts, trainingDetailData.ts, trainingRegistrationData.ts)

## 대상 bo-api 엔드포인트 (fo 소스 추적으로 확정)

| 엔드포인트 | 호출 지점 | 사용 메뉴 |
|---|---|---|
| `GET /api/v1/fo/training/curriculum-by-category` | `training/data/trainingData.ts:214-215` | Eng / Sales / Service |
| `GET /api/v1/fo/codes/{groupCode}` (PRODUCTCATEGORY / TRAININGTYPE / BUSINESSTYPE 등) | `trainingData.ts:163`, `trainingDetailData.ts:37`, `trainingRegistrationData.ts:33`, `request-for-training/data/requestForTrainingCodes.ts:22` | 전체 |
| `GET /api/v1/fo/page-files/{mediaId}` | `trainingData.ts:13` | Eng / Sales / Service |
| `GET /api/v1/fo/page-data/{slug}` 계열 | `trainingDetailData.ts:450-464` (`fetchData`) | Eng / Sales / Service |
| `POST /api/v1/fo/training/registrations` | `trainingRegistrationData.ts:39-40` | Eng / Sales / Service (세션 상세 신청 폼) |
| `POST /api/v1/fo/training/requests` | `fo/src/lib/training/trainingRequestSubmit.ts:60` | Training Request |
| `GET /api/v1/fo/training/product-tree`, `GET /api/v1/fo/training/product-names` | `FoTrainingController.java:69,81` (제품 선택기) | Training Request |

> 서버측 구현: `bo-api/src/main/java/com/ge/bo/controller/FoTrainingController.java`, `TrainingRegistrationController.java`, `service/FoTrainingService.java`, `TrainingRequestService.java`, `TrainingRegistrationService.java`, `entity/TrainingRequest.java`, `entity/TrainingRegistration.java`

## 카테고리(A~J) 정의

`docs/보안성검토/ckecklist.md`와 동일 (fo 일반 체크리스트 30개 세부항목 참조).
A.인젝션/XSS · B.인증/인가(IDOR) · C.민감정보 노출 · D.SSRF/프록시/헤더/CSP · E.오픈리다이렉트/CSRF/클릭재킹 · F.폼입력검증/봇방어/RateLimit · G.검색/다운로드 · H.서드파티/공급망 · I.캐시/가용성(Next.js 특화) · J.개인정보/컴플라이언스

---

## 승계 항목 (동일 근본원인 — 이 문서 집계에서 제외, 사실만 인용)

이 6건은 전부 `fo-메인화면-매트릭스.md`에서 이미 판정·추적 중인 사안이다. Training 범위에서도 **동일하게 성립한다는 사실만** 기록하며, 이 문서의 신규 Critical/Warning/Info 집계에는 포함하지 않는다.

| 구 번호 | 사안 | 승계 대상 | 그쪽 문서의 현재 상태 | Training 범위에서 확인된 사실 |
|---|---|---|---|---|
| T-3 | FO site key / BO secret 이 Google 공식 **테스트 키쌍**이라 임의 문자열 토큰이 siteverify를 통과 | **#7**(패스 확정) + **#27**(fail-open 기본값, 별도 추적) | #7 = 사용자 **패스** 확정 / #27 = Warning 추적중 | 현재 디스크 실측: `application-{local,dev,developer}.yml:80/93/92` 전부 `recapchaKey: ${RECAPTCHA_SECRET:6LeIxAcTAAAAAGG-...}`, `fo/.env.local:14` = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`. 구동 중 인스턴스는 `local` 프로필(부트로그 `The following 1 profile is active: "local"`). `RecaptchaService.java:37-55`의 검증 로직 자체는 fail-closed(토큰 누락 시 400)이며 무력화 원인은 **키 값**이다. **운영 실키 전제로 판단** |
| T-5 | 클라이언트 번들 노출 Google Maps 키에 리퍼러/API 제한 없음 | **#7** | 사용자 **패스** 확정 | `fo/.env.local:11` = `AIzaSyBkHvBn_MG-VWQd2C8-UA3PJBniWPy5QNk` (bo-api `application-{local,developer}.yml:79/91` `googleMapKey`와 **동일 값**). 재실측(2026-08-09, 리퍼러 없는 순수 curl): Geocoding API 200 정상 응답. 사용처 4곳 — `TrainingSessionLocationMap.tsx`, `TrainingSessionDetailForm.tsx`, `RequestForTrainingStep1Form.tsx`, `RequestForTrainingStep3Form.tsx` |
| T-2 | 세션 수강신청 접수 데이터가 `trainingApplHis-data` slug로 `page_data`에 적재되어 무인증 FO 경로로 조회됨 | **#1 / #2** | 사용자 **패스** 확정 | 재실측(2026-08-09): `GET http://localhost:3002/api/v1/fo/page-data/trainingApplHis-data?size=50` → 200. 적재 3건 전부 테스트 데이터(`john.smith@example.com` 2건 / `alice.johnson@example.com` 1건). **실 개인정보 유출은 확인되지 않음** |
| T-8 | 목록 API가 `createdBy`/`updatedBy`를 BO 관리자 **실명+소속**으로 치환해 반환(Over-fetch) | **#22** | Warning 추적중 (`PageDataService.searchInternal` → `buildUserNameMap` 공통 코드경로) | 재실측(2026-08-09): `GET /api/v1/fo/page-data/currMgmt-data?size=2&eq_curriculum.is_visible=001&eq_curriculum.training_course=01` → `"createdBy":"장성주 (베이직인터내셔널)"`. **#22와 완전히 같은 코드경로**이며 slug만 다르다. 화면 렌더링에 쓰이는 필드는 `title/description/image/product_category`뿐(`trainingData.ts:62-81`). 상세·세션 페이지는 서버 컴포넌트에서 필요 필드만 매핑하므로 RSC 페이로드에는 실리지 않음(HTML 실측 0건) |
| T-10 | 응답 CSP에 `frame-ancestors`만 있고 `script-src`/`default-src` 없음, `Permissions-Policy` 없음 | **#26** | Warning 추적중 (`fo/next.config.ts` 전역 설정) | 재실측(2026-08-09) `/services/engineering-training` 응답 헤더: `Content-Security-Policy: frame-ancestors 'self'`가 전부, `Permissions-Policy` 없음. 나머지 6종(nosniff / HSTS / Referrer-Policy / CORP / COOP / X-Frame-Options)은 정상 적용. Training 전용 설정이 아니라 **전역 `next.config.ts` 하나의 사안** |
| T-11 | `next 16.2.6` npm audit high 6건 | **#29** | Info (Critical→Info 강등 확정) | 재확인: `fo/package.json:22` = `"next": "16.2.6"` (caret 없이 고정), `'use server'` **0건**(fo 전체 grep). 개별 권고 전제조건이 Training 스코프에서도 하나도 충족되지 않음(rewrites destination은 `API_PROXY_TARGET` env 고정 / Training 화면은 `next/image` 미사용 plain `<img>` / `src/middleware.ts`는 `x-pathname`·`x-search` 주입 전용으로 인증 경계 아님). 캐시 혼동 권고 2건만 UNPROVEN |

---

## 발견 이슈 (이 문서 신규 분)

<!-- 형식: #번호 [파일:라인] 설명 — 카테고리 / 심각도(Critical|Warning|Info). -->

### Critical

**0건.**

초판(2026-08-08)의 Critical 3건은 재분석 결과 전부 이 문서의 Critical 집계에서 빠졌다.

| 초판 번호 | 초판 판정 | 2026-08-09 재판정 | 사유 |
|---|---|---|---|
| T-3 (reCAPTCHA 테스트 키) | Critical | **승계 — 집계 제외** | `fo-메인화면-매트릭스.md` #7(패스 확정) / #27(별도 추적)과 **동일 근본원인**. 로컬 테스트 서버의 키 값이 원인이며 운영 실키 교체를 전제로 판단(원칙 6·7) |
| T-4 (Rate Limit·중복제출 방지 부재) | Critical | **Warning으로 강등** | 초판의 Critical 근거는 "T-3으로 봇 방어가 성립하지 않는 상태에서"라는 전제였다. reCAPTCHA 정상 동작(실키·1회용 토큰)을 전제로 다시 계산하면 무제한·무비용 자동화 반복 전송이 즉시 성립하지 않는다. **1차 방어선이 뚫렸을 때의 2차 방어선(defense-in-depth) 부재**로 재분류 |
| T-5 (Google Maps 키 무제한) | Critical | **승계 — 집계 제외, 사용자 확정 패스(2026-08-09)** | `fo-메인화면-매트릭스.md` #7과 **완전히 동일한 키·동일 근본원인**(같은 developer 프로필 키). `#보안성상세분석`으로 리퍼러/API 제한 부재를 재확인했으나, 원인이 코드가 아니라 Google Cloud Console의 키 제한 설정 부재라 이 저장소의 수정 범위 밖 — 사용자가 패스로 확정 |

### Warning

- 🟡 **T-1 [bo-api/.../service/PageDataService.java:79-84, :166-168 / fo/src/app/services/training/data/trainingData.ts:28, trainingDetailData.ts:30-32]** Training 커리큘럼·세션상세의 게시(공개) 게이트가 **클라이언트가 보내는 쿼리파라미터로만** 구현되어 있다. — B / **Warning**
  - **구조**: FO 페이지는 `where`에 `eq_curriculum.is_visible=001`(목록), `eq_curriculum_detail3.is_visible=001` + `condexpr_training_date_to`(세션상세)를 실어 보낸다. 서버측 강제 게이트 `FO_PUBLISH_GATED_SLUGS`(`PageDataService.java:79-80`)에는 **`press-data`/`blog-data`/`articles-data`/`events-data` 4개만** 등록되어 있고 Training 슬러그(`currMgmt-data`, `currDtlMgmt-data`)는 없다. 파라미터를 빼면 게이트가 사라진다.
  - **재현(2026-08-09 재실측, bo-api 8080 직접 · 인증 없음)**:
    ```
    GET /api/v1/fo/page-data/currMgmt-data?size=1&eq_curriculum.is_visible=001         → totalElements 26
    GET /api/v1/fo/page-data/currMgmt-data?size=1                                       → totalElements 27   (+1)
    GET /api/v1/fo/page-data/currDtlMgmt-data?size=1&eq_curriculum_detail3.is_visible=001 → totalElements 49
    GET /api/v1/fo/page-data/currDtlMgmt-data?size=1                                     → totalElements 58   (+9)
    ```
    (초판 2026-08-08 실측과 동일한 수치 — 코드·데이터 변동 없음)
  - **새어나온 데이터의 성격 구분(과장 방지)**:
    - `currMgmt-data` +1건: id=2154, `is_visible:"002"`, title `"dfdddfdfdf"` — **테스트 입력물**이라 내용상 피해 없음.
    - `currDtlMgmt-data` +9건 중 4건(id 2273 / 2200 / 2196 / 2066)은 `is_visible:"002"`이며 실제 커리큘럼에 연결된 **실 콘텐츠**(SEO 메타·강의 설명·연계 제품목록이 반환됨). **PII는 포함되지 않는다.**
    - 나머지 5건(id 1109/1106/1104/1088/1021)은 `curriculum_detail1`이 `{}`인 빈 레코드다.
  - **범위 한정**: 노출되는 것은 강의/세션 **콘텐츠**이며 개인정보가 아니다. 화면(FO 페이지)에는 파라미터가 항상 붙으므로 미게시 건이 렌더링되지 않는다. **API를 직접 호출했을 때만 성립**한다.
  - **중복 여부 판정**: `fo-메인화면-매트릭스.md` #4는 같은 계열이지만 **이미 수정 완료**되어 4개 슬러그에 서버측 게이트가 적용된 상태다. T-1은 그 게이트 자체가 아니라 **Training 슬러그가 게이트 대상 목록에 없다**는 별개 사실이므로 승계가 아닌 신규로 집계한다.
  - **대조군(정상 동작)**: 화면 라우트 게이팅은 전부 정상 — `/services/engineering-training/2154`(비공개 강의) 404, `/2183/2271`(기간 지난 세션) 404, `/2093/2273`(비노출 세션) 404, `/2108/2266`(타 강의 세션 id) 404, `/2183/2266`(정상) 200. 근거: `TrainingDetailPage.tsx:31-33`, `TrainingSessionPage.tsx:32-34,49-51`, `trainingDetailData.ts:360-366`.

- 🟡 **T-4 [bo-api/.../security/LoginRateLimitFilter.java:28-42, service/TrainingRequestService.java:60-131, TrainingRegistrationService.java:75-131]** FO 접수 엔드포인트 2종(`POST /fo/training/requests`, `POST /fo/training/registrations`)에 Rate Limit과 중복 제출 판정이 없다. — F / **Warning** (초판 Critical에서 강등)
  - **강등 사유(재계산)**: 초판은 "T-3으로 캡차가 무력화된 상태"를 전제로 무제한 자동 반복 전송을 Critical로 판정했다. reCAPTCHA가 정상 키로 동작하는 전제(원칙 7)로 다시 보면, **Google reCAPTCHA v2 토큰은 1회용**이라 스크립트로 동일 토큰을 반복 전송할 수 없고 매 건마다 캡차 해결(사람 또는 유료 캡차풀이 서비스)이 필요하다. 따라서 "무제한·무비용 자동화 남용이 즉시 성립"하지 않으며, **1차 방어선(reCAPTCHA)이 뚫렸을 때를 대비한 2차 방어선(defense-in-depth) 부재**로 재분류한다.
  - **reCAPTCHA 상태와 무관하게 그대로 남는 사실**:
    - `LoginRateLimitFilter.java:28-30,38-42`가 `POST /api/v1/auth/login` **한 경로만** 대상으로 하고(`LOGIN_PATH` 상수 비교) 그 외는 즉시 `filterChain.doFilter()`로 통과시킨다 → FO 전 경로 요청 제한 없음. ※ 이 "FO 전 경로 rate limit 부재"라는 사실 자체는 `fo-메인화면-매트릭스.md` **#24와 동일한 필터·동일 근본원인**이다. T-4에서 새로 집계하는 부분은 아래 중복 제출 판정 부재다.
    - `TrainingRequestService.submit` / `TrainingRegistrationService.submit` 어디에도 **중복 제출 판정 코드가 없다**(소스 전문 확인 — 저장 전 조회/유니크 체크 없이 곧바로 `repository.save(entity)`). DB 레벨에도 중복 방지 제약이 없다. 즉 동일인이 같은 내용을 반복 제출하면 매번 별개 레코드로 적재되고 건마다 메일 발송이 트리거된다.
  - **초판 재현 기록(2026-08-08, 테스트 키 상태에서 수행)**: 동일 payload 연속 전송 시 `{"id":52}` / `{"id":53}` / `{"id":54}` 전부 200, 5연속도 id 46~50 전부 200, registrations 7연속 201 — **429·중복거부 응답 0건**. 이번 회차에서는 DB에 테스트 데이터를 추가로 쌓지 않기 위해 재실행하지 않았다.
  - ⚠️ **부분 수정(2026-08-09) — T-4 자체는 FAIL 유지**: T-4의 피해 규모를 키우던 요인 중 하나였던 "요청 1건이 메일 발송 완료까지 DB 커넥션/요청 스레드를 21초 이상 점유"는 **T-12 수정(메일 발송 비동기화)으로 해소**되었다(21.335초 → 1.481초 실측). 즉 반복 제출로 커넥션 풀을 고갈시키는 증폭 효과는 크게 줄었다.
    - **그러나 T-4의 본체인 Rate Limit·중복 제출 판정은 여전히 미적용이다.** `LoginRateLimitFilter`는 `POST /api/v1/auth/login` 단일 경로 대상 그대로이고, 두 `submit()`에 중복 판정 코드나 DB 유니크 제약도 추가되지 않았다. 이번 승인 범위(메일 발송 비동기화)에 포함되지 않아 손대지 않았다.
    - **남은 부분**: (1) FO 접수 엔드포인트 2종 Rate Limit 적용, (2) 동일 내용 중복 제출 판정. 이 2건이 처리되기 전까지 T-4는 **FAIL(Warning) 유지**.

- ✅ **T-12 [bo-api/.../service/TrainingRequestService.java:126-128, TrainingRegistrationService.java:126-128, common/mail/MailService.java:35]** 접수 처리 시 메일 발송이 `@Async` 없이 요청 스레드에서 동기 처리된다. — I / **Warning** → **수정 완료(2026-08-09)**
  - ✅ **수정 완료(2026-08-09)**: 두 서비스의 `mailService.sendMail(...)` 직접 동기 호출을 `ApplicationEventPublisher.publishEvent(new MailSendEvent(...))`로 교체하고, 신규 `common/mail/MailSendEventListener.java`가 `@Async` + `@TransactionalEventListener(phase = AFTER_COMMIT)`로 **트랜잭션 커밋 후 별도 스레드에서** 실제 발송을 수행하도록 변경. `MailService` 본체(발송 + `email_send_his` 이력 저장 + 실패 시 "F" 기록)는 그대로 두어 뉴스레터(`NewsletterInsightsService`)·재발송(`EmailSendHisService`) 경로에는 영향 없음. `@Async` self-invocation 프록시 한계를 피하려고 리스너를 별도 빈으로 분리(`ContentsBatchAsyncRunner`와 동일 패턴).
    - 신규: `bo-api/src/main/java/com/ge/bo/common/mail/MailSendEvent.java`, `MailSendEventListener.java`
    - 변경: `TrainingRequestService.java:47-50,120-131`, `TrainingRegistrationService.java:60-65,119-131`
  - **검증(실측, 로컬 profile=local, bo-api 재기동 후)**:
    - `POST /fo/training/requests`: 수정 전 **21.335초**(구 빌드 기동 상태에서 직접 측정, `training_request` id=69 / `email_send_his` id=2428 생성) → 수정 후 **1.481초**(id=70). **약 14배 단축**
    - `POST /fo/training/registrations`: 수정 후 **0.347초**(id=43). 수신자 2명(신청자 + `engineeringTraining@ls-electric.com`)이 `task-3`/`task-4` 두 스레드에서 병렬 처리됨
    - **이력 저장 유지 확인**: 응답 반환(11:35:36) **이후** 11:35:57에 `email_send_his` id=2429(`send_status=F`, `content = <p>id: 70</p>...`) 기록. registrations도 응답(11:36:27) 후 11:36:48에 id=2430·2431 두 건 기록 → 비동기 전환 후에도 성공/실패 이력이 그대로 남는다
    - **스레드 분리 확인**: 부팅 로그상 저장은 `[http-nio-8080-exec-1]`, 메일 발송은 `[task-1]`/`[task-3]`/`[task-4]` — 요청 스레드에서 완전히 분리됨
    - **회귀 없음 확인**: `recaptchaToken` 누락 → 400(requests 0.024초 / registrations 0.008초), `email` 누락 → 400, 존재하지 않는 `sessionId`(FK 위반) → 409. 실패 3건 모두 `training_request`/`training_registration`/`email_send_his`에 **행 0건 추가**
  - **검증 못한 부분**: "트랜잭션이 롤백되면 메일이 나가지 않는다"를 런타임으로 격리 재현하지 못했다. 두 서비스의 실패 지점(FK 위반)이 `repository.save()` 시점 — 즉 이벤트 발행 **이전**이라, 위 409 테스트는 "실패 시 메일 없음"은 보여주지만 AFTER_COMMIT 단계 자체를 격리 검증하지는 않는다. 발행 이후~커밋 이전에 실패하는 경로가 현재 코드에 없어 코드 수정 없이는 재현 불가. 다만 응답 반환 후에야 메일 스레드가 도는 것은 위 타임스탬프로 확인됨
  - **아래 초판 실측/분석 기록은 수정 전 상태 기준으로 보존**
  - **reCAPTCHA와 무관하게 성립**: 캡차를 정상 통과한 **정상 사용자 1건**의 요청도 메일 발송이 끝날 때까지 스레드를 점유한다. 소스 확인 결과 두 서비스 모두 `for (String recipient : buildRecipients(...)) { mailService.sendMail(...) }`를 트랜잭션 안에서 동기 호출하며, 수신자가 늘어나면 그만큼 선형으로 누적된다.
  - **초판 실측(2026-08-08)**: `POST /fo/training/requests` 1건 **21.3초** 점유(×3회 동일). `POST /fo/training/registrations` 성공 1건 **73.048초**(fo 프록시 3002 경유 시 이 지연으로 500 끊김).
  - **조건 명시(과장 방지)**: 위 수치는 **SMTP(10.153.2.44) 미도달 로컬 환경** 기준이며, SMTP가 정상 도달하는 환경에서 같은 지연이 난다고 단정하지 않는다. 구조적 사실("요청 1건이 메일 발송 완료까지 스레드를 붙잡는다")만 유효하다. `fo-메인화면-매트릭스.md` #24의 뉴스레터 21초 측정과 동일한 성격의 환경 조건이다.
  - **중복 여부 판정**: #24는 `NewsletterInsightsService.send()` 경로를 다루며, T-12는 `TrainingRequestService` / `TrainingRegistrationService`라는 **별개 코드경로 2개**다. 같은 패턴이지만 대상 코드가 다르므로 신규로 집계한다.

### Info

- ℹ️ **T-6 [bo-api/.../service/TrainingRequestService.java:124-128, :145-155, common/mail/MailService.java:57-60]** Training Request 접수 메일 본문에 요청자 입력값(`trainingTrack`)이 이스케이프 없이 HTML로 삽입되고, 첫 수신자가 요청자가 지정한 `email` 값이다. — A, F / **Info** (초판 Warning에서 강등)
  - **강등 사유**: 초판은 "임의 수신자 지정 + 본문 인젝션 + T-3/T-4 결합 반복 트리거"를 근거로 Warning으로 뒀다. 재검토 결과 (1) 삽입 가능 길이가 `TrainingRequestSubmitRequest.java:20`의 `@Size(max = 50)`으로 **50자 제한**, (2) "임의 수신자"라는 것은 실제로는 `buildRecipients(request.email(), resolveManagerEmail())` — **접수자가 입력한 본인 이메일로 가는 접수 확인 메일 + 공통코드(EMAIL_RECIPIENT.TRAININGREQUEST)에 고정된 사내 담당자**이며 폼 설계상 정상 동작이다. 제3자 대량 스팸 릴레이 구조가 아니다, (3) reCAPTCHA 정상 동작 전제에서 발송 1건마다 캡차 해결이 필요하다, (4) **실제 메일 도달을 재현하지 못했다**(로컬 SMTP 미도달, `send_status=F`).
  - **남는 사실**: `"<p>id: %d</p><p>trainingTrack: %s</p>".formatted(saved.getId(), request.trainingTrack())`에 이스케이프가 없고, `MailService`가 `helper.setText(content, true)`(HTML 모드) + `helper.setFrom("elesmtp@ls-electric.com")`으로 발송한다.
  - **초판 재현 기록**: `trainingTrack`에 태그를 넣어 접수(id=51) → psql `email_send_his` id=2363의 `content` = `<p>id: 51</p><p>trainingTrack: SECREVIEW-TEST<b>x</b></p>`, `recipient_email = secreview-test@example.com`, `send_status = F`. **본문 삽입은 실측 확인, 실제 메일 도달은 UNPROVEN.**
  - **해당 없음**: `POST /fo/training/registrations`는 본문이 `curriculumId`/`sessionId`(Long)뿐이라 성립하지 않는다(`TrainingRegistrationService.java:124-125` 확인).

- ℹ️ **T-7 [bo-api/.../service/TrainingRegistrationService.java:55-58, :137-141, :126]** 존재하지 않는 `curriculumId`로 수강신청을 보내면 비인증 상태에서 500이 발생하고 트랜잭션이 롤백된다. — I / **Info** (초판 Warning에서 강등)
  - **강등 사유**: 실제로 확인된 영향은 (1) 400이 아닌 500 응답, (2) `error_log` 행 1건 적재 뿐이다. 트랜잭션이 롤백되어 데이터가 남지 않고, 정보 노출도 없다(응답 본문은 `{"error":"INTERNAL_SERVER_ERROR"}`). "요청마다 error_log가 쌓여 테이블이 무제한 증가한다"는 초판의 가중 논리는 **T-3(캡차 무력화)이 전제**였으므로 원칙 7에 따라 제거했다. 정상 키 환경에서는 시도 1건마다 캡차 해결이 필요하다.
  - **원인(코드 재확인)**: `findTrainingCourseCode()`가 미존재 id에 대해 `null`을 반환(`:177`) → `resolveManagerEmail(null)`이 불변 Map `TRAINING_COURSE_TO_RECIPIENT_CODE.get(null)` 호출(`:138`) → `Map.of`는 null 키 조회 시 NPE.
  - **초판 재현 기록**: `POST /api/v1/fo/training/registrations` (`curriculumId:1, sessionId:1`) → `HTTP 500`. psql `error_log` id=4212 스택트레이스:
    ```
    java.lang.NullPointerException: Cannot invoke "Object.hashCode()" because "pk" is null
      at java.util.ImmutableCollections$MapN.get(...)
      at ...TrainingRegistrationService.resolveManagerEmail(TrainingRegistrationService.java:138)
      at ...TrainingRegistrationService.submit(TrainingRegistrationService.java:126)
    ```
  - **범위 한정**: 현재 DB의 실제 커리큘럼 27건은 `training_course`가 전부 01/02/03이라 정상 신청 흐름에서는 발생하지 않는다. 존재하지 않는 id를 직접 보낼 때만 성립한다.

- ℹ️ **T-9 [fo/src/app/services/request-for-training/components/RequestForTrainingProvider.tsx:230,253,307]** Training Request 입력 중인 개인정보 전체가 `request-for-training-form` 키로 sessionStorage에 평문 저장된다. — C / **Info** (유지)
  - 저장 항목: 이름/성/회사/도로명주소/상세주소/도시/주/우편번호/전화/휴대전화/이메일/직함, Step3의 교육장소 주소·담당자·연락처, Step4 코멘트.
  - 제출 성공 시 삭제되며(`:307` `sessionStorage.removeItem`), 중도 이탈 시 탭 종료까지 남는다. 서버 전송 없음, 동일 오리진 스크립트만 접근 가능. 4단계 폼의 단계 간 값 유지를 위한 통상적 구현이다.

- ℹ️ **T-13 [bo-api/.../dto/TrainingRequestSubmitRequest.java:115, TrainingRegistrationRequest.java:55]** `@AssertTrue`는 Bean Validation 규격상 null을 유효로 판정하므로, `consentChecked` 키를 아예 빼고 보내면 검증을 통과한다. — F, J / **Info** (유지)
  - **최종 차단 확인**: DB `consent_checked` NOT NULL 제약이 막는다. 초판 실측 `HTTP 409 DATA_INTEGRITY`, 저장되지 않음. **동의 없는 데이터가 남지는 않는다.**
  - 정상 경로에서는 동의 체크값이 payload에 포함되고(`RequestForTrainingStep4.tsx:107`) `false`로 보내면 서버가 400으로 거부한다.

- ℹ️ **T-14 [bo-api/.../service/TrainingRegistrationService.java:91-113, PageDataService.java:477-489]** 수강신청 API가 `curriculumId`/`sessionId`의 존재 여부와 부모-자식 일치를 검증하지 않는다. 임의 `sessionId`로 등록이 가능하고 `incrementViewCount(SESSION_SLUG, sessionId, null)`로 `currDtlMgmt-data` 임의 행의 조회수를 비인증 증가시킬 수 있다. **개인정보 접근은 불가.** — B, F / **Info** (유지)
  - 소스 주석(`TrainingRegistrationService.java:30`)에 "세션/코스 id 의 부모-자식 일치 검증은 하지 않는다(과설계 방지, 사용자 확정)"로 **명시된 설계**다.
  - 조회수 증가 자체의 무인증 무제한 호출은 `fo-메인화면-매트릭스.md` #23(Warning 추적중)과 같은 엔드포인트 사안이다.

- ℹ️ **T-15 [fo/src/app/services/training/components/TrainingDetailPage.tsx:23-33]** 3개 메뉴가 서로의 강의를 교차 렌더링한다. `curriculum.training_course`를 라우트 variant와 대조하지 않기 때문이다. — B / **Info** (유지)
  - 초판 실측: engineering 강의(2183, `training_course=01`)가 `/services/sales-training/2183`, `/services/service-training/2183`, `/services/sales-training/2183/2266`에서 모두 200으로 렌더링됨.
  - **범위 한정**: 세 경로 모두 **이미 공개된 동일 콘텐츠**이므로 비공개 정보 노출이 아니다.

- ℹ️ **T-16 [fo/src/lib/pageDataApi.ts:136, fo/src/lib/api.ts:26-30]** 비숫자/초과범위 `courseId`가 404가 아닌 500을 반환한다. — C / **Info** (유지)
  - **재현(2026-08-09 재실측)**: `/services/engineering-training/abc` → **500** / `/services/engineering-training/999999` → **404**(대조군 정상).
  - 원인: 404만 `notFound()`로 처리하고 400은 throw한다. 개발 서버 응답 본문에 `fetchApi 실패: 400 (/api/v1/fo/page-data/currMgmt-data/abc?)` 문자열이 포함된다.
  - **운영 동작은 UNPROVEN**: 운영 빌드에서는 Next가 에러 메시지를 digest로 치환하므로 이 문자열 노출은 개발 서버 한정으로 보이나 검증하지 못했다.

- ℹ️ **T-17 [bo-api/.../common/client/ExternalApiClient.java:42-62, application.yml:1-3]** `developer` 프로필이 활성일 때만 외부 HTTPS 호출의 TLS 검증이 비활성화된다(trust-all TrustManager + 항상 true인 HostnameVerifier). — D / **Info** (초판 Warning에서 강등)
  - **강등 사유(원칙 2 적용)**: **런타임에서 재현하지 못했다.** 구동 중인 인스턴스의 활성 프로필은 `local`이며(부트로그 `The following 1 profile is active: "local"`), `local` 프로필에서는 `ExternalApiClient.java:44` `environment.matchesProfiles("developer")`가 false여서 `trustAllSslContext = null`이 되고 `:56`의 우회 분기가 실행되지 않는다. 코드상 존재하는 개발용 분기이며 실제 발동을 증명하지 못했으므로 Info로 둔다.
  - **남는 사실**: `application.yml:3`의 기본 활성 프로필이 `${SPRING_PROFILES_ACTIVE:developer}` — 환경변수 미설정 시 `developer`가 선택된다. reCAPTCHA siteverify 호출도 이 클라이언트를 경유한다(`RecaptchaService.java:49`).

- ℹ️ **T-19 [bo-api/.../entity/TrainingRequest.java:37-199, TrainingRegistration.java:26-102]** 접수 PII가 평문 저장된다(`@Convert`/AttributeConverter 없음). psql로 `email`/`phone`/주소 컬럼이 평문 조회됨을 확인. — J / **Info** (유지)
  - fo 측은 PII를 자체 저장하지 않고 bo-api로 POST 위임만 한다(sessionStorage 임시 보관은 T-9).

- ℹ️ **T-20 [fo/src/app/services/training/components/TrainingSessionDetail.tsx:322, fo/src/components/modals/PrivacyPolicyModal.tsx:78]** `dangerouslySetInnerHTML` 2곳. — A / **Info** (유지)
  - 재확인(2026-08-09 grep): Training 스코프 내 `dangerouslySetInnerHTML`은 정확히 이 2곳이다. 데이터 출처는 둘 다 **BO 관리자 리치텍스트**(`curriculum_detail2.content`, `termsMgmt-data` 약관 HTML)이며 **방문자 입력이 섞여 들어가는 경로는 없다.** DOMPurify 등 새니타이즈는 없다(프로젝트 기존 패턴과 동일).
  - `PrivacyPolicyModal`은 `TrainingSessionDetailForm.tsx`에서만 사용된다(grep 확인) — Training Request 화면에는 사용되지 않으므로 해당 메뉴 A열에는 계상하지 않았다.

- ℹ️ **T-21 [`GET /api/v1/fo/page-files/{id}`]** 숫자 ID 전용이며 경로 트래버설은 차단된다(`..%2f..%2fetc%2fpasswd` → 400, `607/../../../etc/passwd` → 404). — G / **Info → `fo-메인화면-매트릭스.md` #30으로 승계**
  - 로컬에 업로드 실물이 없어(1,5,10,…,607 전부 `FILE_NOT_FOUND`) 비공개 파일 IDOR 가능 여부는 **UNPROVEN**. 이는 #30에서 이미 동일하게 UNPROVEN으로 판정·추적 중인 사안이라 이 문서에서 별도 집계하지 않고 매트릭스 G열에 `승계(#30)`로 표기했다.

### 철회

- ❌ **T-18 [bo-api/.../service/FoTrainingService.java:94-96, FoTrainingController.java:57-58]** "X-Site-Id 헤더가 없으면 site 조건을 붙이지 않아 전체 사이트 커리큘럼이 반환된다" — **철회(재현 불가)**
  - **재현 실패(2026-08-09 실측)**: `GET /api/v1/fo/training/curriculum-by-category?categoryIds=1731,1732,1745&size=1` 헤더 없음 → `totalElements 0` / `X-Site-Id: 1` → `totalElements 0`. **차이가 발생하지 않는다.**
  - **DB 교차검증(psql 실측)**: `SELECT site_id, count(*) FROM page_data GROUP BY site_id` → `1 | 546`, `NULL | 177`. **두 번째 사이트 자체가 DB에 존재하지 않으므로 교차 사이트 유출을 증명할 방법이 없다.** 이는 `fo-메인화면-매트릭스.md` **#10이 철회된 것과 완전히 동일한 사유**다.
  - **함께 철회한 부수 항목**: "size 상한 없음 / page 음수 허용". 실측 `size=100000` → `200`, 응답 크기 **95 bytes**. 데이터 자체가 소량이라 DoS 규모를 재현할 수 없다(`fo-메인화면-매트릭스.md` #14와 동일 사유로 Info 이하).

---

## 확인된 정상 동작 (PASS 근거)

- **SQL 인젝션 미성립 (A, G)** — `categoryIds`/`ids`는 `Long.parseLong` 파싱 후 `:catIds`/`:ids` 바인딩(`FoTrainingController.java:92-107`, `FoTrainingService.java:158-176`), `trainingCourse`는 `Set.of("01","02","03")` 화이트리스트(`:46,69-71`), `q`는 `SearchSqlSupport.toLikePattern()`으로 `\ % _` 이스케이프 후 `:kw` + `ESCAPE '\'` 바인딩(`:73-74, 91-92`). 문자열 결합 부분은 전부 코드 내 상수.
  실측: `categoryIds=1' OR '1'='1` → 400 / `q=%' OR 1=1--` → 200 빈결과 / `ids=1 OR 1=1` → 200 `{}` / `trainingCourse=99` → 400 / `?title|description=' OR 1=1--` → 200 빈결과(SQL 에러·스택트레이스 없음) / 비숫자 id → `400 {"error":"INVALID_PARAMETER_TYPE"}`
- **접수 데이터 조회 경로 없음 (B)** — FO 컨트롤러 전수 확인 결과 접수 데이터 조회 엔드포인트가 존재하지 않는다. `GET /api/v1/fo/training/registrations` → 405, `/registrations/1` → 404. 같은 테이블을 쓰는 관리자 API는 `/api/v1/fo/**` 밖이라 실측 `GET /api/v1/training-requests`, `/training-registrations`, `/training-applications` 모두 **401**.
- **서버측 스키마 검증 동작 (F)** — 클라이언트 필터(`fo/src/lib/formInputFilters.ts`)를 우회해 직접 POST해도 서버가 거부한다.
  ```
  firstName 5000자 / email 형식오류 / comments 5000B → 400 {"fieldErrors":{"firstName":"크기가 0에서 200 사이여야 합니다","comments":"요청사항은 최대 2000byte까지 입력할 수 있습니다.","email":"올바른 이메일 형식이 아닙니다."}}
  registrations 빈 필드+동의 false+토큰 없음 → 400 {"fieldErrors":{"privacyConsentFlag":...,"companyName":...,"jobTitle":...,"recaptchaToken":...,"email":...}}
  ```
  단 같은 요청에서 `phone="SECREVIEW-TEST-abc"`, `studentCount="999999"`는 서버가 거부하지 않았다(클라이언트에서는 각각 숫자 10자리·최대 18로 제한).
- **오픈 리다이렉트/CSRF/클릭재킹 (E)** — 리다이렉트 대상이 전부 상수(`requestForTrainingRoutes`, 공유링크는 자기 URL 기반). 인증 쿠키가 없어 전통적 CSRF 미성립. 추가로 bo-api가 CORS 차단: `Origin: https://evil.example.com`으로 POST → `"Invalid CORS request"`, 프리플라이트 → 403.
- **프록시 경로 이탈(SSRF) 미성립 (D)** — `/api/v1/fo/../../actuator/env` → 404, `%2e%2e` → 404, `..%2f` → 400. 이중인코딩(`..%252f…`)은 bo-api까지 도달했으나 전부 401이며 8080 직접 호출도 401이라 프록시로 새로 열린 것은 없음. `images.remotePatterns`는 `images.unsplash.com` 1건(`next.config.ts:8-13`).
- **캐시 (I, FE 측면)** — `fetchApi` 기본 `cache:"no-store"`(`api.ts:22`), 응답 `Cache-Control: no-cache, must-revalidate`. `revalidate`/`force-static` 지정 0건. 로그인 자체가 없어 개인화 캐시 노출 시나리오 미성립.
- **로그/에러 응답 (C)** — `GlobalExceptionHandler`가 스택트레이스·내부 경로를 응답에 넣지 않음(스택트레이스는 DB `error_log`에만 저장). `TrainingRequestService.java:117`, `TrainingRegistrationService.java:116`이 id/포맷/건수만 기록하고 PII 미기록(소스 재확인 — 로그 포맷 문자열에 이름·이메일 없음). fo 측 `console.error`는 `RequestForTrainingStep4.tsx:114` 1곳이며 PII·키·스택트레이스 미포함.
- **reCAPTCHA 서버측 검증 로직 자체는 fail-closed (F)** — `RecaptchaService.java:38-41`이 토큰 null/blank면 400, `:51-54`가 siteverify 응답 `success != true`면 400. 무력화 원인은 **키 값**이며 로직이 아니다(→ 승계 T-3).
- **IP 처리 (D)** — `ClientIpUtils.resolve()`가 `X-Forwarded-For`를 신뢰하지 않고 `getRemoteAddr()` 사용.
- **`/fo/codes/{groupCode}` 사용 방식 (A, B)** — Training Request의 groupCode는 사용자 입력이 아니라 소스 상수 3개(`TRAININGJOBTITLE`/`TRAININGJOIN`/`TRAININGVFD`)뿐(`requestForTrainingCodes.ts:4-6,22`). ※ 엔드포인트 자체의 groupCode 화이트리스트 부재는 `fo-메인화면-매트릭스.md` #5→#28에서 별도 추적 중.
- **StepGuard (B)** — `/step-2`, `/step-4` 직접 호출 시 서버는 200을 반환하고 브라우저에서 `RequestForTrainingStepGuard.tsx:29-47`이 `router.replace` 한다(클라이언트 가드). 각 Step 페이지는 정적 카피와 폼 마크업뿐이라 서버가 내려주는 비공개 데이터가 없다.
- **Server Action 0건 (H, I)** — fo 전체 `'use server'` grep 결과 **0건**(2026-08-09 재확인).
- **기타 (E, C)** — 폼 값이 URL 쿼리스트링으로 새는 지점 없음. 스코프 내 컴포넌트에 직접 `fetch()` 0건(전부 `fetchApi()` 경유). `poweredByHeader: false`.

---

## 참고 — 실측 과정에서 생성된 테스트 데이터 (디스패처 psql 직접 확인, 2026-08-09 기준)

| 테이블 | 전체 | `SECREVIEW`/`secreview` 마킹 | 비고 |
|---|---|---|---|
| `training_request` | 47건 | **26건** | 초판 작성 시점(32건/11건) 이후 후속 검증 과정에서 증가. 2026-08-09 T-12 수정 검증으로 id 69(수정 전 baseline)·70(수정 후) 2건 추가 |
| `training_registration` | 36건 | **25건** | 초판 작성 시점(19건/8건) 이후 증가. 2026-08-09 T-12 수정 검증으로 id 43 1건 추가 |

그 외 `email_send_his`(recipient `secreview-test@example.com`, `send_status=F`) 및 `error_log`(NPE 재현 기록, id 4212 등)에도 행이 생성되어 있다. 전부 `SECREVIEW-TEST` / `secreview-*@example.com`로 식별 가능한 더미값이며, 증적 보존을 위해 삭제하지 않았다.
**2026-08-09 재분석에서는 POST 계열(접수 API)을 일절 재실행하지 않았다** — GET/psql 조회만으로 재검증했고, POST가 필요한 항목은 초판 실측 기록을 그대로 인용했다.
**단, 같은 날 진행한 `#보안성검토수정`(T-12) 검증에서는 응답시간 실측이 필요해 POST를 재실행했다** — 성공 3건(`training_request` id 69·70, `training_registration` id 43)과 실패 3건(400×2, 409×1, 행 미생성), `email_send_his` id 2429~2431.

---

## UNPROVEN (재현 실패 — 확정 불가)

- 운영(prd) 배포에서 `RECAPTCHA_SECRET` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / Google Maps 키가 실키로 override 되는지 (→ 승계 T-3·T-5, `fo-메인화면-매트릭스.md` #27과 동일)
- T-6의 실제 메일 도달(로컬 SMTP 미도달, `send_status=F`) — 본문 삽입만 확인
- T-16의 운영 빌드 동작(Next digest 치환 여부)
- T-17의 `developer` 프로필 런타임 TLS 우회 실제 발동(구동 인스턴스가 `local`)
- `page-files` 실제 파일 유출(로컬에 파일 실체 없음, → 승계 #30)
- next 캐시 혼동 권고 2건(→ 승계 #29)
- 인프라 레벨 rate limit(WAF·API GW) 존재 여부

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-08 | 매트릭스 최초 작성 (4개 메뉴 × 10개 카테고리 = 40셀). 범위·소스파일·bo-api 엔드포인트 확정 |
| 2026-08-08 | 전 셀 분석 완료. `nextjs-security-reviewer` 2회 + `java-security-reviewer` 1회 + 디스패처 독립 실측 병합. 발견 이슈 T-1 ~ T-21 (Critical 3 / Warning 7 / Info 11). 집계: PASS 11 / FAIL 28 / N/A 1 |
| **2026-08-09** | **전체 재분석(`#보안성검토`) — 40셀 전부 재판정.** 판정 원칙 6(타 매트릭스와 동일 근본원인 중복카운트 금지)·7(reCAPTCHA 실키 정상동작 전제 재평가)을 신규 강제. 결과: **Critical 3건 → 0건**(T-3·T-5는 `fo-메인화면-매트릭스.md` #7 패스 확정 사안으로 승계 제외, T-4는 Warning 강등). Warning 7건 → **3건**(T-1·T-4·T-12 유지 / T-6·T-7·T-17은 Info 강등 / T-8·T-10은 #22·#26 승계 제외). Info 11건 → 9건(T-2·T-11 승계 제외, T-21 #30 승계). **T-18 철회**(X-Site-Id 교차사이트 유출 재현 불가 — DB에 site_id 1과 NULL만 존재, #10과 동일 사유). 재검증은 GET/psql만 사용(POST 미실행, 테스트 데이터 추가 생성 없음) |
| **2026-08-09** | **`#보안성검토수정` — T-12(메일 발송 동기 처리) 수정 완료.** 승인 범위는 "메일 발송 비동기화" 단건(Rate Limit 추가·캡차 리셋 버그는 범위 제외). `MailSendEvent`/`MailSendEventListener` 신규 추가(`@Async` + `@TransactionalEventListener(AFTER_COMMIT)`), `TrainingRequestService`/`TrainingRegistrationService`가 `mailService.sendMail()` 직접 호출 대신 이벤트 발행. **실측: `/fo/training/requests` 21.335초 → 1.481초, `/fo/training/registrations` 0.347초.** 메일 이력(`email_send_his`)은 응답 반환 21초 후 비동기로 정상 기록(id 2429/2430/2431, `send_status=F` — 로컬 SMTP 미도달). 400/409 회귀 없음. 테스트 데이터: `training_request` id 69·70, `training_registration` id 43(`SECREVIEW-TEST` 접두어). **T-4는 부분 수정 상태로 FAIL 유지**(Rate Limit·중복 제출 판정 미적용) |
