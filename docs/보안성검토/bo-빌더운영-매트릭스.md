# BO 빌더 운영 페이지 보안성검토 매트릭스

> 작성일: 2026-08-08
> 대상: bo(관리자 프론트) 빌더 **운영 페이지**(운영메뉴페이지) 런타임 + 이를 떠받치는 bo-api 런타임 엔드포인트
> 체크리스트 카테고리(A~J)는 `docs/보안성검토/ckecklist.md`(fo용)와 동일한 분류 체계를 재사용하되, 세부 항목은 BO(내부 관리자 도구) + 빌더 런타임 맥락에 맞게 재정의한다.
> 표기: `PASS`(이상없음) / `FAIL`(이슈발견, 상세는 하단 발견 이슈 참조) / `PARTIAL`(1차 조치 완료, 잔여 이슈 있음) / `-`(미분석) / `N/A`(해당사항 없음)

---

## 범위 확정 근거 (DB `menu` 조회 결과)

`menu` 테이블(`menu_type='BO'`, 119건)을 조회한 결과, 빌더로 만들어진 **운영 페이지**에 해당하는 메뉴는 URL이 `/admin/widget/{slug}` 또는 `/admin/widgetSub/{slug}` 형태인 항목들이다. 아래처럼 40여 개 메뉴가 존재하나, **이들은 전부 단 2개의 Next.js 동적 라우트(`/admin/widget/[slug]`, `/admin/widgetSub/[slug]`)가 DB 템플릿(`page_template.config_json`)을 읽어 렌더링하는 동일 코드 경로**다.

| 부모 메뉴 | 예시 자식 메뉴(일부) | URL 패턴 |
|---|---|---|
| DEMO(id=100) | 배너 테스트, Careers, Events, FAQ, 대리점, Articles, Press, 약관 관리, Blog, 보증정책, 제품 담당자, 제품-그룹, 제품 관리, Hero, 팝업 관리, 배너, 이메일 발송 내역 … (25건) | `/admin/widget/{slug}` |
| 테스트 요청(id=154) | 제품 관리, 제품-그룹, Hero, 팝업 관리, 배너, Blog, Press, Articles, Events, FAQ, 약관 관리, Warranty Policy, 제품 담당자, Curriculum 관리, Careers (16건) | `/admin/widget/{slug}` |
| 페이지 관리(id=190) / 메인(192) / Training(200) | Warranty Policy, Where to Buy, Articles, Press, Blog, Events, Careers, FAQ, 약관 관리, Hero, 제품-그룹, 배너, 팝업, Training 제품/Course/Session/신청내역 (19건) | `/admin/widget/{slug}` |
| 제품 관리(id=184) | 카테고리 관리, 제품 관리, 제품 담당자 (3건) | `/admin/widget/{slug}` |
| DEMO(id=100) | Training 관리 | `/admin/widgetSub/trainingMgmt-detail?id=1` |
| 공통시스템(id=212) | 이메일 발송 내역(비노출) | `/admin/widget/emailSendHis-list` |

따라서 **메뉴 40여 개를 각각 반복 리뷰하는 것은 동일 코드의 중복 검토**가 되므로, 매트릭스 행(row)은 "메뉴"가 아니라 **운영 페이지 런타임을 구성하는 실제 코드 단위 8개**로 잡았다. 어떤 메뉴를 열든 이 8개 구성요소를 모두 통과한다.

### 범위에서 제외한 것 (애매했던 부분)
- `/admin/templates/make/widget`, `/admin/templates/make/quick-detail`, `/admin/templates/make/quick-list` — **빌더 제작화면**. 프로젝트 용어상 "빌더미리보기/빌더템플릿"에 해당하며 "운영메뉴페이지"와 구분되므로 제외.
- `/admin/templates/builder-contents-layout` — 퍼블리싱 샘플 레이아웃. 운영 데이터 미연결이라 제외.
- `/admin/generated/*`(메뉴 id 68, 49, 67) — **라우트 디렉터리 자체가 bo 소스에 존재하지 않음(죽은 메뉴)**. 제외.

---

## 매트릭스

| 체크리스트 | 운영리스트페이지 | 운영상세페이지 | 런타임렌더러 | 런타임상태훅 | 템플릿조회API | 페이지데이터API | SlugEntity동적API | 파일업로드다운로드 |
|---|---|---|---|---|---|---|---|---|
| A. 인젝션 / XSS | PASS | PASS | PASS | PASS | PASS | PASS | FAIL | **FAIL** |
| B. 인증/인가 (IDOR 포함) | PARTIAL | PARTIAL | PARTIAL | PARTIAL | FAIL | **FAIL** | PASS | **FAIL** |
| C. 민감정보 노출 | PASS | PASS | FAIL | FAIL | FAIL | **FAIL** | FAIL | PASS |
| D. 서버측 요청위조/설정 보안 | PASS | PASS | PASS | FAIL | PASS | N/A | PASS | FAIL |
| E. 오픈 리다이렉트/CSRF/Clickjacking | PASS | PASS | PASS | N/A | PASS | PASS | PASS | PASS |
| F. 입력 검증/비즈니스 로직 남용 | PASS | FAIL | FAIL | FAIL | PASS | FAIL | PASS | **FAIL** |
| G. 검색/조회 기능 안전성 | PASS | N/A | FAIL | PASS | FAIL | FAIL | PASS | N/A |
| H. 서드파티/공급망 | PASS | PASS | PASS | PASS | PASS | PASS | UNPROVEN | UNPROVEN |
| I. 캐시/가용성 | PASS | PASS | FAIL | PASS | N/A | FAIL | PASS | FAIL |
| J. 개인정보/컴플라이언스 | UNPROVEN | UNPROVEN | FAIL | N/A | N/A | **FAIL** | FAIL | FAIL |

