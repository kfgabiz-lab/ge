# Bo 형상관리(Git) 가이드

> 버전: v1.3
> 작성일: 2026-06-09 (최종 갱신 2026-07-14)
> 대상: Bo 프로젝트에서 git push·커밋·브랜치를 다루는 모든 개발자 및 에이전트
> 관련 파일: `.gitignore`, `.gitmodules`, `bo/`, `bo-api/`, `fo/`, `ls-publish/`

---

## 1. 리포지토리 구조

Bo 프로젝트는 **단일 monorepo**(`C:\...\workspace\Bo`)에서 관리되며,
`bo/`, `bo-api/`, `fo/`는 **git submodule**로, `ls-publish/`는 **정식 git subtree**로 각각 별도 GitHub 리포지토리와 연결되어 있다(아래 리모트 목록 참고).

```
workspace/Bo/          ← 루트 monorepo (origin 리모트)
├── bo/                ← BO 프론트 (ge-bo submodule)
├── bo-api/            ← BE API   (ge-api submodule)
├── fo/                ← FO 프론트 (ge-fo submodule)
├── ls-publish/        ← FO 이관 전 레거시 원본 사이트 (ls-publish-src 서브트리, pub 브랜치)
└── docs/              ← 공통 문서
```

### 리모트 목록

| 리모트명 | GitHub URL | 대상 | 비고 |
|---------|-----------|------|------|
| `origin` | https://github.com/kfgabiz-lab/ge | 루트 전체 | 전체 monorepo |
| `ge-bo` | https://github.com/kfgabiz-lab/ge-bo | `bo/` | git submodule (`.gitmodules`에 `branch = master` 지정) |
| `ge-api` | https://github.com/kfgabiz-lab/ge-api | `bo-api/` | git submodule (`.gitmodules`에 `branch = master` 지정) |
| `ge-fo` | https://github.com/kfgabiz-lab/ge-fo | `fo/` | git submodule (`.gitmodules`에 `branch = master` 지정) |
| `ls-publish-src` | https://github.com/timesky82/ls | `ls-publish/` | **ge와 무관한 제3자 저장소**. `pub` 브랜치가 최신 — `master`가 아님에 주의. `git subtree pull/push --prefix=ls-publish ls-publish-src pub` |

> 리모트 확인 명령어(루트 `ge`에서): `git remote -v`
> `bo`/`bo-api`/`ge-fo` 3개 submodule은 **GitHub 기본 브랜치가 `main`**이라, `git submodule add` 시 반드시 `-b master`를 명시해야 한다. 지정하지 않으면 `main`(별개의 오래된/자동 브랜치, 실제 코드 없음)으로 클론되어 실제 작업 내용이 빠질 수 있다.
> `ls-publish/`는 FO 이관 전 레거시 원본 사이트로, fo/ 작업 시 비교 참고용으로 사용한다. 자체 `node_modules`는 git 추적 대상이 아니므로, 해당 폴더에서 개발서버를 띄우려면 `npm install`을 먼저 실행해야 한다.
> `bo`/`bo-api`/`fo`도 submodule 특성상 **자체 `node_modules`가 git 추적 대상이 아니므로**, 새로 clone하거나 submodule을 새로 추가한 직후에는 각 폴더에서 `npm install`(bo-api는 불필요, Gradle 사용)을 먼저 실행해야 dev 서버가 뜬다.

---

## 2. 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `master` | 개발 통합 브랜치 (로컬 개발 기준) |
| `main` | 운영 배포 브랜치 |

- 기능 개발은 `master`에서 진행
- 운영 반영 시 `master` → `main` 머지
- `bo`/`bo-api`/`fo` submodule도 동일하게 `master`를 기준으로 작업한다(각 submodule의 GitHub 기본 브랜치는 `main`이지만 실제 작업 브랜치는 `master`).

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

`bo`/`bo-api`/`fo`는 submodule이므로 **각 폴더 안에서 그 폴더 자신의 git 저장소로 직접 커밋·push**한다(일반적인 단일 저장소 작업과 동일, 별도 변환 과정 없음). 그 다음 루트 `ge`에서 submodule 포인터(어느 커밋을 가리키는지) 변경을 커밋·push한다.

