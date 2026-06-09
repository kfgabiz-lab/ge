# Slug Entity FE 상세 설계서

## 1. 개요

- **설계 목적**: 빌더 연동용 엔티티 구조(필드 정의)를 등록·관리하는 어드민 CRUD 페이지
- **참조 자산**:
  - 페이지: `bo/src/app/admin/settings/slug-entity/page.tsx`
  - 컴포넌트: `bo/src/components/slug-entity/EntityList.tsx`, `EntityFieldEditor.tsx`
  - BE 설계: [be_slug-entity.md](./be_slug-entity.md)
  - DB 설계: [db_slug-entity.md](../../db/slug-entity/db_slug-entity.md)

---

## 2. 레이아웃 구조

`database/tables/page.tsx`와 동일한 2단 분할 패턴 사용.

```
┌─────────────────────┬───────────────────────────────────────────┐
│  EntityList         │  EntityFieldEditor                        │
│  (좌측 패널)         │  (우측 패널)                               │
└─────────────────────┴───────────────────────────────────────────┘
```

### 2.1 좌측 — EntityList

- 검색 입력창 (slug / name 실시간 필터 또는 API 검색)
- entity 목록 (slug, name, 필드 수, active 배지)
- 클릭 시 우측 패널에 해당 entity 필드 편집 표시
- `[+ Entity 등록]` 버튼 → 등록 모달 열기

### 2.2 우측 — EntityFieldEditor

- **미선택 상태**: "왼쪽 목록에서 entity를 선택하세요." 안내 텍스트
- **선택 상태**:
  - 상단: slug (읽기 전용), name, table_name 표시
  - 필드 편집 테이블 (인라인 편집)
  - 하단: `[+ 필드 추가]`, `[저장]`, `[Entity 삭제]` 버튼

---

## 3. 데이터 마스터 및 유효성 검사

### 3.1 Entity 기본 정보

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| Slug | `slug` | String | Y | 영문/숫자/하이픈/언더스코어, max 100 | slug는 영문/숫자/하이픈/언더스코어만 가능합니다. |
| 표시명 | `name` | String | Y | max 100 | 표시명을 입력해주세요. |
| DB 테이블명 | `tableName` | String | Y | max 100 | DB 테이블명을 입력해주세요. |
| 설명 | `description` | String | N | - | - |
| 사용여부 | `active` | Boolean | Y | - | - |

### 3.2 Entity Field (행 단위)

| 필드명 (UI) | Key | 타입 | 필수 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|:---|:---|:---|
| Java 필드명 | `fieldName` | String | Y | max 100 | 필드명을 입력해주세요. |
| DB 컬럼명 | `columnName` | String | Y | max 100 | 컬럼명을 입력해주세요. |
| Java 타입 | `javaType` | Select | Y | 7개 허용값 | Java 타입을 선택해주세요. |
| DB 타입 | `columnType` | String | N | max 50 | - |
| 길이 | `columnLength` | Number | N | 양의 정수 | - |
| PK | `isPk` | Boolean | N | - | - |
| NULL 허용 | `isNullable` | Boolean | N | - | - |
| 기본값 | `defaultValue` | String | N | max 200 | - |
| 설명 | `description` | String | N | max 500 | - |

### 3.3 javaType 선택 옵션

```
String / Long / Integer / Boolean / LocalDateTime / LocalDate / BigDecimal
```

---

## 4. 파일 구조

```
bo/src/
├── app/admin/settings/slug-entity/
│   └── page.tsx                        # 페이지 진입점
└── components/slug-entity/
    ├── EntityList.tsx                  # 좌측 목록 패널
    └── EntityFieldEditor.tsx           # 우측 필드 편집 패널
```

---

## 5. 컴포넌트 상세

### 5.1 page.tsx

- `'use client'`
- 선택된 entity 상태 관리: `selectedEntity: SlugEntityResponse | null`
- `<EntityList>`, `<EntityFieldEditor>` 렌더링
- 두 컴포넌트 간 선택 상태 prop 전달

### 5.2 EntityList.tsx

**Props:**
| prop | 타입 | 설명 |
|:---|:---|:---|
| selectedId | number \| null | 현재 선택된 entity id |
| onSelect | (entity: SlugEntityResponse \| null) => void | 선택 콜백 |
| onCreated | () => void | 등록 완료 후 목록 갱신 콜백 |

**상태:**
- `entities`: entity 목록
- `search`: 검색어
- `loading`: 로딩 여부
- `modalOpen`: 등록 모달 열림 여부
- `form`: 등록 폼 상태

**주요 동작:**
- 마운트 시 `GET /api/v1/slug-entity` 호출 (페이징 없이 전체 또는 페이징)
- 검색어 변경 시 실시간 클라이언트 필터 (목록이 많지 않을 것으로 예상)
- entity 클릭 시 `onSelect` 호출
- `[+ Entity 등록]` 클릭 → 등록 모달
- 등록 성공 시 목록 재조회 + 새로 등록된 entity 자동 선택

**등록 모달:**
- slug, name, tableName, description, active 입력
- slug는 등록 후 수정 불가 안내 표시
- 저장 시 `POST /api/v1/slug-entity`

