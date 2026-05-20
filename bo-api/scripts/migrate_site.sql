-- ============================================================
-- 홈페이지(Site) 관리 마이그레이션
-- 실행 전 반드시 백업 권장
-- ============================================================

-- 1. 기본 홈페이지 데이터 INSERT (site 테이블은 JPA ddl-auto가 자동 생성)
INSERT INTO site (name, description, is_active, created_by, created_at, updated_by, updated_at)
VALUES ('북미홈페이지', '북미홈페이지 관리', true, 'system', now(), 'system', now());

-- 2. menu 테이블 site_id 추가
ALTER TABLE menu ADD COLUMN IF NOT EXISTS site_id BIGINT REFERENCES site(id);
UPDATE menu SET site_id = 1 WHERE site_id IS NULL;
ALTER TABLE menu ALTER COLUMN site_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS menu_site_id_idx ON menu (site_id);

-- 3. code_group 테이블 site_id 추가 + unique 변경
ALTER TABLE code_group ADD COLUMN IF NOT EXISTS site_id BIGINT REFERENCES site(id);
UPDATE code_group SET site_id = 1 WHERE site_id IS NULL;
ALTER TABLE code_group ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE code_group DROP CONSTRAINT IF EXISTS code_group_group_code_key;
ALTER TABLE code_group ADD CONSTRAINT IF NOT EXISTS code_group_site_id_group_code_key UNIQUE (site_id, group_code);
CREATE INDEX IF NOT EXISTS code_group_site_id_idx ON code_group (site_id);

-- 4. page_data 테이블 site_id 추가
ALTER TABLE page_data ADD COLUMN IF NOT EXISTS site_id BIGINT REFERENCES site(id);
UPDATE page_data SET site_id = 1 WHERE site_id IS NULL;
ALTER TABLE page_data ALTER COLUMN site_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS page_data_site_id_idx ON page_data (site_id);

-- 5. page_template 테이블 site_id 추가
ALTER TABLE page_template ADD COLUMN IF NOT EXISTS site_id BIGINT REFERENCES site(id);
UPDATE page_template SET site_id = 1 WHERE site_id IS NULL;
ALTER TABLE page_template ALTER COLUMN site_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS page_template_site_id_idx ON page_template (site_id);
