# GE-FO Data Binding 매핑표

> `fo/` 내 모든 tsx 파일(App Router 페이지 + 컴포넌트)과, 향후 BO `SlugRegistry`(위젯 빌더 연동용 slug 사전등록 — `bo-api/.../entity/SlugRegistry.java`)에서 발급될 `data slug` 값을 매핑하기 위한 표입니다.
> `설명`은 각 파일을 실제로 읽고 코드 내용(렌더링 구조·데이터·로직)에 근거해 작성했습니다.
> `data slug` 컬럼은 전부 **TODO**로 비워둔 상태이며, BO에서 slug가 등록되는 대로 채워 넣습니다.

---

## 1. app/ — 라우트 페이지

### 1-1. 루트

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Root 레이아웃 | `src/app/layout.tsx` | 루트 레이아웃 — 전역 CSS(reset/fonts/globals/product-award-badge)와 SEO 메타데이터(title/OpenGraph/Twitter 카드), LenisScrollProvider·히스토리 리로드·스크롤 유틸(ScrollToTopOnNavigate, ScrollToTopButton) 등 전역 공통 유틸을 마운트하는 최상위 레이아웃 | TODO |
| Root 페이지 | `src/app/page.tsx` | 사이트 루트 홈 화면으로, 전체 페이지 목록을 보여주는 PageIndexTable 컴포넌트만 렌더링하는 인덱스(개발용 페이지 목록) 페이지 | TODO |
| Route Group 레이아웃 | `src/app/(company,markets,products-systems,search,services,support)/layout.tsx` | MarketsGroupHeader(경로/디바이스에 따라 메인 Header 또는 서브헤더로 분기)와 SubFooter로 children을 감싸는, company/markets/products-systems/search/services/support 공통 route group 레이아웃 | TODO |

### 1-2. main (홈)

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Main 레이아웃 | `src/app/main/layout.tsx` | 메인 섹션 공통 레이아웃 — Header와 Footer로 children(페이지 콘텐츠)을 감싸는 레이아웃 컴포넌트 | TODO |
| Main 페이지 | `src/app/main/page.tsx` | 메인 홈페이지 — MainVisual, MainInfo, WhatWeDoSwiper, HighlightNewsSection, MainCards, MainProducts, 배너, IconCards 등 홈 섹션들을 순서대로 조립하는 페이지 | TODO |
| Icon Cards | `src/app/main/components/IconCards.tsx` | `@/components/main/icon-cards`를 재노출하는 배럴 파일 — 실제로는 Connect Portal/Tech Hub/Download Center/Training 4개 아이콘 카드를 렌더링하는 "Explore More" 섹션 컴포넌트 | TODO |
| Main Cards | `src/app/main/components/MainCards.tsx` | `@/components/main/main-cards`를 재노출하는 배럴 파일 — 실제로는 데이터센터/전력망/오일가스광업/공공인프라/산업/상업주거 등 산업분야 카드를 IntersectionObserver 기반 순차 페이드인 애니메이션과 함께 보여주는 "Industries We Serve" 섹션 컴포넌트 | TODO |
| Main Info | `src/app/main/components/MainInfo.tsx` | `@/components/main/main-info`를 재노출하는 배럴 파일 — 실제로는 스크롤 진입 시 50+ Years/107 Nations/50 States 통계 숫자를 카운트업 애니메이션으로 보여주는 회사 소개 섹션 컴포넌트 | TODO |
| Main Products | `src/app/main/components/MainProducts.tsx` | `@/components/main/main-products`를 재노출하는 배럴 파일 — 실제로는 New Arrivals/Best Sellers 탭 전환과 Swiper 슬라이더로 제품 목록(4개씩 노출)을 보여주는 "Discover Our Products" 섹션 컴포넌트 | TODO |
| Main Visual | `src/app/main/components/MainVisual.tsx` | `@/components/main/main-visual`을 재노출하는 배럴 파일 — 실제로는 VideoSwiper와 BannerSwiper로 구성된 메인 비주얼 영역과 전시회 공지("Exhibition") 링크 섹션을 렌더링하는 컴포넌트 | TODO |
| What We Do Swiper | `src/app/main/components/WhatWeDoSwiper.tsx` | `@/components/main/what-we-do-swiper`를 재노출하는 배럴 파일 — 실제로는 LV&MV Power Solutions/Grid&Utility Infrastructure/Automation&Industrial Control 3개 슬라이드를 fade 효과 오토플레이 Swiper로 보여주는 "What we do" 섹션 컴포넌트 | TODO |

