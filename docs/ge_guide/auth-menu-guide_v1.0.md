# Bo 권한·메뉴 연결 가이드

> 버전: v1.4
> 작성일: 2026-05-16
> 최종수정: 2026-05-18 — 시스템관리자 정보 노출 금지 원칙 추가 (7-2절 신설)
> 대상: Bo 시스템의 권한/메뉴 구조를 이해해야 하는 모든 에이전트
> 관련 파일: `bo-api/.../MenuService.java`, `bo-api/.../MenuResponse.java`, `bo/src/middleware.ts`, `bo/src/store/authStore.ts`

---

## 1. 전체 구조 한눈에 보기

```
┌─────────────────────────────────────────────────────────┐
│                    역할(Role) 체계                        │
│                                                          │
│  시스템관리자 (role.is_system = true)                     │
│  - 숨은 전체관리자. is_system=true 메뉴 포함 전체 접근    │
│  - role_menu 등록 불필요. 모든 메뉴 자동 접근             │
│  - 코드 상수명: SYSTEM_MANAGE                            │
│                                                          │
│  사용자 (role.is_system = false)                         │
│  - is_system=true 메뉴 접근 불가 (역할에 무관하게)        │
│  - role_menu에 등록된 메뉴만 접근 가능                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    메뉴(Menu) 체계                        │
│                                                          │
│  BO 메뉴 (관리자 사이드바)                                │
│   ├── 1depth: SYSTEM   ← 시스템관리자 전용 (is_system 설정 필요)
│   │    ├── 2depth: System                               │
│   │    │    ├── 3depth: Table                           │
│   │    │    ├── 3depth: Entity                          │
│   │    │    ├── 3depth: API                             │
│   │    │    └── 3depth: DB Slug 관리                    │
│   │    └── 2depth: Builder                              │
│   │         ├── 3depth: Quick-Page(Detail)              │
│   │         ├── 3depth: Quick-Page(List)                │
│   │         └── 3depth: Widget ...                      │
│   └── 1depth: Settings  ← 사용자 접근 가능 영역          │
│        ├── 2depth: 관리자 관리                           │
│        ├── 2depth: 권한 관리                             │
│        └── 2depth: 메뉴 관리                             │
│                                                          │
│  ※ 각 메뉴의 is_system은 DB에 저장된 개별 설정값이다.    │
│     depth와 무관하게 메뉴마다 독립적으로 설정된다.        │
│     표기된 구분은 설계 목표이며 기본값은 false다.         │
│                                                          │
│  FO 메뉴 (사이트별 프론트 메뉴) — 별도 관리              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               메뉴-역할 연결 (role_menu 테이블)           │
│                                                          │
│  role_id  │  menu_id                                     │
│  ─────────┼──────────                                   │
│  사용자역할│  Settings(1depth)                           │
│  사용자역할│  관리자 관리(2depth)                         │
│  사용자역할│  권한 관리(2depth)                           │
│  ※ 반드시 1depth·2depth·3depth 모두 등록해야 표시됨      │
│  ※ 시스템관리자는 role_menu 등록 불필요                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 역할(Role) 체계 상세

### 2-1. 역할 구분

| 구분 | 조건 | 메뉴 접근 범위 | role_menu 필요 여부 | 관리 위치 |
|------|------|----------------|---------------------|-----------|
| **시스템관리자** | `role.is_system = true` | is_system=true 메뉴 포함 전체 | ❌ 불필요 | DB `role` 테이블 |
| **사용자** | `role.is_system = false` | role_menu 등록 메뉴만 (is_system=true 메뉴 불가) | ✅ 필수 | DB `role` 테이블 |

> ⚠️ 메뉴 접근 권한은 역할 코드명이 아니라 `role.is_system` 값으로만 결정된다.

### 2-2. 계정-역할 연결 방식

```
admin_user.role (VARCHAR)  ──참조──▶  role.code (VARCHAR, UNIQUE)
                                              │
                                       role.is_system
                                       (시스템관리자 여부 판별 기준)
