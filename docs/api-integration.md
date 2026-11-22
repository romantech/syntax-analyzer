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

Vercel 웹과 Koyeb API는 `main`에서 각각 자동 배포된다. 웹이 새 API 계약에 의존하면 API 변경과 웹 전환을 별도 PR로 나눈다. Vercel은 저장소 루트의 [설정](../vercel.json)으로 웹을 빌드하고 `apps/web/dist`를 배포한다.

### API 선배포와 웹 전환

1. **API PR을 먼저 머지한다.** API는 기존 요청과 새 요청을 모두 처리하고 기존 웹이 읽는 응답 필드를 유지한다. 머지 전에 두 계약의 요청·응답과 기존 웹의 동작을 검증한다. 현재 정상인 Vercel·Koyeb 배포 ID와 커밋 SHA를 PR에 기록한다. 웹은 이 단계에서 기존 계약을 계속 사용한다.
2. **Koyeb 운영 배포를 확인한다.** 해당 커밋의 배포가 `Healthy`이고 운영 트래픽을 받는지 확인한다. 운영 API에서 `/health`의 HTTP 200과 `/analyzer/remaining-counts`의 `analysis`, `random_sentence` 응답을 확인한다. 기존 운영 웹에서 분석과 랜덤 문장 생성, 잔여 횟수 갱신을 확인하고 변경된 API 경로는 기존 형식과 새 형식 각각의 요청·응답을 확인한다. 검증에 실패하면 웹 PR 머지를 보류한다.
3. **웹 PR을 머지한다.** API 운영 검증이 끝나면 새 계약을 지원하는 API와 Vercel 프리뷰를 연결해 새 웹을 검증한다. 브라우저 네트워크 탭에서 API 주소와 새 요청·응답 형식을 확인한다. 머지 후에는 해당 Vercel 배포가 운영 도메인에 연결됐는지 확인하고, 운영 웹에서 변경 경로와 오류 응답을 다시 확인한다. 같은 머지로 Koyeb가 다시 배포되면 활성 API에서도 기존 계약과 새 계약을 확인한다. [배포 전후 확인](#배포-전후-확인)

### 호환 기간과 기존 계약 제거

호환 기간은 두 계약을 지원하는 API가 운영에 배포된 시점부터 시작한다. 배포 PR에 호환 종료 예정일과 되돌릴 수 있는 웹·API 조합을 기록한다. 새 웹을 검증한 뒤에도 이전 웹으로 되돌릴 가능성, 열려 있는 탭, PWA에 캐시된 웹을 고려해 두 계약을 유지한다. 기존 형식의 호출이 남아 있는지 확인하고, 롤백 대상 웹도 새 계약을 사용할 수 있게 된 뒤 별도 API PR에서 기존 계약을 제거한다. 기존 웹이 계속 요청할 수 있거나 전환 여부를 확인하기 어렵다면 호환 기간을 연장한다.

### 롤백 순서

- **새 웹 공개 전 API 문제.** Koyeb API를 이전 정상 배포로 되돌려 기존 웹과 이전 API 조합으로 복구한다.
- **새 웹 공개 후 웹 문제.** Vercel 웹을 되돌리고 두 계약을 지원하는 API를 유지한다. API에서 기존 계약을 이미 제거했다면 호환 API를 먼저 복구한 뒤 이전 웹을 배포한다.
- **새 웹 공개 후 API 문제.** 현재 웹과 아직 사용 중인 이전 웹을 모두 지원하는 정상 API 배포로 되돌린다. 해당 배포를 사용할 수 없다면 웹을 먼저 되돌리고 두 계약을 지원하는 API를 수정 배포한다. 열린 탭과 PWA에서 새 웹의 호출이 종료된 것을 확인한 뒤에는 이전 웹과 이전 API 조합으로 되돌릴 수 있다.

- Vercel의 `Instant Rollback`에서는 호환되는 운영 배포를 선택한다. 복구 후 운영 도메인과 커밋을 확인한다. `Instant Rollback` 이후에는 운영 도메인 자동 할당이 중지되므로 수정 배포를 검증한 뒤 `Undo Rollback`에서 해당 배포를 승격한다. [Vercel Instant Rollback](https://vercel.com/docs/instant-rollback)
- Koyeb의 `Deployments`에서 호환되는 정상 배포를 선택해 다시 배포한다. 활성 배포의 커밋과 설정을 확인한다. 해당 빌드로 복구할 수 없다면 호환 계약을 유지하는 수정 또는 되돌리기 PR로 복구한다. 이후 `main` 자동 배포가 문제 버전을 다시 올리지 않도록 원인 변경도 수정하거나 되돌린다. [Koyeb GitHub 배포](https://www.koyeb.com/docs/build-and-deploy/deploy-with-git)
- 각 복구 단계가 끝날 때마다 운영 API의 `/health`와 잔여 횟수 응답을 확인하고, 해당 웹에서 변경 경로를 다시 검증한 뒤 다음 단계로 진행한다.

### Koyeb API 배포

- 기존 서비스의 GitHub 소스로 `romantech/syntax-analyzer`의 `main`을 선택한다.
- 빌더는 Dockerfile을 선택하고 경로는 `apps/api/Dockerfile`로 설정한다. 루트 `pnpm-lock.yaml`과 워크스페이스 설정을 사용하므로 Work directory는 비운다. Entrypoint와 Command는 Dockerfile의 기본값을 사용한다.
- 기존 도메인, HTTP 포트 `8000`, 헬스 체크와 [런타임 환경 변수](../apps/api/.env.example)를 유지한다. `NODE_ENV=production`과 포트가 기존 서비스 설정과 일치하는지 확인한다.
- 배포 전 로컬에서는 저장소 루트에서 `docker build -f apps/api/Dockerfile -t syntax-analyzer-api .`로 같은 이미지를 빌드할 수 있다.
- 새 배포가 Healthy 상태가 되면 기존 API 주소의 `/health`와 `/analyzer/remaining-counts`를 확인하고 웹에서 분석과 랜덤 문장 생성을 검증한다.
- 모노레포 전환 자체를 되돌려야 하면 Koyeb `Deployments`에서 `romantech/project-server`의 마지막 `Healthy` 배포 설정을 선택해 다시 배포한다. 이전 설정의 GitHub 소스와 빌드팩이 적용됐는지 확인한 뒤 기존 API 주소에서 동일한 검증을 반복한다. 모노레포 전환 이후 API 계약 변경에는 위 [롤백 순서](#롤백-순서)를 따른다.

[Koyeb 모노레포 설정](https://www.koyeb.com/docs/build-and-deploy/monorepo)

## 배포 전후 확인

- 로컬에서 `pnpm dev`는 `VITE_API_BASE_URL_DEV`를 사용한다. 프리뷰를 포함한 운영 모드 빌드는 `VITE_API_BASE_URL_PROD`를 사용한다. 테스트 서버를 대상으로 할 때는 해당 환경의 값을 설정하고 브라우저 네트워크 탭에서 요청 주소를 확인한다.
- 변경된 기능을 정상 입력과 오류 응답으로 확인한다. 분석 결과는 편집기에서 열고, 토큰과 세그먼트 형식이 바뀌었다면 기존에 저장한 분석도 다시 연다.
- 랜덤 문장은 요청한 개수와 주제 목록이 서버에 전달되는지 확인한다. 분석이나 문장 생성이 성공하면 화면의 잔여 횟수가 갱신되는지 확인한다.
- 문장 수를 비운 상태에서 유효한 토픽을 등록할 수 있고, 중복 또는 최대 개수 초과 시 키워드 입력 아래에 오류가 표시되는지 확인한다.
- 문장 수 입력을 비운 채 생성하면 `sent_count=3`을 사용한다. 범위를 벗어난 값을 입력하면 1~5 범위의 정수로 보정한 값을 표시하고 전송한다.
- 배포 후 실제 화면에서 변경한 경로를 확인한다. 분석과 문장 생성 요청은 할당량을 차감하므로 검증에 필요한 만큼만 호출한다.