### 1-3. company

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Company Affiliate In America 페이지 | `src/app/(company)/affiliate-in-america/page.tsx` | 미국 제휴사 소개 라우트 페이지로 CompanyAffiliateAmericaPage 컴포넌트를 렌더링 | TODO |
| Company Articles Detail 페이지 | `src/app/(company)/articles/detail/page.tsx` | 미디어(Articles) 상세 페이지로 CompanyArticleDetail에 특정 기사 제목·날짜·유튜브 영상·본문 섹션·풀쿼트 데이터를 채워 렌더링 | TODO |
| Company Articles 페이지 | `src/app/(company)/articles/page.tsx` | Articles 목록 라우트 페이지로 CompanyArticlesPage 컴포넌트를 렌더링 | TODO |
| Company Blog Detail 페이지 | `src/app/(company)/blog/detail/page.tsx` | 블로그 상세 페이지로 CompanyArticleDetail에 카테고리·제목·날짜·히어로 이미지·본문 단락·불릿·태그 등 블로그 콘텐츠 데이터를 채워 렌더링 | TODO |
| Company Blog No Data 페이지 | `src/app/(company)/blog/no-data/page.tsx` | 블로그 목록이 비어있는 상태(empty)를 보여주기 위해 CompanyBlogPage를 empty prop과 함께 렌더링하는 페이지 | TODO |
| Company Blog 페이지 | `src/app/(company)/blog/page.tsx` | 블로그 목록 라우트 페이지로 CompanyBlogPage 컴포넌트를 렌더링 | TODO |
| Company Careers 페이지 | `src/app/(company)/careers/page.tsx` | 채용(Careers) 라우트 페이지로 CompanyCareersPage 컴포넌트를 렌더링 | TODO |
| Company About Intro Section | `src/app/(company)/components/CompanyAboutIntroSection.tsx` | 히어로 이미지·헤드라인·본문 단락과 선택적 CTA 링크/통계 슬롯(children)을 갖는 회사소개 인트로 섹션 공통 컴포넌트로, props로 이미지 위치·헤드라인 폭·패딩 등 변형 스타일을 제어 | TODO |
| Company About Section Head | `src/app/(company)/components/CompanyAboutSectionHead.tsx` | 섹션 제목(title)과 선택적 설명(description)을 표시하는 공통 섹션 헤더 컴포넌트 | TODO |
| Company About Title Section | `src/app/(company)/components/CompanyAboutTitleSection.tsx` | 페이지 상단에 제목(h1)과 설명 문구를 보여주는 회사소개 계열 타이틀 섹션 컴포넌트 | TODO |
| Company Affiliate America Page | `src/app/(company)/components/CompanyAffiliateAmericaPage.tsx` | 미국 제휴사 페이지 본문으로, 타이틀·인트로 섹션과 제휴사 리스트(로고·설립연도·웹사이트·사업분야·주소)를 렌더링하며 previewSection prop으로 특정 섹션만 미리보기 가능 | TODO |
| Company America Intro Stats | `src/app/(company)/components/CompanyAmericaIntroStats.tsx` | IntersectionObserver로 뷰포트 진입을 감지해 숫자를 애니메이션(카운트업)으로 증가시키며 보여주는 America 인트로 통계 항목 리스트 컴포넌트 | TODO |
| Company America Page | `src/app/(company)/components/CompanyAmericaPage.tsx` | America(미국법인) 소개 페이지 전체를 구성하는 컴포넌트로 타이틀·인트로·Shaping·Business·채용배너·거점운영(지도/연락처)·리더십·미션·팔로우 섹션을 조립하며 previewSection prop으로 개별 섹션만 렌더링 가능 | TODO |
| Company Article Detail | `src/app/(company)/components/CompanyArticleDetail.tsx` | blog/press/events/media 4가지 variant를 지원하는 공통 아티클 상세 템플릿으로 헤더(카테고리·제목·날짜 또는 행사meta)·히어로 이미지/영상·본문(children)·이전/다음 글 페이저·목록 버튼을 렌더링 | TODO |
| Company Articles Featured | `src/app/(company)/components/CompanyArticlesFeatured.tsx` | 제목·설명·날짜·이미지·링크를 받아 아티클 목록 상단의 대표(피처드) 카드 하나를 보여주는 컴포넌트 | TODO |
| Company Articles List Grid | `src/app/(company)/components/CompanyArticlesListGrid.tsx` | 아티클 아이템 배열을 받아 이미지·제목·날짜가 담긴 카드 그리드 목록을 렌더링하는 컴포넌트 | TODO |
| Company Articles List Section | `src/app/(company)/components/CompanyArticlesListSection.tsx` | Articles 목록 섹션 컴포넌트로 툴바, 카드 그리드(CompanyArticlesListGrid), 페이지네이션(PageNumbering)을 감싸 렌더링 | TODO |
| Company Articles List Toolbar | `src/app/(company)/components/CompanyArticlesListToolbar.tsx` | Articles 목록 상단에 표시되는 월/연도 필터 셀렉트, 검색 입력, 정렬(Latest/Oldest) 셀렉트로 구성된 툴바 컴포넌트 | TODO |
| Company Articles Page | `src/app/(company)/components/CompanyArticlesPage.tsx` | Articles 페이지 전체를 구성하는 메인 컴포넌트로 타이틀, 피처드 아티클, 목록 섹션을 순서대로 렌더링 | TODO |
| Company Articles Title | `src/app/(company)/components/CompanyArticlesTitle.tsx` | Articles 페이지 상단 타이틀 영역(heading, description)을 렌더링하는 단순 섹션 컴포넌트 | TODO |
| Company Blog Empty | `src/app/(company)/components/CompanyBlogEmpty.tsx` | 블로그 목록 검색 결과가 없을 때 표시되는 빈 상태(empty state) UI로 아이콘, 안내 문구, "View All" 링크 버튼을 렌더링 | TODO |
| Company Blog List Toolbar | `src/app/(company)/components/CompanyBlogListToolbar.tsx` | 블로그 목록 상단에 표시되는 카테고리 필터 셀렉트, 검색 입력, 정렬(Latest/Oldest) 셀렉트로 구성된 툴바 컴포넌트 | TODO |
| Company Blog Page | `src/app/(company)/components/CompanyBlogPage.tsx` | Blog 페이지 전체를 구성하는 메인 컴포넌트로 타이틀, 히어로 피처드 카드, 목록(툴바+아이템 리스트+페이지네이션, empty 상태 분기 포함)을 렌더링 | TODO |
| Company Careers Page | `src/app/(company)/components/CompanyCareersPage.tsx` | Careers 페이지 컴포넌트로 타이틀/LinkedIn CTA, 채용 직무 카드 그리드, LinkedIn 배너 섹션을 렌더링하며 previewSection prop으로 개별 섹션만 미리보기 가능 | TODO |
| Company Esg Page | `src/app/(company)/components/CompanyEsgPage.tsx` | ESG 페이지 컴포넌트로 타이틀, 인트로, 비전(Mission/Vision/ESG 방향성 카드), 기후 로드맵, 정책 다운로드 카드 섹션을 렌더링하며 previewSection prop으로 개별 섹션 미리보기 가능 | TODO |
| Company Events Calendar | `src/app/(company)/components/CompanyEventsCalendar.tsx` | Events 페이지의 캘린더 섹션으로 월별로 그룹화된 이벤트 목록(제목, 장소, 일정)을 렌더링하는 컴포넌트 | TODO |
| Company Events Featured | `src/app/(company)/components/CompanyEventsFeatured.tsx` | Events 페이지의 피처드 이벤트 슬라이더로 Swiper를 사용해 데스크톱/모바일 반응형(가로/세로 슬라이드)으로 이벤트 카드를 노출하고 페이지네이션 컨트롤을 제공 | TODO |
| Company Events Page | `src/app/(company)/components/CompanyEventsPage.tsx` | Events 페이지 전체를 구성하는 메인 컴포넌트로 타이틀, 피처드 슬라이더, 캘린더, 지난 이벤트 섹션을 순서대로 렌더링 | TODO |
| Company Events Past Section | `src/app/(company)/components/CompanyEventsPastSection.tsx` | Events 페이지의 지난 이벤트(Past Events) 섹션으로 정렬 셀렉트 툴바, 이벤트 카드 그리드, 페이지네이션을 렌더링 | TODO |
| Company Follow Section | `src/app/(company)/components/CompanyFollowSection.tsx` | 소셜 미디어 팔로우 링크 목록(아이콘+라벨)을 렌더링하는 섹션 컴포넌트 | TODO |
| Company Ls Electric Count Up Stats | `src/app/(company)/components/CompanyLsElectricCountUpStats.tsx` | LS ELECTRIC 소개 페이지의 통계 수치를 스크롤 진입 시 카운트업 애니메이션으로 표시하는 하이라이트 통계/글로벌 통계 컴포넌트 2종을 export | TODO |
| Company Ls Electric Page | `src/app/(company)/components/CompanyLsElectricPage.tsx` | LS ELECTRIC 소개 페이지 전체를 구성하는 메인 컴포넌트로 타이틀, 인트로, 하이라이트 통계, 사업영역, 글로벌 현황, PTT, R&D, 연혁, 미션 섹션을 렌더링하며 previewSection prop으로 개별 섹션 미리보기 가능 | TODO |
| Company Mission Section | `src/app/(company)/components/CompanyMissionSection.tsx` | companyMissionContent 데이터를 기반으로 회사 철학(Philosophy), 미션(Mission), 코어밸류(Core Value) 이미지·텍스트를 순서대로 배치하는 회사소개 미션 섹션 컴포넌트 | TODO |
| Company Press Empty | `src/app/(company)/components/CompanyPressEmpty.tsx` | 보도자료 목록에 검색 결과가 없을 때 안내 아이콘과 문구, "View All" 링크 버튼을 보여주는 빈 상태(Empty State) 컴포넌트 | TODO |
| Company Press Featured | `src/app/(company)/components/CompanyPressFeatured.tsx` | title/description/date/image/href props를 받아 보도자료 최상단에 대표(Featured) 기사 카드를 링크 형태로 렌더링하는 컴포넌트 | TODO |
| Company Press List Grid | `src/app/(company)/components/CompanyPressListGrid.tsx` | PressListItem 배열을 받아 각 항목을 이미지·제목·날짜가 있는 카드 링크(li)로 그리드 형태로 나열하는 보도자료 리스트 그리드 컴포넌트 | TODO |
| Company Press List Section | `src/app/(company)/components/CompanyPressListSection.tsx` | 보도자료 목록 섹션 전체를 감싸며 툴바(CompanyPressListToolbar)와 empty 여부에 따라 빈 상태(CompanyPressEmpty) 또는 목록 그리드+페이지네이션(CompanyPressListGrid, PageNumbering)을 조건부 렌더링하는 클라이언트 컴포넌트 | TODO |
| Company Press List Toolbar | `src/app/(company)/components/CompanyPressListToolbar.tsx` | 월/연도/정렬(Latest·Oldest) 선택 드롭다운과 검색 입력창(MUI GuideSelect/TextField 기반)으로 구성된 보도자료 목록 필터 툴바 클라이언트 컴포넌트 | TODO |
| Company Press Page | `src/app/(company)/components/CompanyPressPage.tsx` | CompanyPressTitle, CompanyPressFeatured, CompanyPressListSection을 조합해 보도자료(Press) 페이지 전체를 구성하며 empty/pageId props로 데이터 없음 화면도 지원하는 클라이언트 컴포넌트 | TODO |
| Company Press Title | `src/app/(company)/components/CompanyPressTitle.tsx` | heading/description props(기본값 "Press")를 받아 보도자료 페이지 상단 타이틀과 설명 문구를 렌더링하는 타이틀 섹션 컴포넌트 | TODO |
| Company Esg 페이지 | `src/app/(company)/esg/page.tsx` | CompanyEsgPage 컴포넌트를 그대로 렌더링하는 ESG 소개 라우트 페이지 | TODO |
| Company Events Detail 페이지 | `src/app/(company)/events/detail/page.tsx` | CompanyArticleDetail을 variant="events"로 사용해 "ELECS KOREA 2026" 이벤트 상세 내용(불릿 리스트, 히어로 이미지, 이전/다음 페이저)을 렌더링하는 이벤트 상세 라우트 페이지 | TODO |
| Company Events 페이지 | `src/app/(company)/events/page.tsx` | CompanyEventsPage 컴포넌트를 그대로 렌더링하는 이벤트 목록 라우트 페이지 | TODO |
| Company Ls Electric 페이지 | `src/app/(company)/ls-electric/page.tsx` | CompanyLsElectricPage 컴포넌트를 렌더링하는 LS ELECTRIC 회사소개 라우트 페이지 | TODO |
| Company Ls Electric America 페이지 | `src/app/(company)/ls-electric-america/page.tsx` | CompanyAmericaPage 컴포넌트를 렌더링하는 LS ELECTRIC America 회사소개 라우트 페이지 | TODO |
| Company Press Detail 페이지 | `src/app/(company)/press/detail/page.tsx` | CompanyArticleDetail을 variant="press"로 사용해 특정 보도자료(HVDC 관련 기사) 제목, 날짜, 유튜브 영상(DevicesProductVideoPlayer), 본문 불릿·문단, 이전/다음 페이저를 렌더링하는 보도자료 상세 라우트 페이지 | TODO |
| Company Press No Data 페이지 | `src/app/(company)/press/no-data/page.tsx` | CompanyPressPage를 empty=true, pageId="Page_company_press_no_data"로 호출해 보도자료 데이터 없음(빈 상태) 화면을 보여주는 라우트 페이지 | TODO |
| Company Press 페이지 | `src/app/(company)/press/page.tsx` | CompanyPressPage를 기본값으로 렌더링하는 보도자료 목록 라우트 페이지 | TODO |

