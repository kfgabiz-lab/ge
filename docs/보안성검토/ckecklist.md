# fo 보안성검토 체크리스트

> 작성일: 2026-08-06
> 대상: fo (Next.js App Router, 외부 공개 홈페이지 — LS Electric America)
> 기준: OWASP Top 10 / Next.js 프레임워크 특화 취약점 / 공급망 보안 등 일반 웹 보안 표준
> 참고: `.claude/skills/nextjs-security/SKILL.md`, `.claude/agents/nextjs-security-reviewer.md`
> 사용법: 항목별로 소스 분석 후 상태를 갱신한다. (☐ 미착수 / 🔄 분석중 / ✅ 이상없음 / 🔴 이슈발견)

---

## A. 인젝션 / XSS

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 1 | Reflected/Stored/DOM-based XSS — 사용자 입력이 렌더링되는 모든 지점(검색어, 폼 입력, URL 파라미터) | ☐ | |
| 2 | `dangerouslySetInnerHTML` — 어떤 데이터 소스든 렌더링 전 새니타이즈 여부 | ☐ | |
| 3 | SQL/NoSQL Injection — fo→bo-api 호출 시 쿼리 파라미터가 그대로 전달되는 구조인지 | ☐ | |
| 4 | Command/Template Injection — 서버 사이드에서 외부 입력을 실행/템플릿 조합에 쓰는 곳 유무 | ☐ | |

## B. 인증/인가 (Authorization, IDOR)

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 5 | 동적 라우트(`[id]`, `[slug]`)의 파라미터로 타인의 리소스(문의내역, 다운로드 파일 등)에 접근 가능한지 (IDOR) | ☐ | |
| 6 | 관리자 전용/미공개 콘텐츠가 fo 공개 라우트로 노출되는 경로가 있는지 | ☐ | |
| 7 | Middleware가 있다면 "우회 가능한 유일한 방어선"으로 쓰이고 있지 않은지(서버 쪽 이중 검증 여부) | ☐ | |

## C. 민감정보 노출

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 8 | `NEXT_PUBLIC_` 환경변수에 진짜 시크릿(서버 전용 키)이 섞여있는지 | ☐ | |
| 9 | 서버 컴포넌트(RSC)가 API 응답을 그대로 클라이언트에 넘겨 불필요한 필드(내부 ID, 플래그 등)까지 노출하는지 (Over-fetch) | ☐ | |
| 10 | 에러 응답/콘솔에 스택트레이스·내부 경로·API 키 노출 여부 | ☐ | |
| 11 | 클라이언트 저장소(localStorage/sessionStorage/쿠키)에 민감정보 저장 여부 | ☐ | |

## D. 서버측 요청 위조/설정 보안 (SSRF, 프록시, 헤더)

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 12 | `next.config.ts`의 `images.remotePatterns` 와일드카드 허용 범위 | ☐ | |
| 13 | `rewrites()`/프록시 대상(bo-api URL)이 사용자 입력으로 오염될 수 있는 경로가 있는지 (SSRF) | ☐ | |
| 14 | 보안 헤더 존재 여부 — `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy` | ☐ | |
| 15 | CSP(Content-Security-Policy) 존재 여부, `unsafe-inline` 사용 여부 | ☐ | |

## E. 오픈 리다이렉트 / CSRF / Clickjacking

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 16 | `redirect()`, `router.push()`, `window.location`에 사용자 입력이 검증 없이 들어가는지 | ☐ | |
| 17 | 폼 제출(Server Action/API 호출)에 CSRF 방어(Origin 체크, 토큰 등) 여부 — GET 조회 위주라면 해당 없음 여부도 확인 | ☐ | |
| 18 | X-Frame-Options 부재로 인한 Clickjacking 가능성 | ☐ | |

## F. 폼/입력 검증 (비즈니스 로직 남용)

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 19 | Contact Us / Training Request / 뉴스레터 구독 등 리드캡처 폼의 서버측 입력 검증(스키마 검증) 여부 — 클라이언트 검증만 있고 서버 검증이 없는 경우 | ☐ | |
| 20 | reCAPTCHA 등 봇 방어가 실제로 우회 불가능하게 서버에서 검증되는지 (클라이언트에서만 체크하고 끝나면 무의미) | ☐ | |
| 21 | 폼 제출 Rate Limiting/스팸 방지 여부 | ☐ | |

## G. 검색/다운로드 기능

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 22 | AI 검색(Azure AI Search 등) 호출 시 사용자 검색어가 쿼리에 안전하게 반영되는지 | ☐ | |
| 23 | 다운로드센터에서 파일 경로/식별자 조작으로 비공개 자료 접근이 가능한지(Path Traversal/IDOR) | ☐ | |

## H. 서드파티/공급망

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 24 | 외부 스크립트(GA, GTM, Google Maps, 챗봇 등) 로드 방식 — CSP와의 정합성, 신뢰할 수 없는 출처 여부 | ☐ | |
| 25 | `package.json` 의존성 중 알려진 취약점 있는 패키지/오래된 메이저 버전 존재 여부 | ☐ | |
| 26 | lockfile 커밋 여부, CI에서 `npm audit` 등 의존성 점검 여부 | ☐ | |

## I. 캐시/가용성 관련 (Next.js 프레임워크 특화)

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 27 | Next.js 캐시 관련 알려진 이슈(캐시 포이즈닝류) 해당 버전 여부 — `next` 패키지 버전 확인 후 알려진 CVE 대조 | ☐ | |
| 28 | 정적/동적 렌더링 경계에서 개인화된 데이터가 캐시되어 다른 사용자에게 노출될 가능성 | ☐ | |

## J. 개인정보/컴플라이언스 (미국 공개 사이트 특성)

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 29 | 쿠키 동의(Cookie Consent) 배너 존재 및 실제 동작 여부 | ☐ | |
| 30 | Contact Us 등에서 수집하는 PII(이름/이메일/전화번호)의 전송 구간 암호화(HTTPS) 및 저장 방식(fo 자체 저장 여부 vs bo-api 위임) | ☐ | |

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-06 | 체크리스트 최초 작성 (30개 항목) |


## 수정
java-security-reviewer,  nextjs-security-reviewer,  세션 에이전트와 셋이서 동시에 교차검증