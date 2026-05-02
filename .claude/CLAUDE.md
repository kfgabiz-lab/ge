# Claude Code 전역 규칙
## 작업 시작 전 룰
작업 시작하기전에 96% 확실ㄴ이 들 때까지 저에게 추가 질문 해주세요. 절대 코드 작성 금지!

## 0. ⚠️ 작업 시작 전 필수 순서 체크 (Rule 10 연결 — 매 작업마다 이 순서 확인)

> 아래 순서를 어기는 것은 절대 금지. 설명·승인 없이 다음 단계로 넘어갈 수 없다.

### 빌더 컴포넌트 (FE 전용, BE 없음)
```
STEP 1. builder-contents-layout 확인 (Rule 10-2)
         → 해당 컴포넌트 탭이 없으면 → STEP 2로
STEP 2. 퍼블리싱 — builder-contents-layout에 UI 마크업 먼저 구성 → 승인
STEP 3. FE 설계 문서 작성 (docs/pages/{기능}/fe_{기능}.md) → 승인
STEP 4. FE 개발
```

### BE 포함 작업 (API·DB 변경 있음)
```
STEP 1. builder-contents-layout 확인 (Rule 10-2)
STEP 2. 퍼블리싱 — UI 마크업 먼저 구성 → 승인
STEP 3. DB 문서 작성 (docs/db/{기능}/db_{기능}.md) → 승인
STEP 4. API 문서 작성 (docs/pages/{기능}/be_{기능}.md) → 승인
STEP 5. FE 설계 문서 작성 (docs/pages/{기능}/fe_{기능}.md) → 승인
STEP 6. 개발 (BE → FE 순)
```

### ❌ 절대 금지
- STEP 1(builder-contents-layout 확인) 없이 바로 설계 문서 작성
- 퍼블리싱 없이 바로 FE 개발
- 승인 없이 다음 STEP 진행

---

## 1. 언어
- 모든 답변은 한글로 답변

## 2. 플러그인 확인
- 작업 시작 전 **`./.plugin`** (숨김 폴더)에 pdd가 있는지 확인
- 있다면 내부 agent와 skills 활용

## 3. 개발 우선시 금지
- 어떤 식으로 진행할 건지 **우선 설명** 후 '개발해줘', '진행해줘' 등 허락이 있을 경우에만 개발 진행
- 만약 오류 화면을 캡처해서 주거나 오류 내용을 주면 **우선 증상부터 설명** 후 허락이 있을 경우에만 개발 진행

### ⚠️ 절대 금지 패턴 (아무리 요청이 단순해 보여도 예외 없음)
- ❌ "~로 바꿔줘" → 바로 코드 수정 금지
- ❌ "~추가해줘" → 바로 코드 수정 금지
- ❌ "~안나오는데?" → 바로 코드 수정 금지
- ❌ 오류/버그 제시 → 바로 코드 수정 금지

### ⚠️ 절대 올바른 순서
1. 무엇을 어떻게 변경할지 **자세한 설명** 어떤 파일을 어떤식으로 수정 할지. 
2. 해당 파일 수정시 영향도 평가 필수!!
3. 사용자가 '진행해줘', '개발해줘' 등 명시적 승인
4. 그 이후에만 코드 수정

## 4. 목적 있을 때 먼저 작업 금지
- 예를 들어 mcp 연동하여 디자인하고 있는데, 연동하지 않고 멋대로 디자인하고 연동한 척 금지

## 5. 팩트 아닌 이야기 금지
- 아닌 건 아니라고, 틀린 건 틀리다고 이야기해야 함

## 6. 모든 주석은 한글로 작성


## 7. 꼭 해당 PORT에서 열기, 타 port 실행금지
FE (Next.js): 3002
BE (API): 8002
profile : local
엣지 브라우저에서 실행!

## 8. 코딩
- 철저한 공통체계 유지
 - 공통함수 : 생성시 사용법 주석
 - 공통컴퍼넌트
 - 공통로직
- 초보자도 이해하기 쉬운 스타일
- 핵심로직만 주석으로
- 추상화의 경우 적당하고 적절한추상화
- 성능상 이슈가 없도록 해야함

| 단계 | 에이전트 파일 경로 |
|---|---|
| 01 PM (기획) | `.plugin/agent/pdd/agents/01.product-manager.md` |
| 02 Designer (디자인) | `.plugin/agent/pdd/agents/02.designer.md` |
| 03 Publisher (퍼블) | `.plugin/agent/pdd/agents/03.publisher.md` |
| 04 Service Planner (화면기획) | `.plugin/agent/pdd/agents/04.service-planner.md` |
| 05 FE Developer (FE개발) | `.plugin/agent/pdd/agents/05.fe-developer.md` |
| 06 Architect (BE설계) | `.plugin/agent/pdd/agents/06.technical-architect.md` |
| 07 BE Developer (BE개발) | `.plugin/agent/pdd/agents/07.be-developer.md` |
| 08 Verifier (검증) | `.plugin/agent/pdd/agents/08.verifier.md` |

### ⚠️ BE/FE 설계 필수 순서 (순서 위반 절대 금지)
1. **DB 문서 먼저** → `docs/db/{기능}/db_{기능}.md` 작성 후 승인
2. **API 문서 다음** → `docs/pages/{기능}/be_{기능}.md` 작성 후 승인
3. **코드는 마지막** → 문서 승인 완료 후에만 개발 진입
- ❌ DB 문서 없이 API 설계 바로 시작 금지
- ❌ 두 문서를 한 번에 섞어서 작성 금지
- ✅ 기존 DB 문서(`docs/db/` 하위) 반드시 먼저 참조하여 형식 통일

## 9. 개발가이드 꼭 지키기 - 한줄한줄 정독 필요!
- pattern: "docs/*표준.md"

## 10. 현재 프로젝트의 정확한 룰 체크 !!!!! (→ Rule 0 작업순서와 반드시 연동)
### 빌더 규칙
1. **컴포넌트 유지**
- 필드컴포넌트로 구성되어 있는 상태에서 해당 필드컴포넌트로 필드 컴포넌트를 구성한다. 
- 컨텐츠컴포넌트 / 필드컴포넌트 구성시 레이아웃 컴포넌트를 사용하여 화면을 구성한다.
- ✅ 무조건 컴포넌트에 소스를 구성하여 공통적으로 적용!
2. ⚠️ **[Rule 0 STEP 1 해당]** 필드컴포넌트 / 컨텐츠컴포넌트 UI 구성시 `/admin/templates/builder-contents-layout`에서 템플릿 구성 되어 있는지 확인
   - 없으면 → **Rule 0 STEP 2(퍼블리싱)부터 시작**. 설계·개발 바로 진입 금지!
   - ⚠️ 퍼블리싱 샘플 데이터는 반드시 `types.ts` 타입 정의와 일치해야 함 (불일치 시 타입 오류)
3. preview 모드에서 빌더미리보기/필더템플릿/운영메뉴페이지에 동일한 ui가 적용되아한다.
4. live 모드시에는 기능만 on!
5. 인라인 코딩 금지!