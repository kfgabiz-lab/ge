# Bo 형상관리(Git) 가이드

> 버전: v1.6
> 작성일: 2026-06-09 (최종 갱신 2026-09-11)
> 대상: Bo 프로젝트에서 git push·커밋·브랜치를 다루는 모든 개발자 및 에이전트
> 관련 파일: `.gitignore`, `.gitmodules`, `bo/`, `bo-api/`, `fo/`, `ls-publish/`, `lse-na-api/`, `lse-na-fo/`, `lse-na-bo/`

---

## 1. 리포지토리 구조

Bo 프로젝트는 **단일 monorepo**(`C:\...\workspace\Bo`)에서 관리되며,
`bo/`, `bo-api/`, `fo/`, `lse-na-api/`, `lse-na-fo/`, `lse-na-bo/`는 **git submodule**로, `ls-publish/`는 **정식 git subtree**로 각각 별도 저장소와 연결되어 있다(아래 리모트 목록 참고).

```
workspace/Bo/          ← 루트 monorepo (리모트명: ge)
├── bo/                ← BO 프론트 (ge-bo submodule, GitHub)
├── bo-api/            ← BE API   (ge-api submodule, GitHub)
├── fo/                ← FO 프론트 (ge-fo submodule, GitHub)
├── ls-publish/        ← FO 이관 전 레거시 원본 사이트 (ls-publish-src 서브트리, pub 브랜치)
├── lse-na-api/        ← lse-na BE API   (submodule, Gitea)
├── lse-na-fo/         ← lse-na FO 프론트 (submodule, Gitea)
├── lse-na-bo/         ← lse-na BO 프론트 (submodule, Gitea)
└── docs/              ← 공통 문서
```

> ⚠️ **작업 우선순위**: 기본 작업 대상은 `bo`/`bo-api`/`fo`이다. `lse-na-api`/`lse-na-fo`/`lse-na-bo` 3종은 **사용자의 명시적 판단(요청)이 있을 때만** 반영·작업 대상에 포함한다 — 별도 지시 없이 임의로 함께 다루지 않는다.

### 리모트 목록

| 리모트명 | URL | 대상 | 비고 |
|---------|-----------|------|------|
| `ge` | https://github.com/kfgabiz-lab/ge | 루트 전체 | 전체 monorepo. 루트에서 pull/push할 때 실제로 쓰는 리모트명은 `ge`이다 |
| `ge-bo` | https://github.com/kfgabiz-lab/ge-bo | `bo/` | 루트에도 등록되어 있으나(참고용), 실제 pull/push는 `bo/` 폴더 안에서 `origin`으로 한다 |
| `ge-api` | https://github.com/kfgabiz-lab/ge-api | `bo-api/` | 루트에도 등록되어 있으나(참고용), 실제 pull/push는 `bo-api/` 폴더 안에서 `origin`으로 한다 |
| `ge-fo` | https://github.com/kfgabiz-lab/ge-fo | `fo/` | 루트에도 등록되어 있으나(참고용), 실제 pull/push는 `fo/` 폴더 안에서 `origin`으로 한다 |
| `ls-publish-src` | https://github.com/timesky82/ls | `ls-publish/` | **ge와 무관한 제3자 저장소**. `pub` 브랜치가 최신 — `master`가 아님에 주의. `git subtree pull/push --prefix=ls-publish ls-publish-src pub` |
| (없음, `.gitmodules`만 등록) | http://10.153.10.150:4000/lse-na/lse-na-api.git | `lse-na-api/` | 사내 Gitea. `ge-bo`류와 달리 루트에 별도 이름의 편의 remote를 만들지 않았다 — 폴더 안에서 `origin`으로만 접근 |
| (없음, `.gitmodules`만 등록) | http://10.153.10.150:4000/lse-na/lse-na-fo.git | `lse-na-fo/` | 사내 Gitea. 위와 동일 |
| (없음, `.gitmodules`만 등록) | http://10.153.10.150:4000/lse-na/lse-na-bo.git | `lse-na-bo/` | 사내 Gitea. 위와 동일 |

