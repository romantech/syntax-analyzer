# 구문 분석 API 변경 가이드

## 계약 확인

요청 필드, 응답 형식, 검증 규칙을 바꿀 때는 프런트엔드 호출부와 `project-server`의 구현을 함께 확인한다. [서버 라우트](https://github.com/romantech/project-server/blob/main/src/routes/analyzer.ts), [입력 검증](https://github.com/romantech/project-server/blob/main/src/validators/analyzer.ts), [API 명세](https://github.com/romantech/project-server#syntax-analyzer)

- `POST /analyzer`의 모델 키와 토큰 배열, `TAnalysis` 응답. [분석 요청](../src/features/syntax-analyzer/api/create-analysis.ts), [응답 타입](../src/features/syntax-editor/types/analysis.ts)
- `GET /analyzer/random-sentences`의 `sent_count`와 반복 쿼리 키(`topics=A&topics=B`), 문장 배열 응답. [랜덤 문장 요청](../src/features/syntax-analyzer/api/get-random-sentences.ts)
- `GET /analyzer/remaining-counts`의 `analysis`와 `random_sentence` 수치. [잔여 횟수 요청](../src/features/syntax-analyzer/api/get-remaining-counts.ts)

## 호환성과 배포 순서

1. 기존 화면이 보낼 요청과 읽을 응답을 확인한다. 필드 이름이나 필수 여부가 바뀐다면 서버에서 기존 요청과 새 요청을 함께 처리하고, 기존 화면이 읽는 응답 필드를 유지하는 구간을 둔다.
2. 기존 프런트엔드와 변경된 서버의 조합을 검증한 뒤 서버를 먼저 배포한다. 새 서버 동작에 의존하는 프런트엔드는 새 조합을 검증한 뒤 배포한다.
3. 기존 프런트엔드로 되돌릴 가능성과 열린 탭, PWA 캐시를 고려해 호환 동작을 제거할 시점을 정한다. 두 저장소를 변경할 때는 PR을 서로 연결하고 배포 순서와 롤백 시 사용할 조합을 기록한다.

## 배포 전후 확인

- 로컬에서 `pnpm dev`는 `VITE_API_BASE_URL_DEV`를 사용한다. 프리뷰를 포함한 운영 모드 빌드는 `VITE_API_BASE_URL_PROD`를 사용한다. 테스트 서버를 대상으로 할 때는 해당 환경의 값을 설정하고 브라우저 네트워크 탭에서 요청 주소를 확인한다.
- 변경된 기능을 정상 입력과 오류 응답으로 확인한다. 분석 결과는 편집기에서 열고, 토큰과 세그먼트 형식이 바뀌었다면 기존에 저장한 분석도 다시 연다.
- 랜덤 문장은 요청한 개수와 주제 목록이 서버에 전달되는지 확인한다. 분석이나 문장 생성이 성공하면 화면의 잔여 횟수가 갱신되는지 확인한다.
- 배포 후 실제 화면에서 변경한 경로를 확인한다. 분석과 문장 생성 요청은 할당량을 차감하므로 검증에 필요한 만큼만 호출한다.
