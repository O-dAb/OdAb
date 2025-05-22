
# 수학 학습 AI 서비스

## 1. 프로젝트 개요

### 📋 서비스 개요
- 단계별 풀이를 통해 논리적인 추론과정을 배울 수 있는 수학 학습 AI
- 프로젝트 기간: 2025/04/14 ~ 2025/05/22 (총 40일간)

### 💰 서비스 특징
1. 수학 문제 이미지 인식 및 분석
2. 단계별 상세한 해설 제공
3. 유사 문제 추천 및 학습
4. 문제 수정 및 커스터마이징 기능

### ��팀원 정보 및 업무 분담 내역

| 이름           | 역할 및 구현 기능                    |
| -------------- | ------------------------------------ |
| 🟥이동영(팀장) | **FullStack**<br>- 프론트엔드 아키텍처 설계<br>- 문제 업로더 컴포넌트 개발<br>- AI 연동 인터페이스 구현 |
| 🟧진종수(팀원) | **Backend**<br>- AI 모델 서버 구축<br>- 문제 분석 API 개발<br>- 데이터베이스 설계 |
| 🟩함동건(팀원) | **Backend**<br>- 사용자 인증 시스템<br>- 문제 관리 API<br>- 성능 최적화 |
| 🟦배한진(팀원) | **FullStack**<br>- UI/UX 디자인<br>- 반응형 레이아웃<br>- 상태 관리 구현 |
| 🟥유승호(팀원) | **FullStack**<br>- 문제 풀이 인터페이스<br>- 해설 표시 컴포넌트<br>- 성능 모니터링 |
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

[아키텍처 설계도 이미지]

### 💾데이터베이스 모델링(ERD)

[ERD 이미지]

### 📝기능명세서

[Notion 링크]

### 📄API명세서

[Notion 링크]

### 🗂️프로젝트 폴더 구조

**Frontend** - Next.js + TypeScript

```text
client/
├── app/                    # Next.js 14 App Router
│   ├── login/             # 로그인 페이지
│   ├── problem-uploader/  # 문제 업로드 페이지
│   ├── landing/           # 랜딩 페이지
│   ├── signup/            # 회원가입 페이지
│   ├── profile/           # 프로필 페이지
│   ├── context/           # Context API
│   ├── layout.tsx         # 레이아웃 컴포넌트
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   ├── Header.tsx        # 헤더 컴포넌트
│   └── Footer.tsx        # 푸터 컴포넌트
├── lib/                  # 유틸리티 함수
├── public/              # 정적 파일
├── styles/              # 전역 스타일
└── hooks/               # 커스텀 훅
```

**Backend** - Spring Boot

```text
server/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── mathai/
│   │   │           ├── global/          # 전역 설정
│   │   │           ├── domain/          # 도메인 모델
│   │   │           │   ├── problem/     # 문제 관련
│   │   │           │   ├── user/        # 사용자 관련
│   │   │           │   └── solution/    # 해설 관련
│   │   │           └── api/             # API 엔드포인트
│   │   └── resources/
│   └── test/
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
        <img src="/docs/dongyoung.jpg" alt="동영 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/dongschiken">이동영</a> 🦫
      </td>
      <td align="center">
        <img src="/docs/jongsu.jpg" alt="종수 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/doros508">진종수</a> 🦊
      </td>
      <td align="center">
        <img src="/docs/donggun.jpg" alt="동건 프로필 이미지" width="200px" height="150px">
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
        <img src="/docs/hanjin.jpg" alt="한진 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/baebaebaeh">배한진</a> 🐼
      </td>
      <td align="center">
        <img src="/docs/seungho.jpg" alt="승호 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/seungho-dev">유승호</a> 🦁
      </td>
      <td align="center">
        <img src="/docs/dayoung.jpg" alt="다영 프로필 이미지" width="200px" height="150px">
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


# Git 브랜치 전략 가이드

## 브랜치 구조

```
master
  └── develop
       ├── front
       │    └── fe/feature/19-login
       └── back
            └── be/feature/18-login
```

## 브랜치 명명 규칙

브랜치 이름은 작업 타입과 내용을 명확히 표현해야 합니다:

- `[팀]/[타입]/[이슈번호]-[작업명]`
  - 예: `fe/feature/19-login`, `be/fix/32-signup-validation`

### 브랜치 타입
- `feature`: 새로운 기능 개발
- `fix`: 버그 수정
- `style`: UI/UX 변경
- `refactor`: 코드 리팩토링
- `docs`: 문서 작업
- `hotfix`: develop 브랜치에서 발생한 긴급 버그 수정

## 작업 흐름

1. **브랜치 생성 전 확인**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b [브랜치명]
   ```

2. **작업 및 커밋**
   - 규칙에 맞는 커밋 메시지 작성
   - 작은 단위로 자주 커밋하기

3. **원격 저장소와 동기화**
   ```bash
   git pull origin develop
   # 충돌 발생 시
   git stash push
   git pull origin develop
   git stash apply
   ```

4. **Pull Request 및 Merge**
   - 작업 완료 후 PR 생성
   - 코드 리뷰 후 승인받은 PR만 merge
   - merge 후 해당 브랜치는 삭제

## 커밋 메시지 규칙

```
[타입] 제목

본문

- 타입: feat, fix, docs, style, refactor, test, chore
- 제목: 50자 이내로 작성
- 본문: 선택사항, 변경사항 상세 설명
```

## 주의사항

1. **브랜치 확인**
   - 작업 시작 전 현재 브랜치 확인
   - 다른 브랜치 작업 내용과 충돌 확인

2. **Merge 정책**
   - feature, fix, style 브랜치는 merge 후 삭제
   - master, develop, front, back 브랜치는 유지

3. **Master 브랜치 보호**
   - master 브랜치는 PR을 통해서만 코드 반영
   - develop 브랜치에서 충분한 테스트 진행 후 merge



