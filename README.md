
# O! 답 - 수학 학습 AI 서비스 

## 1. 프로젝트 개요

### 📋 서비스 개요
- 단계별 풀이를 통해 논리적인 추론과정을 배울 수 있는 수학 학습 AI
- 프로젝트 기간: 2025/04/14 ~ 2025/05/22 (총 38일간)

### 💰 서비스 특징
1. 수학 문제 이미지 인식 및 분석
2. 단계별 상세한 해설 제공
3. 유사 문제 추천 및 학습
4. 문제 수정 및 커스터마이징 기능

### ��팀원 정보 및 업무 분담 내역

| 이름           | 역할 및 구현 기능                    |
| -------------- | ------------------------------------ |
| 🟥이동영(팀장) | **개발**<br>- 개발<br>- 개발<br>- 개발 |
| 🟧진종수(팀원) | **개발**<br>- 개발<br>- 개발<br>- 개발 |
| 🟩함동건(팀원) | **풀스택**<br>- 카카오 OAuth<br>- JWT 토큰 인증<br>- 유저 관리 |
| 🟦배한진(팀원) | **개발**<br>- 개발<br>- 개발<br>- 개발 |
| 🟥유승호(팀원) | **개발**<br>- 개발<br>- 개발<br>- 개발 |
| 🟨이다영(팀원) | **Infra**<br>- CI/CD 파이프라인 구축<br>- Docker 컨테이너화<br>- AWS 배포 관리<br>- 풀스택 및 랜딩페이지 |

## 2. 기획 배경

### 문제 상황 및 해결 방안

1. **수학 학습의 어려움**
   - 단계별 풀이 과정 이해 부족
   - 해설: AI 기반 단계별 상세 해설 제공
   - 유사 문제 추천으로 학습 효과 증대

2. **개인별 학습 속도 차이**
   - 해결: 맞춤형 문제 난이도 조정
   - 학습 진도 추적 및 분석
   - 개인별 학습 패턴 분석

## 3. 설계 및 구현

### 🛠 기술 스택

[기술 스택 배지들...]

### 🖼️아키텍쳐 설계

<img src="/docs/아키텍처.png" alt="아키텍처" width="700px" height="500px">

### 💾데이터베이스 모델링(ERD)

<img src="/docs/ERD.png" alt="ERD" width="700px" height="500px">

### 📝요구사항 명세서

https://beneficial-cheese-641.notion.site/1e526951ec2780febd49f5dd299f3714?v=1e526951ec2781108a74000cd4620949&pvs=4

### 📄API명세서

https://beneficial-cheese-641.notion.site/API-1e526951ec2780adae1be21a16134169?pvs=4

### 🗂️프로젝트 폴더 구조

