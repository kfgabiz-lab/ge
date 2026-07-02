---
name: no-guide-prompt
enabled: true
event: stop
conditions:
  - field: transcript, operator: regex_match, pattern: "진행할까요|수정할까요|맞습니까|확인해주세요|승인해주시면|진행 하시겠습니까|해드릴까요"
action: block
---

🚫 **[유도 문구 차단] CLAUDE.md 절대 금지 패턴 위반**

AI 응답에 유도 문구가 포함되어 있습니다.

**절대 금지 문구:**
- "진행할까요?" / "수정할까요?" / "맞습니까?" / "확인해주세요" / "승인해주시면 작성하겠습니다"

**올바른 행동:**
- 설명 후 → 조용히 대기
- 사용자가 `#개발` / `#진행` / `#수정` 입력할 때까지 대기
- 재확인·선택 질문 일절 금지
