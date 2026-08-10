# BO 로그인 보안성검토 매트릭스

> 작성일: 2026-08-10
> 대상: BO 관리자 로그인 (bo 프론트 `/admin/login` + bo-api 인증 백엔드 전체)
> 기준: OWASP Top 10 / 인증·세션 관리 표준 / 내부 관리자 도구(Back-Office) 맥락
> 판정: `-` 미분석 / `PASS` 이상없음 / `FAIL` 이슈발견 / `N/A` 해당없음
> 코드 수정 없음 — 발견 사항 기록 전용

---

## 범위 확정 근거

DB `menu` 테이블(dev: 10.153.11.120:5432 / postgres) 조회 결과, `url ILIKE '%login%' OR url ILIKE '%auth%'` 에 해당하는 메뉴는 **0건**.
→ BO 로그인 화면은 DB 메뉴 트리 밖의 **고정 라우트**(`/admin/login`)이며, 메뉴 권한 체크 대상이 아니다.
따라서 "메뉴" 축을 로그인 플로우의 **기능 영역 5개**로 분해하여 매트릭스를 구성한다.

---

## 매트릭스 (영역 × 카테고리)

| 영역 | A | B | C | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|---|---|---|
| 1. 로그인 화면 (bo FE) | PASS | **FAIL** | **FAIL** | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS |
| 2. 인증 API (bo-api) | PASS | **FAIL** | PASS | PASS | PASS | PASS | **FAIL** | **FAIL** | PASS | **FAIL** |
| 3. JWT/보안설정 (bo-api) | N/A | **FAIL** | **FAIL** | **FAIL** | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| 4. 로그인 제어 (bo-api) | PASS | PASS | PASS | PASS | PASS | **FAIL** | PASS | PASS | PASS | **FAIL** |
| 5. 로그인 이력 (bo-api) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

총 50셀 — PASS 35 / FAIL 14 / N/A 1

> 판정 보정 1건: 영역1 카테고리 G는 리뷰어 요약표에서 PASS로 제출되었으나,
> 같은 리뷰에서 `auth-store.ts:39,56` (`bo_is_system` 쿠키 `Secure` 플래그 누락)이 G 카테고리 Warning으로 보고되었다.
> 본 매트릭스 정의상 "이슈 발견 = FAIL" 이므로 FAIL로 보정했다.

### 기각된 가설 (사전 의심 → 실제 코드 확인 결과 문제 아님)

| 가설 | 검증 결과 |
|------|-----------|
| `password_hash`가 NULL인 SSO 전용 계정으로 인증 우회 가능 | **기각.** DB 실측 21건 중 15건이 NULL로 실재하나, 주입되는 인코더가 `SecurityConfig.java:182-184`의 `BCryptPasswordEncoder(12)` 단일 빈이며 `matches(raw, null)`은 예외가 아니라 `false`를 반환 → 로그인 거부. (`DelegatingPasswordEncoder`였다면 예외 발생했을 상황) |
| 1단계(비밀번호) 통과 시점에 최종 JWT가 발급되어 2FA 우회 가능 | **기각.** `AuthService.java:190-194`가 `type=TOTP_PENDING` 임시 토큰만 반환(accessToken=null). 해당 토큰을 `Authorization: Bearer`로 재사용해도 `JwtAuthenticationFilter.java:38,41`에서 role 클레임 null → 401. |
| 로그인 폼에 비밀번호가 하드코딩되어 있음 (CLAUDE.md 기재 근거) | **기각.** `login-form.tsx:57`은 `defaultValues: { email: "", password: "" }`로 빈 값. 단, 평문 비밀번호는 다른 곳(git 추적 문서)에 존재 → C-1 참조. |
| reCAPTCHA 토큰 미첨부 시 통과되는 fail-open 구조 | **기각.** `RecaptchaService.java:38-41`이 토큰 공백 시 400 예외. 다만 사용 중인 키가 테스트 키라 검증이 무의미 → F-1/F-2 참조. |
| 타 계정 TOTP 재등록으로 2FA 탈취 가능 | **기각.** `TotpService.setup()` 61-64행이 이미 등록된 계정의 재등록을 차단. 이메일도 요청 본문이 아닌 토큰/세션에서만 추출. |

---

## 대상 파일

### 1. 로그인 화면 (bo 프론트, Next.js — 포트 3001)

