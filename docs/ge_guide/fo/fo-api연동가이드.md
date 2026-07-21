# FO API 연동 가이드

> 대상: fo(북미 홈페이지, port 3002)가 bo-api(BE, port 8080)를 호출하는 모든 개발
> 관련 파일: `fo/next.config.ts`, `fo/src/lib/api.ts`, `fo/.env.local`

---

## 1. 배경

bo 관리자 화면의 **홈페이지관리**(`bo/src/app/admin/manage/homepage`)에서 입력·관리하는 콘텐츠가 bo-api DB에 저장되고, bo-api는 이 데이터를 `/api/v1/fo/**` 경로로 공개(인증 없이 `permitAll`, `SecurityConfig.java`)한다. fo는 이 경로를 호출해 북미 홈페이지 화면(devices-systems, company, ESG, service-center 등)에 렌더링한다.

```
bo "홈페이지관리" 화면 입력
        ↓
   bo-api DB 저장
        ↓ (/api/v1/fo/** 공개 API)
   fo(3002)가 조회 → 화면 렌더링
```

## 2. 호출 아키텍처 — 프록시 방식

브라우저는 **fo(3002)에게만** 요청하고, 실제 bo-api(8080) 호출은 Next.js 서버가 대신 수행한다. bo가 bo-api를 호출할 때 쓰는 것과 동일한 패턴(`bo/next.config.ts`의 rewrites)이다.

```
[브라우저]                 [fo 서버(3002)]                [bo-api(8080)]
   │ fetch("/api/v1/fo/xxx")   │                              │
   │──────────────────────────▶│  next.config.ts rewrites가   │
   │     (같은 origin: 3002)   │  내부적으로 전달              │
   │                           │─────────────────────────────▶│
   │◀──────────────────────────│◀───────────────────────────── │
```

- 설정 위치: `fo/next.config.ts`의 `rewrites()` — `/api/v1/fo/:path*` → `${API_PROXY_TARGET}/api/v1/fo/:path*`
- 브라우저가 8080을 직접 호출하지 않으므로 **CORS 검사 자체가 발생하지 않는다**. bo-api의 CORS 허용 목록(`application-*.yml`)에 3002가 등록되어 있지만, 이 프록시 방식에서는 실질적으로 사용되지 않는다(다른 목적으로 열려 있을 수 있으므로 별도 확인 없이 건드리지 않는다).
- 배포 환경(dev/developer/운영)이 바뀌어도 `API_PROXY_TARGET` 값만 교체하면 되고, 실제 bo-api 주소가 브라우저 JS 번들에 노출되지 않는다.

## 3. 환경변수 — `fo/.env.local`

`.env.local`은 `.gitignore` 대상이라 커밋되지 않는다. 파일이 없어도 코드 기본값(`localhost:8080`, `localhost:3002`)으로 동작하므로 clone 직후 별도 설정 없이 로컬 개발이 가능하다.

```
# bo-api 프록시 대상 (서버 전용, 브라우저에 노출 안 됨)
API_PROXY_TARGET=http://localhost:8080

# 서버 컴포넌트에서 fo 자기 자신을 절대주소로 호출해야 할 때 사용
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

dev/운영 환경에서는 배포 파이프라인 또는 서버의 `.env.production` 등으로 실제 bo-api 주소를 주입한다.

## 4. 공통 함수 — `fo/src/lib/api.ts`의 `fetchApi<T>()`

- **컴포넌트에서 직접 `fetch()` 호출 금지**, 반드시 `fetchApi<T>()` 경유
- 요청 경로(`endpoint`)는 항상 `/api/v1/fo/...`로 시작 (rewrites 대상 경로와 일치해야 프록시가 동작)
- Next.js 서버 컴포넌트에서 호출할 때와 브라우저(클라이언트 컴포넌트)에서 호출할 때를 자동으로 구분해서 처리한다:
  - 브라우저 실행(`typeof window !== "undefined"`) → 상대경로 그대로 사용 (브라우저가 현재 origin 기준으로 해석)
  - 서버 실행(서버 컴포넌트/SSR) → Node의 `fetch`는 상대경로를 해석하지 못하므로 `NEXT_PUBLIC_SITE_URL`을 붙여 절대주소로 호출 (내부적으로는 여전히 fo 서버를 거쳐 rewrites 프록시가 적용됨)

```ts
// 사용 예시
const banners = await fetchApi<BannerDto[]>("/api/v1/fo/main/banners");
```

### 4-1. 서버 컴포넌트 vs 클라이언트 컴포넌트 — 캐시 함정 주의

⚠️ **서버 컴포넌트(`async function`)에서 `await fetchApi(...)`를 직접 호출해 데이터를 렌더링하면, 배포 환경에 CDN/엣지 캐시가 있는 경우 그 결과가 정적 HTML에 그대로 구워져서 캐시(`Cache-Control: s-maxage=...`)에 고정될 수 있다.** 이후 bo에서 데이터를 추가·수정해도 캐시가 풀리기 전까지 화면에 반영되지 않고, **재배포로도 해결되지 않는다**(캐시는 origin 재배포와 무관하게 유지됨).

- `fo/src/app/services/warranty-policy/components/WarrantyPolicyCoverage.tsx` 사례 참고 — 위와 같은 증상 발생, `"use client"` + `useEffect`/`useState`(`alive` 가드 패턴, company/blog·company/careers와 동일)로 전환해 해결.
- **slug 데이터 바인딩은 기본값으로 클라이언트 사이드 fetch(`"use client"` + `useEffect`)를 사용할 것.** 서버 컴포넌트에서 직접 fetch하는 방식은 캐시 무효화 전략(`cache: 'no-store'`, `revalidate` 설정, on-demand revalidation 등)이 확실히 준비된 경우에만 예외적으로 사용한다.

## 5. 개발 프로세스 (fo 전용 간소화 STEP)

fo는 빌더 시스템이 없고, DB/BE는 이미 존재하는 bo-api를 그대로 사용하므로 bo 빌더의 STEP 1~6(퍼블리싱→DB→API→FE 설계) 전체를 따르지 않고 아래로 축소한다.

API는 크게 두 개념으로 나뉜다.
- **slug 개념** — bo "홈페이지관리" PageData(slug)에서 나오는 데이터 바인딩 작업. `fo/docs/fo-data-binding-가이드.md`의 4단계(마크업 태깅 → where/row limit 확인 → `fo/docs/dev/{섹션}/{파일}.md` 작성 → 개발)를 따른다.
- **slug 아닌 개념** — GNB 메뉴(`FoMenuController` 등)처럼 PageData/slug 구조가 아닌 API. 아래 STEP을 따른다.

```
STEP 1. bo-api에 필요한 API가 이미 있는지 확인
        → docs/pages/{기능}/be_{기능}.md 존재 여부 확인
        → 없으면 BE 신규 개발 필요, 별도 협의 후 진행
STEP 2. 개발 (BE 신규 필요시 BE 먼저 → FE)
STEP 3. fo(3002) 화면에서 직접 데이터 반영 확인
```

## 6. 체크리스트

- [ ] 요청 경로가 `/api/v1/fo/`로 시작하는가?
- [ ] `fetchApi<T>()`를 거치는가 (직접 `fetch()` 사용 금지)?
- [ ] 응답 타입을 `interface`/`type`으로 정의했는가?
- [ ] `next.config.ts`의 rewrites 대상 경로와 실제 호출 경로가 일치하는가?