```

- 물리적 FK 없음. 애플리케이션 레벨에서 관리
- 로그인 시 JWT에 role 정보 포함 → SecurityContext에 `ROLE_{코드}` authority로 저장
- 시스템관리자 판별: `admin_user.role` → `role.code` 조회 → `role.is_system` 확인

---

## 3. 메뉴(Menu) 체계 상세

### 3-1. 메뉴 타입

| menuType | 용도 |
|----------|------|
| `BO` | 관리자 사이드바 메뉴 (사이트 무관, 공통) |
| `FO` | 프론트 사이트 메뉴 (사이트별 분리, siteId 사용) |

### 3-2. 메뉴 구조

- **최대 3depth** 지원 (4depth 생성 시 BE에서 차단)
- **폴더(Folder)**: `url = NULL`. 하위 메뉴를 담는 그룹
- **프로그램(Program)**: `url` 있음. 실제 페이지로 연결

### 3-3. Menu.is_system 플래그

```java
// Menu.java
@Builder.Default
private boolean isSystem = false;  // 시스템관리자 전용 메뉴 여부
```

- `is_system`은 **DB menu 테이블의 각 메뉴 행(row)에 저장된 설정값**이다
- depth(1depth/2depth/3depth)와 무관하게 **메뉴마다 독립적으로 설정**된다
- 1depth가 is_system=true여도 하위 2depth/3depth는 **별도로 각각 설정해야 한다**

| is_system 값 | 접근 가능 계정 |
|---|---|
| `true` | 시스템관리자만. 사용자는 role_menu에 등록해도 절대 접근 불가 |
| `false` | 사용자 대상. role_menu 기반 필터링 적용 |

> ⚠️ **기본값은 `false`다.** 메뉴 생성 시 자동으로 true가 되지 않는다.
> 시스템관리자 전용으로 보호할 메뉴는 **DB에서 직접 `is_system=true`로 설정해야 한다.**
> 설정하지 않으면 사용자에게도 노출된다.

---

## 4. 메뉴-역할 연결 방법 (핵심)

### 4-1. role_menu 테이블 구조

```sql
role_menu
├── role_id  (FK → role.id)
└── menu_id  (FK → menu.id)
```

> ⚠️ role_menu는 사용자 역할에만 해당한다. 시스템관리자는 role_menu 등록 없이 모든 메뉴에 접근한다.

### 4-2. 중요 규칙: 모든 depth를 명시적으로 등록해야 한다

> ⚠️ 이전에는 "자손이 허용되면 부모도 자동으로 표시"되는 방식이었으나 현재는 변경됨.
> 현재는 **자기 자신이 role_menu에 있어야만** 사이드바에 표시된다.
> 이전 방식을 기대하고 3depth만 등록하면 현재 시스템에서는 아무것도 표시되지 않는다.

```
❌ 하위 depth만 등록하고 상위 depth를 누락한 경우
   (is_system=false 메뉴 대상 — is_system=true 메뉴는 사용자 등록 자체가 의미 없음)

role_menu: 사용자역할 → [3depth 메뉴만 등록]
결과: 사이드바에 아무것도 표시 안 됨
      → 1depth, 2depth가 role_menu에 없기 때문

✅ 모든 depth 명시적 등록 (is_system=false 메뉴만 대상)

role_menu: 사용자역할 → [1depth 메뉴]   ← 반드시 필요
role_menu: 사용자역할 → [2depth 메뉴]   ← 반드시 필요
role_menu: 사용자역할 → [3depth 메뉴]   ← 접근 목표 메뉴
결과: 1depth 아래 2depth, 3depth 순서로 사이드바에 표시 ✓
```

### 4-3. isAllowed() 로직 (MenuResponse.java)

```java
// 자기 자신이 role_menu에 직접 등록된 경우에만 허용 (자손 전파 없음)
public static boolean isAllowed(Menu menu, Set<Long> allowedMenuIds) {
    return allowedMenuIds.contains(menu.getId());
}
```

### 4-4. 관리 화면에서 설정하는 방법

1. `/admin/settings/menus` 접속 (메뉴 관리 페이지)
2. 왼쪽 트리에서 설정할 메뉴 클릭
3. 오른쪽 상세 패널 하단 **"역할별 접근 권한"** 섹션에서 체크박스 토글
4. 토글 즉시 저장 (별도 저장 버튼 불필요)
5. **주의**: 1depth → 2depth → 3depth 순서로 각각 설정해야 함

---

## 5. 사이드바 필터링 흐름 (BE)

### 5-1. 사이드바 네비게이션 (forNav=true)

```
사용자 로그인
    ↓
