# Admin User DB 상세 설계서

## 1. 개요
관리자 계정 정보를 저장하고 상태를 관리하기 위한 데이터베이스 설계입니다. 기존 `admin_user` 테이블에 계정 활성화 여부(`is_active`) 필드를 추가하여 보안 및 관리 기능을 강화합니다.

## 2. 테이블 정의: `admin_user`

| 컬럼명 | 논리명 | 타입 | Nullable | PK/FK | 기본값 | 설명 |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | 식별자 | BIGINT | N | PK | | AI (Auto Increment) |
| `employee_id` | 사번 | VARCHAR(50) | Y | UK | | 고유 사원 번호,로그인 아이디로 사용 |
| `email` | 이메일 | VARCHAR(100) | N |  | | 이메일 |
| `name` | 성명 | VARCHAR(50) | N | | | 관리자 실명 |
| `dept_name` | 부서명| VARCHAR(50) | N | | | 부서명 |
| `password_hash` | 비밀번호해시 | VARCHAR(255) | N | | | 암호화된 비밀번호 |
| `role` | 권한그룹 | VARCHAR(20) | N | | |  |
| `is_active` | 활성화여부 | TINYINT(1) | N | | 1 | 1: 활성, 0: 잠김 |
| `last_login_at` | 마지막로그인 | DATETIME | Y | | | 마wl막 접속 일시 |
| `created_at` | 등록일시 | DATETIME | N | | CURRENT_TIMESTAMP | 생성일시 |
| `updated_at` | 수정일시 | DATETIME | N | | CURRENT_TIMESTAMP | 최종 수정일시 |
| `reg_dt` | 등록일 | CHAR(8) | N | | | 생성일 (yyyymmdd) |
| `reg_tm` | 등록시간 | CHAR(6) | N | | | 생성시간 (hhmmss) |

## 3. 인덱스 설계
- **PK**: `id`
- **UK_ADMIN_USER_EMP_ID**: `employee_id` (고유성 보장)
- **IDX_ADMIN_USER_ROLE**: `role` (권한별 필터링 최적화)

## 4. 제약 사항
- `email`과 `employee_id`는 중복될 수 없음.
- `is_active`가 0인 경우 해당 계정은 로그인이 불가능해야 함 (Spring Security 연동 필요).
- `created_at`과 `updated_at`은 JPA Auditing을 통해 자동 관리.
