# Chakra UI v2 회귀 검증 기준

[Chakra UI v3 전환 계획](https://github.com/romantech/syntax-analyzer/issues/116)과 [1단계 검증 결과](https://github.com/romantech/syntax-analyzer/issues/139)를 기준으로 전환 전후 동작을 비교한다.

- 기준 커밋 `c1eea56` · Chakra UI `2.10.10` · Node.js `26.13.1` · pnpm `12.22.0`
- `pnpm dev`의 로컬 앱을 Playwright로 실행
- 데스크톱 Chrome 158.0.8127.37 · 1440×900 · 마우스와 키보드
- 모바일 WebKit 27.2 · iPhone 15 에뮬레이션 · 393×659 CSS 뷰포트 · 터치와 키보드

## 테마와 화면

| 검증        | 재현 절차와 결과                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| 기본 테마   | 새 브라우저 프로필에서 홈을 열면 다크 모드. 본문 배경 `rgb(26, 32, 44)`                                  |
| 테마 복원   | 헤더의 `Toggle color mode`로 라이트 전환 후 새로고침. `chakra-ui-color-mode` 값 `light`와 흰색 배경 유지 |
| 화면별 테마 | `/`, `/analyzer`, `/editor`, `/editor/sample/0`을 두 모드에서 열어 각 화면의 테마 적용 확인              |
| 글꼴        | 두 브라우저에서 `Pretendard Variable`이 본문 글꼴 목록의 첫 항목이고 웹폰트가 로드됨                     |

## 분석 폼과 무작위 문장

- 분석에 `Hi`를 입력하고 제출하면 최소 3단어 오류 문구와 `aria-invalid`가 표시됨
- 고급 모델을 선택하고 `Bamboo grows quickly here.`를 제출하면 확인 모달이 열리고 `취소`로 초기 포커스 이동
- 취소하면 요청 없이 닫힘. 확인 후 500 응답에는 오류 토스트, 성공 응답에는 로딩 중 입력 비활성화 후 편집기 이동과 성공 토스트 표시
- `Forest`를 등록 후 삭제하고 `Bamboo`를 등록. 문장 수를 1로 직접 입력하고 ↑로 2로 바꾸면 생성 요청에 입력값 반영
- 생성 결과를 눌렀을 때 문장 전체를 복사 API에 전달. 성공 토스트 자동 닫힘과 복사 실패 토스트 표시를 확인

API 검증에는 서비스 워커를 차단한 브라우저 컨텍스트를 사용했다. `VITE_API_BASE_URL_DEV`를 로컬 주소로 지정하고 `GET /analyzer/remaining-counts`에 `{"analysis":8,"random_sentence":8}`, `GET /analyzer/random-sentences`에 문자열 배열, `POST /analyzer`에 500 또는 정상 `TAnalysis` 응답을 사용했다. 복사는 브라우저의 `writeText`를 대체해 전달 문자열과 실패 처리를 확인했다. [API 계약과 테스트 환경 설정](api-integration.md)

## 편집기와 저장

1. 테스트 프로필에서 아래 문장을 저장하고 `/editor`의 `추가한 문장` 탭을 연다. 문장을 누르면 확인 모달의 `취소`로 초기 포커스가 가고, `확인`으로 편집기가 열린다.
2. `목적어`를 선택한다. 데스크톱은 토큰 사이를 드래그하고, 모바일은 두 토큰을 탭한 뒤 `적용`을 누른다.
3. `warming is`에는 교차 범위 안내가 표시되고 태그가 추가되지 않는다. `Global warming is`에는 목적어가 추가된다.
4. 초기화 팝오버에서 `취소`를 누르면 편집 내용이 남는다. 저장 팝오버에서 `확인`을 누르면 `저장 성공` 토스트가 표시된다.
5. 새로고침한 뒤 문장 목록으로 돌아가 항목을 다시 열어 저장한 목적어 태그가 남아 있는지 확인한다.

- 모바일 시트에서 태그를 고르면 시트가 닫히고 포커스가 `구문 문장` 영역으로 이동
- 단어를 선택한 뒤 시트를 다시 열고 닫기 버튼이나 Esc로 닫으면 선택 범위 유지 및 `태그 선택` 버튼으로 포커스 복귀
- 태그 적용 후 문장 영역으로 포커스 복귀
- v2 저장·초기화 팝오버는 실제 버튼 외에 감싸는 요소에도 `role="button"`이 있어 같은 이름으로 두 요소가 노출됨. 공통 UI 전환 때 트리거의 접근성 확인. [ConfirmPopover 구현](../src/base/components/modal/confirm-popover.tsx)

<details>
<summary>태깅과 저장 재현용 데이터</summary>

데이터가 없는 테스트 프로필에서 앱 주소를 열고 콘솔에서 실행한다. 실행 후 새로고침한다.

```js
const segment = (id, begin, end, elementId, label, abbreviation, type) => ({
  id,
  begin,
  end,
  children: [],
  constituents: [{ id: id + 100, elementId, label, abbreviation, type }],
});

localStorage.setItem(
  'userAnalysisList',
  JSON.stringify([
    {
      id: 'chakra-v2-demo',
      source: 'user',
      createdAt: '2023-05-10T00:00:00.000Z',
      sentence: ['Global', 'warming', 'is', 'a', 'significant', 'issue', '.'],
      isAnalyzedByGPT: false,
      rootSegment: {
        id: 100,
        begin: 0,
        end: 7,
        constituents: [],
        children: [
          segment(101, 0, 2, 1, 'subject', 's', 'token-group'),
          segment(102, 2, 3, 2, 'verb', 'v', 'token'),
          segment(103, 3, 6, 8, 'complement', 'c', 'token-group'),
        ],
      },
    },
  ]),
);
```

</details>

## 검증 범위

- `pnpm lint`, `pnpm test` 5개, `pnpm build` 통과
- 실제 iPhone Safari, 운영 API, OS 클립보드 연결은 배포 전 검증 범위로 남김
