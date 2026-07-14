# Bo 형상관리(Git) 가이드

> 버전: v1.1
> 작성일: 2026-06-09 (최종 갱신 2026-07-13)
> 대상: Bo 프로젝트에서 git push·커밋·브랜치를 다루는 모든 개발자 및 에이전트
> 관련 파일: `.gitignore`, `bo/`, `bo-api/`, `fo/`, `ls-publish/`

---

## 1. 리포지토리 구조

Bo 프로젝트는 **단일 monorepo**(`C:\...\workspace\Bo`)에서 관리되며,
하위 디렉토리별로 참고용 GitHub 리포지토리를 별도로 두고 있다(실제 git subtree 병합은 아님, 1절 리모트 목록 참고).
`ls-publish/`는 별도 리모트 없이 루트(`ge`)에 직접 편입된 일반 디렉토리다 — bo/bo-api/fo와 달리 참고용 리모트를 두지 않는다.

```
workspace/Bo/          ← 루트 monorepo (ge 리모트)
├── bo/                ← BO 프론트 (ge-bo 참고용 리모트)
├── bo-api/            ← BE API   (ge-api 참고용 리모트)
├── fo/                ← FO 프론트 (ge-fo 참고용 리모트)
├── ls-publish/        ← FO 이관 전 레거시 원본 사이트 (ge에 직접 편입, 별도 리모트 없음)
└── docs/              ← 공통 문서
```

### 리모트 목록

| 리모트명 | GitHub URL | 대상 | 비고 |
|---------|-----------|------|------|
| `ge` | https://github.com/kfgabiz-lab/ge | 루트 전체 | 전체 monorepo |
| `ge-bo` | https://github.com/kfgabiz-lab/ge-bo | `bo/` | 참고용 리모트 — 실제 subtree 병합 아님, 필요 시 수동 비교·반영 |
| `ge-api` | https://github.com/kfgabiz-lab/ge-api | `bo-api/` | 참고용 리모트 — 실제 subtree 병합 아님, 필요 시 수동 비교·반영 |
| `ge-fo` | https://github.com/kfgabiz-lab/ge-fo | `fo/` | 참고용 리모트 — 실제 subtree 병합 아님, 필요 시 수동 비교·반영 |

> 리모트 확인 명령어: `git remote -v`
> `ls-publish/`는 FO 이관 전 레거시 원본 사이트로, fo/ 작업 시 비교 참고용으로 사용한다. `ge`에 직접 편입되어 있어 루트와 함께 `git push/pull ge master`로 다뤄진다(별도 리모트 없음). 자체 `node_modules`는 git 추적 대상이 아니므로, 해당 폴더에서 개발서버를 띄우려면 `npm install`을 먼저 실행해야 한다.

---

## 2. 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `master` | 개발 통합 브랜치 (로컬 개발 기준) |
| `main` | 운영 배포 브랜치 |

- 기능 개발은 `master`에서 진행
- 운영 반영 시 `master` → `main` 머지

---

## 3. 커밋 메시지 규칙

```
<타입>: <한글 요약 (50자 이내)>
```

### 타입 목록

| 타입 | 용도 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 빌드·설정·문서 등 기타 변경 |
| `refactor` | 기능 변경 없는 코드 정리 |
| `style` | 포맷·공백 등 스타일만 변경 |
| `docs` | 문서만 변경 |

### 예시

```
feat: yearMonth/yearMonthRange 필드컴포넌트 추가
fix: TableBuilder 컬럼 추가 버그 수정 (headerMsgKey 미처리)
chore: application-local.yml DB 접속 정보 업데이트
```

---

## 4. Push 절차

### 4-1. 커밋 전 확인 사항

push 전 반드시 아래 항목 확인:

```bash
git status        # 변경 파일 목록 확인
git diff --stat   # 변경 요약
```

### 4-2. 커밋

```bash
# 1. 루트 커밋 (전체 변경 포함)
git add <파일 목록>
git commit -m "feat: 설명"
```

> `.claude/settings.local.json`, `page copy.tsx` 등 아래 "제외 목록" 파일은 `git add` 시 포함하지 않는다.

### 4-3. Push 순서

**순서를 지켜 push**한다. 루트 → 서브트리 순.

#### ① 루트 전체 push (ge)

```bash
git push ge master
```

#### ② BO 프론트 서브트리 push (ge-bo)

```bash
git subtree push --prefix=bo ge-bo master
```

#### ③ BE API 서브트리 push (ge-api)

```bash
git subtree push --prefix=bo-api ge-api master
```

#### ④ FO 프론트 서브트리 push (ge-fo)

```bash
git subtree push --prefix=fo ge-fo master
```

> `git subtree push`는 해당 prefix 디렉토리의 변경만 추출하여 서브트리 리포지토리로 push한다.
> 서브트리 리포지토리에서 직접 pull 받는 팀원이 있을 경우 반드시 실행한다.
> `ls-publish/`는 별도 리모트 없이 `ge`에 직접 편입되어 있으므로, ①(루트 push)에 함께 포함되어 push된다 — 별도 서브트리 push 불필요.

---

## 5. Pull 절차

일반적인 개발 작업에서는 **`ge` 한 곳만 pull 받으면 충분**하다.

```bash
git pull ge master
```

`ge-bo`, `ge-api`, `ge-fo`는 각 서브 디렉토리(`bo/`, `bo-api/`, `fo/`)의 원본 소스를 참고하기 위한 리모트이며, 실제 git subtree 병합이 아니라 필요할 때 수동으로 내용을 비교한 뒤 커밋하는 방식으로 운영된다. 따라서 **평소 pull은 `ge`만으로 충분**하며, `ge-bo`/`ge-api`/`ge-fo`의 최신 변경사항을 반영해야 하는 특별한 경우에만 별도로 fetch 후 수동 반영한다.

---

## 6. Push 제외 대상

아래 파일·디렉토리는 커밋에 포함하지 않는다.

| 대상 | 이유 |
|------|------|
| `.claude/settings.local.json` | Claude Code 로컬 설정 |
| `bo/src/app/admin/widgetSub/[slug]/page copy.tsx` | 임시 복사 파일 |
| `lsea/` | 프로젝트 무관 디렉토리 |
| `C:tmptest-upload.txt` | 임시 테스트 파일 |
| `multiselect-builder-tree.md` | 브라우저 접근성 스냅샷 덤프(임시 산출물) |

---

## 7. 자주 쓰는 명령어 정리

```bash
# 리모트 목록 확인
git remote -v

# 변경 파일 확인
git status
git diff --stat HEAD

# 루트(ls-publish 포함) + 서브트리 전체 push (순서대로 실행)
git push ge master
git subtree push --prefix=bo ge-bo master
git subtree push --prefix=bo-api ge-api master
git subtree push --prefix=fo ge-fo master

# 특정 리모트에서 최신 내용 가져오기
git fetch ge
git fetch ge-bo
git fetch ge-api
git fetch ge-fo
```
