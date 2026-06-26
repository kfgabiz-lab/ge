# Bo API — 초기 DB 스크립트

> DB: PostgreSQL  
> 대상 스키마: public  
> 작성일: 2026-06-26

---

## slug_relation 테이블

슬러그 간 데이터 관계를 설정하는 메타데이터 테이블.  
- **FILTER**: slave 조건으로 master 목록을 필터링  
- **FETCH**: master 조회 시 관련 slave 데이터를 자동 병합

---

### DDL

```sql
CREATE TABLE slug_relation (
    id              BIGSERIAL       PRIMARY KEY,
    master_slug     VARCHAR(200)    NOT NULL,                   -- 기준 슬러그 (조회 대상)
    slave_slug      VARCHAR(200)    NOT NULL,                   -- 관계 슬러그 (필터링/fetch 기준)
    master_key      VARCHAR(200)    NOT NULL DEFAULT 'id',      -- master에서 비교할 필드 경로 (예: id, rel.product-data)
    slave_key       VARCHAR(200)    NOT NULL,                   -- slave에서 master를 참조하는 필드 경로 (예: product.id)
    join_type       VARCHAR(30)     NOT NULL DEFAULT 'EQ',      -- EQ: 단순 동등 / ARRAY_CONTAINS: 배열 포함
    slave_filter    VARCHAR(200)    NULL,                       -- slave 조회 시 고정 조건 (예: depth=3), null이면 조건 없음
    relation_dir    VARCHAR(20)     NOT NULL DEFAULT 'FILTER',  -- FILTER: slave→master 필터링 / FETCH: master 조회 시 slave 포함
    fetch_fields    VARCHAR(500)    NULL,                       -- FETCH 방향 시 표시할 slave 필드 경로 (예: product.title)
    fetch_separator VARCHAR(10)     NOT NULL DEFAULT ',',       -- FETCH 결과 구분자
    slave_type      VARCHAR(20)     NOT NULL DEFAULT 'TABLE',   -- TABLE: slave에서 직접 추출 / CATEGORY: 상위 계층 거슬러 추출
    category_depth  INT             NOT NULL DEFAULT 1,         -- CATEGORY 타입 전용, 표시할 계층 수 (1~5)
    description     TEXT            NULL,                       -- 관계 설명
    created_by      VARCHAR(50)     NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL,
    updated_by      VARCHAR(50)     NOT NULL,
    updated_at      TIMESTAMPTZ     NOT NULL
);

-- 인덱스
CREATE INDEX idx_slug_relation_master ON slug_relation (master_slug);
CREATE INDEX idx_slug_relation_slave  ON slug_relation (slave_slug);
```

---

### 샘플 INSERT 데이터

#### 케이스 1 — FILTER / TABLE  
> 카테고리 슬러그(slave)를 기준으로 제품 슬러그(master)를 필터링

```sql
INSERT INTO slug_relation (
    master_slug, slave_slug, master_key, slave_key,
    join_type, slave_filter, relation_dir,
    fetch_fields, fetch_separator, slave_type, category_depth,
    description, created_by, created_at, updated_by, updated_at
) VALUES (
    'product-data',         -- master: 제품 데이터 슬러그
    'category-data',        -- slave: 카테고리 데이터 슬러그
    'id',                   -- master에서 비교할 필드 (PK)
    'product.id',           -- slave의 product 참조 필드
    'EQ',                   -- 단순 동등 비교
    NULL,                   -- slave 고정 조건 없음
    'FILTER',               -- slave 조건으로 master 필터링
    NULL,                   -- FILTER 방향이므로 fetch_fields 불필요
    ',',
    'TABLE',
    1,
    '카테고리 선택 시 해당 카테고리의 제품만 목록에 표시',
    'admin',
    NOW(),
    'admin',
    NOW()
);
```

---

#### 케이스 2 — FETCH / TABLE (fetch_fields 지정)  
> 제품 슬러그 조회 시 관련 브랜드 슬러그에서 이름 필드를 자동 병합

```sql
INSERT INTO slug_relation (
    master_slug, slave_slug, master_key, slave_key,
    join_type, slave_filter, relation_dir,
    fetch_fields, fetch_separator, slave_type, category_depth,
    description, created_by, created_at, updated_by, updated_at
) VALUES (
    'product-data',         -- master: 제품 데이터 슬러그
    'brand-data',           -- slave: 브랜드 데이터 슬러그
    'rel.brand-data',       -- master의 브랜드 참조 필드 경로
    'id',                   -- slave PK
    'EQ',
    NULL,
    'FETCH',                -- master 조회 시 slave 데이터 병합
    'form1.brand_name',     -- slave에서 가져올 필드 경로
    ',',
    'TABLE',
    1,
    '제품 목록 조회 시 브랜드명을 _fetchedRel{id} 키로 자동 병합',
    'admin',
    NOW(),
    'admin',
    NOW()
);
```

---

#### 케이스 3 — FETCH / CATEGORY (계층 거슬러 추출)  
> 제품 슬러그 조회 시 카테고리 계층을 거슬러 올라가 상위 2단계 이름을 병합

```sql
INSERT INTO slug_relation (
    master_slug, slave_slug, master_key, slave_key,
    join_type, slave_filter, relation_dir,
    fetch_fields, fetch_separator, slave_type, category_depth,
    description, created_by, created_at, updated_by, updated_at
) VALUES (
    'product-data',         -- master: 제품 데이터 슬러그
    'category-data',        -- slave: 카테고리 데이터 슬러그
    'rel.category-data',    -- master의 카테고리 참조 필드 경로
    'id',                   -- slave PK
    'EQ',
    'depth=3',              -- slave 고정 조건: depth=3인 카테고리만 대상
    'FETCH',
    NULL,                   -- fetch_fields 없으면 depth에 해당하는 레코드 전체 반환
    ' > ',                  -- 계층 구분자 (예: "가전 > 생활가전")
    'CATEGORY',             -- 상위 계층 거슬러 추출
    2,                      -- 최상위로부터 2단계 수집 (대분류 > 중분류)
    '제품 조회 시 카테고리 계층을 거슬러 올라가 "대분류 > 중분류" 형태로 병합',
    'admin',
    NOW(),
    'admin',
    NOW()
);
```

---

### 컬럼 값 허용 범위

| 컬럼 | 허용 값 | 기본값 |
|------|---------|--------|
| `join_type` | `EQ`, `ARRAY_CONTAINS` | `EQ` |
| `relation_dir` | `FILTER`, `FETCH` | `FILTER` |
| `slave_type` | `TABLE`, `CATEGORY` | `TABLE` |
| `category_depth` | `1` ~ `5` | `1` |