> **굵은 FAIL** = critical 이슈가 걸린 셀. 나머지 FAIL은 warning/info.
> B행의 `PARTIAL` 4개 셀(운영리스트/운영상세/런타임렌더러/런타임상태훅)은 2026-08-09 C1 1차 조치(전역 인가 인터셉터)로 "인가 전무" 상태는 해소됐으나, `X-Menu-Path`가 클라이언트 자율신고값이라 메뉴 단위 인가가 완결되지 않았고 menu.url 중복 데이터도 미정리 상태다(C1 상세 참조). 페이지데이터API B는 C3(groupId 삭제)·W2(단건 IDOR)가 그대로 남아 **FAIL** 유지.
> 셀 판정은 "그 구성요소 코드에서 확인된 사실" 기준이며, 이슈 하나가 여러 셀에 걸치는 경우가 있으므로 **건수는 아래 "발견 이슈"의 이슈 번호로 센다**(셀 개수 ≠ 이슈 건수).

---

## 대상 코드 경로

| 구성요소 | 경로 | 담당 리뷰어 |
|---|---|---|
| 운영리스트페이지 | `bo/src/app/admin/widget/[slug]/page.tsx` | bo-security-reviewer |
| 운영상세페이지 | `bo/src/app/admin/widgetSub/[slug]/page.tsx`, `bo/src/app/admin/widgetSub/Createboard/LayerPop.tsx` | bo-security-reviewer |
| 런타임렌더러 | `bo/src/app/admin/templates/make/_shared/components/renderer/**` (PageGridRenderer, WidgetRenderer, FieldRenderer, TableRenderer, TableCellRenderer, SubListRenderer, MultiSelectRenderer, CategoryRenderer, FormRenderer, SearchRenderer, TabRenderer, SpaceRenderer) | bo-security-reviewer |
| 런타임상태훅 | `bo/src/app/admin/templates/make/_shared/hooks/useWidgetPageState.ts`, `.../utils.ts`, `.../utils/entityApi.ts`, `.../utils/entityBuild.ts` | bo-security-reviewer |
| 템플릿조회API | `bo-api/.../controller/PageTemplateController.java` + service/repository | java-security-reviewer |
| 페이지데이터API | `bo-api/.../controller/PageDataController.java` + service/repository | java-security-reviewer |
| SlugEntity동적API | `bo-api/.../controller/SlugEntityController.java`, `.../service/SlugEntityService.java`, `.../service/SlugEntityCodeGenerator.java`, `.../service/SlugEntityCodeWriter.java`, 런타임 생성 컨트롤러 | java-security-reviewer |
| 파일업로드다운로드 | `bo-api/.../controller/PageFileController.java`, `.../controller/FileMetaController.java`, `.../common/file/**` | java-security-reviewer |

## 카테고리(A~J) 정의 — BO 빌더 런타임 맥락

| 분류 | 정의 |
|---|---|
| A | 템플릿 `config_json`에 담긴 운영자 입력(라벨/HTML/링크/셀 포맷)이 렌더러에서 `dangerouslySetInnerHTML` 등으로 실행되는지, entity 동적 API의 SQL 조립(네이티브 쿼리/식별자 보간) 인젝션, 코드 생성기(SlugEntityCodeGenerator)로의 Java 소스 인젝션 |
| B | 운영 페이지 라우트 접근 시 메뉴 권한 검증 여부, slug만 알면 임의 템플릿·임의 entity 데이터에 접근 가능한지(IDOR), `@PreAuthorize` 누락, 동적 생성된 entity 컨트롤러의 인가 |
| C | 템플릿/엔티티 응답에 내부 스키마·DB 컬럼·스택트레이스가 과도하게 노출되는지, 오류 메시지에 SQL/경로 노출 |
| D | 코드 생성/파일 쓰기 경로 조작(Path Traversal), 외부 URL 호출(next/image, 링크 필드), CORS/보안헤더, 런타임 코드 작성 기능 자체의 위험도 |
| E | 운영 페이지 내 링크/버튼 필드의 오픈 리다이렉트, 상태변경 API의 CSRF 보호(JWT 헤더 방식이면 N/A 판단 가능), 관리자 화면 Clickjacking 방지 |
| F | 저장/수정 시 서버측 Bean Validation, 필수/길이/타입 검증이 FE(hideCondition 등)에만 의존하는지, 대량 등록·삭제 남용 |
| G | 검색 위젯(entitySearch) 파라미터가 서버 쿼리에 안전하게 바인딩되는지, 정렬(orderBy)/페이지 사이즈 무제한 여부 |
| H | 렌더러가 쓰는 서드파티(TipTap/에디터/엑셀/파일) 라이브러리 취약점, lockfile |
| I | 템플릿 캐시가 사이트/권한 경계를 넘어 공유되는지, 대용량 조회로 인한 DoS |
| J | 운영 데이터에 포함된 PII(문의/신청 내역 등)의 목록 노출 범위, 엑셀 다운로드 시 마스킹 |

---

## 발견 이슈