> 리모트 확인 명령어(루트에서): `git remote -v`
> ⚠️ `bo`/`bo-api`/`fo` 각 submodule 폴더 **안에서** `git remote -v`를 실행하면 그 폴더 자신의 리모트도 이름이 `origin`이다(각각 ge-bo/ge-api/ge-fo 저장소를 가리킴). 루트의 `ge-bo`/`ge-api`/`ge-fo` 리모트와는 별개의 설정이다. `lse-na-*` 3종도 폴더 안에서는 동일하게 `origin`이 그 폴더 자신의 Gitea 저장소를 가리킨다.
> `bo`/`bo-api`/`ge-fo` 3개 submodule은 **GitHub 기본 브랜치가 `main`**이라, `git submodule add` 시 반드시 `-b master`를 명시해야 한다. 지정하지 않으면 `main`(별개의 오래된/자동 브랜치, 실제 코드 없음)으로 클론되어 실제 작업 내용이 빠질 수 있다.
> `lse-na-api`/`lse-na-fo`/`lse-na-bo`는 Gitea 저장소 자체의 기본 브랜치(HEAD)가 이미 `master`이므로, 위 GitHub 3종과 같은 `-b master` 누락 함정은 해당하지 않는다(그래도 명시적으로 `-b master`를 붙여 clone했다).
> `ls-publish/`는 FO 이관 전 레거시 원본 사이트로, fo/ 작업 시 비교 참고용으로 사용한다. 자체 `node_modules`는 git 추적 대상이 아니므로, 해당 폴더에서 개발서버를 띄우려면 `npm install`을 먼저 실행해야 한다.
> `bo`/`bo-api`/`fo`/`lse-na-api`/`lse-na-fo`/`lse-na-bo`도 submodule 특성상 **자체 `node_modules`가 git 추적 대상이 아니므로**, 새로 clone하거나 submodule을 새로 추가한 직후에는 각 폴더에서 `npm install`(bo-api·lse-na-api는 불필요, Gradle 사용)을 먼저 실행해야 dev 서버가 뜬다.

### Gitea(lse-na-*) 인증 관련 주의사항

`lse-na-api`/`lse-na-fo`/`lse-na-bo`는 GitHub가 아니라 사내 Gitea(`http://10.153.10.150:4000`)를 사용하며, 계정/비밀번호 기반 Basic 인증을 쓴다.

- Windows에 설치된 Git Credential Manager(GCM)가 이 Gitea 주소에 대해 **인터랙티브(팝업) 인증을 시도하며 응답 없이 멈추는 현상**이 있다(에이전트/비대화 세션에서는 팝업을 띄울 수 없어 그대로 행(hang)).
- 해결 방법: 해당 명령에서만 credential helper를 비활성화하고, `GIT_ASKPASS` 스크립트로 계정/비밀번호를 전달한다.
  ```bash
  git -c credential.helper= <clone/pull/push 등 명령>
  ```
  이때 `GIT_ASKPASS`는 `Username*`/`Password*` 프롬프트를 구분해 각각 계정/비밀번호를 echo하는 간단한 쉘 스크립트를 가리키게 하고, `GIT_USER`/`GIT_PASSWORD` 환경변수로 값을 넘긴다. 비밀번호를 `.gitmodules`나 커밋에 평문으로 남기지 않도록 URL에는 계정/비밀번호를 넣지 않는다(clean URL 유지).

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

`bo`/`bo-api`/`fo`/`lse-na-api`/`lse-na-fo`/`lse-na-bo`는 submodule이므로 **각 폴더 안에서 그 폴더 자신의 git 저장소로 직접 커밋·push**한다(일반적인 단일 저장소 작업과 동일, 별도 변환 과정 없음). 그 다음 루트 `ge`에서 submodule 포인터(어느 커밋을 가리키는지) 변경을 커밋·push한다.

> `lse-na-*` 3종은 위 [1. 리포지토리 구조]의 작업 우선순위 안내대로, 사용자 명시적 요청이 있을 때만 이 절차를 적용한다.

### 4-1. 커밋 전 확인 사항

```bash
git status        # 변경 파일 목록 확인
git diff --stat   # 변경 요약
```

### 4-2. submodule(bo / bo-api / fo / lse-na-api / lse-na-fo / lse-na-bo) 내부에서 커밋·push

```bash
cd bo        # 또는 bo-api, fo, lse-na-api, lse-na-fo, lse-na-bo
git add <파일 목록>
git commit -m "feat: 설명"
git push origin master
cd ..
```

> `lse-na-*` 3종은 Gitea 인증 문제로 push 시에도 [1. 리포지토리 구조]의 "Gitea(lse-na-*) 인증 관련 주의사항"을 그대로 적용해야 한다: `git -c credential.helper= push origin master` + `GIT_ASKPASS`.

> `.claude/settings.local.json`, `page copy.tsx` 등 아래 "제외 목록" 파일은 `git add` 시 포함하지 않는다.

### 4-3. 루트(ge)에 submodule 포인터 반영

