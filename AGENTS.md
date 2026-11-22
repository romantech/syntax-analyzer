# 프로젝트 작업 지침

## Git

- 작업 시작 전 `git status -sb`와 `git worktree list`로 상태 확인. 기존 변경과 로컬 전용 커밋은 보존한다.
- 새 작업 브랜치를 만들 때 `git fetch --prune origin` 후 `main`에서 `git merge --ff-only origin/main`을 실행한다. `main`과 `origin/main`이 일치한 뒤에만 브랜치를 만든다.
- 브랜치 정리 후보는 `git branch --merged origin/main`으로 확인. 스쿼시 머지된 브랜치는 PR 병합 여부와 미반영 변경 여부를 별도로 확인한다.
- `main`과 worktree에서 사용 중인 브랜치를 제외하고 작업이 끝난 브랜치만 `git branch -d`로 정리한다. 삭제가 거부되면 브랜치를 보존한다.

## 코드와 검증

- UI 기능을 추가하거나 Chakra UI 컴포넌트·테마를 수정할 때는 기존 공용 컴포넌트와 `apps/web/src/theme.ts`를 먼저 확인한다. Chakra UI MCP가 연결되어 있으면 props·사용 예제·토큰을 조회하고, 사용할 수 없으면 공식 문서를 참고한다. 적용할 API는 `apps/web/package.json`의 `@chakra-ui/react` 버전과 대조한다. [Chakra UI MCP](https://chakra-ui.com/docs/get-started/ai/mcp-server) · [Chakra UI 문서](https://chakra-ui.com/docs/components)
- Vite 프런트엔드는 `apps/web`, Express 서버는 `apps/api`에서 관리한다. API 변경 시 계약, 환경 변수, 배포 순서를 확인한다. [API 변경 가이드](docs/api-integration.md)
- 백엔드 없이 화면을 검증할 때는 `pnpm dev:mock`을 실행하고 `http://localhost:5173/analyzer`에서 확인한다. 지연·오류·소진은 [목 모드 실행 방법](docs/api-integration.md#로컬-목-모드)을 따른다.
- 실제 API 연동을 검증할 때는 루트에서 `pnpm dev:api`와 `pnpm dev`를 실행하고 `http://localhost:5173/`에서 확인한다. 실행 중인 개발 서버가 같은 모드라면 재사용한다.
- 태깅 변경 시 `/editor` 샘플에서 포함 범위 허용과 교차 범위 거부 확인. [태깅 제약 조건](README.md#태깅-제약-조건)
- 저장 형식 변경 시 `localStorage`의 기존 `userAnalysisList` 데이터 호환성과 저장 후 다시 열기 확인.
- UI 번역 키를 변경하면 `pnpm i18n:extract`를 실행하고 [언어별 JSON](apps/web/src/i18n/locales)을 갱신한다. `pnpm i18n:types`로 타입을 생성하고 `pnpm i18n:check`로 검증한다.
- 사용법, API 계약, 검증 절차가 바뀌면 관련 문서도 함께 갱신한다.
- Node.js와 pnpm 버전은 `package.json` 기준. 개발은 `pnpm dev`, 코드 검증은 `pnpm lint`, `pnpm test`, `pnpm build`.

## GitHub 이슈와 PR

- 이슈와 PR 본문은 불릿 하나에 하나의 요점만 담는 개조식을 기본으로 하되, 문장으로 설명해야 할 때만 간결한 한다체(`~한다`)를 쓴다.
- 작업 이슈를 만들 때 주 라벨 하나를 붙인다.
  - `bug` · 기존 기능이 기대한 대로 동작하지 않는 문제
  - `enhancement` · 새 기능 추가, 기존 동작 개선 또는 개발 방식 개선
  - `documentation` · 문서나 검증 절차의 작성·수정이 주된 작업
  - `dependencies` · 패키지나 도구 체인의 업데이트·교체·제거와 마이그레이션
- 보조 라벨은 해당 이슈를 따로 필터링할 필요가 있을 때 붙인다. 패키지 업데이트로 기존 오류를 해결하는 이슈는 `bug`를 주 라벨로 쓰고 필요하면 `dependencies`를 함께 붙인다.
- 이미 같은 이슈가 있으면 기존 이슈를 사용한다. 등록 후 중복을 발견하면 원본을 링크하고 `duplicate`를 붙여 닫는다.
- PR 구성은 `변경 사항`과 `검증`. 필요하면 관련 이슈와 남은 검증을 추가한다.
- 이슈와 PR에서 요청 흐름, 상태 전이, 세그먼트 중첩을 설명할 때는 필요에 따라 Mermaid 등으로 시각화한다.
- `main`에 들어가는 커밋은 Conventional Commits 형식 사용.
- `fix:`나 `feat:` 등 릴리스 대상 커밋이 `main`에 들어오면 Release Please가 릴리스 PR을 생성하거나 갱신한다. 릴리스 PR을 머지하면 버전과 변경 내역이 반영되고 GitHub Release가 생성된다.
- Release Please는 `RELEASE_PLEASE_TOKEN` 저장소 Secret을 사용해 릴리스 PR의 `Validate`를 자동으로 시작한다. 토큰은 이 저장소의 `Contents`와 `Pull requests`에 읽기·쓰기 권한을 부여하고 만료 전에 교체한다.