### 1-4. markets

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Markets Commercial Residential 페이지 | `src/app/(markets)/commercial-residential/page.tsx` | Commercial & Residential 시장 페이지로 Hero·Intro·Stats·Explore·References·Benefits·SolutionsPanel·Why·Products·배너·하이라이트뉴스·FAQ 섹션을 조합한 마켓 상세 페이지 | TODO |
| Markets Benefits | `src/app/(markets)/components/MarketsBenefits.tsx` | 이미지와 타이틀·설명·Capabilities 텍스트를 좌우 교차 레이아웃으로 나열하는 "Engineered Benefits" 섹션 컴포넌트 | TODO |
| Markets Explore | `src/app/(markets)/components/MarketsExplore.tsx` | 탭 클릭으로 산업별(Industry) 콘텐츠를 전환해 보여주는 "Explore Industries" 탭 UI 클라이언트 컴포넌트 | TODO |
| Markets Faq | `src/app/(markets)/components/MarketsFaq.tsx` | 공통 FAQ 컴포넌트(CommonFaq)에 마켓 전용 설명 문구와 FAQ 항목을 넘겨 렌더링하는 래퍼 컴포넌트 | TODO |
| Markets Hero | `src/app/(markets)/components/MarketsHero.tsx` | 서브타이틀·타이틀·히어로 이미지·CTA 버튼을 표시하는 마켓 페이지 상단 히어로 섹션(기본형/key-visual형 지원) | TODO |
| Markets Hero Scroll Down | `src/app/(markets)/components/MarketsHeroScrollDown.tsx` | 클릭 시 Lenis 스크롤로 히어로 다음 섹션까지 부드럽게 스냅 이동시키는 스크롤 다운 버튼 | TODO |
| Markets Intro | `src/app/(markets)/components/MarketsIntro.tsx` | 타이틀 라인과 본문(단일 텍스트 또는 여러 단락)을 표시하는 마켓 페이지 인트로 섹션 | TODO |
| Markets Products | `src/app/(markets)/components/MarketsProducts.tsx` | 관련 제품 목록을 그리드로 보여주고 수상 배지를 표시하는 "Relavant Products" 섹션 컴포넌트 | TODO |
| Markets References | `src/app/(markets)/components/MarketsReferences.tsx` | 레퍼런스 카드 목록을 표시하고 클릭 시 MarketsReferencesModal을 여는 "References" 섹션 클라이언트 컴포넌트 | TODO |
| Markets References Modal | `src/app/(markets)/components/MarketsReferencesModal.tsx` | 이미지 스와이퍼 갤러리·프로젝트 개요·주요 정보 테이블을 보여주는 레퍼런스 상세 모달(단일/다중 레퍼런스 탭, portal/embedded 지원) | TODO |
| Markets References Modal Page Client | `src/app/(markets)/components/MarketsReferencesModalPageClient.tsx` | 여러 레퍼런스 모달 변형(variant)을 버튼으로 선택해 MarketsReferencesModal을 미리보기로 여는 클라이언트 허브 페이지 컴포넌트 | TODO |
| Markets References Modal Preview | `src/app/(markets)/components/MarketsReferencesModalPreview.tsx` | 가이드용으로 특정 레퍼런스 데이터를 embedded 모드로 항상 열어 보여주는 MarketsReferencesModal 미리보기 컴포넌트 | TODO |
| Markets Smart Grid | `src/app/(markets)/components/MarketsSmartGrid.tsx` | BESS/마이크로그리드 유즈케이스 카드와 운영 특징 카드, 다이어그램을 표시하는 "Smart Grid & Energy Storage Solutions" 섹션 | TODO |
| Markets Smart Grid Diagram | `src/app/(markets)/components/MarketsSmartGridDiagram.tsx` | 마이크로그리드 시스템 구성도 이미지를 단순히 렌더링하는 다이어그램 컴포넌트 | TODO |
| Markets Solutions | `src/app/(markets)/components/MarketsSolutions.tsx` | 데이터센터 맵 이미지 위 핫스팟(존)을 클릭하면 우측/모바일 아코디언에 해당 존의 솔루션 제품 정보를 보여주는 인터랙티브 맵 섹션 | TODO |
| Markets Solutions Panel | `src/app/(markets)/components/MarketsSolutionsPanel.tsx` | 타이틀·설명·핵심역량 리스트를 담은 솔루션 블록들과 다이어그램 이미지를 그룹 단위로 렌더링하는 범용 솔루션 패널 섹션 | TODO |
| Markets Stats | `src/app/(markets)/components/MarketsStats.tsx` | 스크롤 인뷰 시 숫자가 카운트업 애니메이션되는 통계 지표(label/value/description) 그리드 섹션 | TODO |
| Markets Sustainability | `src/app/(markets)/components/MarketsSustainability.tsx` | 이미지·타이틀·불릿 리스트로 구성된 카드들을 보여주는 "지속가능한 에너지 미래" 섹션(카드 없으면 렌더링 안 함) | TODO |
| Markets Why | `src/app/(markets)/components/MarketsWhy.tsx` | 배경 이미지 위에 아이콘·타이틀·설명 아이템들을 나열하는 "Why LS ELECTRIC?" 섹션 | TODO |
| Markets Data Center 페이지 | `src/app/(markets)/data-center/page.tsx` | Data Center 시장 페이지로 Hero·Intro·Stats·References·Benefits·Solutions(맵)·Why·Products·배너·하이라이트뉴스·FAQ를 조합한 마켓 상세 페이지 | TODO |
| Markets Industrial 페이지 | `src/app/(markets)/industrial/page.tsx` | Industrial 시장 페이지로 Hero·Intro·Stats·Explore·References·Benefits·SolutionsPanel·Why·Products·배너·하이라이트뉴스·FAQ를 조합한 마켓 상세 페이지 | TODO |
| Markets Oil Gas Mining 페이지 | `src/app/(markets)/oil-gas-mining/page.tsx` | Oil, Gas & Mining 시장 페이지로 Hero·Intro·Explore·References·Benefits·SolutionsPanel·Why·Products·배너·하이라이트뉴스·FAQ를 조합한 마켓 상세 페이지 | TODO |
| Markets 페이지 | `src/app/(markets)/page.tsx` | 마켓 루트 진입 시 "/markets/commercial-residential"로 리다이렉트하는 인덱스 페이지 | TODO |
| Markets Power Grid 페이지 | `src/app/(markets)/power-grid/page.tsx` | Power Grid 시장 페이지로 Hero·Intro·Explore(wide-tabs)·References·Benefits·Sustainability·SmartGrid·Why·Products·배너·하이라이트뉴스·FAQ를 조합한 마켓 상세 페이지 | TODO |
| Markets Public Infrastructure 페이지 | `src/app/(markets)/public-infrastructure/page.tsx` | Public Infrastructure 시장 페이지로 Hero·Intro·Explore·References·Benefits·SolutionsPanel·Why·Products·배너·하이라이트뉴스·FAQ를 조합한 마켓 상세 페이지 | TODO |
| Markets References Modal 페이지 | `src/app/(markets)/references-modal/page.tsx` | MarketsReferencesModalPageClient를 Suspense로 감싸 렌더링하는 레퍼런스 모달 가이드/미리보기 페이지 | TODO |

