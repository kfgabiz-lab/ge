---
name: rigorous-verification
description: 검증(QA/화면검증/구현완료확인) 작업에서 지켜야 할 엄격한 원칙 모음. 독립 오라클, 눈속임 완성 탐지, PASS/FAIL/UNPROVEN 판정체계, 근거 의무화, 정직성 규칙, Playwright networkidle 대기 함정을 다룬다. 참고: anthropics/skills(webapp-testing), levnikolaevich/claude-code-skills(acceptance-test-builder, delivery-reviewer)를 재구성.
---

# 엄격한 검증 원칙

QA/화면검증/구현완료확인처럼 "실제로 맞게 됐는지"를 판정하는 작업에서 대충 훑고 통과시키지 않기 위한 원칙. 검증을 수행하는 에이전트는 이 6가지를 그대로 적용한다.

## 1. 독립 오라클 원칙

기대 동작은 반드시 기획서/요구사항/스펙에서 먼저 확정한다. **검증 대상 코드나 화면을 먼저 보고, 그걸 보고 나서 "이 정도면 맞겠지"라고 기대치를 역산하지 않는다.** 순서를 지킨다: (1) 기획서/요구사항 읽고 기대 동작 확정 → (2) 그 다음에 실제 코드/화면 확인 → (3) 대조. 순서가 바뀌면 구현에 이미 맞춰진 기준으로 자기 자신을 통과시키는 오류가 생긴다.

## 2. 눈속임 완성 탐지

"됐다"는 결과가 실제로는 껍데기일 수 있다. 아래를 명시적으로 찾는다:
- `TODO`, `FIXME`, 주석 처리된 로직, "구현 예정" 문구
- 실제 API/DB 대신 mock·하드코딩된 응답으로 대체된 부분
- 에러를 잡기만 하고 아무것도 안 하는 빈 `catch`/무시된 예외
- 원래 동적이어야 할 값이 하드코딩됨
- 테스트가 실제 로직이 아니라 mock만 검증하고 있어서 항상 통과하는 경우

## 3. 판정 체계 — PASS / FAIL / UNPROVEN

이진(성공/실패)만으로는 부족하다. 검증 자체를 수행하지 못한 경우(대상 미배포, 접속 불가, 필요한 데이터 없음 등)를 **FAIL로 잘못 표기하지 않는다** — 반드시 `UNPROVEN`으로 구분하고, 왜 검증하지 못했는지와 무엇이 있으면 검증 가능한지를 함께 적는다. FAIL은 "확인했는데 틀렸다"는 뜻이고, UNPROVEN은 "확인 자체를 못 했다"는 뜻이다. 이 둘을 섞으면 안 된다.

## 4. 근거 의무화

모든 finding(이슈/불일치/누락)은 `file:line`(코드) 또는 구체적 화면 요소·스크린샷 근거 없이는 보고하지 않는다. "아마도", "대체로 맞는 것 같다", "문제없어 보인다" 같은 근거 없는 표현은 금지한다. 근거를 못 찾으면 그 항목은 `UNPROVEN`으로 남긴다.

## 5. 정직성 규칙

위임받은 검증(다른 에이전트 호출, 브라우저 접속 등)을 실제로 실행하지 못했다면 **"실행하지 못했다"고 명시한다.** 실행한 것처럼 결과를 지어내거나, 실행 안 된 항목을 통과 처리하지 않는다. 검증 패널/단계를 실제로 안 돌렸으면 돌렸다고 절대 주장하지 않는다.

## 6. Playwright `networkidle` 대기 함정

SPA(React/Next.js 등) 화면은 페이지 로드 직후 바로 DOM을 조사하거나 스크린샷을 찍으면 아직 데이터가 렌더링되기 전 상태를 "비어있음" 또는 "오류"로 오판하기 쉽다. 반드시 `page.wait_for_load_state('networkidle')` 등으로 렌더링 완료를 기다린 뒤에 조사한다. 조사 전 스크린샷이 빈 화면이면 바로 이슈로 보고하지 말고 대기 후 재확인한다.

---

참고 원본:
- [anthropics/skills — webapp-testing](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md)
- [levnikolaevich/claude-code-skills — ln-42-acceptance-test-builder](https://github.com/levnikolaevich/claude-code-skills/blob/main/plugins/testing-suite/skills/ln-42-acceptance-test-builder/SKILL.md)
- [levnikolaevich/claude-code-skills — ln-12-delivery-reviewer](https://github.com/levnikolaevich/claude-code-skills/blob/main/plugins/review-suite/skills/ln-12-delivery-reviewer/SKILL.md)
