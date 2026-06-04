# 서버 환경 프로파일 구성 가이드

> 작성일: 2026-06-04 / 최종 수정: 2026-06-04  
> 대상: 개발마스터, 개발자, 인프라/배포 담당자  
> 적용 범위: `bo-api` (Spring Boot) — `application-*.yml` 파일

---

## 0. 환경 구성 개요

3개의 환경을 Spring Profile로 완전 분리하여 관리한다.

| # | 환경명 | Profile | 실행 위치 | DB | Git Remote | 목적 |
|---|---|---|---|---|---|---|
| 1 | **개발마스터** | `local` | 로컬 PC | 로컬 DB (localhost:5432) | `ge` | 공통 개발 결과물을 개발자에게 공유 |
| 2 | **개발자** | `developer` | 로컬 PC | 개발 서버 DB (10.153.11.120) | `ge-bo`, `ge-api` | 개발자 개인 작업 환경 |
| 3 | **개발서버** | `dev` | 개발 서버 | 개발 서버 DB (10.153.11.120) | — | 개발 서버 배포 전용 |

---

## 1. 파일 구조

```
bo-api/src/main/resources/
├── application.yml            ← 공통 설정 + 실행 환경 선택 (★ 개발자가 여기서 profile 지정)
├── application-local.yml      ← 환경 1: 개발마스터 (local DB)
├── application-developer.yml  ← 환경 2: 개발자 (개발서버 DB, 로컬 실행)
└── application-dev.yml        ← 환경 3: 개발서버 배포 전용
```

> **규칙**: 환경 간 중복 설정은 `application.yml` 공통에만 작성한다.  
> 각 환경 yml은 해당 환경에서만 달라지는 설정만 포함한다.

---

## 2. ★ 프로파일 활성화 방법 — application.yml 직접 수정

`application.yml` 상단의 `spring.profiles.active` 값을 본인 환경에 맞게 **한 줄만** 변경한다.  
IntelliJ 설정, 환경변수, 커맨드라인 인수 사용 불필요.

```yaml
# bo-api/src/main/resources/application.yml

spring:
  profiles:
    active: local   # ★ 실행 환경 선택 — local / developer / dev
```

| 환경 | 변경 값 | 대상 파일 |
|---|---|---|
| 개발마스터 | `active: local` | application-local.yml 활성화 |
| 개발자 | `active: developer` | application-developer.yml 활성화 |
| 개발서버 | `active: dev` | application-dev.yml 활성화 |

### ⚠️ git 커밋 시 주의

`application.yml`은 **항상 `active: local` 상태로 git에 커밋**한다.  
개발자가 `developer`로 변경한 채 push하면 다른 팀원이 pull 후 불필요한 수정이 발생한다.

```
✅ git에 커밋할 상태:  active: local
❌ 커밋 금지:           active: developer  (개인 설정 — local 로 되돌린 후 커밋)
❌ 커밋 금지:           active: dev        (개발서버 배포 시에만 임시 변경)
```

---

## 3. application.yml — 공통 설정

> 모든 환경에서 공유하는 불변 설정. 개발자가 `active` 한 줄 외에는 수정하지 않는다.

```yaml
totp:
  issuer: "LSE Admin"

spring:
  profiles:
    active: local   # ★ 실행 환경 선택 — local / developer / dev
  main:
    allow-bean-definition-overriding: true
  jackson:
    serialization:
      write-dates-as-timestamps: false   # LocalDateTime → ISO-8601 문자열 직렬화
  servlet:
    multipart:
      max-file-size: 50MB                # 파일 1개 최대 크기
      max-request-size: 200MB            # 요청 전체 최대 크기
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8080

# JWT 설정
app:
  jwt:
    secret: "bo-backoffice-ge-america-secret-key-256bit-secure-2026"
    expiration: 3600           # 1시간 (초)
    refresh-expiration: 604800 # 7일 (초)

# 로깅 기본 수준 (각 환경 yml에서 override 가능)
logging:
  level:
    root: WARN
    com.ge.bo: INFO
```

> **불변 설정 목록**: port, JWT, multipart, jackson, jpa.database-platform  
> **환경별 설정 목록**: datasource, ddl-auto, show-sql, cors, file 경로, logging 수준

---

## 4. application-local.yml — 환경 1: 개발마스터

> 개발마스터가 로컬 PC에서 실행. 로컬 DB 사용.  
> Git Remote: `ge`

```yaml
# 환경 1: 개발마스터 — 로컬 PC + 로컬 DB
recaptcha:
  secret-key: "6LfNdAYtAAAAAIhC2g663sKwYXo_mFrUCTAg8h_5"

spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/bo
    username: postgres
    password: "1234"
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update   # 로컬 DB — 스키마 자동 반영
    properties:
      hibernate:
        format_sql: true

# CORS — 로컬 FE 주소
cors:
  allowed-origins: "http://localhost:3002,http://localhost:3001"

# 파일 경로
file:
  upload-root: "/uploads"

page-template:
  output-dir: "../bo/src/app/admin/generated"

# 로컬 전용 상세 로그 (운영 환경 노출 금지 — PII 보안)
logging:
  level:
    com.ge.bo: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
    org.springframework.transaction: TRACE
    org.springframework.orm.jpa: DEBUG
```

---

## 5. application-developer.yml — 환경 2: 개발자

> 개발자가 각자 로컬 PC에서 실행. 공용 개발 서버 DB(10.153.11.120) 사용.  
> Git Remote: `ge-bo` (FE), `ge-api` (BE)