### 1-5. products-systems

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Devices Category List | `src/app/(products-systems)/components/DevicesCategoryList.tsx` | 카테고리 소개(intro)와 제품 목록을 받아 split(좌측 인트로+우측 리스트) 또는 stacked(상단 인트로+2열 그리드) 레이아웃으로 렌더링하는 제품 카테고리 리스트 컴포넌트 | TODO |
| Devices Explore All | `src/app/(products-systems)/components/DevicesExploreAll.tsx` | Explore All 페이지에서 전체 제품을 알파벳(A-Z) 그룹으로 묶어 3열씩 표시하고 discontinued 제품 표시 토글 상태를 관리하는 클라이언트 컴포넌트 | TODO |
| Devices Explore All Toolbar | `src/app/(products-systems)/components/DevicesExploreAllToolbar.tsx` | Explore All 목록 상단의 Lv1/Lv2 카테고리 셀렉트 박스와 discontinued 제품 표시 여부를 켜고 끄는 토글 스위치를 제공하는 툴바 컴포넌트 | TODO |
| Devices Help | `src/app/(products-systems)/components/DevicesHelp.tsx` | "Everything You Need to Power Your Success" 섹션으로 문의/설정/파트너 찾기 등 도움말 카드를 default 또는 overlay 스타일로 보여주는 컴포넌트 | TODO |
| Devices Hero | `src/app/(products-systems)/components/DevicesHero.tsx` | Motor Control 계열 페이지 상단 히어로 섹션으로 타이틀/설명/CTA 버튼을 보여주고 옵션에 따라 하위에 DevicesProducts 그리드를 임베드하는 컴포넌트 | TODO |
| Devices Markets | `src/app/(products-systems)/components/DevicesMarkets.tsx` | Motor Control 관련 Markets 데이터를 이미지 카드 그리드로 나열하는 마켓 소개 섹션 컴포넌트 | TODO |
| Devices Products | `src/app/(products-systems)/components/DevicesProducts.tsx` | LV Motor Control 제품 목록을 카드 그리드로 보여주며 수상 배지 표시 여부를 제어하고 standalone/embedded 두 방식으로 사용 가능한 제품 리스트 컴포넌트 | TODO |
| Devices Hvdc Hero | `src/app/(products-systems)/components/product/DevicesHvdcHero.tsx` | HVDC 제품 상세 페이지 최상단 히어로 섹션(태그라인/타이틀/설명/Contact Us 버튼)을 렌더링하는 컴포넌트 | TODO |
| Devices Hvdc Overview | `src/app/(products-systems)/components/product/DevicesHvdcOverview.tsx` | HVDC 제품의 개요(Overview) 섹션으로 배경 이미지와 멀티라인 타이틀/설명 텍스트를 렌더링하는 컴포넌트 | TODO |
| Devices Micro Grid Hero | `src/app/(products-systems)/components/product/DevicesMicroGridHero.tsx` | Micro Grid 제품 상세 페이지 히어로 섹션(타이틀/멀티라인 설명/Contact Us 버튼)을 렌더링하는 컴포넌트 | TODO |
| Devices Micro Grid Highlights | `src/app/(products-systems)/components/product/DevicesMicroGridHighlights.tsx` | Micro Grid 제품의 "Why" 하이라이트 섹션으로 항목 리스트와 다이어그램 이미지를 나란히 배치하는 컴포넌트 | TODO |
| Devices Micro Grid Overview | `src/app/(products-systems)/components/product/DevicesMicroGridOverview.tsx` | Micro Grid 제품의 개요(Overview) 섹션으로 배경 이미지와 멀티라인 타이틀/설명을 렌더링하는 컴포넌트 | TODO |
| Devices Product Applications | `src/app/(products-systems)/components/product/DevicesProductApplications.tsx` | 제품 상세 페이지의 Applications(활용 분야) 섹션으로 이미지·타이틀·부제·멀티라인 설명 카드 그리드를 렌더링하는 재사용 컴포넌트 | TODO |
| Devices Product Downloads | `src/app/(products-systems)/components/product/DevicesProductDownloads.tsx` | 제품 다운로드 센터 섹션으로 문서 타입 필터, 검색/정렬, 파일 리스트(Copy Link/Download), 페이지네이션을 제공하는 클라이언트 컴포넌트(더미 데이터 반복으로 페이지 채움) | TODO |
| Devices Product Downloads Check Label | `src/app/(products-systems)/components/product/DevicesProductDownloadsCheckLabel.tsx` | 다운로드 필터 체크박스 옆에 라벨 텍스트와 개수(count)를 함께 표시하는 작은 프레젠테이셔널 컴포넌트 | TODO |
| Devices Product Downloads Filter | `src/app/(products-systems)/components/product/DevicesProductDownloadsFilter.tsx` | 다운로드 섹션 좌측 필터 영역을 감싸는 aside 레이아웃 래퍼 컴포넌트 | TODO |
| Devices Product Downloads Filter Parts | `src/app/(products-systems)/components/product/DevicesProductDownloadsFilterParts.tsx` | 다운로드 필터의 체크박스 행, 중첩 카테고리 확장/축소 행, 리셋 버튼이 있는 필터 섹션 등을 제공하는 하위 컴포넌트 모음(클라이언트) | TODO |
| Devices Product Hero | `src/app/(products-systems)/components/product/DevicesProductHero.tsx` | MCCB류 제품 상세 페이지의 히어로 섹션으로 제품 이미지, 시리즈명, 설명, 스펙 목록, Contact Us/Downloads 스크롤 버튼을 렌더링하는 컴포넌트 | TODO |
| Devices Product Lineup | `src/app/(products-systems)/components/product/DevicesProductLineup.tsx` | 제품 라인업 비교 표를 MCCB 타입(type1: Rated Current/Interrupting/Standard)과 VFD Frame 타입(type2)으로 나누어 렌더링하고 Configurator 링크를 제공하는 컴포넌트 | TODO |
| Devices Product Nav | `src/app/(products-systems)/components/product/DevicesProductNav.tsx` | 제품 상세 페이지의 섹션 이동용 사이드 내비게이션으로 Lenis 스크롤과 IntersectionObserver를 이용해 현재 활성 섹션을 추적하고 클릭 시 부드럽게 스크롤 이동시키는 클라이언트 컴포넌트 | TODO |
| Devices Product Nav Scope | `src/app/(products-systems)/components/product/DevicesProductNavScope.tsx` | 특정 섹션 구간에서만 DevicesProductNav가 sticky로 동작하도록 감싸는 스코프 래퍼 컴포넌트 | TODO |
| Devices Product Other Products | `src/app/(products-systems)/components/product/DevicesProductOtherProducts.tsx` | "Other Products" 섹션으로 Swiper를 이용해 관련 제품 카드를 데스크톱/모바일 반응형 슬라이더로 보여주고 페이지네이션·이전/다음 컨트롤을 제공하는 클라이언트 컴포넌트 | TODO |
| Devices Product Video | `src/app/(products-systems)/components/product/DevicesProductVideo.tsx` | 제품 상세 페이지의 Video 섹션으로 유튜브 비디오 ID를 받아 DevicesProductVideoPlayer를 렌더링하는 래퍼 컴포넌트 | TODO |
| Devices Product Why | `src/app/(products-systems)/components/product/DevicesProductWhy.tsx` | HVDC 등 제품의 "Why" 섹션으로 블록별 타이틀/리드 텍스트와 이미지 카드들을 split 또는 일반 레이아웃으로 렌더링하는 컴포넌트 | TODO |
| Devices Smart Factory Hero | `src/app/(products-systems)/components/product/DevicesSmartFactoryHero.tsx` | Smart Factory 제품 상세 페이지 히어로 섹션(타이틀/설명/Contact Us 버튼)을 렌더링하는 컴포넌트 | TODO |
| Devices Smart Factory Overview | `src/app/(products-systems)/components/product/DevicesSmartFactoryOverview.tsx` | Smart Factory 제품의 개요(Overview) 섹션으로 배경 이미지와 멀티라인 타이틀/설명을 렌더링하는 컴포넌트 | TODO |
| Devices Software Highlights | `src/app/(products-systems)/components/product/DevicesSoftwareHighlights.tsx` | 소프트웨어 계열 제품(Smart Factory, XEMS 등)의 "Why" 섹션을 이미지 전용 카드로만 구성해 렌더링하는 컴포넌트(DevicesProductWhy의 이미지-only 변형) | TODO |
| Devices Xems Energy Solutions | `src/app/(products-systems)/components/product/DevicesXemsEnergySolutions.tsx` | XEMS 제품의 에너지 솔루션 섹션으로 이미지·타이틀·부제·설명 카드 그리드와 다이어그램 이미지를 렌더링하는 컴포넌트 | TODO |
| Devices Xems Hero | `src/app/(products-systems)/components/product/DevicesXemsHero.tsx` | XEMS 제품 상세 페이지 히어로 섹션(타이틀/설명/Contact Us 버튼)을 렌더링하는 컴포넌트 | TODO |
| Devices Xems Overview | `src/app/(products-systems)/components/product/DevicesXemsOverview.tsx` | XEMS 제품의 개요(Overview) 섹션으로 배경 이미지와 멀티라인 타이틀/설명을 렌더링하는 컴포넌트 | TODO |
| Product Section Scroll Link | `src/app/(products-systems)/components/product/ProductSectionScrollLink.tsx` | 클릭 시 해당 앵커 섹션으로 부드럽게 스크롤 이동시키는 링크 컴포넌트(scrollToProductSection 유틸 사용, 클라이언트) | TODO |
| Products Systems Explore All 페이지 | `src/app/(products-systems)/explore-all/page.tsx` | "Explore All Products" 페이지로 헤더 텍스트와 DevicesExploreAll 컴포넌트, CommonBanner04를 렌더링하는 페이지 | TODO |
| Products Systems Lv Automation 페이지 | `src/app/(products-systems)/lv-automation/page.tsx` | LV Automation 카테고리 페이지로 DevicesCategoryList(stacked), DevicesMarkets, DevicesHelp(overlay), 배너, Highlights 뉴스 섹션을 조합한 페이지 | TODO |
| Products Systems Motor Control H100 Plus 페이지 | `src/app/(products-systems)/motor-control/h100_plus/page.tsx` | H100 Plus 제품 상세 페이지로 히어로, Key Features, Configurator 배너, 라인업 표, 다운로드, 비디오, Other Products, Markets, Help, Highlights, FAQ 섹션을 조합한 페이지 | TODO |
| Products Systems Motor Control Metasol Ms 페이지 | `src/app/(products-systems)/motor-control/metasol-ms/page.tsx` | Metasol MS 제품 상세 페이지로 히어로, Key Features, Configurator 배너, 라인업 표, 다운로드, 비디오, Other Products, Markets, Help, Highlights, FAQ 섹션을 조합한 페이지 | TODO |
| Products Systems Motor Control 페이지 | `src/app/(products-systems)/motor-control/page.tsx` | Motor Control 카테고리 메인 페이지로 제품 그리드가 포함된 히어로, Markets, Help(overlay), 배너, Highlights 뉴스 섹션을 조합한 페이지 | TODO |
| Products Systems Motor Control Susol Ul Smart Mccb 페이지 | `src/app/(products-systems)/motor-control/susol-ul-smart-mccb/page.tsx` | Susol UL Smart MCCB 제품 상세 페이지로 히어로, Key Features, Configurator 배너, 라인업 표, 다운로드, Other Products, Markets, Help, Highlights, FAQ 섹션을 조합한 페이지(비디오 섹션 없음) | TODO |
| Products Systems Software Micro Grid 페이지 | `src/app/(products-systems)/software/micro-grid/page.tsx` | Micro Grid 소프트웨어 제품 상세 페이지로 히어로, Overview, Benefits, Applications, Highlights, 다운로드, Other Products, Markets, Help, FAQ 섹션을 조합한 페이지 | TODO |
| Products Systems Software 페이지 | `src/app/(products-systems)/software/page.tsx` | /products-systems/software 접근 시 /products-systems/software/scada로 즉시 리다이렉트하는 페이지 | TODO |
| Products Systems Software Scada 페이지 | `src/app/(products-systems)/software/scada/page.tsx` | SCADA(HVDC 데이터 기반) 제품 상세 페이지로 히어로, Overview, Benefits, Applications, Why 섹션, 다운로드, Other Products, Markets, Help, FAQ를 조합한 페이지 | TODO |
| Products Systems Software Smart Factory 페이지 | `src/app/(products-systems)/software/smart-factory/page.tsx` | Smart Factory 소프트웨어 제품 상세 페이지로 히어로, Overview, Benefits, Applications, Software Highlights, 다운로드, Other Products, Markets, Help, FAQ 섹션을 조합한 페이지 | TODO |
| Products Systems Software Xems 페이지 | `src/app/(products-systems)/software/xems/page.tsx` | XEMS 소프트웨어 제품 상세 페이지로 히어로, Overview, Benefits, Energy Solutions, Software Highlights, 다운로드, Other Products, Markets, Help, FAQ 섹션을 조합한 페이지 | TODO |
| Products Systems Variable Frequency Drive 페이지 | `src/app/(products-systems)/variable-frequency-drive/page.tsx` | VFD(Variable Frequency Drive) 카테고리 페이지로 DevicesCategoryList(split 레이아웃), DevicesHelp, 배너, Highlights 뉴스 섹션을 조합한 페이지 | TODO |

### 1-6. search

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Search All Hero | `src/app/(search)/components/SearchAllHero.tsx` | 검색 통합 페이지 상단의 검색어 입력창(자동완성 없는 텍스트필드)과 인기 검색어 태그를 렌더링하며, 검색어 제출/삭제 시 URL 쿼리(q)를 변경해 라우팅하는 클라이언트 컴포넌트 | TODO |
| Search All Page | `src/app/(search)/components/SearchAllPage.tsx` | SearchAllHero와 SearchAllTabContent를 조합해 통합검색 페이지 전체를 구성하는 최상위 래퍼 컴포넌트 | TODO |
| Search All Tab Content | `src/app/(search)/components/SearchAllTabContent.tsx` | 통합검색 결과의 탭(All/Products/Documents/Media/Pages)을 전환하며, All 탭에서는 AI 요약과 Product/Documents/Media/Pages 섹션을 모두 보여주고 다른 탭에서는 해당 패널만 표시하는 클라이언트 컴포넌트 | TODO |
| Search Documents Card | `src/app/(search)/components/SearchDocumentsCard.tsx` | 문서(다운로드) 검색 결과 1건을 카드 형태로 표시하며 제목 하이라이트, 버전 선택 드롭다운, 파일별 Copy Link/Download 버튼을 렌더링하는 컴포넌트 | TODO |
| Search Documents Panel | `src/app/(search)/components/SearchDocumentsPanel.tsx` | Documents 탭 전체 패널로, 좌측 카테고리/문서유형 필터 사이드바와 우측 문서 카드 목록(SearchDocumentsCard) 및 페이지네이션을 페이지 상태(useState)로 관리해 보여주는 컴포넌트 | TODO |
| Search Media Panel | `src/app/(search)/components/SearchMediaPanel.tsx` | Media 탭 전체 패널로, 좌측 문서유형 필터와 우측 미디어(이미지/영상) 카드 리스트, 페이지네이션을 상태 관리하며 렌더링하는 컴포넌트 | TODO |
| Search Page List | `src/app/(search)/components/SearchPageList.tsx` | 페이지(Pages) 검색 결과 항목 배열을 받아 구분선(line)과 함께 SearchPageListItem 목록을 렌더링하는 리스트 래퍼 컴포넌트 | TODO |
| Search Page List Item | `src/app/(search)/components/SearchPageListItem.tsx` | 페이지 검색 결과 1건(카테고리, 제목, 하이라이트 태그, 설명)을 링크로 렌더링하는 리스트 아이템 컴포넌트 | TODO |
| Search Pages Panel | `src/app/(search)/components/SearchPagesPanel.tsx` | Pages 탭 전체 패널로, 좌측 문서유형 필터와 우측 SearchPageList 결과 목록, 페이지네이션을 상태 관리하며 렌더링하는 컴포넌트 | TODO |
| Search Products Panel | `src/app/(search)/components/SearchProductsPanel.tsx` | Products 탭 전체 패널로, 좌측 카테고리/문서유형 필터와 우측 제품 카드 목록(이미지·카테고리·제목·설명), 활성 필터 칩, 페이지네이션을 상태 관리하며 렌더링하는 컴포넌트 | TODO |
| Search Tab Active Filters | `src/app/(search)/components/SearchTabActiveFilters.tsx` | 검색 탭(Products/Documents)에 적용된 활성 필터 칩 목록을 표시하고 개별 삭제 및 전체 삭제(Clear all) 기능을 제공하는 클라이언트 컴포넌트 | TODO |
| Search 페이지 | `src/app/(search)/page.tsx` | 통합검색(/search) 라우트의 진입 페이지로, search.css/devices-product-detail.css를 로드하고 Suspense로 감싼 SearchAllPage를 렌더링하는 Next.js 라우트 페이지 | TODO |