```
project/
├── client/ # 프론트엔드 (Next.js)
│ ├── app/ # Next.js 14 App Router
│ │ ├── problem-uploader/ # 문제 업로드 페이지
│ │ ├── dashboard/ # 대시보드 페이지
│ │ ├── settings-page/ # 설정 페이지
│ │ ├── study/ # 학습 페이지
│ │ ├── problem-solver/ # 문제 풀이 페이지
│ │ ├── login/ # 로그인 페이지
│ │ ├── concept-browser/ # 개념 브라우저
│ │ ├── review/ # 복습 페이지
│ │ ├── mistake-tracker/ # 오답 노트
│ │ ├── question/ # 문제 페이지
│ │ ├── review-schedule/ # 복습 일정
│ │ ├── page.tsx # 메인 페이지
│ │ ├── layout.tsx # 레이아웃 컴포넌트
│ │ ├── loading.tsx # 로딩 컴포넌트
│ │ └── not-found.tsx # 404 페이지
│ ├── components/ # 재사용 가능한 컴포넌트
│ ├── hooks/ # 커스텀 훅
│ ├── lib/ # 유틸리티 함수
│ ├── public/ # 정적 파일
│ ├── styles/ # 전역 스타일
│ ├── types/ # TypeScript 타입 정의
│ ├── contexts/ # Context API
│ ├── package.json # 의존성 관리
│ ├── next.config.js # Next.js 설정
│ ├── tailwind.config.ts # Tailwind CSS 설정
│ └── tsconfig.json # TypeScript 설정
│
├── server/ # 백엔드 (Spring Boot)
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/
│ │ │ │ └── com/
│ │ │ │ └── ssafy/
│ │ │ │ └── odab/
│ │ │ │ ├── mcpLLM/ # LLM 관련 코드
│ │ │ │ │ ├── service/ # LLM 서비스 로직
│ │ │ │ │ ├── dto/ # LLM 데이터 전송 객체
│ │ │ │ │ ├── controller/ # LLM API 컨트롤러
│ │ │ │ │ ├── rag/ # RAG(Retrieval-Augmented Generation) 구현
│ │ │ │ │ ├── mcpServer/ # MCP 서버 관련 코드
│ │ │ │ │ ├── toolFactory/# 도구 생성 팩토리
│ │ │ │ │ ├── config/ # LLM 설정
│ │ │ │ │ └── image/ # 이미지 처리 관련
│ │ │ │ │
│ │ │ │ ├── domain/ # 도메인 모델
│ │ │ │ │ ├── user/ # 사용자 도메인
│ │ │ │ │ ├── question_result/# 문제 결과 도메인
│ │ │ │ │ ├── question/ # 문제 도메인
│ │ │ │ │ ├── learning/ # 학습 도메인
│ │ │ │ │ ├── main/ # 메인 도메인
│ │ │ │ │ ├── concept/ # 개념 도메인
│ │ │ │ │ └── image/ # 이미지 도메인
│ │ │ │ │
│ │ │ │ ├── common/ # 공통 코드
│ │ │ │ │ ├── service/ # 공통 서비스
│ │ │ │ │ ├── config/ # 공통 설정
│ │ │ │ │ ├── controller/ # 공통 컨트롤러
│ │ │ │ │ ├── dto/ # 공통 DTO
│ │ │ │ │ └── repository/ # 공통 레포지토리
│ │ │ │ │
│ │ │ │ └── Test/ # 테스트 코드
│ │ │ └── resources/
│ │ └── test/
│ ├── build.gradle # Gradle 빌드 설정
│ └── Dockerfile # 백엔드 도커파일
│
├── python-server/ # AI 모델 서버
│ ├── app/
│ │ ├── models/ # AI 모델 관련 코드
│ │ ├── routers/ # API 라우터
│ │ ├── main.py # 메인 애플리케이션
│ │ ├── faiss_server.py # 벡터 검색 서버
│ │ └── build_index.py # 인덱스 빌드 스크립트
│ ├── requirements.txt # Python 의존성
│ └── Dockerfile # Python 서버 도커파일
│
├── nginx/ # Nginx 설정
│ ├── conf.d/ # Nginx 설정 파일
│ └── Dockerfile # Nginx 도커파일
│
├── exec/ # 산출물
│
├── docker-compose.yml # 메인 도커 컴포즈
├── docker-compose.canary.yml # 카나리 배포용 컴포즈
└── docker-compose.nginx.yml # Nginx 설정용 컴포즈
```


## 3. 기능 상세 설명

### 1. 문제 업로드 및 분석
<img src="/docs/problem-upload.gif" alt="문제 업로드" />

- 이미지 기반 수학 문제 인식
- OCR 기술을 활용한 텍스트 추출
- AI 모델을 통한 문제 유형 분류
- 단계별 해설 자동 생성

### 2. 단계별 해설 제공
<img src="/docs/solution-step.gif" alt="단계별 해설" />

- 문제 풀이 과정의 단계별 상세 설명
- 수식 및 그래프 시각화
- 핵심 개념 설명 및 관련 공식 제시
- 오답 노트 기능