```yaml
# 환경 2: 개발자 — 로컬 PC + 공용 개발서버 DB
recaptcha:
  secret-key: "6LfNdAYtAAAAAIhC2g663sKwYXo_mFrUCTAg8h_5"

spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://10.153.11.120:5432/postgres
    username: lsedbadmin
    password: lsis@2026!@#
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update   # 개발 단계 — 스키마 자동 반영
    properties:
      hibernate:
        format_sql: true

# CORS — 로컬 FE 주소 (각자 로컬에서 FE 실행)
cors:
  allowed-origins: "http://localhost:3002,http://localhost:3001"

# 파일 경로
file:
  upload-root: "/uploads"

page-template:
  output-dir: "../bo/src/app/admin/generated"

# 개발자 디버깅용 상세 로그
logging:
  level:
    com.ge.bo: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
    org.springframework.transaction: TRACE
    org.springframework.orm.jpa: DEBUG
```

> **개발자 환경 vs 개발마스터 환경 차이점**
>
> | 항목 | 개발마스터 (`local`) | 개발자 (`developer`) |
> |---|---|---|
> | DB Host | localhost:5432 | 10.153.11.120:5432 |
> | DB명 | `bo` | `postgres` |
> | DB 계정 | `postgres` / `1234` | `lsedbadmin` / `lsis@2026!@#` |
> | CORS | localhost | localhost (동일) |
> | ddl-auto | update | update (동일) |
> | 로그 수준 | DEBUG | DEBUG (동일) |

---

## 6. application-dev.yml — 환경 3: 개발서버 배포

> 개발 서버에 배포 후 실행되는 환경. 상세 로그 불필요.

```yaml
# 환경 3: 개발서버 배포 전용
recaptcha:
  secret-key: "6LfNdAYtAAAAAIhC2g663sKwYXo_mFrUCTAg8h_5"

spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://10.153.11.120:5432/postgres
    username: lsedbadmin
    password: lsis@2026!@#
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate   # 배포 환경 — 스키마 자동 변경 차단

# CORS — 개발서버 FE 주소
cors:
  allowed-origins: "http://10.153.10.150:3002,http://10.153.10.150:3001,http://10.153.9.150"

# 파일 경로
file:
  upload-root: "/uploads"

page-template:
  output-dir: "../bo/src/app/admin/generated"

# 배포 환경 — WARN 수준만 출력
logging:
  level:
    root: WARN
    com.ge.bo: WARN
```

---

## 7. 환경별 설정 비교표

| 항목 | local (개발마스터) | developer (개발자) | dev (개발서버) |
|---|---|---|---|
| **실행 위치** | 로컬 PC | 로컬 PC | 개발 서버 |
| **DB Host** | localhost:5432 | 10.153.11.120:5432 | 10.153.11.120:5432 |
| **DB명** | bo | postgres | postgres |
| **ddl-auto** | update | update | validate |
| **show-sql** | true | true | false |
| **CORS** | localhost | localhost | 개발서버 IP |
| **로그 수준** | DEBUG | DEBUG | WARN |
| **Git Remote** | ge | ge-bo / ge-api | — |

---

## 8. Git Remote 연계 전략

```
환경 1 (local) — 개발마스터
  remote: ge / 브랜치: master
  목적: 공통 개발 기능 완료 후 공유용 push
  application.yml active: local 상태로 커밋 유지

환경 2 (developer) — 개발자
  remote: ge-bo (FE), ge-api (BE) / 브랜치: 개인 feature 브랜치
  목적: 개발자 개인 작업, 개발 DB 바라보며 실제 데이터 검증
  application.yml active: developer → 작업 후 local로 되돌려 커밋

환경 3 (dev) — 개발서버
  목적: ge remote로부터 받은 결과물을 서버에 배포 후 실행
  application.yml active: dev → 배포 완료 후 local로 되돌려 커밋
```

---

## 9. 주의사항

### application.yml git 커밋 규칙

`application.yml`의 `spring.profiles.active`는 **`local`로 유지**하여 커밋한다.  
개발자가 `developer` 또는 `dev`로 변경한 상태로 push하면 팀 전체에 영향이 생긴다.

```bash
# 커밋 전 확인
git diff bo-api/src/main/resources/application.yml
# active: local 인지 반드시 확인 후 커밋
```

### DB 연결 보안

- `application-developer.yml`, `application-dev.yml`의 DB 비밀번호는  
  외부에 노출되지 않도록 `.gitignore`에 해당 파일이 포함되어 있는지 확인한다.
- 운영 환경 추가 시 비밀번호는 환경변수(`${DB_PASSWORD}`)로 주입하는 것을 권장한다.

### ddl-auto validate 주의 (dev 환경)

- `dev` 환경은 `ddl-auto: validate`이므로 **Entity 변경 후 배포 전 DB 스키마를 먼저 반영**해야 한다.
- 스키마 미반영 상태로 배포하면 서버 기동 실패.
- 스키마 변경 시 순서: `DB ALTER 실행 → application.yml active: dev 변경 → 빌드/배포 → active: local 복원 커밋`

### show-sql 주의

- `developer` 환경은 개발 서버 DB를 바라보므로 SQL 로그가 과도하게 출력될 수 있다.  
  필요 시 `org.hibernate.SQL: INFO`로 낮춰서 사용할 수 있다.

---

## 10. 추후 운영 환경 추가 시

운영 환경(`prod`)이 필요할 경우 아래 파일을 추가한다.

```
application-prod.yml
  - DB: 운영 DB 정보 (환경변수로 주입 권장)
  - show-sql: false
  - ddl-auto: validate (update 절대 금지)
  - logging: WARN 이상
  - CORS: 운영 도메인만 허용
```

> `ddl-auto: update`는 **운영 환경에서 절대 사용 금지**.  
> 운영은 반드시 `validate` 또는 `none`으로 설정하고 DB 마이그레이션은 별도 스크립트로 관리한다.
