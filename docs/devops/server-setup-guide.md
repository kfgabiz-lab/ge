# 개발 서버 구성 가이드 (Windows Server 2025)

## 1. 전체 프로세스 구성표

| 서비스 | 역할 | 포트 | 실행 방식 |
|---|---|---|---|
| **Gitea** | 로컬 Git 저장소 | 4000 (HTTP), 2222 (SSH) | Docker |
| **Jenkins** | CI/CD 빌드 자동화 | 8000 (웹), 50000 (에이전트) | Docker |
| **Bo FE** | Next.js 어드민 프론트엔드 | 3002 | 직접 실행 |
| **Bo BE** | Spring Boot API 서버 | 8002 | 직접 실행 |
| **DocSearch FE** | 문서 검색 프론트엔드 | 3000 | Docker |
| **Elasticsearch** | 검색 엔진 | 9200 | Docker |
| **FSCrawler** | 파일 색인 크롤러 | 8080 | Docker |
| **Kibana** | Elasticsearch 시각화 | 5601 | Docker |
| **PostgreSQL** | 메인 데이터베이스 | 5432 | 직접 설치 |
| **OpenJDK 21** | Java 런타임 | - | 직접 설치 |
| **Tomcat 10** | 웹 애플리케이션 서버 | 8080 | 직접 설치 |

### Gitea 저장소 구성

| 저장소 | 대상 | URL |
|---|---|---|
| `ge-bo` | Bo FE (Next.js) | http://localhost:4000/{유저명}/ge-bo.git |
| `ge-api` | Bo BE (Spring Boot) | http://localhost:4000/{유저명}/ge-api.git |

---

## 2. 설치 순서

```
1. WSL2 활성화
2. Docker Desktop 설치
3. OpenJDK 21 설치
4. PostgreSQL 설치
5. Tomcat 10 설치
6. 폴더 생성 (C:\jenkins, C:\gitea)
7. Gitea 실행 (Docker) + 초기 설정 + 저장소 생성
8. Jenkins 실행 (Docker) + 초기 설정 + 플러그인/Tools 등록
9. 코드 push (bo → ge-bo, bo-api → ge-api)
10. Jenkins ↔ Gitea Webhook 연동
11. DocSearch 실행 (Docker Compose)
12. Bo BE 실행
13. Bo FE 실행
```

---

## 3. WSL2 활성화

PowerShell (관리자 권한)에서 실행:

```powershell
# WSL2 및 가상 머신 플랫폼 활성화
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 재부팅 후 WSL2 기본 버전 설정
wsl --set-default-version 2
```

---

## 4. Docker Desktop 설치

1. https://www.docker.com/products/docker-desktop/ 접속
2. **Windows용 Docker Desktop** 다운로드 및 설치
3. 설치 완료 후 재부팅
4. Docker Desktop 실행 → 트레이 아이콘 초록색 확인

설치 확인:
```powershell
docker --version
docker compose version
```

---

## 5. OpenJDK 21 설치

1. https://adoptium.net/ 접속
2. **Temurin 21 (LTS)** Windows x64 MSI 다운로드
3. 설치 시 `JAVA_HOME 환경변수 설정` 옵션 체크

설치 확인:
```powershell
java -version
# 출력: openjdk version "21.0.x"
```

환경변수 수동 설정 (설치 시 자동 설정 안 된 경우):
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot", "Machine")
[System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";%JAVA_HOME%\bin", "Machine")
```

---

## 6. PostgreSQL 설치

1. https://www.postgresql.org/download/windows/ 접속
2. **PostgreSQL 16** Windows 설치 파일 다운로드
3. 설치 시 설정:
   - Port: `5432`
   - 비밀번호: 프로젝트 설정과 동일하게 입력
4. pgAdmin 포함 설치 (선택)

설치 확인:
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "SELECT version();"
```

DB 생성:
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE bo;"
```

---

## 7. Tomcat 10 설치

1. https://tomcat.apache.org/download-10.cgi 접속
2. **10.1.x** Windows Service Installer 다운로드
3. 설치 시 포트 설정:
   - HTTP: `8080` (DocSearch FSCrawler와 충돌 주의 — 필요 시 변경)
4. 서비스 자동 시작 설정

서비스 제어:
```powershell
# 시작
Start-Service -Name "Tomcat10"

# 중지
Stop-Service -Name "Tomcat10"

# 상태 확인
Get-Service -Name "Tomcat10"
```

---

## 8. 폴더 생성

```powershell
# Jenkins 데이터 폴더
New-Item -ItemType Directory -Path "C:\jenkins" -Force

# Gitea 데이터 폴더
New-Item -ItemType Directory -Path "C:\gitea" -Force
```

---

## 9. Gitea 실행 (Docker)

프로젝트 루트에서 실행:

```powershell
docker compose -f docker-compose.gitea.yml up -d
```

### 초기 설정
1. `http://localhost:4000` 접속
2. 데이터베이스 유형: **SQLite3** 그대로
3. SSH 서버 포트: `22` → **`2222`** 로 변경
4. Gitea HTTP 수신 포트: `3000` 그대로
5. Gitea 기본 URL: `http://localhost:4000/` 확인
6. 사이트 제목 입력
7. 관리자 계정 생성 후 저장

### 저장소 생성 (2개)
로그인 후 `+` → `새 리포지토리`:

| 저장소명 | 설명 | 초기화 |
|---|---|---|
| `ge-bo` | Bo FE | 체크 해제 |
| `ge-api` | Bo BE | 체크 해제 |

### 코드 push