submodule 안에서 push를 마쳤으면, 루트 저장소는 그 submodule이 "어느 커밋을 가리키는지"가 바뀐 것으로 인식한다. 이것도 별도로 커밋·push해야 다른 사람이 `git pull` 시 최신 submodule 커밋을 받을 수 있다.

```bash
git add bo bo-api fo      # 변경된 submodule만 지정해도 됨 (lse-na-* 반영 시 lse-na-api lse-na-fo lse-na-bo도 추가)
git commit -m "chore: bo/bo-api/fo 서브모듈 포인터 업데이트"
git push ge master
```

> `ls-publish/`는 submodule이 아니라 subtree이므로 이 절차와 무관하다 — 필요 시(레거시 원본 자체를 수정한 경우만) `git subtree push --prefix=ls-publish ls-publish-src pub`로 별도 진행.

---

## 5. Pull 절차

일반적인 개발 작업에서는 **루트 한 곳만 pull 받으면 충분**하다.

```bash
git pull ge master
```

단, submodule(`bo`/`bo-api`/`fo`/`lse-na-api`/`lse-na-fo`/`lse-na-bo`)은 루트 pull만으로는 내용이 갱신되지 않는다 — 루트 저장소는 "포인터가 바뀌었다"는 것만 받아오고, 실제로 그 커밋을 받아오려면 아래를 추가로 실행해야 한다.

```bash
git submodule update --init --recursive
```

> `lse-na-*` 포함 전체를 `--init --recursive`로 갱신하면 Gitea 인증 문제로 멈출 수 있다 — 필요 시 "Gitea(lse-na-*) 인증 관련 주의사항"의 `credential.helper=` + `GIT_ASKPASS` 방식을 적용한다. `lse-na-*`는 [1. 리포지토리 구조]의 작업 우선순위 안내대로 사용자 명시적 요청이 있을 때만 갱신 대상에 포함한다.

다른 팀/세션이 `ge-bo`/`ge-api`/`ge-fo`에 직접 push한 최신 변경사항을 루트 pull 없이 먼저 확인하고 싶을 때는 각 submodule 폴더 안에서 직접 pull한다.

```bash
cd bo && git pull origin master && cd ..
cd bo-api && git pull origin master && cd ..
cd fo && git pull origin master && cd ..
cd lse-na-api && git -c credential.helper= pull origin master && cd ..
cd lse-na-fo && git -c credential.helper= pull origin master && cd ..
cd lse-na-bo && git -c credential.helper= pull origin master && cd ..
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
# 리모트 목록 확인(루트, 실제 리모트명은 ge)
git remote -v

# 변경 파일 확인(루트)
git status
git diff --stat HEAD

# submodule(bo/bo-api/fo) 각각 내부에서 커밋+push
cd bo && git add <파일> && git commit -m "..." && git push origin master && cd ..
cd bo-api && git add <파일> && git commit -m "..." && git push origin master && cd ..
cd fo && git add <파일> && git commit -m "..." && git push origin master && cd ..

# submodule(lse-na-api/lse-na-fo/lse-na-bo) — 사용자 명시적 요청 있을 때만, Gitea 인증 때문에 credential.helper= 필요
cd lse-na-api && git -c credential.helper= add <파일> && git commit -m "..." && git -c credential.helper= push origin master && cd ..
cd lse-na-fo && git -c credential.helper= add <파일> && git commit -m "..." && git -c credential.helper= push origin master && cd ..
cd lse-na-bo && git -c credential.helper= add <파일> && git commit -m "..." && git -c credential.helper= push origin master && cd ..

# 루트에 submodule 포인터 반영
git add bo bo-api fo      # lse-na-* 반영 시 lse-na-api lse-na-fo lse-na-bo도 추가
git commit -m "chore: 서브모듈 포인터 업데이트"
git push ge master

# 최신 내용 가져오기(루트 + submodule 포인터)
git pull ge master
git submodule update --init --recursive

# 특정 submodule만 직접 최신화하고 싶을 때
cd bo && git pull origin master && cd ..
cd bo-api && git pull origin master && cd ..
cd fo && git pull origin master && cd ..
cd lse-na-api && git -c credential.helper= pull origin master && cd ..
cd lse-na-fo && git -c credential.helper= pull origin master && cd ..
cd lse-na-bo && git -c credential.helper= pull origin master && cd ..

# ls-publish(제3자 저장소, pub 브랜치, subtree 유지) — 필요할 때만 별도 진행
git fetch ls-publish-src
git subtree pull --prefix=ls-publish ls-publish-src pub --squash
git subtree push --prefix=ls-publish ls-publish-src pub
```

