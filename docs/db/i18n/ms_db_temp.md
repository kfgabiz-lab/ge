# 메뉴 다국어 등록 임시 스크립트

> BO 메뉴 항목을 `message_resource` 테이블에 등록하고,
> `menu.name_msg_key`를 업데이트하는 임시 SQL 스크립트.
>
> **실행 순서**: STEP 1(INSERT) → STEP 2(UPDATE)  
> **적용 DB**: `bo` (로컬: localhost:5432 / 개발: application-dev.yml 참조)

---

## STEP 1. message_resource INSERT

```sql
-- 메뉴명 다국어 키 일괄 등록
-- ON CONFLICT DO NOTHING → 이미 존재하는 키는 무시
INSERT INTO message_resource ("key", ko, en, is_active, resource_type, created_by, created_at, updated_by, updated_at)
VALUES

-- ────────────── 1depth 메뉴 ──────────────
('common.word.main',               'MAIN',                    'Main',                      true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.system',             'SYSTEM',                  'System',                    true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.displaymanage',      '전시 관리',               'Display Manage',            true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.contentsmanage',     '컨텐츠 관리',             'Contents Manage',           true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.adminmanage',        '관리자 관리',             'Admin Manage',              true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.test',               '테스트',                  'Test',                      true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── MAIN 하위 ──────────────
('common.word.dashboard',          '대시보드',                'Dashboard',                 true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── 관리자 관리 > Settings ──────────────
('common.word.settings',           '설정',                    'Settings',                  true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.menumanage',         '메뉴 관리',               'Menu Manage',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.usermanage',         '관리자 관리',             'User Manage',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.rolemanage',         '권한 관리',               'Role Manage',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.sitemanage',         '사이트 관리',             'Site Manage',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.codemanage',         '공통코드 관리',           'Code Manage',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.i18nmanage',         '다국어 관리',             'I18n Manage',               true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── 관리자 관리 > Templates ──────────────
('common.word.templates',              '템플릿',                  'Templates',                 true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.buildercontentslayout',  'Builder 컨텐츠 레이아웃', 'Builder Contents Layout',   true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.uicomponent',            'UI 컴포넌트',             'UI Components',             true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.listlayout',             '목록형 레이아웃',         'List Layout',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.formlayout',             '폼형 레이아웃',           'Form Layout',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.cardlayout',             '카드형 레이아웃',         'Card Layout',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.dashboardlayout',        '대시보드 레이아웃',       'Dashboard Layout',          true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.searchtemplate',         '검색 템플릿',             'Search Template',           true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── 관리자 관리 > BuilderTest ──────────────
('common.word.buildertest',        '빌더 테스트',             'Builder Test',              true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.board1',             '게시판1',                 'Board 1',                   true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.board2',             '게시판2',                 'Board 2',                   true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.categorytestpage1',  '카테고리테스트페이지1',   'Category Test Page 1',      true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.popuplist',          '팝업관리',                'Popup List',                true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.productmanage',      '제품 관리',               'Product Manage',            true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.multiselect',        '멀티셀렉트',              'Multi Select',              true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.bannermanage',       '배너 관리',               'Banner Manage',             true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.tabtest',            '탭 테스트',               'Tab Test',                  true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.testmenu',           '테스트 메뉴',             'Test Menu',                 true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── 테스트 하위 ──────────────
('common.word.componenttestlist2', '컴포넌트테스트목록2',     'Component Test List 2',     true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.componenttestpage2', '컴포넌트테스트페이지2',   'Component Test Page 2',     true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.quickboard1',        'Quick-게시판1',           'Quick Board 1',             true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.widgettest',         '위젯테스트',              'Widget Test',               true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.pagelayouttest',     '페이지레이아웃테스트',    'Page Layout Test',          true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.componenttest',      '컴포넌트테스트',          'Component Test',            true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── SYSTEM > Manage ──────────────
('common.word.manage',             '관리',                    'Manage',                    true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.homepagemanage',     '홈페이지 관리',           'Homepage Manage',           true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── SYSTEM > System (DB 관련 도구) ──────────────
('common.word.dbsystem',           '시스템',                  'DB System',                 true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.table',              '테이블',                  'Table',                     true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.entity',             '엔티티',                  'Entity',                    true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.api',                'API',                     'API',                       true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.dbslugmanage',       'DB Slug 관리',            'DB Slug Manage',            true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── SYSTEM > Builder ──────────────
('common.word.builder',            '빌더',                    'Builder',                   true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.quickpagedetail',    'Quick-Page(Detail)',      'Quick Page Detail',         true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.quickpagelist',      'Quick-Page(List)',        'Quick Page List',           true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.widget',             '위젯',                    'Widget',                    true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── SYSTEM > DEMO ──────────────
('common.word.demo',               '데모',                    'Demo',                      true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.category',           '카테고리',                'Category',                  true, 'WORD', 'system', NOW(), 'system', NOW()),

-- ────────────── 컨텐츠 관리 > DEVICE & SYSTEM ──────────────
('common.word.devicesystem',       'DEVICE & SYSTEM',         'Device & System',           true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.categorymanage',     '카테고리 관리',           'Category Manage',           true, 'WORD', 'system', NOW(), 'system', NOW()),
('common.word.testboard1',         '테스트게시판1',           'Test Board 1',              true, 'WORD', 'system', NOW(), 'system', NOW())

ON CONFLICT ("key") DO NOTHING;
```

---

## STEP 2. menu.name_msg_key UPDATE