### 1-7. services

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Engineering Training Card | `src/app/(services)/engineering-training/components/EngineeringTrainingCard.tsx` | 엔지니어링 교육 과정 하나를 이미지·카테고리·제목·설명과 함께 카드 형태로 보여주고 상세 페이지 링크로 연결하는 카드 컴포넌트 | TODO |
| Engineering Training Curriculum | `src/app/(services)/engineering-training/components/EngineeringTrainingCurriculum.tsx` | 카테고리/레벨/서브카테고리 셀렉트 필터와 검색창, 교육 카드 목록, 페이지네이션으로 구성된 엔지니어링 교육 커리큘럼 목록 섹션 | TODO |
| Engineering Training Detail Hero | `src/app/(services)/engineering-training/components/EngineeringTrainingDetailHero.tsx` | 교육 상세 페이지 상단에 히어로 이미지, 카테고리, 제목, 설명을 보여주는 히어로 섹션 | TODO |
| Engineering Training Detail Schedule | `src/app/(services)/engineering-training/components/EngineeringTrainingDetailSchedule.tsx` | 교육 유형·월별 필터 셀렉트와 세션 목록(EngineeringTrainingDetailSession)을 렌더링하는 교육 일정 섹션 | TODO |
| Engineering Training Detail Session | `src/app/(services)/engineering-training/components/EngineeringTrainingDetailSession.tsx` | 일정 목록의 개별 세션 카드로 날짜, 마감 태그, 제목, 대상 제품, 유형/기간/장소 메타 정보를 보여주고 세션 상세로 링크 | TODO |
| Engineering Training Intro | `src/app/(services)/engineering-training/components/EngineeringTrainingIntro.tsx` | 엔지니어링 교육 페이지의 소개(히어로 이미지, 헤드라인, 설명문) 섹션 | TODO |
| Engineering Training Session Countdown | `src/app/(services)/engineering-training/components/EngineeringTrainingSessionCountdown.tsx` | 세션 신청 마감까지 남은 시간을 일/시/분/초로 표시하는 카운트다운 위젯 | TODO |
| Engineering Training Session Detail | `src/app/(services)/engineering-training/components/EngineeringTrainingSessionDetail.tsx` | 교육 세션 상세 페이지 메인 컴포넌트로 탭 네비게이션(스크롤 이동 포함), 참석 대상·식사·아젠다 테이블·등록폼·캘린더 추가 버튼과 사이드바(카운트다운, 메타정보, 등록 버튼)를 포함 | TODO |
| Engineering Training Session Detail Form | `src/app/(services)/engineering-training/components/EngineeringTrainingSessionDetailForm.tsx` | 교육 세션 등록을 위한 신청자 정보(이름, 이메일, 주소, 직책, 참석일 등)와 개인정보 동의 체크박스를 담은 등록 폼 | TODO |
| Engineering Training Title | `src/app/(services)/engineering-training/components/EngineeringTrainingTitle.tsx` | 공통 CompanyAboutTitleSection을 재사용해 엔지니어링 교육 페이지 제목/설명을 표시하는 타이틀 컴포넌트 | TODO |
| Services Engineering Training 페이지 | `src/app/(services)/engineering-training/page.tsx` | 타이틀, 소개, 커리큘럼 목록 섹션을 조합한 엔지니어링 교육(Engineering Training) 메인 페이지 | TODO |
| Request For Training | `src/app/(services)/request-for-training/components/RequestForTraining.tsx` | 교육 신청(다단계) 공통 레이아웃으로 단계 표시(RequestForTrainingSteps)와 이전/다음(또는 제출) 버튼 액션바를 감싸는 래퍼 섹션 | TODO |
| Request For Training Checkbox Group | `src/app/(services)/request-for-training/components/RequestForTrainingCheckboxGroup.tsx` | 범례·필수 표시·힌트를 가진 재사용 가능한 체크박스 그룹(다중 선택) 필드 컴포넌트 | TODO |
| Request For Training Field Label | `src/app/(services)/request-for-training/components/RequestForTrainingFieldLabel.tsx` | 필수 표시(*)를 지원하는 폼 필드용 공통 라벨 컴포넌트 | TODO |
| Request For Training Product Section | `src/app/(services)/request-for-training/components/RequestForTrainingProductSection.tsx` | 카테고리/서브카테고리 셀렉트로 제품군을 고르고 체크박스로 세부 제품을 선택하며 선택된 항목을 태그로 표시·삭제할 수 있는 제품 선택 섹션 | TODO |
| Request For Training Questionnaire Intro | `src/app/(services)/request-for-training/components/RequestForTrainingQuestionnaireIntro.tsx` | 교육 신청 설문 폼 상단에 들어가는 제목(heading)과 설명(description)을 보여주는 인트로 헤더 | TODO |
| Request For Training Step1 Form | `src/app/(services)/request-for-training/components/RequestForTrainingStep1Form.tsx` | 교육 신청 1단계 폼으로 교육 유형(라디오)·서브타입(셀렉트)과 신청자 이름·회사·주소·연락처 등을 입력받는 폼 | TODO |
| Request For Training Step2 Form | `src/app/(services)/request-for-training/components/RequestForTrainingStep2Form.tsx` | 교육 신청 2단계 폼으로 세션 횟수·일수, 시작/종료 일정(날짜 선택기), 학생 수를 입력받는 폼 | TODO |
| Request For Training Step3 Form | `src/app/(services)/request-for-training/components/RequestForTrainingStep3Form.tsx` | 교육 신청 3단계 폼으로 교육 형식(라디오)과 교육 장소명·주소·담당자 연락처 등을 입력받는 폼 | TODO |
| Request For Training Step4 Form | `src/app/(services)/request-for-training/components/RequestForTrainingStep4Form.tsx` | 교육 신청 4단계 폼으로 제품 선택 섹션과(automation variant일 경우) 직책·학생 참여도·VFD 이해도 체크박스, 코멘트, 개인정보 동의를 입력받는 마지막 제출용 폼 | TODO |
| Request For Training Steps | `src/app/(services)/request-for-training/components/RequestForTrainingSteps.tsx` | 현재 단계(active/completed 상태)를 아이콘과 화살표로 표시하는 교육 신청 진행 단계 인디케이터 | TODO |
| Request For Training Title | `src/app/(services)/request-for-training/components/RequestForTrainingTitle.tsx` | 공통 CompanyAboutTitleSection을 재사용해 교육 신청 페이지 제목/설명을 표시하는 타이틀 컴포넌트 | TODO |
| Services Request For Training 페이지 | `src/app/(services)/request-for-training/page.tsx` | 교육 신청(Request for Training) 1단계 페이지로 타이틀과 Step1Form을 RequestForTraining 래퍼에 담아 렌더링 | TODO |
| Services Request For Training Step2 페이지 | `src/app/(services)/request-for-training/step-2/page.tsx` | 교육 신청 2단계 페이지로 Step2Form을 이전/다음 버튼과 함께 렌더링 | TODO |
| Services Request For Training Step3 페이지 | `src/app/(services)/request-for-training/step-3/page.tsx` | 교육 신청 3단계 페이지로 Step3Form을 이전/다음 버튼과 함께 렌더링 | TODO |
| Services Request For Training Step4 페이지 | `src/app/(services)/request-for-training/step-4/page.tsx` | 교육 신청 4단계(제품군 variant="power") 페이지로 Step4Form을 이전/제출 버튼과 함께 렌더링 | TODO |
| Services Request For Training Step4 Type01 페이지 | `src/app/(services)/request-for-training/step-4-type_01/page.tsx` | 교육 신청 4단계의 다른 유형(variant="automation") 페이지로 Step4Form을 이전/제출 버튼과 함께 렌더링 | TODO |
| Service Center Banner | `src/app/(services)/service-center/components/ServiceCenterBanner.tsx` | 배경 이미지 위에 제목·설명·CTA 버튼을 표시하는 서비스 센터 배너 섹션 | TODO |
| Service Center Cards | `src/app/(services)/service-center/components/ServiceCenterCards.tsx` | 지식베이스 카드와 워런티/서비스요청/트레이닝/다운로드센터/테크허브 등 바로가기 카드 목록을 보여주는 서비스 센터 카드 섹션 | TODO |
| Service Center Flow | `src/app/(services)/service-center/components/ServiceCenterFlow.tsx` | 서비스 신청 처리 흐름을 경로 이미지와 단계별 아이콘·설명으로 시각화하는 서비스 플로우 다이어그램 섹션 | TODO |
| Service Center Gics | `src/app/(services)/service-center/components/ServiceCenterGics.tsx` | GICS(글로벌 통합 고객 서비스) 소개 이미지와 번호가 매겨진 특징 리스트를 보여주는 섹션 | TODO |
| Service Center Help | `src/app/(services)/service-center/components/ServiceCenterHelp.tsx` | 도움말 관련 카드(제목/설명/CTA/이미지) 목록을 링크로 보여주는 헬프 섹션 | TODO |
| Service Center Offering | `src/app/(services)/service-center/components/ServiceCenterOffering.tsx` | 메인 Swiper와 프리뷰 Swiper를 양방향 동기화하며 서비스 제공 항목(오퍼링)을 페이드 효과로 슬라이드하는 캐러셀 섹션 | TODO |
| Service Center Title | `src/app/(services)/service-center/components/ServiceCenterTitle.tsx` | 공통 CompanyAboutTitleSection을 재사용해 서비스 센터 페이지 제목/설명을 표시하는 타이틀 컴포넌트 | TODO |
| Services Service Center 페이지 | `src/app/(services)/service-center/page.tsx` | 타이틀·카드·배너·오퍼링·플로우·GICS·공통 FAQ 섹션을 조합한 서비스 센터(Service Center) 메인 페이지 | TODO |
| Warranty Feature Cards | `src/app/(services)/warranty-policy/components/WarrantyFeatureCards.tsx` | 번호·아이콘·제목을 가진 워런티 특징 카드 목록을 렌더링하는 재사용 카드 컴포넌트(coverage/extension variant 지원) | TODO |
| Warranty Policy Apply | `src/app/(services)/warranty-policy/components/WarrantyPolicyApply.tsx` | 워런티 신청 관련 카테고리별 문의처를 표(테이블)로 보여주는 섹션 | TODO |
| Warranty Policy Banner | `src/app/(services)/warranty-policy/components/WarrantyPolicyBanner.tsx` | 배경 이미지 위에 제목·설명·CTA 버튼을 표시하는 워런티 정책 배너 섹션 | TODO |
| Warranty Policy Coverage | `src/app/(services)/warranty-policy/components/WarrantyPolicyCoverage.tsx` | 워런티 보장 범위를 특징 카드, 제품별 보증기간 표, 유의사항 리스트로 보여주는 섹션 | TODO |
| Warranty Policy Extension | `src/app/(services)/warranty-policy/components/WarrantyPolicyExtension.tsx` | 워런티 연장 안내를 특징 카드와 중요 안내사항·제외사항 패널로 보여주는 섹션 | TODO |
| Warranty Policy Title | `src/app/(services)/warranty-policy/components/WarrantyPolicyTitle.tsx` | 공통 CompanyAboutTitleSection을 재사용해 워런티 정책 페이지 제목/설명을 표시하는 타이틀 컴포넌트 | TODO |
| Services Warranty Policy 페이지 | `src/app/(services)/warranty-policy/page.tsx` | 타이틀·보장범위·배너·연장안내·신청방법 섹션을 조합한 워런티 정책(Warranty Policy) 메인 페이지 | TODO |