> ⚠️ `git subtree pull`은 `--prefix` 경로만이 아니라 **루트 저장소 전체 working tree가 clean해야** 실행된다(다른 경로에 무관한 로컬 변경이 있어도 `fatal: working tree has modifications`로 실패). 무관한 로컬 변경사항이 있으면 `git stash -u`로 대피 후 pull하고, 완료 후 `git stash pop`으로 복원한다.

---

## 8. GitHub ↔ Gitea 양방향 동기화 (bo/bo-api/fo ↔ lse-na-*)

### 전제 사실

`lse-na-api`/`lse-na-fo`/`lse-na-bo`(Gitea)는 `bo-api`/`fo`/`bo`(GitHub)와 무관한 별도 프로젝트가 아니라, **같은 git 히스토리를 공유하는 형제 저장소**다 — 실제로 두 저장소 사이에 공통 조상 커밋(merge-base)이 존재한다. 다른 팀원(예: sujeong/comgsu/jangsungju)이 Gitea 쪽에 직접 push하며 작업하고 있어서, 시간이 지나면 두 원격이 서로 다른 커밋으로 갈라진다.

> ⚠️ 이 동기화 작업도 [1. 리포지토리 구조]의 작업 우선순위 안내와 동일하게, **사용자의 명시적 요청이 있을 때만** 수행한다.

### 절차 (양방향 공통 패턴)

두 로컬 클론이 같은 workspace 안에 있으므로, 원격 URL 대신 **서로의 로컬 경로를 fetch 소스로 직접 사용**하면 Gitea 인증 왕복 없이 더 빠르고 안전하다.

```bash
# 예: GitHub(bo)에서 Gitea(lse-na-bo)의 변경을 가져올 때
git -C bo fetch ../lse-na-bo master:refs/remotes/gtsrc/master
git -C bo rev-list --left-right --count HEAD...gtsrc/master   # 몇 커밋씩 갈라졌는지 확인

# 반대 방향(Gitea에서 GitHub 변경 가져오기)도 동일 패턴
git -C lse-na-bo fetch ../bo master:refs/remotes/ghsrc/master
```

병합 전 반드시 아래 순서를 따른다 — 임의로 병합하거나 충돌을 강제로 덮어쓰지 않는다:

1. **파일 겹침 확인**: `git diff --stat <merge-base> <내HEAD>` 와 `git diff --stat <merge-base> <상대쪽 ref>` 를 각각 찍어, 양쪽이 같은 파일을 건드렸는지 먼저 확인한다.
2. **시험 병합**: `git merge --no-ff --no-commit <상대쪽 ref>` 로 실제 충돌 여부를 확인한다.
   - 충돌 있으면: 즉시 `git merge --abort` 하고 사용자에게 구체적인 충돌 파일을 보고한다. 절대 임의로 한쪽으로 해결하지 않는다.
   - 충돌 없으면: `git commit` 으로 병합을 확정한다(merge 메시지에 어느 쪽 변경을 병합했는지 명시).
3. 한쪽이 다른 쪽의 순수 상위 집합(자기 쪽에 unique 커밋이 0개)이면 실제로는 병합이 아니라 **fast-forward**이므로 `git merge --ff-only <상대쪽 ref>` 로 충분하다(충돌 가능성 자체가 없음).
4. **Gitea 쪽으로 fetch/push할 때는 fetch·push 두 명령 모두에** "Gitea(lse-na-*) 인증 관련 주의사항"(`credential.helper=` + `GIT_ASKPASS`)을 적용한다 — fetch에서 빠뜨리면 Git Credential Manager가 인터랙티브 인증을 시도하며 멈추는 현상이 실제로 발생했다.
5. 양방향 반영이 끝나면, 임시로 만든 `refs/remotes/gtsrc`/`ghsrc` 추적 ref는 `git update-ref -d <ref>` 로 정리한다.
6. 마지막으로 루트(`ge`)에 영향받은 submodule(최대 6개: `bo`/`bo-api`/`fo`/`lse-na-api`/`lse-na-fo`/`lse-na-bo`) 포인터를 전부 커밋·push한다(섹션 4-3 절차와 동일).

### 동기화 완료 검증

"동기화됐다"는 추측이 아니라 **커밋 해시로 직접 확인**한다 — 4곳(GitHub local, GitHub origin, Gitea local, Gitea origin)의 `git rev-parse HEAD` / `git rev-parse origin/master` 값이 모두 동일하면 확정이다.

```bash
git -C bo rev-parse HEAD
git -C bo rev-parse origin/master
git -C lse-na-bo rev-parse HEAD
git -C lse-na-bo rev-parse origin/master
# 4개 해시가 모두 같아야 진짜 동기화 완료
```
