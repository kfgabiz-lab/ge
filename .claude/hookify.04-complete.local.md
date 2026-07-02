---
name: complete-checklist
enabled: true
event: prompt
conditions:
  - field: user_prompt, operator: regex_match, pattern: "^#완료$"
action: warn
---

✅ **[완료 명령어 감지] 완료 전 최종 체크리스트**

`#완료` 처리 전 아래 항목을 확인할 것.

**빌더 관련 작업인 경우:**
- [ ] 가이드 문서(docs/ge_guide/builder/) 변경이 필요한가?
- [ ] 가이드 문서에 잘못된 부분이 있다면 무조건 개선
- [ ] 가이드 문서 변경 완료 후 /compact → 룰 재확인

**모든 작업 공통:**
- [ ] 목표로 설정한 모든 STEP이 완료됐는가?
- [ ] 사용자가 직접 테스트하고 확인했는가?
- [ ] `#완료` 이전까지 목표는 계속 상단에 표시했는가?
