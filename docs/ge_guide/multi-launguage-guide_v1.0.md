# BO 다국어(i18n) 시스템 가이드 v1.0

> 작성일: 2026-06-01  
> 대상: BO 프론트엔드 개발자, 운영자

---

## 목차

1. [개요](#1-개요)
2. [동작 원리](#2-동작-원리)
3. [DB 구조](#3-db-구조)
4. [다국어 관리 페이지 — 데이터 저장 방법](#4-다국어-관리-페이지--데이터-저장-방법)
5. [개발자 사용법 — 각 페이지에서 적용하기](#5-개발자-사용법--각-페이지에서-적용하기)
6. [키 네이밍 컨벤션](#6-키-네이밍-컨벤션)
7. [추후 확장성](#7-추후-확장성)
8. [msgKey 패턴 — 데이터 값 자체를 다국어로 처리하기](#8-msgkey-패턴--데이터-값-자체를-다국어로-처리하기)
9. [MessageKeySelector 컴포넌트 — 자동완성 셀렉트](#9-messagekeyselector-컴포넌트--자동완성-셀렉트)

---

## 1. 개요

BO 다국어 시스템은 **별도의 i18n 라이브러리(next-intl, i18next 등) 없이** 자체 구현된 방식입니다.  
번역 텍스트는 **DB(`message_resource` 테이블)** 에 저장되며, 앱 초기화 시 전체를 메모리에 로드해 사용합니다.

### 현재 지원 언어

| 코드 | 언어 |
|------|------|
| `ko` | 한국어 (기본값) |
| `en` | English |

---

## 2. 동작 원리

### 전체 흐름

```
[앱 진입]
    │
    ▼
AdminLayout 마운트
    │
    ├─ useI18nStore.fetchMessages() 호출
    │       │
    │       ▼
    │   GET /api/v1/message-resources?active=true&size=9999
    │       │
    │       ▼
    │   messages 맵 캐시 { key: { ko, en } }
    │       │
    │       ▼
    │   isLoaded = true → 스피너 종료, 페이지 렌더링
    │
    └─ useLanguageStore
            │
            ▼
        localStorage('bo_locale') 읽기
        없으면 기본값 'ko'
```

### 언어 변경 흐름

```
[사용자가 언어 선택]
    │
    ▼
localStorage('bo_locale') = 'en' 저장
    │
    ▼
window.location.reload()
    │
    ▼
앱 재시작 → useLanguageStore 초기화 시 'en' 읽음
    │
    ▼
useI18n().t('key') → 영어 텍스트 반환
```

### 핵심 파일 구조

```
bo/src/
├── store/
│   ├── useI18nStore.ts       ← 메시지 API 호출 및 캐시
│   └── useLanguageStore.ts   ← 현재 언어 상태 (localStorage 연동)
├── hooks/
│   └── useI18n.ts            ← t() 번역 함수 제공
└── components/
    └── layout/
        ├── AdminLayout.tsx    ← fetchMessages() 최초 호출 지점
        └── LanguageSelector.tsx ← 언어 선택 드롭다운 UI
```

---

## 3. DB 구조

### `message_resource` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | BIGINT | PK |
| `key` | VARCHAR | 번역 키 (유니크, 예: `login.title`) |
| `ko` | TEXT | 한국어 텍스트 |
| `en` | TEXT | 영어 텍스트 (null 허용) |
| `is_active` | BOOLEAN | 사용 여부 (`true`인 항목만 로드됨) |
| `resource_type` | VARCHAR | `WORD` (단어) / `SENTENCE` (문장) |
| `created_by` | VARCHAR | 등록자 |
| `created_at` | TIMESTAMP | 등록일시 |
| `updated_by` | VARCHAR | 수정자 |
| `updated_at` | TIMESTAMP | 수정일시 |

### INSERT 예시

```sql
-- docs/db/i18n/lang.sql 파일에 누적 작성
INSERT INTO message_resource ("key", ko, en, is_active, resource_type, created_by, created_at, updated_by, updated_at)
VALUES
('site.col.name', '홈페이지명', 'Site Name', true, 'WORD', 'system', NOW(), 'system', NOW())
ON CONFLICT ("key") DO NOTHING;
```

> **중요:** `ON CONFLICT ("key") DO NOTHING` 을 반드시 포함해 중복 실행을 방지합니다.

---

## 4. 다국어 관리 페이지 — 데이터 저장 방법

### 접근 경로

```
BO 관리자 → 시스템 설정 → 다국어 관리
URL: /admin/settings/i18n
```

### 방법 1 — 관리 페이지에서 직접 등록 (운영 중 추가)

1. `/admin/settings/i18n` 접속
2. 우측 상단 **[항목 추가]** 버튼 클릭
3. Drawer에서 입력:
   - **Key**: 점(`.`) 구분 계층 구조 (예: `site.col.name`)
   - **한국어**: 한국어 텍스트
   - **영어**: 영어 텍스트
   - **유형**: `WORD`(단어) / `SENTENCE`(문장)
   - **사용여부**: 사용으로 설정해야 앱에 반영됨
4. **저장** 클릭

> **주의:** 저장 후 페이지를 새로고침해야 앱에 적용됩니다.  
> (이미 로드된 캐시는 새로고침 전까지 유지됨)

### 방법 2 — SQL 스크립트 실행 (초기 데이터 / 배포 시)

`docs/db/i18n/lang.sql` 파일에 누적 작성 후 DB에 직접 실행합니다.

```
docs/db/i18n/
└── lang.sql   ← 모든 다국어 초기 데이터를 여기에 누적
```

**실행 방법:**

```sql
-- DBeaver, psql, DataGrip 등에서 lang.sql 전체 실행
-- ON CONFLICT DO NOTHING 으로 기존 데이터 보호
```

### is_active = false 시 동작

- 앱 로드 시 `is_active = true` 인 항목만 가져옵니다.
- `false`로 설정된 키는 **`t('key')` 호출 시 key 값 그대로 화면에 출력**됩니다.
- 의도치 않은 key 노출을 막으려면 반드시 `is_active = true` 로 저장해야 합니다.

---

## 5. 개발자 사용법 — 각 페이지에서 적용하기

### 기본 사용

```tsx
import { useI18n } from '@/hooks/useI18n';

export default function MyPage() {
    const { t } = useI18n();

    return <h1>{t('site.col.name')}</h1>;
    // 한국어: '홈페이지명'
    // 영어:   'Site Name'
}
```

### 변수 치환

`{변수명}` 형식으로 동적 값을 삽입할 수 있습니다.

```tsx
// DB에 저장된 값:
// ko: '{name}님, 반갑습니다!'
// en: 'Welcome, {name}!'

t('login.toast.success', { name: '홍길동' })
// 한국어: '홍길동님, 반갑습니다!'
// 영어:   'Welcome, 홍길동!'
```

### useMemo 내부 사용 (위젯 설정 등)

`t`가 의존성 배열에 포함되어야 언어 변경 시 올바르게 재생성됩니다.

```tsx
const { t } = useI18n();

const TABLE_WIDGET = useMemo(() => ({
    columns: [
        { header: t('site.col.name'), accessor: 'name', ... },
        { header: t('site.col.domain'), accessor: 'domain', ... },
    ],
}), [t]);  // ← t를 의존성에 반드시 포함
```

### 키가 없을 때 동작

DB에 등록되지 않은 키를 호출하면 **키 값 자체가 그대로 출력**됩니다.

```tsx
t('not.exist.key')
// 출력: 'not.exist.key'  ← 누락된 키를 쉽게 발견할 수 있음
```

---

## 6. 키 네이밍 컨벤션

### 구조

```
{도메인}.{구분}.{세부}
```

### 도메인별 접두어

| 접두어 | 설명 | 예시 |
|--------|------|------|
| `common.` | 전체 공통 | `common.btn.save`, `common.active` |
| `login.` | 로그인 페이지 | `login.title`, `login.toast.success` |
| `site.` | 사이트 관리 | `site.col.name`, `site.form.title.new` |
| `admin.` | 관리자 관리 | `admin.col.name` |
| `menu.` | 메뉴 관리 | `menu.col.name` |
| `code.` | 코드 관리 | `code.col.name` |

### 구분자 패턴

| 패턴 | 의미 | 예시 |
|------|------|------|
| `.col.` | 테이블 컬럼 헤더 | `site.col.name` |
| `.btn.` | 버튼 라벨 | `common.btn.save` |
| `.form.title.` | 폼 타이틀 | `site.form.title.new` |
| `.field.{필드}.label` | 폼 필드 라벨 | `site.field.name.label` |
| `.field.{필드}.placeholder` | 폼 필드 placeholder | `site.field.name.placeholder` |
| `.toast.` | 토스트 메시지 | `site.toast.created` |
| `.validation.` | 유효성 메시지 | `site.validation.name.required` |
| `.confirm.` | 확인 다이얼로그 | `site.confirm.delete` |

### resource_type 기준

| 값 | 기준 |
|----|------|
| `WORD` | 단어 / 짧은 라벨 (버튼, 컬럼명 등) |
| `SENTENCE` | 문장 (설명, 메시지, placeholder 등) |

---

## 8. msgKey 패턴 — 데이터 값 자체를 다국어로 처리하기

### 8-1. 개념 — UI 라벨 vs 데이터 값

`t('key')` 패턴은 **UI 라벨**(버튼, 컬럼 헤더 등 코드에 고정된 텍스트)에 사용한다.  
하지만 **DB에 저장되는 데이터 값** 자체가 다국어 표시가 필요할 때는 다른 접근이 필요하다.

| 구분 | 예시 | 처리 방식 |
|---|---|---|
| UI 라벨 | 저장 버튼, 테이블 헤더 | `t('common.btn.save')` — 코드에 직접 |
| **데이터 값** | 메뉴명, 사이트명 | **msgKey 패턴** — DB에 key로 저장 |

### 8-2. msgKey 패턴 동작 원리

```
[관리자가 메뉴명 저장]
    │
    ▼
MessageKeySelector에서 message_resource.key 선택
예: 'menu.home.name'
    │
    ▼
BE: nameMsgKey = 'menu.home.name' 컬럼에 저장
    + message_resource 조회 → ko 값('홈')을 name 컬럼에도 함께 저장 (폴백용)
    │
    ▼
FE 렌더링:
item.nameMsgKey
    ? t(item.nameMsgKey)    → 현재 언어로 번역 ('홈' | 'Home')
    : item.name             → fallback: DB의 name 컬럼 (ko 고정)
```

> **왜 `name` 컬럼에도 같이 저장하나?**  
> `nameMsgKey`가 없는 구버전 데이터나 message_resource 키가 삭제된 경우에도  
> 최소한 한국어 텍스트는 보여줄 수 있도록 폴백용으로 유지한다.

### 8-3. 현재 적용된 엔티티 목록

| 엔티티 | 컬럼 | FE 파일 | BE 서비스 |
|---|---|---|---|
| 메뉴 (Menu) | `nameMsgKey`, `descriptionMsgKey` | `components/menus/menu-detail.tsx` | `MenuService.java` |
| 사이트 (Site) | `nameMsgKey` | `app/admin/settings/sites/[id]/page.tsx` | `SiteService.java` |

### 8-4. FE 렌더링 패턴

**store 타입 선언 (`use-menu-store.ts` 참조)**

```typescript
export interface MenuItem {
    name: string;               // 한국어 폴백 (BE가 자동 설정)
    nameMsgKey?: string;        // message_resource.key
    description?: string;       // 한국어 폴백
    descriptionMsgKey?: string; // message_resource.key
}
```

**화면 렌더링 시 (`page-layout.tsx`, `header.tsx` 패턴)**

```tsx
const { t } = useI18n();

// ✅ msgKey 있으면 번역, 없으면 name 폴백
const displayName = item.nameMsgKey ? t(item.nameMsgKey) : item.name;
const displayDesc = item.descriptionMsgKey ? t(item.descriptionMsgKey) : item.description;
```

### 8-5. BE 처리 패턴

BE는 **저장 시** `nameMsgKey`로 `message_resource` 를 조회해 ko 값을 `name` 컬럼에 함께 저장한다.

**SiteService.java / MenuService.java 공통 패턴:**

```java
// 저장 시: msgKey → ko 텍스트 조회 → name 컬럼에 저장
String nameKo = messageResourceRepository.findByKey(request.getNameMsgKey())
    .map(MessageResource::getKo)
    .orElse("");

entity.setName(nameKo);           // 폴백용 ko 텍스트
entity.setNameMsgKey(request.getNameMsgKey());  // 키 저장
```

**응답 DTO에도 반드시 포함:**

```java
// SiteDto.Response, MenuResponse 등
.name(entity.getName())
.nameMsgKey(entity.getNameMsgKey())   // ← 반드시 포함해야 FE 번역 가능
```

### 8-6. 새 엔티티에 msgKey 패턴 적용 순서

```
STEP 1. message_resource 키 등록
         docs/db/i18n/lang.sql에 INSERT 추가
         예: ('role.admin.name', '시스템 관리자', 'System Admin', ...)

STEP 2. DB 컬럼 추가
         ALTER TABLE {테이블} ADD COLUMN name_msg_key VARCHAR(255);
         ALTER TABLE {테이블} ADD COLUMN description_msg_key VARCHAR(255);

STEP 3. BE Entity 수정
         @Column(name = "name_msg_key")
         private String nameMsgKey;

STEP 4. BE DTO 수정 (Request/Response 모두)
         Request: String nameMsgKey 추가
         Response: String nameMsgKey 추가

STEP 5. BE Service 수정
         resolveKo(nameMsgKey) 헬퍼로 name 컬럼 자동 설정
         (SiteService.java의 resolveNameKo 패턴 참조)

STEP 6. FE store 타입 수정
         interface에 nameMsgKey?: string 추가

STEP 7. FE 입력 폼 수정
         MessageKeySelector 컴포넌트 또는
         message-key-select 폼 빌더 타입 사용 (섹션 9 참조)

STEP 8. FE 렌더링 수정
         item.nameMsgKey ? t(item.nameMsgKey) : item.name 패턴 적용
```

---

## 9. MessageKeySelector 컴포넌트 — 자동완성 셀렉트

### 9-1. 컴포넌트 위치 및 역할

```
bo/src/components/i18n/message-key-selector.tsx
```

`message_resource` 전체 목록을 드롭다운으로 검색·선택하는 UI 컴포넌트.  
**저장값은 `key`**, 화면에는 **현재 언어 기준 텍스트**가 표시된다.

### 9-2. Props

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `value` | `string` | — | 현재 선택된 `message_resource.key` |
| `onChange` | `(key: string) => void` | — | 선택 시 콜백 (key 전달) |
| `disabled` | `boolean` | `false` | 비활성화 여부 |
| `resourceType` | `'WORD' \| 'SENTENCE' \| undefined` | `'WORD'` | 조회할 리소스 타입. `undefined`이면 전체 조회 |

### 9-3. 사용법 — 직접 컴포넌트 사용 (메뉴관리 방식)

커스텀 폼에서 직접 마운트하는 방식. `menu-detail.tsx`에서 사용 중.

```tsx
import { MessageKeySelector } from '@/components/i18n/message-key-selector';

// 상태
const [nameMsgKey, setNameMsgKey] = useState(menu?.nameMsgKey ?? '');

// 렌더링
<div className="space-y-1">
    <label className="text-xs font-medium text-slate-700">
        메뉴명 <span className="text-red-500">*</span>
    </label>
    <MessageKeySelector
        value={nameMsgKey}
        onChange={v => setNameMsgKey(v)}
        resourceType="WORD"
    />
    {/* 선택된 key는 컴포넌트 하단에 회색 힌트로 자동 표시됨 */}
</div>

// 설명 필드 (WORD+SENTENCE 전체)
<MessageKeySelector
    value={descriptionMsgKey}
    onChange={v => setDescriptionMsgKey(v)}
    resourceType={undefined}    // 전체 조회
/>

// 저장 payload
await saveMenu({
    nameMsgKey,
    descriptionMsgKey: descriptionMsgKey || undefined,
    ...
});
```

### 9-4. 사용법 — 폼 빌더 타입으로 사용 (사이트관리 방식)

`WidgetRenderer` + `FormWidget` 기반 페이지에서 사용하는 방식.  
`FieldRenderer.tsx`에 `message-key-select` case가 등록되어 있어 자동 처리된다.

```tsx
// types.ts의 FieldType에 'message-key-select' 이미 등록됨
// FieldRenderer.tsx:1287 ~ 1295 에서 MessageKeySelector를 호출함

const FORM_WIDGET: FormWidget = useMemo(() => ({
    type: 'form',
    widgetId: 'my-form',
    fields: [
        {
            id: 'nameMsgKey',
            type: 'message-key-select',   // ← 이 타입만 지정하면 자동 처리
            label: t('site.field.name.label'),
            colSpan: 12,
            rowSpan: 1,
            required: true,
            fieldKey: 'nameMsgKey',
        },
    ],
}), [t]);

// 폼 상태 초기값
const [formValues, setFormValues] = useState({
    nameMsgKey: '',
    ...
});

// 저장 payload
const payload = {
    nameMsgKey: formValues.nameMsgKey.trim(),
    ...
};
```

> **참조 파일:** `bo/src/app/admin/settings/sites/[id]/page.tsx`

### 9-5. 검색 동작

드롭다운 내 검색창에서 **key + ko + en** 세 가지를 동시에 검색한다.

| 입력 | 매칭 예시 |
|---|---|
| `site` | key에 `site.`가 포함된 항목 전체 |
| `홈페이지` | ko가 '홈페이지명'인 항목 |
| `Site Name` | en이 'Site Name'인 항목 |

### 9-6. 컴포넌트 내부 동작 요약

```
마운트 시
    → GET /api/v1/message-resources?active=true&size=9999&resourceType=WORD
    → options 상태에 캐시

선택 시
    → onChange(key) 콜백 호출
    → 드롭다운 닫힘, 검색어 초기화

화면 표시
    → 선택된 key에 해당하는 ko/en 텍스트 표시 (현재 언어 기준)
    → 선택값 하단에 key를 회색 폰트(font-mono)로 힌트 표시

preview 모드
    → disabled=true 로 전달되어 선택 불가
```

---

## 7. 추후 확장성

### 7-1. 새 언어 추가

**① `useLanguageStore.ts`에 언어 추가**

```ts
// bo/src/store/useLanguageStore.ts
export const SUPPORTED_LOCALES = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },      // ← 추가
] as const;
```

**② `useI18n.ts`에 새 언어 처리 추가**

```ts
// bo/src/hooks/useI18n.ts
const text =
    locale === 'en' && entry.en ? entry.en :
    locale === 'zh' && entry.zh ? entry.zh :  // ← 추가
    entry.ko;
```

**③ `useI18nStore.ts` — messages 맵에 새 언어 저장**

```ts
map[item.key] = { ko: item.ko, en: item.en ?? null, zh: item.zh ?? null };
```

**④ `message_resource` 테이블에 `zh` 컬럼 추가 (DDL)**

```sql
ALTER TABLE message_resource ADD COLUMN zh TEXT;
```

**⑤ `lang.sql`에 번역 데이터 추가**

```sql
UPDATE message_resource SET zh = '登录' WHERE key = 'login.submit';
```

> 이 과정 외에 다른 페이지 파일은 수정할 필요가 없습니다. `t('key')` 호출 코드는 그대로 유지됩니다.

---

### 7-2. 현재 캐시 방식의 한계와 대응

| 상황 | 현재 동작 | 대응 방법 |
|------|-----------|-----------|
| 새 키 추가 후 즉시 반영 | 앱 새로고침 필요 | 운영 중 추가 시 공지 후 새로고침 유도 |
| 메시지 수가 매우 많아질 경우 | 전체 로드로 느려질 수 있음 | 도메인별 lazy load 도입 고려 |
| 번역 누락 시 | 키 값이 그대로 출력됨 | 개발/QA 단계에서 키 확인 |

---

### 7-3. 향후 고려 사항

- **서버사이드 렌더링(SSR) 지원**: 현재는 클라이언트에서만 로드. Next.js의 `generateStaticParams` 또는 서버 컴포넌트 전환 시 API 호출 구조 변경 필요.
- **번역 자동화**: 영어 미입력 항목을 관리 페이지에서 일괄 확인 및 번역 도구 연동.
- **네임스페이스 분리**: 페이지별 메시지만 로드하는 방식 (`?keyPrefix=site.`) 으로 성능 최적화 가능.