GET /api/v1/menus?menuType=BO&forNav=true 호출
    ↓
MenuService.getMenuTree(menuType, siteId, forNav=true)
    ↓
시스템관리자 여부 체크 (role.is_system 조회)
    ├── true (시스템관리자) → 전체 메뉴 반환 (필터 없음)
    └── false (사용자) → 아래 순서로 필터링
            ↓
        1. is_system=true 메뉴 전체 제외
        2. isAllowed(menu, allowedMenuIds) → role_menu에 자기 자신이 있어야만 통과
        3. fromFiltered(menu, allowedMenuIds) → 자식도 동일 필터 적용
            ↓
        필터링된 트리 반환
```

### 5-2. 메뉴관리 화면 (forNav=false)

```
GET /api/v1/menus?menuType=BO 호출 (forNav 파라미터 없음 → false)
    ↓
시스템관리자 여부 체크
    ├── true (시스템관리자) → 전체 메뉴 반환 (필터 없음)
    └── false (사용자) → is_system=true 메뉴만 제외. role_menu 필터 미적용
            ↓
        사용자도 is_system=false 메뉴 전체를 메뉴관리 화면에서 볼 수 있음
        (메뉴 구조 파악 목적. 사이드바 노출과는 별개)
```

> ✅ **수정 완료 (2026-05-18)**: 시스템관리자 여부 체크가 `role.is_system` DB 조회 기반으로 변경됨.
> `MenuService.isCurrentUserSystemAdmin()` 참고.

---

## 6. FE 라우트 보호 (2중 구조)

### 6-1. 1차 보호: Next.js middleware.ts

```
파일: bo/src/middleware.ts

