# 프로젝트 작업 지침

## 작업 시작

- 새 변경 작업을 시작하기 전에 `git status --short --branch`와 `git worktree list`로 작업 중인 변경과 브랜치를 확인한다.
- `git fetch --prune origin`으로 원격 상태를 갱신하고, `main`에서 `git merge --ff-only origin/main`을 실행한다. 로컬 `main`에만 있는 커밋이 있으면 보존하고 차이를 확인한다.
- `git branch --merged origin/main`으로 정리 후보를 확인한다. `main`과 각 worktree에서 사용 중인 브랜치를 제외하고, 작업이 끝난 브랜치만 `git branch -d`로 삭제한다. 스쿼시 머지된 브랜치는 PR의 병합 상태와 로컬에만 있는 변경을 확인한 뒤 정리한다.
- `main`과 `origin/main`이 같은 커밋인지 확인한 뒤, `main`에서 작업 브랜치를 만든다.

## 코드 위치와 서버 경계

- 화면 경로는 `src/routes/paths.ts`와 `src/routes/router.tsx`에서 관리한다. 공통 UI는 `src/base/components/`, Chakra 테마는 `src/theme.ts`에 있다.
- 분석 요청, 잔여 횟수, 랜덤 문장의 프런트엔드 API 호출은 `src/features/syntax-analyzer/api/`에 있다. 서버 구현은 별도 저장소인 [romantech/project-server](https://github.com/romantech/project-server)에 있다. 계약 변경과 배포 순서는 [API 변경 가이드](docs/api-integration.md)를 참고한다.
- API 주소는 `src/lib/axios.ts`에서 개발용 `VITE_API_BASE_URL_DEV`와 빌드용 `VITE_API_BASE_URL_PROD`를 선택한다. 환경 변수 목록은 `.env.example`을 확인한다.
- 분석 요청 전 문장 정제와 토큰화는 `src/features/syntax-analyzer/hooks/use-analysis-form.ts`에서 시작한다. 결과 타입 `TAnalysis`는 `src/features/syntax-editor/types/analysis.ts`에 있으며, 사용자 분석 목록은 `localStorage`의 `userAnalysisList` 키에 저장된다. 타입이나 저장 형식을 바꿀 때 기존 분석을 다시 열 수 있는지 확인한다.
- 편집기의 태깅 범위 판정은 `src/features/syntax-editor/helpers/selection-validation.ts`, 세그먼트 조작은 같은 폴더의 `segment.ts`를 확인한다. 태깅 규칙과 예시는 `README.md`의 `태깅 제약 조건`에 있다.

## 로컬 검증

- Node.js와 pnpm 버전은 `package.json`의 `engines`와 `packageManager`를 기준으로 한다. 로컬 개발은 `pnpm dev`로 실행한다.
- 코드 변경 후 `pnpm lint`로 Biome 검사를, `pnpm build`로 TypeScript 검사와 Vite 빌드를 실행한다.
- 편집기 변경은 `/editor`의 샘플로 확인할 수 있다. 태깅 로직을 수정했다면 기존 구간을 완전히 포함하는 선택과 경계를 교차하는 선택을 확인한다. 저장 로직을 수정했다면 저장 후 새로고침해 다시 열어 본다.

## GitHub 이슈와 PR

- PR 본문은 개조식 불릿으로 작성한다.
- 한 항목에 변경 사항이나 검증 결과를 하나씩 담고, 짧은 구절로 끝낸다.
- 기본 섹션은 `변경 사항`과 `검증`으로 구성한다. 관련 이슈와 남은 검증은 필요할 때 추가한다.
- 이슈와 PR에서 프런트엔드와 서버 간 요청 흐름, 상태 전이, 세그먼트 중첩을 그림으로 보여 주면 이해하기 쉬운 경우 `mermaid` 코드 블록을 사용한다.