심각도 기준: **critical** = 활성 BO 계정 1개(또는 비인증)로 실제 성립하고 데이터 유출/변조/삭제에 직접 도달 / **warning** = 성립하지만 전제조건이 높거나 영향이 제한적 / **info** = 위생·운영 품질.

### CRITICAL

**C1. 빌더 운영 페이지 데이터 API에 인가가 전혀 없음 (메뉴 권한이 사이드바 렌더링에만 존재)** — ⚠️ **1차 조치 완료(2026-08-09) / 완전 해결 아님**
- 셀: 운영리스트페이지 B / 운영상세페이지 B / 런타임렌더러 B / 런타임상태훅 B / 페이지데이터API B
- `[bo-api/.../controller/PageDataController.java]` 클래스·메서드 통틀어 `@PreAuthorize` **0건**(직접 grep 확인). 매핑 10개(`:57 search`, `:68 getById`, `:76 create`, `:85 update`, `:95 patchField`, `:104 delete`, `:116 deleteByPk`, `:128 findByGroupId`, `:139 deleteByGroupId`, `:157 export`) 전부 `SecurityConfig.java:152 anyRequest().authenticated()`만 통과하면 된다.
- `[bo-api/.../service/MenuService.java:373-389]` `resolveAllowedMenuIds()`(role_menu 권한)는 `:72`의 `getMenuTree(forNav=true)` 한 곳에서만 호출된다 — 즉 메뉴 권한은 "사이드바에 보일지"만 결정하고 인가에는 쓰이지 않는다.
- 프론트에도 대응물이 없다. `[bo/src/middleware.ts:4-12]` `SYSTEM_ADMIN_PATHS`에 `/admin/widget`, `/admin/widgetSub`가 **없고**, 유일한 가드인 `AuthProvider`는 `isLoggedIn` 불리언만 본다.
- 성립 경로: 활성 관리자 계정 1개(역할 무관, SYSTEM_ADMIN 불필요) → `GET /api/v1/page-templates`로 전 슬러그·필드 스키마 획득(→ W3) → `GET/POST/PUT/PATCH/DELETE /api/v1/page-data/{slug}`로 40여 개 운영 화면 데이터 전량 CRUD.

**▶ 1차 조치 내용 (2026-08-09)**
- 전역 인가 인터셉터를 신규 도입했다. `[bo-api/.../security/AccessAuthorizationService.java]`(신규) + `[.../security/AccessValidationInterceptor.java]`(신규) + `[.../config/WebMvcConfig.java]`(프로젝트 최초 도입). 검증 순서는 ① SYSTEM_ADMIN(`role.is_system=true`)이면 무조건 통과 → ② `X-Site-Id` 헤더로 `admin_user_site` 매핑 존재 확인(헤더 없으면 400 `SITE_ID_REQUIRED`, 매핑 없으면 403 `SITE_ACCESS_DENIED`) → ③ `X-Menu-Path` 헤더를 `menu.url`과 **최장 접두어 매칭**(세그먼트 경계 준수)해 메뉴를 찾고 `role_menu` 매핑 확인(헤더 없으면 400 `MENU_PATH_REQUIRED`, 메뉴 미해석 403 `MENU_NOT_FOUND`, 권한 없음 403 `MENU_ACCESS_DENIED`).
- 인터셉터는 **인증된 요청 전체**에 적용된다(미인증/anonymous는 통과 — permitAll 여부는 SecurityConfig가 이미 결정하므로 경로 목록을 이중 관리하지 않는 설계). 예외는 부트스트랩 GET 2건뿐: `GET /api/v1/admins/*/sites`, `GET /api/v1/menus`(사이드바·사이트선택 UI가 권한을 알기 전에 호출하는 API).
- FE는 `[bo/src/lib/api.ts]`에서 기존 `X-Site-Id`와 동일한 방식으로 `X-Menu-Path`를 전역 자동 부착한다.
- 기존 `[bo-api/.../controller/CurrDtlExportController.java]`의 로컬 `validateSiteAccess()` — 사이트만 검증하던 프로젝트 내 유일한 참조구현 — 을 제거하고 이 인터셉터로 통합했다.
- `[MenuRepository]`에 BO 메뉴 URL 조회 메서드 `findBoMenusWithUrlBySite` 신규 추가.
- 이로써 "메뉴 권한이 사이드바 렌더링에만 존재"하던 상태는 해소됐고, 최하위 권한 계정으로 `page-data`/`page-templates` 등을 무제한 호출하던 원래 성립 경로는 **사이트·메뉴 권한이 없는 계정 기준으로 차단**된다.

**▶ 실제 검증 결과 (curl + 브라우저)**
- SYSTEM_ADMIN 계정: 전 화면 회귀 없음 확인(인터셉터 즉시 통과 경로).
- SUPER_ADMIN(비-SYSTEM_ADMIN) 계정: 사이트 미배정 시 403 `SITE_ACCESS_DENIED`, 메뉴 미배정 시 403 `MENU_ACCESS_DENIED`, 헤더 누락 시 400이 각각 실제로 발생하는 것을 확인.
- 최장 접두어 매칭으로 `/settings/users/123` 같은 상세 경로도 상위 메뉴 권한으로 정상 통과함을 확인.