보호 경로:
- /admin/system/**          → 시스템관리자 전용
- /admin/database/**        → 시스템관리자 전용
- /admin/settings/slug-registry/** → 시스템관리자 전용
- /admin/templates/make/**  → 시스템관리자 전용
- /admin/templates/layer/** → 시스템관리자 전용

동작:
1. 요청 수신 (URL 직접 입력 또는 router.push() 모두 해당)
2. bo_is_system 쿠키 확인
3. 시스템관리자가 아니면 /admin/dashboard로 redirect
```

> ✅ **수정 완료 (2026-05-18)**: `bo_role 쿠키 = 'SYSTEM_MANAGE'` 하드코딩 방식에서
> `bo_is_system 쿠키 = 'true'` 방식으로 변경됨. `role.is_system` 값을 직접 쿠키에 저장.

### 6-2. bo_is_system 쿠키 관리 (authStore.ts)

```typescript
// 로그인/토큰갱신 시 쿠키 설정 (adminInfo.isSystem = role.is_system 값)
document.cookie = `bo_is_system=${adminInfo.isSystem}; path=/; SameSite=Strict`;

// 로그아웃 시 쿠키 제거
document.cookie = 'bo_is_system=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
```

> ⚠️ bo_is_system 쿠키는 보안용이 아니라 UI 라우팅 전용이다.
> 실제 보안은 BE의 @PreAuthorize와 role_menu 필터링이 담당한다.

### 6-3. 보호 경로-파일 매핑

| 경로 | 파일 | 대상 |
|------|------|------|
| `/admin/system/api` | `app/admin/system/api/page.tsx` | API 정보 |
| `/admin/system/roles` | `app/admin/system/roles/page.tsx` | 역할 관리 |
| `/admin/database/tables` | `app/admin/database/tables/page.tsx` | DB 테이블 |
| `/admin/database/entities` | `app/admin/database/entities/page.tsx` | DB 엔티티 |
| `/admin/settings/slug-registry` | `app/admin/settings/slug-registry/page.tsx` | DB Slug |
| `/admin/templates/make/**` | `app/admin/templates/make/` | Builder 전체 |

---

## 7. BE API 보호 (@PreAuthorize)

### 7-1. 현재 적용 현황

| 컨트롤러 | 적용 방식 | 대상 |
|---------|----------|------|
| `RoleController` | 메서드 레벨 | 시스템관리자만 역할 CRUD 가능 |
| `SlugRegistryController` | 메서드 레벨 | 시스템관리자만 Slug 관리 가능 |
| `ApiInfoController` | 클래스 레벨 | 시스템관리자만 API 정보 접근 |
| `MenuController` | 클래스 레벨 없음 | 인증된 모든 사용자 접근 가능 |
| `AdminController` | 클래스 레벨 없음 | 인증된 모든 사용자 접근 가능 |

> ⚠️ MenuController, AdminController에 클래스 레벨 @PreAuthorize가 있었으나
> 사용자 계정의 메뉴/사이트 API 접근이 차단되는 문제로 제거됨 (2026-05-16)

### 7-2. 시스템관리자 정보 노출 금지 원칙

> ⚠️ **보안 원칙**: 일반 사용자가 접근 가능한 API는 `is_system=true` 역할의 존재 자체를 응답에서 완전히 제외해야 한다.
> 시스템관리자 역할의 이름, 코드, displayName 등 어떤 정보도 일반 사용자에게 노출되어선 안 된다.

#### 현재 적용 현황

| API | 접근 주체 | is_system=true 노출 여부 | 조치 |
|-----|-----------|--------------------------|------|
| `GET /menus/{id}/roles` | 인증된 모든 사용자 (`@PreAuthorize` 없음) | ❌ 노출됨 — 취약 | `is_system=false` 역할만 반환하도록 수정 필요 |
| `GET /roles` | 시스템관리자 전용 (`@PreAuthorize isSystemAdmin`) | ✅ 보호됨 | 일반 사용자 접근 불가 |
| `GET /admins` | 인증된 모든 사용자 (`@PreAuthorize` 없음) | ⚠️ 코드 하드코딩으로 필터링 중 | `role.is_system` 기반으로 통일 필요 |

#### 적용 규칙

**규칙 1 — 역할 목록 응답 필터링**

일반 사용자가 접근 가능한 API에서 역할 목록을 반환할 경우, 반드시 `is_system=false` 역할만 포함해야 한다.

```java
// ❌ 잘못된 방식 — is_system=true 역할이 응답에 포함됨
List<Role> allRoles = roleRepository.findAll();

// ✅ 올바른 방식 — is_system=false 역할만 반환
List<Role> roles = roleRepository.findByIsSystemFalse();
```

**규칙 2 — 시스템관리자 계정/역할 필터링은 role.is_system 기반으로 통일**

코드명 문자열 하드코딩 방식은 역할 코드가 변경되면 필터가 깨진다. 반드시 `role.is_system` DB 값 기반으로 처리해야 한다.

```java
// ❌ 잘못된 방식 — 역할 코드 하드코딩. 코드명 변경 시 필터 깨짐
private static final String SYSTEM_ADMIN_ROLE = "SYSTEM_ADMIN";
admins.stream().filter(a -> !SYSTEM_ADMIN_ROLE.equals(a.getRole()))

// ✅ 올바른 방식 — role.is_system DB 값 기반
admins.stream().filter(a -> !roleRepository.findByCode(a.getRole())
    .map(Role::isSystem).orElse(false))
```

**규칙 3 — 향후 신규 API 개발 시 체크사항**

일반 사용자가 접근 가능한 API를 새로 개발할 때, 응답에 역할 정보가 포함되는 경우 반드시 아래를 확인한다.

```
□ 역할 목록 반환 시 is_system=false 필터링 적용 여부
□ 역할 코드/이름 노출 시 is_system=true 역할 제외 여부
□ @PreAuthorize 없는 컨트롤러에서 roleRepository.findAll() 직접 사용 금지
```

---

## 8. 새 역할 추가 시 체크리스트

에이전트가 새 역할을 추가하거나 메뉴 접근을 설정할 때 반드시 확인:

```
□ 1. DB role 테이블에 역할 생성 (code, display_name 필수)
     - 시스템관리자: is_system = true
     - 사용자: is_system = false

□ 2. 해당 역할로 계정 생성 (admin_user.role = 새 코드)

□ 3. 시스템관리자 역할 → role_menu 등록 불필요. 모든 메뉴 자동 접근

□ 4. 사용자 역할 → 메뉴 관리 화면에서 접근 허용할 메뉴 체크
     → 1depth + 2depth + 3depth 전부 체크 필수

□ 5. 해당 계정으로 로그인하여 사이드바 확인

□ 6. 시스템관리자 전용 메뉴는 Menu.is_system을 DB에서 직접 true로 설정
     → 기본값 false. 코드 자동 설정 없음
     → depth 무관하게 보호할 메뉴 각각 개별 설정 필요
     → 설정 누락 시 사용자에게도 노출됨
```

---

## 9. 코드-설계 정합 이력

설계 의도(`role.is_system` 기반 판별)와 코드가 일치하지 않던 GAP은 2026-05-18 모두 해소되었다.

| 위치 | 이전 방식 (GAP) | 현재 방식 (수정 완료) |
|------|----------------|---------------------|
| `MenuService.java` | `"SYSTEM_MANAGE"` 문자열 하드코딩 비교 | `role.isSystem()` DB 조회로 판별 |
| `middleware.ts` | `bo_role 쿠키 = 'SYSTEM_MANAGE'` 문자열 비교 | `bo_is_system 쿠키 = 'true'` 비교 |
| `authStore.ts` | `bo_role` 쿠키에 역할 코드 저장 | `bo_is_system` 쿠키에 `role.is_system` 값 저장 |

> ✅ 시스템관리자 계정의 역할 코드는 어떤 값이든 무관하다. `role.is_system = true`이면 자동으로 시스템관리자로 판별된다.

---

## 10. 자주 발생하는 문제 & 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| 사이드바에 메뉴가 안 보임 | role_menu에 해당 depth가 없음 | 1depth부터 차례로 등록 |
| 메뉴는 보이는데 클릭 시 빈 화면 | FE middleware가 redirect함 | bo_is_system 쿠키 확인, 시스템관리자 여부 확인 |
| 403 Forbidden | @PreAuthorize 차단 | 해당 컨트롤러의 어노테이션 확인 |
| 시스템관리자인데 특정 메뉴가 안 보임 | Menu.is_system이 DB에서 false로 설정됨 | DB에서 해당 메뉴의 is_system=true로 직접 변경 |
| 사용자인데 시스템 메뉴가 보임 | Menu.is_system이 DB에서 false로 설정됨 | DB에서 해당 메뉴의 is_system=true로 직접 변경 |
| /auth/refresh 무한 루프 | 로그아웃 시 Refresh Token 쿠키 미삭제 | `/auth/logout` API 호출 후 Zustand logout |
| 계정 전환 후 이전 메뉴 보임 | React Query 캐시 미제거 | logout 시 `queryClient.removeQueries({ queryKey: ['menus', 'nav'] })` |
| 역할별 접근 권한 목록에 SYSTEM_ADMIN이 표시됨 | `getRoleMenuMappings()`가 `roleRepository.findAll()`로 모든 역할 반환 | `is_system=false` 역할만 조회하도록 수정 (7-2절 참고) |
| 관리자 목록 필터가 역할 코드 변경 후 깨짐 | `AdminService`에서 역할 코드 하드코딩 문자열 비교로 필터링 | `role.is_system` DB 값 기반으로 통일 (7-2절 규칙 2 참고) |