### 1-8. support

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Connect Portal Detail | `src/app/(support)/connect-portal/components/ConnectPortalDetail.tsx` | 타이틀/설명/체크리스트와 이미지를 좌우(또는 반전) 배치로 보여주는 Connect Portal 상세 소개 섹션 컴포넌트 | TODO |
| Connect Portal Features | `src/app/(support)/connect-portal/components/ConnectPortalFeatures.tsx` | Connect Portal의 주요 기능을 카드 그리드 형태로 소개하는 섹션 컴포넌트 | TODO |
| Connect Portal Title | `src/app/(support)/connect-portal/components/ConnectPortalTitle.tsx` | Connect Portal 페이지 상단의 타이틀과 설명을 표시하는 섹션 컴포넌트 | TODO |
| Connect Portal Video | `src/app/(support)/connect-portal/components/ConnectPortalVideo.tsx` | 유튜브 영상 플레이어와 소개 텍스트, CTA 링크를 함께 보여주는 Connect Portal 영상 섹션 컴포넌트 | TODO |
| Support Connect Portal 페이지 | `src/app/(support)/connect-portal/page.tsx` | Title, Video, Features, 상세 섹션들을 조합해 렌더링하는 Connect Portal 페이지 | TODO |
| Contact Us Form | `src/app/(support)/contact-us/components/ContactUsForm.tsx` | 문의 유형, 제품 카테고리, 연락처, 비밀번호, 약관 동의 등을 입력받는 Contact Us 문의 등록 폼 컴포넌트 | TODO |
| Contact Us Modals Hub Page | `src/app/(support)/contact-us/components/ContactUsModalsHubPage.tsx` | Contact Us 관련 각종 모달(개인정보처리방침, 답변 조회, 답변 상세)을 버튼으로 열어보는 테스트/허브 페이지 컴포넌트 | TODO |
| Contact Us Terms Modal | `src/app/(support)/contact-us/components/ContactUsTermsModal.tsx` | PrivacyPolicyModal을 감싸서 열고 닫는 Contact Us 약관(개인정보처리방침) 모달 래퍼 컴포넌트 | TODO |
| Contact Us Terms Modal Page Content | `src/app/(support)/contact-us/components/ContactUsTermsModalPageContent.tsx` | `/support/contact-us/terms-modal` 라우트에서 약관 모달을 항상 열린 상태로 표시하는 페이지 콘텐츠 컴포넌트 | TODO |
| Contact Us Terms Modal Preview | `src/app/(support)/contact-us/components/ContactUsTermsModalPreview.tsx` | 약관 모달을 embedded(인라인) 모드로 항상 열어서 보여주는 가이드/미리보기용 컴포넌트 | TODO |
| Contact Us Title | `src/app/(support)/contact-us/components/ContactUsTitle.tsx` | Contact Us 페이지 타이틀과 설명, 답변 조회(View Response) 버튼 및 모달을 포함하는 섹션 컴포넌트 | TODO |
| Contact Us View Response Detail Answered Preview | `src/app/(support)/contact-us/components/ContactUsViewResponseDetailAnsweredPreview.tsx` | ContactUsViewResponseDetailModal을 'answered'(답변완료) variant로 embedded 미리보기하는 컴포넌트 | TODO |
| Contact Us View Response Detail Modal | `src/app/(support)/contact-us/components/ContactUsViewResponseDetailModal.tsx` | 문의 내용과 답변(완료/대기)을 상세하게 보여주는 Q&A 형태의 답변 상세 모달 컴포넌트 | TODO |
| Contact Us View Response Detail Pending Preview | `src/app/(support)/contact-us/components/ContactUsViewResponseDetailPendingPreview.tsx` | ContactUsViewResponseDetailModal을 'pending'(답변대기) variant로 embedded 미리보기하는 컴포넌트 | TODO |
| Contact Us View Response Modal | `src/app/(support)/contact-us/components/ContactUsViewResponseModal.tsx` | 문의번호와 비밀번호를 입력해 답변을 조회하는 폼과 유효성 검증 에러 처리를 포함한 모달 컴포넌트 | TODO |
| Contact Us View Response Modal Error Preview | `src/app/(support)/contact-us/components/ContactUsViewResponseModalErrorPreview.tsx` | ContactUsViewResponseModal을 열자마자 검증 에러가 표시된 상태로 embedded 미리보기하는 컴포넌트 | TODO |
| Contact Us View Response Modal Preview | `src/app/(support)/contact-us/components/ContactUsViewResponseModalPreview.tsx` | ContactUsViewResponseModal을 기본 상태(에러 없음)로 embedded 미리보기하는 컴포넌트 | TODO |
| Support Contact Us 페이지 | `src/app/(support)/contact-us/page.tsx` | ContactUsTitle과 ContactUsForm을 조합한 Contact Us(문의하기) 메인 페이지 | TODO |
| Support Contact Us Terms Modal 페이지 | `src/app/(support)/contact-us/terms-modal/page.tsx` | ContactUsModalsHubPage를 렌더링하는 Contact Us 모달 허브 라우트 페이지 | TODO |
| Download Center Active Filters | `src/app/(support)/download-center/components/DownloadCenterActiveFilters.tsx` | 선택된 필터 칩 목록을 표시하고 개별/전체 삭제 기능을 제공하는 Download Center 활성 필터 컴포넌트 | TODO |
| Download Center Contents | `src/app/(support)/download-center/components/DownloadCenterContents.tsx` | 제품 카테고리/문서유형 필터, 정렬, 다운로드 항목 리스트, 페이지네이션으로 구성된 Download Center 본문 컴포넌트(empty 상태 지원) | TODO |
| Download Center Empty | `src/app/(support)/download-center/components/DownloadCenterEmpty.tsx` | 검색 결과가 없을 때 안내 문구와 팁, 문의 링크를 보여주는 Download Center 빈 상태 컴포넌트 | TODO |
| Download Center Search | `src/app/(support)/download-center/components/DownloadCenterSearch.tsx` | 검색어 입력과 인기 검색어 태그를 제공하는 Download Center 검색 섹션 컴포넌트 | TODO |
| Download Center Title | `src/app/(support)/download-center/components/DownloadCenterTitle.tsx` | Download Center 페이지 상단 타이틀과 설명을 표시하는 섹션 컴포넌트 | TODO |
| Support Download Center No Data 페이지 | `src/app/(support)/download-center/no-data/page.tsx` | 검색 결과 없음(empty) 상태를 보여주는 Download Center 데모 페이지 | TODO |
| Support Download Center 페이지 | `src/app/(support)/download-center/page.tsx` | Title, Search, Contents를 조합한 Download Center(자료실) 메인 페이지 | TODO |
| Tech Hub Contents | `src/app/(support)/tech-hub/components/TechHubContents.tsx` | 제품 카테고리/인증 필터, 영상 카드 그리드, 페이지네이션으로 구성된 Tech Hub 본문 컴포넌트(empty 상태 지원) | TODO |
| Tech Hub Empty | `src/app/(support)/tech-hub/components/TechHubEmpty.tsx` | 검색 결과가 없을 때 안내 문구와 전체보기 링크를 보여주는 Tech Hub 빈 상태 컴포넌트 | TODO |
| Tech Hub Search | `src/app/(support)/tech-hub/components/TechHubSearch.tsx` | 검색어 입력 필드를 제공하는 Tech Hub 검색 섹션 컴포넌트 | TODO |
| Tech Hub Title | `src/app/(support)/tech-hub/components/TechHubTitle.tsx` | Tech Hub 페이지 상단 타이틀과 설명을 표시하는 섹션 컴포넌트 | TODO |
| Tech Hub Video Card | `src/app/(support)/tech-hub/components/TechHubVideoCard.tsx` | 썸네일과 재생 버튼, 제목을 가진 Tech Hub 영상 목록의 개별 카드 컴포넌트 | TODO |
| Tech Hub View | `src/app/(support)/tech-hub/components/TechHubView.tsx` | 선택한 영상의 플레이어와 시리즈 목록을 함께 보여주는 Tech Hub 영상 상세 시청 섹션 컴포넌트 | TODO |
| Tech Hub View Player | `src/app/(support)/tech-hub/components/TechHubViewPlayer.tsx` | 유튜브 영상을 재생하는 Tech Hub 상세 시청 페이지용 비디오 플레이어 컴포넌트 | TODO |
| Tech Hub View Series Item | `src/app/(support)/tech-hub/components/TechHubViewSeriesItem.tsx` | 시리즈 내 개별 영상의 썸네일, 챕터, 제목을 링크로 보여주는 Tech Hub 시리즈 목록 아이템 컴포넌트 | TODO |
| Support Tech Hub No Data 페이지 | `src/app/(support)/tech-hub/no-data/page.tsx` | 검색 결과 없음(empty) 상태를 보여주는 Tech Hub 데모 페이지 | TODO |
| Support Tech Hub 페이지 | `src/app/(support)/tech-hub/page.tsx` | Title, Search, Contents를 조합한 Tech Hub(기술자료 영상) 메인 페이지 | TODO |
| Support Tech Hub View 페이지 | `src/app/(support)/tech-hub/view/page.tsx` | TechHubView를 렌더링하는 Tech Hub 개별 영상 시청 라우트 페이지 | TODO |
| Where To Buy Banner | `src/app/(support)/where-to-buy/components/WhereToBuyBanner.tsx` | 배경 이미지와 문구, CTA 링크로 구성된 Where to Buy 페이지 하단 배너 컴포넌트 | TODO |
| Where To Buy Contents | `src/app/(support)/where-to-buy/components/WhereToBuyContents.tsx` | 검색, 거리/카테고리 필터, 대리점 목록, 구글 지도와 팝업을 함께 보여주는 Where to Buy 본문 컴포넌트(empty 상태 지원) | TODO |
| Where To Buy Empty | `src/app/(support)/where-to-buy/components/WhereToBuyEmpty.tsx` | 검색 결과가 없을 때 안내 문구와 전체보기 링크를 보여주는 Where to Buy 빈 상태 컴포넌트 | TODO |
| Where To Buy Location Card | `src/app/(support)/where-to-buy/components/WhereToBuyLocationCard.tsx` | 대리점 이름, 주소, 전화번호, 웹사이트와 길찾기/전화 액션을 보여주는 Where to Buy 대리점 카드 컴포넌트 | TODO |
| Where To Buy Map | `src/app/(support)/where-to-buy/components/WhereToBuyMap.tsx` | Google Maps API를 로드해 대리점 위치 마커를 표시하고 선택 시 이동/줌하는 Where to Buy 지도 컴포넌트 | TODO |
| Where To Buy Map Popup | `src/app/(support)/where-to-buy/components/WhereToBuyMapPopup.tsx` | 지도 마커 클릭 시 표시되는 대리점 정보(이름, 배지, 주소, 전화, 웹사이트) 팝업 컴포넌트 | TODO |
| Where To Buy Search | `src/app/(support)/where-to-buy/components/WhereToBuySearch.tsx` | 검색어 입력과 '내 위치 사용' 버튼을 제공하는 Where to Buy 검색 컴포넌트(embedded 모드 지원) | TODO |
| Where To Buy Title | `src/app/(support)/where-to-buy/components/WhereToBuyTitle.tsx` | Where to Buy 페이지 상단 타이틀과 설명을 표시하는 섹션 컴포넌트 | TODO |
| Support Where To Buy No Data 페이지 | `src/app/(support)/where-to-buy/no-data/page.tsx` | 검색 결과 없음(empty) 상태를 보여주는 Where to Buy 데모 페이지 | TODO |
| Support Where To Buy 페이지 | `src/app/(support)/where-to-buy/page.tsx` | Title, Contents(목록+지도), Banner를 조합한 Where to Buy(대리점 찾기) 메인 페이지 | TODO |

