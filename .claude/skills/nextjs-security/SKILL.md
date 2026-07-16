---
name: nextjs-security
description: Next.js(App Router) 애플리케이션의 프레임워크 레벨 보안 이슈를 점검하는 체크리스트. Middleware 우회, RSC over-fetch, NEXT_PUBLIC_ 환경변수 노출, CSP, next/image SSRF, 오픈 리다이렉트, Route Handler 인증 등을 다룬다. 참고: GoldenWing-360/claude-security-skills의 nextjs-security 스킬을 프로젝트(fo) 맥락에 맞게 재구성.
---

# Next.js 보안 체크리스트

Next.js(App Router) 자체 구조에서 자주 발생하는 보안 이슈를 점검하는 스킬. 언어/벤더 불문 범용 항목이며, 리뷰 시 이 스킬을 참고 자료로 삼는다.

## 1. Middleware는 인증의 최종 결정권이 아니다
- Middleware는 성능 최적화 계층이지 보안 경계가 아니다 — 헤더 스머글링 등으로 우회 가능한 취약점 클래스가 존재한다.
- 보호되어야 하는 라우트/Route Handler는 middleware 통과 여부와 무관하게 **서버 쪽에서 다시 한번 인증/인가를 검증**해야 한다.

## 2. `NEXT_PUBLIC_` 환경변수 노출
- `NEXT_PUBLIC_` 접두사가 붙은 값은 빌드 시 클라이언트 번들에 그대로 박히므로 브라우저 DevTools에서 누구나 볼 수 있다.
- 발행 가능한(publishable) 값(사이트 URL, 도메인 제한된 공개 API 키)만 여기 두고, 진짜 시크릿(DB 비밀번호, 서버 전용 API 키)은 절대 `NEXT_PUBLIC_`로 노출하지 않는다.
- 점검: `grep -r 'NEXT_PUBLIC_' .next/static/chunks` 로 실제 번들에 무엇이 들어갔는지 확인 가능.

## 3. Server Actions 입력 검증 및 속도 제한 (해당 시)
- Server Action은 사실상 HTTP 엔드포인트와 동일하게 취급 — 스키마 검증(Zod 등), HTML 새니타이즈, 사용자/IP별 rate limit이 필요하다.
- 클라이언트가 넘긴 식별자(id 등)를 그대로 신뢰해 임의 레코드에 접근시키지 않는다 — 세션/권한 스코프로 한정된 조회인지 확인.

## 4. RSC(Server Component) Over-fetch
- 서버 컴포넌트가 DB/API에서 받은 객체를 그대로 클라이언트로 직렬화해 전달하면, UI에 필요 없는 민감 필드(비밀번호 해시, 내부 플래그 등)까지 브라우저로 넘어갈 수 있다.
- 응답 객체를 그대로 넘기지 말고 필요한 필드만 명시적으로 select/pick해서 전달한다.

## 5. Content Security Policy (CSP)
- App Router에서는 nonce 기반 CSP가 최신 권장 방식 — middleware에서 요청별 nonce를 생성해 `next/script`에 전달.
- `unsafe-inline`은 피하고, 불가피하면 이유를 문서화한다.

## 6. 오픈 리다이렉트 / 안전하지 않은 `redirect()`
- 사용자 입력을 그대로 리다이렉트 대상으로 쓰면 protocol-relative URL(`//evil.com`) 등으로 악용 가능.
- 안전 패턴: allowlist 검증 또는 `/`로 시작하는 상대경로만 허용, `//`로 시작하면 거부.

## 7. `next/image` remotePatterns — SSRF/이미지 리사이즈 증폭
- `remotePatterns`를 `hostname: '**'`처럼 지나치게 관대하게 설정하면 SSRF 및 이미지 리사이즈 증폭 공격에 노출.
- 실제로 필요한 구체적 도메인만 허용해야 한다.

## 8. Route Handler 인증 및 메서드 원칙
- API 라우트(Route Handler)는 명시적으로 보호하지 않으면 기본적으로 공개 상태 — 필요한 HTTP 메서드만 export, 요청 본문 크기 제한, CORS 에코 방지.

## 9. Edge vs Node 런타임
- Edge 런타임은 공격 표면은 작지만 일부 인증 라이브러리/암호화 폴리필과 호환성 문제가 있을 수 있다 — 런타임을 명시적으로 선택하고 이유를 남긴다.

## 10. 보안 헤더 기본값
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Permissions-Policy` 등을 서버 응답 헤더에 기본 설정.

## 11. 빌드/의존성 위생
- lockfile 커밋 필수(재현성), CI에서 `npm audit`(또는 동급) 실패 처리, Next.js는 caret 의존성 대신 패치 버전 고정.

## 12. `dangerouslySetInnerHTML` — CMS/에디터 출처 HTML도 예외 아님
- BO 관리자 화면에서 입력한 리치텍스트라도, 계정 탈취·에디터 취약점 등으로 악성 스크립트가 섞여 들어갈 가능성은 남아있다.
- 신뢰 경계가 "사이트 방문자 입력"이 아니라 "내부 CMS 콘텐츠"이더라도, 가능하면 DOMPurify 등으로 새니타이즈 후 렌더링하는 것이 이상적이다. 최소한 어떤 근거로 새니타이즈를 생략했는지(신뢰 경계 판단)는 문서화되어 있어야 한다.

---

참고 원본: [GoldenWing-360/claude-security-skills — nextjs-security](https://github.com/GoldenWing-360/claude-security-skills/blob/main/nextjs-security/SKILL.md)