### 3. 유사 문제 추천
<img src="/docs/similar-problems.gif" alt="유사 문제 추천" />

- AI 기반 유사 문제 검색
- 난이도별 문제 추천
- 학습 진도에 따른 맞춤형 문제 제공
- 오답 유형별 연습 문제 추천

### 4. 문제 커스터마이징
<img src="/docs/customize-problem.gif" alt="문제 커스터마이징" />

- 문제 수정 및 저장 기능
- 개인별 문제집 생성
- 문제 난이도 조정
- 커스텀 해설 작성

# Front-End

## ✅ 문제 업로더

### 1️⃣ 이미지 업로드 컴포넌트
- **React State Management**
  - `useState`를 활용한 이미지 미리보기 관리
  - 드래그 앤 드롭 기능 구현
  - 이미지 크기 최적화

### 2️⃣ 문제 분석 결과 표시
- **컴포넌트 구조**
  - 문제 텍스트 표시
  - 수식 렌더링
  - 단계별 해설 UI

## ✅ 문제 풀이 인터페이스

### 1️⃣ 단계별 해설 표시
- **상태 관리**
  - 현재 단계 추적
  - 해설 표시/숨김 토글
  - 진행 상태 저장

### 2️⃣ 유사 문제 추천
- **데이터 페칭**
  - React Query를 활용한 데이터 관리
  - 무한 스크롤 구현
  - 캐싱 전략

# Back-End

## ✅ AI 모델 서버

### 1️⃣ 문제 분석 API
- **Claude API 연동**
  - 이미지 기반 문제 인식
  - 수식 추출 및 변환
  - 해설 생성

### 2️⃣ 유사 문제 검색
- **벡터 데이터베이스**
  - 문제 유사도 계산
  - 실시간 검색 최적화
  - 캐시 전략

## ✅ 사용자 관리

### 1️⃣ 인증 시스템
- **Spring Security**
  - JWT 기반 인증
  - OAuth2 소셜 로그인
  - 권한 관리

# Infra

## ✅ 배포 환경 구축 (담당: 이다영)

### 1️⃣ 웹서버
- **NGINX**를 사용한 블루/그린 무중단 배포
- HTTPS 적용 및 라우팅 설정
- 정적 파일 서빙 최적화

### 2️⃣ CI/CD 파이프라인
- **Docker & Docker-compose**
  - 마이크로서비스 아키텍처
  - 컨테이너 오케스트레이션
  - 환경별 설정 관리

- **Jenkins**
  - 자동화된 빌드 및 배포
  - 테스트 자동화
  - 배포 모니터링

- **Mattermost 알림**
  - 배포 상태 실시간 알림
  - 에러 로그 모니터링
  - 팀 협업 효율화

# 4. 팀원 소개

