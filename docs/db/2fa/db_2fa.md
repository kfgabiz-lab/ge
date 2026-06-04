# 2FA TOTP DB 설계서

## 1. 개요

로그인 2차 인증(TOTP — Time-based One-Time Password) 기능을 위한 DB 변경 설계입니다.
기존 `admin_user` 테이블에 TOTP 관련 컬럼 3개를 추가합니다.
Google Authenticator / Microsoft Authenticator 모두 지원합니다.

## 2. 변경 테이블: `admin_user`

### 2-1. 추가 컬럼

| 컬럼명 | 논리명 | 타입 | Nullable | 기본값 | 설명 |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `totp_secret` | TOTP 비밀키 | TEXT | Y | NULL | TOTP 비밀키 (Base32 인코딩) |
| `is_totp_enabled` | 2FA 활성화여부 | BOOLEAN | N | FALSE | TRUE: 2FA 등록 완료, FALSE: 미등록 |

### 2-2. 기존 전체 컬럼 (변경 후)

| 컬럼명 | 논리명 | 타입 | Nullable | PK/FK | 기본값 | 설명 |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | 식별자 | BIGINT | N | PK | | AUTO INCREMENT |
| `email` | 이메일 | VARCHAR(100) | N | UK | | 로그인 아이디 |
| `name` | 성명 | VARCHAR(50) | N | | | 관리자 실명 |
| `password_hash` | 비밀번호해시 | VARCHAR(255) | N | | | BCrypt 암호화 |
| `role_code` | 권한코드 | VARCHAR(20) | N | | | 역할 코드 |
| `dept_code` | 부서코드 | VARCHAR(50) | Y | | | |
| `dept_name` | 부서명 | VARCHAR(100) | Y | | | |
| `remark` | 비고 | VARCHAR(500) | Y | | | |
| `last_login_at` | 마지막로그인 | TIMESTAMPTZ | Y | | | |
| `is_active` | 활성화여부 | BOOLEAN | N | | TRUE | |
| `failed_login_attempts` | 로그인실패횟수 | INTEGER | N | | 0 | |
| `locked_until` | 잠금해제시각 | TIMESTAMPTZ | Y | | | |
| **`totp_secret`** | **TOTP 비밀키** | **TEXT** | **Y** | | **NULL** | **신규** |
| **`is_totp_enabled`** | **2FA 활성화** | **BOOLEAN** | **N** | | **FALSE** | **신규** |
| `created_at` | 등록일시 | TIMESTAMPTZ | N | | | JPA Auditing |
| `updated_at` | 수정일시 | TIMESTAMPTZ | N | | | JPA Auditing |
| `reg_date` | 등록일 | DATE | N | | | KST 기준 |
| `reg_time` | 등록시간 | TIME | N | | | KST 기준 |

## 3. 마이그레이션 SQL

```sql
-- 2FA TOTP 컬럼 추가
ALTER TABLE admin_user
  ADD COLUMN totp_secret      TEXT    DEFAULT NULL,
  ADD COLUMN is_totp_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN recovery_codes   TEXT    DEFAULT NULL;

-- 복구코드 제거 (2차 인증 단순화 정책 적용)
ALTER TABLE admin_user DROP COLUMN recovery_codes;
```

## 4. 데이터 구조 상세

### 4-1. totp_secret
- TOTP 라이브러리(`dev.samstevens.totp`)가 생성한 Base32 인코딩 비밀키
- 길이: 약 32자 (Base32 인코딩 기준)
- **보안**: 평문 저장 (QR 코드 생성 시 필요하므로 복호화 가능해야 함, 추후 AES 암호화 적용 가능)

## 5. 인덱스 변경
- 추가 인덱스 없음 (2FA 조회는 이메일 기반으로 기존 UK 인덱스 활용)

## 6. 제약 사항
- `is_totp_enabled = TRUE`이면 `totp_secret`은 반드시 NOT NULL
- `is_totp_enabled = FALSE`인 경우 로그인 시 QR 등록 강제 진행