**▶ 조치 중 발견되어 함께 처리한 것**
1. `menu.url` 중복 데이터로 최장 길이 후보가 2개 이상이면 어느 메뉴 권한을 볼지 비결정적이 되는 문제 → 임의 선택 대신 **매칭 실패(403 `MENU_NOT_FOUND`)로 fail-safe** 처리(`AccessAuthorizationService.resolveMenuByPath`). 재검증 완료.
2. `/admin/widgetSub/{slug}`(위젯 상세/등록/수정 화면)에 대응하는 `menu` 행이 구조적으로 존재하지 않아 SYSTEM_ADMIN 외 전원 403(백지화면) → `X-Menu-Path`가 `/admin/widgetSub/`로 시작하면 **메뉴 체크만 스킵**(사이트 체크는 유지)하도록 예외 처리. 재검증 완료.

**▶ 남아 있는 것 (그래서 PASS가 아니다)**
1. **menu.url 중복 데이터 자체는 미정리.** `site_id=1` 기준 중복 등록된 url이 22개이며, 위 fail-safe 로직 때문에 이 중복 메뉴들은 SYSTEM_ADMIN 외 계정에게 전부 403이 난다. 실제로 SUPER_ADMIN 테스트 계정 기준 **사이드바 노출 화면의 약 59%가 이 사유로 403**이 발생했다. 사용자 결정: **이번 조치는 이대로 유지하고 데이터 정리는 별도 진행**.
2. **`X-Menu-Path`는 클라이언트 자율신고값이다.** API 엔드포인트와 메뉴를 서버측에서 강제 매핑하는 장치가 없으므로, 메뉴 권한을 하나라도 가진 계정이 그 메뉴 경로를 헤더에 넣고 다른 API를 호출하는 것까지는 막지 못한다. 사이트 경계(`admin_user_site`)는 확실히 강제되지만 **메뉴 단위 인가는 "완결"이 아니라 "1차 완화"**다.
3. **FE 미들웨어 가드와 이원화 상태.** `[bo/src/middleware.ts:4-12]`의 `SYSTEM_ADMIN_PATHS` 하드코딩 가드와 이번 `role_menu` 기반 인가가 별개로 동작해, `role_menu`로 허용된 사용자가 FE 미들웨어 레벨에서 막히는 불일치가 남아 있다. **기존부터 있던 문제이며 이번 작업이 만든 것이 아니고, 이번 범위에서 손대지 않았다.**
4. `/admin/widgetSub/{slug}`는 위 예외 처리로 메뉴 체크를 아예 건너뛰므로, **이 경로는 사이트 체크만 받고 메뉴 단위 인가 보호는 받지 못한다.**

**C2. 개인정보 전량 반출이 사유 없이, 흔적 없이 가능**
- 셀: 페이지데이터API C·J / 런타임렌더러 J
- `[bo-api/.../controller/PageDataController.java:165]` `reason`이 `required=false`. `[동:222]` `if (reason != null && !reason.isBlank())`일 때만 `downloadLogService.saveAsync()`를 호출하고, `[동:228~233]` reason이 없어도 응답은 200 + 파일이다. 즉 **파라미터를 빼면 다운로드는 되고 이력만 안 남는다.**
- `[bo-api/.../filter/TransactionLogFilter.java:38]` 감사 대상이 `POST/PUT/PATCH/DELETE`뿐이라 GET export는 트랜잭션 로그에도 안 남는다.
- `[bo-api/.../service/PageDataService.java:1467-1469]` export 쿼리에 LIMIT이 없다(page/size 파라미터 자체가 시그니처에 없음) → 전량 덤프.
- 실제 데이터에 PII 있음(로컬 DB 실측): `page_data.data_slug='trainingApplHis-data'`의 `data_json.training_application`에 `first_name/last_name/email/phone/company/job_title/address/zip_code/sales_contact/on_site_contact` 등이 저장돼 있다. C1에 의해 이 엔드포인트는 최하위 권한 관리자에게도 열려 있었다. (2026-08-09 C1 1차 조치 후: 사이트/메뉴 권한이 없는 계정은 차단되나, 해당 메뉴 권한을 가진 계정 또는 임의 `X-Menu-Path`를 넣은 계정에는 여전히 성립하고 **reason 없는 무기록 전량 export 자체는 그대로 미해결**이다.)
- FE 측 사유 입력 강제도 클라이언트 게이팅뿐이다: `[bo/.../renderer/WidgetRenderer.tsx:661-678, 560-638]` `privacyPopup`이 false면 사유 없이 바로 요청하고, true여도 `reason`은 있을 때만 전송한다.

**C3. `DELETE /page-data/{slug}/group/{groupId}`가 slug와 사이트를 완전히 무시**
- 셀: 페이지데이터API B
- `[bo-api/.../controller/PageDataController.java:139-145]` `@PathVariable String slug`를 받기만 하고 `pageDataService.deleteByGroupId(groupId)`에 넘기지 않는다(직접 확인).
- `[bo-api/.../service/PageDataService.java:1547-1556]` `findByGroupId(groupId)` 후 무조건 삭제. slug·site 필터 없음.
- `groupId`는 목록 응답에 그대로 실려 나온다(`PageDataResponse.java:26,43`). 즉 아무 목록이나 한 번 조회해 groupId를 얻으면, 슬러그 자리에 무엇을 넣든 해당 그룹의 **다른 슬러그·다른 사이트 레코드까지 일괄 삭제**된다.

