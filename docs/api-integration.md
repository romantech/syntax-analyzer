# 구문 분석 API 변경 가이드

## 계약 확인

요청 필드, 응답 형식, 검증 규칙을 바꿀 때는 프런트엔드 호출부와 Express 구현을 함께 확인한다. [서버 라우트](../apps/api/src/routes/analyzer.ts) · [입력 검증](../apps/api/src/validators/analyzer.ts) · [API 명세](../apps/api/README.md)

- `POST /analyzer`의 모델 키와 토큰 배열, `TAnalysis` 응답. [분석 요청](../apps/web/src/features/syntax-analyzer/api/create-analysis.ts) · [응답 타입](../apps/web/src/features/syntax-editor/types/analysis.ts)
- `GET /analyzer/random-sentences`의 정수 쿼리 `sent_count`, `max_chars`, 주제 배열(`topics=A&topics=B` 또는 `topics[]=A&topics[]=B`), 문장 배열 응답. [랜덤 문장 요청](../apps/web/src/features/syntax-analyzer/api/get-random-sentences.ts)
- `GET /analyzer/remaining-counts`의 `analysis`와 `random_sentence` 수치. [잔여 횟수 요청](../apps/web/src/features/syntax-analyzer/api/get-remaining-counts.ts)

## 로컬 개발

저장소 루트에서 `pnpm install`로 두 앱의 의존성을 설치한다. `pnpm lint`, `pnpm test`, `pnpm build`는 두 앱을 확인하고, `pnpm i18n:check`는 웹 번역을 확인한다.

실제 API와 연동하려면 [서버 환경 변수 예제](../apps/api/.env.example)를 기준으로 `apps/api/.env`에 개발용 Redis와 OpenAI 설정을 입력한다. 루트에서 별도 터미널로 `pnpm dev:api`와 `pnpm dev`를 실행한 뒤 <http://localhost:5173/>을 연다.

`NODE_ENV`, `OPENAI_API_KEY`, 랜덤 문장 생성용 `MODEL_FAST`가 필요하다. 개발에서 `PORT`를 생략하면 3001을 사용하고, 운영에서는 서비스 포트를 명시한다. Redis 호스트와 포트를 생략하면 `localhost:6379`를 사용한다. 잘못된 필수 설정이 있으면 API는 변수 이름을 기록하고 Redis에 연결하기 전에 종료한다.

분석은 기본값인 `gpt-6-luna`의 `low` 추론 설정과 Structured Outputs를 사용한다. 서버는 검증한 태그 범위로 `TAnalysis`를 구성한다. 다른 호환 모델을 지정하려면 `MODEL_ANALYSIS_BASIC`에 모델 ID를 입력한다. 웹은 이전 API와 호환되는 `fast-ft` 키를 보낸다. API는 기존 클라이언트의 `primary`와 `primary-ft` 요청도 동일한 모델로 분석하고 성공 시 1회 차감한다.

실제 API를 실행하거나 배포하기 전에 Redis의 `analyzer:prompt` 해시에 `analysis_structured`와 `analysis_structured_retry`를 등록한다. 첫 필드에는 분석용 시스템 프롬프트를, 두 번째 필드에는 범위 검증 실패 시 덧붙일 재시도 지시문을 입력한다. 요청마다 두 필드를 함께 읽으므로 저장값이 바뀌면 다음 요청부터 적용된다. 필드가 없거나 공백이면 HTTP 500을 반환하고 할당량을 복구한다.

서버는 기본 프롬프트와 재시도 프롬프트에 [학습용 태그 규칙](../apps/api/src/services/openAI/structuredAnalysis.ts)을 덧붙인다. 새 태그는 기존 `constituents` 배열에 같은 형식으로 들어간다. 기존 Redis 필드를 그대로 사용할 수 있으며, 웹은 이전 API의 응답도 읽으므로 두 앱을 독립적으로 배포할 수 있다.

태그 범위가 유효하지 않으면 같은 분석 요청에서 한 번 다시 생성한다. 응답을 끝내 검증하지 못하면 HTTP 502를 반환하고 할당량을 복구한다.

Vite 개발 서버는 `/api/`로 시작하는 요청에서 접두사를 제거하고 기본적으로 `http://localhost:3001`로 전달한다. 개발 API 포트를 바꾸면 아래의 `API_PROXY_TARGET`도 맞춘다. 같은 네트워크의 모바일에서는 Vite가 출력한 `Network` 주소로 접속한다. 웹 `.env.local`에 개발 API 주소를 넣거나 Express의 `CORS_ORIGIN`에 모바일 접속 주소를 추가할 필요가 없다.

