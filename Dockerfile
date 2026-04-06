# ─────────────────────────────────────────
# Stage 1: 빌드 단계
# ─────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradle 래퍼 및 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 의존성 먼저 다운로드 (캐시 활용)
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon 2>/dev/null || true

# 소스코드 복사 후 빌드
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# ─────────────────────────────────────────
# Stage 2: 실행 단계 (JRE만 포함 — 이미지 경량화)
# ─────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 빌드 결과물만 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 포트 오픈
EXPOSE 8002

# dev 프로파일로 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "app.jar"]