| 파일 |
|------|
| `C:\workspace\ge\bo\src\app\admin\login\page.tsx` |
| `C:\workspace\ge\bo\src\app\admin\_login\page.tsx` (비활성 추정 — 확인 필요) |
| `C:\workspace\ge\bo\src\components\auth\login-form.tsx` |
| `C:\workspace\ge\bo\src\components\auth\auth-provider.tsx` |
| `C:\workspace\ge\bo\src\components\auth\otp-input.tsx` |
| `C:\workspace\ge\bo\src\components\auth\totp-setup-form.tsx` |
| `C:\workspace\ge\bo\src\components\auth\totp-verify-form.tsx` |
| `C:\workspace\ge\bo\src\store\auth-store.ts` |
| `C:\workspace\ge\bo\src\lib\api.ts` |
| `C:\workspace\ge\bo\src\middleware.ts` |
| `C:\workspace\ge\bo\next.config.ts` |

### 2. 인증 API (bo-api)

| 파일 |
|------|
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\controller\AuthController.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\service\AuthService.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\service\CtpAuthService.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\dto\LoginRequest.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\dto\LoginResponse.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\dto\TotpDto.java` |

### 3. JWT / 보안설정 (bo-api)

| 파일 |
|------|
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\config\SecurityConfig.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\security\JwtTokenProvider.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\security\JwtAuthenticationFilter.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\security\SecurityService.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\security\AccessValidationInterceptor.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\security\AccessAuthorizationService.java` |
| `C:\workspace\ge\bo-api\src\main\resources\application*.yml` |

### 4. 로그인 제어 (bo-api)

| 파일 |
|------|
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\service\LoginAdminService.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\security\LoginRateLimitFilter.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\service\RecaptchaService.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\service\TotpService.java` |

### 5. 로그인 이력 (bo-api)

| 파일 |
|------|
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\service\LoginLogService.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\controller\LoginLogController.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\entity\LoginLog.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\repository\LoginLogRepository.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\dto\LoginLogResponse.java` |
| `C:\workspace\ge\bo-api\src\main\java\com\ge\bo\dto\LoginLogDetailResponse.java` |

---

## 카테고리 정의 (A~J)

`docs/보안성검토/ckecklist.md`(fo 기준 30개 항목)를 **내부 관리자 로그인** 맥락으로 재정의했다.
fo 전용 항목(리드캡처 폼, 쿠키 동의 배너, 다운로드센터 등)은 로그인 도메인에 해당하지 않으므로
G / I / J 를 인증 도메인 항목으로 치환했다.

| 코드 | 카테고리 | 세부 점검 항목 |
|------|---------|---------------|
| **A** | 인젝션 / XSS | 로그인 ID·비밀번호·OTP 입력이 쿼리/HTML/로그에 안전하게 반영되는지, JPQL/네이티브 쿼리 문자열 결합 유무, `dangerouslySetInnerHTML` 사용 유무, 에러 메시지에 입력값 반사(Reflected XSS) 유무 |
| **B** | 인증 / 인가 | 인증 우회 경로(permitAll 범위 과다), 비밀번호 검증 로직의 논리 결함(NULL 해시·SSO 전용 계정 처리), TOTP 단계 우회, 토큰 발급 시점(2FA 이전 발급 여부), 권한 상승(IDOR — 타 계정 TOTP 설정/해제) |
| **C** | 민감정보 노출 | JWT 시크릿·reCAPTCHA 시크릿·DB 비밀번호의 하드코딩/기본값, 응답 DTO의 과다 필드 노출(password_hash, TOTP secret 등), 스택트레이스 노출, `NEXT_PUBLIC_` 오용, 클라이언트 저장소(localStorage/쿠키) 토큰 보관 방식 |
| **D** | 설정 보안 (헤더·CORS·프록시) | CORS allowedOrigins 와일드카드/credentials 조합, 보안 헤더(HSTS, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Permissions-Policy), CSP 존재 및 `unsafe-inline`, reCAPTCHA 등 외부 호출(SSRF 관점), 프록시/rewrite 대상 오염 가능성 |
| **E** | 오픈 리다이렉트 / CSRF / Clickjacking | 로그인 성공 후 redirect 파라미터 검증, `router.push`/`window.location`에 사용자 입력 유입, CSRF 방어(토큰 저장 방식에 따른 필요성 판단, `csrf().disable()` 정당성), 로그인 화면 iframe 삽입 가능성 |
| **F** | 입력 검증 / 봇방어 / Rate Limiting | `@Valid`·Bean Validation 적용 여부, 서버측 길이·형식 검증, reCAPTCHA 서버검증의 실제 강제 여부(우회 가능성), 로그인 시도 Rate Limiting(IP/계정 단위, 저장소, 리셋 조건), 계정 잠금 임계치·잠금 해제 정책 |
| **G** | 세션 / 토큰 수명주기 | JWT 알고리즘·시크릿 강도·만료시간, refresh token 유무 및 회전, 로그아웃 시 토큰 무효화(블랙리스트) 여부, 토큰 재사용/탈취 대응, 계정 비활성화·권한 변경이 기발급 토큰에 즉시 반영되는지, 동시 세션 제어 |
| **H** | 서드파티 / 공급망 | 인증 관련 외부 의존성(JJWT, TOTP 라이브러리, BCrypt, reCAPTCHA SDK, CTP 연동) 버전·알려진 취약점, lockfile 커밋 여부, 외부 인증 시스템(CTP) 신뢰 경계 |
| **I** | 로깅 / 감사추적 | 로그인 성공·실패 이벤트 기록 여부와 기록 항목(IP, UA, 시각), 로그에 비밀번호·토큰 평문 기록 여부, 로그 조회 API의 접근 권한, 로그 위변조/삭제 가능성, 로그 인젝션(CRLF) |
| **J** | 계정 관리 정책 | 비밀번호 해시 알고리즘·강도(BCrypt rounds), 비밀번호 복잡도·변경 주기 정책, 기본/초기 계정 존재 여부, 2FA(TOTP) 강제 범위, 비활성 계정(`is_active`) 처리, `password_hash` NULL 계정(SSO 전용)의 로그인 차단 보장 |