<div align="center">
  <!-- 첫 번째 줄 - 3명 -->
  <table style="width: 100%; table-layout: fixed;">
    <tr>
      <th align="center" width="33.33%">FullStack</th>
      <th align="center" width="33.33%">Backend</th>
      <th align="center" width="33.33%">Backend</th>
    </tr>
    <tr>
      <td align="center">
        <img src="/docs/dongyoung.png" alt="동영 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/dongschiken">이동영</a> 🦫
      </td>
      <td align="center">
        <img src="/docs/jongsu.png" alt="종수 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/doros508">진종수</a> 🦊
      </td>
      <td align="center">
        <img src="/docs/donggun.png" alt="동건 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/hamdonggun">함동건</a> 🐯
      </td>
    </tr>
    <tr>
      <td align="center">
        <div>수달이처럼 열심히 일하는 풀스택 팀장</div>
      </td>
      <td align="center">
        <div>여우처럼 영리한 풀스택 개발자</div>
      </td>
      <td align="center">
        <div>호랑이처럼 용맹한 풀스택 개발자</div>
      </td>
    </tr>
    <tr>
      <td align="center">
        <ul>
          <li>🫀 책임감 있고 팀에 주인의식을 가지는 리더</li>
          <li>⭐️ 다양한 오류에 대한 문제해결 능력</li>
          <li>👩🏻‍💻 학습속도가 빠르고 기본기가 탄탄합니다.</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>👀 다양한 영역에 대한 통찰력과 이해력</li>
          <li>😎 맡은 일을 책임감 있게 해냅니다.</li>
          <li>🧑‍💻 기술 도입에 신중하며 합리적인 판단능력</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>🔧 문제해결 능력이 뛰어납니다</li>
          <li>💪 끈기있게 도전하는 자세</li>
          <li>👨‍💻 코드 최적화에 대한 열정</li>
        </ul>
      </td>
    </tr>
  </table>

  <!-- 두 번째 줄 - 3명 -->
  <table style="margin-top: 20px; width: 100%; table-layout: fixed;">
    <tr>
      <th align="center" width="33.33%">FullStack</th>
      <th align="center" width="33.33%">FullStack</th>
      <th align="center" width="33.33%">Infra</th>
    </tr>
    <tr>
      <td align="center">
        <img src="/docs/hanjin.png" alt="한진 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/baebaebaeh">배한진</a> 🐼
      </td>
      <td align="center">
        <img src="/docs/seungho.png" alt="승호 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/YooSeungHo0124">유승호</a> 🦁
      </td>
      <td align="center">
        <img src="/docs/dayoung.png" alt="다영 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/solveDayLee">이다영</a> 🦄
      </td>
    </tr>
    <tr>
      <td align="center">
        <div>판다처럼 차분한 AI 개발자</div>
      </td>
      <td align="center">
        <div>사자처럼 당당한 AI 개발자</div>
      </td>
      <td align="center">
        <div>유니콘처럼 특별한 인프라 엔지니어 및 풀스택 개발자</div>
      </td>
    </tr>
    <tr>
      <td align="center">
        <ul>
          <li>👁️ 세심한 코드 리뷰 능력</li>
          <li>😎 맡은 일을 책임감 있게 해냅니다</li>
          <li>🧠 논리적인 사고와 체계적인 접근</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>🌱 지속적인 학습과 성장</li>
          <li>⚡ 빠른 적응력과 실행력</li>
          <li>🤝 원활한 소통과 협업 능력</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>🌱 지속적인 학습과 성장</li>
          <li>⚡ 빠른 적응력과 실행력</li>
          <li>🤝 원활한 소통과 협업 능력</li>
        </ul>
      </td>
    </tr>
  </table>
</div>


# 📋 Git 브랜치 전략

## 🌳 브랜치 구조
```
master
  └── develop
       ├── frontend-dev
       │    └── fe/[타입]/[작업명]
       └── backend-dev
            └── be/[타입]/[작업명]
```

## 📝 브랜치 명명 규칙
**형식**: `[팀]/[타입]/[작업명]`

### 🏷️ 타입
- `feature`: 새로운 기능 개발
- `style`: UI/UX 변경
- `bug`: 에러 해결  
- `refactoring`: 코드 수정

**예시**: `fe/feature/user-login`, `be/bug/api-fix`

## 💬 커밋 메시지 규칙
**형식**: `[타입]: 작업 내용`

### 🏷️ 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `style`: UI/UX 변경
- `refactor`: 코드 리팩토링
- `hotfix`: 긴급 수정
- `docs`: 문서 수정
- `chore`: 기타 작업

**예시**: `feat: 로그인 기능 구현`, `fix: 회원가입 오류 수정`

## 🔄 작업 흐름
1. `develop`에서 브랜치 생성
2. 작업 완료 후 PR 생성
3. 코드 리뷰 후 병합
4. 브랜치 삭제

## ⚠️ 주요 규칙
- `master`, `develop` 직접 push 금지 (긴급시 예외)
- PR을 통한 코드 리뷰 필수
- 하나의 브랜치에서 하나의 작업만