```sql
-- 기존 메뉴 항목에 name_msg_key 연결
-- id=95(페이지 관리), id=96(팝업 관리)는 이미 설정됨 → 제외

-- ────────────── 1depth 메뉴 ──────────────
UPDATE menu SET name_msg_key = 'common.word.main'           WHERE id = 1;
UPDATE menu SET name_msg_key = 'common.word.displaymanage'  WHERE id = 80;
UPDATE menu SET name_msg_key = 'common.word.contentsmanage' WHERE id = 77;
UPDATE menu SET name_msg_key = 'common.word.adminmanage'    WHERE id = 27;
UPDATE menu SET name_msg_key = 'common.word.test'           WHERE id = 35;
UPDATE menu SET name_msg_key = 'common.word.system'         WHERE id = 89;

-- ────────────── MAIN 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.dashboard'      WHERE id = 2;

-- ────────────── 관리자 관리 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.settings'       WHERE id = 28;
UPDATE menu SET name_msg_key = 'common.word.templates'      WHERE id = 8;
UPDATE menu SET name_msg_key = 'common.word.buildertest'    WHERE id = 75;

-- ────────────── Settings 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.menumanage'     WHERE id = 31;
UPDATE menu SET name_msg_key = 'common.word.usermanage'     WHERE id = 29;
UPDATE menu SET name_msg_key = 'common.word.rolemanage'     WHERE id = 70;
UPDATE menu SET name_msg_key = 'common.word.sitemanage'     WHERE id = 74;
UPDATE menu SET name_msg_key = 'common.word.codemanage'     WHERE id = 33;
UPDATE menu SET name_msg_key = 'common.word.i18nmanage'     WHERE id = 92;

-- ────────────── Templates 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.buildercontentslayout' WHERE id = 62;
UPDATE menu SET name_msg_key = 'common.word.uicomponent'           WHERE id = 9;
UPDATE menu SET name_msg_key = 'common.word.listlayout'            WHERE id = 10;
UPDATE menu SET name_msg_key = 'common.word.formlayout'            WHERE id = 12;
UPDATE menu SET name_msg_key = 'common.word.cardlayout'            WHERE id = 11;
UPDATE menu SET name_msg_key = 'common.word.dashboardlayout'       WHERE id = 13;
UPDATE menu SET name_msg_key = 'common.word.searchtemplate'        WHERE id = 14;

-- ────────────── BuilderTest 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.board1'            WHERE id = 65;
UPDATE menu SET name_msg_key = 'common.word.board2'            WHERE id = 66;
UPDATE menu SET name_msg_key = 'common.word.categorytestpage1' WHERE id = 64;
UPDATE menu SET name_msg_key = 'common.word.popuplist'         WHERE id = 94;
UPDATE menu SET name_msg_key = 'common.word.productmanage'     WHERE id = 98;
UPDATE menu SET name_msg_key = 'common.word.multiselect'       WHERE id = 97;
UPDATE menu SET name_msg_key = 'common.word.bannermanage'      WHERE id = 99;
UPDATE menu SET name_msg_key = 'common.word.tabtest'           WHERE id = 102;
UPDATE menu SET name_msg_key = 'common.word.testmenu'          WHERE id = 103;

-- ────────────── 테스트 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.componenttestlist2' WHERE id = 68;
UPDATE menu SET name_msg_key = 'common.word.componenttestpage2' WHERE id = 69;
UPDATE menu SET name_msg_key = 'common.word.quickboard1'        WHERE id = 49;
UPDATE menu SET name_msg_key = 'common.word.widgettest'         WHERE id = 54;
UPDATE menu SET name_msg_key = 'common.word.pagelayouttest'     WHERE id = 63;
UPDATE menu SET name_msg_key = 'common.word.componenttest'      WHERE id = 67;

-- ────────────── SYSTEM > Manage 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.manage'         WHERE id = 104;
UPDATE menu SET name_msg_key = 'common.word.homepagemanage' WHERE id = 105;

-- ────────────── SYSTEM > System(DB 도구) 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.dbsystem'    WHERE id = 40;
UPDATE menu SET name_msg_key = 'common.word.table'       WHERE id = 42;
UPDATE menu SET name_msg_key = 'common.word.entity'      WHERE id = 44;
UPDATE menu SET name_msg_key = 'common.word.api'         WHERE id = 55;
UPDATE menu SET name_msg_key = 'common.word.dbslugmanage' WHERE id = 57;

-- ────────────── SYSTEM > Builder 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.builder'          WHERE id = 76;
UPDATE menu SET name_msg_key = 'common.word.quickpagedetail'  WHERE id = 59;
UPDATE menu SET name_msg_key = 'common.word.quickpagelist'    WHERE id = 60;
UPDATE menu SET name_msg_key = 'common.word.widget'           WHERE id = 52;

-- ────────────── SYSTEM > DEMO 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.demo'     WHERE id = 100;
UPDATE menu SET name_msg_key = 'common.word.category' WHERE id = 101;

-- ────────────── 컨텐츠 관리 하위 ──────────────
-- common.word.market 은 기존 DB에 이미 존재 (ko: Markets, en: Markets)
UPDATE menu SET name_msg_key = 'common.word.market'        WHERE id = 79;
UPDATE menu SET name_msg_key = 'common.word.devicesystem'  WHERE id = 78;

-- ────────────── DEVICE & SYSTEM 하위 ──────────────
UPDATE menu SET name_msg_key = 'common.word.categorymanage' WHERE id = 93;
UPDATE menu SET name_msg_key = 'common.word.testboard1'     WHERE id = 90;
```

---

## 참고: 이미 등록된 메뉴 (name_msg_key 이미 존재)

| menu.id | name    | name_msg_key            |
|---------|---------|-------------------------|
| 95      | 페이지 관리 | common.word.pagemanage  |
| 96      | 팝업 관리  | common.word.popupmanage |