### 1-9. guide (개발용 컴포넌트/섹션 가이드 페이지)

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Guide Components 레이아웃 | `src/app/guide/components/layout.tsx` | 자식 요소를 그대로 반환하기만 하는 컴포넌트 가이드 하위 레이아웃(별도 UI 없이 children 패스스루) | TODO |
| Guide Components 페이지 | `src/app/guide/components/page.tsx` | Button/Check/Textfield 등 UI 컴포넌트 가이드를 보여주는 ComponentGuide 컴포넌트를 렌더링하는 컴포넌트 가이드 페이지 | TODO |
| Guide Gnb 페이지 | `src/app/guide/gnb/page.tsx` | 글로벌 내비게이션(GNB)·메가메뉴 가이드를 보여주는 GnbGuide 컴포넌트를 렌더링하는 GNB 가이드 페이지 | TODO |
| Guide Ico 페이지 | `src/app/guide/ico/page.tsx` | public/ico 아이콘 목록을 보여주는 IcoGuide 컴포넌트를 렌더링하는 아이콘 가이드 페이지 | TODO |
| Guide 레이아웃 | `src/app/guide/layout.tsx` | 가이드 전용 CSS(guide.css)를 불러오고 children을 그대로 렌더링하는 가이드 섹션 공통 레이아웃(MegaMenu·CommonFooter는 주석 처리되어 미사용) | TODO |
| Guide 페이지 | `src/app/guide/page.tsx` | Component/Icon/Section/GNB 가이드로 이동하는 카드 링크 목록을 보여주는 디자인 가이드 허브(진입) 페이지 | TODO |
| Guide Sections 페이지 | `src/app/guide/sections/page.tsx` | 여러 도메인 CSS(main/markets/devices-systems 등)를 불러와 섹션 마크업·클래스 레지스트리를 보여주는 SectionGuide 컴포넌트를 렌더링하는 섹션 가이드 페이지 | TODO |

---

## 2. components/ — 공용 컴포넌트

### 2-1. banners

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Banner01 | `src/components/banners/CommonBanner01.tsx` | `common/banners/common-banner01`을 그대로 재노출(re-export)하는 얇은 래퍼 파일 | TODO |
| Common Banner02 | `src/components/banners/CommonBanner02.tsx` | `common/banners/common-banner02`을 그대로 재노출하는 얇은 래퍼 파일 | TODO |
| Common Banner02 Copy Link | `src/components/banners/CommonBanner02CopyLink.tsx` | 이메일 등 문자열 값을 클립보드로 복사하는 "Copy Email" 버튼 컴포넌트 | TODO |
| Common Banner03 | `src/components/banners/CommonBanner03.tsx` | `common/banners/common-banner03`을 그대로 재노출하는 얇은 래퍼 파일 | TODO |
| Common Banner03 Link | `src/components/banners/CommonBanner03Link.tsx` | `common/banners/common-banner03-link`을 그대로 재노출하는 얇은 래퍼 파일 | TODO |
| Common Banner04 | `src/components/banners/CommonBanner04.tsx` | `common/banners/common-banner04`을 그대로 재노출하는 얇은 래퍼 파일 | TODO |

### 2-2. common

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Banner01 (kebab) | `src/components/common/banners/common-banner01.tsx` | "Engineering the Future of Smart Energy" 문구와 Contact Us/Connect Portal 링크가 있는 다크 배경 CTA 배너 섹션 | TODO |
| Common Banner02 (kebab) | `src/components/common/banners/common-banner02.tsx` | Configurator 상담 유도용 배너로, default(일반 문의)와 expert(전문가 문의, 이메일 복사 포함) 두 변형을 지원하는 CTA 패널 컴포넌트 | TODO |
| Common Banner03 (kebab) | `src/components/common/banners/common-banner03.tsx` | Tech Hub 비디오 가이드로 이동하는 이미지+텍스트 배너(MCCB Video Tutorials) 섹션 | TODO |
| Common Banner03 Link (kebab) | `src/components/common/banners/common-banner03-link.tsx` | 여러 항목(title/description/href)을 호버 시 다른 항목이 흐려지는 인터랙션과 함께 나열하는 링크형 배너 섹션 | TODO |
| Common Banner04 (kebab) | `src/components/common/banners/common-banner04.tsx` | 배경 이미지(PC/모바일 분기 가능) 위에 제목·설명·CTA 버튼을 얹은 풀폭 다크 CTA 배너 섹션 | TODO |
| Highlight News Section (kebab) | `src/components/common/content/highlight-news-section.tsx` | 뉴스 하이라이트 섹션 (variant로 스타일 분기) | TODO |
| Footer | `src/components/common/footer.tsx` | 메인 푸터 — 뉴스레터·SNS·법적고지 (최하단) | TODO |
| Gnb Breadcrumb | `src/components/common/gnb/gnb-breadcrumb.tsx` | GNB 영역에 표시되는 바로가기 링크 바(Contact Us·Where to buy·Connect Portal) — 실제 계층형 브레드크럼이 아니며 메인 경로에서만 노출 | TODO |
| Gnb Mega Explore All | `src/components/common/gnb/GnbMegaExploreAll.tsx` | GNB 메가메뉴의 "Explore All Products" 화면에서 알파벳별로 그룹핑된 제품 목록을 컬럼으로 렌더링하는 컴포넌트 | TODO |
| Gnb Mega Panel | `src/components/common/gnb/GnbMegaPanel.tsx` | GNB 메가메뉴에서 2뎁스 카테고리, 3뎁스 항목, 4뎁스 제품카드를 마우스오버로 전환하며 보여주는 패널 컴포넌트 | TODO |
| Gnb Menu | `src/components/common/gnb/gnb-menu.tsx` | GNB 메인 컴포넌트 — 로고·네비·메가메뉴·모바일 메뉴 | TODO |
| Gnb Careers Mega Panel | `src/components/common/gnb/mega/GnbCareersMegaPanel.tsx` | Careers 메가 패널 | TODO |
| Gnb Company Mega Panel | `src/components/common/gnb/mega/GnbCompanyMegaPanel.tsx` | Company 메가 패널 | TODO |
| Gnb Devices Mega Panel | `src/components/common/gnb/mega/GnbDevicesMegaPanel.tsx` | Devices & Systems 메가 패널 | TODO |
| Gnb Markets Mega Panel | `src/components/common/gnb/mega/GnbMarketsMegaPanel.tsx` | Markets 메가 패널 | TODO |
| Gnb Mega Item Link | `src/components/common/gnb/mega/GnbMegaItemLink.tsx` | 메가 메뉴 아이템 링크 컴포넌트 | TODO |
| Gnb Services Mega Panel | `src/components/common/gnb/mega/GnbServicesMegaPanel.tsx` | Services 메가 패널 | TODO |
| Gnb Support Mega Panel | `src/components/common/gnb/mega/GnbSupportMegaPanel.tsx` | Support 메가 패널 | TODO |
| Guide Select | `src/components/common/guide-select.tsx` | MUI Select 래퍼 (푸터 셀렉트박스 공용) | TODO |
| Header | `src/components/common/header.tsx` | 메인 헤더 — GNB + 메가메뉴 (최상단 고정) | TODO |
| History Reload On Navigate | `src/components/common/history-reload-on-navigate.tsx` | 뒤로가기/앞으로가기(popstate·pageshow)나 특정 경로(main/페이지 인덱스) 이동 시 하드 리로드·네비게이션을 강제하고, 일반 링크 클릭도 가로채 처리하는 컴포넌트 | TODO |
| Scroll To Top On Navigate | `src/components/common/scroll-to-top-on-navigate.tsx` | 메인 경로로 이동 시 스크롤을 최상단으로 이동시키고 scrollRestoration을 제어하는 컴포넌트 | TODO |

### 2-3. content

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Devices Product Features Section | `src/components/content/DevicesProductFeaturesSection.tsx` | 제품 상세 페이지의 "Key Feature" 섹션으로, 설명형(desc)과 불릿리스트형(list) 두 변형의 카드 그리드를 렌더링 | TODO |
| Highlight News Section | `src/components/content/HighlightNewsSection.tsx` | `common/content/highlight-news-section`을 그대로 재노출하는 얇은 래퍼 파일 | TODO |

### 2-4. dev

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Page Index Table Columns | `src/components/dev/pageIndexTable.columns.tsx` | 페이지 인덱스 관리용 MUI DataGrid의 컬럼 정의(No, Page ID, URL, 뎁스별 라벨, 날짜, 상태 Chip, 비고) | TODO |
| Page Index Table | `src/components/dev/PageIndexTable.tsx` | 프로젝트 페이지·가이드 목록과 작업 상태를 MUI DataGrid로 보여주는 개발용 페이지 인덱스 테이블 컴포넌트 | TODO |

