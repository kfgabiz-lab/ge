---
name: classify-cmd-checklist
enabled: true
event: prompt
conditions:
  - field: user_prompt, operator: regex_match, pattern: "#빌더기능개발|#빌더기능개선|#빌더오류수정|#화면개발|#화면수정"
action: warn
---

⚠️ **[분류 명령어 감지] 목표설정 단계 체크리스트**

아래 순서를 반드시 지킬 것. 승인 없이 다음 단계 진행 금지.

**#빌더기능개발 / #빌더기능개선 / #빌더오류수정 인 경우:**
1. builder-contents-layout 확인 → 없으면 퍼블리싱부터
2. bo-orchestrator + Explore 동시 분석 → 합쳐서 제안
3. 에이전트·사용자 이해율 각각 80% 이상 달성 확인
4. 기존 공통 구조/컴포넌트 재활용 여부 명확히 설명
5. 영향도 평가 필수
6. STEP별 목표 제시 → 조용히 대기

**#화면개발 / #화면수정 인 경우:**
1. bo-orchestrator + Explore 동시 분석 → 합쳐서 제안
2. 에이전트·사용자 이해율 각각 80% 이상 달성 확인
3. 기존 어드민 페이지 공통 구조/컴포넌트 먼저 확인
4. 어떤 부분 재활용, 어떤 부분 신규 생성인지 명확히 설명
5. 영향도 평가 필수
6. STEP별 목표 제시 → 조용히 대기

❌ 목표 합의 전 개발 금지 / 개발 진행 유도 문구 금지 / 목표 재설정 없이 임의 변경 금지