**C4. 파일 업로드 → BO와 동일 오리진에서 임의 HTML 실행 (저장형 XSS 체인)**
- 셀: 파일업로드다운로드 A·B·F / 런타임렌더러 F / 런타임상태훅 F
- ① 서버에 확장자/MIME/매직바이트 검증이 전혀 없다. `[bo-api/.../service/PageFileService.java:64-116]` 검사는 null/0바이트뿐. FE 검증(`FieldRenderer.tsx:129-140`의 `filterByAccept`, `utils.ts:626-651`)은 파일명 문자열 기준이라 우회 대상일 뿐이다.
- ② 클라이언트가 보낸 Content-Type을 그대로 저장한다. `[동:111]` `.mimeType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")`.
- ③ 그 파일을 **비인증 공개 엔드포인트가 inline으로 되돌려준다.** `[bo-api/.../config/SecurityConfig.java:135]` `/api/v1/fo/**` permitAll → `[bo-api/.../controller/FoPageFileController.java:41-56]` `ContentDisposition.inline()` + `MediaType.parseMediaType(result.mimeType())`.
- ④ 사이트 격리 검사는 헤더를 빼면 무력화된다. `[bo-api/.../service/PageFileService.java:177-180]` `validateSiteAccess`가 `if (siteId == null) return;`으로 즉시 통과하고, `dataId == null`(폼 저장 전 임시 업로드) 파일도 무조건 통과(`:183-185`).
- ⑤ **BO가 `/api/v1`을 동일 오리진으로 프록시한다.** `[bo/next.config.ts:11-19]` `source: "/api/v1/:path*"`, `basePath: false`. 따라서 `https://{BO호스트}/api/v1/fo/page-files/{id}`가 BO 오리진에서 `text/html`로 실행된다. `nosniff`는 명시적 `text/html` 응답에는 효과가 없다.
- 결과: 로그인 계정 1개(역할 무관)로 HTML을 업로드한 뒤 그 URL을 관리자가 열게 하면, BO 오리진에서 스크립트가 실행되고 httpOnly refresh 쿠키를 사용한 `POST /api/v1/auth/refresh`로 그 관리자의 accessToken을 새로 발급받을 수 있다(토큰을 메모리에만 두는 설계가 우회된다).
- 참고(과장 방지): 업로드 디렉터리는 웹루트가 아니고 정적 리소스 매핑도 없어 `.jsp`/실행파일이 서버에서 실행되지는 않는다. 현재 `page_file` 적재 내용도 실측 결과 image/jpeg·png·webp·webm·text/plain 뿐이다(`text/html` 기존 사례 없음). 위험은 "지금 저장된 파일"이 아니라 "누구나 새로 올릴 수 있다"는 데 있다.

### WARNING

**W1. `X-Site-Id`를 서버가 검증하지 않음** — 셀: 페이지데이터API B·F
> 2026-08-09 C1 1차 조치로 **비-SYSTEM_ADMIN 계정에 한해** `AccessValidationInterceptor`가 `X-Site-Id` 필수 + `admin_user_site` 매핑을 강제하므로 아래 "헤더를 빼면 전 사이트 반환" 시나리오는 해당 계정에서는 더 이상 성립하지 않는다. **SYSTEM_ADMIN은 인터셉터를 즉시 통과하므로 아래 서술이 그대로 유효**하며, `SiteContextFilter` 자체는 미변경이다.

`[bo-api/.../filter/SiteContextFilter.java:40-44]` 헤더 숫자 파싱만 하고 요청자의 사이트 접근권한과 대조하지 않는다. JWT에도 siteId 클레임이 없다(`JwtTokenProvider.java:39`). `[PageDataService.java:162-164]`는 `siteId != null`일 때만 사이트 조건을 붙이므로 **헤더를 빼면 전 사이트 데이터가 한꺼번에 반환**된다. 반대로 생성 시 헤더를 빼면 `site_id = NULL`로 INSERT되어 모든 사이트 목록에 노출되는 레코드가 만들어진다(`:1190` + `:163`).

**W2. 단건 조회/수정/삭제에 사이트 스코프 없음 (IDOR)** — 셀: 페이지데이터API B
`[PageDataService.java:1135/1216/1280/1327]` 조회 키가 `(id, data_slug)`뿐이고 `site_id`가 빠져 있다. FE가 URL `?id=`를 그대로 대상 id로 쓰는 구조(`useWidgetPageState.ts:1126-1127`, `widgetSub/[slug]/page.tsx:41` `enableUrlEditMode: true`)와 결합된다.

**W3. 템플릿 조회 3종 무인가 + 서버 절대경로 노출** — 셀: 템플릿조회API B·C
`[PageTemplateController.java:32-35 / 38-41 / 44-49]`에 `@PreAuthorize`가 없다(같은 파일 `:53/:62/:69/:78`의 쓰기 4종은 `isSystemAdmin`으로 정상 보호). 인증만 되면 전 슬러그 열거 + 임의 config_json 전문 취득이 가능하며, 응답의 `filePath`에 TSX 산출물 서버 절대경로가 실린다(`PageTemplateResponse.java:44-47`). config_json에 자격증명은 없고 UI 메타데이터(검색 필드 키, 컬럼 accessor, 버튼 정의)지만, C1 공격의 정찰 자료가 된다.