### 2-5. faq

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Faq | `src/components/faq/CommonFaq.tsx` | 질문/답변 아코디언 패널들을 펼치고 접을 수 있는 공통 FAQ 섹션 컴포넌트 | TODO |

### 2-6. form

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Guide Date Picker | `src/components/form/GuideDatePicker.tsx` | MUI DatePicker를 프로젝트 스타일(가이드 필드 클래스, 커스텀 열기 아이콘)에 맞게 래핑한 날짜 선택 필드 | TODO |
| Guide Date Picker Provider | `src/components/form/GuideDatePickerProvider.tsx` | dayjs 어댑터를 사용하는 MUI LocalizationProvider로 자식 컴포넌트를 감싸는 날짜 선택기 컨텍스트 프로바이더 | TODO |
| Guide Field Icons | `src/components/form/GuideFieldIcons.tsx` | 체크박스/셀렉트용 아이콘 및 아이콘 경로 상수(GuideSelectIcon, GuideCheckboxIcon 등)를 제공하는 폼 필드 아이콘 헬퍼 모듈 | TODO |
| Guide Select | `src/components/form/GuideSelect.tsx` | `common/guide-select`를 그대로 재노출하는 얇은 래퍼 파일 | TODO |

### 2-7. guide

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Component Guide | `src/components/guide/ComponentGuide.tsx` | Figma 04~08 스펙(Button, Check, Textfield, Pagination, Banner)의 공통 UI 컴포넌트들을 상태별(Default/Hover/Disabled)로 모아 보여주는 컴포넌트 가이드 페이지 | TODO |
| Gnb Guide | `src/components/guide/GnbGuide.tsx` | GNB(내비게이션)의 실시간 미리보기, 구조, 메가패널 목록, 아이콘, 클래스 레퍼런스를 문서화한 GNB 가이드 페이지 | TODO |
| Gnb Guide Preview | `src/components/guide/GnbGuidePreview.tsx` | Main/Markets 두 변형을 탭으로 전환하며 실제 GnbMenu 컴포넌트를 라이브로 미리보는 프리뷰 컴포넌트 | TODO |
| Guide Nav | `src/components/guide/GuideNav.tsx` | Page Index/가이드 하위 페이지들(Components, Sections, GNB, Icons 등) 사이를 이동하는 공통 내비게이션 링크 바 | TODO |
| Guide Page Header | `src/components/guide/GuidePageHeader.tsx` | 가이드 문서 페이지 상단의 제목·설명·메타 정보를 표시하는 공통 헤더 컴포넌트 | TODO |
| Guide Related | `src/components/guide/GuideRelated.tsx` | 현재 페이지를 제외한 관련 가이드 페이지들(Design/Component/Section/GNB/Icon Guide)로의 링크 목록 | TODO |
| Ico Guide | `src/components/guide/IcoGuide.tsx` | `public/ico`의 공통 아이콘과 페이지 전용 아이콘을 카테고리별로 나열하고 사용법(img/CSS 코드)을 보여주는 아이콘 가이드 페이지 | TODO |
| Section Guide | `src/components/guide/SectionGuide.tsx` | 프로젝트 전체 섹션의 클래스 네이밍 규칙과 카테고리별 라이브 미리보기를 모아 보여주는 섹션 가이드 페이지 | TODO |
| Section Guide Block | `src/components/guide/SectionGuideBlock.tsx` | 섹션 가이드에서 각 섹션 항목의 메타데이터(컴포넌트명, CSS 파일, modifier 등)와 실제 미리보기를 함께 감싸 보여주는 카드형 래퍼 컴포넌트 | TODO |
| Section Guide Previews | `src/components/guide/SectionGuidePreviews.tsx` | Main, Markets, Devices, Company, Support, Services, Search 등 도메인별 실제 페이지 섹션 컴포넌트들을 SectionGuideBlock으로 감싸 미리보기 목록을 생성하는 대규모 프리뷰 모음 파일 | TODO |

### 2-8. layout

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Lenis Scroll Provider | `src/components/layout/LenisScrollProvider.tsx` | Lenis 라이브러리로 부드러운 스크롤을 앱 전체에 적용하고 전역에서 접근 가능한 Lenis 인스턴스를 설정하는 프로바이더 컴포넌트 | TODO |
| Markets Group Header | `src/components/layout/markets/MarketsGroupHeader.tsx` | 현재 경로와 모바일 여부에 따라 메인 Header 또는 Markets 전용 SubHeader를 조건부로 렌더링하는 헤더 분기 컴포넌트 | TODO |
| Sub Footer | `src/components/layout/markets/SubFooter.tsx` | Markets 섹션용으로 로고 링크만 다르게 설정한 공통 Footer 래퍼 컴포넌트 | TODO |
| Sub Header | `src/components/layout/markets/SubHeader.tsx` | Markets 페이지 전용으로 스크롤에 따른 표시/숨김, 상단 고정 상태, 메가메뉴/모바일메뉴 상태를 관리하며 GnbMenu와 브레드크럼을 렌더링하는 서브 헤더 컴포넌트 | TODO |
| Scroll To Top Button | `src/components/layout/ScrollToTopButton.tsx` | 스크롤이 400px를 넘으면 나타나는 "맨 위로" 플로팅 버튼 — Lenis 인스턴스가 있으면 Lenis로, reduced-motion 설정 시 즉시 이동으로 최상단 스크롤 처리 | TODO |

### 2-9. main

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Banner Swiper | `src/components/main/banner-swiper.tsx` | MainVisual 내부 — 배너 슬라이드 | TODO |
| Icon Cards | `src/components/main/icon-cards.tsx` | [섹션 8] 아이콘 + 텍스트 카드 | TODO |
| Main Cards | `src/components/main/main-cards.tsx` | [섹션 5] 마켓/솔루션 카드 목록 | TODO |
| Main Info | `src/components/main/main-info.tsx` | [섹션 2] 브랜드 소개 타이틀 + 카운트업 통계 수치(Years/Nations/States) 섹션 | TODO |
| Main Products | `src/components/main/main-products.tsx` | [섹션 6] New Arrivals/Best Sellers 탭 전환형 주요 제품 슬라이더 목록 (현재 정적 데이터, API 연동 예정) | TODO |
| Main Visual | `src/components/main/main-visual.tsx` | [섹션 1] 풀스크린 비주얼 — VideoSwiper + BannerSwiper + 공지 | TODO |
| Video Swiper | `src/components/main/video-swiper.tsx` | MainVisual 내부 — 영상/유튜브/이미지 혼합 슬라이드 (자동재생 진행바 + 재생/정지 컨트롤) | TODO |
| What We Do Swiper | `src/components/main/what-we-do-swiper.tsx` | [섹션 3] What We Do 슬라이더 | TODO |

### 2-10. modals

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Privacy Policy Modal | `src/components/modals/PrivacyPolicyModal.tsx` | 개인정보처리방침 내용을 모달(또는 embedded 인라인) 형태로 표시하고 ESC·배경클릭으로 닫는 컴포넌트 | TODO |

### 2-11. pagination

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Page Numbering | `src/components/pagination/PageNumbering.tsx` | 현재 페이지 기준 최대 5개 번호 노출 + 처음/이전/다음/끝 이동 버튼을 제공하는 페이지네이션 컴포넌트 | TODO |

### 2-12. product

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Product Award Badge | `src/components/product/ProductAwardBadge.tsx` | 제품 카드 이미지 영역에 표시되는 수상 뱃지 아이콘 컴포넌트 (아이콘 span만 렌더링) | TODO |

### 2-13. swiper

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Banner Nav Buttons | `src/components/swiper/BannerNavButtons.tsx` | 배너 스와이퍼의 이전/다음 슬라이드 이동 버튼 컴포넌트 | TODO |
| Swiper Bar Controls | `src/components/swiper/SwiperBarControls.tsx` | SwiperBarPagination과 SwiperNavButtons를 묶어 variant별 바(bar) 형태 슬라이더 컨트롤을 구성하는 컴포넌트 | TODO |
| Swiper Bar Pagination | `src/components/swiper/SwiperBarPagination.tsx` | variant별 클래스를 적용해 바(bar) 형태로 렌더링되는 탭형 슬라이더 페이지네이션 컴포넌트 | TODO |
| Swiper Dot Pagination | `src/components/swiper/SwiperDotPagination.tsx` | 점(dot) 형태의 배너 슬라이더 페이지네이션 컴포넌트 | TODO |
| Swiper Nav Buttons | `src/components/swiper/SwiperNavButtons.tsx` | variant별 클래스를 적용한 이전/다음 슬라이드 네비게이션 버튼 컴포넌트 | TODO |

### 2-14. ui

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Btn Arrow | `src/components/ui/BtnArrow.tsx` | 텍스트 뒤에 화살표 아이콘이 붙는 링크형 버튼 공통 컴포넌트 | TODO |
| Btn Flat | `src/components/ui/BtnFlat.tsx` | href 유무에 따라 a 태그 또는 button 태그로 렌더링되는 플랫 버튼 공통 컴포넌트 | TODO |
| Faq Item | `src/components/ui/FaqItem.tsx` | 질문 클릭 시 답변 영역이 펼쳐지는 아코디언형 FAQ 아이템 컴포넌트 | TODO |
| Tab Button | `src/components/ui/TabButton.tsx` | role="tab" 접근성 속성을 가진 탭 전환용 버튼 공통 컴포넌트 | TODO |

### 2-15. video

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Devices Product Video Player | `src/components/video/DevicesProductVideoPlayer.tsx` | 유튜브 영상 ID를 임베드 URL로 변환해 iframe으로 재생하는 제품 소개 비디오 플레이어 컴포넌트 | TODO |

---

## 참고

- 본 표는 `app/` + `components/` 하위 **tsx 파일만** 대상으로 함 (`.ts` 유틸/타입 파일 제외)
- `설명`은 각 파일을 Read로 직접 읽고 실제 코드(렌더링 구조·데이터·로직)에 근거해 작성함
- `data slug`는 BO `SlugRegistry`(slug 사전등록, type: `PAGE_DATA`/`PAGE_TEMPLATE`/`ETC`)에서 발급되는 값을 그대로 기입 예정
- `components/banners/*`(PascalCase)와 `components/common/banners/*`(kebab-case) 다수가 단순 재노출(re-export) 관계로 확인됨; `app/main/components/*`도 `components/main/*`를 재노출하는 배럴 파일로 확인됨 — 실제 사용처는 재노출 대상 원본 쪽이며, 정리 필요 여부는 별도 논의 예정