로컬 API는 직접 연결과 Vite 프록시 연결에서 Express 소켓의 상대 주소를 IP별 할당량에 사용한다. 같은 Vite 서버를 거친 PC와 모바일은 Vite에서 API로 연결하는 주소를 공유한다. 로컬 API는 전달 헤더를 무시한다.

다른 API 서버를 테스트하려면 `API_PROXY_TARGET=https://api.example.com pnpm dev`로 Vite를 실행한다. 기존 `.env.local`에 `VITE_API_BASE_URL_DEV`가 있으면 제거해도 된다.

HTTP 테스트는 운영과 같은 `createServer`에서 라우트와 오류 처리 미들웨어를 조립한다. Redis 통합 테스트는 전용 로컬 Redis를 실행한 뒤 `REDIS_TEST_PORT=6379 pnpm --filter syntax-analyzer-api test`로 실행한다. 모델 호출은 테스트에서 대체한다. GitHub Actions는 테스트용 Redis를 제공한다.

## 로컬 목 모드

`pnpm dev:mock`을 실행하고 <http://localhost:5173/analyzer>를 연다. Vite가 `/api`로 시작하는 세 분석 API 요청에 직접 응답한다.

| 실행 명령                                   | 확인할 동작                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev:mock`                             | 초기 잔여 횟수, 요청 개수만큼 샘플 문장 생성, 입력 토큰을 유지한 편집기 이동 |
| `MOCK_API_SCENARIO=slow pnpm dev:mock`      | 약 1.5초 동안 잔여 횟수 로딩, 생성 버튼 로딩, 분석 진행 표시                 |
| `MOCK_API_SCENARIO=error pnpm dev:mock`     | 분석·생성 요청의 HTTP 500, 분석 오류 알림, 요청 종료 후 버튼 복구            |
| `MOCK_API_SCENARIO=exhausted pnpm dev:mock` | 두 잔여 횟수 0회, 분석·생성 버튼 비활성화, 소진 안내                         |

- 분석과 문장 생성은 각각 성공한 요청당 1회 차감한다. 횟수는 개발 서버 메모리에 저장하며 서버를 다시 시작하면 초기화된다.
- 생성에는 주제와 무관한 고정 문장을 사용한다. 첫 번째 샘플과 입력 토큰이 일치하면 편집기 샘플의 세그먼트 트리를 반환한다. 다른 입력에는 입력 토큰 전체를 감싸는 루트 세그먼트만 반환한다.

### 샘플 분석 확인

1. `/analyzer`에서 문장을 생성하고 첫 번째 문장인 `The idea that she proposed was innovative.`를 분석 입력에 넣는다.
2. 확인 모달에서 `분석`을 누르고 편집기에서 주어·동사 태그와 명사구 안의 관계절 `that she proposed`가 표시되는지 확인한다.
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
- 기존 도메인, HTTP 포트 `8000`과 [런타임 환경 변수](../apps/api/.env.example)를 유지한다. `NODE_ENV=production`과 포트가 기존 서비스 설정과 일치하는지 확인한다.
- Koyeb 서비스의 `Settings` → `Health checks`에서 포트 `8000`의 검사 방식을 `HTTP`, 메서드를 `GET`, 경로를 `/health`로 지정하고 `Deploy`로 적용한다. `/health`는 API 프로세스의 HTTP 응답을 확인한다. Koyeb는 연속 실패가 설정된 기준에 도달하면 인스턴스를 재시작하므로 Redis 준비 상태는 별도로 확인한다. [Koyeb 헬스 체크](https://www.koyeb.com/docs/run-and-scale/health-checks)
- API는 시작 시 Redis `PING`이 성공한 뒤 포트 `8000`에서 요청을 받는다. `PING`이 실패하거나 10초 안에 응답하지 않으면 포트를 열기 전에 종료한다. 새 배포가 `Healthy`가 되지 않으면 인스턴스 로그에서 Redis 초기화 오류를 확인한다.
- `GET /ready`는 운영 배포 확인과 Redis 의존성 모니터링에 사용한다. Redis가 `PING`에 1초 안에 응답하면 HTTP 200, 연결이 끊겼거나 오류가 났거나 응답이 늦으면 HTTP 503을 반환한다. Redis가 복구되면 다음 확인에서 HTTP 200으로 돌아온다.
- 배포 전 로컬에서는 저장소 루트에서 `docker build -f apps/api/Dockerfile -t syntax-analyzer-api .`로 같은 이미지를 빌드할 수 있다.
- 새 배포가 `Healthy` 상태가 되면 기존 API 주소의 `/health`와 `/ready`가 HTTP 200을 반환하고 `/analyzer/remaining-counts`에 `analysis`, `random_sentence`가 있는지 확인한다. 웹에서 분석과 랜덤 문장 생성도 검증한다.
- 모노레포 전환 자체를 되돌려야 하면 Koyeb `Deployments`에서 `romantech/project-server`의 마지막 `Healthy` 배포 설정을 선택해 다시 배포한다. 이전 설정의 GitHub 소스와 빌드팩이 적용됐는지 확인한 뒤 기존 API 주소에서 동일한 검증을 반복한다. 모노레포 전환 이후 API 계약 변경에는 위 [롤백 순서](#롤백-순서)를 따른다.

[Koyeb 모노레포 설정](https://www.koyeb.com/docs/build-and-deploy/monorepo)

#### AI 요청 시간 제한과 서버 종료

- 분석과 랜덤 문장 생성에는 요청마다 45초를 적용한다. 최초 모델 호출과 재시도가 이 시간을 공유한다. 시간 안에 끝나지 않으면 API는 모델 호출을 취소하고 Redis 할당량을 원복한 뒤 HTTP 504를 반환한다. 클라이언트가 먼저 연결을 닫아도 호출을 취소하고 원복한다.
- `SIGTERM` 또는 `SIGINT`를 받으면 신규 연결 수신을 중단하고 진행 중인 요청에 최대 20초를 준다. 그때까지 끝나지 않은 AI 요청은 취소하고, 아직 연결된 클라이언트에는 원복 후 HTTP 503을 반환한다. 완료된 요청의 차감은 유지한다.
- HTTP 연결과 할당량 원복을 기다린 뒤 Redis 연결을 닫는다. Redis 장애 등으로 신호 수신 후 25초 안에 정리가 끝나지 않으면 남은 연결을 강제로 닫고 오류를 기록한다. 이때 Redis에 반영되기 전인 원복은 유실될 수 있다. [Koyeb 인스턴스 종료](https://www.koyeb.com/docs/reference/instances#what-happened-when-an-instance-stops)

### IP별 할당량과 운영 도메인

- Koyeb가 주입하는 `KOYEB_APP_ID`가 있으면 분석·문장 생성·잔여량 조회는 공용 HTTP 엣지가 추가한 `X-Forwarded-For`의 마지막 주소만 사용한다. 이 주소가 없거나 IP 형식이 아니면 HTTP 400을 반환한다. `KOYEB_APP_ID`는 로컬이나 다른 환경에 수동으로 설정하지 않는다. [엣지 헤더 정책](https://www.koyeb.com/docs/reference/edge-network#headers-that-koyeb-sets) · [Koyeb 기본 환경 변수](https://www.koyeb.com/docs/build-and-deploy/environment-variables)
- `koyeb-api.romantech.net`을 Cloudflare `DNS only`로 운영할 때는 CNAME을 Koyeb Domains에 표시된 값으로 지정하고 `ANALYZER_CLOUDFLARE_CIDRS`를 비운다. 사용자 요청은 Koyeb 공용 HTTP 엣지로 전달한다. [Koyeb 도메인 연결](https://www.koyeb.com/docs/run-and-scale/domains) · [Cloudflare 프록시 상태](https://developers.cloudflare.com/dns/proxy-status/)
- Cloudflare 프록시를 켤 때는 Koyeb의 `ANALYZER_CLOUDFLARE_CIDRS`에 Cloudflare가 공표한 IPv4·IPv6 CIDR을 쉼표로 구분해 설정하고 변경 시 갱신한다. Koyeb가 확인한 마지막 주소가 이 대역에 속한 경우에만 `CF-Connecting-IP`를 사용한다. 이 헤더가 없거나 유효한 IP가 아니면 HTTP 400을 반환한다. 방문자 IP 헤더를 제거하거나 `CF-Connecting-IP`를 덮어쓰는 Cloudflare 설정은 끈다. `/analyzer` 경로는 프록시에서 캐시하지 않는다. [Cloudflare IP 대역](https://www.cloudflare.com/ips/) · [Cloudflare 방문자 IP 헤더](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip)

### 브라우저별 할당량

- 세 분석 API에 `X-Analyzer-Browser: 1`을 보내면 API가 서명된 익명 쿠키를 발급하거나 기존 쿠키를 검증한다. 키는 브라우저에 30일간 남으며 같은 브라우저에서 네트워크가 바뀌어도 이어진다. 운영 쿠키는 HTTPS에서 `Secure`, `HttpOnly`, `SameSite=Lax`로 발급한다.
- 분석·문장 생성의 기본 한도와 IP별 상한은 각각 10·20회다. 같은 IP를 쓰는 브라우저는 이 IP 상한을 공유한다. 서비스 전체 한도는 50·100회다. 브라우저·IP는 24시간 단위로 집계하고 전체 한도는 한국 시간 자정에 갱신한다. 잔여량은 세 값 중 가장 작은 값이다. 모델 처리 실패 시 확보한 할당량을 세 한도에 원복한다.
- 헤더가 없는 구버전 호출과 서명 시크릿이 비어 있는 환경은 기존 IP 기반 기본 한도와 응답 형식을 사용한다. IP별 상한은 구버전 요청과 새 요청이 공유하며 새 API를 배포한 시점부터 집계한다.
- API 선배포 시 Koyeb에 `ANALYZER_COOKIE_SECRET`을 설정한다. 32바이트 이상의 무작위 값을 만들어 여러 인스턴스와 재배포에서 같은 값을 사용한다. 값이 바뀌면 기존 쿠키가 무효화된다. 로컬에서도 브라우저 할당량을 확인하려면 `apps/api/.env`에 개발용 시크릿을 설정한다.
- 운영 웹과 API는 같은 사이트의 HTTPS 주소를 사용한다. `CORS_ORIGIN`에 실제 웹 오리진을 지정하고, 같은 사이트의 웹 주소에서 API 주소로 쿠키가 전송되는 것을 확인한 뒤 웹을 전환한다. [자격 증명을 포함하는 교차 오리진 요청](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#requests_with_credentials)
- 배포 후 같은 네트워크의 별도 브라우저 두 개에서 IP 잔여량을 공유하는지 확인한다. 한 브라우저에서 사용한 뒤 다른 네트워크로 바꾸고, 전체 및 IP 상한에 여유가 있을 때 잔여량이 이어지는지 확인한다.

### API 요청 로그

- 응답의 `X-Request-Id`로 인스턴스 로그에서 해당 요청을 찾는다. 요청 로그에는 서버가 생성한 ID, HTTP 메서드, 허용된 경로, 상태 코드, 처리 시간과 분류 가능한 오류 유형을 기록한다.
- 4xx는 `warn`, 5xx는 `error` 수준으로 기록한다. 쿼리, 요청 본문, 요청 헤더, 모델 응답과 외부 오류 원문은 요청 로그에 포함하지 않는다.

## 배포 전후 확인

- 프리뷰를 포함한 운영 모드 빌드는 `VITE_API_BASE_URL_PROD`를 사용한다. 배포 환경에 맞는 값을 설정하고 브라우저 네트워크 탭에서 요청 주소를 확인한다.
- 변경된 기능을 정상 입력과 오류 응답으로 확인한다. 분석 결과는 편집기에서 열고, 토큰과 세그먼트 형식이 바뀌었다면 기존에 저장한 분석도 다시 연다.
- 랜덤 문장은 요청한 개수와 주제 목록이 서버에 전달되는지 확인한다. 분석이나 문장 생성이 성공하면 화면의 잔여 횟수가 갱신되는지 확인한다.
- 문장 수를 비운 상태에서 유효한 토픽을 등록할 수 있고, 중복 또는 최대 개수 초과 시 키워드 입력 아래에 오류가 표시되는지 확인한다.
- 문장 수 입력을 비운 채 생성하면 `sent_count=3`을 사용한다. 범위를 벗어난 값을 입력하면 1~5 범위의 정수로 보정한 값을 표시하고 전송한다.
- 배포 후 실제 화면에서 변경한 경로를 확인한다. 분석과 문장 생성 요청은 할당량을 차감하므로 검증에 필요한 만큼만 호출한다.