---

## 발견 이슈

집계: **Critical 1건 / Warning 17건(B-4 수정완료 1건 포함) / Info 11건 / UNPROVEN 0건**

### Critical

| # | 파일:라인 | 영역 | 카테고리 | 내용 |
|---|-----------|------|---------|------|
| **CR-1** | `bo-api\src\main\java\com\ge\bo\security\AccessAuthorizationService.java:35, 84-92` | 3. JWT/보안설정 | B | **메뉴 단위 인가를 헤더 한 줄로 전부 우회 가능.** BO의 메뉴 권한 검사는 이 클래스가 유일한데, 검사 대상이 "실제 요청한 API 주소"가 아니라 **클라이언트가 직접 채워 보내는 `X-Menu-Path` 헤더 값**이다. 헤더 값과 실제 호출 URL을 연결하는 코드가 어디에도 없다. 게다가 90~92행은 그 값이 `/admin/widgetSub/`로 시작하면 메뉴 검사를 통째로 `return`한다.<br>공격 시나리오: 권한이 제한된 관리자로 정상 로그인 → 권한 없는 API를 호출하면서 헤더에 `X-Menu-Path: /admin/widgetSub/anything`만 추가 → `X-Site-Id`만 맞으면 메뉴 인가가 생략되고 컨트롤러까지 통과. DB 실측상 `is_system=false`(=이 검사를 실제로 받는) 역할 소속 계정이 11명 존재하므로 이론상 얘기가 아니다.<br>연계: FE 이슈 B-1(`bo_is_system` 쿠키 가드 우회)의 "실질 피해가 화면 껍데기 수준에 그친다"는 근거가 바로 이 서버측 인가인데, 그 인가 자체가 우회 가능하므로 두 이슈가 결합하면 영향 범위가 커진다. |

### Warning

