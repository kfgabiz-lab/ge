# BO 공통시스템 보안성검토 매트릭스

> 작성일: 2026-08-06
> 대상: bo (관리자 프론트) `공통시스템`(메뉴 id=212) 하위 전체
> 체크리스트 카테고리(A~J)는 `docs/보안성검토/ckecklist.md`(fo용)와 동일한 분류 체계를 재사용하되, 세부 항목은 BO(내부 관리자 도구) 맥락에 맞게 검토한다.
> 표기: `PASS`(이상없음) / `FAIL`(이슈발견, 상세는 각주로) / `-`(미분석) / `N/A`(해당사항 없음)

---

## 매트릭스

| 체크리스트 | 사용자 관리 | 권한 관리 | 사이트 관리 | 메뉴 관리 | 에러 로그 | 트랜잭션 로그 | 접속 로그 | 이메일 발송 이력 | 이메일 발송 내역 | 검색 관리 | 공통코드 관리 | 다국어 관리 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A. 인젝션 / XSS | - | - | - | - | - | - | - | - | - | - | - | - |
| B. 인증/인가 (IDOR 포함) | - | - | - | - | - | - | - | - | - | - | - | - |
| C. 민감정보 노출 | - | - | - | - | - | - | - | - | - | - | - | - |
| D. 서버측 요청위조/설정 보안 | - | - | - | - | - | - | - | - | - | - | - | - |
| E. 오픈 리다이렉트/CSRF/Clickjacking | - | - | - | - | - | - | - | - | - | - | - | - |
| F. 입력 검증/비즈니스 로직 남용 | - | - | - | - | - | - | - | - | - | - | - | - |
| G. 검색/조회 기능 안전성 | - | - | - | - | - | - | - | - | - | - | - | - |
| H. 서드파티/공급망 | - | - | - | - | - | - | - | - | - | - | - | - |
| I. 캐시/가용성 | - | - | - | - | - | - | - | - | - | - | - | - |
| J. 개인정보/컴플라이언스 | - | - | - | - | - | - | - | - | - | - | - | - |

---

## 대상 페이지 경로

| 메뉴 | 경로 |
|---|---|
| 사용자 관리 | `/admin/settings/users`, `/admin/settings/users/[id]` |
| 권한 관리 | `/admin/settings/roles`, `/admin/settings/roles/[id]` |
| 사이트 관리 | `/admin/settings/sites`, `/admin/settings/sites/[id]` |
| 메뉴 관리 | `/admin/settings/menus` |
| 에러 로그 | `/admin/logs/error`, `/admin/logs/error/[id]` |
| 트랜잭션 로그 | `/admin/logs/transaction`, `/admin/logs/transaction/[id]` |
| 접속 로그 | `/admin/logs/access`, `/admin/logs/access/[id]` |
| 이메일 발송 이력 | `/admin/logs/email`, `/admin/logs/email/[id]` |
| 이메일 발송 내역 | `/admin/widget/emailSendHis-list` |
| 검색 관리 | `/admin/manage/search`, `/admin/manage/search/[id]` |
| 공통코드 관리 | `/admin/settings/codes` |
| 다국어 관리 | `/admin/settings/i18n` |

> 참고: `이메일 발송 이력`(로그 관리 하위, `/admin/logs/email`)과 `이메일 발송 내역`(공통시스템 직속, `/admin/widget/emailSendHis-list`)은 DB상 별도 메뉴 항목으로 이름이 유사하나 다른 페이지다. 중복/레거시 여부는 분석 단계에서 별도 확인 필요.

## 카테고리(A~J) 정의 — BO 맥락

| 분류 | 정의 |
|---|---|
| A | Reflected/Stored/DOM XSS, `dangerouslySetInnerHTML`, SQL/NoSQL Injection(특히 공통코드/다국어처럼 자유 텍스트가 전체 화면에 재노출되는 데이터) |
| B | 인증 우회, 역할 상승(권한관리에서 자기 자신에게 SUPER_ADMIN 부여 등), IDOR(`[id]` 파라미터로 타 레코드 접근), `@PreAuthorize` 누락 |
| C | 비밀번호/토큰 등 민감정보가 응답 바디·로그·에러메시지에 노출되는지, 사용자관리 응답에 password hash 포함 여부 |
| D | bo-api 호출 시 CORS/CSRF 설정, 에러 응답의 스택트레이스 노출, 관리자 API 엔드포인트의 헤더 보안 |
| E | 로그인/로그아웃 리다이렉트에 사용자 입력 검증 없이 사용되는 곳, 관리자 화면 iframe 삽입 방지(Clickjacking) |
| F | 등록/수정 폼의 서버측 Bean Validation 여부, 파일 업로드(있다면) 확장자/크기 제한 |
| G | 검색 관리·로그 조회 시 검색어가 쿼리에 안전하게 반영되는지(Native Query 파라미터 바인딩 여부) |
| H | bo/bo-api의 `package.json`/`build.gradle` 의존성 취약점, lockfile 관리 |
| I | 캐시된 응답에 사용자별로 달라야 할 민감 데이터가 섞여 나가는지(다중 관리자 동시 접속 시나리오) |
| J | 접속 로그·트랜잭션 로그에 과도한 PII(비밀번호, 세션토큰)가 평문 저장되는지, 로그 보존기간/접근권한 |

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-06 | 매트릭스 최초 작성 (12개 메뉴 × 10개 카테고리) |
