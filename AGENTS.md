# 프로젝트 작업 지침

## Git

- 시작 전 `git status -sb`, `git worktree list` 확인. 기존 변경과 로컬 전용 커밋 보존.
- 새 브랜치는 `git fetch --prune origin` 후 `main`에서 `git merge --ff-only origin/main`을 실행해 `main`과 `origin/main`이 일치할 때 생성.
- `git merge --ff-only origin/main`이 실패하거나 실행 후에도 `main`과 `origin/main`이 일치하지 않으면 강제 초기화하지 않고 사용자에게 확인.
- 정리 후보는 `git branch --merged origin/main`으로 확인. 스쿼시 머지는 PR 병합과 미반영 변경 여부를 별도로 확인.
- `main`과 사용 중인 worktree 브랜치를 제외한 완료 브랜치만 `git branch -d`로 정리. 삭제가 거부되면 보존.

## 코드와 검증

- UI 기능 또는 Chakra UI 변경 시 공용 컴포넌트와 `apps/web/src/theme.ts`부터 확인. props·예제·토큰은 [Chakra UI MCP](https://chakra-ui.com/docs/get-started/ai/mcp-server)를 조회하고, 연결되지 않으면 [공식 문서](https://chakra-ui.com/docs/components)를 참고. API는 `apps/web/package.json`의 Chakra UI 버전과 대조.
- API 변경 시 계약, 환경 변수, 배포 순서 확인. [API 변경 가이드](docs/api-integration.md)
- 화면 검증은 같은 모드의 개발 서버가 실행 중이면 재사용.
  - 백엔드 없이 `pnpm dev:mock`으로 [분석 화면](http://localhost:5173/analyzer) 확인. [지연·오류·소진 시나리오](docs/api-integration.md#로컬-목-모드)
  - 실제 API 연동은 루트에서 `pnpm dev:api`와 `pnpm dev`로 [로컬 앱](http://localhost:5173/) 확인. [개발 환경 설정](docs/api-integration.md#로컬-개발)
- 태깅 변경 시 `/editor` 샘플에서 포함 범위 허용과 교차 범위 거부 확인. [태깅 제약 조건](README.md#태깅-제약-조건)
- 저장 형식 변경 시 `localStorage`의 기존 `userAnalysisList` 데이터 호환성과 저장 후 다시 열기 확인.
- 번역 키 변경 시 `pnpm i18n:extract` → [언어별 JSON](apps/web/src/i18n/locales) 갱신 → `pnpm i18n:types` → `pnpm i18n:check`.
- 사용법, API 계약, 검증 절차 변경 시 관련 문서도 갱신.
- Node.js와 pnpm 버전은 루트 `package.json` 기준. 코드 검증은 `pnpm lint`, `pnpm test`, `pnpm build`.
- 실제 수행한 검증만 완료로 표시. 실패하거나 수행하지 못한 검증은 사유 명시.

## GitHub 이슈와 PR

- PR 제목은 영어로 작성하고 Conventional Commits 형식(`type(scope): summary`, scope 생략 가능)을 사용. summary는 명령형으로 간결하게 작성.
- PR 본문은 한국어로 작성하고 `변경 사항`, `검증`으로 구성. 실제 수행한 검증과 결과를 명시하고 필요하면 관련 이슈와 미완료 검증 항목 추가.
- 이슈와 PR 본문은 개조식 작성을 원칙으로 하며, 한 불릿에 한 요점만 작성. 문장이 필요한 경우 간결한 한다체 사용. 흐름이나 구조는 필요에 따라 Mermaid 등으로 시각화.
- 작업 이슈에 주 라벨 하나 지정. `bug`는 기존 오류, `enhancement`는 기능·개발 방식 개선, `documentation`은 문서·검증 절차, `dependencies`는 패키지·도구 변경.
- 보조 라벨은 별도 필터링이 필요할 때만 추가. 패키지 업데이트로 기존 오류를 해결하면 주 라벨은 `bug`.
- 같은 이슈가 있으면 재사용. 등록 후 중복을 발견하면 원본을 링크하고 `duplicate`를 붙여 닫기.

## 릴리스

- `main` 커밋은 Conventional Commits 형식 사용.
- `apps/web`의 릴리스 대상 커밋은 [Release Please](.github/workflows/release-please.yml)가 릴리스 PR에 모은다. 릴리스 PR을 머지하면 웹 버전·변경 이력과 GitHub Release 갱신.
- 릴리스 PR의 `Validate` 실행에 쓰이는 `RELEASE_PLEASE_TOKEN`은 저장소 `Contents`·`Pull requests` 읽기·쓰기 권한 부여 후 만료 전에 교체.
