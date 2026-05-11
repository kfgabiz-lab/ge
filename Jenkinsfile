pipeline {
    agent any

    // 빌드 도구 설정 (Jenkins 관리 → Tools에서 동일 이름으로 등록 필요)
    tools {
        jdk 'JDK21'
        nodejs 'Node22'
    }

    options {
        // 빌드 타임아웃 30분
        timeout(time: 30, unit: 'MINUTES')
        // 콘솔 출력 타임스탬프
        timestamps()
    }

    stages {
        // ─────────────────────────────────────
        // 소스 체크아웃
        // ─────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ─────────────────────────────────────
        // BE / FE 병렬 빌드
        // ─────────────────────────────────────
        stage('Build') {
            parallel {

                // BE: Spring Boot (Gradle)
                stage('BE Build') {
                    steps {
                        dir('bo-api') {
                            echo '=== BE 빌드 시작 ==='
                            // 실행 권한 부여 후 빌드 (테스트 제외)
                            sh 'chmod +x gradlew'
                            sh './gradlew bootJar --no-daemon -x test'
                            echo '=== BE 빌드 완료 ==='
                        }
                    }
                }

                // FE: Next.js (npm)
                stage('FE Build') {
                    steps {
                        dir('bo') {
                            echo '=== FE 빌드 시작 ==='
                            // package-lock.json 기반 정확한 의존성 설치
                            sh 'npm ci'
                            sh 'npm run build'
                            echo '=== FE 빌드 완료 ==='
                        }
                    }
                }
            }
        }
    }

    // ─────────────────────────────────────
    // 빌드 결과 후처리
    // ─────────────────────────────────────
    post {
        success {
            echo '✅ 빌드 성공!'
            echo 'BE 결과물: bo-api/build/libs/*.jar'
            echo 'FE 결과물: bo/.next/'
        }
        failure {
            echo '❌ 빌드 실패 — 콘솔 로그를 확인하세요.'
        }
        always {
            echo "브랜치: ${env.BRANCH_NAME ?: 'N/A'} | 빌드번호: #${env.BUILD_NUMBER}"
        }
    }
}
