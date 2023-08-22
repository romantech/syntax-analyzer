![og-image](https://github.com/romantech/syntax-analyzer/assets/8604840/8302c919-aada-4b26-8425-cefe462275de)
> OpenAI API를 이용한 영어 구문 분석 / 편집기
> 
- 배포 링크 : [https://syntax-analyzer.romantech.net](https://syntax-analyzer.romantech.net/)
- 백엔드 레포지토리 : https://github.com/romantech/project-server

# 사용 스택
### Frontend

- **Framework**: React with Typescript
- **UI Library**: Chakra UI
- **CSS Preprocessor**: SCSS
- **Animation**: Framer Motion / Lottie
- **State Management**: Jotai / React Query
- **Form Handling**: React Hook Form / Yup

### Backend

- **Framework**: Express with Typescript
- **Database & Cache**: Redis (using ioredis)

# 주요 기능
1. 영어 구문 분석 : 주어, 동사, 목적어, 절, 구 등 문장 요소 분석
2. 영어 구문 편집기 : 30여 가지 문장 요소 태그를 이용해 문장 구조 시각화
3. 영어 문장 생성 : 입력한 주제와 연관된 랜덤 문장 생성

# 분석 데이터 생성 흐름
```mermaid
sequenceDiagram
    autonumber
    
    participant C as React Client
    participant S as Express Server
    participant R as Redis DB
    participant O as OpenAI API

    C->>S: Request analysis #32;#32;

    activate S

    S->S: Validate request
    Note right of S: Verify IP and fields #32;

    alt Invalid Request
        S-->>C: 400 Bad Request

    else Valid Request
        S->>+R: Get analysis quota
        R-->>-S: Return analysis quota
        S->S: Verify analysis quota
        
        break If Limit Reached
            S-->>C: 400 Limit Exceeded
        end
        
        else Continue
            S->>+R: Retrieve prompt
            R-->>-S: Return prompt

            critical Process with OpenAI
                S->>+O: Create chat completion
                O-->>-S: Return analysis result
            end

            S->>R: Update request count
            Note over S,R: GPT 3.5 reduced by 1#59; GPT 4 reduced by 3 #32;#32;#32;
            
            S-->>C: 200 OK with analysis data
            deactivate S
    end
```

# 스크린샷
#### 홈 화면

![2023-08-22 16 57 08](https://github.com/romantech/syntax-analyzer/assets/8604840/8f2efe41-3f31-4088-97c0-1e0091408ea0)

#### 영어 구문 분석 요청 양식

![analysis-16-9](https://github.com/romantech/syntax-analyzer/assets/8604840/f9396d10-41b8-40ec-9cf5-ff207da980b8)

#### 영어 구문 편집기

![editor-16-9](https://github.com/romantech/syntax-analyzer/assets/8604840/06b08333-cc3f-4768-8bee-72aeadf84992)

#### 랜덤 문장 생성

![generator-16-9](https://github.com/romantech/syntax-analyzer/assets/8604840/566668e1-1546-4428-941f-1b2cda88c21b)