**W4. dataJson 키 화이트리스트 부재 + FE `_paramSave` 임의 키 주입** — 셀: 운영상세페이지 F / 런타임상태훅 F / 페이지데이터API F
서버: `[PageDataRequest.java:20-22]` `@NotNull/@NotEmpty`만, `[PageDataService.java:1228]` deepMerge, `[동:1290-1306]` `fieldKey.split("\\.")`로 임의 깊이 키 생성. FE: `[useWidgetPageState.ts:699-741, 1347-1356]` URL에 `_paramSave=true`가 있으면 폼에 정의되지 않은 모든 쿼리 파라미터가 `dataJson`에 병합된다. `is_visible`/`publish_dttm`은 FO 공개 게이트에 실제로 쓰이는 키다(`PageDataService.java:82-84`).

**W5. export 컬럼(keys)을 클라이언트가 지정 → 화면 설정 밖 컬럼 유출** — 셀: 페이지데이터API G / SlugEntity동적API J / 런타임렌더러 J
서버는 `data_json` 전체를 flatten해 반환하고(`PageDataService.java:1499-1536`), 어떤 컬럼을 뽑을지는 클라이언트가 보낸 `keys` 문자열이 결정한다(`PageDataController.java:175-177` → `ExcelService.java:80/128`, dot notation 지원 `:244-251`). 서버측 허용 컬럼 목록이 없다. 엔티티 export도 동일(`EntityExcelExportService.java:365-404`).

**W6. `apiInfo.urlPattern`에 절대 URL이 오면 Authorization 헤더가 외부 오리진으로 전송** — 셀: 런타임상태훅 C·D
`[useWidgetPageState.ts:1942-1944]` `urlPattern`이 `/api/v1`로 시작하지 않으면 그대로 axios `url`이 된다(상대경로 강제 없음). `[bo/src/lib/api.ts:28-41]` 요청 인터셉터는 **모든 요청에 무조건** `Authorization: Bearer`와 `X-Site-Id`를 붙인다. 절대 URL이면 axios가 baseURL을 무시하고 해당 호스트로 나간다.
전제조건: `urlPattern` 등록/수정은 `[ApiInfoController.java:28]` 클래스 레벨 `isSystemAdmin`으로 **SYSTEM_ADMIN 전용**이다. 즉 공격자가 이미 최고 권한이어야 하며 권한 상승은 아니다(그래서 critical이 아니다). 실질 의미는 "최고권한자가 다른 관리자의 토큰을 외부로 흘리는 경로를 남겨둘 수 있다"이며, 목록 조회는 `/api-infos/active`가 `isAuthenticated()`라 일반 관리자도 값을 볼 수 있다(`:46-49`).

**W7. 파일 IDOR — 인증만 되면 타인 파일 조회·삭제·재연결** — 셀: 파일업로드다운로드 B
`[PageFileController.java]` 전 메서드에 `@PreAuthorize` 없음(`:38 upload`, `:52 meta`, `:62 download`, `:85 link`, `:96 by-data`, `:105 delete`). `FileMetaController.java`도 동일. 서비스에도 소유자/사이트 검증이 없다(`PageFileService.java:127-132, 143-164, 263-274`). 특히 `[PageFileService.java:244-253]` `PATCH /page-files/link`는 `findAllById(fileIds)` 후 조건 없이 `setDataId`라 남의 파일을 자기 레코드에 붙일 수 있다.

**W8. `GET /api/v1/slug-entity/active`만 무인가로 스키마 전량 노출** — 셀: SlugEntity동적API C
`[SlugEntityController.java:50-53]`에만 `@PreAuthorize`가 없다(나머지 `:42/:57/:64/:71/:80/:88/:101/:113`은 전부 `isSystemAdmin`). 응답에 slug·표시명·DB 테이블명·전체 컬럼 정의(key/columnName/columnType/길이)가 포함된다. 동종 정보를 다루는 `DatabaseController.java:23`은 `isSystemAdmin`으로 막혀 있어 기준선과 불일치.

**W9. `generate-save`가 클라이언트가 보낸 Java 소스 문자열을 검증 없이 파일에 기록** — 셀: SlugEntity동적API A
`[SlugEntityCodeWriter.java:74-80, 116]` 서버가 코드를 다시 생성하지 않고 요청 본문의 `entityCode/serviceCode/controllerCode`를 그대로 `Files.writeString`한다. 검증은 파일명(`:142-160`)과 경로 경계(`:163-170`)뿐이고 **본문 검증은 없다.**
전제조건: SYSTEM_ADMIN(`SlugEntityController.java:113`) + **`local` 프로파일 전용**(`SlugEntityCodeWriter.java:135-139`, `SlugEntityCodeGenerator.java:634-638`). 배포 프로파일(`dev`/`developer`)에서는 403. 또한 파일을 써도 재빌드 전까지 실행되지 않으므로 **운영 즉시 RCE는 성립하지 않는다.** 실질 위험은 개발자 로컬 소스 트리 오염(공급망).
참고: `tableName`은 `@Size(max=100)`만 있고 `@Pattern`이 없어 `@Table(name=...)`/`CREATE TABLE` 문자열에 그대로 들어가나, DDL을 애플리케이션이 실행하지 않으므로(문자열 반환만) SQL 인젝션은 성립하지 않는다.

**W10. CTP 파일다운로드 프록시가 비인증 + 쿼리 미인코딩** — 셀: 파일업로드다운로드 D
`[SecurityConfig.java:135]` permitAll 범위 안 → `[CtpFileDownloadController.java:19-22]` 파라미터 검증 없음 → `[CtpFileDownloadService.java:35-37]` `apiUrl + "?code=" + code + "&filePath=" + path` 문자열 결합(인코딩 없음, 검증은 `startsWith("CTP")` 하나). 비인증자가 서버 보유 `code`를 빌려 임의 `CTP*` 경로 다운로드 URL을 무제한 발급받을 수 있고 `&`로 쿼리 주입이 가능하다. **호스트는 설정 고정값이라 SSRF는 성립하지 않는다.**