| # | 파일:라인 | 영역 | 카테고리 | 내용 |
|---|-----------|------|---------|------|
| **B-1** | `bo\src\middleware.ts:82-87` / `bo\src\store\auth-store.ts:39` | 1. 로그인 화면 | B | middleware가 SYSTEM_ADMIN 전용 경로(`/admin/system`, `/admin/database`, `/admin/settings/users`, `/admin/settings/roles`)를 `bo_is_system` 쿠키 값만으로 판단. 이 쿠키는 `auth-store.ts:39`에서 `document.cookie`로 설정하는 **비-httpOnly** 쿠키라, 콘솔에 `document.cookie='bo_is_system=true; path=/'` 한 줄로 우회된다. 추가로 `middleware.ts:62` 주석은 "클라이언트 가드(SystemAdminGuard)가 2차 보호 담당"이라 적혀 있으나 **`SystemAdminGuard` 컴포넌트는 코드베이스에 존재하지 않는다**(grep 결과 이 주석 1건만 매칭) — 다음 개발자가 실재하지 않는 방어를 근거로 오판할 소지. |
| **C-1** | `.claude\CLAUDE.md:189` | 1. 로그인 화면 | C | 관리자 계정 `comlbg`의 **평문 비밀번호가 git 추적 파일에 커밋**되어 있음(`git ls-files` 확인). 저장소 접근 권한이 있는 누구나 BO 관리자로 즉시 로그인 가능. 동일 계정/비밀번호가 dev·staging에 존재하면 그 환경은 그대로 뚫린다. 운영에도 같은 값이 살아있다면 Critical. git 히스토리에도 남아 있으므로 문서 제거만으로는 부족하고 계정 비밀번호 교체 필요. |
| **C-2** | `bo\.env.local:4` | 1. 로그인 화면 | C | 파일 1행 주석은 "git 미추적"이라 적혀 있으나 **실제로는 추적 중**(`git ls-files` = `.env.local`, 커밋 `480b3fd`, `f3f2b17`). `.gitignore:34`의 `.env*` 규칙은 이미 추적된 파일에 적용되지 않는다. 현재 실 Google Maps API 키(`AIza…`)가 커밋된 상태. 더 큰 문제는 패턴 — 추적 중임을 모르는 상태라 다음에 서버 시크릿을 추가하면 그대로 커밋된다. |
| **F-1** | `bo\.env.local:8` / `bo\src\components\auth\login-form.tsx:250` | 1. 로그인 화면 | F | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`가 Google 공개 **reCAPTCHA v2 테스트 키**. 테스트 키 쌍은 검증이 항상 성공하므로 현재 BO 로그인에 자동화 무차별대입 방어가 사실상 없다. 운영 배포 전 실 키 교체가 안 되면 그 시점에 Critical. |
| **F-2** | `bo-api\src\main\resources\application-local.yml:80` | 3. JWT/보안설정 | C/F | 위 F-1의 서버측 짝. `recapchaKey: ${RECAPTCHA_SECRET:6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe}` — Google 공개 테스트 시크릿이 **폴백 기본값으로 하드코딩**되어 환경변수 미설정 시 자동 적용된다. 어떤 토큰을 보내도 `success=true`. |
| **G-1** | `bo\src\store\auth-store.ts:39,56` | 1. 로그인 화면 | G | `bo_is_system` 쿠키에 `Secure` 플래그 없음(`SameSite=Strict`만 지정). HSTS가 적용되어 있어 심각도는 낮으나 평문 HTTP 폴백 시 관리자 권한 플래그가 노출된다. |
| **F-3** | `bo-api\...\service\LoginAdminService.java:25-27` + `AuthService.java:162-167` | 4. 로그인 제어 | F/J | **로그인하지 않은 외부인이 BO 관리자 계정을 영구히 잠글 수 있다.** 비밀번호 5회 오류 시 `admin.setActive(false)`가 되고, 해제 수단은 SYSTEM_ADMIN의 수동 재활성화뿐(`AdminService.java:146-156`). `AdminUser`에 `lockedUntil` 컬럼이 있으나 **잠글 때 값을 넣는 코드가 없고 성공 시 null로 지우기만** 한다(`TotpService.java:120,152,199,232`) → 시간 경과 자동 해제가 없다. 관리자 로그인 ID(운영에서는 사번)를 아는 사람이 계정당 5회씩 요청하면 전 관리자를 잠글 수 있다. |
| **F-4** | `bo-api\...\security\LoginRateLimitFilter.java:30, 32, 44` | 4. 로그인 제어 | F | Rate Limit 분당 100회는 F-3 계정 잠금 공격을 막기에 부족. 버킷이 `ConcurrentHashMap` 인메모리(32행)라 ① 재기동 시 카운터 초기화 ② 다중 인스턴스 배포 시 인스턴스 수만큼 배수 허용 ③ IP 엔트리 미제거로 무한 증가. 키가 `getRemoteAddr()`(44행)이라 XFF 위조 우회는 불가한 점은 정상이지만, 반대로 리버스 프록시 뒤에서는 전체 사용자가 하나의 버킷을 공유한다. |
| **D-1** | `bo-api\src\main\resources\application.yml:5` + `ExternalApiClient.java:44-48, 56-59, 121-136` | 3. JWT/보안설정 | D | **기본 활성 프로파일이 `developer`이고, 그 프로파일은 외부 HTTPS 인증서 검증을 전면 해제**한다(모든 인증서 신뢰 TrustManager + `HostnameVerifier -> true`). 이 클라이언트는 reCAPTCHA 검증(`RecaptchaService`)과 CTP OAuth 토큰 발급(`CtpAuthService` — client_secret 전송)에 그대로 쓰인다. 중간자가 인증서를 갈아끼워도 탐지되지 않아 reCAPTCHA 결과 조작·CTP client_secret 탈취가 가능하다. |
| **C-3** | `bo-api\...\common\client\ExternalApiClient.java:79, 93-94` + `application-developer.yml:67` | 3. JWT/보안설정 | C | **로그 파일에 reCAPTCHA 시크릿과 CTP client_secret이 평문으로 남는다.** 79행이 요청 body 전체를, 93~94행이 응답 body 전체를 DEBUG로 출력. developer 프로파일은 `com.ge.bo: DEBUG`이며 logback의 `<springProfile name="dev,!local">` 분기로 `C:/app/logs/bo-api.log`에 기록되는데, **마스킹 컨버터(`%maskedMsg`)는 local 프로파일에만 적용**된다(logback-spring.xml:13 vs 58). 결과적으로 `secret=<reCAPTCHA 시크릿>`, `client_secret`, `access_token`이 파일에 쌓인다. |
| **H-1** | `bo-api\src\main\java\com\ge\bo\sso\SsoClient.java:33, 47-53` + `LseSsoService.java:26-28` | 2. 인증 API | C/H | **SSO 로그인 시 사용자의 실제 비밀번호가 URL 쿼리스트링으로 전송된다.** `makeEncPwd()`는 원문 비밀번호 앞뒤에 아이디 길이 기반 문자를 덧붙일 뿐 암호화가 아니며(`SsoCryptoUtil.java:10-18`), 그 값이 `tripledes.do?key=LSeWPwork&val=<비밀번호>&mode=E` 형태의 **GET 파라미터**로 나간다. HTTPS라 전송 중 노출은 없으나 쿼리스트링은 SSO 측 웹서버·프록시 액세스 로그에 원문 그대로 적재된다. 키 `LSeWPwork`도 소스 하드코딩(14행). LSE SSO 연동 규격에서 비롯된 것으로 보여 bo-api 단독 수정이 어려울 수 있으므로 **규격 협의 대상**으로 기록. |
| **G-2** | `bo-api\src\main\resources\application.yml:32` + `AuthService.java:230, 414` + `TotpService.java:33` | 2. 인증 API | G | **액세스 토큰 실제 유효기간이 24시간인데 코드/응답은 1시간으로 취급.** `app.jwt.expiration: 86400`(초)=24h인데 주석은 "1시간", 응답 DTO의 `expiresIn`은 하드코딩 3600. 여기에 로그아웃 시 토큰 무효화 수단이 없어(`logoutWithJwt()`는 refreshToken 쿠키만 삭제) **탈취된 액세스 토큰이 최대 24시간 유효**하다. 블랙리스트/jti 부재. |
| **G-3** | `bo-api\...\security\JwtAuthenticationFilter.java:36-46` | 3. JWT/보안설정 | G | 서명 검증 후 `role` 클레임을 그대로 신뢰하고 DB를 재조회하지 않는다. 관리자를 비활성화하거나 역할을 강등해도 기발급 토큰은 만료(G-2 기준 최대 24시간)까지 기존 권한으로 동작한다. |
| **B-2** | `bo-api\src\main\java\com\ge\bo\config\SecurityConfig.java:94-97, 137-140` | 3. JWT/보안설정 | B | **인증 없이 호출 가능한 배치 트리거 4개.** `/api/v1/contents-batch/run-all`, `/catalog/run`, `/ssq/run`, `/certi/run`이 permitAll이고 컨트롤러 메서드에 `@PreAuthorize`도 없다(`ContentsBatchController.java:50, 59, 68, 81`). 누구나 POST 한 번으로 전체 콘텐츠 배치를 반복 기동해 DB 부하를 유발하거나 콘텐츠 테이블을 원천 데이터로 덮어쓸 수 있다. 같은 컨트롤러의 조회 API는 `isSystemAdmin`으로 막혀 있어 실행 API만 열린 비대칭 상태. |
| ✅ **B-4** | `bo-api\...\controller\MenuController.java` / `CodeController.java` / `SiteController.java` / `MessageResourceController.java` | 3. JWT/보안설정 | B | **공통시스템 4개 컨트롤러의 쓰기 API에 `@PreAuthorize`가 전무해, 로그인만 하면 어떤 역할이든 메뉴·공통코드·사이트·다국어를 생성/수정/삭제할 수 있었다.** `SecurityConfig.java:109,152`의 `anyRequest().authenticated()`만 통과하면 컨트롤러까지 도달하고, 메뉴 인가는 CR-1의 `X-Menu-Path: /admin/widgetSub/…` 프리픽스로 우회된다. `AdminController:22`·`RoleController:20` 등 동급 관리 API가 클래스 레벨 `isSystemAdmin`으로 막혀 있는 것과 비대칭 상태였다. — ✅ **수정 완료(2026-08-10)**: 4개 컨트롤러의 **쓰기 매핑(POST/PUT/PATCH/DELETE) 18개**에만 메서드 레벨 `@PreAuthorize("@securityService.isSystemAdmin(authentication) or hasAnyRole('SUPER_ADMIN','OP_ADMIN')")` 추가. GET은 로그인 전 i18n 로드(`GET /message-resources` permitAll)·사이드바 메뉴 트리·공통코드 드롭다운 등 공용 소비처가 많아 의도적으로 제외했다. 허용 대상은 SYSTEM_ADMIN(`role.is_system=true`) + SUPER_ADMIN + OP_ADMIN 3개이며, 그 외 커스텀 역할은 차단된다. **실측 검증**: dev DB의 SUPER_ADMIN 계정 1건(id=5 `adminpjj`)을 임시로 역할·비밀번호 변경 후 **실제 로그인 API로 발급받은 정상 토큰**(JWT 위조 없음)으로 재현 — 수정 전 구동 인스턴스에서 비특권 역할 `SS`가 `POST /message-resources` 200(id 1473), `POST /codes` 201(id 66), `PATCH /menus/2/sort` 200, `PATCH /sites/1` 200으로 전부 관통했으나, bo-api 재기동 후 동일 요청 5건이 모두 `403 FORBIDDEN`. 대조군으로 SUPER_ADMIN·SYSTEM_ADMIN 토큰은 같은 쓰기 API 4종이 전부 200 유지, 역할 `SS` 토큰의 GET 6종(`/menus?type=BO`, `/codes`, `/sites`, `/sites/1`, `/menus/2`, `/message-resources`)과 비로그인 `GET /message-resources`도 전부 200으로 회귀 없음 확인. 테스트에 사용한 계정·데이터는 전량 원복(비밀번호 해시 md5 지문 일치, 생성 레코드 6건 삭제). **잔여**: 승인된 표현식이 OP_ADMIN을 허용 목록에 포함하므로 OP_ADMIN의 쓰기는 그대로 200이다(실측 확인, 설계상 의도). |
| **B-3** | `bo-api\src\main\java\com\ge\bo\service\AuthService.java:326` | 2. 인증 API | B | **SSO 로그인 실패 메시지로 계정 존재 여부 식별 가능.** 로컬 로그인 경로는 아이디 없음/비밀번호 오류를 단일 메시지로 통일해 정상이나, SSO 경로는 로컬 DB에 계정이 있을 때만 `"비밀번호 N회 실패 하셨습니다…"`를 반환한다. 어떤 사번이 BO 관리자로 등록됐는지 골라낼 수 있고, 이는 F-3 계정 잠금 공격의 대상 선별에 그대로 쓰인다. |
| **G-4** | `bo-api\src\main\java\com\ge\bo\service\AuthService.java:266-276, 278-287` | 2. 인증 API | G | 7일짜리 refreshToken 쿠키가 `secure(false)` 하드코딩("운영 환경에서는 true로 변경" 주석 잔존). 현재 dev 프로파일은 `ls.redis-enabled=true`라 세션 방식을 타므로(SESSION 쿠키는 `application-dev.yml:50`에서 `secure: true`) 실제 영향은 JWT 모드(local/developer)에 한정. |

### Info

| # | 파일:라인 | 영역 | 카테고리 | 내용 |
|---|-----------|------|---------|------|
| I-1 | `bo\src\app\admin\_login\page.tsx:1-5` | 1 | B | `login/page.tsx`와 완전히 동일한 사본. App Router의 `_` 접두 폴더는 private folder라 라우팅에서 제외되므로 보안 이슈는 아니나, 방치 시 원본과 갈라져 혼동을 유발하는 죽은 코드. |
| I-2 | `bo\next.config.ts:32` / `bo\src\middleware.ts:33` | 1 | D | CSP가 `frame-ancestors 'self'`만 정의. `script-src`/`object-src`가 없어 XSS 완화용 CSP로는 동작하지 않는다(Clickjacking 방어 목적으로는 충분). nonce 기반 CSP 도입은 별도 과제 규모. |
| I-3 | `bo\src\components\auth\login-form.tsx:213-234` | 1 | J | ID/비밀번호 input에 `autoComplete`(`username`/`current-password`) 미지정. 공용 PC에서 자동완성 저장 정책을 제어하지 못함. |
| I-4 | `bo\src\components\layout\header.tsx:161-171` | 1 | G | 로그아웃 시 React Query 캐시를 `["menus","nav"]`만 제거하고 `queryClient.clear()`를 호출하지 않는다. `router.push`(SPA 이동)라 리로드가 없으므로 같은 탭에서 다른 관리자로 재로그인하면 이전 관리자 화면 캐시가 리패치 전까지(staleTime 60초) 잠깐 보일 수 있다. |
| I-5 | `bo\package.json:44` | 1 | H | `pg`(PostgreSQL 드라이버)가 프론트 의존성에 있으나 `src/` 내 import 0건, Route Handler도 0건이라 현재 노출 경로 없음. 미사용 의존성 정리 권장. |
| I-6 | `bo-api\...\service\TotpService.java:214-232, 136-160` | 4 | B | 2FA 검증 단계에서 `admin.isActive()`를 재확인하지 않는다. tempToken 유효 10분이라, 1단계 통과 직후 10분 내에 계정이 비활성화되면 그 사이 2FA를 마치고 정상 토큰을 받을 수 있다. 창이 좁고 유효한 비밀번호가 선행 조건이라 Info. |
| I-7 | `bo-api\...\service\AdminService.java:87` | 2 | J | 관리자 생성 시 임시 비밀번호가 `UUID.randomUUID().toString().substring(0,12)`이고, **비밀번호 변경 API가 컨트롤러 어디에도 없다**(전수 grep `password` 매치 0건). 로컬 BCrypt 로그인 모드에서는 최초 임시 비밀번호가 영구 비밀번호가 되며 복잡도·변경주기·최초 로그인 시 변경 강제가 전혀 없다. 운영(dev/prd)은 `isApiLogin: true`(SSO)라 영향은 local/developer 모드 한정. |
| I-8 | `application-local.yml:79`, `application-developer.yml:91` | 3 | C | Google Maps API 키가 소스 하드코딩되어 git 커밋됨. 브라우저 노출형 키 성격이라 심각도는 낮으나 HTTP 리퍼러 제한이 없으면 과금 남용 가능. (`application-local.yml:8`의 `DB_PASSWORD:1234` 폴백은 로컬 DB 한정) |
| I-9 | `bo-api\src\main\java\com\ge\bo\dto\TotpDto.java` 전체 | 2 | F | TOTP 3개 엔드포인트의 요청 DTO에 Bean Validation이 없고 컨트롤러에도 `@Valid`가 없다(`AuthController.java:65, 74-75, 93-94`). `totpCode`는 라이브러리 검증기로만 들어가 인젝션 위험은 없어 Info. 대조적으로 `/login`은 `@Valid` + `@NotBlank/@Size/@Pattern(^[a-zA-Z0-9]+$)` 적용. |
| I-10 | `bo-api\...\config\DataInitializer.java:26-28` | 3 | J | 고정 비밀번호 시드 계정(`admin@ge.com` / `P@ssw0rd123`) 생성 코드는 **주석 처리되어 실행되지 않음**. 실제 위험 없으나 평문 비밀번호 문자열이 소스에 남아 있어 정리 대상. C-1과 동일한 비밀번호 값. |
| I-11 | `bo-api\src\main\java\com\ge\bo\service\AuthService.java:161` | 2 | B | BCrypt cost 12가 사용자 존재 시에만 실행되어 응답 시간 차이로 이론상 사용자 열거 오라클이 된다. 다만 B-3의 메시지 차이가 훨씬 실용적인 경로라 Info로만 기록. |

---

## 기준선 충족 확인된 항목 (이번 검토에서 문제없음으로 실증)

- 액세스 토큰을 Zustand **메모리에만** 보관, `localStorage`/`sessionStorage` 사용 0건(`src/` 전수 grep) → XSS 시 토큰 탈취 표면이 실제로 없음
- `api.ts:61-72`의 `refreshPromise` 단일화로 동시 401 시 refresh 중복 실행 방지, `finally`에서 null 복구까지 정상
- 보안 헤더가 `next.config.ts`와 `middleware.ts` **양쪽에** 동일 적용되어, 미들웨어가 직접 생성하는 400 응답에도 헤더가 누락되지 않음
- 로그인 성공 후 이동 경로가 `/admin/dashboard` 하드코딩 → 오픈 리다이렉트 원천 차단
- 인증 관련 프론트 컴포넌트 전체에 `console.*` 0건
- `ClientIpUtils`가 X-Forwarded-For를 의도적으로 배제하고 `getRemoteAddr()`만 사용(주석에 근거 명시) → IP 위조로 RateLimit/이력 조작 불가
- `LoginLogController`에 클래스 레벨 `@PreAuthorize("@securityService.isSystemAdmin(authentication)")` → 일반 관리자가 타인 로그인 이력 열람 불가
- 로그인 이력 조회는 JPA Criteria(`Specification`) 기반이라 문자열 결합 SQL 없음, `LIKE` 값도 파라미터 바인딩
- `GlobalExceptionHandler`가 스택트레이스/원문 예외 메시지를 응답에 넣지 않고 로그에만 기록
- CORS `allowedOrigins`가 전 프로파일에서 명시적 화이트리스트(와일드카드 없음) → `allowCredentials(true)` 조합도 안전
- TOTP tempToken은 `type=TOTP_PENDING` 클레임을 강제 검증(`JwtTokenProvider.java:105-111`), 이메일을 요청 본문이 아닌 토큰/세션에서만 추출 → IDOR 불가
- TOTP 오입력 3회 제한 + `REQUIRES_NEW` 트랜잭션으로 실패 카운트 분리 커밋(롤백으로 카운터가 지워지는 문제 회피)
- `app.jwt.secret: ${JWT_SECRET}`에 폴백 기본값 없음 → 시크릿 미설정 시 조용히 약한 값으로 기동하는 사고 방지
- jjwt 0.12.6이 `parseSignedClaims` + `verifyWith` 사용 → alg=none / JWS-JWE 혼동 공격 차단, HMAC 키 256비트 미만이면 부팅 시 예외로 약한 시크릿 강제 차단
- 의존성: Spring Boot 3.5.0 / jjwt 0.12.6 / totp 1.7.1 / bucket4j 8.14.0, next 16.1.6 / react 19.2.3 / axios 1.13.6 / zustand 5.0.11 — 인증 관련 알려진 취약 버전 없음, lockfile 커밋됨

---

## 조치 우선순위 (권고)

| 순위 | 항목 | 근거 |
|------|------|------|
| 1 | **CR-1** X-Menu-Path 헤더 기반 인가 + widgetSub 프리픽스 예외 | 유일한 메뉴 인가 계층이 무력화됨. B-1(FE 가드 우회)과 결합 시 영향 확대 |
| 2 | **F-3 + F-4** 계정 영구 잠금 + 느슨한 RateLimit 조합 | 미인증 외부인이 전 관리자 계정을 잠글 수 있는 실행 가능한 DoS. B-3(계정 열거)이 대상 선별을 도움 |
| 3 | **C-1** git 커밋된 평문 관리자 비밀번호 | 문서 제거 + 계정 비밀번호 교체 동시 필요(히스토리 잔존) |
| 4 | **D-1 + C-3** developer 기본 프로파일의 TLS 검증 해제 및 시크릿 DEBUG 로깅 | 기본값이 위험한 쪽이라 무설정 배포 시 자동 노출 |
| 5 | **F-1 + F-2** reCAPTCHA 테스트 키(FE site key / BE secret key 쌍) | 운영 배포 전 미교체 시 그 시점에 Critical |
| 6 | **B-2** 인증 없는 배치 트리거 4개 | 데이터 덮어쓰기 + DB 부하 |
| 7 | **G-2 + G-3** 24시간 토큰 + 무효화 수단 부재 + 권한 변경 미반영 | 탈취/강등 후 최대 24시간 잔존 |
| 8 | 나머지 Warning(C-2, B-1, G-1, G-4, H-1) 및 Info 11건 | — |

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-10 | 매트릭스 최초 작성. DB 메뉴 조회로 범위 확정(로그인=비메뉴 고정 라우트), 5개 영역 × A~J 정의 |
| 2026-08-10 | **B-4 수정 완료** — Menu/Code/Site/MessageResource 4개 컨트롤러 쓰기 메서드 18개에 `@PreAuthorize` 적용. bo-api 재기동(`Started BoApplication in 55.155 seconds`) 후 실제 로그인 토큰 기반 before/after 재현으로 403 전환·GET 무영향·SUPER_ADMIN/SYSTEM_ADMIN 정상 동작 확인. 매트릭스 셀 3행 B열은 CR-1·B-2가 미해결이므로 **FAIL 유지** |
| 2026-08-10 | bo-security-reviewer(영역1) / java-security-reviewer(영역2~5) 병렬 검토 완료. 50셀 전부 판정(PASS 35 / FAIL 14 / N/A 1). Critical 1, Warning 16, Info 11 기록. 사전 의심 가설 5건은 실제 코드 확인 결과 모두 기각 |