**Bo BE (bo-api):**
```bash
cd C:\{프로젝트경로}\bo-api
git init
git add .
git commit -m "init"
git remote add origin http://localhost:4000/{유저명}/ge-api.git
git push -u origin master
```

**Bo FE (bo):**
```bash
cd C:\{프로젝트경로}\bo
git init
git add .
git commit -m "init"
git remote add origin http://localhost:4000/{유저명}/ge-bo.git
git push -u origin master
```

---

## 10. Jenkins 실행 (Docker)

```powershell
docker compose -f docker-compose.jenkins.yml up -d
```

초기 비밀번호 확인 (1~2분 대기 후):
```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### 초기 설정
1. `http://localhost:8000` 접속
2. 초기 비밀번호 입력
3. **Install suggested plugins** 선택 (일부 실패해도 Continue 진행)
4. 관리자 계정 생성

### 플러그인 추가 설치
Manage Jenkins → Plugins → Available plugins:
- `NodeJS`
- `Gitea` (Webhook 연동용)

의존성 오류 발생 시:
- Manage Jenkins → 빨간 경고 → **Correct** 버튼 클릭 → 자동 해결 후 재시작

### Tools 등록
Manage Jenkins → Tools:

**JDK:**
- Name: `JDK21`
- Install automatically: **체크 해제**
- JAVA_HOME: `/opt/java/openjdk` (컨테이너 내장 JDK 사용)

**NodeJS:**
- Name: `Node22`
- Install automatically: 체크
- Version: `NodeJS 22.x.x` 선택

---

## 11. Jenkins ↔ Gitea Webhook 연동

### Gitea 설정 (저장소별)
`ge-bo`, `ge-api` 각각:
1. 저장소 → Settings → Webhooks → 웹훅 추가 → Gitea
2. 대상 URL: `http://{서버IP}:8000/gitea-webhook/post`
3. Content type: `application/json`
4. 트리거: Push 이벤트

### Jenkins Pipeline Job 생성 (2개)

**ge-api (BE) Job:**
1. 새 Item → Pipeline → 이름: `ge-api`
2. Build Triggers: `Build when a change is pushed to Gitea` 체크
3. Pipeline → Pipeline script from SCM
4. SCM: Git
5. Repository URL: `http://localhost:4000/{유저명}/ge-api.git`
6. Script Path: `Jenkinsfile`

**ge-bo (FE) Job:**
1. 새 Item → Pipeline → 이름: `ge-bo`
2. Build Triggers: `Build when a change is pushed to Gitea` 체크
3. Pipeline → Pipeline script from SCM
4. SCM: Git
5. Repository URL: `http://localhost:4000/{유저명}/ge-bo.git`
6. Script Path: `Jenkinsfile`

---

## 12. DocSearch 실행 (Docker Compose)

DocSearch 프로젝트 폴더에서:

```powershell
docker compose up -d
```

| 서비스 | 접속 URL |
|---|---|
| DocSearch FE | http://localhost:3000 |
| Elasticsearch | http://localhost:9200 |
| Kibana | http://localhost:5601 |
| FSCrawler | http://localhost:8080 |

---

## 13. Bo BE 실행

```powershell
cd C:\{프로젝트경로}\bo-api
.\gradlew.bat bootJar --no-daemon -x test
java -jar -Dspring.profiles.active=dev build\libs\*.jar
```

---

## 14. Bo FE 실행

```powershell
cd C:\{프로젝트경로}\bo
npm ci
npm run build
npm run start
```

---

## 15. 방화벽 포트 오픈 (Windows Defender)

PowerShell (관리자 권한):

```powershell
# Gitea HTTP
New-NetFirewallRule -DisplayName "Gitea HTTP" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow

# Gitea SSH
New-NetFirewallRule -DisplayName "Gitea SSH" -Direction Inbound -Protocol TCP -LocalPort 2222 -Action Allow
Action Allow

# Bo BE
New-NetFirewallRule -DisplayName "Bo BE" -Direction Inbound -Protocol TCP -LocalPort 8002 -Action Allow

# DocSearch FE
New-NetFirewallRule -DisplayName "DocSearch FE" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

# Elasticsearch
New-NetFirewallRule -DisplayName "Elasticsearch" -Direction Inbound -Protocol TCP -LocalPort 9200 -Action Allow

# Kibana
New-NetFirewallRule -DisplayName "Kibana" -Direction Inbound -Protocol TCP -LocalPort 5601 -Action Allow
```

---

## 16. 전체 프로세스 한눈에 보기

```
[개발자 PC]
    ├── git push → Gitea (4000) ge-api → Webhook → Jenkins (8000) → BE 빌드 (Gradle)
    └── git push → Gitea (4000) ge-bo  → Webhook → Jenkins (8000) → FE 빌드 (npm)

[개발 서버 실행 프로세스]
    ├── Docker
    │     ├── Gitea          :4000  (Git 저장소 — ge-bo, ge-api)
    │     ├── Jenkins        :8000  (빌드 자동화)
    │     ├── DocSearch FE   :3000  (문서 검색)
    │     ├── Elasticsearch  :9200  (검색 엔진)
    │     ├── FSCrawler      :8080  (파일 색인)
    │     └── Kibana         :5601  (ES 시각화)
    ├── 직접 실행
    │     ├── Bo FE          :3002  (Next.js 어드민)
    │     ├── Bo BE          :8002  (Spring Boot API)
    │     └── PostgreSQL     :5432  (메인 DB)
    └── 서비스
          ├── OpenJDK 21            (Java 런타임)
          └── Tomcat 10      :8080  (웹서버)
```
