# 구문 분석 API 변경 가이드

## 계약 확인

요청 필드, 응답 형식, 검증 규칙을 바꿀 때는 프런트엔드 호출부와 Express 구현을 함께 확인한다. [서버 라우트](../apps/api/src/routes/analyzer.ts) · [입력 검증](../apps/api/src/validators/analyzer.ts) · [API 명세](../apps/api/README.md)

- `POST /analyzer`의 모델 키와 토큰 배열, `TAnalysis` 응답. [분석 요청](../apps/web/src/features/syntax-analyzer/api/create-analysis.ts) · [응답 타입](../apps/web/src/features/syntax-editor/types/analysis.ts)
- `GET /analyzer/random-sentences`의 `sent_count`와 반복 쿼리 키(`topics=A&topics=B`), 문장 배열 응답. [랜덤 문장 요청](../apps/web/src/features/syntax-analyzer/api/get-random-sentences.ts)
- `GET /analyzer/remaining-counts`의 `analysis`와 `random_sentence` 수치. [잔여 횟수 요청](../apps/web/src/features/syntax-analyzer/api/get-remaining-counts.ts)

## 로컬 개발

저장소 루트에서 `pnpm install`로 두 앱의 의존성을 설치한다. `pnpm lint`, `pnpm test`, `pnpm build`는 두 앱을 확인하고, `pnpm i18n:check`는 웹 번역을 확인한다.

실제 API와 연동하려면 [서버 환경 변수 예제](../apps/api/.env.example)를 기준으로 `apps/api/.env`에 개발용 Redis와 OpenAI 설정을 입력하고 `CORS_ORIGIN`에 `http://localhost:5173`을 추가한다. [웹 환경 변수 예제](../.env.example)를 기준으로 루트 `.env.local`의 `VITE_API_BASE_URL_DEV`를 `http://localhost:3001`로 설정한다. 루트에서 별도 터미널로 `pnpm dev:api`와 `pnpm dev`를 실행한 뒤 <http://localhost:5173/>을 연다.

## 로컬 목 모드

`pnpm dev:mock`을 실행하고 <http://localhost:5173/analyzer>를 연다. Vite가 위 세 API에 직접 응답한다.