**W11. 옵션 로딩이 `size=9999`로 전 행 dataJson을 통째로 수신** — 셀: 런타임렌더러 C·I
`[FieldRenderer.tsx:812, 902]`, `[MultiSelectRenderer.tsx:114]`, `[useCategoryCascade.ts:202, 242]`. 화면은 `optionValueKey`/`optionTextKey` 2개만 쓰는데 나머지 컬럼 전부가 네트워크 응답과 React state에 남는다(over-fetch + 가용성).

**W12. 운영 상세 페이지가 URL 파라미터를 무검증으로 조건식·폼 값에 주입** — 셀: 운영상세페이지 F
`[widgetSub/[slug]/page.tsx:74-79]` `id`/`group_id`만 제외하고 모든 쿼리 파라미터를 allowlist·길이·타입 검증 없이 `urlParams`로 넘겨 `hideCondition`/`disableCondition` 평가에 사용한다. `[동:41]`이 켜는 `enableUrlEditMode`로 `[useWidgetPageState.ts:703-731]`에서 `fieldKey`/`label` 일치 필드에 URL 값이 주입돼 편집 불가 필드도 값 설정이 가능하다. UI 통제 우회이며 실질 방어선은 서버 인가(= C1).

**W13. 파일 다운로드에 감사 이력이 전혀 없음 / 엔티티 export의 reason도 선택값** — 셀: 파일업로드다운로드 J / SlugEntity동적API J
`PageFileService.download`·`FileMetaService.download`에 `downloadLogService` 호출이 없다. `[EntityExcelExportService.java:131-137]`도 `reason`이 있을 때만 기록(`TestDataController.java:83` `required=false`).

### INFO
- `[템플릿조회API G]` `PageTemplateService.getAll()`에 페이징·건수 제한 없음.
- `[페이지데이터API F]` `PageDataController.java:62` `size`에 상한 검증 없음(`LIMIT :size`에 직결).
- `[페이지데이터API I]` `@CachePut`은 있으나 코드 전체에 `@Cacheable`이 0건이라 **캐시 포이즈닝은 성립하지 않는다**(오해 방지 목적으로 명시). 단 `delete()`가 `productData`를 evict하지 않아 향후 `@Cacheable` 추가 시 정합성 문제 소지.
- `[페이지데이터API A]` `joinv_N` 값에 `&`를 넣으면 `appendSlaveFilter`의 `split("&")`(`PageDataService.java:3959`)에서 조건이 분해돼 의도치 않은 추가 필터가 붙는다. 키는 화이트리스트·값은 바인딩이라 **SQL 구조 변경은 불가**, 결과 필터링만 달라짐.
- `[파일업로드다운로드 I]` `[FoPageFileController.java:57-58]` 비인증 공개 응답에 `Cache-Control: public, max-age=31536000, immutable` + 고정 ETag → 삭제 후에도 CDN 엣지에 잔존 가능.
- `[런타임렌더러 C]` `[WidgetRenderer.tsx:44-57, 522-549]` `Ctrl+\`` 전역 keydown 디버그 리스너가 hidden 폼 필드 값을 console에 출력(프로덕션 빌드 포함). 본인 세션 데이터라 권한 경계는 넘지 않음.
- `[런타임렌더러 F]` `[utils.ts:602]` `new RegExp(f.pattern)` — config에서 온 정규식이라 ReDoS로 본인 브라우저가 멈출 수 있음.
- `[운영상세페이지 H]` `widgetSub/Createboard/LayerPop.tsx`는 어디에서도 import되지 않는 사문화 파일(전역 grep 0건).
- `[운영리스트/상세 I]` slug 전환 시 `setLoading(true)` 리셋·AbortController 없음 → 늦게 도착한 이전 응답이 새 템플릿을 덮어쓸 수 있음.
- `[SlugEntity동적API E]` `ls.redis-enabled=true`(dev/운영) 분기는 세션 쿠키 기반인데 CSRF가 disable. 다만 세션 쿠키가 `SameSite=lax`+`http-only`+`secure`라 크로스사이트 상태변경 요청에는 실리지 않음.

