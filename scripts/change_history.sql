-- 변경 이력 테이블 생성
CREATE TABLE change_history (
    id           BIGSERIAL       PRIMARY KEY,
    action_type  VARCHAR(10)     NOT NULL,
    method       VARCHAR(10)     NOT NULL,
    request_url  VARCHAR(500)    NOT NULL,
    request_body TEXT,
    http_status  INT             NOT NULL,
    login_user   VARCHAR(100),
    client_ip    VARCHAR(50),
    duration_ms  BIGINT,
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX IDX_CH_ACTION_TYPE ON change_history (action_type);
CREATE INDEX IDX_CH_LOGIN_USER  ON change_history (login_user);
CREATE INDEX IDX_CH_CREATED     ON change_history (created_at);
