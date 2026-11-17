# 프로젝트 작업 지침

## Git

- 새 작업 전 `git status -sb`와 `git worktree list` 확인. 기존 변경과 로컬 전용 커밋 보존.
- `git fetch --prune origin` → `main`에서 `git merge --ff-only origin/main` → `origin/main`과 일치 확인.
- `git branch --merged origin/main`으로 정리 후보 확인. `main`과 worktree에서 사용 중인 브랜치를 제외하고 작업이 끝난 브랜치만 `git branch -d`로 정리. 스쿼시 머지는 PR 병합과 로컬 전용 변경 여부 확인.
- 동기화된 `main`에서 작업 브랜치 생성.

## 코드와 검증

- 서버는 별도 저장소 [romantech/project-server](https://github.com/romantech/project-server). 계약, 환경 변수, 배포 순서는 [API 변경 가이드](docs/api-integration.md) 참고.
- 태깅 변경은 `/editor` 샘플에서 포함·교차 선택 확인. [태깅 제약 조건](README.md#태깅-제약-조건)
- 저장 형식 변경은 `localStorage`의 기존 `userAnalysisList` 호환성과 저장 후 다시 열기 확인.
- Node.js와 pnpm 버전은 `package.json` 기준. 개발은 `pnpm dev`, 코드 검증은 `pnpm lint`와 `pnpm build`.

## GitHub 이슈와 PR

- PR은 `변경 사항`과 `검증`으로 구성. 불릿 하나에 한 가지씩 짧게 작성. 필요하면 관련 이슈와 남은 검증 추가.
- 이슈·PR에서 요청 흐름, 상태 전이, 세그먼트 중첩은 필요에 따라 `mermaid`로 표현.