### 5.3 EntityFieldEditor.tsx

**Props:**
| prop | 타입 | 설명 |
|:---|:---|:---|
| entity | SlugEntityResponse \| null | 선택된 entity (null이면 미선택 상태) |
| onDeleted | () => void | 삭제 완료 후 콜백 |
| onUpdated | (entity: SlugEntityResponse) => void | 수정/저장 완료 후 콜백 |

**상태:**
- `fields`: 편집 중인 필드 목록 (로컬 상태)
- `saving`: 저장 중 여부
- `deleting`: 삭제 중 여부

**주요 동작:**

| 동작 | 설명 |
|:---|:---|
| entity 선택 시 | `entity.fields`를 로컬 `fields` 상태로 복사 |
| `[+ 필드 추가]` | 빈 행을 `fields` 배열 끝에 추가 |
| 행 삭제 버튼 | 해당 index 행을 `fields` 배열에서 제거 |
| 행 순서 이동 | ▲▼ 버튼으로 sort_order 재정렬 |
| `[저장]` 클릭 | 필드 전체 검증 후 `PUT /api/v1/slug-entity/{id}/fields` |
| `[Entity 삭제]` | confirm 후 `DELETE /api/v1/slug-entity/{id}` → onDeleted |

**필드 편집 테이블 컬럼:**

| # | fieldName | columnName | javaType | columnType | length | PK | NULL | 삭제 |
|---|-----------|------------|----------|------------|--------|----|----|------|
| 1 | input | input | select | input | input | checkbox | checkbox | 버튼 |

---

## 6. API 연동 목록

| 동작 | Method | URL | 설명 |
|:---|:---|:---|:---|
| 목록 조회 | GET | `/api/v1/slug-entity` | 마운트 시, 등록/수정/삭제 후 |
| 단건 조회 | GET | `/api/v1/slug-entity/{id}` | entity 선택 시 최신 필드 조회 |
| entity 등록 | POST | `/api/v1/slug-entity` | 등록 모달 저장 |
| entity 수정 | PUT | `/api/v1/slug-entity/{id}` | (추후 수정 UI 필요 시) |
| entity 삭제 | DELETE | `/api/v1/slug-entity/{id}` | Entity 삭제 버튼 |
| 필드 일괄 저장 | PUT | `/api/v1/slug-entity/{id}/fields` | 저장 버튼 |

---

## 7. UX 상세

### 7.1 저장 흐름

```
[저장] 클릭
 → 필드 목록 FE 검증 (fieldName/columnName/javaType 필수 확인)
 → 실패: 해당 행 하이라이트 + 토스트 에러
 → 성공: PUT /api/v1/slug-entity/{id}/fields
   → 성공: 토스트 "저장되었습니다." + onUpdated 콜백
   → 실패: 토스트 에러 메시지
```

### 7.2 Entity 삭제 흐름

```
[Entity 삭제] 클릭
 → confirm("'{name}' entity를 삭제하시겠습니까?\n하위 필드도 함께 삭제됩니다.")
 → 확인: DELETE /api/v1/slug-entity/{id}
   → 성공: 토스트 "삭제되었습니다." + onDeleted 콜백 → 선택 해제
   → 실패: 토스트 에러
```

### 7.3 미저장 변경 보호

- `fields` 로컬 상태가 원본과 다른 상태에서 다른 entity 선택 시:
  - confirm("저장하지 않은 변경사항이 있습니다. 이동하시겠습니까?")
  - 확인 시 이동 / 취소 시 현재 entity 유지

---

## 8. 메뉴 등록

| 항목 | 값 |
|:---|:---|
| 메뉴명 | Entity 관리 |
| URL | `/admin/settings/slug-entity` |
| 위치 | Settings 하위 (slug-registry 다음) |
| 권한 | SUPER_ADMIN |

---

## 9. FE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 9.1 페이지 구조
- [ ] 2단 레이아웃이 구성되었는가? (EntityList 좌 / EntityFieldEditor 우)
- [ ] entity 미선택 시 우측에 안내 메시지가 표시되는가?
- [ ] 페이지 진입 시 entity 목록이 자동 로드되는가?

### 9.2 EntityList
- [ ] entity 목록이 정상 표시되는가? (slug, name, 필드 수)
- [ ] 검색어 입력 시 필터링이 동작하는가?
- [ ] entity 클릭 시 우측 패널이 전환되는가?
- [ ] 등록 모달이 정상 동작하는가?
- [ ] 등록 성공 시 목록 갱신 + 새 entity 자동 선택되는가?
- [ ] slug 중복 시 409 에러 토스트가 표시되는가?

### 9.3 EntityFieldEditor
- [ ] entity 선택 시 필드 목록이 표시되는가?
- [ ] 필드 행 추가/삭제가 동작하는가?
- [ ] 순서 이동(▲▼)이 동작하는가?
- [ ] 저장 시 필수 필드 검증이 동작하는가?
- [ ] 저장 성공/실패 토스트가 표시되는가?
- [ ] entity 삭제 confirm 후 삭제가 동작하는가?
- [ ] 미저장 변경 보호(다른 entity 선택 시 confirm)가 동작하는가?
