# BO API (백오피스 API 서버)

## 기술 스택
- **Spring Boot** 3.4.3
- **Java** 21
- **PostgreSQL** (`localhost:5432/bo`)
- **Gradle** 8.12

---

## 🚀 개발 환경 실행 방법

### 사전 요구사항
- Java 21 이상 설치
- PostgreSQL 실행 중 (`localhost:5432/bo`, postgres/1234)

### IntelliJ IDEA (권장)
1. IntelliJ IDEA에서 `bo-api/` 폴더를 **Open As Gradle Project**로 열기
2. Gradle 의존성 자동 다운로드 대기
3. `BoApplication.java` → 우클릭 → **Run 'BoApplication'**
4. `http://localhost:8080/api/v1/health` 에서 API 동작 확인

### 명령어 (Gradle 설치 후)
```bash
cd bo-api
./gradlew bootRun
```

---

## 📁 프로젝트 구조
```
src/main/java/com/ge/bo/
├── config/          # SecurityConfig, WebMvcConfig
├── controller/      # REST API 컨트롤러
├── service/         # 비즈니스 로직
├── repository/      # JPA Repository
├── entity/          # DB 테이블 매핑 Entity
├── dto/             # Request/Response DTO
│   ├── request/
│   └── response/
├── security/        # JWT 인증 관련
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
├── exception/       # 전역 예외 처리
│   ├── BusinessException.java
│   └── GlobalExceptionHandler.java
└── BoApplication.java
```

---

## 🔗 연동 API 목록
자세한 API 명세는 `docs/03-architect/system_architecture.md` 참조