### 4-1. 커밋 전 확인 사항

```bash
git status        # 변경 파일 목록 확인
git diff --stat   # 변경 요약
```

### 4-2. submodule(bo / bo-api / fo) 내부에서 커밋·push

```bash
cd bo        # 또는 bo-api, fo
git add <파일 목록>
git commit -m "feat: 설명"
git push origin master
cd ..
```

> `.claude/settings.local.json`, `page copy.tsx` 등 아래 "제외 목록" 파일은 `git add` 시 포함하지 않는다.

### 4-3. 루트(ge)에 submodule 포인터 반영

submodule 안에서 push를 마쳤으면, 루트 저장소는 그 submodule이 "어느 커밋을 가리키는지"가 바뀐 것으로 인식한다. 이것도 별도로 커밋·push해야 다른 사람이 `git pull` 시 최신 submodule 커밋을 받을 수 있다.

```bash
git add bo bo-api fo      # 변경된 submodule만 지정해도 됨
git commit -m "chore: bo/bo-api/fo 서브모듈 포인터 업데이트"
git push origin master
```

> `ls-publish/`는 submodule이 아니라 subtree이므로 이 절차와 무관하다 — 필요 시(레거시 원본 자체를 수정한 경우만) `git subtree push --prefix=ls-publish ls-publish-src pub`로 별도 진행.

---

## 5. Pull 절차

일반적인 개발 작업에서는 **`origin` 한 곳만 pull 받으면 충분**하다.

```bash
git pull origin master
```

단, submodule(`bo`/`bo-api`/`fo`)은 루트 pull만으로는 내용이 갱신되지 않는다 — 루트 저장소는 "포인터가 바뀌었다"는 것만 받아오고, 실제로 그 커밋을 받아오려면 아래를 추가로 실행해야 한다.

```bash
git submodule update --init --recursive
```

다른 팀/세션이 `ge-bo`/`ge-api`/`ge-fo`에 직접 push한 최신 변경사항을 루트 pull 없이 먼저 확인하고 싶을 때는 각 submodule 폴더 안에서 직접 pull한다.

```bash
cd bo && git pull origin master && cd ..
cd bo-api && git pull origin master && cd ..
cd fo && git pull origin master && cd ..
```

**충돌 처리 원칙**: `git pull`은 겹치지 않는 변경은 자동으로 병합한다. 충돌(conflict)이 발생한 파일만 git이 별도로 표시하므로, 그 파일에 한해서만 양쪽 변경 내용을 직접 확인한 뒤 수동으로 정리한다. 충돌 파일을 임의로 한쪽 내용으로 덮어써서 해결하지 않는다.

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
# 리모트 목록 확인(루트)
git remote -v

# 변경 파일 확인(루트)
git status
git diff --stat HEAD

# submodule(bo/bo-api/fo) 각각 내부에서 커밋+push
cd bo && git add <파일> && git commit -m "..." && git push origin master && cd ..
cd bo-api && git add <파일> && git commit -m "..." && git push origin master && cd ..
cd fo && git add <파일> && git commit -m "..." && git push origin master && cd ..

# 루트에 submodule 포인터 반영
git add bo bo-api fo
git commit -m "chore: 서브모듈 포인터 업데이트"
git push origin master

# 최신 내용 가져오기(루트 + submodule 포인터)
git pull origin master
git submodule update --init --recursive

# 특정 submodule만 직접 최신화하고 싶을 때
cd bo && git pull origin master && cd ..
cd bo-api && git pull origin master && cd ..
cd fo && git pull origin master && cd ..

# ls-publish(제3자 저장소, pub 브랜치, subtree 유지) — 필요할 때만 별도 진행
git fetch ls-publish-src
git subtree pull --prefix=ls-publish ls-publish-src pub --squash
git subtree push --prefix=ls-publish ls-publish-src pub
```

> ⚠️ `git subtree pull`은 `--prefix` 경로만이 아니라 **루트 저장소 전체 working tree가 clean해야** 실행된다(다른 경로에 무관한 로컬 변경이 있어도 `fatal: working tree has modifications`로 실패). 무관한 로컬 변경사항이 있으면 `git stash -u`로 대피 후 pull하고, 완료 후 `git stash pop`으로 복원한다.