| 실행 명령                                   | 확인할 동작                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev:mock`                             | 초기 잔여 횟수, 요청 개수만큼 샘플 문장 생성, 입력 토큰을 유지한 편집기 이동 |
| `MOCK_API_SCENARIO=slow pnpm dev:mock`      | 약 1.5초 동안 잔여 횟수 로딩, 생성 버튼 로딩, 분석 진행 표시                 |
| `MOCK_API_SCENARIO=error pnpm dev:mock`     | 분석·생성 요청의 HTTP 500, 분석 오류 알림, 요청 종료 후 버튼 복구            |
| `MOCK_API_SCENARIO=exhausted pnpm dev:mock` | 두 잔여 횟수 0회, 분석·생성 버튼 비활성화, 소진 안내                         |

- 분석 성공 시 선택 모델에 따라 1회 또는 2회, 문장 생성 성공 시 문장 수와 관계없이 1회 차감한다. 횟수는 개발 서버 메모리에 저장하며 서버를 다시 시작하면 초기화된다.
- 생성에는 주제와 무관한 고정 문장을 사용한다. 첫 번째 샘플과 입력 토큰이 일치하면 편집기 샘플의 세그먼트 트리를 반환한다. 다른 입력에는 입력 토큰 전체를 감싸는 루트 세그먼트만 반환한다.

### 샘플 분석 확인

1. `/analyzer`에서 문장을 생성하고 첫 번째 문장인 `The idea that she proposed was innovative.`를 분석 입력에 넣는다.
2. 분석을 실행하고 편집기에서 주어·동사 태그와 명사구 안의 관계절 `that she proposed`가 표시되는지 확인한다.
3. `/analyzer`로 돌아가 `I will read.`를 분석하고 편집기에 문장만 표시되는지 확인한다.

## 호환성과 배포 순서

1. 기존 화면이 보낼 요청과 읽을 응답을 확인한다. 필드 이름이나 필수 여부가 바뀐다면 서버에서 기존 요청과 새 요청을 함께 처리하고, 기존 화면이 읽는 응답 필드를 유지하는 구간을 둔다.
2. 기존 프런트엔드와 변경된 서버의 조합을 검증한 뒤 서버를 먼저 배포한다. 새 서버 동작에 의존하는 프런트엔드는 새 조합을 검증한 뒤 배포한다.
3. 기존 프런트엔드로 되돌릴 가능성과 열린 탭, PWA 캐시를 고려해 호환 동작을 제거할 시점을 정한다. 웹과 API를 함께 바꾸는 PR에 배포 순서와 롤백 시 사용할 조합을 기록한다.

Vercel은 저장소 루트의 [설정](../vercel.json)으로 웹을 빌드하고 `apps/web/dist`를 배포한다.

### Koyeb API 배포

- 기존 서비스의 GitHub 소스로 `romantech/syntax-analyzer`의 `main`을 선택한다.
- 빌더는 Dockerfile을 선택하고 경로는 `apps/api/Dockerfile`로 설정한다. 루트 `pnpm-lock.yaml`과 워크스페이스 설정을 사용하므로 Work directory는 비운다. Entrypoint와 Command는 Dockerfile의 기본값을 사용한다.
- 기존 도메인, HTTP 포트 `8000`, 헬스 체크와 [런타임 환경 변수](../apps/api/.env.example)를 유지한다. `NODE_ENV=production`과 포트가 기존 서비스 설정과 일치하는지 확인한다.
- 배포 전 로컬에서는 저장소 루트에서 `docker build -f apps/api/Dockerfile -t syntax-analyzer-api .`로 같은 이미지를 빌드할 수 있다.
- 새 배포가 Healthy 상태가 되면 기존 API 주소의 `/health`와 `/analyzer/remaining-counts`를 확인하고 웹에서 분석과 랜덤 문장 생성을 검증한다.
- 전환 직후 문제가 생기면 Koyeb Deployments에서 `romantech/project-server`의 마지막 Healthy 배포 설정을 선택해 다시 배포한다. 이전 설정의 GitHub 소스와 빌드팩이 적용됐는지 확인한 뒤 기존 API 주소에서 동일한 검증을 반복한다. 전환 이후에는 마지막 정상 모노레포 배포를 같은 방법으로 되돌린다.

[Koyeb GitHub 배포 및 롤백](https://www.koyeb.com/docs/build-and-deploy/deploy-with-git) · [Koyeb 모노레포 설정](https://www.koyeb.com/docs/build-and-deploy/monorepo)

## 배포 전후 확인

- 로컬에서 `pnpm dev`는 `VITE_API_BASE_URL_DEV`를 사용한다. 프리뷰를 포함한 운영 모드 빌드는 `VITE_API_BASE_URL_PROD`를 사용한다. 테스트 서버를 대상으로 할 때는 해당 환경의 값을 설정하고 브라우저 네트워크 탭에서 요청 주소를 확인한다.
- 변경된 기능을 정상 입력과 오류 응답으로 확인한다. 분석 결과는 편집기에서 열고, 토큰과 세그먼트 형식이 바뀌었다면 기존에 저장한 분석도 다시 연다.
- 랜덤 문장은 요청한 개수와 주제 목록이 서버에 전달되는지 확인한다. 분석이나 문장 생성이 성공하면 화면의 잔여 횟수가 갱신되는지 확인한다.
- 문장 수를 비운 상태에서 유효한 토픽을 등록할 수 있고, 중복 또는 최대 개수 초과 시 키워드 입력 아래에 오류가 표시되는지 확인한다.
- 문장 수 입력을 비운 채 생성하면 `sent_count=3`을 사용한다. 범위를 벗어난 값을 입력하면 1~5 범위의 정수로 보정한 값을 표시하고 전송한다.
- 배포 후 실제 화면에서 변경한 경로를 확인한다. 분석과 문장 생성 요청은 할당량을 차감하므로 검증에 필요한 만큼만 호출한다.
