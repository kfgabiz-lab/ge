# Main Visual (공지 섹션) 데이터 바인딩 설계

> 대상 파일: `fo/src/components/main/main-visual.tsx` — `<section className="main_notic">` 부분만 해당
> (VideoSwiper/BannerSwiper는 별도 행 "Video Swiper"/"Banner Swiper"에서 처리)
> 상태: 승인됨 (STEP5 BE 개발 완료, 실제 데이터로 재검증 반영)

## 1. data-slug
- 값: `banner-data` (Banner Swiper와 동일 slug 재사용)
- 다건 여부: 단건 — `banner-data` 중 조건에 맞는 1건만 노출
- 실제 저장 구조: `dataJson.bannerForm.*` 하위에 중첩 (flatten 시 필드명만으로 접근 가능, bo-be-builder 실호출로 확인)

## 2. data-slugKey 매핑

실제 코드 구조 (`fo/src/components/main/main-visual.tsx:12-35`):
```html
<section className="main_notic">
  <div className="inner">
    <a href="" className="item" data-slug="banner-data" data-slugKey="url" data-slugKey-attr="href">
      <div className="tit_area">
        <p className="tit">
          <img src="/ico/ico_bell_20.svg" alt="" />
          <span data-slugKey="prefix">Exhibition</span>
        </p>
        <p className="txt" data-slugKey="txt">
          Triple iF Design 2026 3 Wins in Smart Device &amp; Energy Platform Design
        </p>
      </div>
      <div className="btn_area">More</div>
    </a>
  </div>
</section>
```

| slugKey | dataJson 필드(flatten 기준, `bannerForm.*`) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| prefix | prefix | string(공통코드 값, 예: `"1"`) | 텍스트 | **공통코드 라벨 표시** — 저장값은 코드(`"1"`), 화면엔 매핑된 라벨("Exhibition") 표시. 공통코드 그룹명은 STEP6(FE 개발) 시 확인 필요 |
| txt | title | string | 텍스트 | 본문 텍스트 — 실제 필드는 `title` (`bottomText`는 사용 안 함) |
| url | url | string(url) | 속성 `href` | `<a>`의 href 속성에 들어갈 이동 링크 |

## 3. API 확인 (최종 체크) — fo-be-analyzer 분석 + fo-be-builder 실개발/실검증 완료

- 신규 API 필요 여부: **완료** (신규 개발 완료)
  - 서비스 로직: `PageDataService.search()` 그대로 재사용 (시그니처 변경 없음)
  - 신규: `FoPageDataController`(`/api/v1/fo/page-data/{slug}`) 얇은 래퍼 생성 완료 (`FoMenuController` 패턴 준수)
- **확정 엔드포인트(실제 호출 검증 완료)**:
  `GET /api/v1/fo/page-data/banner-data?eq_bannerPosition=INFORMATION&eq_isVisible=001&drs_postDate=in_range&sort=updatedAt,desc&page=0&size=1`
- `page_data` 테이블 `data_slug='banner-data'` 행 존재: **확인 완료** — 실제 호출로 id 1330 등 데이터 확인됨

## 4. 조회 조건 (실제 값 기준 정정 완료)
- where(evalConditionExpr 문법): `bannerPosition=INFORMATION,isVisible=001,postDate_from<=today(),postDate_to>=today()`
  - `bannerPosition=INFORMATION` — 배너 포지션 구분값 (실제 저장값 **대문자**, 최초 설계의 `infomation`은 오타였음)
  - `isVisible=001` — 노출여부 공통코드 (필드명 `isVisible`, 최초 설계의 `isVisable`은 오타였음)
  - `postDate_from<=today()` — 게시 시작일 지남
  - `postDate_to>=today()` — 게시 종료일 안 지남 (게시기간 내)
- row limit: 단건(1) — 조건에 맞는 첫 번째 1건
- orderBy: `updatedAt DESC`
- 2차 정렬(tie-breaker): 없음

## 5. 샘플 응답 데이터 (실제 호출 결과, id 1330)

```json
{
  "content": [
    {
      "id": 1330,
      "templateSlug": "banner-detail",
      "dataJson": {
        "id": 1330,
        "bannerForm": {
          "url": "https://www.lselectricamerica.com/",
          "title": "info11",
          "prefix": "1",
          "infoSort": "-",
          "isVisible": "001",
          "bottomText": "dsfsdfsdfsdf",
          "postDate_to": "2026-07-08T15:01",
          "postDate_from": "2026-07-07T15:01",
          "bannerPosition": "INFORMATION"
        }
      },
      "createdAt": "2026-07-07T06:02:04.303982Z",
      "updatedAt": "2026-07-07T06:02:04.303982Z"
    }
  ],
  "totalElements": 2,
  "totalPages": 2,
  "page": 0,
  "size": 1
}
```

## 6. 비고
- BE 분석·설계 상세는 fo-be-analyzer 분석 결과 참고 (재사용 코드: `PageDataService.search()`, `appendWhereConditions()`, `toAuditColumn()`)
- BE 개발/실검증 상세는 fo-be-builder 결과 참고 — 신규 파일: `bo-api/src/main/java/com/ge/bo/controller/FoPageDataController.java`
- FE 개발 시 반영: `prefix`는 공통코드 라벨 매핑 없이 원본 코드값을 그대로 노출 (TODO 주석 표기, 후속 작업으로 분리)

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1·2 | fo-slug-analyzer | 2026-07-07 | `main_notic` 섹션 마크업 태깅, where(`bannerPosition/isVisible/postDate_from,to`)·orderBy(`updatedAt DESC`)·row limit(단건) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-07 | 작업 단위 문서 최초 작성 (상태: 설계중) |
| STEP4 | fo-be-analyzer | 2026-07-07 | `PageDataService.search()` 재사용 가능 판단, `FoPageDataController` 신규 필요로 설계, 하이픈 필드 이슈 발견(이후 `bannerPosition` camelCase로 확인되어 해소) |
| (승인) | 사용자 | 2026-07-07 | `page_data.data_slug='banner-data'` 존재 확인, 문서 승인 |
| STEP5 | fo-be-builder | 2026-07-07 | `FoPageDataController` 신규 구현, 실서버 호출로 실제 필드명 오류(`infomation`→`INFORMATION`, `isVisable`→`isVisible`, `bannerForm` 중첩 구조) 발견·정정 |
| STEP6 | fo-fe-builder | 2026-07-08 | `fetchApi` 연동 + `data-slug`/`data-slugKey` 바인딩 구현, prefix 공통코드 매핑은 보류(TODO), 0건 시 레이아웃 유지 처리, `tsc --noEmit` 통과 |
| 검증 | fo-qa-validator | 2026-07-08 | 체크리스트 8/8 통과. **단, 이 세션에 Playwright MCP 미연결로 실제 브라우저 대신 SSR HTML curl 대조로 검증** — 실브라우저 재검증 필요 |