### 이번 검토에서 확인된 "잘 되어 있는 것" (오탐 방지용 기록)
- **SQL 인젝션 방어는 실제로 촘촘하다.** 4,000줄 규모 동적 쿼리 빌더에서 필드명은 예외 없이 `[a-zA-Z0-9_]+`/`isValidSegments()` 화이트리스트를 통과해야 SQL에 들어가고 값은 전부 `setParameter` 바인딩이다(`PageDataService.java:2014~2253, 2568-2571, 2671-2679, 234-240`). `sort`/`condexpr_`/`rel_`/`joinv_` 전부 개별 검증됨.
- **빌더 런타임 FE에 `dangerouslySetInnerHTML`·`eval`·`new Function`이 0건.** 조건식(`hideCondition` 등)은 코드 실행이 아니라 전용 문자열 파서로 평가된다(`utils.ts:268-341, 1011-1051`). 이 규모의 "설정값이 로직이 되는" 빌더에서 가장 흔한 RCE급 실수를 피했다.
- 비디오 임베드가 블랙리스트가 아니라 YouTube/Vimeo ID **화이트리스트 재조립** 방식(`FieldRenderer.tsx:146-155`).
- 대상 FE 코드 전체에서 `localStorage`/`sessionStorage`/`document.cookie` 사용 0건 — 토큰 메모리 보관 기준선 준수.
- 생성 엔티티 컨트롤러 템플릿에 `@PreAuthorize("@securityService.isSystemAdmin(...)")`가 **클래스 레벨로 고정**되어 있어 새 엔티티 API가 자동으로 최고권한 게이트를 상속한다(`SlugEntityCodeGenerator.java:522`, 산출물 4종 실물 확인).
- 코드 생성/저장 전체가 `local` 프로파일로 봉인되어 배포 환경에서는 403.
- 코드 생성 파일 쓰기에 `normalize()` + `startsWith(baseDir)` 경로 경계 검증, 마커 없는 기존 파일 덮어쓰기 차단, 백업/롤백까지 구현.
- 저장 파일명 UUID화 + 업로드 디렉터리가 정적 리소스로 매핑되지 않음(업로드 파일 서버 실행 불가).
- `GlobalExceptionHandler`가 스택트레이스·내부 경로를 응답 본문에 노출하지 않음.
- `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'`가 `next.config.ts`와 `middleware.ts` 양쪽에 이중 적용됨.
- CORS는 와일드카드 없는 명시 화이트리스트.

### 미분석(UNPROVEN)
| 항목 | 사유 |
|---|---|
| 운영리스트/상세 페이지 J(개인정보) | 범용 렌더러라 슬러그별 PII 성격이 페이지 코드만으로 결정되지 않음. 페이지 레벨 마스킹·열람이력 로직이 없다는 사실만 확정 |
| SlugEntity동적API H / 파일업로드다운로드 H (서드파티) | SCA(dependency-check/OSV) 미실행. 직접 의존성 버전만으로 CVE 단정하지 않음 |
| Tiptap 3.x 스키마를 통과하는 저장형 XSS 페이로드 존재 여부 | `bo/src/components/common/tiptap-editor.tsx:327`이 프로젝트 유일 `dangerouslySetInnerHTML`(미리보기 패널, 기본 off). 입력값이 `editor.getHTML()`로 ProseMirror 정규화를 거쳐, 런타임 검증 없이는 우회 가능 여부 단정 불가 |
| 운영 DB의 PII 분포 | 확인한 것은 로컬 `bo` DB. `careers-data` 등 다른 슬러그의 PII 여부, 운영 건수 미확인 |
| `application-prd.yml` | 리포지토리에 없어 운영 프로파일의 CORS/파일저장소/활성 프로파일 미확인. W9의 "운영에서 차단됨" 판정은 운영이 `local`이 아니라는 전제 |
| `ls.redis-enabled=true` 분기의 SecurityContext authority 구성 | 세션 분기 로그인 경로 미추적(인가 부재 판정 자체는 두 분기 공통) |

---

## 진행 이력

| 일자 | 내용 |
|------|------|
| 2026-08-08 | 매트릭스 최초 작성. DB menu 조회로 범위 확정(빌더 운영 페이지 = `/admin/widget/[slug]` + `/admin/widgetSub/[slug]` 단일 코드경로, 메뉴 40여 개가 공유) → 행을 코드 단위 8개로 정의 |
| 2026-08-08 | 8개 행 × A~J 80셀 분석 완료. bo-security-reviewer 2회(FE), java-security-reviewer 2회(BE) 위임 후 디스패처가 핵심 근거 직접 재검증(`PageDataController` @PreAuthorize 0건, `deleteByGroupId` slug 미전달, `validateSiteAccess` siteId==null 조기반환, `next.config.ts` /api/v1 동일오리진 프록시, `ApiInfoController` isSystemAdmin, `page_file` MIME 실측). critical 4 / warning 13 / info 다수 |
| 2026-08-09 | **C1 1차 조치 완료(완전 해결 아님)**. `AccessAuthorizationService`+`AccessValidationInterceptor`+`WebMvcConfig`(최초 도입) 전역 인가 인터셉터 신규 구현 — SYSTEM_ADMIN 통과 / `X-Site-Id`→`admin_user_site` 검증 / `X-Menu-Path`→`menu.url` 최장접두어매칭→`role_menu` 검증, FE `api.ts`에 `X-Menu-Path` 전역 부착, `CurrDtlExportController` 로컬 `validateSiteAccess()` 제거·통합, `MenuRepository.findBoMenusWithUrlBySite` 추가. curl+브라우저로 SYSTEM_ADMIN 무회귀 / SUPER_ADMIN 403·400 차단·최장접두어 상세경로 통과 실증. 진행 중 발견한 menu.url 중복 비결정성은 fail-safe(403)로, `/admin/widgetSub/` menu 행 부재는 메뉴체크 스킵으로 처리. 잔여: menu.url 중복 22건 미정리(SUPER_ADMIN 기준 사이드바 화면 약 59% 403), `X-Menu-Path` 클라이언트 자율신고, `middleware.ts` `SYSTEM_ADMIN_PATHS` 이원화(기존 문제·미착수), widgetSub 경로 메뉴인가 미적용. 매트릭스 B행 4셀 FAIL→PARTIAL, 페이지데이터API B는 C3·W2로 FAIL 유지 |
