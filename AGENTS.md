# 프로젝트 작업 지침

## Git

- 작업 시작 전 `git status -sb`와 `git worktree list`로 상태 확인. 기존 변경과 로컬 전용 커밋은 보존한다.
- 새 작업 브랜치를 만들 때 `git fetch --prune origin` 후 `main`에서 `git merge --ff-only origin/main`을 실행한다. `main`과 `origin/main`이 일치한 뒤에만 브랜치를 만든다.
- 브랜치 정리 후보는 `git branch --merged origin/main`으로 확인. 스쿼시 머지된 브랜치는 PR 병합 여부와 미반영 변경 여부를 별도로 확인한다.
- `main`과 worktree에서 사용 중인 브랜치를 제외하고 작업이 끝난 브랜치만 `git branch -d`로 정리한다. 삭제가 거부되면 브랜치를 보존한다.

## 코드와 검증

- 서버는 별도 저장소에서 관리한다. API 변경 시 계약, 환경 변수, 배포 순서 확인. [romantech/project-server](https://github.com/romantech/project-server) · [API 변경 가이드](docs/api-integration.md)
- 태깅 변경 시 `/editor` 샘플에서 포함 범위 허용과 교차 범위 거부 확인. [태깅 제약 조건](README.md#태깅-제약-조건)
- 저장 형식 변경 시 `localStorage`의 기존 `userAnalysisList` 데이터 호환성과 저장 후 다시 열기 확인.
- 사용법, API 계약, 검증 절차가 바뀌면 관련 문서도 함께 갱신한다.
- Node.js와 pnpm 버전은 `package.json` 기준. 개발은 `pnpm dev`, 코드 검증은 `pnpm lint`, `pnpm test`, `pnpm build`.

## GitHub 이슈와 PR

- 이슈와 PR 본문은 개조식을 기본으로 작성한다. 문장으로 설명할 필요가 있을 때는 간결한 한다체(`~한다`)를 쓴다. 불릿 하나에 한 가지씩 적고, 순서가 중요한 절차에는 번호 목록을 사용한다.
- PR 구성은 `변경 사항`과 `검증`. 필요하면 관련 이슈와 남은 검증을 추가한다.
- 이슈와 PR에서 요청 흐름, 상태 전이, 세그먼트 중첩을 설명할 때는 필요에 따라 Mermaid 등으로 시각화한다.
- `main`에 들어가는 커밋은 Conventional Commits 형식 사용.
- `fix:`나 `feat:` 등 릴리스 대상 커밋이 `main`에 들어오면 Release Please가 릴리스 PR을 생성하거나 갱신한다. 릴리스 PR을 머지하면 버전과 변경 내역이 반영되고 GitHub Release가 생성된다.
- 릴리스 PR의 `Validate` 실행이 승인을 기다리면 PR에서 `Approve workflows to run`을 눌러 실행한다.
