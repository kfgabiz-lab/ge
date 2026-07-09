# FO 데이터 바인딩 작업 가이드

> 대상: `fo/docs/fo-data-binding.md`(fo 전체 tsx 파일 목록 + data slug 매핑표)를 기준으로 개별 컴포넌트에 실제 API 데이터를 연결하는 모든 작업
> 관련 문서: `fo/docs/fo-data-binding.md`(작업 목록), `docs/ge_guide/fo/fo-api연동가이드.md`(API 연동 공통 규칙 — 프록시/공통함수/환경변수)

---

## 1. 배경 — data-slug / data-slugKey가 가리키는 것

fo 화면의 각 데이터 블록은 bo "홈페이지관리"에서 만든 **PageData**(slug로 식별, `bo-api`의 `SlugRegistry`에 등록) 하나에 대응한다.

```
bo 홈페이지관리에서 콘텐츠 입력
        ↓
   PageData 저장 (slug로 식별, dataJson: { 섹션: { 필드: 값 } })
        ↓
   fo 컴포넌트의 data-slug/data-slugKey가 그 slug·필드를 가리킴
```

- `data-slug` = bo PageData의 slug 값 (bo 빌더 위젯의 `sourceSlug`/`dbSlug`와 동일한 개념 — `docs/ge_guide/builder/00-1.builder_widget_components.md`의 `sourceSlug` 참고)
- `data-slugKey` = 그 PageData의 `dataJson`을 `flattenPageDataItem`(bo와 동일 개념)으로 flatten한 후의 필드명

```html
<!-- 단건 (텍스트 콘텐츠 바인딩) -->
<div data-slug="hero-data">
  <div data-slugKey="name"></div>
  <div data-slugKey="phone"></div>
</div>

<!-- 다건(배열) — 바깥 컨테이너에 data-slug-repeat, 반복되는 아이템에 data-slug-item -->
<div data-slug="main-industries" data-slug-repeat="true">
  <div data-slug-item>
    <div data-slugKey="title"></div>
    <img data-slugKey="image" />
  </div>
</div>

<!-- 속성 바인딩 — 값이 텍스트가 아니라 href/src 등 속성에 들어가는 경우, data-slugKey-attr로 대상 속성명을 명시 -->
<a data-slugKey="url" data-slugKey-attr="href" href="">...</a>
<img data-slugKey="image" data-slugKey-attr="src" src="" />
```

- 단건: `data-slug`가 붙은 요소 하나에 `data-slugKey` 필드들이 직접 들어감
- 다건(배열): `data-slug` + `data-slug-repeat="true"`가 붙은 바깥 컨테이너 안에, 실제 반복(`.map()`) 대상 요소에 `data-slug-item`을 붙이고 그 안에 `data-slugKey`를 태깅. (예시는 `fo/docs/dev/_examples/main-cards.md` 참고)
- 속성 바인딩: `data-slugKey-attr`가 있으면 그 속성(예: `href`, `src`)에 값을 쓰고, 없으면 텍스트 콘텐츠에 쓴다. 에이전트가 요소 종류로 추측하지 않도록 반드시 명시한다.

이 속성은 **에이전트가 코드를 분석해서 직접 마크업에 추가**하는 것이며, 자동으로 값을 읽어 채우는 런타임 라이브러리/컴포넌트가 아니다. 아래 4단계로 작업이 완전히 분리된다.

---

## 2. 작업 4단계

```
STEP 1. 마크업 태깅
        → 대상 tsx 파일을 분석해서 실제 JSX에 data-slug/data-slugKey 속성을 직접 추가
        → 이 시점엔 실제 데이터 연결(fetch) 안 함 — 위치 표시만

STEP 2. where 파라미터 / row limit 확인
        → 해당 slug 조회 시 필터 조건(where)이 필요한지 확인
          (bo 빌더의 evalConditionExpr 문법 재사용 — comma-AND, =,!=,<,>,<=,>=, today())
        → row limit 확인 — 단건(카드 1개) vs 다건(목록, 페이지 크기 등)

STEP 3. 작업 단위 문서 작성 — fo/docs/dev/{섹션}/{파일}.md
        → STEP 1·2에서 확인한 내용을 문서화, 승인 대기

STEP 4. 문서 기반 fo API 개발
        → 승인된 문서를 바탕으로 fetchApi<T>() 연동 개발 진행
          (docs/ge_guide/fo/fo-api연동가이드.md 규칙 준수)
```

---

## 3. 작업 단위 문서 — `fo/docs/dev/{섹션}/{파일}.md`

### 트리거
사용자가 `fo/docs/fo-data-binding.md`에서 항목 하나를 지정 (예: "2-9 main의 Main Cards 해줘")

### 경로/파일명 규칙
- `{섹션}` = `fo-data-binding.md`의 상위 분류명 그대로 (`main`, `company`, `markets`, `products-systems`, `search`, `services`, `support`, `banners`, `common` 등)
- `{파일}` = 대상 tsx 파일명을 kebab-case로 (`main-cards.tsx` → `main-cards.md`)
- 예: 2-9 main의 Main Cards → `fo/docs/dev/main/main-cards.md`

### 문서 템플릿

```markdown
# {패널명} 데이터 바인딩 설계

> 대상 파일: {tsx 경로}
> 상태: 설계중 / 승인됨 / 개발완료

## 1. data-slug
- 값: {slug명}
- 다건 여부: 단건 / 다건(배열)

## 2. data-slugKey 매핑
| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|

## 3. API 확인 (최종 체크 — 반드시 작성)
- 신규 API 필요 여부: 신규 필요 / 기존 활용 가능
- (기존 활용 가능 시) 참고 엔드포인트:
- (신규 필요 시) 제안 엔드포인트:

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식, evalConditionExpr 문법):
- row limit(단건 / 다건 개수):
- orderBy(정렬 필드 + ASC/DESC):
- 2차 정렬(tie-breaker — 1차 정렬값 동일 시 기준, 보통 id):

## 5. 샘플 응답 데이터
(JSON)

## 6. 비고
(필요 시 추가 확인: 캐시/revalidate 정책, 매칭 0건일 때 동작, dataJson 필드 누락 시 처리, 응답 envelope 형태)

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
```

### 승인 흐름
1. STEP 1·2 진행 후 문서 작성 (상태: 설계중), **3번 "API 확인"은 문서 작성 마지막에 반드시 체크**
2. 사용자 승인 → 상태 "승인됨"으로 변경, `fo-data-binding.md`의 해당 행 `data slug` 컬럼에 실제 값 반영
3. `#개발`/`#진행` 명령 시에만 STEP 4(BE 분석·설계) 이후 착수 — API 확인 결과에 따라 BE 신규 개발 여부 결정
4. **각 STEP 담당 에이전트가 완료할 때마다 "7. STEP별 진행 이력" 표에 한 줄씩 추가한다** — 별도 이력 관리 없이 이 문서 하나로 전체 진행 상황을 추적

### 예시 문서
> ⚠️ 아래 2개는 템플릿 사용법을 보여주기 위한 **예시(가짜 데이터)**이며, 실제 Banner Swiper·Main Cards 설계 시 그대로 재사용하면 안 된다. 실제 작업 시 이 파일들은 진짜 분석 결과로 덮어써야 한다.
- 기존 API 활용 가능 케이스: `fo/docs/dev/_examples/banner-swiper.md`
- 신규 API 필요 + 다건(배열) 케이스: `fo/docs/dev/_examples/main-cards.md`
